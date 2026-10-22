import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizOption } from '../../types/academy';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, RotateCcw, Check, Sparkles } from 'lucide-react';

interface QuizChallengeProps {
  quizzes: QuizQuestion[];
  savedAnswers: Record<string, string>;
  onAnswerQuestion: (questionId: string, optionId: string, isCorrect: boolean) => void;
  onNextLesson: () => void;
  onRetryLesson: () => void;
  isLastLesson: boolean;
}

export const QuizChallenge: React.FC<QuizChallengeProps> = ({
  quizzes,
  savedAnswers,
  onAnswerQuestion,
  onNextLesson,
  onRetryLesson,
  isLastLesson,
}) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);

  // Sync to first unanswered question if any
  useEffect(() => {
    const firstUnanswered = quizzes.findIndex((q) => !savedAnswers[q.id]);
    if (firstUnanswered !== -1) {
      setActiveQuestionIdx(firstUnanswered);
    } else {
      setActiveQuestionIdx(0);
    }
  }, [quizzes]);

  const currentQuiz = quizzes[activeQuestionIdx] || quizzes[0];
  const selectedOptionId = savedAnswers[currentQuiz.id];
  const selectedOption = currentQuiz.options.find((o) => o.id === selectedOptionId);
  const isCurrentAnswered = !!selectedOptionId;
  const isCurrentCorrect = selectedOption?.isCorrect ?? false;

  const answeredCount = quizzes.filter((q) => !!savedAnswers[q.id]).length;
  const correctCount = quizzes.filter((q) => {
    const selectedId = savedAnswers[q.id];
    return q.options.find((o) => o.id === selectedId)?.isCorrect;
  }).length;
  const isAllAnswered = answeredCount === quizzes.length;
  const isAllCorrect = correctCount === quizzes.length;

  const handleSelectOption = (opt: QuizOption) => {
    if (isCurrentAnswered && isCurrentCorrect) return;
    onAnswerQuestion(currentQuiz.id, opt.id, opt.isCorrect);
  };

  const getTierInfo = (type: QuizQuestion['type']) => {
    switch (type) {
      case 'concept':
        return { label: 'Tầng 1: Khái Niệm Cốt Lõi', color: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20' };
      case 'scenario':
        return { label: 'Tầng 2: Bài Toán Thực Tế', color: 'text-amber-300 bg-amber-500/10 border-amber-500/20' };
      case 'pitfall':
        return { label: 'Tầng 3: Cạm Bẫy Kiến Trúc', color: 'text-rose-300 bg-rose-500/10 border-rose-500/20' };
      default:
        return { label: 'Thử Thách', color: 'text-zinc-400 bg-white/[0.04] border-white/[0.08]' };
    }
  };

  const tier = getTierInfo(currentQuiz.type);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* 1. Challenge Header & Stepper */}
      <div className="space-y-3 pb-2 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
              Thử Thách 3 Tầng Thực Chiến
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <span>{correctCount}/{quizzes.length}</span>
            <span>⭐</span>
          </div>
        </div>

        {/* Linear Stepper Bars */}
        <div className="grid grid-cols-3 gap-2">
          {quizzes.map((q, idx) => {
            const isAnswered = !!savedAnswers[q.id];
            const isCorrect = q.options.find((o) => o.id === savedAnswers[q.id])?.isCorrect;
            const isActive = activeQuestionIdx === idx;

            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIdx(idx)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between cursor-pointer active:scale-95 ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-600/20 text-white font-bold shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : isAnswered
                    ? isCorrect
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-medium'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-300 font-medium'
                    : 'border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>Câu {idx + 1}</span>
                <span>
                  {isAnswered ? (
                    isCorrect ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-rose-400 font-bold">✗</span>
                    )
                  ) : (
                    <span className="text-zinc-600">•</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Current Question Tier & Statement */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-semibold ${tier.color}`}>
            {tier.label}
          </span>
          <span className="text-zinc-500 font-mono text-[11px]">
            {currentQuiz.label}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] shadow-sm">
          <p
            className="text-xs sm:text-sm font-semibold text-white leading-relaxed font-sans"
            style={{ textWrap: 'pretty' }}
          >
            {currentQuiz.question}
          </p>
        </div>
      </div>

      {/* 3. Interactive Option Cards */}
      <div className="space-y-2 flex-1">
        {currentQuiz.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isThisCorrect = opt.isCorrect;

          let cardStyle =
            'border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:border-white/[0.18] hover:bg-white/[0.05]';

          if (isCurrentAnswered) {
            if (isSelected) {
              cardStyle = isCurrentCorrect
                ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-sm ring-1 ring-emerald-500/50'
                : 'border-rose-500 bg-rose-500/15 text-white shadow-sm ring-1 ring-rose-500/50';
            } else if (isThisCorrect) {
              cardStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt)}
              disabled={isCurrentAnswered && isCurrentCorrect}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all text-xs font-sans flex items-start gap-3 cursor-pointer active:scale-[0.99] min-h-[48px] ${cardStyle}`}
            >
              <span
                className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-mono font-bold text-xs border transition-colors ${
                  isSelected
                    ? isCurrentCorrect
                      ? 'border-emerald-400 bg-emerald-600 text-white'
                      : 'border-rose-400 bg-rose-600 text-white'
                    : 'border-white/[0.12] bg-white/[0.04] text-zinc-400'
                }`}
              >
                {opt.id}
              </span>

              <div className="flex-1 leading-relaxed pt-0.5 font-sans text-xs sm:text-[13px]">
                {opt.text}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Instant In-Depth Feedback Box */}
      {isCurrentAnswered && selectedOption && (
        <div
          className={`p-4 rounded-xl border text-xs font-sans space-y-2.5 animate-in fade-in duration-150 ${
            isCurrentCorrect
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
              : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 font-mono font-bold text-xs">
            {isCurrentCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-300">CHÍNH XÁC! (+1 ⭐ KỸ THUẬT)</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-rose-300">CHƯA CHÍNH XÁC</span>
              </>
            )}
          </div>

          <p className="text-zinc-200 text-xs sm:text-[13px] leading-relaxed font-sans" style={{ textWrap: 'pretty' }}>
            {selectedOption.explanation}
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
            {!isCurrentCorrect ? (
              <button
                onClick={() => {
                  onAnswerQuestion(currentQuiz.id, '', false);
                }}
                className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Thử lại câu này</span>
              </button>
            ) : activeQuestionIdx < quizzes.length - 1 ? (
              <button
                onClick={() => setActiveQuestionIdx((prev) => prev + 1)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ml-auto cursor-pointer active:scale-95 shadow-md shadow-indigo-600/30"
              >
                <span>Câu tiếp theo ({activeQuestionIdx + 2}/3)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 ml-auto">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn tất 3/3 câu hỏi!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Bottom Progression Bar */}
      {isAllAnswered && (
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <button
            onClick={onRetryLesson}
            className="py-2.5 px-3 text-xs font-mono text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại từ đầu</span>
          </button>

          <button
            onClick={onNextLesson}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer ml-auto"
          >
            <span>{isLastLesson ? 'Nhận Chứng Chỉ Tốt Nghiệp' : 'Sang Bài Tiếp Theo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

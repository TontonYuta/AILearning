import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizOption } from '../../types/academy';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, RotateCcw, Award } from 'lucide-react';

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

  // Check how many questions are answered and correct
  const answeredCount = quizzes.filter((q) => !!savedAnswers[q.id]).length;
  const correctCount = quizzes.filter((q) => {
    const selectedId = savedAnswers[q.id];
    return q.options.find((o) => o.id === selectedId)?.isCorrect;
  }).length;
  const isAllAnswered = answeredCount === quizzes.length;

  const handleSelectOption = (opt: QuizOption) => {
    if (isCurrentAnswered && isCurrentCorrect) return; // already solved
    onAnswerQuestion(currentQuiz.id, opt.id, opt.isCorrect);
  };

  const getTypeBadge = (type: QuizQuestion['type']) => {
    switch (type) {
      case 'concept':
        return { label: 'Tầng 1: Khái Niệm', color: 'text-indigo-300 border-indigo-500/40 bg-indigo-600/15' };
      case 'scenario':
        return { label: 'Tầng 2: Tình Huống Kỹ Thuật', color: 'text-amber-300 border-amber-500/40 bg-amber-500/15' };
      case 'pitfall':
        return { label: 'Tầng 3: Cạm Bẫy Thực Chiến', color: 'text-red-300 border-red-500/40 bg-red-500/15' };
      default:
        return { label: 'Quiz', color: 'text-zinc-400 border-white/10 bg-white/5' };
    }
  };

  const badgeInfo = getTypeBadge(currentQuiz.type);

  return (
    <div className="border border-white/10 bg-[#181924] rounded-2xl p-4 sm:p-5 flex flex-col h-full space-y-4 shadow-sm">
      {/* Header with 3-Tier Tab Indicator */}
      <div className="border-b border-white/10 pb-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Thử Thách Đa Tầng (3 Câu)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
            Đúng {correctCount}/{quizzes.length} ⭐
          </span>
        </div>

        {/* 3 Steps Stepper */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
          {quizzes.map((q, idx) => {
            const isAnswered = !!savedAnswers[q.id];
            const isCorrect = q.options.find((o) => o.id === savedAnswers[q.id])?.isCorrect;
            const isActive = activeQuestionIdx === idx;

            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIdx(idx)}
                className={`py-2 px-2 text-xs font-mono rounded-lg border transition-all flex items-center justify-between cursor-pointer active:scale-95 ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-600/25 text-indigo-200 font-bold shadow-sm'
                    : isAnswered
                    ? isCorrect
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-500/50 bg-red-500/10 text-red-300'
                    : 'border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
                }`}
              >
                <span>Câu {idx + 1}</span>
                <span className="font-bold">
                  {isAnswered ? (isCorrect ? '✓' : '✗') : '•'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Type & Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className={`px-2 py-0.5 border rounded text-[10px] font-bold ${badgeInfo.color}`}>
            {badgeInfo.label}
          </span>
          <span className="text-zinc-500 text-[10px]">
            {currentQuiz.label}
          </span>
        </div>

        <div className="p-3.5 bg-[#12131A] border border-white/10 rounded-xl">
          <p
            className="text-xs sm:text-sm font-semibold text-white leading-relaxed font-sans"
            style={{ textWrap: 'pretty' }}
          >
            {currentQuiz.question}
          </p>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-2.5 flex-1">
        {currentQuiz.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isThisCorrect = opt.isCorrect;

          let btnClass =
            'border-white/10 bg-[#12131A] text-zinc-200 hover:border-white/20 hover:bg-[#222334]';

          if (isCurrentAnswered) {
            if (isSelected) {
              btnClass = isCurrentCorrect
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-100 font-semibold'
                : 'border-red-500 bg-red-500/20 text-red-100 font-semibold';
            } else if (isThisCorrect) {
              btnClass = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt)}
              disabled={isCurrentAnswered && isCurrentCorrect}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all text-xs font-sans flex items-start gap-3 cursor-pointer active:scale-[0.99] min-h-[48px] ${btnClass}`}
            >
              <span
                className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-mono font-bold text-xs border transition-colors ${
                  isSelected
                    ? isCurrentCorrect
                      ? 'border-emerald-400 bg-emerald-600 text-white'
                      : 'border-red-400 bg-red-600 text-white'
                    : 'border-white/15 bg-white/5 text-zinc-300'
                }`}
              >
                {opt.id}
              </span>

              <div className="flex-1 leading-relaxed pt-0.5 font-sans">
                <span>{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Immediate In-Depth Feedback & Explanation */}
      {isCurrentAnswered && selectedOption && (
        <div
          className={`p-4 rounded-xl border text-xs font-sans space-y-2.5 animate-in fade-in duration-200 ${
            isCurrentCorrect
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
              : 'border-red-500/40 bg-red-500/10 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2 font-mono font-bold text-xs">
            {isCurrentCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>CHÍNH XÁC! (+1 ⭐ KỸ THUẬT THỰC CHIẾN)</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>CHƯA CHÍNH XÁC - HÃY PHÂN TÍCH LẠI:</span>
              </>
            )}
          </div>

          <p className="text-zinc-200 text-xs sm:text-[13px] leading-relaxed" style={{ textWrap: 'pretty' }}>
            {selectedOption.explanation}
          </p>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            {!isCurrentCorrect ? (
              <button
                onClick={() => {
                  onAnswerQuestion(currentQuiz.id, '', false);
                }}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white font-mono text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chọn lại đáp án</span>
              </button>
            ) : activeQuestionIdx < quizzes.length - 1 ? (
              <button
                onClick={() => setActiveQuestionIdx((prev) => prev + 1)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ml-auto cursor-pointer active:scale-95 shadow-sm"
              >
                <span>Câu tiếp theo ({activeQuestionIdx + 2}/3)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 ml-auto">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã giải quyết trọn vẹn cả 3 câu!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Banner at bottom when all 3 questions answered */}
      {isAllAnswered && (
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onRetryLesson}
            className="py-2.5 px-3 text-xs font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại bài này</span>
          </button>

          <button
            onClick={onNextLesson}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer ml-auto"
          >
            <span>{isLastLesson ? 'Xem Chứng Nhận Tốt Nghiệp' : 'Chuyển Sang Bài Kế Tiếp'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

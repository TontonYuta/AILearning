import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizOption } from '../../types/academy';
import { CheckCircle2, XCircle, ArrowRight, Award, HelpCircle, AlertTriangle, Layers, RotateCcw } from 'lucide-react';

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
        return { label: 'Tầng 1: Khái Niệm', color: 'text-blue-400 border-blue-900 bg-blue-950/40' };
      case 'scenario':
        return { label: 'Tầng 2: Tình Huống Kỹ Thuật', color: 'text-amber-400 border-amber-900 bg-amber-950/40' };
      case 'pitfall':
        return { label: 'Tầng 3: Cạm Bẫy Thực Chiến', color: 'text-red-400 border-red-900 bg-red-950/40' };
      default:
        return { label: 'Quiz', color: 'text-neutral-400 border-neutral-800 bg-neutral-900' };
    }
  };

  const badgeInfo = getTypeBadge(currentQuiz.type);

  return (
    <div className="border border-neutral-800 bg-[#121215] p-5 flex flex-col h-full space-y-4">
      {/* Header with 3-Tier Tab Indicator */}
      <div className="border-b border-neutral-800 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 font-mono">
              Thử Thách Đa Tầng (3 Câu Hỏi)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Đúng {correctCount}/{quizzes.length} ⭐
          </span>
        </div>

        {/* 3 Steps Stepper */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {quizzes.map((q, idx) => {
            const isAnswered = !!savedAnswers[q.id];
            const isCorrect = q.options.find((o) => o.id === savedAnswers[q.id])?.isCorrect;
            const isActive = activeQuestionIdx === idx;

            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIdx(idx)}
                className={`py-1.5 px-2 text-[11px] font-mono border transition-all flex items-center justify-between ${
                  isActive
                    ? 'border-blue-500 bg-blue-950/40 text-blue-200 font-bold'
                    : isAnswered
                    ? isCorrect
                      ? 'border-emerald-800 bg-emerald-950/20 text-emerald-300'
                      : 'border-red-900 bg-red-950/20 text-red-300'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <span>Câu {idx + 1}</span>
                <span>
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
          <span className={`px-2 py-0.5 border text-[10px] font-bold ${badgeInfo.color}`}>
            {badgeInfo.label}
          </span>
          <span className="text-neutral-500 text-[10px]">
            {currentQuiz.label}
          </span>
        </div>

        <div className="p-3 bg-[#09090b] border border-neutral-800">
          <p className="text-xs md:text-sm font-semibold text-neutral-100 leading-relaxed font-sans">
            {currentQuiz.question}
          </p>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-2 flex-1">
        {currentQuiz.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isThisCorrect = opt.isCorrect;

          let btnClass =
            'border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/80';

          if (isCurrentAnswered) {
            if (isSelected) {
              btnClass = isCurrentCorrect
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-100 font-semibold'
                : 'border-red-500 bg-red-950/40 text-red-100 font-semibold';
            } else if (isThisCorrect) {
              btnClass = 'border-emerald-600/60 bg-emerald-950/20 text-emerald-300';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt)}
              disabled={isCurrentAnswered && isCurrentCorrect}
              className={`w-full text-left p-3 border transition-all text-xs font-sans flex items-start gap-3 ${btnClass}`}
            >
              <span
                className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono font-bold text-xs border ${
                  isSelected
                    ? isCurrentCorrect
                      ? 'border-emerald-400 bg-emerald-900 text-white'
                      : 'border-red-400 bg-red-900 text-white'
                    : 'border-neutral-700 bg-neutral-800 text-neutral-300'
                }`}
              >
                {opt.id}
              </span>

              <div className="flex-1 leading-snug pt-0.5">
                <span>{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Immediate In-Depth Feedback & Explanation */}
      {isCurrentAnswered && selectedOption && (
        <div
          className={`p-3.5 border text-xs font-sans space-y-2 ${
            isCurrentCorrect
              ? 'border-emerald-800/80 bg-emerald-950/30 text-emerald-200'
              : 'border-red-800/80 bg-red-950/30 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2 font-mono font-bold text-xs">
            {isCurrentCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>CHÍNH XÁC! (+1 ⭐ KỸ THUẬT THỰC CHIẾN)</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-400" />
                <span>CHƯA CHÍNH XÁC - HÃY PHÂN TÍCH LẠI:</span>
              </>
            )}
          </div>

          <p className="text-neutral-300 text-xs leading-relaxed">
            {selectedOption.explanation}
          </p>

          {/* Stepper or Next Action */}
          <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80">
            {!isCurrentCorrect ? (
              <button
                onClick={() => {
                  onAnswerQuestion(currentQuiz.id, '', false);
                }}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                Chọn lại đáp án
              </button>
            ) : activeQuestionIdx < quizzes.length - 1 ? (
              <button
                onClick={() => setActiveQuestionIdx((prev) => prev + 1)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Sang câu {activeQuestionIdx + 2}/3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Completion Banner for this Lesson */}
      {isAllAnswered && (
        <div className="p-3 border border-emerald-800/80 bg-emerald-950/20 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              ĐÃ HOÀN THÀNH CẢ 3 TẦNG QUIZ!
            </span>
            <span>{correctCount}/3 ⭐</span>
          </div>

          <button
            onClick={onNextLesson}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            {isLastLesson ? (
              <>
                <Award className="w-4 h-4" />
                TỐT NGHIỆP KHÓA HỌC 🎉
              </>
            ) : (
              <>
                <span>MỞ KHÓA & SANG BÀI KẾ TIẾP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

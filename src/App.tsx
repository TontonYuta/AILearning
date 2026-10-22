/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CHAPTERS, LESSONS } from './data/chaptersAndLessons';
import { UserProgress } from './types/academy';
import { AcademyHeader } from './components/academy/AcademyHeader';
import { LessonView } from './components/academy/LessonView';
import { QuizChallenge } from './components/academy/QuizChallenge';
import { CompletionModal } from './components/academy/CompletionModal';
import { Check, BookOpen, HelpCircle, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

const STORAGE_KEY = 'ai_eng_academy_v2_progress';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      currentLessonId: 1,
      completedLessons: [],
      quizAnswers: {},
      score: 0,
    };
  });

  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'lesson' | 'quiz'>('lesson');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const currentLesson =
    LESSONS.find((l) => l.id === progress.currentLessonId) || LESSONS[0];

  const currentChapter =
    CHAPTERS.find((c) => c.id === currentLesson.chapterId) || CHAPTERS[0];

  const currentLessonAnswers = progress.quizAnswers[currentLesson.id] || {};

  // Count answered questions in current lesson
  const currentAnsweredCount = currentLesson.quizzes.filter(
    (q) => !!currentLessonAnswers[q.id]
  ).length;

  // Handle answering an individual question in the 3-tier challenge
  const handleAnswerQuestion = (questionId: string, optionId: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const lessonAnswers = { ...(prev.quizAnswers[currentLesson.id] || {}) };
      const previousSelected = lessonAnswers[questionId];

      const question = currentLesson.quizzes.find((q) => q.id === questionId);
      const wasPreviouslyCorrect =
        question?.options.find((o) => o.id === previousSelected)?.isCorrect || false;

      if (!optionId) {
        // Clearing selection on retry for this question
        delete lessonAnswers[questionId];
        const scoreDelta = wasPreviouslyCorrect ? -1 : 0;
        return {
          ...prev,
          score: Math.max(0, prev.score + scoreDelta),
          quizAnswers: {
            ...prev.quizAnswers,
            [currentLesson.id]: lessonAnswers,
          },
        };
      }

      lessonAnswers[questionId] = optionId;

      let scoreDelta = 0;
      if (isCorrect && !wasPreviouslyCorrect) {
        scoreDelta = 1;
      } else if (!isCorrect && wasPreviouslyCorrect) {
        scoreDelta = -1;
      }

      // Check if all questions in this lesson are answered correctly
      const allCorrect = currentLesson.quizzes.every((q) => {
        const chosenId = q.id === questionId ? optionId : lessonAnswers[q.id];
        return q.options.find((o) => o.id === chosenId)?.isCorrect;
      });

      const completedSet = new Set(prev.completedLessons);
      if (allCorrect) {
        completedSet.add(currentLesson.id);
      }

      return {
        ...prev,
        score: Math.max(0, prev.score + scoreDelta),
        completedLessons: Array.from(completedSet),
        quizAnswers: {
          ...prev.quizAnswers,
          [currentLesson.id]: lessonAnswers,
        },
      };
    });

    if (isCorrect && currentLesson.id === LESSONS.length) {
      setTimeout(() => {
        const answers = progress.quizAnswers[currentLesson.id] || {};
        const allCorrect = currentLesson.quizzes.every((q) => {
          const chosenId = q.id === questionId ? optionId : answers[q.id];
          return q.options.find((o) => o.id === chosenId)?.isCorrect;
        });
        if (allCorrect) {
          setShowCompletionModal(true);
        }
      }, 500);
    }
  };

  const handleRetryLesson = () => {
    setProgress((prev) => {
      const newAnswers = { ...prev.quizAnswers };
      delete newAnswers[currentLesson.id];
      const completedSet = new Set(prev.completedLessons);
      completedSet.delete(currentLesson.id);

      // Recalculate score from scratch across all remaining lessons
      let newScore = 0;
      LESSONS.forEach((les) => {
        const lesAns = les.id === currentLesson.id ? {} : newAnswers[les.id] || {};
        les.quizzes.forEach((q) => {
          const opt = lesAns[q.id];
          if (q.options.find((o) => o.id === opt)?.isCorrect) {
            newScore++;
          }
        });
      });

      return {
        ...prev,
        score: newScore,
        completedLessons: Array.from(completedSet),
        quizAnswers: newAnswers,
      };
    });
  };

  const handleNextLesson = () => {
    if (progress.currentLessonId < LESSONS.length) {
      setProgress((prev) => ({
        ...prev,
        currentLessonId: prev.currentLessonId + 1,
      }));
      // On mobile, start with lesson view on next lesson
      setMobileTab('lesson');
    } else {
      setShowCompletionModal(true);
    }
  };

  const handlePrevLesson = () => {
    if (progress.currentLessonId > 1) {
      setProgress((prev) => ({
        ...prev,
        currentLessonId: prev.currentLessonId - 1,
      }));
      setMobileTab('lesson');
    }
  };

  const handleSelectLesson = (id: number) => {
    setProgress((prev) => ({
      ...prev,
      currentLessonId: id,
    }));
    setMobileTab('lesson');
  };

  const handleSelectChapter = (chapterId: number) => {
    const chapter = CHAPTERS.find((c) => c.id === chapterId);
    if (chapter && chapter.lessonIds.length > 0) {
      setProgress((prev) => ({
        ...prev,
        currentLessonId: chapter.lessonIds[0],
      }));
      setMobileTab('lesson');
    }
  };

  const handleResetProgress = () => {
    const resetState: UserProgress = {
      currentLessonId: 1,
      completedLessons: [],
      quizAnswers: {},
      score: 0,
    };
    setProgress(resetState);
    localStorage.removeItem(STORAGE_KEY);
    setMobileTab('lesson');
  };

  // Lessons belonging to current chapter
  const currentChapterLessons = LESSONS.filter(
    (l) => l.chapterId === currentChapter.id
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#090A10] text-[#F8FAFC] ambient-mesh">
      {/* 1. Top Header */}
      <AcademyHeader
        currentLessonId={progress.currentLessonId}
        totalLessons={LESSONS.length}
        score={progress.score}
        chapters={CHAPTERS}
        currentChapterId={currentChapter.id}
        onPrev={handlePrevLesson}
        onNext={handleNextLesson}
        onSelectChapter={handleSelectChapter}
        onResetProgress={handleResetProgress}
      />

      {/* 2. Chapter Sub-Nav Strip */}
      <nav className="h-11 border-b border-white/[0.06] bg-[#090A10]/70 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between shrink-0 select-none overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase shrink-0">
            {currentChapter.shortTitle}:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {currentChapterLessons.map((l) => {
              const isActive = l.id === progress.currentLessonId;
              const isDone = progress.completedLessons.includes(l.id);

              return (
                <button
                  key={l.id}
                  onClick={() => handleSelectLesson(l.id)}
                  className={`h-7 px-3 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 border whitespace-nowrap cursor-pointer active:scale-95 ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-600/25 text-white font-bold shadow-sm shadow-indigo-500/20'
                      : isDone
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500/50'
                      : 'border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span>Bài {l.lessonNumber}</span>
                  <span className="truncate max-w-[120px] hidden md:inline">
                    · {l.title.split(' ')[0]}
                  </span>
                  {isDone && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Progress Indicator */}
        <div className="text-[11px] font-mono text-zinc-500 hidden sm:block shrink-0 pl-4">
          Tổng cộng: 24 bài • 8 chuyên đề
        </div>
      </nav>

      {/* 3. Mobile Segmented Tab Control (< lg) */}
      <div className="lg:hidden flex items-center border-b border-white/[0.06] bg-[#0E101A] p-1.5 shrink-0 gap-1.5">
        <button
          onClick={() => setMobileTab('lesson')}
          className={`flex-1 py-2 px-3 text-xs font-mono font-semibold flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer ${
            mobileTab === 'lesson'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Bài Học & Trực Quan</span>
        </button>
        <button
          onClick={() => setMobileTab('quiz')}
          className={`flex-1 py-2 px-3 text-xs font-mono font-semibold flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer ${
            mobileTab === 'quiz'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>Thử Thách Quiz</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-black/40 rounded-full font-mono text-zinc-300">
            {currentAnsweredCount}/3
          </span>
        </button>
      </div>

      {/* 4. Main Split-Pane Workspace */}
      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
        {/* Left Column: Lesson Content + Micro-Visualizer */}
        <section
          className={`flex-1 lg:w-7/12 h-full overflow-y-auto p-4 sm:p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/[0.06] ${
            mobileTab === 'lesson' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="max-w-2xl mx-auto pb-20 lg:pb-8">
            <LessonView
              lesson={currentLesson}
              onGoToNext={() => setMobileTab('quiz')}
            />
          </div>
        </section>

        {/* Right Column: Interactive Quiz Challenge */}
        <section
          className={`flex-1 lg:w-5/12 h-full overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#0D0F18]/70 backdrop-blur-md ${
            mobileTab === 'quiz' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="max-w-xl mx-auto h-full flex flex-col justify-start pb-20 lg:pb-8">
            <QuizChallenge
              quizzes={currentLesson.quizzes}
              savedAnswers={currentLessonAnswers}
              onAnswerQuestion={handleAnswerQuestion}
              onNextLesson={handleNextLesson}
              onRetryLesson={handleRetryLesson}
              isLastLesson={progress.currentLessonId === LESSONS.length}
            />
          </div>
        </section>

        {/* Mobile Floating Bottom Bar for Thumb Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#0E101A]/95 backdrop-blur-xl border-t border-white/[0.08] px-3.5 py-2.5 flex items-center justify-between pb-safe shadow-2xl">
          <button
            onClick={handlePrevLesson}
            disabled={progress.currentLessonId <= 1}
            className="h-9 px-3 text-xs font-mono text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] rounded-xl flex items-center gap-1.5 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trước</span>
          </button>

          <button
            onClick={() => setMobileTab(mobileTab === 'lesson' ? 'quiz' : 'lesson')}
            className="h-9 px-3.5 text-xs font-mono font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md shadow-indigo-600/30"
          >
            {mobileTab === 'lesson' ? (
              <>
                <span>Làm Quiz</span>
                <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem Bài Học</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextLesson}
            disabled={progress.currentLessonId >= LESSONS.length}
            className="h-9 px-3 text-xs font-mono text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] rounded-xl flex items-center gap-1.5 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* 5. Graduation / Completion Modal */}
      <CompletionModal
        isOpen={showCompletionModal}
        score={progress.score}
        total={LESSONS.length * 3}
        onClose={() => setShowCompletionModal(false)}
        onRestart={() => {
          setShowCompletionModal(false);
          setProgress({
            currentLessonId: 1,
            completedLessons: [],
            quizAnswers: {},
            score: 0,
          });
          setMobileTab('lesson');
        }}
      />
    </div>
  );
}

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
import { Check } from 'lucide-react';

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

      // Check if all 3 questions in this lesson are answered correctly
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
    }
  };

  const handleSelectLesson = (id: number) => {
    setProgress((prev) => ({
      ...prev,
      currentLessonId: id,
    }));
  };

  const handleSelectChapter = (chapterId: number) => {
    const chapter = CHAPTERS.find((c) => c.id === chapterId);
    if (chapter && chapter.lessonIds.length > 0) {
      setProgress((prev) => ({
        ...prev,
        currentLessonId: chapter.lessonIds[0],
      }));
    }
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ 24 bài học và điểm số?'
      )
    ) {
      const resetState: UserProgress = {
        currentLessonId: 1,
        completedLessons: [],
        quizAnswers: {},
        score: 0,
      };
      setProgress(resetState);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Lessons belonging to current chapter
  const currentChapterLessons = LESSONS.filter(
    (l) => l.chapterId === currentChapter.id
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#09090b] text-[#f4f4f5]">
      {/* 1. Fixed Top Header */}
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
      <nav className="h-10 border-b border-neutral-800 bg-[#0e0e11] px-4 flex items-center justify-between overflow-x-auto shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase shrink-0">
            {currentChapter.shortTitle}:
          </span>
          <div className="flex items-center gap-1.5">
            {currentChapterLessons.map((l) => {
              const isActive = l.id === progress.currentLessonId;
              const isDone = progress.completedLessons.includes(l.id);

              return (
                <button
                  key={l.id}
                  onClick={() => handleSelectLesson(l.id)}
                  className={`h-7 px-2.5 text-xs font-mono transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    isActive
                      ? 'border-blue-500 bg-blue-950/40 text-blue-200 font-bold'
                      : isDone
                      ? 'border-neutral-800 bg-neutral-900/60 text-emerald-400 hover:border-neutral-700'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
                  }`}
                >
                  <span>Bài {l.lessonNumber}</span>
                  <span className="truncate max-w-[130px] hidden md:inline">
                    · {l.title.split(' ')[0]}
                  </span>
                  {isDone && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Progress Indicator */}
        <div className="text-[11px] font-mono text-neutral-500 hidden sm:block shrink-0 pl-4">
          Tổng cộng: 24 bài • 8 chuyên đề khoa học
        </div>
      </nav>

      {/* 3. Main Split-Pane Workspace */}
      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Column: Lesson Content + Focused Micro-Visualizer */}
        <section className="flex-1 lg:w-7/12 h-full overflow-y-auto p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-neutral-800">
          <div className="max-w-2xl mx-auto">
            <LessonView lesson={currentLesson} />
          </div>
        </section>

        {/* Right Column: Interactive Quiz Challenge */}
        <section className="flex-1 lg:w-5/12 h-full overflow-y-auto p-4 md:p-6 bg-[#0c0c0e]">
          <div className="max-w-xl mx-auto h-full flex flex-col justify-start">
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
      </main>

      {/* 4. Graduation / Completion Modal */}
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
        }}
      />
    </div>
  );
}

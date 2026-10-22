import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, ChevronDown, BookOpen } from 'lucide-react';
import { Chapter } from '../../types/academy';

interface AcademyHeaderProps {
  currentLessonId: number;
  totalLessons: number;
  score: number;
  chapters: Chapter[];
  currentChapterId: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectChapter: (chapterId: number) => void;
  onResetProgress: () => void;
}

export const AcademyHeader: React.FC<AcademyHeaderProps> = ({
  currentLessonId,
  totalLessons,
  score,
  chapters,
  currentChapterId,
  onPrev,
  onNext,
  onSelectChapter,
  onResetProgress,
}) => {
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const progressPercent = Math.round((currentLessonId / totalLessons) * 100);
  const currentChapter = chapters.find((c) => c.id === currentChapterId) || chapters[0];

  return (
    <header className="h-14 border-b border-neutral-800 bg-[#09090b] px-3 md:px-5 flex items-center justify-between shrink-0 select-none z-30">
      {/* Zone 1: Logo & Chapter Selector */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="w-6 h-6 bg-blue-600 text-white font-mono font-black text-xs flex items-center justify-center">
          AI
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xs md:text-sm font-bold tracking-tight text-neutral-100 font-mono">
            AI Eng Academy
          </h1>
          <p className="text-[10px] text-neutral-400">
            Kỹ Nghệ AI Thực Chiến
          </p>
        </div>

        {/* Chapter Dropdown Picker */}
        <div className="relative ml-1 md:ml-3">
          <button
            onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
            className="h-8 px-2.5 text-xs font-mono text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center gap-2 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="max-w-[130px] md:max-w-[180px] truncate">
              {currentChapter.shortTitle}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {isChapterDropdownOpen && (
            <div className="absolute top-9 left-0 w-72 bg-[#121215] border border-neutral-700 shadow-2xl py-1 z-50 text-xs font-mono">
              <div className="px-3 py-1.5 text-[10px] text-neutral-500 uppercase border-b border-neutral-800">
                Chọn Chuyên Đề (8 Chương):
              </div>
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    onSelectChapter(ch.id);
                    setIsChapterDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between ${
                    ch.id === currentChapterId
                      ? 'bg-blue-950/60 text-blue-200 font-bold border-l-2 border-blue-500'
                      : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  <span className="truncate">{ch.title}</span>
                  <span className="text-[10px] text-neutral-500 shrink-0 ml-2">
                    {ch.lessonIds.length} bài
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Progress & Score */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-sm mx-3">
        {/* Lesson Badge */}
        <div className="text-xs font-mono font-semibold text-neutral-200 shrink-0">
          Bài {currentLessonId} / {totalLessons}
          <span className="text-[10px] text-neutral-500 ml-1 hidden lg:inline">
            • {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 h-1.5 bg-neutral-800 overflow-hidden hidden sm:block">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Score Badge */}
        <div className="text-xs font-mono font-bold text-amber-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 shrink-0" title="Điểm số Quiz thực chiến (3 câu / bài)">
          {score} / {totalLessons * 3} ⭐
        </div>
      </div>

      {/* Zone 3: Navigation Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onPrev}
          disabled={currentLessonId <= 1}
          className="h-8 px-2 md:px-2.5 text-xs font-mono text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Bài trước"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Trước</span>
        </button>

        <button
          onClick={onNext}
          disabled={currentLessonId >= totalLessons}
          className="h-8 px-2 md:px-2.5 text-xs font-mono text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Bài kế tiếp"
        >
          <span className="hidden md:inline">Sau</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onResetProgress}
          className="h-8 w-8 text-neutral-500 hover:text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center justify-center ml-1"
          title="Đặt lại tiến độ học tập"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </header>
  );
};

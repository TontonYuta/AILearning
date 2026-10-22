import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, ChevronDown, BookOpen, Award, Check } from 'lucide-react';
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const progressPercent = Math.round((currentLessonId / totalLessons) * 100);
  const currentChapter = chapters.find((c) => c.id === currentChapterId) || chapters[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsChapterDropdownOpen(false);
      }
    };
    if (isChapterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChapterDropdownOpen]);

  return (
    <>
      <header className="h-14 border-b border-white/10 bg-[#12131A] px-2.5 sm:px-4 flex items-center justify-between shrink-0 select-none z-30 relative">
        {/* Zone 1: Logo & Chapter Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
            AI
          </div>

          <div className="hidden md:block shrink-0">
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white font-sans">
              AI Eng Academy
            </h1>
            <p className="text-[10px] text-zinc-400 font-mono">
              The Visual Lab
            </p>
          </div>

          {/* Chapter Dropdown Picker */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
              className="h-8.5 px-2 sm:px-2.5 text-xs font-mono text-zinc-200 bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              title="Chọn Chuyên Đề"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="max-w-[85px] sm:max-w-[150px] md:max-w-[180px] truncate text-left">
                {currentChapter.shortTitle}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${isChapterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isChapterDropdownOpen && (
              <div className="fixed sm:absolute top-14 left-2 right-2 sm:left-0 sm:right-auto sm:top-10 w-auto sm:w-80 bg-[#181924] border border-white/15 rounded-xl shadow-2xl py-1.5 z-50 text-xs font-mono backdrop-blur-xl">
                <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
                  <span>8 Chuyên Đề Thực Chiến</span>
                  <span className="text-indigo-400">24 Bài Học</span>
                </div>
                <div className="max-h-[60vh] overflow-y-auto py-1">
                  {chapters.map((ch) => {
                    const isCurrent = ch.id === currentChapterId;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          onSelectChapter(ch.id);
                          setIsChapterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-600/15 text-indigo-200 font-bold border-l-2 border-indigo-500'
                            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{ch.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                          {ch.lessonIds.length} bài
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Progress & Score Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 mx-1 sm:mx-3">
          {/* Lesson Counter */}
          <div className="text-xs font-mono font-medium text-zinc-300 shrink-0">
            <span className="hidden xs:inline">Bài </span>
            <span className="text-white font-bold">{currentLessonId}</span>
            <span className="text-zinc-500">/{totalLessons}</span>
          </div>

          {/* Desktop Progress Bar */}
          <div className="w-20 md:w-28 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Score Badge */}
          <div
            className="text-[11px] sm:text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0"
            title="Điểm số Quiz (3 câu / bài)"
          >
            <span>{score}</span>
            <span className="text-amber-400">⭐</span>
          </div>
        </div>

        {/* Zone 3: Navigation Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onPrev}
            disabled={currentLessonId <= 1}
            className="h-8.5 w-8.5 sm:w-auto sm:px-2.5 text-xs font-mono text-zinc-200 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            title="Bài trước"
            aria-label="Bài trước"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Trước</span>
          </button>

          <button
            onClick={onNext}
            disabled={currentLessonId >= totalLessons}
            className="h-8.5 w-8.5 sm:w-auto sm:px-2.5 text-xs font-mono text-zinc-200 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            title="Bài sau"
            aria-label="Bài sau"
          >
            <span className="hidden md:inline">Sau</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="h-8.5 w-8.5 text-zinc-400 hover:text-zinc-100 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-lg transition-all flex items-center justify-center ml-0.5 cursor-pointer"
            title="Đặt lại tiến độ"
            aria-label="Đặt lại tiến độ"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Sleek Undo / Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#181924] border border-white/15 rounded-xl shadow-2xl p-5 space-y-4 text-zinc-200 font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Đặt lại tiến độ học tập?</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed" style={{ textWrap: 'pretty' }}>
              Toàn bộ tiến độ 24 bài học và điểm số Quiz của bạn sẽ được đặt về bài 1. Thao tác này không thể hoàn tác.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2 px-3 text-xs font-mono font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-zinc-300 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetProgress();
                }}
                className="py-2 px-3 text-xs font-mono font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

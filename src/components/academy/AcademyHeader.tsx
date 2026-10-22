import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, ChevronDown, BookOpen, Star, Sparkles, Layers } from 'lucide-react';
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
      <header className="h-14 border-b border-white/[0.08] bg-[#090A10]/90 backdrop-blur-xl px-3 sm:px-5 flex items-center justify-between shrink-0 select-none z-30 relative">
        {/* Left: Branding & Chapter Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-mono font-bold text-xs border border-indigo-400/30">
              AI
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5 font-sans">
                AI Engineering Studio
                <span className="text-[10px] font-mono font-normal text-indigo-400 px-1 py-0.2 bg-indigo-500/10 rounded border border-indigo-500/20">
                  Lab v2
                </span>
              </span>
            </div>
          </div>

          <span className="text-zinc-600 hidden md:inline">/</span>

          {/* Chapter Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
              className="h-8 px-2.5 text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] border border-white/[0.08] hover:border-white/[0.15] rounded-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="max-w-[90px] sm:max-w-[150px] md:max-w-[180px] truncate">
                {currentChapter.shortTitle}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 shrink-0 ${isChapterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isChapterDropdownOpen && (
              <div className="fixed sm:absolute top-14 left-2 right-2 sm:left-0 sm:right-auto sm:top-10 w-auto sm:w-80 bg-[#11131F] border border-white/[0.12] rounded-xl shadow-2xl py-1.5 z-50 text-xs backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-white/[0.06] flex items-center justify-between">
                  <span>8 Chuyên Đề Khoa Học</span>
                  <span className="text-indigo-400 font-mono">24 Bài</span>
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
                        className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-600/15 text-indigo-300 font-semibold border-l-2 border-indigo-500'
                            : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
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

        {/* Center/Right: Progress Track & Score */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 mx-2">
          {/* Progress Pill */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-lg">
            <span>
              Bài <strong className="text-white font-bold">{currentLessonId}</strong>
              <span className="text-zinc-500">/{totalLessons}</span>
            </span>
            <div className="w-14 sm:w-20 h-1.5 bg-white/[0.08] rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-lg shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span>{score}</span>
            <span className="text-zinc-500 font-normal hidden sm:inline">XP</span>
          </div>
        </div>

        {/* Right: Prev, Next, Reset */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onPrev}
            disabled={currentLessonId <= 1}
            className="h-8 w-8 sm:w-auto sm:px-2.5 text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            title="Bài trước"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Trước</span>
          </button>

          <button
            onClick={onNext}
            disabled={currentLessonId >= totalLessons}
            className="h-8 w-8 sm:w-auto sm:px-2.5 text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            title="Bài sau"
          >
            <span className="hidden md:inline">Sau</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="h-8 w-8 text-zinc-500 hover:text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] rounded-lg transition-all flex items-center justify-center ml-0.5 cursor-pointer"
            title="Đặt lại tiến độ"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Modern Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#11131F] border border-white/[0.12] rounded-2xl shadow-2xl p-5 space-y-4 text-zinc-200 font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Đặt lại tiến độ học tập?</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed" style={{ textWrap: 'pretty' }}>
              Toàn bộ tiến độ 24 bài học và điểm số Quiz của bạn sẽ được xóa để học lại từ đầu.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2 px-3 text-xs font-medium bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] rounded-xl text-zinc-300 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetProgress();
                }}
                className="py-2 px-3 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors cursor-pointer shadow-sm shadow-red-600/30"
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

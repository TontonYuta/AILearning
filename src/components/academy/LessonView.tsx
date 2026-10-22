import React from 'react';
import { Lesson } from '../../types/academy';
import {
  BookOpen,
  Lightbulb,
  Code2,
  Sparkles,
  ExternalLink,
  Link as LinkIcon,
  AlertTriangle,
  ArrowRight,
  Terminal,
  HelpCircle,
} from 'lucide-react';
import { VisualizerHub } from '../visualizers/VisualizerHub';

interface LessonViewProps {
  lesson: Lesson;
  onGoToNext?: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onGoToNext }) => {
  return (
    <div className="space-y-6 overflow-y-auto pr-0 sm:pr-1 pb-10">
      {/* 1. Header Bài Học & Badges */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-mono">
          <span className="text-indigo-300 font-bold px-2 py-0.5 bg-indigo-600/20 border border-indigo-500/40 rounded-md">
            BÀI {lesson.lessonNumber}
          </span>
          <span className="text-zinc-400 font-mono">#{lesson.globalIndex}/24</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-300 font-medium">{lesson.conceptBadge}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-amber-300 font-mono text-[11px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            {lesson.level}
          </span>
        </div>

        <h2
          className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight leading-snug"
          style={{ textWrap: 'balance' }}
        >
          {lesson.title}
        </h2>

        <p
          className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed"
          style={{ textWrap: 'pretty' }}
        >
          {lesson.subtitle}
        </p>
      </div>

      {/* 2. Cầu Nối Kiến Thức (Bridge from Previous Lesson) */}
      <div className="border border-white/10 bg-[#12131A] rounded-xl p-4 space-y-1.5 font-sans text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-[11px] font-bold">
          <LinkIcon className="w-3.5 h-3.5 shrink-0" />
          <span>SỢI DÂY LIÊN KẾT TỪ BÀI TRƯỚC</span>
        </div>
        <p className="text-zinc-300 leading-relaxed italic" style={{ textWrap: 'pretty' }}>
          "{lesson.bridgeFromPrevious}"
        </p>
      </div>

      {/* 3. Ẩn Dụ Trực Quan (Analogy for Intuition) */}
      <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 space-y-1.5 font-sans text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-mono text-[11px] font-bold">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>ẨN DỤ THỰC TẾ (HÌNH DUNG TRỰC GIÁC)</span>
        </div>
        <p className="leading-relaxed text-zinc-200" style={{ textWrap: 'pretty' }}>
          {lesson.analogy}
        </p>
      </div>

      {/* 4. Bản Chất Kỹ Thuật Từng Bước (Core Concept) */}
      <div className="border border-white/10 bg-[#181924] rounded-xl p-4 sm:p-5 space-y-3 font-sans text-xs text-zinc-200 leading-relaxed shadow-sm">
        <div className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2.5">
          <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Bản Chất Kỹ Thuật Chuyên Sâu</span>
        </div>
        <div className="space-y-2.5 whitespace-pre-line text-zinc-300 leading-relaxed font-sans text-xs sm:text-[13px]">
          {lesson.coreConcept}
        </div>
      </div>

      {/* 5. Bộ Mô Phỏng Trực Quan Tương Tác 60fps (Visualizer Component) */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Phòng Thí Nghiệm Trực Quan 60fps</span>
        </div>
        <div className="border border-white/10 bg-[#12131A] rounded-xl p-3 sm:p-4 shadow-sm overflow-hidden">
          <VisualizerHub lessonId={lesson.globalIndex} />
        </div>
      </div>

      {/* 6. Code & Prompt Thực Chiến */}
      {lesson.codeExample && (
        <div className="border border-white/10 bg-[#090A0F] rounded-xl p-3.5 sm:p-4 space-y-2 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-white/10 pb-2">
            <span className="flex items-center gap-1.5 text-zinc-200 font-semibold truncate">
              <Code2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{lesson.codeExample.title}</span>
              <span className="text-[10px] text-zinc-500 font-mono">({lesson.codeExample.language})</span>
            </span>
          </div>
          <pre className="text-zinc-200 overflow-x-auto text-[11px] sm:text-xs leading-relaxed pt-1 font-mono scrollbar-none">
            {lesson.codeExample.code}
          </pre>
          {lesson.codeExample.notes && (
            <div className="text-[11px] font-sans text-zinc-400 pt-2 border-t border-white/10 leading-relaxed">
              💡 {lesson.codeExample.notes}
            </div>
          )}
        </div>
      )}

      {/* 7. Cạm Bẫy Thực Chiến Cần Tránh (Gotchas & Pitfalls) */}
      <div className="border border-red-500/25 bg-red-500/5 rounded-xl p-4 space-y-1.5 font-sans text-xs text-zinc-200">
        <div className="flex items-center gap-2 text-red-400 font-mono text-[11px] font-bold">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>CẠM BẪY THỰC CHIẾN CẦN TRÁNH (GOTCHAS)</span>
        </div>
        <p className="leading-relaxed text-zinc-300" style={{ textWrap: 'pretty' }}>
          {lesson.pitfalls}
        </p>
      </div>

      {/* 8. Trích Dẫn Khoa Học & Paper / Repo Reference */}
      <div className="border border-white/10 bg-[#12131A] rounded-xl p-3.5 sm:p-4 space-y-1.5 text-xs font-mono">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 gap-2">
          <span className="flex items-center gap-1.5 text-indigo-300 font-semibold truncate">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Nền tảng học thuật & Repo gốc:</span>
          </span>
          {lesson.citation.link && (
            <a
              href={lesson.citation.link}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors shrink-0"
            >
              <span>Xem Paper</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <div className="text-zinc-100 font-sans text-xs font-medium" style={{ textWrap: 'balance' }}>
          "{lesson.citation.title}"
        </div>
        <div className="text-[11px] text-zinc-500 font-mono">
          Tác giả: {lesson.citation.authors} • <strong className="text-zinc-400">{lesson.citation.venue}</strong>
        </div>
      </div>

      {/* 9. Next Step Action Card */}
      <div className="border border-indigo-500/30 bg-indigo-600/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-indigo-300 font-mono font-bold text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>ĐÃ SẴN SÀNG KIỂM TRA KIẾN THỨC?</span>
          </div>
          <p className="text-zinc-300 font-sans text-xs">
            Làm 3 câu hỏi trắc nghiệm đa tầng để tích lũy điểm và mở khóa chứng nhận.
          </p>
        </div>

        {onGoToNext && (
          <button
            onClick={onGoToNext}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-mono font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <span>Làm Quiz Ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

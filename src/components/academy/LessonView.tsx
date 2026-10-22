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
} from 'lucide-react';
import { VisualizerHub } from '../visualizers/VisualizerHub';

interface LessonViewProps {
  lesson: Lesson;
  onGoToNext?: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onGoToNext }) => {
  return (
    <div className="space-y-6 overflow-y-auto pr-1 pb-10">
      {/* 1. Header Bài Học & Badges */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-2">
          <span className="text-blue-400 font-bold px-2 py-0.5 bg-blue-950/40 border border-blue-800/80">
            BÀI {lesson.lessonNumber}
          </span>
          <span className="text-neutral-400 font-mono">#{lesson.globalIndex}/24</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-300 font-medium">{lesson.conceptBadge}</span>
          <span className="text-neutral-600">·</span>
          <span className="text-amber-400 font-mono text-[11px]">Cấp độ: {lesson.level}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-neutral-100 font-sans tracking-tight">
          {lesson.title}
        </h2>

        <p className="text-xs md:text-sm text-neutral-400 font-sans mt-1.5 leading-relaxed">
          {lesson.subtitle}
        </p>
      </div>

      {/* 2. Cầu Nối Kiến Thức (Bridge from Previous Lesson) */}
      <div className="border border-neutral-800 bg-[#0c0c0e] p-3.5 space-y-1.5 font-sans text-xs">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-[11px] font-bold">
          <LinkIcon className="w-3.5 h-3.5" />
          <span>SỢI DÂY LIÊN KẾT TỪ BÀI HỌC TRƯỚC</span>
        </div>
        <p className="text-neutral-300 leading-relaxed italic">
          "{lesson.bridgeFromPrevious}"
        </p>
      </div>

      {/* 3. Ẩn Dụ Trực Quan (Analogy for Beginners) */}
      <div className="border border-amber-900/40 bg-amber-950/20 p-4 space-y-1.5 font-sans text-xs text-neutral-200">
        <div className="flex items-center gap-2 text-amber-300 font-mono text-[11px] font-bold">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>ẨN DỤ THỰC TẾ (HÌNH DUNG TRỰC GIÁC)</span>
        </div>
        <p className="leading-relaxed text-neutral-300">
          {lesson.analogy}
        </p>
      </div>

      {/* 4. Bản Chất Kỹ Thuật Từng Bước (Core Concept) */}
      <div className="border border-neutral-800 bg-[#121215] p-5 space-y-3 font-sans text-xs text-neutral-300 leading-relaxed">
        <div className="text-[11px] font-mono font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span>Bản Chất Kỹ Thuật (Deep Technical Concept)</span>
        </div>
        <div className="space-y-2.5 whitespace-pre-line text-neutral-300">
          {lesson.coreConcept}
        </div>
      </div>

      {/* 5. Bộ Mô Phỏng Trực Quan Tương Tác 60fps (Visualizer Component) */}
      <div>
        <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Phòng Thí Nghiệm Trực Quan 60fps</span>
        </div>
        <VisualizerHub lessonId={lesson.globalIndex} />
      </div>

      {/* 6. Code & Prompt Thực Chiến */}
      {lesson.codeExample && (
        <div className="border border-neutral-800 bg-[#09090b] p-4 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-neutral-800 pb-2">
            <span className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              {lesson.codeExample.title} ({lesson.codeExample.language})
            </span>
          </div>
          <pre className="text-neutral-200 overflow-x-auto text-[11px] leading-relaxed pt-1 font-mono">
            {lesson.codeExample.code}
          </pre>
          {lesson.codeExample.notes && (
            <div className="text-[11px] font-sans text-neutral-400 pt-2 border-t border-neutral-800/80">
              💡 {lesson.codeExample.notes}
            </div>
          )}
        </div>
      )}

      {/* 7. Cạm Bẫy Thực Chiến Cần Tránh (Gotchas & Pitfalls) */}
      <div className="border border-red-900/40 bg-red-950/20 p-4 space-y-1.5 font-sans text-xs text-neutral-200">
        <div className="flex items-center gap-2 text-red-400 font-mono text-[11px] font-bold">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>CẠM BẪY THỰC CHIẾN CẦN TRÁNH (GOTCHAS)</span>
        </div>
        <p className="leading-relaxed text-neutral-300">
          {lesson.pitfalls}
        </p>
      </div>

      {/* 8. Trích Dẫn Khoa Học & Paper / Repo Reference */}
      <div className="border border-neutral-800 bg-[#0c0c0e] p-3.5 space-y-1 text-xs font-mono">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5 text-blue-300 font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            Nền tảng học thuật & Repository gốc:
          </span>
          {lesson.citation.link && (
            <a
              href={lesson.citation.link}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>Xem Paper / Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <div className="text-neutral-200 font-sans text-xs font-medium">
          "{lesson.citation.title}"
        </div>
        <div className="text-[11px] text-neutral-500 font-mono">
          Tác giả: {lesson.citation.authors} • <strong className="text-neutral-400">{lesson.citation.venue}</strong>
        </div>
      </div>

      {/* 9. Dẫn Dắt Sang Bài Tiếp Theo (Preview Next) */}
      <div className="border border-neutral-800 bg-neutral-900/40 p-4 space-y-2 font-sans text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold">
          <ArrowRight className="w-3.5 h-3.5" />
          <span>HÀNH TRÌNH TIẾP NỐI BÀI HỌC KẾ TIẾP</span>
        </div>
        <p className="text-neutral-300 leading-relaxed">
          {lesson.previewNext}
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Lesson } from '../../types/academy';
import {
  BookOpen,
  Lightbulb,
  Code2,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  Terminal,
  HelpCircle,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import { VisualizerHub } from '../visualizers/VisualizerHub';

interface LessonViewProps {
  lesson: Lesson;
  onGoToNext?: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onGoToNext }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (lesson.codeExample?.code) {
      navigator.clipboard.writeText(lesson.codeExample.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Helper to cleanly render numbered points in core concept
  const renderCoreConcept = (text: string) => {
    const paragraphs = text.split('\n\n').filter(Boolean);
    return (
      <div className="space-y-3.5">
        {paragraphs.map((p, idx) => {
          // If paragraph starts with a number like "1. ", highlight title
          const match = p.match(/^(\d+\.\s+)([^:\n]+):([\s\S]+)$/);
          if (match) {
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h4 className="font-semibold text-white text-xs sm:text-sm mb-1 font-sans flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs flex items-center justify-center shrink-0">
                    {match[1].trim().replace('.', '')}
                  </span>
                  <span>{match[2].trim()}</span>
                </h4>
                <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-sans pl-7" style={{ textWrap: 'pretty' }}>
                  {match[3].trim()}
                </p>
              </div>
            );
          }
          return (
            <p key={idx} className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-sans" style={{ textWrap: 'pretty' }}>
              {p}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <article className="space-y-6 pb-12">
      {/* 1. Lesson Header */}
      <header className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-indigo-300 font-semibold px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/25 rounded-full">
            Bài {lesson.lessonNumber}
          </span>
          <span className="text-zinc-500">#{lesson.globalIndex}/24</span>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-400">{lesson.conceptBadge}</span>
          <span className="text-zinc-700">•</span>
          <span className="text-amber-400/90 font-mono text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            {lesson.level}
          </span>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight leading-tight"
          style={{ textWrap: 'balance' }}
        >
          {lesson.title}
        </h1>

        <p
          className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed"
          style={{ textWrap: 'pretty' }}
        >
          {lesson.subtitle}
        </p>

        {/* Bridge from previous lesson as an elegant quote */}
        <div className="border-l-2 border-indigo-500/70 pl-3.5 py-1 text-xs sm:text-sm text-zinc-300 italic font-sans mt-3">
          "{lesson.bridgeFromPrevious}"
        </div>
      </header>

      {/* 2. Intuitive Analogy (Callout Card) */}
      <section className="rounded-xl p-4 sm:p-5 bg-gradient-to-br from-amber-500/[0.08] to-transparent border border-amber-500/20 text-zinc-200">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-2">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="uppercase tracking-wider font-mono text-[11px]">Hình Dung Trực Giác</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans" style={{ textWrap: 'pretty' }}>
          {lesson.analogy}
        </p>
      </section>

      {/* 3. Deep Technical Concept (Structured Article Content) */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider pb-1">
          <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Nguyên Lý Kỹ Thuật Chuyên Sâu</span>
        </div>
        {renderCoreConcept(lesson.coreConcept)}
      </section>

      {/* 4. Interactive 60fps Visualizer Lab */}
      <section className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-1">
          <span className="flex items-center gap-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Thực Nghiệm Tương Tác 60fps</span>
          </span>
          <span className="text-[10px] text-zinc-500 hidden sm:inline">Thời gian thực</span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11131F] p-4 sm:p-5 shadow-xl shadow-black/40 overflow-hidden">
          <VisualizerHub lessonId={lesson.globalIndex} />
        </div>
      </section>

      {/* 5. Production Code Example (macOS Terminal Style) */}
      {lesson.codeExample && (
        <section className="rounded-xl border border-white/[0.08] bg-[#05060A] overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-white/[0.02] border-b border-white/[0.06] text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-zinc-300 font-medium ml-1.5 text-xs truncate max-w-[200px] sm:max-w-none">
                {lesson.codeExample.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-zinc-500 uppercase">{lesson.codeExample.language}</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Sao chép mã"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed scrollbar-none">
            {lesson.codeExample.code}
          </pre>

          {lesson.codeExample.notes && (
            <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.06] text-[11px] text-zinc-400 font-sans leading-relaxed">
              💡 <span className="font-medium text-zinc-300">{lesson.codeExample.notes}</span>
            </div>
          )}
        </section>
      )}

      {/* 6. Gotchas & Pitfalls (Caution Callout) */}
      <section className="rounded-xl p-4 bg-rose-500/[0.05] border border-rose-500/20 text-xs">
        <div className="flex items-center gap-2 text-rose-400 font-semibold mb-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="font-mono uppercase tracking-wider text-[11px]">Cạm Bẫy Thực Chiến Cần Tránh</span>
        </div>
        <p className="leading-relaxed text-zinc-300 font-sans text-xs sm:text-[13px]" style={{ textWrap: 'pretty' }}>
          {lesson.pitfalls}
        </p>
      </section>

      {/* 7. Academic Citation Card */}
      <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:p-4 text-xs font-mono space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
            <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Nền tảng học thuật & Công trình gốc:</span>
          </span>
          {lesson.citation.link && (
            <a
              href={lesson.citation.link}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>Xem tài liệu gốc</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <div className="text-zinc-200 font-sans text-xs sm:text-sm font-semibold pt-0.5">
          "{lesson.citation.title}"
        </div>
        <div className="text-[11px] text-zinc-500 font-mono">
          {lesson.citation.authors} • <span className="text-zinc-400">{lesson.citation.venue}</span>
        </div>
      </section>

      {/* 8. Call To Action: Quiz Button */}
      {onGoToNext && (
        <section className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/[0.12] via-indigo-500/[0.05] to-transparent p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-300 font-semibold text-sm">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Kiểm Tra Thử Thách Đa Tầng</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans" style={{ textWrap: 'pretty' }}>
              Giải quyết 3 câu hỏi thực chiến để kiểm chứng khả năng thấu hiểu kiến trúc của bạn.
            </p>
          </div>

          <button
            onClick={onGoToNext}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <span>Làm Quiz Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}
    </article>
  );
};

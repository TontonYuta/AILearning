import React from 'react';
import { Award, CheckCircle2, RotateCcw, X, Sparkles } from 'lucide-react';
import { CHAPTERS } from '../../data/chaptersAndLessons';

interface CompletionModalProps {
  isOpen: boolean;
  score: number;
  total: number;
  onClose: () => void;
  onRestart: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  score,
  total,
  onClose,
  onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#121215] border border-emerald-600/80 shadow-2xl p-6 space-y-5 text-neutral-200 font-sans animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-neutral-100 font-mono text-sm uppercase">
              Chứng Nhận Tốt Nghiệp AI Eng Academy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center py-2 space-y-2">
          <div className="w-16 h-16 mx-auto bg-emerald-950/40 border border-emerald-500 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-neutral-100 font-sans">
            Chúc mừng bạn đã hoàn thành trọn vẹn 24 Bài Học Thực Chiến!
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            Bạn đã làm chủ toàn bộ nền tảng lý thuyết các papers khoa học đỉnh cao và kỹ nghệ xây dựng ứng dụng AI cấp độ Production.
          </p>
        </div>

        {/* Score & Skill Matrix across 8 Chapters */}
        <div className="p-4 bg-[#09090b] border border-neutral-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-300">
            <span>Tổng điểm Quiz đạt được:</span>
            <span className="text-emerald-400 font-bold text-sm">
              {score} / {total} ⭐ ({Math.round((score / total) * 100)}%)
            </span>
          </div>

          <div className="border-t border-neutral-800 pt-2 grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
            {CHAPTERS.map((ch) => (
              <div key={ch.id} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{ch.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onRestart}
            className="py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Học lại từ Bài 1.1
          </button>
          <button
            onClick={onClose}
            className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tiếp tục ôn tập
          </button>
        </div>
      </div>
    </div>
  );
};

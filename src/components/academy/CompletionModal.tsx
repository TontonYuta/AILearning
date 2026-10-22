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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0E101A] border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-7 space-y-5 text-zinc-200 font-sans animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white font-mono text-xs sm:text-sm uppercase tracking-wide">
              Chứng Nhận Tốt Nghiệp AI Eng Academy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center py-2 space-y-2.5">
          <div className="w-16 h-16 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-sans" style={{ textWrap: 'balance' }}>
            Chúc mừng bạn đã hoàn thành trọn vẹn 24 Bài Học Thực Chiến!
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed" style={{ textWrap: 'pretty' }}>
            Bạn đã làm chủ toàn bộ nền tảng lý thuyết các papers khoa học và kỹ nghệ xây dựng ứng dụng AI cấp độ Production.
          </p>
        </div>

        {/* Score & Skill Matrix across 8 Chapters */}
        <div className="p-4 bg-black/40 border border-white/[0.08] rounded-xl space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-300 font-sans">
            <span>Tổng điểm Quiz đạt được:</span>
            <span className="text-emerald-400 font-bold font-mono text-base">
              {score} / {total} ⭐ ({Math.round((score / total) * 100)}%)
            </span>
          </div>

          <div className="border-t border-white/[0.06] pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
            {CHAPTERS.map((ch) => (
              <div key={ch.id} className="flex items-center gap-2 p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate text-zinc-300">{ch.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={onRestart}
            className="py-2.5 px-4 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/10 rounded-xl text-zinc-300 font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Học lại từ Bài 1.1</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-sans text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <span>Tiếp tục trải nghiệm Lab</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#181924] border border-emerald-500/60 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 text-zinc-200 font-sans animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400 shrink-0" />
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

        <div className="text-center py-2 space-y-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-base sm:text-xl font-bold text-white font-sans" style={{ textWrap: 'balance' }}>
            Chúc mừng bạn đã hoàn thành trọn vẹn 24 Bài Học Thực Chiến!
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed" style={{ textWrap: 'pretty' }}>
            Bạn đã làm chủ toàn bộ nền tảng lý thuyết các papers khoa học và kỹ nghệ xây dựng ứng dụng AI cấp độ Production.
          </p>
        </div>

        {/* Score & Skill Matrix across 8 Chapters */}
        <div className="p-3.5 sm:p-4 bg-[#12131A] border border-white/10 rounded-xl space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-300">
            <span>Tổng điểm Quiz đạt được:</span>
            <span className="text-emerald-400 font-bold text-sm">
              {score} / {total} ⭐ ({Math.round((score / total) * 100)}%)
            </span>
          </div>

          <div className="border-t border-white/10 pt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
            {CHAPTERS.map((ch) => (
              <div key={ch.id} className="flex items-center gap-2 p-1.5 bg-white/5 rounded-lg border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{ch.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={onRestart}
            className="py-2.5 px-4 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl text-zinc-200 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Học lại từ Bài 1.1</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer"
          >
            <span>Tiếp tục trải nghiệm Lab</span>
          </button>
        </div>
      </div>
    </div>
  );
};

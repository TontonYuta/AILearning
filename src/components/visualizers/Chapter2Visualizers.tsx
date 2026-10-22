import React, { useState } from 'react';
import { Compass, Network, Search, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

// ==========================================
// BÀI 2.1: DENSE VS SPARSE (BM25 VS SPLADE)
// ==========================================
export const Lesson2_1_DenseSparse: React.FC = () => {
  const [queryType, setQueryType] = useState<'error_code' | 'general_meaning'>('error_code');

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            So sánh đối đầu: BM25 (Sparse) vs Vector (Dense)
          </span>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setQueryType('error_code')}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-sans transition-all cursor-pointer ${
              queryType === 'error_code'
                ? 'border-blue-500/60 bg-blue-500/20 text-blue-200 font-semibold shadow-sm shadow-blue-500/20'
                : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            Mã lỗi: ERR_409_CONFLICT
          </button>
          <button
            onClick={() => setQueryType('general_meaning')}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-sans transition-all cursor-pointer ${
              queryType === 'general_meaning'
                ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200 font-semibold shadow-sm shadow-emerald-500/20'
                : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            Ý nghĩa: "Hủy hóa đơn"
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Column 1: Sparse BM25 */}
        <div className="p-3.5 bg-black/40 border border-white/[0.08] rounded-xl space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-amber-400 font-sans tracking-wide">SPARSE (BM25)</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
              Khớp Token IDF
            </span>
          </div>
          {queryType === 'error_code' ? (
            <div className="space-y-1.5 text-emerald-400">
              <div className="flex items-center gap-1.5 font-bold font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Khớp 100% Runbook 409
              </div>
              <p className="text-zinc-300 text-[11px] font-sans leading-relaxed">
                Token &quot;ERR_409_CONFLICT&quot; có IDF cực đại, tìm trúng đích tài liệu kỹ thuật mà không bị nhiễu!
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 text-zinc-400">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold font-sans">
                <XCircle className="w-4 h-4 text-amber-400" /> Khớp từ khóa mờ nhạt
              </div>
              <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
                Nếu tài liệu viết &quot;Hoàn tiền phiếu thu&quot;, BM25 sẽ trượt do không trùng lặp từ vựng chính xác.
              </p>
            </div>
          )}
        </div>

        {/* Column 2: Dense Embedding */}
        <div className="p-3.5 bg-black/40 border border-white/[0.08] rounded-xl space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-blue-400 font-sans tracking-wide">DENSE (Embedding)</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px]">
              Không gian 1536D
            </span>
          </div>
          {queryType === 'error_code' ? (
            <div className="space-y-1.5 text-rose-400">
              <div className="flex items-center gap-1.5 font-bold font-sans">
                <XCircle className="w-4 h-4 text-rose-400" /> Bị nhầm sang lỗi chung
              </div>
              <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
                Vector bị co cụm về chủ đề chung &quot;HTTP Error&quot;, có nguy cơ trả về tài liệu ERR_400 hoặc ERR_500.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 text-emerald-400">
              <div className="flex items-center gap-1.5 font-bold font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hiểu nghĩa tương đương
              </div>
              <p className="text-zinc-300 text-[11px] font-sans leading-relaxed">
                Vector tự động nhận diện &quot;hủy hóa đơn&quot; đồng nghĩa với &quot;hoàn tiền giao dịch&quot;.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-zinc-300 font-sans leading-relaxed">
        <strong className="text-indigo-300 font-semibold">Kết luận thực chiến:</strong> Hệ thống Production bắt buộc phải kết hợp cả hai (Hybrid Search qua RRF) để vừa bắt đúng mã kỹ thuật vừa hiểu ngữ nghĩa người dùng.
      </div>
    </div>
  );
};

// ==========================================
// BÀI 2.2: VECTOR MATH & L2 NORMALIZATION
// ==========================================
export const Lesson2_2_VectorMath: React.FC = () => {
  const [angleDeg, setAngleDeg] = useState<number>(30); // 0 to 90 degrees
  const [isNormalized, setIsNormalized] = useState<boolean>(true);

  const rad = (angleDeg * Math.PI) / 180;
  const cosine = Math.cos(rad);
  const lengthA = isNormalized ? 1.0 : 2.5;
  const lengthB = isNormalized ? 1.0 : 3.0;
  const dotProduct = lengthA * lengthB * cosine;

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            Cosine Similarity vs Dot Product & L2 Norm
          </span>
        </div>
        <button
          onClick={() => setIsNormalized(!isNormalized)}
          className={`px-3 py-1 rounded-full border text-[11px] font-sans transition-all cursor-pointer self-start sm:self-auto ${
            isNormalized
              ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200 font-semibold shadow-sm shadow-emerald-500/20'
              : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          {isNormalized ? '✓ L2 Normalized (||v|| = 1.0)' : 'Chưa chuẩn hóa'}
        </button>
      </div>

      <div className="space-y-2 bg-black/40 border border-white/[0.08] rounded-xl p-3.5">
        <div className="flex justify-between text-xs font-sans text-zinc-300">
          <span>Góc θ giữa 2 vector biểu diễn:</span>
          <span className="text-emerald-400 font-bold font-mono text-sm">{angleDeg}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="90"
          step="5"
          value={angleDeg}
          onChange={(e) => setAngleDeg(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>0° (Hoàn toàn trùng nhau)</span>
          <span>45° (Tương quan vừa)</span>
          <span>90° (Trực giao / Độc lập)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
        <div className="p-3.5 bg-black/40 border border-white/[0.08] rounded-xl">
          <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">COSINE SIMILARITY (cos θ)</div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            {cosine.toFixed(4)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-sans">Đo góc thuần túy (Độc lập độ dài)</div>
        </div>

        <div className="p-3.5 bg-black/40 border border-white/[0.08] rounded-xl">
          <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">DOT PRODUCT (u · v)</div>
          <div className={`text-xl font-bold mt-1 font-mono ${isNormalized ? 'text-emerald-400' : 'text-amber-400'}`}>
            {dotProduct.toFixed(4)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-sans">
            {isNormalized ? '✓ Khớp hoàn toàn với Cosine!' : 'Bị phóng đại bởi độ dài vector'}
          </div>
        </div>
      </div>

      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-zinc-300 font-sans leading-relaxed">
        {isNormalized ? (
          <span className="text-emerald-300">
            ✓ Khi ||u|| = ||v|| = 1.0, Cosine trùng với Dot Product. GPU tính toán ma trận với tốc độ nhanh gấp 3x nhờ chỉ dùng phép nhân vô hướng.
          </span>
        ) : (
          <span className="text-amber-300">
            Khi chưa chuẩn hóa, Dot Product phụ thuộc vào độ dài vector, không phản ánh thuần túy góc ngữ nghĩa của đoạn văn bản.
          </span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// BÀI 2.3: HNSW HIERARCHICAL GRAPH SEARCH
// ==========================================
export const Lesson2_3_HNSW: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  const steps = [
    { layer: 'Layer 2 (Thưa thớt nhất)', desc: 'Nhảy bước lớn qua đồ thị cấp cao O(1) để định vị cụm tổng quát', nodes: 3, active: 'Node 1 → Node 3' },
    { layer: 'Layer 1 (Mật độ trung bình)', desc: 'Thu hẹp phạm vi tìm kiếm tới các láng giềng cận kề', nodes: 8, active: 'Node 3 → Node 6' },
    { layer: 'Layer 0 (Dày đặc nhất)', desc: 'Duyệt greedy chính xác về vector đích trong < 2ms', nodes: 20, active: 'Node 6 → Vector mục tiêu' },
  ];

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Network className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            Mô phỏng nhảy tầng đồ thị HNSW (Malkov, 2018)
          </span>
        </div>
        <button
          onClick={() => setStep((prev) => (prev < 2 ? prev + 1 : 0))}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-sans font-bold rounded-lg transition-all active:scale-95 shadow-md shadow-cyan-600/30 cursor-pointer self-start sm:self-auto"
        >
          {step === 2 ? 'Làm lại từ Layer 2' : `Nhảy xuống Layer ${1 - step}`}
        </button>
      </div>

      <div className="space-y-2">
        {steps.map((s, idx) => {
          const isCurrent = step === idx;
          const isDone = step > idx;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                isCurrent
                  ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200 shadow-sm shadow-cyan-500/10'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-zinc-400'
                  : 'border-white/[0.06] bg-black/30 text-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-[11px] mb-1 font-sans">
                <span className={isCurrent ? 'text-white' : 'text-zinc-300'}>{s.layer}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  isCurrent ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-zinc-500'
                }`}>
                  {isCurrent ? '⚡ Đang duyệt' : isDone ? '✓ Đã hoàn tất' : 'Chờ'}
                </span>
              </div>
              <p className="font-sans text-[11px] text-zinc-400">{s.desc}</p>
              <div className="text-[10px] text-cyan-400 mt-2 font-mono flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span>Đường dẫn duyệt: {s.active}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[11px] text-cyan-300 font-sans leading-relaxed">
        ✓ Độ phức tạp tìm kiếm chỉ <strong className="font-mono">O(log N)</strong>. Duyệt hàng triệu vector trong không gian nhiều chiều trong ~1.8 mili-giây.
      </div>
    </div>
  );
};

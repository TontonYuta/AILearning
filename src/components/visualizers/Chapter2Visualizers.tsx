import React, { useState } from 'react';
import { Compass, Network, Search, CheckCircle2, XCircle } from 'lucide-react';

// ==========================================
// BÀI 2.1: DENSE VS SPARSE (BM25 VS SPLADE)
// ==========================================
export const Lesson2_1_DenseSparse: React.FC = () => {
  const [queryType, setQueryType] = useState<'error_code' | 'general_meaning'>('error_code');

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-blue-400" />
          So sánh đối đầu: BM25 (Sparse) vs Vector (Dense)
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setQueryType('error_code')}
            className={`px-2 py-0.5 border text-[11px] ${
              queryType === 'error_code'
                ? 'border-blue-500 bg-blue-950/40 text-blue-200'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
            }`}
          >
            Mã lỗi: ERR_409_CONFLICT
          </button>
          <button
            onClick={() => setQueryType('general_meaning')}
            className={`px-2 py-0.5 border text-[11px] ${
              queryType === 'general_meaning'
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
            }`}
          >
            Ý nghĩa: "Cách hủy hóa đơn"
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Column 1: Sparse BM25 */}
        <div className="p-3 bg-[#09090b] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
            <span>SPARSE (BM25)</span>
            <span>Khớp Token IDF</span>
          </div>
          {queryType === 'error_code' ? (
            <div className="space-y-1 text-emerald-400">
              <div className="flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Khớp 100% Runbook 409
              </div>
              <p className="text-neutral-300 text-[11px] font-sans">
                Token "ERR_409_CONFLICT" có IDF cực đại, tìm trúng đích tài liệu kỹ thuật!
              </p>
            </div>
          ) : (
            <div className="space-y-1 text-neutral-400">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                ⚠️ Khớp từ khóa mờ nhạt
              </div>
              <p className="text-neutral-400 text-[11px] font-sans">
                Nếu tài liệu viết "Hoàn tiền phiếu thu", BM25 sẽ trượt do không cùng từ vựng.
              </p>
            </div>
          )}
        </div>

        {/* Column 2: Dense Embedding */}
        <div className="p-3 bg-[#09090b] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-400">
            <span>DENSE (Embedding)</span>
            <span>Không gian 1536D</span>
          </div>
          {queryType === 'error_code' ? (
            <div className="space-y-1 text-red-400">
              <div className="flex items-center gap-1 font-bold">
                <XCircle className="w-3.5 h-3.5" /> Bị nhầm sang lỗi chung
              </div>
              <p className="text-neutral-400 text-[11px] font-sans">
                Vector bị co cụm về chủ đề chung "HTTP Error", trả về tài liệu ERR_400 hoặc ERR_500.
              </p>
            </div>
          ) : (
            <div className="space-y-1 text-emerald-400">
              <div className="flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hiểu nghĩa tương đương
              </div>
              <p className="text-neutral-300 text-[11px] font-sans">
                Vector tự động hiểu "hủy hóa đơn" đồng nghĩa với "hoàn tiền giao dịch".
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed">
        <strong>Kết luận thực chiến:</strong> Hệ thống Production bắt buộc phải kết hợp cả hai (Hybrid Search) để vừa bắt đúng mã kỹ thuật vừa hiểu ngữ nghĩa người dùng.
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
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          Cosine Similarity vs Dot Product & L2 Norm
        </span>
        <button
          onClick={() => setIsNormalized(!isNormalized)}
          className={`px-2 py-0.5 border text-[11px] ${
            isNormalized
              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
              : 'border-neutral-800 bg-neutral-900 text-neutral-400'
          }`}
        >
          {isNormalized ? 'L2 Normalized (||v|| = 1.0)' : 'Chưa chuẩn hóa'}
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-neutral-400">
          <span>Góc θ giữa 2 vector:</span>
          <span className="text-emerald-400 font-bold">{angleDeg}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="90"
          step="5"
          value={angleDeg}
          onChange={(e) => setAngleDeg(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-1 bg-neutral-800 appearance-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 bg-[#09090b] border border-neutral-800 text-center">
        <div className="p-2 bg-neutral-900 border border-neutral-800">
          <div className="text-[10px] text-neutral-500">COSINE SIMILARITY (cos θ)</div>
          <div className="text-base font-bold text-emerald-400 mt-0.5">
            {cosine.toFixed(4)}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Đo góc (Độc lập độ dài)</div>
        </div>

        <div className="p-2 bg-neutral-900 border border-neutral-800">
          <div className="text-[10px] text-neutral-500">DOT PRODUCT (u · v)</div>
          <div className={`text-base font-bold mt-0.5 ${isNormalized ? 'text-emerald-400' : 'text-amber-400'}`}>
            {dotProduct.toFixed(4)}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">
            {isNormalized ? '✓ Bằng chính xác Cosine!' : 'Bị ảnh hưởng bởi độ dài'}
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
        {isNormalized ? (
          <span className="text-emerald-400">
            ✓ Khi ||u|| = ||v|| = 1.0, Cosine trùng với Dot Product. GPU tính toán ma trận với tốc độ nhanh gấp 3x.
          </span>
        ) : (
          <span className="text-amber-400">
            Khi chưa chuẩn hóa, Dot Product phụ thuộc vào độ dài vector, không phản ánh thuần túy góc ngữ nghĩa.
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
    { layer: 'Layer 2 (Thưa thớt nhất)', desc: 'Nhảy bước lớn qua đồ thị cấp cao O(1)', nodes: 3, active: 'Node 1 -> Node 3' },
    { layer: 'Layer 1 (Trung bình)', desc: 'Thu hẹp phạm vi tới cụm láng giềng gần', nodes: 8, active: 'Node 3 -> Node 6' },
    { layer: 'Layer 0 (Dày đặc nhất)', desc: 'Hội tụ chính xác về vector đích trong < 2ms', nodes: 20, active: 'Node 6 -> Vector đích' },
  ];

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Network className="w-3.5 h-3.5 text-cyan-400" />
          Mô phỏng nhảy tầng đồ thị HNSW (Malkov, 2018)
        </span>
        <button
          onClick={() => setStep((prev) => (prev < 2 ? prev + 1 : 0))}
          className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold transition-colors"
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
              className={`p-2.5 border transition-all ${
                isCurrent
                  ? 'border-cyan-500 bg-cyan-950/30 text-cyan-200'
                  : isDone
                  ? 'border-emerald-900/60 bg-emerald-950/10 text-neutral-400'
                  : 'border-neutral-800 bg-[#09090b] text-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                <span>{s.layer}</span>
                <span>{isCurrent ? '⚡ Đang quét' : isDone ? '✓ Đã nhảy qua' : 'Chờ'}</span>
              </div>
              <p className="font-sans text-[11px] text-neutral-300">{s.desc}</p>
              <div className="text-[10px] text-cyan-400 mt-1 font-mono">Đường dẫn: {s.active}</div>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-emerald-400">
        ✓ Độ phức tạp tìm kiếm chỉ O(log N). Duyệt hàng triệu vector trong ~1.8 mili-giây.
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Layers } from 'lucide-react';

export const Lesson3Chunking: React.FC = () => {
  const [overlap, setOverlap] = useState<number>(18);

  const fullText =
    'Chính sách bảo mật yêu cầu mã hóa toàn bộ dữ liệu thẻ theo tiêu chuẩn PCI-DSS. Khóa mã hóa phải được lưu trữ trong phần cứng HSM an toàn.';

  // Chunks splitting simulation
  const chunk1 = fullText.slice(0, 68);
  const overlapText = overlap > 0 ? fullText.slice(68 - overlap, 68) : '';
  const chunk2Start = 68 - overlap;
  const chunk2 = fullText.slice(chunk2Start, 115);

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          Phân đoạn văn bản & Vùng gối đầu (Overlap)
        </span>
        <span className="text-amber-400 font-bold">
          Overlap: {overlap} ký tự
        </span>
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-neutral-400">
          <span>Chunk Overlap (Gối đầu):</span>
          <span>{overlap === 0 ? '0 (Không gối đầu - Dễ mất ý)' : `${overlap} chars`}</span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          step="2"
          value={overlap}
          onChange={(e) => setOverlap(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer h-1 bg-neutral-800 appearance-none"
        />
      </div>

      {/* Visual Chunks */}
      <div className="space-y-2">
        {/* Chunk 1 */}
        <div className="p-2.5 border border-blue-900/60 bg-blue-950/20 text-neutral-300">
          <div className="text-[10px] text-blue-400 font-bold mb-1 flex items-center justify-between">
            <span>CHUNK #1 [0..68]</span>
            <span className="text-neutral-500">{chunk1.length} chars</span>
          </div>
          <p className="font-sans text-xs leading-relaxed">
            {overlap > 0 ? (
              <>
                <span>{chunk1.slice(0, chunk1.length - overlap)}</span>
                <span className="border-b-2 border-dashed border-amber-400 text-amber-200 font-semibold px-0.5 bg-amber-950/30">
                  {overlapText}
                </span>
              </>
            ) : (
              chunk1
            )}
          </p>
        </div>

        {/* Chunk 2 */}
        <div className="p-2.5 border border-emerald-900/60 bg-emerald-950/20 text-neutral-300">
          <div className="text-[10px] text-emerald-400 font-bold mb-1 flex items-center justify-between">
            <span>CHUNK #2 [{chunk2Start}..115]</span>
            <span className="text-neutral-500">{chunk2.length} chars</span>
          </div>
          <p className="font-sans text-xs leading-relaxed">
            {overlap > 0 ? (
              <>
                <span className="border-b-2 border-dashed border-amber-400 text-amber-200 font-semibold px-0.5 bg-amber-950/30">
                  {overlapText}
                </span>
                <span>{chunk2.slice(overlap)}</span>
              </>
            ) : (
              chunk2
            )}
          </p>
        </div>
      </div>

      {/* Explanatory callout */}
      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
        {overlap === 0 ? (
          <span className="text-red-400">
            ⚠️ Khi Overlap = 0, cụm từ "tiêu chuẩn PCI-DSS" bị cắt đôi. Tìm kiếm từ khóa sẽ thất bại vì không chunk nào chứa đầy đủ ý!
          </span>
        ) : (
          <span className="text-emerald-400">
            ✓ Vùng gối đầu viền nét đứt vàng xuất hiện ở cả 2 chunk, bảo toàn trọn vẹn ngữ cảnh của cụm "tiêu chuẩn PCI-DSS".
          </span>
        )}
      </div>
    </div>
  );
};

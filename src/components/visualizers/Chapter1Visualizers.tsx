import React, { useState, useMemo } from 'react';
import { Type, Sliders, TrendingDown } from 'lucide-react';

// ==========================================
// BÀI 1.1: BPE TOKENIZER & TIẾNG VIỆT MULTI-BYTE
// ==========================================
export const Lesson1_1_Tokenizer: React.FC = () => {
  const [text, setText] = useState<string>('Kỹ sư trí tuệ nhân tạo thực chiến');

  const tokens = useMemo(() => {
    if (!text) return [];
    const words = text.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]+|\s+/gu) || [];
    const result: string[] = [];
    words.forEach((item) => {
      if (item === ' ') {
        result.push('␣');
      } else if (item.length > 3 && /[\p{L}]/u.test(item)) {
        const mid = Math.ceil(item.length / 2);
        result.push(item.slice(0, mid));
        result.push(item.slice(mid));
      } else {
        result.push(item);
      }
    });
    return result;
  }, [text]);

  const tokenColors = [
    'border-blue-500/40 bg-blue-950/30 text-blue-200',
    'border-indigo-500/40 bg-indigo-950/30 text-indigo-200',
    'border-emerald-500/40 bg-emerald-950/30 text-emerald-200',
    'border-amber-500/40 bg-amber-950/30 text-amber-200',
    'border-cyan-500/40 bg-cyan-950/30 text-cyan-200',
  ];

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-blue-400" />
          Mô phỏng Tiktoken BPE: Phân rã từ đa byte
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setText('Kỹ sư trí tuệ nhân tạo thực chiến')}
            className="text-[10px] text-neutral-400 hover:text-neutral-200 px-1.5 py-0.5 border border-neutral-800 bg-neutral-900"
          >
            Tiếng Việt (Có dấu)
          </button>
          <button
            onClick={() => setText('Applied artificial intelligence engineer')}
            className="text-[10px] text-neutral-400 hover:text-neutral-200 px-1.5 py-0.5 border border-neutral-800 bg-neutral-900"
          >
            English (ASCII)
          </button>
        </div>
      </div>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-[#09090b] border border-neutral-800 p-2 text-neutral-100 focus:border-blue-500 focus:outline-none"
        placeholder="Gõ thử văn bản để quan sát..."
      />

      <div className="p-3 bg-[#09090b] border border-neutral-800 flex flex-wrap gap-1.5 min-h-14 items-center">
        {tokens.map((token, idx) => (
          <span
            key={idx}
            className={`px-2 py-0.5 border text-xs font-bold ${tokenColors[idx % tokenColors.length]}`}
          >
            {token}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-neutral-800 text-center">
        <div className="p-2 bg-neutral-900 border border-neutral-800">
          <div className="text-[10px] text-neutral-500">KÝ TỰ</div>
          <div className="text-sm font-bold text-neutral-200 mt-0.5">{text.length}</div>
        </div>
        <div className="p-2 bg-neutral-900 border border-neutral-800">
          <div className="text-[10px] text-neutral-500">SỐ TOKENS</div>
          <div className="text-sm font-bold text-blue-400 mt-0.5">{tokens.length}</div>
        </div>
        <div className="p-2 bg-neutral-900 border border-neutral-800">
          <div className="text-[10px] text-neutral-500">CHARS / TOKEN</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">
            {tokens.length > 0 ? (text.length / tokens.length).toFixed(1) : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// BÀI 1.2: TEMPERATURE & SOFTMAX SAMPLING
// ==========================================
export const Lesson1_2_Sampling: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(0.0);

  // Raw logits for 4 token candidates
  const candidates = [
    { token: 'Tổng_tiền', baseLogit: 4.8 },
    { token: 'Hóa_đơn', baseLogit: 3.2 },
    { token: 'Khách_hàng', baseLogit: 1.5 },
    { token: 'Chi_nhánh', baseLogit: 0.4 },
  ];

  // Softmax computation
  const distribution = useMemo(() => {
    if (temperature === 0) {
      return candidates.map((c, i) => ({
        ...c,
        prob: i === 0 ? 1.0 : 0.0,
      }));
    }
    const scaled = candidates.map((c) => c.baseLogit / temperature);
    const maxVal = Math.max(...scaled);
    const exp = scaled.map((s) => Math.exp(s - maxVal));
    const sumExp = exp.reduce((a, b) => a + b, 0);
    return candidates.map((c, i) => ({
      ...c,
      prob: exp[i] / sumExp,
    }));
  }, [temperature]);

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          Phân phối xác suất Softmax theo Temperature
        </span>
        <span className="text-amber-400 font-bold">
          T = {temperature.toFixed(2)} {temperature === 0 ? '(Greedy Argmax)' : ''}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-neutral-400">
          <span>Kéo chỉnh Temperature:</span>
          <span>{temperature === 0 ? '0.0 (Tất định 100%)' : temperature >= 1.0 ? '1.0+ (Sáng tạo / Rủi ro)' : '0.1 - 0.7'}</span>
        </div>
        <input
          type="range"
          min="0.0"
          max="1.5"
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer h-1 bg-neutral-800 appearance-none"
        />
      </div>

      <div className="space-y-2 p-3 bg-[#09090b] border border-neutral-800">
        {distribution.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-200 font-bold">{item.token}</span>
              <span className="text-neutral-400">{(item.prob * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-900 overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${
                  idx === 0 ? 'bg-amber-500' : 'bg-neutral-600'
                }`}
                style={{ width: `${item.prob * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
        {temperature === 0 ? (
          <span className="text-emerald-400">
            ✓ T = 0.0: Phân phối co nhọn tuyệt đối. Token "Tổng_tiền" được chọn 100% không bao giờ tráo đổi.
          </span>
        ) : (
          <span className="text-neutral-300">
            Khi T tăng lên, các token ít liên quan nhận được xác suất chọn cao hơn, gia tăng nguy cơ hallucination.
          </span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// BÀI 1.3: LOST IN THE MIDDLE (U-SHAPED CURVE)
// ==========================================
export const Lesson1_3_LostInMiddle: React.FC = () => {
  const [targetPos, setTargetPos] = useState<number>(5); // position 1 to 10

  // U-curve simulated accuracy
  const calculateAccuracy = (pos: number) => {
    // 1-indexed, 1 to 10
    // U-shaped: high at 1, drops in middle (5-6), high at 10
    const normalized = (pos - 1) / 9; // 0 to 1
    const distFromEdge = Math.abs(normalized - 0.5); // 0 (middle) to 0.5 (edge)
    const accuracy = 55 + (distFromEdge / 0.5) * 38; // 55% in middle to 93% at edges
    return Math.round(accuracy);
  };

  const currentAcc = calculateAccuracy(targetPos);

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          Đường cong suy giảm chú ý hình chữ U (Stanford, 2023)
        </span>
        <span className="text-neutral-400 text-[11px]">Vị trí Doc: {targetPos} / 10</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-neutral-400">
          <span>Di chuyển vị trí tài liệu cốt lõi trong Prompt:</span>
          <span className={currentAcc > 80 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
            Độ chính xác: {currentAcc}%
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={targetPos}
          onChange={(e) => setTargetPos(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer h-1 bg-neutral-800 appearance-none"
        />
      </div>

      {/* 10 document slots visual */}
      <div className="grid grid-cols-10 gap-1 p-2 bg-[#09090b] border border-neutral-800 text-center">
        {Array.from({ length: 10 }).map((_, i) => {
          const pos = i + 1;
          const isSelected = pos === targetPos;
          const acc = calculateAccuracy(pos);
          const isEdge = pos <= 2 || pos >= 9;

          return (
            <div
              key={pos}
              onClick={() => setTargetPos(pos)}
              className={`p-1.5 border cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-400 bg-blue-950/60 text-white font-bold'
                  : isEdge
                  ? 'border-emerald-900/60 bg-emerald-950/20 text-emerald-300'
                  : 'border-red-900/40 bg-red-950/10 text-neutral-400'
              }`}
            >
              <div className="text-[10px]">#{pos}</div>
              <div className="text-[9px] mt-0.5">{acc}%</div>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
        {targetPos === 1 || targetPos === 10 ? (
          <span className="text-emerald-400">
            ✓ Vị trí đầu/cuối: Tận dụng hiệu ứng Primacy / Recency. Mô hình ghi nhớ tốt nhất (&gt; 90%).
          </span>
        ) : (
          <span className="text-red-400">
            ⚠️ Bị kẹt ở giữa (Lost in the middle): Độ chú ý của Transformer suy giảm nghiêm trọng (~55% - 65%).
          </span>
        )}
      </div>
    </div>
  );
};

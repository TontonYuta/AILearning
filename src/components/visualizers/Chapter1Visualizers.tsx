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
    'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-200',
    'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-200',
    'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-200',
    'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200',
    'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-500/40 dark:bg-purple-500/15 dark:text-purple-200',
  ];

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Type className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-900 dark:text-white font-semibold font-sans text-xs sm:text-sm">
            Mô phỏng Tiktoken BPE: Phân rã từ đa byte
          </span>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setText('Kỹ sư trí tuệ nhân tạo thực chiến')}
            className="text-[11px] font-sans text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Tiếng Việt (Có dấu)
          </button>
          <button
            onClick={() => setText('Applied artificial intelligence engineer')}
            className="text-[11px] font-sans text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            English (ASCII)
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-sans text-slate-600 dark:text-zinc-400 font-medium">Nhập văn bản thử nghiệm:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-100/70 dark:bg-black/40 border border-slate-200 dark:border-white/[0.10] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:border-indigo-500 focus:outline-none transition-colors text-xs sm:text-[13px] font-sans"
          placeholder="Gõ thử văn bản để quan sát phân rã token..."
        />
      </div>

      {/* Token Output Stream */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-400 font-sans">
          <span>Chuỗi Token được sinh ra (Sub-word tokens):</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold">{tokens.length} tokens</span>
        </div>
        <div className="p-3.5 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/[0.08] rounded-xl flex flex-wrap gap-2 min-h-16 items-center">
          {tokens.map((token, idx) => (
            <span
              key={idx}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all hover:scale-105 select-none ${tokenColors[idx % tokenColors.length]}`}
            >
              {token}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-mono">
        <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500">Số Ký Tự</div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">{text.length}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500">Số Tokens</div>
          <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{tokens.length}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500">Tỷ Lệ Ký Tự / Token</div>
          <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
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

  const candidates = [
    { token: 'Tổng_tiền', baseLogit: 4.8 },
    { token: 'Hóa_đơn', baseLogit: 3.2 },
    { token: 'Khách_hàng', baseLogit: 1.5 },
    { token: 'Chi_nhánh', baseLogit: 0.4 },
  ];

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
    <div className="space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-900 dark:text-white font-semibold font-sans text-xs sm:text-sm">
            Phân phối xác suất Softmax theo Temperature
          </span>
        </div>
        <span className="text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 px-2 py-0.5 rounded-md text-xs">
          T = {temperature.toFixed(2)}
        </span>
      </div>

      <div className="space-y-2 p-3.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
        <div className="flex justify-between text-xs font-sans text-slate-700 dark:text-zinc-300">
          <span className="font-medium">Thanh trượt Temperature:</span>
          <span className="text-amber-600 dark:text-amber-300 font-mono">
            {temperature === 0 ? '0.0 (Tất định 100%)' : temperature >= 1.0 ? '1.0+ (Sáng tạo / Ảo giác)' : '0.1 - 0.7 (Cân bằng)'}
          </span>
        </div>
        <input
          type="range"
          min="0.0"
          max="1.5"
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none"
        />
      </div>

      <div className="space-y-2.5 p-3.5 bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/[0.08] rounded-xl">
        {distribution.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-800 dark:text-zinc-200 font-semibold">{item.token}</span>
              <span className="text-slate-500 dark:text-zinc-400 font-mono">{(item.prob * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  idx === 0
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-sm'
                    : 'bg-slate-400 dark:bg-zinc-600'
                }`}
                style={{ width: `${item.prob * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] text-xs font-sans text-slate-700 dark:text-zinc-300 leading-relaxed">
        {temperature === 0 ? (
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
            ✓ T = 0.0: Phân phối co nhọn tuyệt đối. Token &quot;Tổng_tiền&quot; được chọn 100% không bao giờ tráo đổi.
          </span>
        ) : (
          <span>
            Khi T tăng lên, các token ít liên quan nhận được xác suất chọn cao hơn, gia tăng tính đa dạng nhưng cũng tăng nguy cơ hallucination.
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
  const [targetPos, setTargetPos] = useState<number>(5);

  const calculateAccuracy = (pos: number) => {
    const normalized = (pos - 1) / 9;
    const distFromEdge = Math.abs(normalized - 0.5);
    const accuracy = 55 + (distFromEdge / 0.5) * 38;
    return Math.round(accuracy);
  };

  const currentAcc = calculateAccuracy(targetPos);

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-900 dark:text-white font-semibold font-sans text-xs sm:text-sm">
            Đường cong suy giảm chú ý hình chữ U (Stanford, 2023)
          </span>
        </div>
        <span className="text-slate-500 dark:text-zinc-400 text-xs font-mono">Vị trí: #{targetPos} / 10</span>
      </div>

      <div className="space-y-2 p-3.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
        <div className="flex justify-between text-xs font-sans text-slate-700 dark:text-zinc-300">
          <span>Vị trí tài liệu trong Prompt Context:</span>
          <span className={currentAcc > 80 ? 'text-emerald-600 dark:text-emerald-400 font-bold font-mono' : 'text-rose-600 dark:text-rose-400 font-bold font-mono'}>
            Độ chính xác: {currentAcc}%
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={targetPos}
          onChange={(e) => setTargetPos(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
          <span>#1 (Đầu prompt - Primacy)</span>
          <span>#5 (Chính giữa)</span>
          <span>#10 (Cuối prompt - Recency)</span>
        </div>
      </div>

      {/* Visual representation of 10 slots */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 p-3.5 bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/[0.08] rounded-xl text-center">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((pos) => {
          const isSelected = targetPos === pos;
          const acc = calculateAccuracy(pos);
          return (
            <button
              key={pos}
              onClick={() => setTargetPos(pos)}
              className={`p-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-xs'
                  : acc > 80
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : 'border-slate-200 bg-white text-slate-600 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-400'
              }`}
            >
              <div className="text-[10px]">Doc #{pos}</div>
              <div className="font-bold text-[11px] mt-0.5">{acc}%</div>
            </button>
          );
        })}
      </div>

      <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl text-[11px] text-slate-700 dark:text-zinc-300 font-sans leading-relaxed">
        <strong>Kết luận thực chiến:</strong> Tài liệu đặt ở chính giữa cửa sổ ngữ cảnh bị giảm tới hơn 35% xác suất chú ý so với 2 rìa đầu và cuối! Luôn bố trí các chứng cứ quan trọng nhất ở đầu hoặc cuối prompt.
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Lock, FileCode2, Layers, Zap, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';

// ==========================================
// BÀI 6.1: CONSTRAINED DECODING & FSM
// ==========================================
export const Lesson6_1_ConstrainedDecoding: React.FC = () => {
  const [fsmState, setFsmState] = useState<'expect_key' | 'expect_colon' | 'expect_val'>('expect_val');

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            Outlines: FSM Grammar Logits Masking (Willard, 2023)
          </span>
        </div>
        <span className="text-blue-400 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 self-start sm:self-auto">
          Trạng thái FSM: {fsmState}
        </span>
      </div>

      <div className="p-3.5 bg-black/40 border border-white/[0.08] rounded-xl font-mono text-xs flex items-center gap-2">
        <span className="text-zinc-400">{'{ "status": '}</span>
        <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40 animate-pulse text-[11px]">
          [Đang sinh token kế tiếp...]
        </span>
      </div>

      <div className="space-y-2">
        <div className="text-[11px] text-zinc-400 font-sans">
          Can thiệp Logits Mask tại thời điểm sinh token:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
          <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 font-sans">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Token Hợp Lệ (Cho Phép)</span>
            </div>
            <div className="text-zinc-200 font-mono text-[11px]">&quot;SUCCESS&quot;, &quot;FAILED&quot;, true, false</div>
            <div className="text-[10px] text-emerald-400 font-mono">Logit = Giữ nguyên phân phối</div>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 font-sans">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Token Vi Phạm (Triệt Tiêu Cú Pháp)</span>
            </div>
            <div className="text-zinc-400 font-mono text-[11px]">&quot;abc&quot;, dấu hai chấm &quot;:&quot;, dấu phẩy &quot;,&quot;</div>
            <div className="text-[10px] text-rose-400 font-mono">Logit = -Infinity (Xác suất 0%)</div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-zinc-300 font-sans leading-relaxed">
        ✓ <strong>Bảo chứng toán học 100%:</strong> Mô hình không thể sinh ra JSON sai cú pháp vì các token vi phạm ngữ pháp đã bị triệt tiêu xác suất ngay trên logits của GPU!
      </div>
    </div>
  );
};

// ==========================================
// BÀI 6.2: AST SELF-HEALING JSON
// ==========================================
export const Lesson6_2_JsonHealer: React.FC = () => {
  const [isHealed, setIsHealed] = useState<boolean>(false);

  const broken = `\`\`\`json
{
  order_id: 'ORD-984',
  is_paid: True,
  items: ['server_rack', 'switch',],
}
\`\`\``;

  const healed = `{
  "order_id": "ORD-984",
  "is_paid": true,
  "items": [
    "server_rack",
    "switch"
  ]
}`;

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileCode2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            AST Self-Healing vs LLM Re-prompting
          </span>
        </div>
        <button
          onClick={() => setIsHealed(!isHealed)}
          className={`px-3 py-1.5 rounded-lg border text-[11px] font-sans font-bold transition-all cursor-pointer active:scale-95 self-start sm:self-auto ${
            isHealed
              ? 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
              : 'border-emerald-500/60 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
          }`}
        >
          {isHealed ? 'Xem lại JSON hỏng' : '⚡ Kích hoạt AST Healer (0.4ms)'}
        </button>
      </div>

      <pre className={`p-4 rounded-xl border text-xs leading-relaxed overflow-x-auto font-mono transition-all ${
        isHealed
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
          : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
      }`}>
        {isHealed ? healed : broken}
      </pre>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-center">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="text-[10px] text-emerald-400 uppercase font-mono font-bold tracking-wider">Local AST Healer</div>
          <div className="text-lg font-bold text-white mt-0.5 font-mono">0.4 mili-giây</div>
          <div className="text-[11px] text-emerald-300 font-sans mt-0.5">$0.00 chi phí token</div>
        </div>

        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <div className="text-[10px] text-rose-400 uppercase font-mono font-bold tracking-wider">LLM Re-Prompting</div>
          <div className="text-lg font-bold text-white mt-0.5 font-mono">~1,850 mili-giây</div>
          <div className="text-[11px] text-rose-300 font-sans mt-0.5">Tốn thêm 450 tokens</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// BÀI 6.3: CASCADE ROUTER & FRUGALGPT
// ==========================================
export const Lesson6_3_FrugalGpt: React.FC = () => {
  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            Mô hình tháp FrugalGPT Cascade Router (Stanford, 2023)
          </span>
        </div>
        <span className="text-emerald-400 text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-start sm:self-auto">
          Tiết kiệm 82% chi phí
        </span>
      </div>

      <div className="space-y-2.5">
        {/* Tier 1: Cheap Model */}
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="font-bold text-xs font-mono text-emerald-300">TẦNG 1: MÔ HÌNH NHỎ (GPT-4o-mini / Gemini Flash)</div>
            <div className="text-xs text-zinc-300 font-sans leading-relaxed">
              Xử lý 75% câu hỏi thông thường, phân loại ý định, trích xuất thực thể
            </div>
          </div>
          <div className="sm:text-right shrink-0">
            <div className="font-bold text-emerald-400 font-mono text-sm">$0.15 / 1M</div>
            <div className="text-[10px] text-zinc-400 font-mono">Độ trễ 250ms</div>
          </div>
        </div>

        {/* Tier 2: Expensive Model */}
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-black/40 text-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="font-bold text-xs font-mono text-amber-400">TẦNG 2: MÔ HÌNH ĐẦU BẢNG (GPT-4o / Claude Opus)</div>
            <div className="text-xs text-zinc-400 font-sans leading-relaxed">
              Chỉ leo thang xử lý 25% bài toán suy luận phức tạp, phân tích pháp lý
            </div>
          </div>
          <div className="sm:text-right shrink-0">
            <div className="font-bold text-amber-400 font-mono text-sm">$5.00 / 1M</div>
            <div className="text-[10px] text-zinc-500 font-mono">Độ trễ 1200ms</div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-zinc-300 font-sans leading-relaxed">
        ✓ <strong>Kết quả:</strong> Giữ nguyên chất lượng của mô hình mạnh nhất nhưng chi phí trung bình giảm từ $5.00 xuống chỉ còn $1.36 / 1M tokens!
      </div>
    </div>
  );
};

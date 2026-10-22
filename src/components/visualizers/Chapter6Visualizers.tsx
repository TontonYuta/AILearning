import React, { useState } from 'react';
import { Lock, FileCode2, Layers, Zap, CheckCircle2, RotateCcw } from 'lucide-react';

// ==========================================
// BÀI 6.1: CONSTRAINED DECODING & FSM
// ==========================================
export const Lesson6_1_ConstrainedDecoding: React.FC = () => {
  const [fsmState, setFsmState] = useState<'expect_key' | 'expect_colon' | 'expect_val'>('expect_val');

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          Outlines: FSM Grammar Logits Masking (Willard, 2023)
        </span>
        <span className="text-blue-400 text-[11px] font-bold">Trạng thái FSM: {fsmState}</span>
      </div>

      <div className="p-3 bg-[#09090b] border border-neutral-800 font-mono text-xs">
        <span className="text-neutral-400">{'{ "status": '}</span>
        <span className="bg-blue-950 text-blue-300 px-1 border border-blue-500 animate-pulse">[Đang sinh token tiếp theo]</span>
      </div>

      <div className="space-y-1.5">
        <div className="text-[11px] text-neutral-400">Can thiệp Logits Mask tại thời điểm sinh:</div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 border border-emerald-800 bg-emerald-950/20 text-emerald-300">
            <div className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Token Hợp Lệ (Cho Phép)
            </div>
            <div className="mt-1 text-neutral-300">"SUCCESS", "FAILED", true, false</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Logit = giữ nguyên</div>
          </div>

          <div className="p-2 border border-red-900 bg-red-950/20 text-red-300">
            <div className="font-bold">❌ Token Vi Phạm (Cấm Cú Pháp)</div>
            <div className="mt-1 text-neutral-400">"abc", dấu hai chấm ":", dấu phẩy ","</div>
            <div className="text-[10px] text-red-400 font-mono mt-0.5">Logit = -Infinity (Xác suất 0%)</div>
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-emerald-400">
        ✓ Bảo chứng toán học 100%: Mô hình không thể sinh ra JSON sai cú pháp vì các token sai đã bị triệt tiêu xác suất từ trong trứng nước!
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
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
          AST Self-Healing vs LLM Re-prompting
        </span>
        <button
          onClick={() => setIsHealed(!isHealed)}
          className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${isHealed ? 'bg-neutral-800 text-neutral-300' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
        >
          {isHealed ? 'Xem lại JSON hỏng' : '⚡ Kích hoạt AST Healer (0.4ms)'}
        </button>
      </div>

      <pre className={`p-3 bg-[#09090b] border text-xs leading-relaxed overflow-x-auto ${isHealed ? 'border-emerald-800 text-emerald-300' : 'border-red-900 text-red-300'}`}>
        {isHealed ? healed : broken}
      </pre>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2 bg-emerald-950/20 border border-emerald-900/60">
          <div className="text-[10px] text-emerald-400 uppercase font-bold">Local AST Healer</div>
          <div className="text-sm font-bold text-white mt-0.5">0.4 mili-giây</div>
          <div className="text-[10px] text-emerald-300">$0.00 chi phí token</div>
        </div>

        <div className="p-2 bg-red-950/20 border border-red-900/60">
          <div className="text-[10px] text-red-400 uppercase font-bold">LLM Re-Prompting</div>
          <div className="text-sm font-bold text-white mt-0.5">~1,850 mili-giây</div>
          <div className="text-[10px] text-red-300">Tốn thêm 450 tokens</div>
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
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          Mô hình tháp FrugalGPT Cascade Router (Stanford, 2023)
        </span>
        <span className="text-emerald-400 text-[11px] font-bold">Tiết kiệm 82% chi phí</span>
      </div>

      <div className="space-y-2">
        {/* Tier 1: Cheap Model */}
        <div className="p-2.5 border border-emerald-800 bg-emerald-950/30 text-emerald-200 flex items-center justify-between">
          <div>
            <div className="font-bold text-xs">TẦNG 1: MÔ HÌNH NHỎ (GPT-4o-mini / Gemini Flash)</div>
            <div className="text-[11px] text-neutral-300 font-sans">
              Xử lý 75% câu hỏi thông thường, phân loại, trích xuất thực thể
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-emerald-400">$0.15 / 1M</div>
            <div className="text-[10px] text-neutral-400">Độ trễ 250ms</div>
          </div>
        </div>

        {/* Tier 2: Expensive Model */}
        <div className="p-2.5 border border-amber-900 bg-neutral-900 text-neutral-300 flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-amber-400">TẦNG 2: MÔ HÌNH ĐẦU BẢNG (GPT-4o / Claude Opus)</div>
            <div className="text-[11px] text-neutral-400 font-sans">
              Chỉ leo thang xử lý 25% bài toán suy luận phức tạp, phân tích pháp lý
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-amber-400">$5.00 / 1M</div>
            <div className="text-[10px] text-neutral-400">Độ trễ 1200ms</div>
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-emerald-400">
        ✓ Kết quả: Giữ nguyên chất lượng của mô hình mạnh nhất nhưng chi phí trung bình giảm từ $5.00 xuống chỉ còn $1.36 / 1M tokens!
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FileCode2, Zap, CheckCircle2, RotateCcw } from 'lucide-react';

export const Lesson8JsonHealer: React.FC = () => {
  const [isHealed, setIsHealed] = useState<boolean>(false);

  const brokenJson = `\`\`\`json
{
  action: 'refund_customer',
  amount_vnd: 2500000,
  is_verified: True,
  reasons: ['damaged_box', 'late_delivery',],
}
\`\`\``;

  const healedJson = `{
  "action": "refund_customer",
  "amount_vnd": 2500000,
  "is_verified": true,
  "reasons": [
    "damaged_box",
    "late_delivery"
  ]
}`;

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
          Kỹ thuật Tự Vá JSON (AST Self-Healing)
        </span>
        <button
          onClick={() => setIsHealed(!isHealed)}
          className={`px-2.5 py-1 text-[11px] font-semibold transition-colors flex items-center gap-1 ${
            isHealed
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
        >
          {isHealed ? (
            <>
              <RotateCcw className="w-3 h-3" /> Xem lại JSON hỏng
            </>
          ) : (
            <>
              <Zap className="w-3 h-3" /> Kích hoạt AST Healer (0.4ms)
            </>
          )}
        </button>
      </div>

      {/* Code Display */}
      <div>
        <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
          <span>
            {isHealed ? 'Đầu ra đã được vá (100% Valid JSON):' : 'Đầu ra JSON bị lỗi từ LLM:'}
          </span>
          <span className={isHealed ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
            {isHealed ? '✓ RFC 8259 Standard' : '✗ JSON.parse() SyntaxError'}
          </span>
        </div>

        <pre
          className={`p-3 bg-[#09090b] border transition-colors overflow-x-auto text-xs leading-relaxed ${
            isHealed
              ? 'border-emerald-800/80 text-emerald-300'
              : 'border-red-900/60 text-red-300'
          }`}
        >
          {isHealed ? healedJson : brokenJson}
        </pre>
      </div>

      {/* Comparison Badge */}
      <div className="grid grid-cols-2 gap-2 text-center pt-1">
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

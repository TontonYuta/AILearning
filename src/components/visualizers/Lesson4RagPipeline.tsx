import React, { useState } from 'react';
import { Search, Database, FileText, Bot, ArrowRight, Play, RotateCcw } from 'lucide-react';

export const Lesson4RagPipeline: React.FC = () => {
  const [step, setStep] = useState<number>(0); // 0: Idle, 1: Retrieved, 2: Augmented, 3: Generated

  const handleNext = () => {
    setStep((prev) => (prev < 3 ? prev + 1 : 0));
  };

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          Pipeline RAG 3 Bước (Retrieve - Augment - Generate)
        </span>
        <button
          onClick={handleNext}
          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
        >
          {step === 3 ? (
            <>
              <RotateCcw className="w-3 h-3" /> Bắt đầu lại
            </>
          ) : (
            <>
              <Play className="w-3 h-3" /> Bước kế tiếp ({step + 1}/3)
            </>
          )}
        </button>
      </div>

      {/* Query Bar */}
      <div className="p-2.5 bg-[#09090b] border border-neutral-800 flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="text-neutral-400 text-[11px]">User Query:</span>
        <span className="text-neutral-100 font-sans font-medium text-xs">
          "Tôi muốn xin nghỉ phép 4 ngày thì cần thủ tục gì?"
        </span>
      </div>

      {/* 3 Step Visual Pipeline */}
      <div className="grid grid-cols-3 gap-2">
        {/* Step 1: Retrieve */}
        <div
          className={`p-2.5 border transition-all ${
            step >= 1
              ? 'border-emerald-600/80 bg-emerald-950/20 text-emerald-200'
              : 'border-neutral-800 bg-neutral-900/40 text-neutral-500'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
            <span>1. RETRIEVE</span>
            {step >= 1 && <span className="text-emerald-400">✓ Done</span>}
          </div>
          <p className="font-sans text-[11px] leading-relaxed">
            {step >= 1
              ? 'Tìm thấy 2 chunks từ Vector DB: "Nghỉ quá 3 ngày cần duyệt của Trưởng bộ phận".'
              : 'Chờ truy vấn Vector Database...'}
          </p>
        </div>

        {/* Step 2: Augment */}
        <div
          className={`p-2.5 border transition-all ${
            step >= 2
              ? 'border-blue-600/80 bg-blue-950/20 text-blue-200'
              : 'border-neutral-800 bg-neutral-900/40 text-neutral-500'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
            <span>2. AUGMENT</span>
            {step >= 2 && <span className="text-blue-400">✓ Done</span>}
          </div>
          <p className="font-sans text-[11px] leading-relaxed">
            {step >= 2
              ? 'Ghép 2 chunks vào Prompt context của mô hình để làm bằng chứng (Grounding).'
              : 'Chờ ghép ngữ cảnh vào Prompt...'}
          </p>
        </div>

        {/* Step 3: Generate */}
        <div
          className={`p-2.5 border transition-all ${
            step >= 3
              ? 'border-amber-600/80 bg-amber-950/20 text-amber-200'
              : 'border-neutral-800 bg-neutral-900/40 text-neutral-500'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
            <span>3. GENERATE</span>
            {step >= 3 && <span className="text-amber-400">✓ Done</span>}
          </div>
          <p className="font-sans text-[11px] leading-relaxed">
            {step >= 3
              ? 'LLM sinh câu trả lời chính xác, kèm trích dẫn [Nguồn: Điều 4 Quy chế].'
              : 'Chờ LLM sinh phản hồi...'}
          </p>
        </div>
      </div>

      {/* Generated Result Box */}
      {step === 3 && (
        <div className="p-3 bg-emerald-950/30 border border-emerald-800/80 space-y-1">
          <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" /> Phản hồi từ mô hình RAG:
          </div>
          <p className="font-sans text-xs text-neutral-200 leading-relaxed">
            "Theo quy chế nội bộ, bạn được nghỉ 12 ngày/năm. Vì bạn xin nghỉ <strong>4 ngày</strong> (vượt quá 3 ngày), bạn bắt buộc phải có sự phê duyệt từ Trưởng bộ phận trước khi gửi đơn lên HR."
          </p>
          <div className="text-[10px] text-emerald-400 pt-1">
            ✓ Trích dẫn: [Quy chế nhân sự - Chunk #2] · Không bị ảo giác (Zero Hallucination)
          </div>
        </div>
      )}
    </div>
  );
};

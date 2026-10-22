import React, { useState } from 'react';
import { Zap, Cpu, Database, Clock, ArrowRight } from 'lucide-react';

// ==========================================
// BÀI 7.1: SEMANTIC CACHING WATERFALL
// ==========================================
export const Lesson7_1_SemanticCache: React.FC = () => {
  const [cacheHit, setCacheHit] = useState<boolean>(true);

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Biểu đồ thác nước độ trễ (Latency Waterfall)
        </span>
        <button
          onClick={() => setCacheHit(!cacheHit)}
          className={`px-2 py-0.5 border text-[11px] font-bold ${cacheHit ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-neutral-800 bg-neutral-900 text-neutral-400'}`}
        >
          {cacheHit ? 'Mô phỏng CACHE HIT' : 'Mô phỏng CACHE MISS'}
        </button>
      </div>

      <div className="space-y-3 p-3 bg-[#09090b] border border-neutral-800">
        <div>
          <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
            <span>LLM Roundtrip qua Internet (OpenAI / Claude API):</span>
            <span className="text-red-400 font-bold">880 mili-giây</span>
          </div>
          <div className="h-4 bg-neutral-900 overflow-hidden">
            <div className="h-full bg-red-600/80 w-[95%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
            <span>Semantic Cache Hit (Redis In-Memory Vector Search):</span>
            <span className="text-emerald-400 font-bold">14 mili-giây (Nhanh hơn 98.4%)</span>
          </div>
          <div className="h-4 bg-neutral-900 overflow-hidden">
            <div className="h-full bg-emerald-500 w-[6%]" />
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px]">
        {cacheHit ? (
          <span className="text-emerald-400">
            ✓ Trả lời khách hàng trong 14ms! Hoàn toàn không tốn token LLM, tiết kiệm 100% chi phí.
          </span>
        ) : (
          <span className="text-neutral-300">
            Cache Miss: Gọi LLM (880ms) và tự động ghi kết quả vào Semantic Cache cho lần sau.
          </span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// BÀI 7.2: VLLM PAGEDATTENTION BLOCK TABLE
// ==========================================
export const Lesson7_2_PagedAttention: React.FC = () => {
  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          vLLM PagedAttention: Virtual Memory Block Table (Kwon, 2023)
        </span>
        <span className="text-emerald-400 text-[11px] font-bold">0% Lãng phí VRAM</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Logical Tokens */}
        <div className="p-2.5 bg-[#09090b] border border-neutral-800 space-y-1.5">
          <div className="text-[10px] text-neutral-400 uppercase font-bold">Logical Tokens (Chuỗi liên tục)</div>
          <div className="flex gap-1 text-[11px]">
            <span className="p-1 border border-blue-500 bg-blue-950/40 text-blue-200">Tok 0-3</span>
            <span className="p-1 border border-blue-500 bg-blue-950/40 text-blue-200">Tok 4-7</span>
            <span className="p-1 border border-blue-500 bg-blue-950/40 text-blue-200">Tok 8-11</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Khối trang ảo: Block 0, 1, 2</div>
        </div>

        {/* Physical VRAM Blocks */}
        <div className="p-2.5 bg-[#09090b] border border-neutral-800 space-y-1.5">
          <div className="text-[10px] text-neutral-400 uppercase font-bold">Physical VRAM GPU (Rời rạc)</div>
          <div className="flex gap-1 text-[11px]">
            <span className="p-1 border border-emerald-500 bg-emerald-950/40 text-emerald-200">Phy #7</span>
            <span className="p-1 border border-emerald-500 bg-emerald-950/40 text-emerald-200">Phy #1</span>
            <span className="p-1 border border-emerald-500 bg-emerald-950/40 text-emerald-200">Phy #9</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Ánh xạ linh hoạt, không phân mảnh</div>
        </div>
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-emerald-400">
        ✓ Triệt tiêu 80% lãng phí VRAM. Cho phép GPU chạy số lượng request đồng thời (Concurrent Batch Size) tăng gấp 3–4 lần!
      </div>
    </div>
  );
};

// ==========================================
// BÀI 7.3: PROMPT CACHING (PREFIX CACHING)
// ==========================================
export const Lesson7_3_PromptCache: React.FC = () => {
  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          Tiết kiệm chi phí với Prefix Prompt Caching (Anthropic/Gemini)
        </span>
        <span className="text-emerald-400 text-[11px] font-bold">Giảm 90% giá Token</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 bg-red-950/20 border border-red-900">
          <div className="text-[10px] text-red-400 uppercase font-bold">Không bật Prompt Caching</div>
          <div className="text-base font-bold text-white mt-1">$3.00 / request</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Mỗi lần gọi đều tính tiền lại 100k tokens tĩnh</div>
        </div>

        <div className="p-3 bg-emerald-950/20 border border-emerald-800">
          <div className="text-[10px] text-emerald-400 uppercase font-bold">Có bật Prefix Caching</div>
          <div className="text-base font-bold text-emerald-300 mt-1">$0.30 / request</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Giảm giá 90% cho 100k tokens đã cache sẵn</div>
        </div>
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
        Quy tắc bất biến: Luôn đặt System Prompt dài và tài liệu tĩnh ở đầu; đặt câu hỏi biến thiên của user ở cuối cùng để giữ nguyên chuỗi tiền tố cache.
      </div>
    </div>
  );
};

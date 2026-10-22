import React, { useState } from 'react';
import { Zap, Cpu, Database, Clock, ArrowRight } from 'lucide-react';

// ==========================================
// BÀI 7.1: SEMANTIC CACHING WATERFALL
// ==========================================
export const Lesson7_1_SemanticCache: React.FC = () => {
  const [cacheHit, setCacheHit] = useState<boolean>(true);

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            Biểu đồ thác nước độ trễ (Latency Waterfall)
          </span>
        </div>
        <button
          onClick={() => setCacheHit(!cacheHit)}
          className={`px-3 py-1 rounded-full border text-[11px] font-sans font-medium transition-all cursor-pointer self-start sm:self-auto ${
            cacheHit
              ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200 font-semibold shadow-sm shadow-emerald-500/20'
              : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          {cacheHit ? '✓ Mô phỏng CACHE HIT' : 'Mô phỏng CACHE MISS'}
        </button>
      </div>

      <div className="space-y-3.5 p-4 bg-black/40 border border-white/[0.08] rounded-xl font-sans">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-zinc-300">
            <span>LLM Roundtrip qua Internet (OpenAI / Claude API):</span>
            <span className="text-rose-400 font-bold font-mono">880 mili-giây</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-rose-500/80 rounded-full w-[95%] transition-all duration-500" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-zinc-300">
            <span>Semantic Cache Hit (Redis In-Memory Vector Search):</span>
            <span className="text-emerald-400 font-bold font-mono">14 mili-giây (Nhanh hơn 98.4%)</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-emerald-500 rounded-full w-[6%] transition-all duration-500" />
          </div>
        </div>
      </div>

      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-zinc-300 font-sans leading-relaxed">
        {cacheHit ? (
          <span className="text-emerald-300">
            ✓ Trả lời khách hàng chỉ trong 14ms! Hoàn toàn không tốn token LLM, tiết kiệm 100% chi phí gọi mô hình đám mây.
          </span>
        ) : (
          <span className="text-zinc-300">
            Cache Miss: Gọi LLM đám mây (880ms) và tự động ghi kết quả vào Semantic Cache cho các yêu cầu tương đương kế tiếp.
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
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            vLLM PagedAttention: Virtual Memory Block Table (Kwon, 2023)
          </span>
        </div>
        <span className="text-emerald-400 text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-start sm:self-auto">
          0% Lãng phí VRAM
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Logical Tokens */}
        <div className="p-3.5 bg-black/40 border border-white/[0.08] rounded-xl space-y-2">
          <div className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider font-semibold">Logical Tokens (Chuỗi liên tục)</div>
          <div className="flex gap-1.5 text-xs">
            <span className="px-2.5 py-1 rounded-lg border border-blue-500/40 bg-blue-500/15 text-blue-200 font-mono">Tok 0-3</span>
            <span className="px-2.5 py-1 rounded-lg border border-blue-500/40 bg-blue-500/15 text-blue-200 font-mono">Tok 4-7</span>
            <span className="px-2.5 py-1 rounded-lg border border-blue-500/40 bg-blue-500/15 text-blue-200 font-mono">Tok 8-11</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-sans">Khối trang ảo: Block 0, 1, 2</div>
        </div>

        {/* Physical VRAM Blocks */}
        <div className="p-3.5 bg-black/40 border border-white/[0.08] rounded-xl space-y-2">
          <div className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider font-semibold">Physical VRAM GPU (Rời rạc)</div>
          <div className="flex gap-1.5 text-xs">
            <span className="px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-200 font-mono">Phy #7</span>
            <span className="px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-200 font-mono">Phy #1</span>
            <span className="px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-200 font-mono">Phy #9</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-sans">Ánh xạ linh hoạt, chống phân mảnh</div>
        </div>
      </div>

      <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[11px] text-zinc-300 font-sans leading-relaxed">
        ✓ Triệt tiêu 80% lãng phí VRAM. Cho phép máy chủ tăng số lượng request xử lý song song (Concurrent Batch Size) lên gấp 3–4 lần trên cùng phần cứng!
      </div>
    </div>
  );
};

// ==========================================
// BÀI 7.3: PROMPT CACHING (PREFIX CACHING)
// ==========================================
export const Lesson7_3_PromptCache: React.FC = () => {
  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Database className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            Tiết kiệm chi phí với Prefix Prompt Caching (Anthropic/Gemini)
          </span>
        </div>
        <span className="text-emerald-400 text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-start sm:self-auto">
          Giảm 90% giá Token
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <div className="text-[10px] text-rose-400 uppercase font-mono font-bold tracking-wider">Không bật Prompt Caching</div>
          <div className="text-xl font-bold text-white mt-1 font-mono">$3.00 / request</div>
          <div className="text-[11px] text-zinc-400 mt-1 font-sans">Mỗi lần gọi đều tính tiền lại 100k tokens tĩnh</div>
        </div>

        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="text-[10px] text-emerald-400 uppercase font-mono font-bold tracking-wider">Có bật Prefix Caching</div>
          <div className="text-xl font-bold text-emerald-300 mt-1 font-mono">$0.30 / request</div>
          <div className="text-[11px] text-emerald-300 mt-1 font-sans">Giảm giá 90% cho 100k tokens đã lưu cache</div>
        </div>
      </div>

      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-zinc-300 font-sans leading-relaxed">
        <strong className="text-indigo-300">Quy tắc vàng:</strong> Luôn đặt System Prompt dài và tài liệu tĩnh ở đầu; đặt câu hỏi biến thiên của user ở cuối cùng để giữ nguyên chuỗi tiền tố cache.
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Award, Compass, Activity, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

// ==========================================
// BÀI 8.1: LLM JUDGE BIAS MITIGATION
// ==========================================
export const Lesson8_1_LlmJudge: React.FC = () => {
  const [swapped, setSwapped] = useState<boolean>(false);

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Award className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-900 dark:text-white font-semibold font-sans text-xs sm:text-sm">
            LLM-as-a-Judge: Khử Position & Verbosity Bias (LMSYS, 2023)
          </span>
        </div>
        <button
          onClick={() => setSwapped(!swapped)}
          className={`px-3 py-1 rounded-full border text-[11px] font-sans font-medium transition-all cursor-pointer self-start sm:self-auto ${
            swapped
              ? 'border-blue-500/60 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200 font-semibold shadow-xs'
              : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {swapped ? '✓ Đang tráo đổi B ⟷ A' : 'Thứ tự gốc A ⟷ B'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.08] rounded-xl space-y-1.5">
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase font-mono tracking-wider">
            Vị trí 1: {swapped ? 'Mẫu B (Súc tích, trọng tâm)' : 'Mẫu A (Dài dòng, sáo rỗng)'}
          </div>
          <p className="text-slate-800 dark:text-zinc-200 font-sans text-xs leading-relaxed">
            {swapped ? '"Mật khẩu cần tối thiểu 8 ký tự và ít nhất 1 chữ số."' : '"Theo chuẩn ISO bảo mật thông tin, việc thiết lập mật khẩu an toàn là việc tối quan trọng..."'}
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.08] rounded-xl space-y-1.5">
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase font-mono tracking-wider">
            Vị trí 2: {swapped ? 'Mẫu A (Dài dòng, sáo rỗng)' : 'Mẫu B (Súc tích, trọng tâm)'}
          </div>
          <p className="text-slate-800 dark:text-zinc-200 font-sans text-xs leading-relaxed">
            {swapped ? '"Theo chuẩn ISO bảo mật thông tin, việc thiết lập mật khẩu an toàn là việc tối quan trọng..."' : '"Mật khẩu cần tối thiểu 8 ký tự và ít nhất 1 chữ số."'}
          </p>
        </div>
      </div>

      <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl text-[11px] text-slate-700 dark:text-zinc-300 font-sans leading-relaxed">
        <strong className="text-indigo-700 dark:text-indigo-300">Khử thiên kiến bằng Pairwise Swapping:</strong> Chấm 2 lượt hoán đổi vị trí A/B và trừ điểm Verbosity Bias nếu câu trả lời chỉ dài mà thiếu thông tin hữu ích.
      </div>
    </div>
  );
};

// ==========================================
// BÀI 8.2: RAG TRIAD (TRULENS / RAGAS)
// ==========================================
export const Lesson8_2_RagTriad: React.FC = () => {
  const [groundedness, setGroundedness] = useState<number>(0.35);

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-900 dark:text-white font-semibold font-sans text-xs sm:text-sm">
            Bộ 3 chỉ số RAG Triad (TruLens / Ragas)
          </span>
        </div>
        <button
          onClick={() => setGroundedness(groundedness < 0.5 ? 0.95 : 0.35)}
          className={`px-3 py-1 rounded-full border text-[11px] font-sans font-medium transition-all cursor-pointer self-start sm:self-auto ${
            groundedness < 0.5
              ? 'border-rose-500/60 bg-rose-50 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200 font-semibold shadow-xs'
              : 'border-emerald-500/60 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200 font-semibold shadow-xs'
          }`}
        >
          {groundedness < 0.5 ? 'Thử bật: BẰNG CHỨNG ĐẦY ĐỦ' : 'Thử bật: MÔ PHỎNG ẢO GIÁC'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
        {/* Context Relevance */}
        <div className="p-3 bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.08] rounded-xl">
          <div className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-mono tracking-wider">Context Relevance</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">0.92 / 1.0</div>
          <div className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5 font-sans">Retriever chuẩn xác</div>
        </div>

        {/* Groundedness */}
        <div className={`p-3 rounded-xl border transition-all ${
          groundedness < 0.5 ? 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-500/60 dark:bg-rose-500/10 dark:text-rose-300' : 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-300'
        }`}>
          <div className="text-[10px] uppercase font-mono tracking-wider font-bold">Groundedness</div>
          <div className="text-lg font-bold mt-1 font-mono">{(groundedness).toFixed(2)} / 1.0</div>
          <div className="text-[11px] mt-0.5 font-sans font-semibold">{groundedness < 0.5 ? '❌ Hallucination!' : '✓ Đầy đủ bằng chứng'}</div>
        </div>

        {/* Answer Relevance */}
        <div className="p-3 bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.08] rounded-xl">
          <div className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-mono tracking-wider">Answer Relevance</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">0.88 / 1.0</div>
          <div className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5 font-sans">Đúng trọng tâm câu hỏi</div>
        </div>
      </div>

      <div className={`p-3.5 rounded-xl border text-xs font-sans leading-relaxed ${
        groundedness < 0.5 ? 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200' : 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200'
      }`}>
        {groundedness < 0.5 ? (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <span><strong>CẢNH BÁO:</strong> Groundedness thấp! Mô hình đang bịa đặt thông tin ngoài tài liệu dù câu trả lời đọc rất trôi chảy. Cần siết chặt System Prompt và temperature!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span><strong>HỆ THỐNG ĐẠT CHUẨN:</strong> Cả 3 chỉ số RAG Triad đều trên 0.85. Sẵn sàng vận hành ở môi trường Production!</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// BÀI 8.3: TRACING & OPENTELEMETRY
// ==========================================
export const Lesson8_3_Tracing: React.FC = () => {
  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-900 dark:text-white font-semibold font-sans text-xs sm:text-sm">
            Cây Trace & Span Gantt Chart (OpenTelemetry / Langfuse)
          </span>
        </div>
        <span className="text-slate-500 dark:text-zinc-400 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 self-start sm:self-auto">
          Trace ID: tr-9a84f2b1
        </span>
      </div>

      <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.08] rounded-xl font-mono">
        {/* Span 1: Root */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-sans">
            <span className="font-bold text-slate-900 dark:text-white">Root: user_query_session</span>
            <span className="text-slate-500 dark:text-zinc-400 font-mono text-[11px]">Tổng cộng: 742ms • $0.0031</span>
          </div>
          <div className="h-2.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-full" />
          </div>
        </div>

        {/* Span 2: Child Retrieval */}
        <div className="space-y-1 pl-3 border-l-2 border-slate-300 dark:border-white/10">
          <div className="flex justify-between text-[11px] font-sans">
            <span className="text-emerald-700 dark:text-emerald-400 font-mono">Span: qdrant_vector_retrieval</span>
            <span className="text-slate-400 dark:text-zinc-500 font-mono">32ms</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[12%]" />
          </div>
        </div>

        {/* Span 3: Child Tool Call */}
        <div className="space-y-1 pl-3 border-l-2 border-slate-300 dark:border-white/10">
          <div className="flex justify-between text-[11px] font-sans">
            <span className="text-amber-700 dark:text-amber-400 font-mono">Span: tool_sql_sandbox</span>
            <span className="text-slate-400 dark:text-zinc-500 font-mono">30ms</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-[8%] ml-[12%]" />
          </div>
        </div>

        {/* Span 4: Child LLM Call */}
        <div className="space-y-1 pl-3 border-l-2 border-slate-300 dark:border-white/10">
          <div className="flex justify-between text-[11px] font-sans">
            <span className="text-indigo-700 dark:text-indigo-400 font-mono">Span: llm_generate_response</span>
            <span className="text-slate-500 dark:text-zinc-400 font-mono">680ms • 524 tokens</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full w-[80%] ml-[20%]" />
          </div>
        </div>
      </div>

      <div className="p-3 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-xl text-[11px] text-cyan-900 dark:text-cyan-300 font-sans leading-relaxed">
        ✓ <strong>Phát hiện ngay nút thắt cổ chai:</strong> Bước LLM Generation chiếm 91% thời gian (680ms), trong khi Vector Search chỉ mất 32ms.
      </div>
    </div>
  );
};

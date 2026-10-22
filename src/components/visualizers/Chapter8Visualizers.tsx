import React, { useState } from 'react';
import { Award, Compass, Activity, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

// ==========================================
// BÀI 8.1: LLM JUDGE BIAS MITIGATION
// ==========================================
export const Lesson8_1_LlmJudge: React.FC = () => {
  const [swapped, setSwapped] = useState<boolean>(false);

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-blue-400" />
          LLM-as-a-Judge: Khử Position & Verbosity Bias (LMSYS, 2023)
        </span>
        <button
          onClick={() => setSwapped(!swapped)}
          className="px-2 py-0.5 border border-blue-500 bg-blue-950/40 text-blue-200 text-[11px] font-bold"
        >
          {swapped ? 'Đang tráo đổi B ⟷ A' : 'Thứ tự gốc A ⟷ B'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 bg-[#09090b] border border-neutral-800 space-y-1">
          <div className="text-[10px] text-blue-400 font-bold">
            Vị trí 1: {swapped ? 'Mẫu B (Ngắn, trúng đích)' : 'Mẫu A (Dài dòng, lan man)'}
          </div>
          <p className="text-neutral-300 font-sans text-[11px]">
            {swapped ? '"Mật khẩu cần tối thiểu 8 ký tự và 1 số."' : '"Theo tiêu chuẩn ISO bảo mật thông tin, việc thiết lập mật khẩu an toàn là việc tối quan trọng..."'}
          </p>
        </div>

        <div className="p-2.5 bg-[#09090b] border border-neutral-800 space-y-1">
          <div className="text-[10px] text-amber-400 font-bold">
            Vị trí 2: {swapped ? 'Mẫu A (Dài dòng, lan man)' : 'Mẫu B (Ngắn, trúng đích)'}
          </div>
          <p className="text-neutral-300 font-sans text-[11px]">
            {swapped ? '"Theo tiêu chuẩn ISO bảo mật thông tin, việc thiết lập mật khẩu an toàn là việc tối quan trọng..."' : '"Mật khẩu cần tối thiểu 8 ký tự và 1 số."'}
          </p>
        </div>
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
        Khử thiên kiến bằng kỹ thuật Pairwise Swapping: Chấm 2 lượt hoán đổi vị trí A/B và phạt điểm Verbosity Bias nếu câu văn dài nhưng sáo rỗng.
      </div>
    </div>
  );
};

// ==========================================
// BÀI 8.2: RAG TRIAD (TRULENS / RAGAS)
// ==========================================
export const Lesson8_2_RagTriad: React.FC = () => {
  const [groundedness, setGroundedness] = useState<number>(0.35); // simulated hallucination

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          Bộ 3 chỉ số RAG Triad (TruLens / Ragas)
        </span>
        <button
          onClick={() => setGroundedness(groundedness < 0.5 ? 0.95 : 0.35)}
          className="px-2 py-0.5 border text-[11px] font-bold border-neutral-700 bg-neutral-900 text-neutral-300"
        >
          {groundedness < 0.5 ? 'Mô phỏng ẢO GIÁC' : 'Mô phỏng BẰNG CHỨNG ĐẦY ĐỦ'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Context Relevance */}
        <div className="p-2.5 bg-[#09090b] border border-neutral-800">
          <div className="text-[10px] text-neutral-500 uppercase">Context Relevance</div>
          <div className="text-sm font-bold text-emerald-400 mt-1">0.92 / 1.0</div>
          <div className="text-[9px] text-neutral-400 mt-0.5">Retriever chuẩn</div>
        </div>

        {/* Groundedness */}
        <div className={`p-2.5 bg-[#09090b] border ${groundedness < 0.5 ? 'border-red-700 text-red-300' : 'border-emerald-700 text-emerald-300'}`}>
          <div className="text-[10px] uppercase font-bold">Groundedness</div>
          <div className="text-sm font-bold mt-1">{(groundedness).toFixed(2)} / 1.0</div>
          <div className="text-[9px] mt-0.5">{groundedness < 0.5 ? '❌ Hallucination!' : '✓ Đầy đủ bằng chứng'}</div>
        </div>

        {/* Answer Relevance */}
        <div className="p-2.5 bg-[#09090b] border border-neutral-800">
          <div className="text-[10px] text-neutral-500 uppercase">Answer Relevance</div>
          <div className="text-sm font-bold text-emerald-400 mt-1">0.88 / 1.0</div>
          <div className="text-[9px] text-neutral-400 mt-0.5">Trúng câu hỏi user</div>
        </div>
      </div>

      <div className={`p-2.5 border text-[11px] ${groundedness < 0.5 ? 'border-red-900/60 bg-red-950/20 text-red-200' : 'border-emerald-900/60 bg-emerald-950/20 text-emerald-200'}`}>
        {groundedness < 0.5 ? (
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            CHẨN ĐOÁN LỖI: Groundedness thấp! Mô hình đang "bịa đặt" thông tin ngoài tài liệu dù trả lời có vẻ trúng câu hỏi. Cần siết chặt System Prompt!
          </div>
        ) : (
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            HỆ THỐNG ĐẠT CHUẨN: Toàn bộ 3 chỉ số RAG Triad đều trên 0.85. Sẵn sàng cho Production!
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
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Cây Trace & Span Gantt Chart (OpenTelemetry / Langfuse)
        </span>
        <span className="text-neutral-400 text-[11px]">Trace: tr-9a84f2b1</span>
      </div>

      <div className="space-y-2 p-2.5 bg-[#09090b] border border-neutral-800">
        {/* Span 1: Root */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[11px]">
            <span className="font-bold text-neutral-200">Root: user_query_session</span>
            <span className="text-neutral-400">Total: 742ms • $0.0031</span>
          </div>
          <div className="h-2 bg-neutral-800 w-full overflow-hidden">
            <div className="h-full bg-blue-500 w-full" />
          </div>
        </div>

        {/* Span 2: Child Retrieval */}
        <div className="space-y-0.5 pl-3 border-l border-neutral-800">
          <div className="flex justify-between text-[10px]">
            <span className="text-emerald-400">Span: qdrant_vector_retrieval</span>
            <span className="text-neutral-500">32ms</span>
          </div>
          <div className="h-1.5 bg-neutral-900 w-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[12%]" />
          </div>
        </div>

        {/* Span 3: Child Tool Call */}
        <div className="space-y-0.5 pl-3 border-l border-neutral-800">
          <div className="flex justify-between text-[10px]">
            <span className="text-amber-400">Span: tool_sql_sandbox</span>
          </div>
          <div className="h-1.5 bg-neutral-900 w-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[8%] ml-[12%]" />
          </div>
        </div>

        {/* Span 4: Child LLM Call */}
        <div className="space-y-0.5 pl-3 border-l border-neutral-800">
          <div className="flex justify-between text-[10px]">
            <span className="text-indigo-400">Span: llm_generate_response</span>
            <span className="text-neutral-400">680ms • 524 tokens</span>
          </div>
          <div className="h-1.5 bg-neutral-900 w-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[80%] ml-[20%]" />
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-emerald-400">
        ✓ Phát hiện ngay nút thắt cổ chai: Bước LLM Generation chiếm 91% thời gian (680ms), trong khi Vector Search chỉ mất 32ms.
      </div>
    </div>
  );
};

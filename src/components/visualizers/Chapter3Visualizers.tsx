import React, { useState } from 'react';
import { Layers, ListFilter, Sparkles, RefreshCw, CheckCircle, ArrowDown } from 'lucide-react';

// ==========================================
// BÀI 3.1: PARENT-CHILD CHUNKING
// ==========================================
export const Lesson3_1_ParentChild: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState<number>(2);

  const parentDoc = `[QUY CHẾ SỐ 402 - ĐIỀU 14: CHÍNH SÁCH BẢO HIỂM DOANH NGHIỆP]
Toàn bộ nhân sự chính thức được hưởng bảo hiểm y tế tự nguyện và gói bảo hiểm tai nạn 24/7.
Đối với trường hợp điều trị nội trú, mức chi trả tối đa là 50.000.000 VNĐ/năm.
Nhân sự thử việc chưa được áp dụng chính sách này cho đến khi ký hợp đồng lao động chính thức.`;

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            Kiến trúc Parent-Child (Small-to-Big Retrieval)
          </span>
        </div>
        <span className="text-emerald-400 text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-start sm:self-auto">
          Chọn chunk con để xem chunk cha
        </span>
      </div>

      {/* Child Chunks (Index search) */}
      <div className="space-y-2">
        <div className="text-[11px] text-zinc-400 font-sans font-medium">
          1. CHUNKS CON (Child Chunks - Lưu trong Vector DB để tìm kiếm sắc nét):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { id: 1, text: 'Bảo hiểm y tế tự nguyện & tai nạn 24/7' },
            { id: 2, text: 'Điều trị nội trú tối đa 50.000.000 VNĐ/năm' },
            { id: 3, text: 'Nhân sự thử việc chưa áp dụng' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChild(c.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedChild === c.id
                  ? 'border-blue-500/60 bg-blue-500/15 text-blue-200 font-semibold shadow-sm shadow-blue-500/15'
                  : 'border-white/[0.08] bg-black/40 text-zinc-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="text-[10px] text-blue-400 font-mono">Child #{c.id}</div>
              <div className="text-xs font-sans mt-1 line-clamp-2 leading-snug">{c.text}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Connection arrow */}
      <div className="flex justify-center text-zinc-500">
        <ArrowDown className="w-4 h-4 text-blue-400 animate-bounce" />
      </div>

      {/* Parent Document (Returned to LLM) */}
      <div className="space-y-2">
        <div className="text-[11px] text-zinc-400 font-sans font-medium">
          2. CHUNK CHA (Parent Context - Tự động nạp vào prompt cho LLM):
        </div>
        <div className="p-4 bg-black/40 border border-blue-500/30 rounded-xl font-sans text-xs text-zinc-200 leading-relaxed space-y-2.5">
          <p className="border-l-2 border-blue-500 pl-3 text-zinc-300 font-mono text-[11px] whitespace-pre-line leading-relaxed">
            {parentDoc}
          </p>
          <div className="text-[11px] text-emerald-400 font-sans font-medium flex items-center gap-1.5 pt-1">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>LLM nhận trọn vẹn ngữ cảnh điều kiện &quot;Nhân sự thử việc chưa được áp dụng&quot; thay vì chỉ nhận trích đoạn cụt ngủn 50 triệu!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// BÀI 3.2: CROSS-ENCODER RERANKING & RRF
// ==========================================
export const Lesson3_2_RerankRRF: React.FC = () => {
  const [isReranked, setIsReranked] = useState<boolean>(false);

  const rawDocs = [
    { id: 1, title: 'Tổng quan công ty và lịch sử thành lập', initialRank: 1, rerankRank: 18, score: 0.12 },
    { id: 2, title: 'Hướng dẫn cài đặt môi trường Docker dev', initialRank: 2, rerankRank: 8, score: 0.45 },
    { id: 3, title: 'Quy trình xử lý sự cố Database Failover SRE', initialRank: 8, rerankRank: 1, score: 0.98 },
    { id: 4, title: 'Chính sách bảo mật thẻ tín dụng PCI-DSS', initialRank: 14, rerankRank: 2, score: 0.94 },
  ];

  const displayList = isReranked
    ? [...rawDocs].sort((a, b) => a.rerankRank - b.rerankRank)
    : rawDocs;

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ListFilter className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            Two-Stage Retrieval: Bi-Encoder vs Cross-Encoder
          </span>
        </div>
        <button
          onClick={() => setIsReranked(!isReranked)}
          className={`px-3 py-1 rounded-full border text-[11px] font-sans font-medium transition-all cursor-pointer self-start sm:self-auto ${
            isReranked
              ? 'border-amber-500/60 bg-amber-500/20 text-amber-200 font-semibold shadow-sm shadow-amber-500/20'
              : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          {isReranked ? '✓ Đang bật Rerank' : '⚡ Kích hoạt Cross-Encoder Rerank'}
        </button>
      </div>

      <div className="space-y-2">
        <div className="text-[11px] text-zinc-400 font-sans">
          Truy vấn mẫu: <span className="text-zinc-200 font-semibold">&quot;Quy trình xử lý sự cố cơ sở dữ liệu bị sập&quot;</span>
        </div>

        <div className="space-y-1.5">
          {displayList.map((d) => (
            <div
              key={d.id}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                isReranked && d.rerankRank <= 2
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 shadow-sm shadow-emerald-500/10'
                  : 'border-white/[0.06] bg-black/40 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                  isReranked && d.rerankRank <= 2 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-zinc-400'
                }`}>
                  #{isReranked ? d.rerankRank : d.initialRank}
                </span>
                <span className="font-sans text-xs text-zinc-200">{d.title}</span>
              </div>
              <div className="text-[11px] font-mono shrink-0 pl-2">
                {isReranked ? (
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-emerald-300 border border-emerald-500/20">
                    Score: {d.score.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-zinc-500 text-[10px]">Bi-Encoder</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-zinc-300 font-sans leading-relaxed">
        {isReranked ? (
          <span className="text-emerald-300">
            ✓ Cross-Encoder đã phân tích đồng thời câu hỏi và văn bản, đẩy tài liệu &quot;Database Failover&quot; từ vị trí #8 lên vị trí #1 chính xác tuyệt đối!
          </span>
        ) : (
          <span>Danh sách thô ban đầu do Bi-Encoder trả về bị lẫn các bài viết chung chung lên top đầu do trùng một vài từ khóa đơn giản.</span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// BÀI 3.3: SELF-RAG & CORRECTIVE RAG (CRAG)
// ==========================================
export const Lesson3_3_SelfRAG: React.FC = () => {
  const [scenario, setScenario] = useState<'valid' | 'invalid'>('invalid');

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold font-sans text-xs sm:text-sm">
            Luồng tự phản biện Self-RAG & CRAG Fallback
          </span>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setScenario('invalid')}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-sans transition-all cursor-pointer ${
              scenario === 'invalid'
                ? 'border-amber-500/60 bg-amber-500/20 text-amber-200 font-semibold shadow-sm shadow-amber-500/20'
                : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            Ca 1: Vector DB lỗi thời
          </button>
          <button
            onClick={() => setScenario('valid')}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-sans transition-all cursor-pointer ${
              scenario === 'valid'
                ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200 font-semibold shadow-sm shadow-emerald-500/20'
                : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            Ca 2: Vector DB chuẩn xác
          </button>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="p-4 bg-black/40 border border-white/[0.08] rounded-xl space-y-3 font-sans">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>Query: &quot;Giá cổ phiếu VinFast hôm nay?&quot;</span>
          <span className="text-blue-400 font-semibold">[Retrieve: Yes]</span>
        </div>

        <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-between text-xs">
          <span className="text-zinc-300">Tài liệu nội bộ tìm được: &quot;Báo cáo thường niên năm 2022&quot;</span>
          <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-md ${
            scenario === 'invalid' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {scenario === 'invalid' ? '[IsRel: False (Quá hạn)]' : '[IsRel: True]'}
          </span>
        </div>

        {scenario === 'invalid' ? (
          <div className="p-3.5 border border-amber-500/40 bg-amber-500/10 rounded-xl text-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs">
              <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
              <span>CRAG ACTION: Kích hoạt Fallback Web Search thời gian thực!</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Phát hiện tài liệu nội bộ đã cũ. Hệ thống tự động chuyển tiếp truy vấn tới search engine để lấy giá cổ phiếu phiên hiện tại.
            </p>
          </div>
        ) : (
          <div className="p-3.5 border border-emerald-500/40 bg-emerald-500/10 rounded-xl text-emerald-200 text-xs">
            ✓ Bằng chứng nội bộ hợp lệ và cập nhật. LLM sinh câu trả lời có trích dẫn nguồn uy tín [IsSup: Supported].
          </div>
        )}
      </div>
    </div>
  );
};

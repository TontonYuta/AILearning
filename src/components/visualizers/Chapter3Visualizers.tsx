import React, { useState } from 'react';
import { Layers, ListFilter, Sparkles, RefreshCw, CheckCircle, ExternalLink } from 'lucide-react';

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
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          Kiến trúc Parent-Child (Small-to-Big Retrieval)
        </span>
        <span className="text-emerald-400 text-[11px] font-bold">
          Click chunk con để xem chunk cha
        </span>
      </div>

      {/* Child Chunks (Index search) */}
      <div>
        <div className="text-[11px] text-neutral-400 mb-1.5">
          1. CHUNKS CON (Child Chunks - Lưu trong Vector DB để tìm kiếm sắc nét):
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 1, text: 'Bảo hiểm y tế tự nguyện & tai nạn 24/7' },
            { id: 2, text: 'Điều trị nội trú tối đa 50.000.000 VNĐ/năm' },
            { id: 3, text: 'Nhân sự thử việc chưa áp dụng' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChild(c.id)}
              className={`p-2 border text-left transition-all ${
                selectedChild === c.id
                  ? 'border-blue-500 bg-blue-950/40 text-blue-200 font-bold'
                  : 'border-neutral-800 bg-[#09090b] text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="text-[10px] text-blue-400">Child #{c.id}</div>
              <div className="text-[11px] font-sans truncate mt-0.5">{c.text}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Parent Document (Returned to LLM) */}
      <div>
        <div className="text-[11px] text-neutral-400 mb-1.5">
          2. CHUNK CHA (Parent Context - Tự động nạp vào prompt cho LLM):
        </div>
        <div className="p-3 bg-[#09090b] border border-blue-900/60 font-sans text-xs text-neutral-200 leading-relaxed space-y-2">
          <p className="border-l-2 border-blue-500 pl-2">{parentDoc}</p>
          <div className="text-[11px] text-emerald-400 font-mono">
            ✓ LLM nhận trọn vẹn ngữ cảnh điều kiện "Nhân sự thử việc chưa được áp dụng" thay vì chỉ đọc mỗi con số 50 triệu!
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
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <ListFilter className="w-3.5 h-3.5 text-amber-400" />
          Two-Stage Retrieval: Bi-Encoder vs Cross-Encoder Re-rank
        </span>
        <button
          onClick={() => setIsReranked(!isReranked)}
          className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
            isReranked
              ? 'bg-amber-600 text-white hover:bg-amber-500'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          {isReranked ? 'Xem xếp hạng thô ban đầu' : '⚡ Kích hoạt Cross-Encoder Rerank'}
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="text-[11px] text-neutral-400">
          Query: "Quy trình xử lý sự cố cơ sở dữ liệu bị sập"
        </div>

        {displayList.map((d) => (
          <div
            key={d.id}
            className={`p-2.5 border flex items-center justify-between transition-all ${
              isReranked && d.rerankRank <= 2
                ? 'border-emerald-500 bg-emerald-950/30 text-emerald-100 font-semibold'
                : 'border-neutral-800 bg-[#09090b] text-neutral-400'
            }`}
          >
            <div>
              <span className="font-bold mr-2">
                {isReranked ? `#${d.rerankRank}` : `#${d.initialRank}`}
              </span>
              <span className="font-sans text-xs">{d.title}</span>
            </div>
            <div className="text-[11px] font-mono">
              {isReranked ? `Score: ${d.score.toFixed(2)}` : 'Bi-Encoder ANN'}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
        {isReranked ? (
          <span className="text-emerald-400">
            ✓ Cross-Encoder đã đẩy tài liệu "Database Failover" từ vị trí #8 lên vị trí #1 chính xác tuyệt đối!
          </span>
        ) : (
          <span>Danh sách thô ban đầu do Bi-Encoder trả về bị lẫn các bài viết chung chung lên top đầu.</span>
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
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Luồng tự phản biện Self-RAG & CRAG Fallback
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setScenario('invalid')}
            className={`px-2 py-0.5 border text-[11px] ${
              scenario === 'invalid'
                ? 'border-amber-500 bg-amber-950/40 text-amber-200 font-bold'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
            }`}
          >
            Ca 1: Vector DB rác/sai
          </button>
          <button
            onClick={() => setScenario('valid')}
            className={`px-2 py-0.5 border text-[11px] ${
              scenario === 'valid'
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
            }`}
          >
            Ca 2: Vector DB chính xác
          </button>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="p-3 bg-[#09090b] border border-neutral-800 space-y-2.5">
        <div className="flex items-center justify-between text-neutral-400">
          <span>Query: "Giá cổ phiếu VinFast hôm nay?"</span>
          <span className="text-blue-400">[Retrieve: Yes]</span>
        </div>

        <div className="p-2 bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <span>Tài liệu nội bộ tìm được: "Báo cáo thường niên năm 2022"</span>
          <span className={scenario === 'invalid' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
            {scenario === 'invalid' ? '[IsRel: False (Dữ liệu cũ)]' : '[IsRel: True]'}
          </span>
        </div>

        {scenario === 'invalid' ? (
          <div className="p-2.5 border border-amber-600/80 bg-amber-950/30 text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              CRAG ACTION: Tự động kích hoạt Fallback Web Search!
            </div>
            <p className="font-sans text-xs text-neutral-300">
              Phát hiện tài liệu nội bộ đã lỗi thời. Hệ thống gọi Tavily/Google Search lấy giá thời gian thực.
            </p>
          </div>
        ) : (
          <div className="p-2.5 border border-emerald-600/80 bg-emerald-950/30 text-emerald-200">
            ✓ Bằng chứng nội bộ hợp lệ. LLM sinh câu trả lời có trích dẫn [IsSup: Supported].
          </div>
        )}
      </div>
    </div>
  );
};

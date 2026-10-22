import React from 'react';
import { X, BookOpen, Layers, Network, Zap, Shield, FileCode2 } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[85vh] bg-[#121215] border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="h-12 border-b border-neutral-800 px-5 flex items-center justify-between bg-[#0e0e11] shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold font-mono uppercase text-neutral-100">
              Kiến Trúc & Đặc Tả Kỹ Thuật AI Engineering Studio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100 p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed font-sans">
          {/* Section 1: RAG & Vector 2D */}
          <div className="border border-neutral-800/80 bg-neutral-900/40 p-4 space-y-2">
            <h4 className="font-semibold text-neutral-100 font-mono flex items-center gap-2 text-sm">
              <Layers className="w-4 h-4 text-blue-400" />
              1. RAG & Vector Space 2D Projection + Hybrid Search (RRF)
            </h4>
            <p className="text-neutral-400">
              <strong>Chunking:</strong> Kích thước Chunk Size và Overlap quyết định độ phân giải ngữ cảnh. Overlap ngăn chặn hiện tượng mất thông tin ở ranh giới câu.
            </p>
            <p className="text-neutral-400">
              <strong>Cosine Similarity:</strong> cos(θ) = (u · v) / (||u|| · ||v||). Đo góc giữa vector câu hỏi và vector tài liệu trong không gian nhúng n-chiều.
            </p>
            <p className="text-neutral-400">
              <strong>Reciprocal Rank Fusion (RRF):</strong> Kết hợp xếp hạng Sparse (BM25) và Dense (Embedding) theo công thức RRF(d) = Σ 1 / (60 + rank(d)), cân bằng giữa từ khóa kỹ thuật chính xác và ý định ngữ nghĩa.
            </p>
          </div>

          {/* Section 2: LangGraph Simulator */}
          <div className="border border-neutral-800/80 bg-neutral-900/40 p-4 space-y-2">
            <h4 className="font-semibold text-neutral-100 font-mono flex items-center gap-2 text-sm">
              <Network className="w-4 h-4 text-emerald-400" />
              2. LangGraph StateGraph & Human-in-the-Loop Breakpoints
            </h4>
            <p className="text-neutral-400">
              <strong>Shared State Channels:</strong> Trạng thái được mô hình hóa qua TypedDict với các reducer kiểm soát đột biến (mutation) từng bước.
            </p>
            <p className="text-neutral-400">
              <strong>state.interrupt():</strong> Với các tác vụ tài chính nhạy cảm hoặc ghi dữ liệu quan trọng, đồ thị tạm dừng thực thi, tạo checkpoint lưu vào bộ nhớ và chờ người vận hành phê duyệt trước khi đi tiếp.
            </p>
          </div>

          {/* Section 3: Semantic Cache */}
          <div className="border border-neutral-800/80 bg-neutral-900/40 p-4 space-y-2">
            <h4 className="font-semibold text-neutral-100 font-mono flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              3. Semantic Caching & FinOps Optimization
            </h4>
            <p className="text-neutral-400">
              Sử dụng Vector Database để lưu trữ các câu hỏi tương đương ngữ nghĩa. Khi độ tương đồng vượt ngưỡng $\tau$, hệ thống phản hồi trong 10-15ms, tiết kiệm 98% chi phí token và độ trễ mạng so với việc gọi trực tiếp LLM.
            </p>
          </div>

          {/* Section 4: AI Security Firewall */}
          <div className="border border-neutral-800/80 bg-neutral-900/40 p-4 space-y-2">
            <h4 className="font-semibold text-neutral-100 font-mono flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-red-400" />
              4. AI Security Firewall & Guardrails
            </h4>
            <p className="text-neutral-400">
              Áp dụng mô hình phòng thủ theo chiều sâu (Defense-in-Depth): Quét regex tiền xử lý, kiểm tra Canary token để phát hiện trích xuất system prompt, ẩn danh hóa dữ liệu PII/PCI-DSS trước khi gửi đến model.
            </p>
          </div>

          {/* Section 5: Self-Healing JSON */}
          <div className="border border-neutral-800/80 bg-neutral-900/40 p-4 space-y-2">
            <h4 className="font-semibold text-neutral-100 font-mono flex items-center gap-2 text-sm">
              <FileCode2 className="w-4 h-4 text-indigo-400" />
              5. Self-Healing JSON AST Engine
            </h4>
            <p className="text-neutral-400">
              Khắc phục các dị tật đầu ra thường gặp của LLM (fences thừa, trailing comma, python literals, unquoted keys, thiếu ngoặc đóng khi bị truncate) cục bộ trong ~1ms mà không cần re-prompt tốn kém.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="h-10 border-t border-neutral-800 px-5 flex items-center justify-between bg-[#09090b] text-[11px] font-mono text-neutral-500">
          <span>AI Eng Studio v1.0.0</span>
          <span>Zero-Pill Architecture · Linear & Vercel Inspired</span>
        </div>
      </div>
    </div>
  );
};

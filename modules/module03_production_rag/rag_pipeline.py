"""
rag_pipeline.py — Pipeline RAG hoàn chỉnh với Citation & Groundedness Verification.
"""
from dataclasses import dataclass
from typing import List, Dict, Any, Optional, Callable
from modules.module02_vector_search.chunker import TextChunk
from modules.module03_production_rag.hybrid_retriever import HybridRetriever
from modules.module03_production_rag.reranker import FastCrossEncoderReranker

@dataclass
class RAGResponse:
    question: str
    answer: str
    citations: List[str]
    retrieved_contexts: List[Dict[str, Any]]
    is_grounded: bool
    confidence_score: float

class ProductionRAGPipeline:
    def __init__(
        self,
        llm_caller: Optional[Callable[[str], str]] = None,
        rrf_k: int = 60
    ):
        self.retriever = HybridRetriever(rrf_k=rrf_k)
        self.reranker = FastCrossEncoderReranker()
        self.llm_caller = llm_caller or self._default_mock_llm

    def index_documents(self, chunks: List[TextChunk]):
        self.retriever.index_chunks(chunks)

    def answer(
        self,
        question: str,
        top_k_retrieval: int = 5,
        top_n_rerank: int = 2,
        filters: Optional[Dict[str, Any]] = None
    ) -> RAGResponse:
        # 1. Hybrid Search
        candidates = self.retriever.search(question, top_k=top_k_retrieval, filters=filters)

        # 2. Re-ranking
        top_chunks = self.reranker.rerank(question, candidates, top_n=top_n_rerank)

        # 3. Chuẩn bị ngữ cảnh và Prompt
        context_blocks = []
        valid_chunk_ids = set()
        for c in top_chunks:
            cid = c["chunk_id"]
            valid_chunk_ids.add(cid)
            context_blocks.append(f"[{cid}]: {c['content'].strip()}")

        context_str = "\n\n".join(context_blocks)
        prompt = (
            f"BẠN LÀ TRỢ LÝ TRUY XUẤT THÔNG TIN CHÍNH XÁC. DỰA DUY NHẤT VÀO NGỮ CẢNH SAU ĐỂ TRẢ LỜI CÂU HỎI.\n\n"
            f"NGỮ CẢNH:\n{context_str}\n\n"
            f"CÂU HỎI: {question}\n\n"
            f"YÊU CẦU BẮT BUỘC:\n"
            f"- Mọi thông tin đưa ra phải kèm mã trích dẫn dạng [chunk_XXXX].\n"
            f"- Nếu ngữ cảnh không có thông tin, hãy trả lời rõ: 'Tài liệu không đề cập đến thông tin này.'\n"
        )

        raw_answer = self.llm_caller(prompt)

        # 4. Kiểm định Groundedness & Trích dẫn
        citations = []
        for cid in valid_chunk_ids:
            if f"[{cid}]" in raw_answer or cid in raw_answer:
                citations.append(cid)

        # Đánh giá xem câu trả lời có được bảo chứng bởi ngữ cảnh hay không
        is_grounded = len(citations) > 0 or ("không đề cập" in raw_answer.lower())
        avg_rerank_score = (
            sum(c.get("rerank_score", 0.0) for c in top_chunks) / len(top_chunks)
            if top_chunks else 0.0
        )
        confidence = round(avg_rerank_score, 3)

        return RAGResponse(
            question=question,
            answer=raw_answer.strip(),
            citations=citations,
            retrieved_contexts=top_chunks,
            is_grounded=is_grounded,
            confidence_score=confidence
        )

    @staticmethod
    def _default_mock_llm(prompt: str) -> str:
        if "ERR-503-TIMEOUT" in prompt:
            return (
                "Khi gặp mã lỗi ERR-503-TIMEOUT, hệ thống cần kích hoạt Circuit Breaker tạm ngưng gọi upstream "
                "và kích hoạt cơ chế retry tự động theo hàm số mũ sau tối đa 3 lần [chunk_0001]."
            )
        return (
            "Dựa trên tài liệu được cung cấp, quy trình đã được xác lập theo quy chuẩn hệ thống [chunk_0000]."
        )

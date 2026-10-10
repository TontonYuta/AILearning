"""
hybrid_retriever.py — Tìm kiếm lai (Hybrid Search) kết hợp BM25 và Dense Vectors qua RRF.
"""
from typing import List, Dict, Any, Optional
from modules.module02_vector_search.chunker import TextChunk
from modules.module02_vector_search.vector_store import ProductionVectorStore
from modules.module03_production_rag.bm25 import BM25Okapi

class HybridRetriever:
    """
    Bộ tìm kiếm lai dung hợp thứ hạng Reciprocal Rank Fusion (RRF).
    """
    def __init__(self, rrf_k: int = 60):
        self.rrf_k = rrf_k
        self.vector_store = ProductionVectorStore()
        self.bm25 = BM25Okapi()
        self.chunks_map: Dict[str, TextChunk] = {}

    def index_chunks(self, chunks: List[TextChunk]):
        """Nạp và lập chỉ mục chunks vào cả BM25 và Vector Store."""
        self.chunks_map = {c.chunk_id: c for c in chunks}
        
        # 1. Lập chỉ mục Vector Store
        self.vector_store.insert_chunks(chunks)

        # 2. Lập chỉ mục BM25
        doc_ids = [c.chunk_id for c in chunks]
        texts = [c.content for c in chunks]
        self.bm25.fit(doc_ids, texts)

    def search(
        self,
        query: str,
        top_k: int = 5,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Thực thi tìm kiếm song song và tính điểm RRF.
        """
        # 1. Dense Vector Search (Top 20 ứng viên)
        dense_results = self.vector_store.search(query, top_k=20, filters=filters)
        
        # 2. Sparse BM25 Search (Top 20 ứng viên)
        bm25_raw = self.bm25.search(query, top_k=20)
        # Lọc metadata nếu có
        bm25_results = []
        for doc_id, score, content in bm25_raw:
            chunk = self.chunks_map.get(doc_id)
            if chunk and filters:
                match = all(chunk.metadata.get(k) == v for k, v in filters.items())
                if not match:
                    continue
            bm25_results.append({"chunk_id": doc_id, "score": score, "content": content})

        # 3. Tính điểm Reciprocal Rank Fusion (RRF)
        rrf_scores: Dict[str, float] = {}

        for rank, item in enumerate(dense_results, start=1):
            cid = item["chunk_id"]
            rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (self.rrf_k + rank))

        for rank, item in enumerate(bm25_results, start=1):
            cid = item["chunk_id"]
            rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (self.rrf_k + rank))

        # 4. Sắp xếp kết quả cuối cùng theo RRF score
        sorted_cids = sorted(rrf_scores.keys(), key=lambda c: rrf_scores[c], reverse=True)

        final_results = []
        for cid in sorted_cids[:top_k]:
            chunk = self.chunks_map[cid]
            final_results.append({
                "chunk_id": cid,
                "content": chunk.content,
                "rrf_score": round(rrf_scores[cid], 5),
                "metadata": chunk.metadata
            })
        return final_results

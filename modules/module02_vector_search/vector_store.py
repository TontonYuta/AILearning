"""
vector_store.py — Hệ thống lưu trữ và tìm kiếm vector hỗ trợ Multi-Tenant Isolation.
"""
import hashlib
import numpy as np
from typing import List, Dict, Any, Optional, Callable
from modules.module02_vector_search.chunker import TextChunk

def generate_deterministic_embedding(text: str, dim: int = 128) -> np.ndarray:
    """
    Sinh vector chuẩn hóa L2 dựa trên đặc trưng n-gram ngữ nghĩa của văn bản.
    Đảm bảo các câu tương tự có độ tương đồng cosine cao, không phụ thuộc mạng ngoài khi test.
    """
    vec = np.zeros(dim, dtype=np.float32)
    # Lấy các n-gram từ ngữ
    tokens = text.lower().split()
    for token in tokens:
        h = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16)
        idx = h % dim
        sign = 1.0 if ((h >> 8) % 2 == 0) else -1.0
        vec[idx] += sign

    # Chuẩn hóa L2 (L2 Normalization)
    norm = np.linalg.norm(vec)
    if norm > 1e-6:
        vec = vec / norm
    else:
        vec[0] = 1.0
    return vec

class VectorStoreRecord:
    def __init__(self, chunk_id: str, content: str, vector: np.ndarray, metadata: Dict[str, Any]):
        self.chunk_id = chunk_id
        self.content = content
        self.vector = vector
        self.metadata = metadata

class ProductionVectorStore:
    """
    Kho lưu trữ Vector Store hỗ trợ lọc siêu dữ liệu đa khách hàng (Multi-Tenant Isolation).
    """
    def __init__(
        self,
        embedding_fn: Optional[Callable[[str], np.ndarray]] = None,
        dim: int = 128
    ):
        self.embedding_fn = embedding_fn or (lambda t: generate_deterministic_embedding(t, dim))
        self.dim = dim
        self.records: List[VectorStoreRecord] = []

    def insert_chunks(self, chunks: List[TextChunk]):
        """Lập chỉ mục danh sách các TextChunk vào cơ sở dữ liệu."""
        for chunk in chunks:
            vector = self.embedding_fn(chunk.content)
            self.records.append(
                VectorStoreRecord(
                    chunk_id=chunk.chunk_id,
                    content=chunk.content,
                    vector=vector,
                    metadata=chunk.metadata
                )
            )

    def search(
        self,
        query: str,
        top_k: int = 3,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Tìm kiếm cosine similarity có áp dụng metadata filter (ví dụ: tenant_id, department).
        """
        if not self.records:
            return []

        query_vec = self.embedding_fn(query)
        candidates = []

        for rec in self.records:
            # Kiểm tra bộ lọc Metadata (Multi-Tenant isolation)
            if filters:
                match = True
                for k, v in filters.items():
                    if rec.metadata.get(k) != v:
                        match = False
                        break
                if not match:
                    continue

            # Tính Cosine Similarity
            similarity = float(np.dot(query_vec, rec.vector))
            candidates.append({
                "chunk_id": rec.chunk_id,
                "content": rec.content,
                "similarity_score": round(similarity, 4),
                "metadata": rec.metadata
            })

        # Sắp xếp theo độ tương đồng giảm dần
        candidates.sort(key=lambda x: x["similarity_score"], reverse=True)
        return candidates[:top_k]

    def clear(self):
        self.records.clear()

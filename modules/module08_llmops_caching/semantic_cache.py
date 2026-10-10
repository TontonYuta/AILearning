"""
semantic_cache.py — Bộ nhớ đệm ngữ nghĩa (Semantic Cache) tối ưu chi phí & độ trễ.
"""
import time
import numpy as np
from dataclasses import dataclass
from typing import Optional, Tuple, List, Callable
from modules.module02_vector_search.vector_store import generate_deterministic_embedding

@dataclass
class CacheEntry:
    query: str
    vector: np.ndarray
    response: str
    created_at: float

class SemanticCache:
    def __init__(
        self,
        similarity_threshold: float = 0.88,
        embedding_fn: Optional[Callable[[str], np.ndarray]] = None
    ):
        self.threshold = similarity_threshold
        self.embedding_fn = embedding_fn or (lambda q: generate_deterministic_embedding(q, dim=128))
        self.entries: List[CacheEntry] = []
        self.hits = 0
        self.misses = 0

    def get(self, query: str) -> Tuple[Optional[str], float]:
        """
        Tra cứu cache bằng vector ngữ nghĩa.
        Trả về (câu_trả_lời, điểm_tương_đồng) nếu tìm thấy, hoặc (None, 0.0) nếu cache miss.
        """
        if not self.entries:
            self.misses += 1
            return None, 0.0

        q_vec = self.embedding_fn(query)
        best_score = -1.0
        best_entry = None

        for entry in self.entries:
            sim = float(np.dot(q_vec, entry.vector))
            if sim > best_score:
                best_score = sim
                best_entry = entry

        if best_entry and best_score >= self.threshold:
            self.hits += 1
            return best_entry.response, round(best_score, 4)

        self.misses += 1
        return None, round(best_score, 4) if best_entry else 0.0

    def set(self, query: str, response: str):
        """Lưu trữ câu hỏi và câu trả lời vào bộ nhớ đệm."""
        q_vec = self.embedding_fn(query)
        self.entries.append(
            CacheEntry(
                query=query,
                vector=q_vec,
                response=response,
                created_at=time.time()
            )
        )

    @property
    def hit_rate(self) -> float:
        total = self.hits + self.misses
        return round(self.hits / total, 3) if total > 0 else 0.0

    def clear(self):
        self.entries.clear()
        self.hits = 0
        self.misses = 0

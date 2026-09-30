"""Unit test xác thực toàn bộ mã nguồn ví dụ trong Giai đoạn 7: AI System Design."""

import pytest
import hashlib
from typing import Dict, Optional

# 1. Test TwoTierAICache
class TwoTierAICache:
    def __init__(self, semantic_threshold: float = 0.95):
        self.exact_cache: Dict[str, str] = {}
        self.threshold = semantic_threshold

    def _hash_key(self, text: str) -> str:
        return hashlib.sha256(text.strip().lower().encode()).hexdigest()

    def get(self, query: str, mock_similarity: float = 0.0) -> Optional[str]:
        h = self._hash_key(query)
        if h in self.exact_cache:
            return f"[Exact Cache Hit]: {self.exact_cache[h]}"
        if mock_similarity >= self.threshold:
            return f"[Semantic Cache Hit]: ({mock_similarity * 100:.1f}%)"
        return None

    def set(self, query: str, answer: str):
        h = self._hash_key(query)
        self.exact_cache[h] = answer

def test_two_tier_cache():
    cache = TwoTierAICache(semantic_threshold=0.95)
    cache.set("Toi muon hoc AI", "Bat dau tu Python va CS fundamentals")
    
    # Test exact hit
    hit = cache.get("  toi muon hoc ai  ")
    assert hit is not None
    assert "Exact Cache Hit" in hit

    # Test semantic hit
    sem_hit = cache.get("Cau hoi khac hoan toan", mock_similarity=0.98)
    assert sem_hit is not None
    assert "Semantic Cache Hit" in sem_hit

    # Test cache miss
    miss = cache.get("Cau hoi chua tung gap", mock_similarity=0.70)
    assert miss is None

# 2. Test TieredModelRouter
class TieredModelRouter:
    def route_request(self, query: str) -> str:
        q_lower = query.lower().strip()
        word_count = len(q_lower.split())
        if word_count < 6 and any(w in q_lower for w in ["chao", "hello", "hi", "cam on"]):
            return "TIER_1_SMALL_8B"
        if any(kw in q_lower for kw in ["chung minh", "lap trinh", "kien truc", "debug"]):
            return "TIER_3_LARGE_REASONING"
        return "TIER_2_BALANCED"

def test_tiered_router():
    router = TieredModelRouter()
    assert router.route_request("Xin chao") == "TIER_1_SMALL_8B"
    assert router.route_request("Hay lap trinh mot he thong RAG") == "TIER_3_LARGE_REASONING"
    assert router.route_request("Thoi tiet hom nay the nao") == "TIER_2_BALANCED"

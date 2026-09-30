"""
Unit tests for Chapter 13: AI System Design & High-Throughput Architecture
Covers:
- Capacity estimation & ROI calculations
- ProductionSemanticCacheGateway (Exact Hash + Cosine Semantic Cache + Router)
- ContextAwareLoadBalancer (Prefix Affinity & Least-Connections)
"""

import hashlib
import math
from typing import Dict, Any, List, Optional, Tuple
import pytest

# ==============================================================================
# 1. CAPACITY ESTIMATION & ROI FORMULAS
# ==============================================================================

def calculate_peak_qps(dau: int, queries_per_user: int, peak_factor: float = 3.0) -> float:
    total_queries = dau * queries_per_user
    avg_qps = total_queries / 86400.0
    return avg_qps * peak_factor

def calculate_semantic_cache_roi(
    monthly_queries: int,
    cost_per_query: float,
    hit_rate: float,
    cache_infra_cost: float
) -> Tuple[float, float, float]:
    """Returns (gross_savings, net_savings, roi_percentage)."""
    saved_queries = monthly_queries * hit_rate
    gross_savings = saved_queries * cost_per_query
    net_savings = gross_savings - cache_infra_cost
    roi = (net_savings / cache_infra_cost) * 100.0
    return gross_savings, net_savings, roi

def test_capacity_and_roi_math():
    # Peak QPS for 10M DAU with 10 queries/user and peak factor 3
    peak_qps = calculate_peak_qps(10_000_000, 10, peak_factor=3.0)
    assert peak_qps == pytest.approx(3472.22, abs=1.0)

    # Exercise B.1: 150M queries/month, $0.01/query, 40% total hit rate, $1500 cache infra
    gross, net, roi = calculate_semantic_cache_roi(
        monthly_queries=150_000_000,
        cost_per_query=0.01,
        hit_rate=0.40,
        cache_infra_cost=1500.0
    )
    assert gross == pytest.approx(600_000.0)
    assert net == pytest.approx(598_500.0)
    assert roi == pytest.approx(39_900.0)

# ==============================================================================
# 2. TWO-TIER SEMANTIC CACHE GATEWAY
# ==============================================================================

class ProductionSemanticCacheGateway:
    def __init__(self, similarity_threshold: float = 0.88):
        self.similarity_threshold = similarity_threshold
        self.exact_cache: Dict[str, str] = {}
        self.vector_cache: List[Tuple[List[float], str, str]] = []

    @staticmethod
    def _normalize_and_hash(text: str) -> str:
        cleaned = " ".join(text.strip().lower().split())
        return hashlib.sha256(cleaned.encode("utf-8")).hexdigest()

    @staticmethod
    def _cosine_similarity(v1: List[float], v2: List[float]) -> float:
        dot = sum(a * b for a, b in zip(v1, v2))
        norm1 = math.sqrt(sum(a * a for a in v1))
        norm2 = math.sqrt(sum(b * b for b in v2))
        if norm1 == 0.0 or norm2 == 0.0:
            return 0.0
        return dot / (norm1 * norm2)

    def query(
        self, 
        prompt: str, 
        embedding: Optional[List[float]] = None
    ) -> Tuple[str, str, Dict[str, Any]]:
        hash_key = self._normalize_and_hash(prompt)
        if hash_key in self.exact_cache:
            return self.exact_cache[hash_key], "EXACT_CACHE_HIT", {"latency_ms": 1.5}

        if embedding is not None and len(self.vector_cache) > 0:
            best_sim = -1.0
            best_answer = ""
            matched_q = ""
            for cached_emb, cached_q, cached_a in self.vector_cache:
                sim = self._cosine_similarity(embedding, cached_emb)
                if sim > best_sim:
                    best_sim = sim
                    best_answer = cached_a
                    matched_q = cached_q

            if best_sim >= self.similarity_threshold:
                return best_answer, "SEMANTIC_CACHE_HIT", {
                    "similarity": best_sim,
                    "matched_question": matched_q,
                    "latency_ms": 15.0
                }

        return "", "CACHE_MISS", {"hash_key": hash_key}

    def update_cache(self, prompt: str, embedding: List[float], response: str):
        hash_key = self._normalize_and_hash(prompt)
        self.exact_cache[hash_key] = response
        self.vector_cache.append((embedding, prompt, response))

    @staticmethod
    def route_model(prompt: str) -> str:
        tokens = prompt.lower().split()
        complex_keywords = {"chung minh", "toan hoc", "kien truc", "debug", "refactor"}
        has_complex_keyword = any(kw in prompt.lower() for kw in complex_keywords)
        is_long = len(tokens) > 100
        
        if has_complex_keyword or is_long:
            return "TIER2_LARGE_MODEL_70B"
        return "TIER1_SMALL_MODEL_8B"

def test_semantic_cache_exact_hit():
    gw = ProductionSemanticCacheGateway()
    gw.update_cache("Thu do nuoc Phap la gi?", [1.0, 0.0, 0.0], "Paris")
    
    ans, hit_type, meta = gw.query("  thu  do  nuoc phap  la gi?  ")
    assert hit_type == "EXACT_CACHE_HIT"
    assert ans == "Paris"

def test_semantic_cache_vector_hit():
    gw = ProductionSemanticCacheGateway(similarity_threshold=0.88)
    # Store vector [1.0, 0.0, 0.0]
    gw.update_cache("Cau hoi ve Paris", [1.0, 0.0, 0.0], "Paris la thu do")

    # Near vector with high cosine similarity (cos ~ 0.96)
    near_emb = [0.96, 0.28, 0.0]
    ans, hit_type, meta = gw.query("Cho toi biet ve Paris", near_emb)
    assert hit_type == "SEMANTIC_CACHE_HIT"
    assert ans == "Paris la thu do"
    assert meta["similarity"] >= 0.88

def test_semantic_cache_miss_on_low_similarity():
    gw = ProductionSemanticCacheGateway(similarity_threshold=0.88)
    gw.update_cache("Toan hoc co ban", [1.0, 0.0, 0.0], "1 + 1 = 2")

    # Orthogonal vector
    diff_emb = [0.0, 1.0, 0.0]
    ans, hit_type, meta = gw.query("Lich su the gioi", diff_emb)
    assert hit_type == "CACHE_MISS"
    assert ans == ""

def test_model_routing():
    # Simple query
    simple_q = "Thu do cua Viet Nam la gi?"
    assert ProductionSemanticCacheGateway.route_model(simple_q) == "TIER1_SMALL_MODEL_8B"

    # Complex query with keyword
    complex_q = "Hay chung minh dinh ly Fermat nho va lien he voi mat ma RSA"
    assert ProductionSemanticCacheGateway.route_model(complex_q) == "TIER2_LARGE_MODEL_70B"

    # Long query
    long_q = " ".join(["word"] * 105)
    assert ProductionSemanticCacheGateway.route_model(long_q) == "TIER2_LARGE_MODEL_70B"

# ==============================================================================
# 3. CONTEXT-AWARE LOAD BALANCER
# ==============================================================================

class BackendServer:
    def __init__(self, server_id: str, max_conns: int = 50):
        self.server_id = server_id
        self.max_conns = max_conns
        self.active_conns = 0
        self.cached_prompt_hashes: set = set()

class ContextAwareLoadBalancer:
    def __init__(self, servers: List[BackendServer]):
        self.servers = servers

    def route_request(self, system_prompt_hash: Optional[str] = None) -> Optional[BackendServer]:
        available_servers = [s for s in self.servers if s.active_conns < s.max_conns]
        if not available_servers:
            return None

        if system_prompt_hash:
            cached_candidates = [
                s for s in available_servers 
                if system_prompt_hash in s.cached_prompt_hashes
            ]
            if cached_candidates:
                selected = min(cached_candidates, key=lambda s: s.active_conns)
                selected.active_conns += 1
                return selected

        selected = min(available_servers, key=lambda s: s.active_conns)
        if system_prompt_hash:
            selected.cached_prompt_hashes.add(system_prompt_hash)
        selected.active_conns += 1
        return selected

    def release_connection(self, server_id: str):
        for s in self.servers:
            if s.server_id == server_id and s.active_conns > 0:
                s.active_conns -= 1
                break

def test_load_balancer_prefix_affinity():
    s1 = BackendServer("server-1", max_conns=10)
    s2 = BackendServer("server-2", max_conns=10)
    lb = ContextAwareLoadBalancer([s1, s2])

    # S1 has cached hash "SYS_ENTERPRISE_HANDBOOK"
    s1.cached_prompt_hashes.add("SYS_ENTERPRISE_HANDBOOK")
    s1.active_conns = 3
    s2.active_conns = 1 # S2 has fewer conns, but lacks the prefix cache

    # When request comes with SYS_ENTERPRISE_HANDBOOK, should pick S1 for prefix caching
    chosen = lb.route_request("SYS_ENTERPRISE_HANDBOOK")
    assert chosen is not None
    assert chosen.server_id == "server-1"
    assert chosen.active_conns == 4

def test_load_balancer_least_connections_fallback():
    s1 = BackendServer("server-1", max_conns=5)
    s2 = BackendServer("server-2", max_conns=5)
    lb = ContextAwareLoadBalancer([s1, s2])
    s1.active_conns = 3
    s2.active_conns = 1

    # New request with no prefix cache -> pick s2
    chosen = lb.route_request("NEW_HASH")
    assert chosen is not None
    assert chosen.server_id == "server-2"
    assert chosen.active_conns == 2

def test_load_balancer_overload_circuit_breaker():
    s1 = BackendServer("server-1", max_conns=2)
    s1.active_conns = 2
    lb = ContextAwareLoadBalancer([s1])

    # All servers full -> returns None
    chosen = lb.route_request("ANY_HASH")
    assert chosen is None

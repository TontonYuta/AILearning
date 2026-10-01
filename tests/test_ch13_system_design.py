"""
Unit tests for Chapter 13: AI System Design & High-Throughput Architecture
Covers:
- Capacity estimation, Little's Law & ROI calculations
- ProductionSemanticCacheGateway (Multi-tenant partition, Exact Hash + Cosine Semantic Cache + Router)
- ContextAwareLoadBalancer (Prefix Affinity & Least-Connections)
- False Positive Rate calculation for semantic cache threshold tau
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

def calculate_false_positive_hit_rate(tau: float, mu: float, sigma: float) -> float:
    """Calculate P(X >= tau) where X ~ N(mu, sigma^2) using math.erfc."""
    z = (tau - mu) / (sigma * math.sqrt(2))
    p = 0.5 * math.erfc(z)
    return round(p, 4)

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

    # Exercise B.3: tau=0.88, mu=0.82, sigma=0.04 -> z = (0.88 - 0.82)/0.04 = 1.5 -> ~6.68%
    fp_rate = calculate_false_positive_hit_rate(tau=0.88, mu=0.82, sigma=0.04)
    assert fp_rate == pytest.approx(0.0668, abs=0.001)

# ==============================================================================
# 2. TWO-TIER SEMANTIC CACHE GATEWAY WITH MULTI-TENANT ISOLATION
# ==============================================================================

class ProductionSemanticCacheGateway:
    def __init__(self, similarity_threshold: float = 0.88):
        self.similarity_threshold = similarity_threshold
        self.exact_cache: Dict[str, str] = {}
        self.vector_cache: List[Tuple[List[float], str, str, str]] = []

    @staticmethod
    def _normalize_and_hash(text: str, tenant_id: str = "default") -> str:
        cleaned = " ".join(text.strip().lower().split())
        compound = f"{tenant_id}::{cleaned}"
        return hashlib.sha256(compound.encode("utf-8")).hexdigest()

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
        embedding: Optional[List[float]] = None,
        tenant_id: str = "default"
    ) -> Tuple[str, str, Dict[str, Any]]:
        hash_key = self._normalize_and_hash(prompt, tenant_id)
        if hash_key in self.exact_cache:
            return self.exact_cache[hash_key], "EXACT_CACHE_HIT", {"latency_ms": 1.5}

        if embedding is not None and len(self.vector_cache) > 0:
            best_sim = -1.0
            best_answer = ""
            matched_q = ""
            for cached_emb, cached_q, cached_a, cached_tenant in self.vector_cache:
                if cached_tenant != tenant_id:
                    continue
                sim = self._cosine_similarity(embedding, cached_emb)
                if sim > best_sim:
                    best_sim = sim
                    best_answer = cached_a
                    matched_q = cached_q

            if best_sim >= self.similarity_threshold:
                return best_answer, "SEMANTIC_CACHE_HIT", {
                    "similarity": round(best_sim, 4),
                    "matched_question": matched_q,
                    "latency_ms": 15.0
                }

        return "", "CACHE_MISS", {"hash_key": hash_key}

    def update_cache(
        self, prompt: str, embedding: List[float], response: str, tenant_id: str = "default"
    ):
        hash_key = self._normalize_and_hash(prompt, tenant_id)
        self.exact_cache[hash_key] = response
        self.vector_cache.append((embedding, prompt, response, tenant_id))

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
    gw.update_cache("Thu do nuoc Phap la gi?", [1.0, 0.0, 0.0], "Paris", tenant_id="tenant-A")
    
    ans, hit_type, meta = gw.query("  thu  do  nuoc phap  la gi?  ", tenant_id="tenant-A")
    assert hit_type == "EXACT_CACHE_HIT"
    assert ans == "Paris"

def test_semantic_cache_multi_tenant_isolation():
    gw = ProductionSemanticCacheGateway()
    gw.update_cache("So du cua toi la bao nhieu?", [1.0, 0.0, 0.0], "500 trieu VNĐ", tenant_id="tenant-VIP")

    # Another tenant queries identical vector
    ans, hit_type, meta = gw.query("So du cua toi la bao nhieu?", [1.0, 0.0, 0.0], tenant_id="tenant-REGULAR")
    # Must be CACHE_MISS due to tenant isolation
    assert hit_type == "CACHE_MISS"
    assert ans == ""

def test_semantic_cache_vector_hit():
    gw = ProductionSemanticCacheGateway(similarity_threshold=0.88)
    gw.update_cache("Cau hoi ve Paris", [1.0, 0.0, 0.0], "Paris la thu do", tenant_id="t1")

    near_emb = [0.96, 0.28, 0.0]
    ans, hit_type, meta = gw.query("Cho toi biet ve Paris", near_emb, tenant_id="t1")
    assert hit_type == "SEMANTIC_CACHE_HIT"
    assert ans == "Paris la thu do"
    assert meta["similarity"] >= 0.88

def test_semantic_cache_miss_on_low_similarity():
    gw = ProductionSemanticCacheGateway(similarity_threshold=0.88)
    gw.update_cache("Toan hoc co ban", [1.0, 0.0, 0.0], "1 + 1 = 2")

    diff_emb = [0.0, 1.0, 0.0]
    ans, hit_type, meta = gw.query("Lich su the gioi", diff_emb)
    assert hit_type == "CACHE_MISS"
    assert ans == ""

def test_model_routing():
    simple_q = "Thu do cua Viet Nam la gi?"
    assert ProductionSemanticCacheGateway.route_model(simple_q) == "TIER1_SMALL_MODEL_8B"

    complex_q = "Hay chung minh dinh ly Fermat nho va lien he voi mat ma RSA"
    assert ProductionSemanticCacheGateway.route_model(complex_q) == "TIER2_LARGE_MODEL_70B"

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

    s1.cached_prompt_hashes.add("SYS_ENTERPRISE_HANDBOOK")
    s1.active_conns = 3
    s2.active_conns = 1

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

    chosen = lb.route_request("NEW_HASH")
    assert chosen is not None
    assert chosen.server_id == "server-2"
    assert chosen.active_conns == 2

def test_load_balancer_overload_circuit_breaker():
    s1 = BackendServer("server-1", max_conns=2)
    s1.active_conns = 2
    lb = ContextAwareLoadBalancer([s1])

    chosen = lb.route_request("ANY_HASH")
    assert chosen is None


def test_consistent_hash_ring_key_movement():
    """Verify that Consistent Hashing moves only ~ 1/N keys when scaling nodes."""
    import bisect

    class ConsistentHashRing:
        def __init__(self, vnodes: int = 50):
            self.vnodes = vnodes
            self.ring: List[int] = []
            self.ring_map: Dict[int, str] = {}

        def add_node(self, node_id: str):
            for i in range(self.vnodes):
                h = int(hashlib.md5(f"{node_id}#vn_{i}".encode()).hexdigest(), 16) % (2**32)
                self.ring.append(h)
                self.ring_map[h] = node_id
            self.ring.sort()

        def get_node(self, key: str) -> str:
            if not self.ring:
                return ""
            h = int(hashlib.md5(key.encode()).hexdigest(), 16) % (2**32)
            idx = bisect.bisect_right(self.ring, h)
            if idx == len(self.ring):
                idx = 0
            return self.ring_map[self.ring[idx]]

    ring = ConsistentHashRing(vnodes=50)
    for i in range(10):
        ring.add_node(f"server_{i}")

    keys = [f"tenant_prefix_{k}" for k in range(1000)]
    initial_mapping = {k: ring.get_node(k) for k in keys}

    # Add 2 new nodes (from 10 to 12)
    ring.add_node("server_10")
    ring.add_node("server_11")
    new_mapping = {k: ring.get_node(k) for k in keys}

    moved_keys = sum(1 for k in keys if initial_mapping[k] != new_mapping[k])
    move_ratio = moved_keys / len(keys)
    
    # Expected move ratio is ~ 2/12 = 16.7%
    assert 0.10 <= move_ratio <= 0.25, f"Move ratio {move_ratio} outside expected range"


def test_prefix_aware_tflops_savings_math():
    """Verify analytical TFLOPs and latency savings from Prefix-Aware Routing."""
    total_queries = 100_000
    hit_rate_rr = 0.125
    hit_rate_pa = 0.95

    miss_rr = total_queries * (1 - hit_rate_rr)
    miss_pa = total_queries * (1 - hit_rate_pa)
    saved_prefills = miss_rr - miss_pa
    assert saved_prefills == 82_500

    tflops_per_prefill = 560.0
    total_tflops_saved = saved_prefills * tflops_per_prefill
    assert total_tflops_saved == 46_200_000.0  # 46.2 ExaFLOPs

    prefill_latency_sec = 0.400
    total_seconds_saved = saved_prefills * prefill_latency_sec
    total_hours_saved = total_seconds_saved / 3600.0
    assert math.isclose(total_hours_saved, 9.16666, rel_tol=1e-3)



# ==============================================================================
# 4. DISTRIBUTED TOKEN BUCKET RATE LIMITER
# ==============================================================================

class DistributedTokenBucketRateLimiter:
    """
    Distributed Token Bucket Rate Limiter supporting burst capacity,
    multi-tenant tiers, and atomic token refill logic (simulating Redis Lua).
    """
    def __init__(self, default_rate: float = 10.0, default_capacity: float = 20.0):
        self.default_rate = default_rate
        self.default_capacity = default_capacity
        self.tenants: Dict[str, Dict[str, Any]] = {}

    def register_tenant(self, tenant_id: str, rate: float, capacity: float):
        self.tenants[tenant_id] = {
            "rate": float(rate),
            "capacity": float(capacity),
            "tokens": float(capacity),
            "last_refill": None,
        }

    def _get_tenant(self, tenant_id: str) -> Dict[str, Any]:
        if tenant_id not in self.tenants:
            self.register_tenant(tenant_id, self.default_rate, self.default_capacity)
        return self.tenants[tenant_id]

    def acquire(
        self,
        tenant_id: str,
        tokens_requested: int = 1,
        current_time: float = 0.0
    ) -> Tuple[bool, float, Dict[str, Any]]:
        tenant = self._get_tenant(tenant_id)
        rate = tenant["rate"]
        capacity = tenant["capacity"]
        last_refill = tenant["last_refill"]
        tokens = tenant["tokens"]

        # 1. Refill tokens based on elapsed time
        if last_refill is not None and current_time > last_refill:
            elapsed = current_time - last_refill
            tokens = min(capacity, tokens + elapsed * rate)

        tenant["last_refill"] = current_time

        # 2. Check if sufficient tokens are available
        if tokens >= tokens_requested:
            tokens -= tokens_requested
            tenant["tokens"] = tokens
            return True, 0.0, {
                "tenant_id": tenant_id,
                "allowed": True,
                "remaining_tokens": round(tokens, 2),
                "retry_after_sec": 0.0,
            }
        else:
            needed = tokens_requested - tokens
            retry_after = needed / rate if rate > 0 else float("inf")
            tenant["tokens"] = tokens
            return False, round(retry_after, 3), {
                "tenant_id": tenant_id,
                "allowed": False,
                "remaining_tokens": round(tokens, 2),
                "retry_after_sec": round(retry_after, 3),
            }


# ==============================================================================
# 5. MULTI-REGION GEO-DISTRIBUTED GPU ROUTER WITH CIRCUIT BREAKER
# ==============================================================================

class MultiRegionGPURouter:
    """
    Multi-Region Geo-Distributed GPU Router with dynamic latency weighting,
    load-aware penalty, circuit breaker (Closed/Open/Half-Open), and graceful cloud fallback.
    """
    def __init__(self, failure_threshold: int = 3, recovery_threshold: int = 2):
        self.failure_threshold = failure_threshold
        self.recovery_threshold = recovery_threshold
        self.regions: Dict[str, Dict[str, Any]] = {}

    def add_region(self, name: str, base_latency_ms: float, capacity: int):
        self.regions[name] = {
            "name": name,
            "base_latency_ms": base_latency_ms,
            "capacity": capacity,
            "active_load": 0,
            "consecutive_failures": 0,
            "consecutive_successes": 0,
            "circuit_state": "CLOSED",  # CLOSED, OPEN, HALF_OPEN
        }

    def record_result(self, region_name: str, success: bool):
        if region_name not in self.regions:
            return
        reg = self.regions[region_name]
        if success:
            reg["consecutive_failures"] = 0
            reg["consecutive_successes"] += 1
            if reg["circuit_state"] == "HALF_OPEN" and reg["consecutive_successes"] >= self.recovery_threshold:
                reg["circuit_state"] = "CLOSED"
        else:
            reg["consecutive_successes"] = 0
            reg["consecutive_failures"] += 1
            if reg["consecutive_failures"] >= self.failure_threshold:
                reg["circuit_state"] = "OPEN"

    def route(
        self,
        tenant_id: str = "default",
        max_acceptable_latency_ms: float = 300.0
    ) -> Tuple[str, str, Dict[str, Any]]:
        # Filter regions that are not OPEN
        candidates = []
        for reg in self.regions.values():
            if reg["circuit_state"] in ("CLOSED", "HALF_OPEN"):
                load_factor = reg["active_load"] / max(1, reg["capacity"])
                effective_latency = reg["base_latency_ms"] * (1.0 + load_factor)
                candidates.append((effective_latency, reg))

        if not candidates:
            return "CLOUD_PROVIDER_FALLBACK", "CIRCUIT_BREAKER_ALL_OPEN", {
                "reason": "All on-premise GPU clusters unreachable or tripped",
                "effective_latency_ms": 250.0,
            }

        candidates.sort(key=lambda x: x[0])
        best_eff_latency, best_reg = candidates[0]

        if best_eff_latency > max_acceptable_latency_ms:
            return "CLOUD_PROVIDER_FALLBACK", "LATENCY_SLA_VIOLATION", {
                "reason": f"Lowest internal latency {best_eff_latency:.1f}ms exceeds SLA {max_acceptable_latency_ms}ms",
                "effective_latency_ms": best_eff_latency,
            }

        best_reg["active_load"] += 1
        return best_reg["name"], "ROUTED_OPTIMAL_CLUSTER", {
            "effective_latency_ms": round(best_eff_latency, 2),
            "circuit_state": best_reg["circuit_state"],
            "active_load": best_reg["active_load"],
        }


# ==============================================================================
# 6. SLO ERROR BUDGET & TAIL LATENCY CALCULATOR
# ==============================================================================

class SLOErrorBudgetCalculator:
    """
    Mathematical modeling for SLO/SLA error budgets, burn rate alerts,
    and tail latency percentiles (P50, P90, P99, P99.9).
    """
    def __init__(self, sla_target: float = 0.999):
        self.sla_target = sla_target
        self.allowed_error_fraction = 1.0 - sla_target

    def calculate_budget(self, total_requests: int, failed_requests: int) -> Dict[str, Any]:
        allowed_failures = math.floor(total_requests * self.allowed_error_fraction)
        remaining_failures = allowed_failures - failed_requests
        budget_used_pct = (failed_requests / allowed_failures * 100.0) if allowed_failures > 0 else 0.0
        return {
            "total_requests": total_requests,
            "failed_requests": failed_requests,
            "allowed_failures": allowed_failures,
            "remaining_allowed_failures": max(0, remaining_failures),
            "budget_used_percentage": round(budget_used_pct, 2),
            "budget_exhausted": failed_requests > allowed_failures,
        }

    def compute_burn_rate(self, observed_error_rate: float) -> float:
        """
        Burn rate = observed error rate / target error rate.
        A burn rate of 1.0 means exactly 100% of the budget will be consumed in the period.
        Burn rate of 14.4x consumes 2% of a 30-day budget in 1 hour (Google SRE alert rule).
        """
        if self.allowed_error_fraction <= 0.0:
            return float("inf")
        return round(observed_error_rate / self.allowed_error_fraction, 2)

    @staticmethod
    def calculate_percentiles(latencies_ms: List[float]) -> Dict[str, float]:
        if not latencies_ms:
            return {"p50": 0.0, "p90": 0.0, "p99": 0.0, "p99_9": 0.0}
        sorted_vals = sorted(latencies_ms)
        n = len(sorted_vals)

        def get_p(p: float) -> float:
            k = (n - 1) * p
            f = math.floor(k)
            c = math.ceil(k)
            if f == c:
                return sorted_vals[int(k)]
            d0 = sorted_vals[int(f)] * (c - k)
            d1 = sorted_vals[int(c)] * (k - f)
            return d0 + d1

        return {
            "p50": round(get_p(0.50), 2),
            "p90": round(get_p(0.90), 2),
            "p99": round(get_p(0.99), 2),
            "p99_9": round(get_p(0.999), 2),
        }


# ==============================================================================
# TESTS FOR ADVANCED SYSTEM DESIGN MODULES
# ==============================================================================

def test_distributed_token_bucket_acquire_and_burst():
    limiter = DistributedTokenBucketRateLimiter()
    # Register enterprise tenant: 10 QPS, capacity 20 (burst 20)
    limiter.register_tenant("tenant-corp", rate=10.0, capacity=20.0)

    # 1. Burst 15 tokens at t=0
    allowed, retry_after, meta = limiter.acquire("tenant-corp", tokens_requested=15, current_time=0.0)
    assert allowed is True
    assert retry_after == 0.0
    assert meta["remaining_tokens"] == 5.0

    # 2. Request 10 more at t=0 (only 5 left) -> Rejected
    allowed2, retry_after2, meta2 = limiter.acquire("tenant-corp", tokens_requested=10, current_time=0.0)
    assert allowed2 is False
    # Needs 5 more tokens at 10 tokens/sec -> retry_after = 5 / 10 = 0.5s
    assert retry_after2 == 0.5

    # 3. Advance time to t=1.0s (refills 1.0 * 10 = 10 tokens -> total 5 + 10 = 15)
    allowed3, retry_after3, meta3 = limiter.acquire("tenant-corp", tokens_requested=10, current_time=1.0)
    assert allowed3 is True
    assert meta3["remaining_tokens"] == 5.0


def test_multi_region_gpu_router_optimal_and_failover():
    router = MultiRegionGPURouter(failure_threshold=3, recovery_threshold=2)
    router.add_region("ap-southeast-singapore", base_latency_ms=25.0, capacity=100)
    router.add_region("eu-west-frankfurt", base_latency_ms=160.0, capacity=100)
    router.add_region("us-east-virginia", base_latency_ms=220.0, capacity=200)

    # 1. Normal routing selects lowest latency (Singapore: 25ms)
    target, status, meta = router.route("tenant-vn")
    assert target == "ap-southeast-singapore"
    assert status == "ROUTED_OPTIMAL_CLUSTER"

    # 2. Simulate 3 consecutive failures in Singapore -> trips circuit breaker to OPEN
    router.record_result("ap-southeast-singapore", success=False)
    router.record_result("ap-southeast-singapore", success=False)
    router.record_result("ap-southeast-singapore", success=False)
    assert router.regions["ap-southeast-singapore"]["circuit_state"] == "OPEN"

    # 3. Next request automatically fails over to Frankfurt (160ms)
    target2, status2, meta2 = router.route("tenant-vn")
    assert target2 == "eu-west-frankfurt"
    assert status2 == "ROUTED_OPTIMAL_CLUSTER"

    # 4. If strict SLA is 100ms, Frankfurt (160ms) is too slow -> falls back to Cloud API
    target3, status3, meta3 = router.route("tenant-vn", max_acceptable_latency_ms=100.0)
    assert target3 == "CLOUD_PROVIDER_FALLBACK"
    assert status3 == "LATENCY_SLA_VIOLATION"


def test_slo_error_budget_and_burn_rate():
    calc = SLOErrorBudgetCalculator(sla_target=0.999)  # 99.9% SLA

    # 1M requests, 500 failures (allowed = 1000)
    budget = calc.calculate_budget(total_requests=1_000_000, failed_requests=500)
    assert budget["allowed_failures"] == 1000
    assert budget["remaining_allowed_failures"] == 500
    assert budget["budget_used_percentage"] == 50.0
    assert budget["budget_exhausted"] is False

    # 1M requests, 1500 failures -> budget exhausted
    budget_exhausted = calc.calculate_budget(total_requests=1_000_000, failed_requests=1500)
    assert budget_exhausted["budget_exhausted"] is True

    # Burn rate: target allowed error is 0.001 (0.1%). If observed error is 1% (0.01), burn rate is 10.0x
    burn_rate = calc.compute_burn_rate(observed_error_rate=0.01)
    assert burn_rate == 10.0


def test_ttft_percentile_calculation():
    # 100 samples from 10ms to 1000ms
    samples = [float(i * 10) for i in range(1, 101)]
    res = SLOErrorBudgetCalculator.calculate_percentiles(samples)
    assert res["p50"] == pytest.approx(505.0, abs=10.0)
    assert res["p90"] == pytest.approx(901.0, abs=10.0)
    assert res["p99"] == pytest.approx(990.1, abs=10.0)

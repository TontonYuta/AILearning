"""
test_module08.py — Bộ kiểm thử tự động cho Semantic Caching và Cost Tracing.
"""
import pytest
from modules.module08_llmops_caching.semantic_cache import SemanticCache
from modules.module08_llmops_caching.cost_tracer import LLMOpsTracer

def test_semantic_cache_hit_and_miss():
    cache = SemanticCache(similarity_threshold=0.85)

    # Lần 1: Cache trống -> Miss
    res1, sim1 = cache.get("Chính sách bảo hành laptop Dell")
    assert res1 is None
    assert cache.misses == 1

    # Lưu vào cache
    cache.set("Chính sách bảo hành laptop Dell", "Bảo hành 36 tháng.")

    # Lần 2: Câu hỏi giống hệt -> Hit
    res2, sim2 = cache.get("Chính sách bảo hành laptop Dell")
    assert res2 == "Bảo hành 36 tháng."
    assert sim2 >= 0.99
    assert cache.hits == 1

def test_cache_hit_rate_calculation():
    cache = SemanticCache()
    cache.hits = 7
    cache.misses = 3
    assert cache.hit_rate == 0.7

def test_cost_tracer_pricing_calculation():
    tracer = LLMOpsTracer()
    span = tracer.start_span("test_call", model="gpt-4o")
    # 1,000 input tokens ($0.0025) + 500 output tokens ($0.005) = $0.0075
    span.finish(input_tokens=1000, output_tokens=500, is_cache_hit=False)

    assert span.cost_usd == pytest.approx(0.0075, rel=1e-3)
    assert span.is_cache_hit is False

def test_cache_hit_incurs_zero_cost():
    tracer = LLMOpsTracer()
    span = tracer.start_span("cached_call", model="gpt-4o")
    span.finish(input_tokens=1000, output_tokens=500, is_cache_hit=True)

    assert span.cost_usd == 0.0
    assert span.is_cache_hit is True

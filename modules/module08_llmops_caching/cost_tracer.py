"""
cost_tracer.py — Bộ đo lường token, định giá chi phí và OpenTelemetry Tracing.
"""
import time
import uuid
from typing import Dict, Any, List
from dataclasses import dataclass, field

# Bảng giá chuẩn 2026 trên 1 triệu tokens (USD)
MODEL_PRICING_PER_1M = {
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "claude-3-5-sonnet": {"input": 3.00, "output": 15.00},
    "gemini-2-0-flash": {"input": 0.10, "output": 0.40},
}

@dataclass
class TraceSpan:
    trace_id: str
    span_id: str
    name: str
    start_time: float
    end_time: float = 0.0
    duration_ms: float = 0.0
    model: str = "gpt-4o"
    input_tokens: int = 0
    output_tokens: int = 0
    cost_usd: float = 0.0
    is_cache_hit: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

    def finish(self, input_tokens: int = 0, output_tokens: int = 0, is_cache_hit: bool = False):
        self.end_time = time.time()
        self.duration_ms = round((self.end_time - self.start_time) * 1000, 2)
        self.input_tokens = input_tokens
        self.output_tokens = output_tokens
        self.is_cache_hit = is_cache_hit

        if is_cache_hit:
            self.cost_usd = 0.0
        else:
            rates = MODEL_PRICING_PER_1M.get(self.model, {"input": 2.50, "output": 10.00})
            cost_in = (input_tokens / 1_000_000) * rates["input"]
            cost_out = (output_tokens / 1_000_000) * rates["output"]
            self.cost_usd = round(cost_in + cost_out, 6)

class LLMOpsTracer:
    def __init__(self):
        self.spans: List[TraceSpan] = []

    def start_span(self, name: str, model: str = "gpt-4o") -> TraceSpan:
        trace_id = str(uuid.uuid4())[:8]
        span_id = str(uuid.uuid4())[:8]
        span = TraceSpan(
            trace_id=trace_id,
            span_id=span_id,
            name=name,
            start_time=time.time(),
            model=model
        )
        self.spans.append(span)
        return span

    def get_summary(self) -> Dict[str, Any]:
        total_cost = sum(s.cost_usd for s in self.spans)
        total_tokens = sum(s.input_tokens + s.output_tokens for s in self.spans)
        cache_hits = sum(1 for s in self.spans if s.is_cache_hit)
        total_requests = len(self.spans)
        avg_latency = (
            sum(s.duration_ms for s in self.spans) / total_requests
            if total_requests > 0 else 0.0
        )

        return {
            "total_requests": total_requests,
            "cache_hits": cache_hits,
            "cache_hit_rate": round(cache_hits / total_requests, 3) if total_requests > 0 else 0.0,
            "total_tokens": total_tokens,
            "total_cost_usd": round(total_cost, 6),
            "avg_latency_ms": round(avg_latency, 2)
        }

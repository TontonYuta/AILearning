"""Test suite for Chapter 3 Systems and Networking code examples."""
import pytest
from typing import Dict, Any, List, Optional

class InMemorySlidingWindowRateLimiter:
    def __init__(self, limit: int = 10, window_seconds: float = 60.0):
        self.limit = limit
        self.window = window_seconds
        self.storage: Dict[str, List[float]] = {}

    def is_allowed(self, user_id: str, current_time: Optional[float] = None) -> bool:
        now = current_time if current_time is not None else 1000.0
        clear_before = now - self.window
        
        if user_id not in self.storage:
            self.storage[user_id] = []
            
        timestamps = self.storage[user_id]
        self.storage[user_id] = [t for t in timestamps if t > clear_before]
        
        if len(self.storage[user_id]) < self.limit:
            self.storage[user_id].append(now)
            return True
        return False

class NetworkLatencyBreakdownCalculator:
    @staticmethod
    def calculate_total_ttft(
        rtt_ms: float,
        gpu_ttft_ms: float,
        is_connection_reused: bool = True
    ) -> Dict[str, Any]:
        if rtt_ms < 0 or gpu_ttft_ms < 0:
            raise ValueError("Do tre khong the la so am")
            
        handshake_overhead = 0.0 if is_connection_reused else (2.0 * rtt_ms)
        transit_latency = rtt_ms
        total_ttft = handshake_overhead + transit_latency + gpu_ttft_ms
        network_percentage = ((handshake_overhead + transit_latency) / total_ttft) * 100.0
        
        return {
            "rtt_ms": rtt_ms,
            "gpu_ttft_ms": gpu_ttft_ms,
            "handshake_overhead_ms": handshake_overhead,
            "transit_ms": transit_latency,
            "total_ttft_ms": round(total_ttft, 2),
            "network_percentage": round(network_percentage, 1),
            "connection_reused": is_connection_reused
        }

def test_sliding_window_rate_limiter():
    limiter = InMemorySlidingWindowRateLimiter(limit=3, window_seconds=10.0)
    
    # 3 allowed requests within window
    assert limiter.is_allowed("user_1", current_time=1.0) is True
    assert limiter.is_allowed("user_1", current_time=2.0) is True
    assert limiter.is_allowed("user_1", current_time=3.0) is True
    
    # 4th request rejected
    assert limiter.is_allowed("user_1", current_time=4.0) is False
    
    # After window passes (> 10s from 1.0 -> 11.5s), request 1 falls out, 1 request allowed
    assert limiter.is_allowed("user_1", current_time=11.5) is True

def test_network_latency_calculator():
    # Without connection reuse (Handshake: 2 RTT = 72ms, Transit: 1 RTT = 36ms, GPU: 80ms)
    res_no_pool = NetworkLatencyBreakdownCalculator.calculate_total_ttft(
        rtt_ms=36.0, gpu_ttft_ms=80.0, is_connection_reused=False
    )
    assert res_no_pool["total_ttft_ms"] == 188.0
    assert res_no_pool["handshake_overhead_ms"] == 72.0
    
    # With connection reuse
    res_pool = NetworkLatencyBreakdownCalculator.calculate_total_ttft(
        rtt_ms=36.0, gpu_ttft_ms=80.0, is_connection_reused=True
    )
    assert res_pool["total_ttft_ms"] == 116.0
    assert res_pool["handshake_overhead_ms"] == 0.0

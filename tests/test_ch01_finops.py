"""Test suite for Chapter 1 FinOps and Inference Hardware Analyzer."""
import pytest
from dataclasses import dataclass
from typing import Dict, Any, List
import math
import time

@dataclass(frozen=True)
class HardwareSpec:
    gpu_name: str
    vram_gb: float
    memory_bandwidth_tb_s: float
    hourly_rental_usd: float

@dataclass(frozen=True)
class ModelInferenceSpec:
    model_name: str
    parameter_count_billions: float
    bytes_per_parameter: float
    
    @property
    def model_size_gb(self) -> float:
        return self.parameter_count_billions * self.bytes_per_parameter

class FinOpsInferenceAnalyzer:
    def __init__(self, model: ModelInferenceSpec, hardware: HardwareSpec):
        self.model = model
        self.hardware = hardware
        
    def calculate_max_single_user_decode_speed(self, num_gpus: int = 1) -> float:
        total_bandwidth_gb_s = num_gpus * (self.hardware.memory_bandwidth_tb_s * 1000.0)
        effective_bandwidth = total_bandwidth_gb_s * 0.80
        max_tokens_per_second = effective_bandwidth / self.model.model_size_gb
        return round(max_tokens_per_second, 2)

    def calculate_cost_per_1k_tokens(
        self, throughput_tokens_per_sec: float, utilization_rate: float, num_gpus: int = 1
    ) -> float:
        if throughput_tokens_per_sec <= 0 or utilization_rate <= 0:
            raise ValueError("Throughput va utilization phai lon hon 0")
        hourly_cost = num_gpus * self.hardware.hourly_rental_usd
        tokens_per_hour = throughput_tokens_per_sec * 3600.0 * utilization_rate
        cost_per_1k = (hourly_cost / tokens_per_hour) * 1000.0
        return round(cost_per_1k, 6)

    def calculate_breakeven_daily_queries(
        self,
        avg_prompt_tokens: int,
        avg_output_tokens: int,
        cloud_price_per_m_input: float,
        cloud_price_per_m_output: float,
        num_gpus: int = 1
    ) -> Dict[str, Any]:
        daily_fixed_cost = num_gpus * self.hardware.hourly_rental_usd * 24.0
        
        cost_per_query_cloud = (
            (avg_prompt_tokens / 1_000_000.0) * cloud_price_per_m_input +
            (avg_output_tokens / 1_000_000.0) * cloud_price_per_m_output
        )
        if cost_per_query_cloud <= 0:
            raise ValueError("Chi phi moi query Cloud phai lon hon 0")
            
        breakeven_queries_per_day = math.ceil(daily_fixed_cost / cost_per_query_cloud)
        return {
            "model_size_gb": self.model.model_size_gb,
            "monthly_gpu_cost_usd": round(daily_fixed_cost * 30.0, 2),
            "cost_per_query_cloud_usd": round(cost_per_query_cloud, 6),
            "breakeven_queries_per_day": breakeven_queries_per_day,
            "breakeven_monthly_tokens_millions": round(
                (breakeven_queries_per_day * (avg_prompt_tokens + avg_output_tokens) * 30) / 1e6, 2
            )
        }

class StreamingLatencyTracker:
    def __init__(self):
        self.t_start = 0.0
        self.t_first_token = 0.0
        self.token_timestamps: List[float] = []

    def start(self):
        self.t_start = time.perf_counter()
        self.token_timestamps.clear()

    def record_token(self):
        now = time.perf_counter()
        if not self.token_timestamps:
            self.t_first_token = now
        self.token_timestamps.append(now)

    def summary(self) -> Dict[str, float]:
        if not self.token_timestamps:
            return {"ttft_ms": 0.0, "tpot_ms": 0.0, "total_tokens": 0}
            
        ttft = (self.t_first_token - self.t_start) * 1000.0
        n_tokens = len(self.token_timestamps)
        
        if n_tokens > 1:
            decode_time = (self.token_timestamps[-1] - self.t_first_token) * 1000.0
            tpot = decode_time / (n_tokens - 1)
        else:
            tpot = 0.0
            
        return {
            "ttft_ms": round(ttft, 2),
            "tpot_ms": round(tpot, 2),
            "total_tokens": n_tokens,
            "tokens_per_second": round(1000.0 / tpot, 2) if tpot > 0 else 0.0
        }

# ======================== TESTS ========================

def test_finops_bandwidth_decode_speed():
    model = ModelInferenceSpec(model_name="Llama-3-70B", parameter_count_billions=70, bytes_per_parameter=2.0)
    hw = HardwareSpec(gpu_name="A100-80GB", vram_gb=80, memory_bandwidth_tb_s=2.0, hourly_rental_usd=2.5)
    analyzer = FinOpsInferenceAnalyzer(model, hw)

    speed_2gpu = analyzer.calculate_max_single_user_decode_speed(num_gpus=2)
    # Total effective bandwidth: 2 * 2000 * 0.8 = 3200 GB/s. Model: 140 GB -> 3200 / 140 = 22.86 tokens/s
    assert speed_2gpu == 22.86

def test_finops_breakeven_queries():
    model = ModelInferenceSpec(model_name="Llama-3-8B", parameter_count_billions=8, bytes_per_parameter=2.0)
    hw = HardwareSpec(gpu_name="RTX-4090", vram_gb=24, memory_bandwidth_tb_s=1.008, hourly_rental_usd=0.5)
    analyzer = FinOpsInferenceAnalyzer(model, hw)

    res = analyzer.calculate_breakeven_daily_queries(
        avg_prompt_tokens=1500,
        avg_output_tokens=300,
        cloud_price_per_m_input=3.0,
        cloud_price_per_m_output=15.0,
        num_gpus=1
    )
    # Cost per query: (1500/1e6)*3 + (300/1e6)*15 = 0.0045 + 0.0045 = 0.009 USD
    # Daily fixed cost: 1 * 0.5 * 24 = 12 USD
    # Breakeven queries/day: ceil(12 / 0.009) = 1334
    assert res["cost_per_query_cloud_usd"] == 0.009
    assert res["breakeven_queries_per_day"] == 1334

def test_finops_cost_per_1k_tokens():
    model = ModelInferenceSpec(model_name="Custom", parameter_count_billions=7, bytes_per_parameter=2.0)
    hw = HardwareSpec(gpu_name="A100", vram_gb=80, memory_bandwidth_tb_s=2.0, hourly_rental_usd=3.0)
    analyzer = FinOpsInferenceAnalyzer(model, hw)

    cost_100pct = analyzer.calculate_cost_per_1k_tokens(throughput_tokens_per_sec=500.0, utilization_rate=1.0)
    # 3.0 / (500 * 3600 * 1.0) * 1000 = 3.0 / 1800000 * 1000 = 0.001667
    assert cost_100pct == 0.001667

    cost_15pct = analyzer.calculate_cost_per_1k_tokens(throughput_tokens_per_sec=500.0, utilization_rate=0.15)
    # 3.0 / (500 * 3600 * 0.15) * 1000 = 3.0 / 270000 * 1000 = 0.011111
    assert cost_15pct == 0.011111

def test_streaming_latency_tracker():
    tracker = StreamingLatencyTracker()
    tracker.start()
    time.sleep(0.01)
    tracker.record_token()
    time.sleep(0.005)
    tracker.record_token()
    time.sleep(0.005)
    tracker.record_token()

    summary = tracker.summary()
    assert summary["total_tokens"] == 3
    assert summary["ttft_ms"] >= 9.0
    assert summary["tpot_ms"] >= 4.0
    assert summary["tokens_per_second"] > 0

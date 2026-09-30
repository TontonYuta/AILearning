"""Test suite for Chapter 1 FinOps and Inference Hardware Analyzer."""
import pytest
from dataclasses import dataclass
from typing import Dict, Any
import math

@dataclass(frozen=True)
class HardwareSpec:
    gpu_name: str
    vram_gb: float
    memory_bandwidth_tb_s: float
    monthly_rental_usd: float

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
        
    def calculate_max_single_user_decode_speed(self, num_gpus: int) -> float:
        total_bandwidth_gb_s = num_gpus * (self.hardware.memory_bandwidth_tb_s * 1000.0)
        effective_bandwidth = total_bandwidth_gb_s * 0.80
        max_tokens_per_second = effective_bandwidth / self.model.model_size_gb
        return round(max_tokens_per_second, 2)

    def calculate_breakeven_daily_queries(
        self,
        avg_prompt_tokens: int,
        avg_output_tokens: int,
        cloud_price_per_m_input: float,
        cloud_price_per_m_output: float,
        num_gpus: int = 1
    ) -> Dict[str, Any]:
        monthly_fixed_cost = num_gpus * self.hardware.monthly_rental_usd
        daily_fixed_cost = monthly_fixed_cost / 30.0
        
        cost_per_query_cloud = (
            (avg_prompt_tokens / 1_000_000.0) * cloud_price_per_m_input +
            (avg_output_tokens / 1_000_000.0) * cloud_price_per_m_output
        )
        
        if cost_per_query_cloud <= 0:
            raise ValueError("Chi phi moi query Cloud phai lon hon 0")
            
        breakeven_queries_per_day = math.ceil(daily_fixed_cost / cost_per_query_cloud)
        
        return {
            "model_size_gb": self.model.model_size_gb,
            "monthly_gpu_cost_usd": monthly_fixed_cost,
            "cost_per_query_cloud_usd": round(cost_per_query_cloud, 6),
            "breakeven_queries_per_day": breakeven_queries_per_day,
            "breakeven_monthly_tokens_millions": round(
                (breakeven_queries_per_day * (avg_prompt_tokens + avg_output_tokens) * 30) / 1e6, 2
            )
        }

def test_hardware_bandwidth_decode_speed():
    model = ModelInferenceSpec("Llama-3-70B-FP16", 70.0, 2.0)
    gpu = HardwareSpec("A100-80GB", 80.0, 2.0, 1500.0)
    analyzer = FinOpsInferenceAnalyzer(model, gpu)
    
    # 2 GPUs: 4000 GB/s theoretical, 80% effective = 3200 GB/s
    # Model size: 140 GB -> Speed = 3200 / 140 = 22.86 tokens/s
    speed = analyzer.calculate_max_single_user_decode_speed(num_gpus=2)
    assert speed == 22.86

def test_breakeven_calculation():
    model = ModelInferenceSpec("Llama-3-8B-INT4", 8.0, 0.5)
    gpu = HardwareSpec("RTX-4090", 24.0, 1.0, 300.0)
    analyzer = FinOpsInferenceAnalyzer(model, gpu)
    
    result = analyzer.calculate_breakeven_daily_queries(
        avg_prompt_tokens=1000,
        avg_output_tokens=200,
        cloud_price_per_m_input=1.0,
        cloud_price_per_m_output=3.0,
        num_gpus=1
    )
    
    # Cost per query = (1000/1e6)*1.0 + (200/1e6)*3.0 = 0.001 + 0.0006 = 0.0016
    # Daily GPU cost = 300 / 30 = 10 USD
    # Breakeven = 10 / 0.0016 = 6250 queries/day
    assert result["cost_per_query_cloud_usd"] == 0.0016
    assert result["breakeven_queries_per_day"] == 6250
    assert result["model_size_gb"] == 4.0

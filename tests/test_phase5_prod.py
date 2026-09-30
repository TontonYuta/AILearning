"""Unit test xác thực toàn bộ mã nguồn ví dụ trong Giai đoạn 5: Production AI & MLOps."""

import pytest
from typing import Tuple

# 1. Test MinimalLoRALayer
class MinimalLoRALayer:
    def __init__(self, in_dim: int, out_dim: int, rank: int = 4, alpha: float = 8.0):
        self.rank = rank
        self.scaling = alpha / rank
        self.in_dim = in_dim
        self.out_dim = out_dim

    def compute_param_count(self) -> Tuple[int, int, float]:
        full_params = self.in_dim * self.out_dim
        lora_params = (self.in_dim * self.rank) + (self.out_dim * self.rank)
        reduction_pct = (1.0 - (lora_params / full_params)) * 100.0
        return full_params, lora_params, reduction_pct

def test_lora_parameter_reduction():
    # Linear projection 4096 -> 4096 voi rank 8
    layer = MinimalLoRALayer(in_dim=4096, out_dim=4096, rank=8)
    full, lora, reduction = layer.compute_param_count()
    
    assert full == 16777216
    assert lora == 65536
    assert reduction > 99.0

# 2. Test VRAM Requirement Calculation
def calculate_model_vram_gb(param_billions: float, bits_per_param: int, kv_cache_gb: float = 2.0) -> float:
    weights_gb = (param_billions * 1e9 * (bits_per_param / 8.0)) / (1024 ** 3)
    total_vram = (weights_gb + kv_cache_gb) * 1.2 # 20% margin
    return round(total_vram, 2)

def test_vram_calculation():
    # Llama 3 8B INT4 (4 bits)
    vram = calculate_model_vram_gb(8.0, 4, kv_cache_gb=2.0)
    assert 6.0 <= vram <= 8.0

# 3. Test Decision Map
def recommend_ai_strategy(needs_new_knowledge: bool, needs_format_style: bool) -> str:
    if needs_new_knowledge and needs_format_style:
        return "RAG_PLUS_LORA"
    elif needs_new_knowledge:
        return "RAG"
    elif needs_format_style:
        return "FINE_TUNING"
    return "PROMPTING"

def test_decision_map():
    assert recommend_ai_strategy(True, False) == "RAG"
    assert recommend_ai_strategy(False, True) == "FINE_TUNING"
    assert recommend_ai_strategy(True, True) == "RAG_PLUS_LORA"
    assert recommend_ai_strategy(False, False) == "PROMPTING"

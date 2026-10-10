"""
lora_engine.py — Động cơ tính toán LoRA (Low-Rank Adaptation) và Multi-Adapter Dynamic Switching.
"""
import numpy as np
from typing import Dict, Optional

class LoRAAdapter:
    def __init__(self, name: str, in_features: int, out_features: int, rank: int = 8, alpha: float = 16.0):
        self.name = name
        self.rank = rank
        self.alpha = alpha
        self.scaling = alpha / rank

        # Khởi tạo ma trận A (Gaussian) và B (Zeros) theo chuẩn bài báo LoRA (Hu et al.)
        # A: (rank, in_features), B: (out_features, rank)
        self.A = np.random.normal(loc=0.0, scale=0.02, size=(rank, in_features)).astype(np.float32)
        self.B = np.zeros(shape=(out_features, rank), dtype=np.float32)

    def get_delta_weight(self) -> np.ndarray:
        """Tính ma trận biến thiên trọng số: Delta W = (alpha / r) * (B @ A)"""
        return self.scaling * (self.B @ self.A)

class DynamicLoRALinear:
    """
    Lớp Linear hỗ trợ nạp cố định trọng số gốc W0 và hoán đổi linh hoạt nhiều LoRA Adapter.
    Công thức: y = x @ (W0 + Delta W)^T
    """
    def __init__(self, in_features: int, out_features: int):
        self.in_features = in_features
        self.out_features = out_features
        # Trọng số mô hình nền tảng W0 (được đóng băng - Frozen)
        self.W0 = np.random.normal(loc=0.0, scale=0.05, size=(out_features, in_features)).astype(np.float32)
        self.adapters: Dict[str, LoRAAdapter] = {}
        self.active_adapter_name: Optional[str] = None

    def add_adapter(self, adapter: LoRAAdapter):
        self.adapters[adapter.name] = adapter

    def set_active_adapter(self, adapter_name: Optional[str]):
        if adapter_name and adapter_name not in self.adapters:
            raise ValueError(f"Adapter '{adapter_name}' chưa được nạp.")
        self.active_adapter_name = adapter_name

    def forward(self, x: np.ndarray) -> np.ndarray:
        """
        Thực hiện phép tính forward:
        y = x @ W0.T + (nếu có adapter: scaling * (x @ A.T @ B.T))
        """
        # 1. Tính nhánh gốc (Base Output)
        base_output = x @ self.W0.T

        # 2. Nếu có Adapter đang hoạt động, cộng thêm Delta
        if self.active_adapter_name:
            adapter = self.adapters[self.active_adapter_name]
            # Tính (x @ A.T) -> sau đó nhân tiếp @ B.T để tiết kiệm chi phí tính toán O(d*r)
            lora_intermediate = x @ adapter.A.T
            lora_output = lora_intermediate @ adapter.B.T
            return base_output + (adapter.scaling * lora_output)

        return base_output

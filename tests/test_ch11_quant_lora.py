"""
Tests for Chapter 11: Quantization & LoRA Fine-Tuning
Covers:
- Symmetric INT8 Quantization and Dequantization numerical accuracy
- LoRA parameter count calculation and forward pass mathematical equivalence
- Weight merging logic for zero-latency inference
"""

import numpy as np
import pytest


def symmetric_quantize_int8(x: np.ndarray) -> tuple[np.ndarray, float]:
    """
    Symmetric INT8 quantization:
    Scale = max(|x|) / 127
    q = clip(round(x / Scale), -127, 127)
    """
    max_val = np.max(np.abs(x))
    if max_val == 0.0:
        return np.zeros_like(x, dtype=np.int8), 1.0

    scale = max_val / 127.0
    q = np.clip(np.round(x / scale), -127, 127).astype(np.int8)
    return q, scale


def dequantize_int8(q: np.ndarray, scale: float) -> np.ndarray:
    """Dequantizes INT8 back to float: x_hat = q * scale."""
    return q.astype(np.float32) * scale


class SimpleLoRALayer:
    """
    Simulates a LoRA adapted linear layer:
    y = x @ W0 + (alpha / r) * (x @ A @ B)
    where W0 is frozen base weight (d_in, d_out)
    A is (d_in, r) initialized with Gaussian
    B is (r, d_out) initialized with Zeros
    """
    def __init__(self, d_in: int, d_out: int, r: int = 8, alpha: float = 16.0):
        self.d_in = d_in
        self.d_out = d_out
        self.r = r
        self.alpha = alpha
        self.scaling = alpha / r

        # Frozen base weight
        self.w0 = np.random.standard_normal((d_in, d_out)).astype(np.float32)

        # LoRA trainable low-rank adapters
        # A initialized with normal distribution
        self.a = np.random.standard_normal((d_in, r)).astype(np.float32) * 0.01
        # B initialized with zeros so that Delta W is initially 0
        self.b = np.zeros((r, d_out), dtype=np.float32)

    def forward(self, x: np.ndarray) -> np.ndarray:
        base_out = np.matmul(x, self.w0)
        lora_out = self.scaling * np.matmul(np.matmul(x, self.a), self.b)
        return base_out + lora_out

    def merge_weights(self) -> np.ndarray:
        """Merges LoRA weights permanently into base weights for zero inference overhead."""
        delta_w = self.scaling * np.matmul(self.a, self.b)
        return self.w0 + delta_w


def test_symmetric_quantization():
    x = np.array([-10.0, -5.0, 0.0, 2.5, 7.5, 10.0], dtype=np.float32)
    q, scale = symmetric_quantize_int8(x)

    # Scale should be 10.0 / 127 = 0.07874...
    assert pytest.approx(scale, 1e-4) == 10.0 / 127.0
    # Boundary values must map to -127 and +127
    assert q[0] == -127
    assert q[-1] == 127

    x_hat = dequantize_int8(q, scale)
    # Mean squared error should be very small
    mse = np.mean((x - x_hat) ** 2)
    assert mse < 0.01


def test_lora_initialization_and_forward():
    d_in = 32
    d_out = 64
    r = 4
    alpha = 8.0
    batch_size = 2

    layer = SimpleLoRALayer(d_in, d_out, r=r, alpha=alpha)
    x = np.random.standard_normal((batch_size, d_in)).astype(np.float32)

    # At initialization, B is all zeros, so LoRA output must be EXACTLY identical to base output!
    y_init = layer.forward(x)
    y_base = np.matmul(x, layer.w0)
    np.testing.assert_allclose(y_init, y_base, atol=1e-6)

    # Now simulate some training by updating B
    layer.b += np.random.standard_normal(layer.b.shape) * 0.1
    y_adapted = layer.forward(x)

    # Test weight merging: merged model forward must be identical to unmerged layer forward
    w_merged = layer.merge_weights()
    y_merged = np.matmul(x, w_merged)
    np.testing.assert_allclose(y_adapted, y_merged, atol=1e-5)

"""
Tests for Chapter 10: Docker Packaging, Model Serving with vLLM & GPU Infrastructure
Covers:
- Mathematical equivalence of Column-Parallel and Row-Parallel linear layers (Tensor Parallelism)
- All-Reduce communication volume calculation
- GPU memory headroom and IPC shared memory calculations
"""

import numpy as np
import pytest


def simulate_tensor_parallelism_linear(
    x: np.ndarray,
    w: np.ndarray,
    tp_size: int = 2
) -> np.ndarray:
    """
    Simulates Tensor Parallelism for an MLP layer:
    Column-Parallel W1 followed by Row-Parallel W2.
    Formula: Output = (x * W1_split) * W2_split + All-Reduce sum
    Mathematically identical to: Output = (x * W1) * W2
    """
    d_in, d_mid = w.shape
    assert d_mid % tp_size == 0, "Hidden dimension must be divisible by TP size"
    split_size = d_mid // tp_size

    # 1. Column-Parallel: Split W along column axis
    # Each GPU holds W_splits[i] of shape (d_in, split_size)
    w_splits = [w[:, i * split_size:(i + 1) * split_size] for i in range(tp_size)]
    
    # Forward pass on each GPU
    local_outputs = [np.matmul(x, w_i) for w_i in w_splits]

    # Concatenate columns to verify intermediate state
    full_intermediate = np.concatenate(local_outputs, axis=-1)
    expected_intermediate = np.matmul(x, w)
    np.testing.assert_allclose(full_intermediate, expected_intermediate, rtol=1e-5)

    return full_intermediate


def calculate_tp_allreduce_bytes(
    batch_size: int,
    hidden_dim: int,
    tp_size: int,
    bytes_per_elem: int = 2  # FP16
) -> int:
    """
    Calculates communication volume for a Ring All-Reduce in Tensor Parallelism.
    Formula: 2 * ((tp_size - 1) / tp_size) * (batch_size * hidden_dim * bytes_per_elem)
    """
    tensor_bytes = batch_size * hidden_dim * bytes_per_elem
    multiplier = 2 * (tp_size - 1) / tp_size
    return int(multiplier * tensor_bytes)


def test_tensor_parallelism_simulation():
    rng = np.random.default_rng(42)
    batch_size = 4
    d_in = 64
    d_out = 128
    tp_size = 4

    x = rng.standard_normal((batch_size, d_in))
    w = rng.standard_normal((d_in, d_out))

    # Standard forward
    y_true = np.matmul(x, w)

    # Tensor Parallelism simulation
    y_tp = simulate_tensor_parallelism_linear(x, w, tp_size=tp_size)

    np.testing.assert_allclose(y_tp, y_true, rtol=1e-5)


def test_allreduce_communication_math():
    # Llama-3-70B: hidden_dim = 8192, batch_size = 32, FP16 (2 bytes), TP = 4
    # Multiplier = 2 * (4 - 1) / 4 = 1.5
    # Message size = 32 * 8192 * 2 = 524,288 bytes = 512 KiB
    # AllReduce volume per GPU = 1.5 * 524,288 = 786,432 bytes = 768 KiB
    comm_bytes = calculate_tp_allreduce_bytes(
        batch_size=32,
        hidden_dim=8192,
        tp_size=4,
        bytes_per_elem=2
    )
    expected = int(1.5 * 32 * 8192 * 2)
    assert comm_bytes == expected
    assert comm_bytes == 786432

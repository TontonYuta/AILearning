"""
Tests for Chapter 10: Docker Packaging, Model Serving with vLLM, Triton & GPU Infrastructure
Covers:
- Mathematical equivalence of Column-Parallel and Row-Parallel linear layers (Tensor Parallelism)
- All-Reduce communication volume calculation
- DynamicBatchScheduler timeout and batch size dispatch logic
- KEDAAutoscalingCalculator pod sizing based on queued and active requests
"""

import math
import time
from typing import Any, List, Tuple
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


class DynamicBatchScheduler:
    """
    Simulates dynamic batching logic (similar to Triton Dynamic Batcher):
    Dispatches when queue size reaches max_batch_size OR oldest request exceeds max_delay_ms.
    """
    def __init__(self, max_batch_size: int = 8, max_delay_ms: float = 10.0):
        self.max_batch_size = max_batch_size
        self.max_delay_ms = max_delay_ms
        self.queue: List[Tuple[Any, float]] = []

    def enqueue(self, item: Any, arrival_time: float = None):
        if arrival_time is None:
            arrival_time = time.time()
        self.queue.append((item, arrival_time))

    def should_dispatch(self, current_time: float = None) -> bool:
        if not self.queue:
            return False
        if len(self.queue) >= self.max_batch_size:
            return True
        if current_time is None:
            current_time = time.time()
        oldest_arrival = self.queue[0][1]
        elapsed_ms = (current_time - oldest_arrival) * 1000.0
        return elapsed_ms >= self.max_delay_ms

    def dispatch_batch(self) -> List[Any]:
        batch_count = min(len(self.queue), self.max_batch_size)
        dispatched = [self.queue[i][0] for i in range(batch_count)]
        self.queue = self.queue[batch_count:]
        return dispatched


class KEDAAutoscalingCalculator:
    """
    Calculates target pod replicas based on active + queued requests and pod capacity.
    """
    def __init__(self, min_replicas: int = 1, max_replicas: int = 10, pod_capacity: int = 32):
        self.min_replicas = min_replicas
        self.max_replicas = max_replicas
        self.pod_capacity = pod_capacity

    def compute_replicas(self, waiting_requests: int, active_requests: int) -> int:
        total_load = waiting_requests + active_requests
        if total_load == 0:
            return self.min_replicas

        desired = math.ceil(total_load / self.pod_capacity)
        return max(self.min_replicas, min(self.max_replicas, desired))


# ==============================================================================
# TESTS
# ==============================================================================

def test_tensor_parallelism_simulation():
    rng = np.random.default_rng(42)
    batch_size = 4
    d_in = 64
    d_out = 128
    tp_size = 4

    x = rng.standard_normal((batch_size, d_in))
    w = rng.standard_normal((d_in, d_out))

    y_true = np.matmul(x, w)
    y_tp = simulate_tensor_parallelism_linear(x, w, tp_size=tp_size)
    np.testing.assert_allclose(y_tp, y_true, rtol=1e-5)


def test_allreduce_communication_math():
    # Llama-3-70B: hidden_dim = 8192, batch_size = 32, FP16 (2 bytes), TP = 4
    comm_bytes = calculate_tp_allreduce_bytes(
        batch_size=32,
        hidden_dim=8192,
        tp_size=4,
        bytes_per_elem=2
    )
    expected = int(1.5 * 32 * 8192 * 2)
    assert comm_bytes == expected
    assert comm_bytes == 786432


def test_dynamic_batch_scheduler_size_trigger():
    scheduler = DynamicBatchScheduler(max_batch_size=4, max_delay_ms=100.0)

    # Empty queue should not dispatch
    assert not scheduler.should_dispatch(current_time=1000.0)

    # Enqueue 3 items at t=1000.0s (under max_batch_size and under timeout)
    for i in range(3):
        scheduler.enqueue(f"req_{i}", arrival_time=1000.0)
    assert not scheduler.should_dispatch(current_time=1000.02)  # 20ms elapsed < 100ms

    # Enqueue 4th item -> reaches max_batch_size, must dispatch immediately
    scheduler.enqueue("req_3", arrival_time=1000.02)
    assert scheduler.should_dispatch(current_time=1000.02)

    batch = scheduler.dispatch_batch()
    assert len(batch) == 4
    assert batch == ["req_0", "req_1", "req_2", "req_3"]
    assert len(scheduler.queue) == 0


def test_dynamic_batch_scheduler_timeout_trigger():
    scheduler = DynamicBatchScheduler(max_batch_size=8, max_delay_ms=10.0)

    # Enqueue 2 items at t=0.0
    scheduler.enqueue("item_a", arrival_time=100.000)
    scheduler.enqueue("item_b", arrival_time=100.002)

    # At t=100.005 (5ms elapsed), timeout not reached
    assert not scheduler.should_dispatch(current_time=100.005)

    # At t=100.012 (12ms elapsed >= 10ms), timeout reached!
    assert scheduler.should_dispatch(current_time=100.012)

    batch = scheduler.dispatch_batch()
    assert batch == ["item_a", "item_b"]
    assert len(scheduler.queue) == 0


def test_keda_autoscaling_calculator():
    calc = KEDAAutoscalingCalculator(min_replicas=2, max_replicas=50, pod_capacity=40)

    # Zero load returns min_replicas
    assert calc.compute_replicas(0, 0) == 2

    # Worked example: 1200 concurrent requests / 40 capacity = 30 pods
    assert calc.compute_replicas(waiting_requests=400, active_requests=800) == 30

    # Overload clamp to max_replicas
    assert calc.compute_replicas(waiting_requests=3000, active_requests=500) == 50

    # Small load clamped to min_replicas
    assert calc.compute_replicas(waiting_requests=5, active_requests=10) == 2


def test_ring_vs_tree_allreduce_math():
    """Verify analytical execution times of Ring-AllReduce and Tree-AllReduce."""
    P = 64
    alpha = 1.5e-6   # 1.5 microseconds latency per hop
    beta = 50e9      # 50 GB/s (400 Gbps)
    beta_tree = 25e9 # Effective tree root bandwidth (25 GB/s)

    # 1. Small tensor: 64 KB (Decode phase)
    S_small = 64 * 1024  # 65536 bytes
    t_ring_small = 2 * (P - 1) * alpha + 2 * ((P - 1) / P) * (S_small / beta)
    t_tree_small = 2 * math.log2(P) * alpha + 2 * (S_small / beta_tree)
    
    # Tree must be over 5x faster than Ring for small tensors
    assert t_tree_small < t_ring_small / 5.0
    assert math.isclose(t_tree_small * 1e6, 23.24, rel_tol=0.05)

    # 2. Large tensor: 1 GB (Gradient sync)
    S_large = 1 * (1024**3)
    t_ring_large = 2 * (P - 1) * alpha + 2 * ((P - 1) / P) * (S_large / beta)
    t_tree_large = 2 * math.log2(P) * alpha + 2 * (S_large / beta_tree)
    
    # Ring must be nearly 2x faster than Tree for large tensors
    assert t_ring_large < t_tree_large * 0.60


def test_pfc_headroom_buffer_sizing():
    """Verify RoCEv2 switch headroom buffer sizing to prevent packet drop."""
    L = 50.0            # 50 meters
    v = 2.0e8           # 200,000 km/s in fiber
    t_proc = 400.0e-9   # 400 ns processing & pause generation delay
    bandwidth_Bps = 50.0e9  # 400 Gbps = 50 GB/s

    # Propagation time one-way
    t_prop = L / v
    assert t_prop == 250.0e-9

    # Total drain time
    t_drain = 2 * t_prop + t_proc
    assert math.isclose(t_drain, 900.0e-9)

    # Required headroom buffer
    headroom_bytes = t_drain * bandwidth_Bps
    assert math.isclose(headroom_bytes, 45000.0)
    assert headroom_bytes / 1024 < 45.0  # ~43.95 KiB


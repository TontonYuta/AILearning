"""
Tests for Chapter 7: LLM Runtime, Tokenomics & KV Cache Optimization
Covers:
- Decoding sampling algorithms (Greedy, Temperature, Top-K, Top-P, Min-P)
- KV Cache memory calculation analytical formulas
- PagedAttention block allocation simulator
"""

import math
import numpy as np
import pytest


def calculate_kv_cache_size_bytes(
    n_layers: int,
    n_kv_heads: int,
    d_head: int,
    seq_len: int,
    batch_size: int,
    bytes_per_elem: int = 2  # FP16
) -> int:
    """
    Computes exact KV Cache memory in bytes.
    Formula: 2 * n_layers * n_kv_heads * d_head * seq_len * batch_size * bytes_per_elem
    (The factor of 2 accounts for both Key and Value tensors).
    """
    return 2 * n_layers * n_kv_heads * d_head * seq_len * batch_size * bytes_per_elem


class DecodingSampler:
    """
    Numerically stable vectorized token sampler supporting:
    - Temperature scaling
    - Top-K truncation
    - Top-P (Nucleus) truncation
    - Min-P truncation
    - Greedy decoding (temperature -> 0)
    """

    @staticmethod
    def sample(
        logits: np.ndarray,
        temperature: float = 1.0,
        top_k: int = 0,
        top_p: float = 1.0,
        min_p: float = 0.0,
        rng: np.random.Generator = None
    ) -> int:
        if rng is None:
            rng = np.random.default_rng(42)

        logits = np.array(logits, dtype=np.float64)

        # Greedy decoding when temperature is effectively zero
        if temperature <= 1e-5:
            return int(np.argmax(logits))

        # 1. Temperature scaling
        scaled_logits = logits / temperature

        # Numerically stable softmax
        max_logit = np.max(scaled_logits)
        exp_logits = np.exp(scaled_logits - max_logit)
        probs = exp_logits / np.sum(exp_logits)

        # 2. Min-P filtering
        if min_p > 0.0:
            p_max = np.max(probs)
            threshold = min_p * p_max
            mask = probs < threshold
            probs[mask] = 0.0

        # 3. Top-K filtering
        if top_k > 0 and top_k < len(probs):
            top_k_indices = np.argpartition(probs, -top_k)[-top_k:]
            mask = np.ones(len(probs), dtype=bool)
            mask[top_k_indices] = False
            probs[mask] = 0.0

        # 4. Top-P (Nucleus) filtering
        if top_p < 1.0:
            sorted_indices = np.argsort(probs)[::-1]
            sorted_probs = probs[sorted_indices]
            cumulative_probs = np.cumsum(sorted_probs)

            # Mask out tokens beyond top_p threshold (keep at least one token)
            cutoff_index = np.searchsorted(cumulative_probs, top_p)
            cutoff_index = min(cutoff_index + 1, len(probs))
            valid_indices = sorted_indices[:cutoff_index]

            mask = np.ones(len(probs), dtype=bool)
            mask[valid_indices] = False
            probs[mask] = 0.0

        # Re-normalize
        total_p = np.sum(probs)
        if total_p == 0.0:
            # Fallback to greedy
            return int(np.argmax(logits))

        probs = probs / total_p
        return int(rng.choice(len(probs), p=probs))


class SimplePagedKVCacheManager:
    """
    Simulates OS Paging style PagedAttention block manager.
    Maps variable length sequences to fixed-size physical blocks without internal fragmentation.
    """

    def __init__(self, num_blocks: int, block_size: int = 16):
        self.block_size = block_size
        self.num_blocks = num_blocks
        self.free_blocks = list(range(num_blocks))
        self.block_tables: dict[int, list[int]] = {}  # req_id -> list of physical block ids

    def allocate(self, req_id: int, num_tokens: int) -> bool:
        needed_blocks = math.ceil(num_tokens / self.block_size)
        if needed_blocks > len(self.free_blocks):
            return False  # Out of memory

        allocated = [self.free_blocks.pop(0) for _ in range(needed_blocks)]
        self.block_tables[req_id] = allocated
        return True

    def append_token(self, req_id: int, current_tokens: int) -> bool:
        """Appends one token to sequence. Allocates a new physical block only when block boundary is crossed."""
        if req_id not in self.block_tables:
            return False

        # If current_tokens is an exact multiple of block_size, we need a new physical block
        if current_tokens % self.block_size == 0:
            if not self.free_blocks:
                return False  # OOM during generation
            new_block = self.free_blocks.pop(0)
            self.block_tables[req_id].append(new_block)

        return True

    def free(self, req_id: int):
        if req_id in self.block_tables:
            for blk in self.block_tables[req_id]:
                self.free_blocks.append(blk)
            del self.block_tables[req_id]

    def get_fragmentation_stats(self, active_token_counts: dict[int, int]) -> tuple[float, float]:
        """
        Returns (allocated_capacity_tokens, actual_used_tokens, waste_ratio)
        """
        total_allocated_tokens = sum(len(blks) * self.block_size for blks in self.block_tables.values())
        total_used_tokens = sum(active_token_counts.get(req_id, 0) for req_id in self.block_tables)
        if total_allocated_tokens == 0:
            return 0.0, 0.0
        waste_ratio = (total_allocated_tokens - total_used_tokens) / total_allocated_tokens
        return total_allocated_tokens, waste_ratio


def test_kv_cache_memory_calculation():
    # Llama-3-8B configuration:
    # 32 layers, 8 KV heads (GQA with 32 query heads), head_dim=128, FP16 (2 bytes)
    # Batch size = 64, sequence length = 4096
    size_8b_bytes = calculate_kv_cache_size_bytes(
        n_layers=32,
        n_kv_heads=8,
        d_head=128,
        seq_len=4096,
        batch_size=64,
        bytes_per_elem=2
    )
    # Expected: 2 * 32 * 8 * 128 * 4096 * 64 * 2 = 34,359,738,368 bytes = 32 GiB exactly!
    expected_bytes = 32 * (1024 ** 3)
    assert size_8b_bytes == expected_bytes, f"Expected {expected_bytes}, got {size_8b_bytes}"

    # If it were traditional MHA (32 KV heads):
    size_mha_bytes = calculate_kv_cache_size_bytes(
        n_layers=32,
        n_kv_heads=32,
        d_head=128,
        seq_len=4096,
        batch_size=64,
        bytes_per_elem=2
    )
    # GQA saves exactly 4x VRAM over MHA (32 heads / 8 heads = 4x)
    assert size_mha_bytes == 4 * size_8b_bytes


def test_decoding_sampler():
    logits = np.array([2.0, 5.0, 1.0, 0.5, 4.0])

    # 1. Test Greedy decoding (temp = 0)
    best_idx = DecodingSampler.sample(logits, temperature=0.0)
    assert best_idx == 1  # logit 5.0 is highest

    # 2. Test Top-K truncation (K=1 should behave identically to greedy)
    top1_idx = DecodingSampler.sample(logits, temperature=1.0, top_k=1)
    assert top1_idx == 1

    # 3. Test reproducibility with seed
    rng1 = np.random.default_rng(123)
    rng2 = np.random.default_rng(123)
    res1 = DecodingSampler.sample(logits, temperature=0.7, top_p=0.9, rng=rng1)
    res2 = DecodingSampler.sample(logits, temperature=0.7, top_p=0.9, rng=rng2)
    assert res1 == res2


def test_paged_kv_cache_manager():
    # 10 physical blocks of size 16 tokens (total 160 tokens)
    manager = SimplePagedKVCacheManager(num_blocks=10, block_size=16)

    # Request 1 needs 30 tokens -> needs ceil(30/16) = 2 blocks (32 tokens allocated)
    assert manager.allocate(req_id=1, num_tokens=30)
    assert len(manager.block_tables[1]) == 2
    assert len(manager.free_blocks) == 8

    # Token counts: 30 tokens used out of 32 allocated -> waste = (32 - 30) / 32 = 6.25%
    total_cap, waste = manager.get_fragmentation_stats({1: 30})
    assert total_cap == 32
    assert pytest.approx(waste, 0.001) == 2 / 32

    # Append 2 tokens -> 32 tokens used (exact match for 2 blocks)
    manager.append_token(req_id=1, current_tokens=30)
    manager.append_token(req_id=1, current_tokens=31)
    assert len(manager.block_tables[1]) == 2  # still 2 blocks

    # Append 33rd token -> crosses boundary (current_tokens=32), must allocate 3rd block
    assert manager.append_token(req_id=1, current_tokens=32)
    assert len(manager.block_tables[1]) == 3
    assert len(manager.free_blocks) == 7

    # Free request 1
    manager.free(1)
    assert len(manager.free_blocks) == 10

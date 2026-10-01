"""Test suite for Chapter 6 Transformer Architecture and Attention."""
import pytest
import numpy as np
from typing import Tuple

class ScaledDotProductAttention:
    @staticmethod
    def forward(
        Q: np.ndarray,
        K: np.ndarray,
        V: np.ndarray,
        is_causal: bool = False
    ) -> Tuple[np.ndarray, np.ndarray]:
        d_k = Q.shape[-1]
        scores = np.matmul(Q, np.swapaxes(K, -1, -2)) / np.sqrt(d_k)
        
        if is_causal:
            seq_len_q = Q.shape[-2]
            seq_len_k = K.shape[-2]
            mask = np.triu(np.ones((seq_len_q, seq_len_k)), k=1).astype(bool)
            scores = np.where(mask, -1e4, scores) # Use -1e4 for safety
            
        shifted_scores = scores - np.max(scores, axis=-1, keepdims=True)
        exp_scores = np.exp(shifted_scores)
        attention_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
        
        output = np.matmul(attention_weights, V)
        return output, attention_weights

def test_scaled_dot_product_attention_numerical_example():
    # Verify hand calculation from Chapter 6
    Q = np.array([[[1.0, 0.0], [0.0, 2.0], [1.0, 1.0]]]) # Shape [1, 3, 2]
    K = np.array([[[1.0, 1.0], [2.0, 0.0], [0.0, 1.0]]]) # Shape [1, 3, 2]
    V = np.array([[[10.0, 0.0], [0.0, 20.0], [5.0, 5.0]]]) # Shape [1, 3, 2]
    
    out, weights = ScaledDotProductAttention.forward(Q, K, V, is_causal=False)
    
    # Check weights sum to 1.0 per row
    assert pytest.approx(np.sum(weights, axis=-1), 1e-5) == np.ones((1, 3))
    
    # Check row 1 weights: A11 ≈ 0.2840, A12 ≈ 0.5760, A13 ≈ 0.1400
    assert pytest.approx(weights[0, 0, 0], 1e-3) == 0.2840
    assert pytest.approx(weights[0, 0, 1], 1e-3) == 0.5760
    assert pytest.approx(weights[0, 0, 2], 1e-3) == 0.1400
    
    # Check output token 1: o1 ≈ [3.54, 12.22]
    assert pytest.approx(out[0, 0, 0], 1e-2) == 3.54
    assert pytest.approx(out[0, 0, 1], 1e-2) == 12.22

def test_causal_masking_zeroes_future():
    Q = np.random.randn(1, 4, 8)
    K = np.random.randn(1, 4, 8)
    V = np.random.randn(1, 4, 8)
    
    _, weights = ScaledDotProductAttention.forward(Q, K, V, is_causal=True)
    
    # Position 0 can only attend to position 0 (future tokens 1, 2, 3 must be 0)
    assert weights[0, 0, 1] == pytest.approx(0.0, abs=1e-3)
    assert weights[0, 0, 2] == pytest.approx(0.0, abs=1e-3)
    assert weights[0, 0, 3] == pytest.approx(0.0, abs=1e-3)
    assert weights[0, 0, 0] == pytest.approx(1.0, abs=1e-3)
    
    # Position 1 can only attend to 0 and 1
    assert weights[0, 1, 2] == pytest.approx(0.0, abs=1e-3)
    assert weights[0, 1, 3] == pytest.approx(0.0, abs=1e-3)


# ==============================================================================
# 2. ONLINE SOFTMAX ALGORITHM TEST (FLASHATTENTION PRIMITIVE)
# ==============================================================================

def online_softmax(x: np.ndarray, block_size: int = 2) -> np.ndarray:
    """
    Computes numerically stable softmax chunk-by-chunk without full materialization.
    Mimics FlashAttention's online normalization primitive.
    """
    n = len(x)
    m = -np.inf  # Running max
    d = 0.0      # Running denominator sum
    
    # Pass 1: Compute online max and sum
    for i in range(0, n, block_size):
        chunk = x[i:i + block_size]
        chunk_max = np.max(chunk)
        m_new = max(m, chunk_max)
        
        # Rescale previous sum by factor e^(m - m_new)
        d = d * np.exp(m - m_new) + np.sum(np.exp(chunk - m_new))
        m = m_new

    # Final normalization
    return np.exp(x - m) / d


def test_online_softmax_matches_standard_softmax():
    np.random.seed(42)
    x = np.array([2.5, 4.1, 1.2, 5.8, 3.3, 0.9, 7.1, 2.0])
    
    # Standard Softmax
    shifted = x - np.max(x)
    standard_res = np.exp(shifted) / np.sum(np.exp(shifted))
    
    # Online Softmax with block size 2
    online_res = online_softmax(x, block_size=2)
    
    np.testing.assert_allclose(online_res, standard_res, rtol=1e-6, atol=1e-6)
    assert pytest.approx(np.sum(online_res), 1e-6) == 1.0


# ==============================================================================
# 3. ROPE RELATIVE DISTANCE INVARIANCE TEST
# ==============================================================================

def apply_rotary_2d(vec: np.ndarray, pos: int, base: float = 10000.0) -> np.ndarray:
    """Applies 2D rotation to a vector at position pos."""
    dim = len(vec)
    rotated = np.zeros_like(vec)
    for i in range(0, dim, 2):
        theta = 1.0 / (base ** (i / dim))
        angle = pos * theta
        cos_val = np.cos(angle)
        sin_val = np.sin(angle)
        
        x0, x1 = vec[i], vec[i + 1]
        rotated[i] = x0 * cos_val - x1 * sin_val
        rotated[i + 1] = x0 * sin_val + x1 * cos_val
    return rotated


def test_rope_relative_distance_invariance():
    dim = 8
    q = np.array([1.0, 0.5, -0.2, 0.8, 0.3, -0.6, 0.9, -0.1])
    k = np.array([0.4, -0.7, 0.9, 0.1, -0.5, 0.2, 0.8, -0.3])

    # Pair A: q at pos 5, k at pos 3 -> relative distance = 2
    q_rot_5 = apply_rotary_2d(q, pos=5)
    k_rot_3 = apply_rotary_2d(k, pos=3)
    dot_product_a = np.dot(q_rot_5, k_rot_3)

    # Pair B: q at pos 12, k at pos 10 -> relative distance = 2
    q_rot_12 = apply_rotary_2d(q, pos=12)
    k_rot_10 = apply_rotary_2d(k, pos=10)
    dot_product_b = np.dot(q_rot_12, k_rot_10)

    # Dot products must be identical because m - n = 2 in both cases!
    assert pytest.approx(dot_product_a, 1e-5) == dot_product_b


# ==============================================================================
# 4. ATTENTION SCALING VARIANCE PROOF TEST
# ==============================================================================

def test_scaled_dot_product_variance_stabilization():
    np.random.seed(42)
    d_k = 64
    num_samples = 20000
    
    Q = np.random.randn(num_samples, d_k)
    K = np.random.randn(num_samples, d_k)
    
    # Unscaled dot product: s = sum_i(q_i * k_i)
    unscaled_dots = np.sum(Q * K, axis=-1)
    # Variance should be approximately d_k = 64
    assert pytest.approx(np.var(unscaled_dots), rel=0.08) == d_k

    # Scaled dot product: s_scaled = (q . k) / sqrt(d_k)
    scaled_dots = unscaled_dots / np.sqrt(d_k)
    # Variance should be stabilized back to 1.0!
    assert pytest.approx(np.var(scaled_dots), rel=0.08) == 1.0


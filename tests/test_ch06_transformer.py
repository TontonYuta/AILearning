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

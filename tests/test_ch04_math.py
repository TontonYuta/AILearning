"""Test suite for Chapter 4 Applied Mathematics and Mini Autograd."""
import pytest
import numpy as np

class AppliedMathAI:
    @staticmethod
    def cosine_similarity(u: np.ndarray, v: np.ndarray) -> float:
        norm_u = np.linalg.norm(u)
        norm_v = np.linalg.norm(v)
        if norm_u == 0.0 or norm_v == 0.0:
            return 0.0
        return float(np.dot(u, v) / (norm_u * norm_v))

    @staticmethod
    def numerically_stable_softmax(logits: np.ndarray) -> np.ndarray:
        shifted_logits = logits - np.max(logits, axis=-1, keepdims=True)
        exp_logits = np.exp(shifted_logits)
        return exp_logits / np.sum(exp_logits, axis=-1, keepdims=True)

    @staticmethod
    def cross_entropy_loss(y_true: np.ndarray, y_pred_probs: np.ndarray, eps: float = 1e-15) -> float:
        clipped_probs = np.clip(y_pred_probs, eps, 1.0 - eps)
        return float(-np.sum(y_true * np.log(clipped_probs)) / y_true.shape[0])

class SimpleLinearClassifier:
    def __init__(self, in_features: int, out_classes: int):
        self.W = np.ones((out_classes, in_features)) * 0.1

    def forward(self, x: np.ndarray):
        logits = np.dot(self.W, x)
        probs = AppliedMathAI.numerically_stable_softmax(logits)
        return logits, probs

    def backward(self, x: np.ndarray, probs: np.ndarray, y_true: np.ndarray, lr: float = 0.1) -> float:
        delta = probs - y_true
        grad_W = np.outer(delta, x)
        self.W -= lr * grad_W
        return AppliedMathAI.cross_entropy_loss(y_true[np.newaxis, :], probs[np.newaxis, :])

def test_cosine_similarity():
    u = np.array([1.0, 0.0, 0.0])
    v = np.array([0.0, 1.0, 0.0])
    w = np.array([2.0, 0.0, 0.0])
    
    # Orthogonal
    assert AppliedMathAI.cosine_similarity(u, v) == 0.0
    # Collinear
    assert pytest.approx(AppliedMathAI.cosine_similarity(u, w), 1e-6) == 1.0

def test_numerically_stable_softmax_no_overflow():
    # Large numbers that would overflow standard exp(1000)
    large_logits = np.array([1000.0, 1001.0, 1002.0])
    probs = AppliedMathAI.numerically_stable_softmax(large_logits)
    
    assert not np.isnan(probs).any()
    assert pytest.approx(np.sum(probs), 1e-6) == 1.0
    assert probs[2] > probs[1] > probs[0]

def test_linear_classifier_learns_step():
    clf = SimpleLinearClassifier(in_features=2, out_classes=2)
    x = np.array([1.0, 2.0])
    y_true = np.array([0.0, 1.0]) # Target class 1
    
    _, probs_before = clf.forward(x)
    loss_before = clf.backward(x, probs_before, y_true, lr=0.5)
    
    _, probs_after = clf.forward(x)
    loss_after = AppliedMathAI.cross_entropy_loss(y_true[np.newaxis, :], probs_after[np.newaxis, :])
    
    # Loss must decrease and probability of target class 1 must increase
    assert loss_after < loss_before
    assert probs_after[1] > probs_before[1]

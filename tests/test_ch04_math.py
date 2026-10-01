"""
Test suite for Chapter 4: Applied Mathematics for AI Engineers
Covers:
- Cosine similarity and Euclidean distance duality
- Numerically stable Softmax overflow protection
- Cross-Entropy Loss computation
- KL Divergence computation and hand-calculation verification
- SimpleLinearClassifier forward and backward learning step
- AdamWOptimizer moment tracking, bias correction, and decoupled weight decay
"""

import numpy as np
import pytest


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

    @staticmethod
    def kl_divergence(p: np.ndarray, q: np.ndarray, eps: float = 1e-15) -> float:
        p_c = np.clip(p, eps, 1.0)
        q_c = np.clip(q, eps, 1.0)
        p_c = p_c / np.sum(p_c)
        q_c = q_c / np.sum(q_c)
        return float(np.sum(p_c * np.log(p_c / q_c)))


class AdamWOptimizer:
    def __init__(self, params: np.ndarray, lr: float = 0.001, beta1: float = 0.9,
                 beta2: float = 0.999, eps: float = 1e-8, weight_decay: float = 0.01):
        self.params = params
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.weight_decay = weight_decay
        self.m = np.zeros_like(params)
        self.v = np.zeros_like(params)
        self.t = 0

    def step(self, grads: np.ndarray):
        self.t += 1
        self.m = self.beta1 * self.m + (1.0 - self.beta1) * grads
        self.v = self.beta2 * self.v + (1.0 - self.beta2) * (grads ** 2)

        m_hat = self.m / (1.0 - self.beta1 ** self.t)
        v_hat = self.v / (1.0 - self.beta2 ** self.t)

        step_grad = m_hat / (np.sqrt(v_hat) + self.eps)
        self.params -= self.lr * (step_grad + self.weight_decay * self.params)


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


# ==============================================================================
# TESTS
# ==============================================================================

def test_cosine_similarity():
    u = np.array([1.0, 0.0, 0.0])
    v = np.array([0.0, 1.0, 0.0])
    w = np.array([2.0, 0.0, 0.0])

    assert AppliedMathAI.cosine_similarity(u, v) == 0.0
    assert pytest.approx(AppliedMathAI.cosine_similarity(u, w), 1e-6) == 1.0


def test_numerically_stable_softmax_no_overflow():
    large_logits = np.array([1000.0, 1001.0, 1002.0])
    probs = AppliedMathAI.numerically_stable_softmax(large_logits)

    assert not np.isnan(probs).any()
    assert pytest.approx(np.sum(probs), 1e-6) == 1.0
    assert probs[2] > probs[1] > probs[0]


def test_linear_classifier_learns_step():
    clf = SimpleLinearClassifier(in_features=2, out_classes=2)
    x = np.array([1.0, 2.0])
    y_true = np.array([0.0, 1.0])

    _, probs_before = clf.forward(x)
    loss_before = clf.backward(x, probs_before, y_true, lr=0.5)

    _, probs_after = clf.forward(x)
    loss_after = AppliedMathAI.cross_entropy_loss(y_true[np.newaxis, :], probs_after[np.newaxis, :])

    assert loss_after < loss_before
    assert probs_after[1] > probs_before[1]


def test_kl_divergence_math():
    p = np.array([0.5, 0.5])
    q1 = np.array([0.4, 0.6])
    q2 = np.array([0.1, 0.9])

    # Check identical distributions have zero KL divergence
    assert pytest.approx(AppliedMathAI.kl_divergence(p, p), 1e-6) == 0.0

    # Worked example values:
    # D_KL(P || Q1) ~= 0.02041
    # D_KL(P || Q2) ~= 0.51083
    kl1 = AppliedMathAI.kl_divergence(p, q1)
    kl2 = AppliedMathAI.kl_divergence(p, q2)

    expected_kl1 = 0.5 * (np.log(0.5 / 0.4) + np.log(0.5 / 0.6))
    expected_kl2 = 0.5 * (np.log(0.5 / 0.1) + np.log(0.5 / 0.9))

    assert pytest.approx(kl1, 1e-4) == expected_kl1
    assert pytest.approx(kl2, 1e-4) == expected_kl2
    assert kl2 > kl1


def test_adamw_optimizer_step():
    # Worked example: theta_0 = 2.0, g_1 = 0.5, lr = 0.1, weight_decay = 0.01
    param = np.array([2.0], dtype=np.float64)
    opt = AdamWOptimizer(param, lr=0.1, beta1=0.9, beta2=0.999, eps=1e-8, weight_decay=0.01)

    opt.step(np.array([0.5], dtype=np.float64))

    # Hand calculation check:
    # m_1 = 0.05 -> m_hat = 0.5
    # v_1 = 0.00025 -> v_hat = 0.25 -> sqrt(v_hat) = 0.5
    # step_grad = 0.5 / 0.5 = 1.0
    # theta_1 = 2.0 - 0.1 * (1.0 + 0.01 * 2.0) = 2.0 - 0.1 * 1.02 = 1.898
    assert pytest.approx(param[0], 1e-4) == 1.898

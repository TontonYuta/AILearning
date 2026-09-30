"""Unit test xác thực toàn bộ mã nguồn ví dụ trong Giai đoạn 2: Toán học & ML/DL Core."""

import pytest
import math
from typing import List

# 1. Test Cosine Similarity
def cosine_similarity(u: List[float], v: List[float]) -> float:
    dot = sum(a * b for a, b in zip(u, v))
    norm_u = math.sqrt(sum(a * a for a in u))
    norm_v = math.sqrt(sum(b * b for b in v))
    if norm_u == 0 or norm_v == 0:
        return 0.0
    return dot / (norm_u * norm_v)

def test_cosine_similarity():
    u = [1.0, 0.0, 0.0]
    v = [1.0, 0.0, 0.0]
    assert math.isclose(cosine_similarity(u, v), 1.0)
    
    w = [0.0, 1.0, 0.0]
    assert math.isclose(cosine_similarity(u, w), 0.0)

# 2. Test Stable Softmax
def stable_softmax(logits: List[float]) -> List[float]:
    max_val = max(logits)
    exp_vals = [math.exp(z - max_val) for z in logits]
    sum_exp = sum(exp_vals)
    return [val / sum_exp for val in exp_vals]

def test_stable_softmax():
    # Test voi gia tri rat lon tranh Numerical Overflow
    large_logits = [1000.0, 1001.0, 1002.0]
    probs = stable_softmax(large_logits)
    assert len(probs) == 3
    assert math.isclose(sum(probs), 1.0)
    assert probs[2] > probs[1] > probs[0]

# 3. Test Simple Linear Regression
class SimpleLinearRegression:
    def __init__(self, lr: float = 0.05):
        self.w = 0.0
        self.b = 0.0
        self.lr = lr

    def forward(self, x: float) -> float:
        return self.w * x + self.b

    def train_step(self, X: List[float], Y: List[float]):
        n = len(X)
        dw = (2.0 / n) * sum(x * (self.forward(x) - y) for x, y in zip(X, Y))
        db = (2.0 / n) * sum((self.forward(x) - y) for x, y in zip(X, Y))
        self.w -= self.lr * dw
        self.b -= self.lr * db

    def fit(self, X: List[float], Y: List[float], epochs: int = 300):
        for _ in range(epochs):
            self.train_step(X, Y)

def test_linear_regression():
    # y = 2x + 1
    X = [1.0, 2.0, 3.0, 4.0]
    Y = [3.0, 5.0, 7.0, 9.0]
    model = SimpleLinearRegression(lr=0.05)
    model.fit(X, Y, epochs=400)
    
    assert math.isclose(model.w, 2.0, rel_tol=0.05)
    assert math.isclose(model.b, 1.0, rel_tol=0.1)
    # Du doan x = 5 -> y gan 11
    assert math.isclose(model.forward(5.0), 11.0, rel_tol=0.05)

# 4. Test Precision / Recall / F1
def compute_f1(tp: int, fp: int, fn: int) -> float:
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    if precision + recall == 0:
        return 0.0
    return 2 * (precision * recall) / (precision + recall)

def test_metrics():
    f1 = compute_f1(tp=80, fp=20, fn=10)
    assert f1 > 0.8

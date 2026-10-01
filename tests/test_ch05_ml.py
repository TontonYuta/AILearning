"""
Test suite for Chapter 5: Classical Machine Learning, Deep Learning Foundations & Metrics
Covers:
- Analytical Linear Regression (Normal Equation & Ridge Regularization)
- Confusion Matrix Metrics (Accuracy, Precision, Recall, F1-Score)
- Focal Loss computation with modulating factor
"""

from typing import Any, Dict
import numpy as np
import pytest


class AnalyticalLinearRegression:
    def __init__(self, l2_lambda: float = 0.0):
        self.l2_lambda = l2_lambda
        self.weights: np.ndarray = np.array([])

    def fit(self, X: np.ndarray, y: np.ndarray) -> np.ndarray:
        N = X.shape[0]
        X_b = np.hstack([np.ones((N, 1)), X])
        D_plus_1 = X_b.shape[1]

        XT_X = np.dot(X_b.T, X_b)
        XT_y = np.dot(X_b.T, y)

        if self.l2_lambda > 0.0:
            reg_matrix = self.l2_lambda * np.eye(D_plus_1)
            reg_matrix[0, 0] = 0.0  # Do not regularize bias
            self.weights = np.linalg.solve(XT_X + reg_matrix, XT_y)
        else:
            self.weights = np.linalg.solve(XT_X, XT_y)

        return self.weights

    def predict(self, X: np.ndarray) -> np.ndarray:
        N = X.shape[0]
        X_b = np.hstack([np.ones((N, 1)), X])
        return np.dot(X_b, self.weights)


class BinaryClassificationMetrics:
    @staticmethod
    def calculate_metrics(y_true: np.ndarray, y_pred_binary: np.ndarray) -> Dict[str, Any]:
        TP = int(np.sum((y_true == 1) & (y_pred_binary == 1)))
        TN = int(np.sum((y_true == 0) & (y_pred_binary == 0)))
        FP = int(np.sum((y_true == 0) & (y_pred_binary == 1)))
        FN = int(np.sum((y_true == 1) & (y_pred_binary == 0)))

        total = TP + TN + FP + FN
        accuracy = (TP + TN) / total if total > 0 else 0.0
        precision = TP / (TP + FP) if (TP + FP) > 0 else 0.0
        recall = TP / (TP + FN) if (TP + FN) > 0 else 0.0
        f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

        return {
            "TP": TP, "TN": TN, "FP": FP, "FN": FN,
            "accuracy": round(float(accuracy), 4),
            "precision": round(float(precision), 4),
            "recall": round(float(recall), 4),
            "f1_score": round(float(f1), 4)
        }


class FocalLossCalculator:
    @staticmethod
    def compute(y_true: np.ndarray, y_probs: np.ndarray, gamma: float = 2.0, alpha: float = 0.25) -> float:
        eps = 1e-15
        p = np.clip(y_probs, eps, 1.0 - eps)

        p_t = np.where(y_true == 1, p, 1.0 - p)
        alpha_t = np.where(y_true == 1, alpha, 1.0 - alpha)

        modulating_factor = (1.0 - p_t) ** gamma
        focal_losses = -alpha_t * modulating_factor * np.log(p_t)
        return float(np.mean(focal_losses))


# ==============================================================================
# TESTS
# ==============================================================================

def test_normal_equation_linear_regression():
    # 3 points: (1, 2), (2, 3), (3, 5) -> Exact solution w = [0.3333, 1.5]
    X = np.array([[1.0], [2.0], [3.0]])
    y = np.array([2.0, 3.0, 5.0])

    model = AnalyticalLinearRegression(l2_lambda=0.0)
    weights = model.fit(X, y)

    assert pytest.approx(weights[0], 1e-4) == 0.3333  # bias
    assert pytest.approx(weights[1], 1e-4) == 1.5000  # slope

    # Predict for x = 4 -> y_hat = 0.3333 + 1.5*4 = 6.3333
    preds = model.predict(np.array([[4.0]]))
    assert pytest.approx(preds[0], 1e-4) == 6.3333


def test_ridge_regression_shrinkage():
    X = np.array([[1.0], [2.0], [3.0]])
    y = np.array([2.0, 3.0, 5.0])

    ols_model = AnalyticalLinearRegression(l2_lambda=0.0)
    w_ols = ols_model.fit(X, y)

    ridge_model = AnalyticalLinearRegression(l2_lambda=5.0)
    w_ridge = ridge_model.fit(X, y)

    # Ridge regularization must shrink the slope parameter
    assert abs(w_ridge[1]) < abs(w_ols[1])


def test_confusion_matrix_metrics():
    # Numerical example from textbook: 90 TP, 10 FN, 180 FP, 9720 TN
    y_true = np.array([1]*100 + [0]*9900)
    y_pred = np.array([1]*90 + [0]*10 + [1]*180 + [0]*9720)

    metrics = BinaryClassificationMetrics.calculate_metrics(y_true, y_pred)
    assert metrics["TP"] == 90
    assert metrics["FN"] == 10
    assert metrics["FP"] == 180
    assert metrics["TN"] == 9720
    assert metrics["accuracy"] == 0.9810
    assert metrics["precision"] == 0.3333
    assert metrics["recall"] == 0.9000
    assert metrics["f1_score"] == 0.4865


def test_focal_loss_calculator():
    # True positives: y=1, prob=0.99 (well classified)
    y_easy = np.array([1.0])
    p_easy = np.array([0.99])

    # Hard positives: y=1, prob=0.20 (hard example)
    y_hard = np.array([1.0])
    p_hard = np.array([0.20])

    loss_easy = FocalLossCalculator.compute(y_easy, p_easy, gamma=2.0, alpha=0.5)
    loss_hard = FocalLossCalculator.compute(y_hard, p_hard, gamma=2.0, alpha=0.5)

    # Modulating factor (1 - p_t)^2 suppresses easy loss dramatically:
    # easy factor = (1 - 0.99)^2 = 1e-4
    # hard factor = (1 - 0.20)^2 = 0.64
    assert loss_hard > 100 * loss_easy

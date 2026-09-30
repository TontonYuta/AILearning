"""Test suite for Chapter 5 Machine Learning and Classification Metrics."""
import pytest
import numpy as np
from typing import Dict, Any

class AnalyticalLinearRegression:
    def __init__(self):
        self.weights: np.ndarray = np.array([])

    def fit(self, X: np.ndarray, y: np.ndarray) -> np.ndarray:
        N = X.shape[0]
        X_b = np.hstack([np.ones((N, 1)), X])
        XT_X = np.dot(X_b.T, X_b)
        XT_y = np.dot(X_b.T, y)
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

def test_normal_equation_linear_regression():
    # 3 points: (1, 2), (2, 3), (3, 5) -> Exact solution w = [0.3333, 1.5]
    X = np.array([[1.0], [2.0], [3.0]])
    y = np.array([2.0, 3.0, 5.0])
    
    model = AnalyticalLinearRegression()
    weights = model.fit(X, y)
    
    assert pytest.approx(weights[0], 1e-4) == 0.3333 # bias
    assert pytest.approx(weights[1], 1e-4) == 1.5000 # slope
    
    # Predict for x = 4 -> y_hat = 0.3333 + 1.5*4 = 6.3333
    preds = model.predict(np.array([[4.0]]))
    assert pytest.approx(preds[0], 1e-4) == 6.3333

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

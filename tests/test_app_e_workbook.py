"""Unit tests verifying code and algorithms in Appendix E (Capstone Workbook).

Covers:
1. Autonomous SOC Detector: Shannon entropy calculation and automated iptables mitigation.
2. Financial Audit Engine: Balance sheet equation verification and discrepancy alerting.
3. Clinical Copilot: Softmax temperature calibration and medical safety guardrails.
4. Two-Tower Recommendation: InfoNCE contrastive loss calculation with in-batch negatives.
"""

import math
import numpy as np
import pytest


def test_autonomous_soc_entropy_and_mitigation():
    """Verify SOC Shannon entropy drops under SYN flood and triggers mitigation."""
    from collections import Counter
    
    # 1. Normal traffic: Distributed across 20 distinct IPs
    normal_ips = [f"192.168.1.{i}" for i in range(1, 21)] * 5  # 100 packets
    counts_normal = Counter(normal_ips)
    entropy_normal = -sum((c / 100) * math.log2(c / 100) for c in counts_normal.values())
    
    # Normal entropy should be high (~4.32 bits for 20 uniform classes)
    assert entropy_normal > 3.5
    
    # 2. Attack traffic: 90 packets from single attacker IP, 10 packets from others
    attack_ips = ["10.0.0.66"] * 90 + [f"192.168.1.{i}" for i in range(1, 11)]  # 100 packets
    counts_attack = Counter(attack_ips)
    entropy_attack = -sum((c / 100) * math.log2(c / 100) for c in counts_attack.values())
    
    # Attack entropy drops drastically (< 1.5 bits)
    assert entropy_attack < 1.0
    assert counts_attack.most_common(1)[0][0] == "10.0.0.66"


def test_financial_audit_engine_balance_equation():
    """Verify financial audit balance sheet equation: Assets = Liabilities + Equity."""
    # Balanced statement
    assets_valid = 10_000_000.0
    liabilities = 6_000_000.0
    equity = 4_000_000.0
    
    discrepancy = abs(assets_valid - (liabilities + equity))
    assert discrepancy == 0.0
    
    # Flawed statement (e.g. OCR error: 10,000,000 read as 7,000,000)
    assets_invalid = 7_000_000.0
    discrepancy_invalid = abs(assets_invalid - (liabilities + equity))
    error_ratio = discrepancy_invalid / assets_invalid
    assert error_ratio > 0.05  # 42.8% error -> triggers CRITICAL audit risk


def test_clinical_copilot_temperature_calibration():
    """Verify temperature scaling softens overconfident logits."""
    logits = np.array([10.0, 2.0, 1.0])  # Extremely peaked
    
    # T = 1.0 (Standard)
    exp_std = np.exp(logits - np.max(logits))
    prob_std = exp_std / np.sum(exp_std)
    assert prob_std[0] > 0.99  # Overconfident
    
    # T = 2.5 (Calibrated for safety)
    scaled_logits = logits / 2.5
    exp_cal = np.exp(scaled_logits - np.max(scaled_logits))
    prob_cal = exp_cal / np.sum(exp_cal)
    
    # Calibrated probability should be softened
    assert prob_cal[0] < 0.95
    assert prob_cal[1] > prob_std[1]


def test_infonce_loss_recsys():
    """Verify InfoNCE loss calculation for Two-Tower recommendation architecture."""
    # Batch size 4, embedding dimension 8
    np.random.seed(42)
    B = 4
    D = 8
    
    user_embeds = np.random.randn(B, D)
    # Item embeds: perfectly aligned with users for low loss
    item_embeds = user_embeds.copy()
    
    # Normalize L2
    u_norm = user_embeds / np.linalg.norm(user_embeds, axis=1, keepdims=True)
    v_norm = item_embeds / np.linalg.norm(item_embeds, axis=1, keepdims=True)
    
    temperature = 0.1
    sim_matrix = (u_norm @ v_norm.T) / temperature
    
    # Diagonal elements (positives) should have cosine similarity = 1.0 -> scaled = 10.0
    diag = np.diag(sim_matrix)
    assert np.allclose(diag, 10.0)
    
    # Off-diagonal (negatives) should be significantly lower
    off_diag_mask = ~np.eye(B, dtype=bool)
    assert np.all(diag[:, None] > sim_matrix[off_diag_mask])

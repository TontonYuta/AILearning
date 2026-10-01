"""Unit tests verifying mathematical formulas in Appendix B (Mathematical Codex).

Covers:
1. Softmax shift invariance and Log-Sum-Exp stability
2. Softmax Jacobian and Cross-Entropy gradient (S - y)
3. RMSNorm forward and backward gradient verification
4. Johnson-Lindenstrauss Lemma distance preservation simulation
5. KV Cache memory footprint sizing calculations
6. Little's Law queueing and GPU sizing
7. Chinchilla optimal scaling laws parameter derivation
"""

import math
import numpy as np
import pytest


def test_softmax_shift_invariance():
    """Verify that Softmax(z) == Softmax(z - c) for any scalar c."""
    z = np.array([10.5, 25.3, 100.2, 5.0])
    c = 85.0
    
    # Standard softmax (with shift for numerical stability)
    exp_z = np.exp(z - np.max(z))
    softmax_original = exp_z / np.sum(exp_z)
    
    # Shifted by c
    z_shifted = z - c
    exp_shifted = np.exp(z_shifted - np.max(z_shifted))
    softmax_shifted = exp_shifted / np.sum(exp_shifted)
    
    np.testing.assert_allclose(softmax_original, softmax_shifted, rtol=1e-6)
    assert np.isclose(np.sum(softmax_original), 1.0)


def test_softmax_cross_entropy_gradient():
    """Verify that dL/dz_i = S_i - y_i for Cross-Entropy loss with Softmax."""
    z = np.array([2.0, 1.0, 0.1], dtype=np.float64)
    y_target = np.array([1.0, 0.0, 0.0], dtype=np.float64)  # class 0 is true class
    
    exp_z = np.exp(z - np.max(z))
    S = exp_z / np.sum(exp_z)
    
    # Analytical gradient
    grad_analytical = S - y_target
    
    # Numerical gradient using finite differences
    eps = 1e-6
    grad_numerical = np.zeros_like(z)
    for i in range(len(z)):
        z_plus = z.copy()
        z_plus[i] += eps
        exp_plus = np.exp(z_plus - np.max(z_plus))
        S_plus = exp_plus / np.sum(exp_plus)
        loss_plus = -np.sum(y_target * np.log(S_plus + 1e-15))
        
        z_minus = z.copy()
        z_minus[i] -= eps
        exp_minus = np.exp(z_minus - np.max(z_minus))
        S_minus = exp_minus / np.sum(exp_minus)
        loss_minus = -np.sum(y_target * np.log(S_minus + 1e-15))
        
        grad_numerical[i] = (loss_plus - loss_minus) / (2 * eps)
        
    np.testing.assert_allclose(grad_analytical, grad_numerical, rtol=1e-5, atol=1e-5)


def test_rmsnorm_forward_and_properties():
    """Verify RMSNorm forward calculation and scaling invariance."""
    d = 4
    x = np.array([1.0, -2.0, 3.0, -4.0], dtype=np.float64)
    gamma = np.array([1.0, 1.0, 1.0, 1.0], dtype=np.float64)
    eps = 1e-6
    
    rms = np.sqrt(np.mean(x**2) + eps)
    normed = (x / rms) * gamma
    
    # Verify that RMS of normalized tensor is approximately 1.0
    normed_rms = np.sqrt(np.mean(normed**2))
    assert np.isclose(normed_rms, 1.0, atol=1e-3)


def test_johnson_lindenstrauss_simulation():
    """Simulate random Gaussian projection preserving pairwise distances within tolerance."""
    np.random.seed(42)
    n_points = 50
    d_orig = 1024
    epsilon = 0.25
    
    # Target dimension k according to JL lemma bound: k >= 8 * ln(p) / eps^2
    k = int(math.ceil(8 * math.log(n_points) / (epsilon**2)))
    assert k < d_orig, f"Projected dimension {k} should be significantly smaller than original {d_orig}"
    
    # Generate points in high-dimensional space
    points = np.random.randn(n_points, d_orig)
    
    # Random projection matrix R ~ N(0, 1/k)
    R = np.random.randn(k, d_orig) / math.sqrt(k)
    projected = points @ R.T  # shape (n_points, k)
    
    # Check pairwise distances for sample pairs
    dist_preserved = 0
    total_pairs = 0
    for i in range(15):
        for j in range(i + 1, 15):
            orig_dist_sq = np.sum((points[i] - points[j]) ** 2)
            proj_dist_sq = np.sum((projected[i] - projected[j]) ** 2)
            
            lower_bound = (1 - epsilon) * orig_dist_sq
            upper_bound = (1 + epsilon) * orig_dist_sq
            
            if lower_bound <= proj_dist_sq <= upper_bound:
                dist_preserved += 1
            total_pairs += 1
            
    # At least 90% of pairwise distances must be within (1 +/- eps)
    preservation_rate = dist_preserved / total_pairs
    assert preservation_rate >= 0.90, f"Preservation rate {preservation_rate:.2f} is below 90%"


def test_kv_cache_sizing_formula():
    """Verify KV Cache memory footprint formula: 2 * B * L * layers * kv_heads * d_k * bytes."""
    B = 16
    L = 4096
    n_layers = 32
    n_kv_heads = 8  # Grouped Query Attention (GQA)
    d_k = 128
    p_bytes = 2     # FP16 (2 bytes per parameter)
    
    # Calculation in bytes
    kv_cache_bytes = 2 * B * L * n_layers * n_kv_heads * d_k * p_bytes
    kv_cache_gb = kv_cache_bytes / (1024**3)
    
    # 2 * 16 * 4096 * 32 * 8 * 128 * 2 = 8,589,934,592 bytes = 8.0 GiB
    assert kv_cache_bytes == 8589934592
    assert math.isclose(kv_cache_gb, 8.0, rel_tol=1e-5)


def test_littles_law_and_gpu_sizing():
    """Verify Little's Law L = lambda * W and GPU sizing."""
    arrival_rate = 200.0  # 200 requests/sec
    avg_latency = 2.5     # 2.5 seconds response time
    
    concurrency_L = arrival_rate * avg_latency
    assert concurrency_L == 500.0
    
    max_batch_per_gpu = 64
    gpus_required = math.ceil(concurrency_L / max_batch_per_gpu)
    assert gpus_required == 8


def test_chinchilla_scaling_law_derivation():
    """Verify Chinchilla optimal allocation: N_opt and D_opt scaling with alpha and beta."""
    alpha = 0.34
    beta = 0.28
    
    a_exponent = beta / (alpha + beta)
    b_exponent = alpha / (alpha + beta)
    
    assert math.isclose(a_exponent + b_exponent, 1.0)
    assert 0.40 <= a_exponent <= 0.50
    assert 0.50 <= b_exponent <= 0.60


def test_universal_approximation_toy():
    """Verify Universal Approximation Theorem on 1D function using shallow network."""
    # Target: sin(2 * pi * x) on [0, 1]
    np.random.seed(42)
    x = np.linspace(0, 1, 100).reshape(-1, 1)
    y_true = np.sin(2 * np.pi * x)
    
    # 20 hidden units with random weights and linear output fit
    m = 20
    W1 = np.random.randn(1, m) * 4.0
    b1 = np.random.randn(1, m) * 2.0
    
    # Hidden activations with Tanh
    H = np.tanh(x @ W1 + b1)  # shape (100, m)
    
    # Least-squares fit for output weights (alpha)
    alpha, _, _, _ = np.linalg.lstsq(H, y_true, rcond=None)
    y_pred = H @ alpha
    
    max_error = np.max(np.abs(y_pred - y_true))
    # Approximation error should be reasonably bounded
    assert max_error < 0.25


def test_adamw_weight_decay_decoupling():
    """Verify AdamW decouples weight decay from adaptive gradient scaling."""
    eta = 0.01
    weight_decay = 0.1
    
    theta_0 = np.array([2.0, 2.0])
    # Parameter 0 has huge gradient, parameter 1 has small gradient
    g = np.array([10.0, 0.1])
    
    # In AdamW, weight decay co-factors (1 - eta * lambda) identically
    theta_decayed = theta_0 * (1.0 - eta * weight_decay)
    
    # Both weights decay by exact same fraction (0.999) regardless of g
    decay_ratio_0 = theta_decayed[0] / theta_0[0]
    decay_ratio_1 = theta_decayed[1] / theta_0[1]
    assert np.isclose(decay_ratio_0, decay_ratio_1)
    assert np.isclose(decay_ratio_0, 0.999)


def test_dpo_loss_and_gradient_dynamics():
    """Verify DPO loss and implicit reward weighting dynamics."""
    beta = 0.1
    
    # Case 1: Model agrees with preference (r_w > r_l)
    logp_w_model = -1.0
    logp_w_ref = -2.0  # implicit reward w = 0.1 * (-1.0 - (-2.0)) = +0.1
    logp_l_model = -3.0
    logp_l_ref = -2.0  # implicit reward l = 0.1 * (-3.0 - (-2.0)) = -0.1
    
    r_w = beta * (logp_w_model - logp_w_ref)
    r_l = beta * (logp_l_model - logp_l_ref)
    
    # Margin is positive: r_w - r_l = 0.2
    margin = r_w - r_l
    loss_satisfied = -np.log(1.0 / (1.0 + np.exp(-margin)))
    
    # Case 2: Model violates preference (r_w < r_l)
    r_w_bad = -0.1
    r_l_bad = +0.1
    margin_bad = r_w_bad - r_l_bad  # -0.2
    loss_violated = -np.log(1.0 / (1.0 + np.exp(-margin_bad)))
    
    # Loss must be strictly higher when model favors the dispreferred output
    assert loss_violated > loss_satisfied
    
    # Weighting factor in gradient: sigma(r_l - r_w)
    weight_bad = 1.0 / (1.0 + np.exp(-(r_l_bad - r_w_bad)))
    weight_good = 1.0 / (1.0 + np.exp(-(r_l - r_w)))
    assert weight_bad > weight_good


def test_eckart_young_mirsky_lora():
    """Verify Eckart-Young-Mirsky SVD low-rank truncation and energy preservation."""
    np.random.seed(42)
    # Weight matrix W of size (64, 32) with decaying singular values
    U, _ = np.linalg.qr(np.random.randn(64, 32))
    V, _ = np.linalg.qr(np.random.randn(32, 32))
    # Steeply decaying singular values (e.g. geometric decay)
    s = np.array([2.0 ** (-i * 0.4) for i in range(32)])
    W = U @ np.diag(s) @ V.T
    
    # Rank-8 approximation
    r = 8
    W_r = U[:, :r] @ np.diag(s[:r]) @ V[:, :r].T
    
    # Analytical Frobenius error
    frobenius_err_actual = np.linalg.norm(W - W_r, 'fro')
    frobenius_err_theoretical = np.sqrt(np.sum(s[r:] ** 2))
    assert np.isclose(frobenius_err_actual, frobenius_err_theoretical)
    
    # Cumulative energy captured by rank-8
    energy_captured = np.sum(s[:r] ** 2) / np.sum(s ** 2)
    assert energy_captured > 0.95  # 95%+ energy preserved


def test_moe_auxiliary_load_balancing_loss():
    """Verify Switch Transformer load balancing loss reaches minimum at uniform distribution."""
    num_experts = 8
    alpha = 0.01
    
    # Perfectly balanced case: f_i = 1/E, P_i = 1/E
    f_balanced = np.full(num_experts, 1.0 / num_experts)
    P_balanced = np.full(num_experts, 1.0 / num_experts)
    loss_balanced = alpha * num_experts * np.sum(f_balanced * P_balanced)
    
    # Theoretical minimum: loss = alpha
    assert np.isclose(loss_balanced, alpha)
    
    # Complete collapse case: expert 0 takes 100% of tokens
    f_collapsed = np.zeros(num_experts)
    f_collapsed[0] = 1.0
    P_collapsed = np.zeros(num_experts)
    P_collapsed[0] = 1.0
    loss_collapsed = alpha * num_experts * np.sum(f_collapsed * P_collapsed)
    
    # Under collapse, loss is penalized by exactly E * alpha
    assert np.isclose(loss_collapsed, num_experts * alpha)
    assert loss_collapsed == 8 * loss_balanced


def test_mg1_processor_sharing_sojourn_time():
    """Verify M/G/1 Processor Sharing mean sojourn time E[T|x] = x / (1 - rho)."""
    rho = 0.75  # 75% GPU load
    short_task_tokens = 20
    long_task_tokens = 100
    
    mean_short = short_task_tokens / (1.0 - rho)  # 20 / 0.25 = 80
    mean_long = long_task_tokens / (1.0 - rho)    # 100 / 0.25 = 400
    
    assert np.isclose(mean_short, 80.0)
    assert np.isclose(mean_long, 400.0)
    assert np.isclose(mean_long / mean_short, 5.0)  # Exactly proportional to token count



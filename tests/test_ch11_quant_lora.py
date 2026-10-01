"""
Tests for Chapter 11: Quantization, LoRA & Human Preference Alignment
Covers:
- Symmetric INT8 Quantization and Dequantization numerical accuracy
- LoRA parameter count calculation, zero-initialization, forward pass, and weight merging
- MultiLoRAManager multi-tenant adapter routing
- SmoothQuant mathematical equivalence (X @ W == X_hat @ W_hat)
- DPOLossEngine loss calculation, implicit rewards, and preference accuracy
"""

from typing import Dict, Optional, Tuple, List, Any
import math
import re
import numpy as np
import pytest


def symmetric_quantize_int8(x: np.ndarray) -> Tuple[np.ndarray, float]:
    """
    Symmetric INT8 quantization:
    Scale = max(|x|) / 127
    q = clip(round(x / Scale), -127, 127)
    """
    max_val = float(np.max(np.abs(x)))
    if max_val == 0.0:
        return np.zeros_like(x, dtype=np.int8), 1.0

    scale = max_val / 127.0
    q = np.clip(np.round(x / scale), -127, 127).astype(np.int8)
    return q, scale


def dequantize_int8(q: np.ndarray, scale: float) -> np.ndarray:
    """Dequantizes INT8 back to float: x_hat = q * scale."""
    return q.astype(np.float32) * scale


class SimpleLoRALayer:
    """
    Simulates a LoRA adapted linear layer:
    y = x @ W0 + (alpha / r) * (x @ A @ B)
    where W0 is frozen base weight (d_in, d_out)
    A is (d_in, r) initialized with Gaussian
    B is (r, d_out) initialized with Zeros
    """
    def __init__(self, d_in: int, d_out: int, r: int = 8, alpha: float = 16.0):
        self.d_in = d_in
        self.d_out = d_out
        self.r = r
        self.alpha = alpha
        self.scaling = alpha / r

        # Frozen base weight
        self.w0 = np.random.standard_normal((d_in, d_out)).astype(np.float32)

        # LoRA trainable low-rank adapters
        self.a = np.random.standard_normal((d_in, r)).astype(np.float32) * 0.01
        self.b = np.zeros((r, d_out), dtype=np.float32)

    def forward(self, x: np.ndarray) -> np.ndarray:
        base_out = np.matmul(x, self.w0)
        lora_out = self.scaling * np.matmul(np.matmul(x, self.a), self.b)
        return base_out + lora_out

    def merge_weights(self) -> np.ndarray:
        """Merges LoRA weights permanently into base weights for zero inference overhead."""
        delta_w = self.scaling * np.matmul(self.a, self.b)
        return self.w0 + delta_w


class MultiLoRAManager:
    def __init__(self, d_in: int, d_out: int, r: int = 8, alpha: float = 16.0):
        self.d_in = d_in
        self.d_out = d_out
        self.r = r
        self.scaling = alpha / r
        self.w0 = np.random.standard_normal((d_in, d_out)).astype(np.float32)
        self.adapters: Dict[str, Tuple[np.ndarray, np.ndarray]] = {}

    def register_adapter(self, tenant_id: str, a_matrix: np.ndarray, b_matrix: np.ndarray):
        assert a_matrix.shape == (self.d_in, self.r), "Kich thuoc A khong hop le!"
        assert b_matrix.shape == (self.r, self.d_out), "Kich thuoc B khong hop le!"
        self.adapters[tenant_id] = (a_matrix, b_matrix)

    def forward(self, x: np.ndarray, tenant_id: Optional[str] = None) -> np.ndarray:
        base_out = np.matmul(x, self.w0)
        if tenant_id is None or tenant_id not in self.adapters:
            return base_out

        a, b = self.adapters[tenant_id]
        lora_out = self.scaling * np.matmul(np.matmul(x, a), b)
        return base_out + lora_out


class SmoothQuantSimulator:
    @staticmethod
    def calculate_scale_vector(x: np.ndarray, w: np.ndarray, alpha: float = 0.5) -> np.ndarray:
        act_max = np.max(np.abs(x), axis=0)
        weight_max = np.max(np.abs(w), axis=1)

        act_max = np.maximum(act_max, 1e-5)
        weight_max = np.maximum(weight_max, 1e-5)

        scale_vector = (act_max ** alpha) / (weight_max ** (1.0 - alpha))
        return scale_vector

    @staticmethod
    def transform(x: np.ndarray, w: np.ndarray, s: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        x_hat = x / s
        w_hat = w * s[:, np.newaxis]
        return x_hat, w_hat


class DPOLossEngine:
    def __init__(self, beta: float = 0.1):
        self.beta = beta

    def compute_loss(
        self,
        policy_chosen_logps: np.ndarray,
        policy_rejected_logps: np.ndarray,
        reference_chosen_logps: np.ndarray,
        reference_rejected_logps: np.ndarray
    ) -> Tuple[float, float, float, float]:
        pi_logratios = policy_chosen_logps - policy_rejected_logps
        ref_logratios = reference_chosen_logps - reference_rejected_logps

        logits = pi_logratios - ref_logratios
        scaled_logits = self.beta * logits

        losses = -self._log_sigmoid(scaled_logits)
        mean_loss = float(np.mean(losses))

        chosen_rewards = self.beta * (policy_chosen_logps - reference_chosen_logps)
        rejected_rewards = self.beta * (policy_rejected_logps - reference_rejected_logps)

        reward_accuracy = float(np.mean(chosen_rewards > rejected_rewards))

        return (
            mean_loss,
            float(np.mean(chosen_rewards)),
            float(np.mean(rejected_rewards)),
            reward_accuracy
        )

    @staticmethod
    def _log_sigmoid(x: np.ndarray) -> np.ndarray:
        return -np.logaddexp(0.0, -x)


# ==============================================================================
# TESTS
# ==============================================================================

def test_symmetric_quantization():
    x = np.array([-10.0, -5.0, 0.0, 2.5, 7.5, 10.0], dtype=np.float32)
    q, scale = symmetric_quantize_int8(x)

    assert pytest.approx(scale, 1e-4) == 10.0 / 127.0
    assert q[0] == -127
    assert q[-1] == 127

    x_hat = dequantize_int8(q, scale)
    mse = np.mean((x - x_hat) ** 2)
    assert mse < 0.01


def test_lora_initialization_and_forward():
    d_in = 32
    d_out = 64
    r = 4
    alpha = 8.0
    batch_size = 2

    layer = SimpleLoRALayer(d_in, d_out, r=r, alpha=alpha)
    x = np.random.standard_normal((batch_size, d_in)).astype(np.float32)

    # At initialization, B is all zeros, so LoRA output must be EXACTLY identical to base output!
    y_init = layer.forward(x)
    y_base = np.matmul(x, layer.w0)
    np.testing.assert_allclose(y_init, y_base, atol=1e-6)

    # Now simulate some training by updating B
    layer.b += np.random.standard_normal(layer.b.shape) * 0.1
    y_adapted = layer.forward(x)

    # Test weight merging: merged model forward must be identical to unmerged layer forward
    w_merged = layer.merge_weights()
    y_merged = np.matmul(x, w_merged)
    np.testing.assert_allclose(y_adapted, y_merged, atol=1e-5)


def test_multi_lora_manager():
    d_in = 16
    d_out = 32
    r = 4
    manager = MultiLoRAManager(d_in, d_out, r=r, alpha=8.0)
    x = np.random.standard_normal((1, d_in)).astype(np.float32)

    # Tenant without adapter falls back to base model
    y_base = manager.forward(x, tenant_id="unknown_tenant")
    np.testing.assert_allclose(y_base, np.matmul(x, manager.w0), atol=1e-6)

    # Register tenant adapters
    a_tenant1 = np.ones((d_in, r), dtype=np.float32) * 0.1
    b_tenant1 = np.ones((r, d_out), dtype=np.float32) * 0.2
    manager.register_adapter("finance_tenant", a_tenant1, b_tenant1)

    y_finance = manager.forward(x, tenant_id="finance_tenant")
    assert not np.allclose(y_finance, y_base)

    # Base output should remain unaffected
    y_base2 = manager.forward(x, tenant_id=None)
    np.testing.assert_allclose(y_base, y_base2, atol=1e-6)


def test_smoothquant_mathematical_equivalence():
    # Worked example matrices
    x = np.array([[2.0, 80.0], [1.0, 40.0]], dtype=np.float32)
    w = np.array([[4.0, 2.0], [0.5, 0.2]], dtype=np.float32)

    y_orig = np.matmul(x, w)

    s = SmoothQuantSimulator.calculate_scale_vector(x, w, alpha=0.5)
    # Check scale vector matches hand calculation: s1 = sqrt(0.5) ~= 0.7071, s2 = sqrt(160) ~= 12.649
    assert pytest.approx(s[0], 1e-3) == np.sqrt(0.5)
    assert pytest.approx(s[1], 1e-3) == np.sqrt(160.0)

    x_hat, w_hat = SmoothQuantSimulator.transform(x, w, s)
    y_hat = np.matmul(x_hat, w_hat)

    # Mathematical equivalence must hold strictly
    np.testing.assert_allclose(y_orig, y_hat, atol=1e-5)


def test_dpo_loss_engine():
    engine = DPOLossEngine(beta=0.1)

    # Worked example values:
    # pi(yw)=0.4, pi_ref(yw)=0.2 -> log_pi(yw) = ln(0.4), log_ref(yw) = ln(0.2)
    # pi(yl)=0.1, pi_ref(yl)=0.2 -> log_pi(yl) = ln(0.1), log_ref(yl) = ln(0.2)
    policy_chosen = np.array([np.log(0.40)], dtype=np.float32)
    policy_rejected = np.array([np.log(0.10)], dtype=np.float32)
    ref_chosen = np.array([np.log(0.20)], dtype=np.float32)
    ref_rejected = np.array([np.log(0.20)], dtype=np.float32)

    loss, chosen_r, rejected_r, acc = engine.compute_loss(
        policy_chosen, policy_rejected, ref_chosen, ref_rejected
    )

    # Hand calculation check:
    # scaled_logits = 0.1 * (ln(2) - ln(0.5)) = 0.1 * ln(4) ~= 0.138629
    # sigmoid(0.138629) ~= 0.534596
    # loss = -ln(0.534596) ~= 0.62623
    expected_loss = -np.log(1.0 / (1.0 + np.exp(-0.1386294)))
    assert pytest.approx(loss, 1e-4) == expected_loss
    assert pytest.approx(chosen_r, 1e-4) == 0.1 * np.log(2.0)
    assert pytest.approx(rejected_r, 1e-4) == 0.1 * np.log(0.5)
    assert acc == 1.0

    # Also test beta=1.0 case
    engine_beta1 = DPOLossEngine(beta=1.0)
    loss_b1, _, _, _ = engine_beta1.compute_loss(
        policy_chosen, policy_rejected, ref_chosen, ref_rejected
    )
    assert pytest.approx(loss_b1, 1e-4) == -np.log(0.8)


class OBSQuantizerEngine:
    """Bo luong tu hoa Optimal Brain Surgeon 1 tang voi bu sai so bac hai."""
    def __init__(self, damping: float = 0.01):
        self.damping = damping

    def quantize_layer(
        self,
        w: np.ndarray,
        x: np.ndarray,
        bits: int = 4
    ) -> Tuple[np.ndarray, float, float]:
        d_out, d_in = w.shape
        w_obs = w.copy().astype(np.float64)
        w_rtn = w.copy().astype(np.float64)

        # 1. Tinh ma tran Hessian H = 2 * X @ X.T
        h = 2.0 * np.matmul(x, x.T)
        diag_mean = float(np.mean(np.diag(h)))
        if diag_mean == 0.0:
            diag_mean = 1.0

        # Dieu hoa Damping factor chong suy bien
        h += self.damping * diag_mean * np.eye(d_in)

        # 2. Tinh nghich dao Hessian H^-1
        h_inv = np.linalg.inv(h)

        # 3. Tinh Scale luong tu hoa INT cho tung hang
        q_max = (2 ** (bits - 1)) - 1
        scales = np.max(np.abs(w), axis=1) / q_max
        scales = np.maximum(scales, 1e-8)

        # 4. Luong tu hoa doc lap RTN de so sanh
        for r in range(d_out):
            s = scales[r]
            q_rtn = np.clip(np.round(w_rtn[r, :] / s), -q_max, q_max)
            w_rtn[r, :] = q_rtn * s

        # 5. Luong tu hoa OBS voi bu sai so lien tuc tren tung cot
        for col in range(d_in):
            h_inv_qq = h_inv[col, col]
            h_inv_col = h_inv[:, col]

            for r in range(d_out):
                w_orig = w_obs[r, col]
                s = scales[r]
                q_val = np.clip(np.round(w_orig / s), -q_max, q_max)
                w_hat = q_val * s
                err = w_orig - w_hat

                # Cap nhat bu sai so cho cac cot con lai
                delta_w = - (err / h_inv_qq) * h_inv_col
                w_obs[r, :] += delta_w
                w_obs[r, col] = w_hat

        # 6. Danh gia sai so tai tao kich hoa Y = W @ X
        y_true = np.matmul(w, x)
        y_obs = np.matmul(w_obs, x)
        y_rtn = np.matmul(w_rtn, x)

        mse_obs = float(np.mean((y_true - y_obs) ** 2))
        mse_rtn = float(np.mean((y_true - y_rtn) ** 2))

        return w_obs.astype(np.float32), mse_obs, mse_rtn


def test_obs_hand_calculation_worked_example():
    # Worked example in text:
    # X = [[1, 2, 1], [0, 1, 2]]
    # w = [1.5, -2.0]
    x = np.array([[1.0, 2.0, 1.0], [0.0, 1.0, 2.0]], dtype=np.float64)
    w = np.array([[1.5, -2.0]], dtype=np.float64)

    # 1. Hessian H = 2 * X @ X.T
    h = 2.0 * np.matmul(x, x.T)
    np.testing.assert_allclose(h, [[12.0, 8.0], [8.0, 10.0]])

    # 2. H_inv
    h_inv = np.linalg.inv(h)
    assert pytest.approx(h_inv[0, 0], 1e-4) == 5.0 / 28.0
    assert pytest.approx(h_inv[0, 1], 1e-4) == -1.0 / 7.0
    assert pytest.approx(h_inv[1, 1], 1e-4) == 3.0 / 14.0

    # 3. Quantize w1 = 1.5 -> w_hat1 = 2.0
    err = 1.5 - 2.0  # -0.5
    delta_w = - (err / h_inv[0, 0]) * h_inv[:, 0]
    assert pytest.approx(delta_w[0], 1e-4) == 0.5
    assert pytest.approx(delta_w[1], 1e-4) == -0.4

    w_obs = np.array([[2.0, -2.4]], dtype=np.float64)
    w_rtn = np.array([[2.0, -2.0]], dtype=np.float64)

    y_true = np.matmul(w, x)
    y_obs = np.matmul(w_obs, x)
    y_rtn = np.matmul(w_rtn, x)

    mse_obs = np.sum((y_true - y_obs) ** 2)
    mse_rtn = np.sum((y_true - y_rtn) ** 2)

    assert pytest.approx(mse_obs, 1e-4) == 0.70
    assert pytest.approx(mse_rtn, 1e-4) == 1.50
    assert mse_obs < mse_rtn * 0.5


def test_obs_quantizer_engine():
    np.random.seed(42)
    d_out, d_in, n_samples = 4, 8, 50
    w = np.random.standard_normal((d_out, d_in)).astype(np.float64)
    x = np.random.standard_normal((d_in, n_samples)).astype(np.float64)

    engine = OBSQuantizerEngine(damping=0.01)
    w_q, mse_obs, mse_rtn = engine.quantize_layer(w, x, bits=4)

    assert w_q.shape == (d_out, d_in)
    # OBS must consistently achieve lower reconstruction MSE than RTN
    assert mse_obs < mse_rtn


# ==============================================================================
# GRPO & BITNET 1.58B SIMULATORS
# ==============================================================================

class GRPOAdvantageEstimator:
    """
    Simulates Group Relative Policy Optimization (GRPO) from DeepSeek-R1.
    Eliminates the separate Critic network by normalizing rewards across
    a group of G sampled rollouts for each prompt:
    A_i = (r_i - mean(R)) / (std(R) + eps)
    """

    @staticmethod
    def extract_boxed_answer(text: str) -> Optional[str]:
        """Extracts the final answer enclosed in \\boxed{...}."""
        pattern = r"\\boxed\{([^}]+)\}"
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()
        return None

    @classmethod
    def rule_based_verifier(
        cls, completion: str, ground_truth: str, format_weight: float = 0.5
    ) -> Dict[str, float]:
        """
        Rule-based reward verifier for reasoning models (DeepSeek-R1 style):
        - Format reward: enforces <think>...</think> and \\boxed{...}
        - Accuracy reward: checks if \\boxed{...} matches ground_truth exactly
        """
        has_think = bool(re.search(r"<think>.*?</think>", completion, re.DOTALL))
        extracted_answer = cls.extract_boxed_answer(completion)
        has_boxed = extracted_answer is not None

        format_reward = 0.0
        if has_think and has_boxed:
            format_reward = 1.0
        elif has_think or has_boxed:
            format_reward = 0.5

        acc_reward = 0.0
        if extracted_answer is not None and extracted_answer.lower() == ground_truth.strip().lower():
            acc_reward = 1.0

        total_reward = acc_reward + format_weight * format_reward
        return {
            "format_reward": format_reward,
            "accuracy_reward": acc_reward,
            "total_reward": total_reward,
        }

    @staticmethod
    def compute_group_advantages(rewards: List[float], eps: float = 1e-6) -> np.ndarray:
        """
        Normalizes rewards across a sampled group of G candidate answers:
        A_i = (r_i - mean(R)) / (std(R) + eps)
        If std(R) == 0 (all outputs receive identical reward), advantages are 0.
        """
        r = np.array(rewards, dtype=np.float64)
        mean_r = np.mean(r)
        std_r = np.std(r)
        if std_r < 1e-8:
            return np.zeros_like(r)
        return (r - mean_r) / (std_r + eps)

    @staticmethod
    def compute_clipped_surrogate_loss(
        pi_logps: np.ndarray,
        old_logps: np.ndarray,
        advantages: np.ndarray,
        clip_eps: float = 0.2
    ) -> Tuple[float, float]:
        """
        Computes the PPO clipped surrogate objective loss across tokens:
        ratio = exp(pi_logps - old_logps)
        loss = -min(ratio * A, clip(ratio, 1 - eps, 1 + eps) * A)
        Returns (mean_loss, clip_fraction).
        """
        ratios = np.exp(pi_logps - old_logps)
        surr1 = ratios * advantages
        clipped_ratios = np.clip(ratios, 1.0 - clip_eps, 1.0 + clip_eps)
        surr2 = clipped_ratios * advantages
        obj = np.minimum(surr1, surr2)
        loss = -float(np.mean(obj))
        clip_fraction = float(np.mean(ratios != clipped_ratios))
        return loss, clip_fraction

    @staticmethod
    def compute_kl_divergence_schulman(pi_logps: np.ndarray, ref_logps: np.ndarray) -> float:
        """
        Schulman unbiased KL estimator:
        KL = exp(ref - pi) - 1 - (ref - pi)
        """
        log_ratio = ref_logps - pi_logps
        kl = np.exp(log_ratio) - 1.0 - log_ratio
        return float(np.mean(kl))


class BitNetTernaryLinear:
    """
    Simulates BitNet b1.58 (1.58-bit Large Language Models).
    Weights are quantized to {-1, 0, +1} using absmean scaling:
    gamma = mean(|W|)
    W_ternary = clip(round(W / (gamma + eps)), -1, 1)
    Forward pass replaces FP16 multiply-adds with pure integer additions/subtractions.
    """

    def __init__(self, d_in: int, d_out: int):
        self.d_in = d_in
        self.d_out = d_out
        self.w = np.random.standard_normal((d_out, d_in)).astype(np.float32)

    @staticmethod
    def quantize_weights(w: np.ndarray, eps: float = 1e-6) -> Tuple[np.ndarray, float]:
        """
        Quantizes continuous weights into ternary values {-1, 0, +1}.
        Returns (W_ternary, gamma).
        """
        gamma = float(np.mean(np.abs(w)))
        scale = max(gamma, eps)
        w_scaled = w / scale
        w_ternary = np.clip(np.round(w_scaled), -1, 1).astype(np.int8)
        return w_ternary, scale

    @staticmethod
    def quantize_activations(x: np.ndarray, bits: int = 8) -> Tuple[np.ndarray, float]:
        """Quantizes activation tensor into INT8 symmetric range [-127, 127]."""
        q_max = (1 << (bits - 1)) - 1  # 127 for 8-bit
        max_abs = float(np.max(np.abs(x)))
        if max_abs < 1e-8:
            return np.zeros_like(x, dtype=np.int8), 1.0
        scale = max_abs / q_max
        x_q = np.clip(np.round(x / scale), -q_max, q_max).astype(np.int8)
        return x_q, scale

    @staticmethod
    def forward_pure_addition(x_q: np.ndarray, w_ternary: np.ndarray) -> np.ndarray:
        """
        Performs matrix multiplication y_q = x_q @ w_ternary.T WITHOUT multiplications.
        x_q: shape (batch_size, d_in) of INT8
        w_ternary: shape (d_out, d_in) of {-1, 0, +1}
        Uses only conditional additions and subtractions.
        """
        batch_size, d_in = x_q.shape
        d_out, w_din = w_ternary.shape
        assert d_in == w_din, "Dimension mismatch in BitNet forward pass"

        # Initialize output accumulator with INT32 to prevent overflow
        y_acc = np.zeros((batch_size, d_out), dtype=np.int32)

        # Pure addition/subtraction engine
        for b in range(batch_size):
            row_x = x_q[b].astype(np.int32)
            for j in range(d_out):
                row_w = w_ternary[j]
                # Elements with +1 are added, elements with -1 are subtracted, 0 is ignored
                plus_mask = (row_w == 1)
                minus_mask = (row_w == -1)
                accum = np.sum(row_x[plus_mask]) - np.sum(row_x[minus_mask])
                y_acc[b, j] = accum

        return y_acc


# ==============================================================================
# TESTS FOR GRPO & BITNET
# ==============================================================================

def test_grpo_rule_based_verifier():
    sample_correct = (
        "<think>Let x be the number of apples. 2x + 5 = 15 => 2x = 10 => x = 5.</think>\n"
        "The answer is \\boxed{5}."
    )
    res_correct = GRPOAdvantageEstimator.rule_based_verifier(sample_correct, "5")
    assert res_correct["format_reward"] == 1.0
    assert res_correct["accuracy_reward"] == 1.0
    assert pytest.approx(res_correct["total_reward"]) == 1.5

    sample_wrong_answer = (
        "<think>Calculating 2x + 5 = 15 => x = 7.</think>\n"
        "The answer is \\boxed{7}."
    )
    res_wrong = GRPOAdvantageEstimator.rule_based_verifier(sample_wrong_answer, "5")
    assert res_wrong["format_reward"] == 1.0
    assert res_wrong["accuracy_reward"] == 0.0
    assert pytest.approx(res_wrong["total_reward"]) == 0.5

    sample_no_format = "5"
    res_no_format = GRPOAdvantageEstimator.rule_based_verifier(sample_no_format, "5")
    assert res_no_format["format_reward"] == 0.0
    assert res_no_format["accuracy_reward"] == 0.0
    assert res_no_format["total_reward"] == 0.0


def test_grpo_group_advantages_zero_mean_unit_variance():
    rewards = [1.5, 0.5, 0.5, 1.5, 0.0, 1.5, 0.5, 1.0]
    advantages = GRPOAdvantageEstimator.compute_group_advantages(rewards)

    assert len(advantages) == len(rewards)
    # Mean of advantages across the group should be approximately 0.0
    assert pytest.approx(float(np.mean(advantages)), abs=1e-5) == 0.0
    # Standard deviation should be approximately 1.0
    assert pytest.approx(float(np.std(advantages)), abs=1e-4) == 1.0

    # If all rewards are identical (e.g. all 1.0), advantage should be 0 without NaN
    all_same = [1.0, 1.0, 1.0, 1.0]
    adv_same = GRPOAdvantageEstimator.compute_group_advantages(all_same)
    assert np.all(adv_same == 0.0)


def test_grpo_clipped_surrogate_loss():
    old_logps = np.array([-1.0, -2.0, -1.5, -0.5])
    # Policy improves on positive advantage tokens
    pi_logps = np.array([-0.8, -2.5, -1.0, -0.7])
    advantages = np.array([1.2, -0.8, 0.5, -0.9])

    loss, clip_frac = GRPOAdvantageEstimator.compute_clipped_surrogate_loss(
        pi_logps, old_logps, advantages, clip_eps=0.2
    )
    assert isinstance(loss, float)
    assert 0.0 <= clip_frac <= 1.0

    # Test Schulman KL
    ref_logps = np.array([-1.0, -2.0, -1.5, -0.5])
    kl = GRPOAdvantageEstimator.compute_kl_divergence_schulman(pi_logps, ref_logps)
    assert kl >= 0.0


def test_bitnet_ternary_quantization_and_forward():
    d_in, d_out = 16, 8
    layer = BitNetTernaryLinear(d_in, d_out)

    # 1. Test ternary weight quantization
    w_ternary, gamma = layer.quantize_weights(layer.w)
    unique_vals = set(np.unique(w_ternary))
    assert unique_vals.issubset({-1, 0, 1})
    assert gamma > 0.0

    # 2. Test INT8 activation quantization
    x = np.random.standard_normal((4, d_in)).astype(np.float32)
    x_q, scale_x = layer.quantize_activations(x)
    assert x_q.dtype == np.int8
    assert np.all(x_q >= -127) and np.all(x_q <= 127)

    # 3. Test pure addition forward pass equivalence with standard matmul
    y_pure_add = layer.forward_pure_addition(x_q, w_ternary)
    y_matmul = np.matmul(x_q.astype(np.int32), w_ternary.T.astype(np.int32))

    np.testing.assert_array_equal(y_pure_add, y_matmul)

    # 4. End-to-end dequantized float output
    y_float_approx = y_pure_add.astype(np.float32) * (scale_x * gamma)
    assert y_float_approx.shape == (4, d_out)


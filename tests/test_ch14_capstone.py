"""
Unit tests for Chapter 14: Flagship Capstone AI-NetSecOps Platform
Covers:
- MTTR and storage capacity calculations
- AINetSecOpsPlatform (Triage, Diagnostics, RAG Intel, Safety Guardrail with Protected Allowlist)
- TransactionalNetworkConfigurator (Automated Rollback derivation & LIFO execution)
- End-to-end latency calculation
"""

import re
from typing import Dict, Any, List, Optional, Tuple, TypedDict
import pytest

# ==============================================================================
# 1. MTTR & STORAGE FORMULAS
# ==============================================================================

def calculate_new_mttr(
    auto_ratio: float, auto_mttr: float,
    manual_ratio: float, manual_mttr: float
) -> float:
    return (auto_ratio * auto_mttr) + (manual_ratio * manual_mttr)

def calculate_annual_savings(
    monthly_incidents: int,
    old_mttr_min: float,
    new_mttr_min: float,
    hourly_rate: float
) -> Tuple[float, float]:
    """Returns (freed_hours_per_month, annual_cost_savings)."""
    old_hours = (monthly_incidents * old_mttr_min) / 60.0
    new_hours = (monthly_incidents * new_mttr_min) / 60.0
    freed_hours = old_hours - new_hours
    annual_savings = freed_hours * hourly_rate * 12.0
    return freed_hours, annual_savings

def calculate_end_to_end_latency(
    triage_ms: float, rag_ms: float, synthesis_ms: float, guardrail_ms: float
) -> Tuple[float, float]:
    """Returns (total_ms, synthesis_percentage)."""
    total = triage_ms + rag_ms + synthesis_ms + guardrail_ms
    percentage = (synthesis_ms / total) * 100.0
    return total, round(percentage, 2)

def test_mttr_and_savings_math():
    # Exercise B.1: 80% at 2min, 20% at 20min
    new_mttr = calculate_new_mttr(0.8, 2.0, 0.2, 20.0)
    assert new_mttr == pytest.approx(5.6)

    # 400 incidents/month, old=45min, rate=$60/hr
    freed_hrs, annual_savings = calculate_annual_savings(400, 45.0, 5.6, 60.0)
    assert freed_hrs == pytest.approx(262.666, abs=0.1)
    assert annual_savings == pytest.approx(189120.0, abs=10.0)

    # Exercise B.3: Latency calculations
    total_ms, synth_pct = calculate_end_to_end_latency(300.0, 25.0, 1200.0, 5.0)
    assert total_ms == 1530.0
    assert synth_pct == pytest.approx(78.43, abs=0.1)

# ==============================================================================
# 2. AI-NETSECOPS PLATFORM
# ==============================================================================

class AINetSecOpsPlatform:
    DANGEROUS_COMMANDS = [
        re.compile(r"\brm\s+(-rf?|-fr?)\b", re.IGNORECASE),
        re.compile(r"\breboot\b", re.IGNORECASE),
        re.compile(r"\bshutdown\b", re.IGNORECASE),
        re.compile(r"\bformat\b", re.IGNORECASE),
        re.compile(r"\bip\s+route\s+del\s+default\b", re.IGNORECASE),
    ]

    PROTECTED_ALLOWLIST = {
        "127.0.0.1", "10.0.0.1", "10.0.0.2", "192.168.1.1", "8.8.8.8"
    }

    def __init__(self, cve_database: Optional[Dict[str, str]] = None):
        self.cve_database = cve_database or {
            "T1046": "Network Service Discovery (Port Scan)",
            "T1190": "Exploit Public-Facing Application",
            "T1498": "Network Denial of Service (SYN Flood)"
        }
        self.audit_log: List[Dict[str, Any]] = []

    def supervisor_triage(self, event_text: str) -> str:
        text_lower = event_text.lower()
        if "packet loss" in text_lower or "latency" in text_lower or "unreachable" in text_lower:
            return "NETOPS_DIAGNOSIS"
        if "scan" in text_lower or "unauthorized" in text_lower or "syn flood" in text_lower:
            return "SECOPS_THREAT_INTEL"
        return "GENERAL_INQUIRY"

    def run_network_diagnostic(self, target_host: str) -> Dict[str, Any]:
        is_internal = target_host.startswith("10.") or target_host.startswith("192.168.")
        return {
            "target": target_host,
            "packet_loss_percent": 0.0 if is_internal else 75.0,
            "latency_p95_ms": 12.5 if is_internal else 340.0,
            "status": "HEALTHY" if is_internal else "DEGRADED"
        }

    def run_threat_intel_rag(self, incident_signature: str) -> Dict[str, Any]:
        matched_technique = "T1046" if "scan" in incident_signature.lower() else "T1498"
        description = self.cve_database.get(matched_technique, "Unknown Threat")
        return {
            "mitre_id": matched_technique,
            "technique_name": description,
            "recommended_action": "Block source IP with iptables rule"
        }

    def generate_remediation_command(self, action_type: str, target_ip: str) -> str:
        if action_type == "BLOCK_IP":
            return f"iptables -I INPUT -s {target_ip} -j DROP"
        elif action_type == "CLEAR_DNS":
            return "systemd-resolve --flush-caches"
        return "echo 'No action defined'"

    def validate_command_safety(self, command: str, target_ip: Optional[str] = None) -> bool:
        for pattern in self.DANGEROUS_COMMANDS:
            if pattern.search(command):
                return False

        if target_ip and target_ip in self.PROTECTED_ALLOWLIST:
            return False

        return True

    def execute_workflow(
        self, 
        incident_id: str, 
        event_text: str, 
        source_ip: str
    ) -> Dict[str, Any]:
        route = self.supervisor_triage(event_text)
        
        diagnostics = {}
        if route == "NETOPS_DIAGNOSIS":
            diagnostics = self.run_network_diagnostic(source_ip)
        else:
            diagnostics = self.run_threat_intel_rag(event_text)

        remediation_cmd = self.generate_remediation_command("BLOCK_IP", source_ip)
        is_safe = self.validate_command_safety(remediation_cmd, target_ip=source_ip)

        record = {
            "incident_id": incident_id,
            "route": route,
            "diagnostics": diagnostics,
            "proposed_command": remediation_cmd,
            "is_safe": is_safe,
            "requires_human_approval": True,
            "status": "WAITING_FOR_HUMAN_APPROVAL" if is_safe else "BLOCKED_BY_GUARDRAIL"
        }
        self.audit_log.append(record)
        return record

def test_platform_triage():
    platform = AINetSecOpsPlatform()
    assert platform.supervisor_triage("High packet loss on gateway") == "NETOPS_DIAGNOSIS"
    assert platform.supervisor_triage("Port scan detected from remote host") == "SECOPS_THREAT_INTEL"
    assert platform.supervisor_triage("How do I request VPN access?") == "GENERAL_INQUIRY"

def test_platform_allowlist_blocks_critical_infrastructure():
    platform = AINetSecOpsPlatform()
    # Blocking default gateway 10.0.0.1 must be rejected by guardrail
    cmd = platform.generate_remediation_command("BLOCK_IP", "10.0.0.1")
    is_safe = platform.validate_command_safety(cmd, target_ip="10.0.0.1")
    assert is_safe is False

    # Blocking external malicious IP 203.0.113.50 must be permitted
    cmd_ext = platform.generate_remediation_command("BLOCK_IP", "203.0.113.50")
    is_safe_ext = platform.validate_command_safety(cmd_ext, target_ip="203.0.113.50")
    assert is_safe_ext is True

def test_platform_dangerous_command_guardrail():
    platform = AINetSecOpsPlatform()
    assert platform.validate_command_safety("rm -rf /etc/network") is False
    assert platform.validate_command_safety("ip route del default") is False
    assert platform.validate_command_safety("reboot") is False
    assert platform.validate_command_safety("iptables -I INPUT -s 1.2.3.4 -j DROP") is True

def test_platform_workflow_execution():
    platform = AINetSecOpsPlatform()
    res = platform.execute_workflow(
        incident_id="INC-2026-001",
        event_text="Detected SYN Flood attack from untrusted IP",
        source_ip="198.51.100.25"
    )
    assert res["incident_id"] == "INC-2026-001"
    assert res["route"] == "SECOPS_THREAT_INTEL"
    assert res["is_safe"] is True
    assert res["status"] == "WAITING_FOR_HUMAN_APPROVAL"
    assert res["requires_human_approval"] is True

# ==============================================================================
# 3. TRANSACTIONAL NETWORK CONFIGURATOR
# ==============================================================================

class TransactionalNetworkConfigurator:
    def __init__(self):
        self.history_stack: List[Tuple[str, str]] = []

    @staticmethod
    def derive_rollback_command(command: str) -> Optional[str]:
        if command.startswith("iptables -I"):
            return command.replace("iptables -I", "iptables -D", 1)
        elif command.startswith("iptables -A"):
            return command.replace("iptables -A", "iptables -D", 1)
        elif command.startswith("ip route add"):
            return command.replace("ip route add", "ip route del", 1)
        return None

    def execute_with_transaction(self, command: str) -> Tuple[bool, str]:
        rollback_cmd = self.derive_rollback_command(command)
        if not rollback_cmd:
            return False, f"Khong the xac dinh lenh rollback an toan cho: {command}"
        
        self.history_stack.append((command, rollback_cmd))
        return True, f"Da thuc thi thanh cong: {command}"

    def rollback_last_action(self) -> Tuple[bool, str]:
        if not self.history_stack:
            return False, "Ngan xep lich su rong, khong co gi de hoan tac."
        
        executed_cmd, rollback_cmd = self.history_stack.pop()
        return True, f"Da hoan nguyen thanh cong bang lenh: {rollback_cmd}"

def test_transactional_network_rollback():
    configurator = TransactionalNetworkConfigurator()
    
    # 1. Execute iptables command
    ok, msg = configurator.execute_with_transaction("iptables -I INPUT -s 10.99.1.5 -j DROP")
    assert ok is True
    assert len(configurator.history_stack) == 1
    assert configurator.history_stack[-1][1] == "iptables -D INPUT -s 10.99.1.5 -j DROP"

    # 2. Execute route command
    ok2, msg2 = configurator.execute_with_transaction("ip route add 192.168.100.0/24 via 10.0.0.254")
    assert ok2 is True
    assert len(configurator.history_stack) == 2

    # 3. Rollback last action (LIFO) -> route command
    rb_ok, rb_msg = configurator.rollback_last_action()
    assert rb_ok is True
    assert "ip route del 192.168.100.0/24 via 10.0.0.254" in rb_msg
    assert len(configurator.history_stack) == 1

    # 4. Rollback first action -> iptables
    rb_ok2, rb_msg2 = configurator.rollback_last_action()
    assert rb_ok2 is True
    assert "iptables -D INPUT -s 10.99.1.5 -j DROP" in rb_msg2
    assert len(configurator.history_stack) == 0

    # 5. Empty rollback fails gracefully
    rb_ok3, rb_msg3 = configurator.rollback_last_action()
    assert rb_ok3 is False

# ==============================================================================
# 4. BENFORD'S LAW FRAUD DETECTOR (FINANCIAL AUDIT COPILOT)
# ==============================================================================

import math

class BenfordFraudDetector:
    """Bo kiem dinh gian lan ke toan & tai chinh dua tren quy luat Benford.
    P(d) = log10(1 + 1/d) cho d tu 1 den 9.
    Kiem dinh Chi-Square voi 8 bac tu do (alpha = 0.05, chi2_crit = 15.507).
    """
    BENFORD_PROBABILITIES = {
        d: math.log10(1.0 + 1.0 / d) for d in range(1, 10)
    }
    CHI_SQUARE_CRITICAL_8DF_95 = 15.507

    @staticmethod
    def extract_leading_digit(amount: float) -> Optional[int]:
        if amount <= 0:
            return None
        s = f"{amount:.10f}".lstrip("0.")
        for ch in s:
            if ch in "123456789":
                return int(ch)
        return None

    def analyze_transactions(self, amounts: List[float]) -> Dict[str, Any]:
        digits = [self.extract_leading_digit(a) for a in amounts]
        valid_digits = [d for d in digits if d is not None]
        n = len(valid_digits)
        if n < 10:
            return {
                "sample_size": n,
                "is_fraud_suspected": False,
                "chi_square_stat": 0.0,
                "reason": "Sample size too small (< 10)"
            }

        counts = {d: 0 for d in range(1, 10)}
        for d in valid_digits:
            counts[d] += 1

        chi_square = 0.0
        expected_counts = {}
        observed_counts = {}
        for d in range(1, 10):
            e_d = n * self.BENFORD_PROBABILITIES[d]
            o_d = counts[d]
            expected_counts[d] = round(e_d, 2)
            observed_counts[d] = o_d
            chi_square += ((o_d - e_d) ** 2) / e_d

        is_fraud = chi_square > self.CHI_SQUARE_CRITICAL_8DF_95
        return {
            "sample_size": n,
            "chi_square_stat": round(chi_square, 3),
            "critical_threshold": self.CHI_SQUARE_CRITICAL_8DF_95,
            "is_fraud_suspected": is_fraud,
            "observed_distribution": observed_counts,
            "expected_distribution": expected_counts,
            "status": "ANOMALY_DETECTED" if is_fraud else "CONFORMS_TO_BENFORD"
        }

def test_benford_fraud_detector():
    detector = BenfordFraudDetector()

    # 1. Sample conforming to Benford's law (approximate frequencies for N=1000)
    benford_sample = []
    for d, prob in detector.BENFORD_PROBABILITIES.items():
        count = int(round(prob * 1000))
        benford_sample.extend([float(f"{d}50.25")] * count)

    res_clean = detector.analyze_transactions(benford_sample)
    assert res_clean["is_fraud_suspected"] is False
    assert res_clean["chi_square_stat"] < detector.CHI_SQUARE_CRITICAL_8DF_95
    assert res_clean["status"] == "CONFORMS_TO_BENFORD"

    # 2. Fabricated invoices with an overwhelming number of 9s (e.g., $990 to bypass $1000 approval limit)
    fraudulent_sample = [990.0] * 300 + [985.5] * 200 + [120.0] * 50
    res_fraud = detector.analyze_transactions(fraudulent_sample)
    assert res_fraud["is_fraud_suspected"] is True
    assert res_fraud["chi_square_stat"] > 100.0  # Massive deviation
    assert res_fraud["status"] == "ANOMALY_DETECTED"

# ==============================================================================
# 5. TWO-TOWER & MMR DIVERSITY RERANKER (RECOMMENDER SYSTEM)
# ==============================================================================

class TwoTowerSimilarityRetriever:
    """Bo truy van ung vien Two-Tower su dung Cosine Similarity."""
    @staticmethod
    def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))
        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0
        return dot / (norm_a * norm_b)

    def retrieve_top_k(
        self,
        query_vector: List[float],
        item_database: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        scored = []
        for item in item_database:
            sim = self.cosine_similarity(query_vector, item["embedding"])
            scored.append({
                "item_id": item["item_id"],
                "name": item.get("name", ""),
                "category": item.get("category", ""),
                "score": round(sim, 4),
                "embedding": item["embedding"]
            })
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]

class MMRDiversityReranker:
    """Tai xep hang da dang hoa Maximal Marginal Relevance (MMR)."""
    @staticmethod
    def rerank(
        candidates: List[Dict[str, Any]],
        lambda_param: float = 0.5,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        if not candidates or top_k <= 0:
            return []
        
        selected: List[Dict[str, Any]] = []
        remaining = candidates.copy()

        first = max(remaining, key=lambda x: x["score"])
        selected.append(first)
        remaining.remove(first)

        while len(selected) < top_k and remaining:
            best_item = None
            best_mmr_score = -float("inf")

            for item in remaining:
                relevance = item["score"]
                max_sim_to_selected = max(
                    TwoTowerSimilarityRetriever.cosine_similarity(item["embedding"], s["embedding"])
                    for s in selected
                )
                mmr_score = lambda_param * relevance - (1.0 - lambda_param) * max_sim_to_selected
                if mmr_score > best_mmr_score:
                    best_mmr_score = mmr_score
                    best_item = item

            if best_item:
                selected.append(best_item)
                remaining.remove(best_item)
            else:
                break

        return selected

def test_two_tower_similarity_and_mmr_rerank():
    retriever = TwoTowerSimilarityRetriever()
    query = [1.0, 0.0]
    
    items = [
        {"item_id": "item-1", "name": "Running Shoes Red", "embedding": [1.0, 0.0]},
        {"item_id": "item-2", "name": "Running Shoes Red v2", "embedding": [0.99, 0.05]},  # redundant
        {"item_id": "item-3", "name": "Sports Jacket", "embedding": [0.0, 1.0]},           # diverse
        {"item_id": "item-4", "name": "Trail Shoes", "embedding": [0.8, 0.6]},
    ]
    
    # Standard retrieval (top 2 by score)
    top_candidates = retriever.retrieve_top_k(query, items, top_k=4)
    assert top_candidates[0]["item_id"] == "item-1"
    assert top_candidates[1]["item_id"] == "item-2"

    # MMR Reranking with lambda = 0.5 (penalizes redundant items)
    mmr_results = MMRDiversityReranker.rerank(top_candidates, lambda_param=0.5, top_k=3)
    assert mmr_results[0]["item_id"] == "item-1"
    # item-2 is penalized because its cosine similarity with item-1 is ~0.999
    # item-4 or item-3 provides better diversity trade-off
    selected_ids = [it["item_id"] for it in mmr_results]
    assert "item-4" in selected_ids

# ==============================================================================
# 6. DISTRIBUTED TRACE ROOT CAUSE ANALYZER (ENTERPRISE SRE AGENT)
# ==============================================================================

class TraceSpan(TypedDict):
    span_id: str
    parent_id: Optional[str]
    service_name: str
    start_time_ms: float
    end_time_ms: float
    is_error: bool

class DistributedTraceRootCauseAnalyzer:
    """Phan tich cay vet Distributed Tracing de xac dinh Root Cause Service."""
    @staticmethod
    def analyze_trace(spans: List[TraceSpan]) -> Dict[str, Any]:
        if not spans:
            return {"root_cause_service": None, "total_trace_duration_ms": 0.0}

        durations = {}
        children_map: Dict[str, List[str]] = {s["span_id"]: [] for s in spans}
        span_by_id = {s["span_id"]: s for s in spans}

        for s in spans:
            durations[s["span_id"]] = max(0.0, s["end_time_ms"] - s["start_time_ms"])
            if s["parent_id"] and s["parent_id"] in children_map:
                children_map[s["parent_id"]].append(s["span_id"])

        self_times = {}
        for s in spans:
            s_id = s["span_id"]
            child_dur = sum(durations[c_id] for c_id in children_map[s_id])
            self_times[s_id] = max(0.0, durations[s_id] - child_dur)

        error_spans = [s for s in spans if s["is_error"]]
        if error_spans:
            root_cause_span = error_spans[-1]
            reason = f"Error flag raised in service {root_cause_span['service_name']}"
        else:
            max_self_id = max(self_times, key=lambda sid: self_times[sid])
            root_cause_span = span_by_id[max_self_id]
            reason = f"Latency bottleneck with maximum self-time ({round(self_times[max_self_id], 2)}ms)"

        root_span = next((s for s in spans if s["parent_id"] is None), spans[0])
        total_trace_duration = durations[root_span["span_id"]]

        return {
            "root_cause_service": root_cause_span["service_name"],
            "root_cause_span_id": root_cause_span["span_id"],
            "reason": reason,
            "total_trace_duration_ms": round(total_trace_duration, 2),
            "self_time_ms": round(self_times[root_cause_span["span_id"]], 2)
        }

def test_distributed_trace_root_cause_analyzer():
    # Scenario 1: Latency bottleneck in Database
    spans_latency: List[TraceSpan] = [
        {"span_id": "s1", "parent_id": None, "service_name": "API-Gateway", "start_time_ms": 0.0, "end_time_ms": 200.0, "is_error": False},
        {"span_id": "s2", "parent_id": "s1", "service_name": "Auth-Service", "start_time_ms": 5.0, "end_time_ms": 25.0, "is_error": False},
        {"span_id": "s3", "parent_id": "s1", "service_name": "Database-Postgres", "start_time_ms": 30.0, "end_time_ms": 190.0, "is_error": False},
    ]
    res_lat = DistributedTraceRootCauseAnalyzer.analyze_trace(spans_latency)
    assert res_lat["root_cause_service"] == "Database-Postgres"
    assert res_lat["self_time_ms"] == 160.0
    assert "Latency bottleneck" in res_lat["reason"]

    # Scenario 2: Error flag in Payment microservice
    spans_error: List[TraceSpan] = [
        {"span_id": "s1", "parent_id": None, "service_name": "API-Gateway", "start_time_ms": 0.0, "end_time_ms": 50.0, "is_error": False},
        {"span_id": "s2", "parent_id": "s1", "service_name": "Order-Service", "start_time_ms": 5.0, "end_time_ms": 45.0, "is_error": False},
        {"span_id": "s3", "parent_id": "s2", "service_name": "Payment-Service", "start_time_ms": 10.0, "end_time_ms": 40.0, "is_error": True},
    ]
    res_err = DistributedTraceRootCauseAnalyzer.analyze_trace(spans_error)
    assert res_err["root_cause_service"] == "Payment-Service"
    assert "Error flag raised" in res_err["reason"]


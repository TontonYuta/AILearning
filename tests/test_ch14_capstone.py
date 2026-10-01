"""
Unit tests for Chapter 14: Flagship Capstone AI-NetSecOps Platform
Covers:
- MTTR and storage capacity calculations
- AINetSecOpsPlatform (Triage, Diagnostics, RAG Intel, Safety Guardrail with Protected Allowlist)
- TransactionalNetworkConfigurator (Automated Rollback derivation & LIFO execution)
- End-to-end latency calculation
"""

import re
from typing import Dict, Any, List, Optional, Tuple
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

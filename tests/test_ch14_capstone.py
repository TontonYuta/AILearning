"""
Unit tests for Chapter 14: Flagship Capstone AI-NetSecOps Platform
Covers:
- MTTR and storage capacity calculations
- AINetSecOpsPlatform (Triage, Diagnostics, RAG Intel, Safety Guardrail, Workflow)
- TransactionalNetworkConfigurator (Automated Rollback derivation & LIFO execution)
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

def test_mttr_and_savings_math():
    # Exercise B.1: 80% at 2min, 20% at 20min
    new_mttr = calculate_new_mttr(0.8, 2.0, 0.2, 20.0)
    assert new_mttr == pytest.approx(5.6)

    # 400 incidents/month, old=45min, rate=$60/hr
    freed_hrs, annual_savings = calculate_annual_savings(400, 45.0, 5.6, 60.0)
    assert freed_hrs == pytest.approx(262.666, abs=0.1)
    assert annual_savings == pytest.approx(189120.0, abs=10.0)

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

    def validate_command_safety(self, command: str) -> bool:
        for pattern in self.DANGEROUS_COMMANDS:
            if pattern.search(command):
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
        is_safe = self.validate_command_safety(remediation_cmd)

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
    assert platform.supervisor_triage("Detected port scan on port 443") == "SECOPS_THREAT_INTEL"
    assert platform.supervisor_triage("How to reset password?") == "GENERAL_INQUIRY"

def test_platform_command_safety():
    platform = AINetSecOpsPlatform()
    assert platform.validate_command_safety("iptables -I INPUT -s 192.168.1.5 -j DROP")
    assert not platform.validate_command_safety("rm -rf /etc/network")
    assert not platform.validate_command_safety("reboot now")
    assert not platform.validate_command_safety("ip route del default")

def test_platform_workflow_execution():
    platform = AINetSecOpsPlatform()
    res = platform.execute_workflow(
        incident_id="INC-001",
        event_text="Suspicious horizontal scan from external host",
        source_ip="203.0.113.42"
    )
    assert res["route"] == "SECOPS_THREAT_INTEL"
    assert res["is_safe"] is True
    assert res["requires_human_approval"] is True
    assert res["status"] == "WAITING_FOR_HUMAN_APPROVAL"
    assert "iptables -I INPUT -s 203.0.113.42 -j DROP" in res["proposed_command"]
    assert len(platform.audit_log) == 1

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

def test_transactional_configurator_flow():
    configurator = TransactionalNetworkConfigurator()
    
    # 1. Execute iptables block
    cmd = "iptables -I INPUT -s 10.10.10.5 -j DROP"
    success, msg = configurator.execute_with_transaction(cmd)
    assert success
    assert len(configurator.history_stack) == 1
    assert configurator.history_stack[-1][1] == "iptables -D INPUT -s 10.10.10.5 -j DROP"

    # 2. Rollback
    rb_success, rb_msg = configurator.rollback_last_action()
    assert rb_success
    assert "iptables -D INPUT -s 10.10.10.5 -j DROP" in rb_msg
    assert len(configurator.history_stack) == 0

    # 3. Rollback on empty stack
    empty_success, empty_msg = configurator.rollback_last_action()
    assert not empty_success

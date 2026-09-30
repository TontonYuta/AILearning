"""Test suite for Phase 8 Capstone Agent Dispatcher & Tool Suite."""
import pytest
import re
from typing import Dict, Any, List

class NetSecToolSuite:
    """Bo cong cu quan tri mang va an ninh danh cho AI Agent."""
    
    @staticmethod
    def ping_diagnostic(host: str) -> Dict[str, Any]:
        """Kiem tra do tre mang va ket noi toi host."""
        if not re.match(r"^[a-zA-Z0-9.-]+$", host):
            return {"status": "error", "message": "Invalid hostname or IP"}
        return {
            "status": "success",
            "host": host,
            "packets_transmitted": 4,
            "packets_received": 4,
            "packet_loss_percent": 0.0,
            "avg_latency_ms": 14.2
        }

    @staticmethod
    def analyze_syslog(log_line: str) -> Dict[str, Any]:
        """Phan tich cu phap va danh gia muc do nguy hiem cua log."""
        is_attack = "failed password" in log_line.lower() or "unauthorized" in log_line.lower()
        return {
            "log": log_line,
            "threat_detected": is_attack,
            "severity": "CRITICAL" if is_attack else "INFO",
            "recommended_action": "BLOCK_IP" if is_attack else "IGNORE"
        }

class NetSecAgentDispatcher:
    """Dieu phoi va kiem soat quyen han thuc thi cong cu cua Agent."""
    
    def __init__(self):
        self.tools = NetSecToolSuite()
        self.execution_audit_log: List[Dict[str, Any]] = []

    def dispatch(self, tool_name: str, arguments: Dict[str, Any], user_role: str) -> Dict[str, Any]:
        audit_entry = {"tool": tool_name, "args": arguments, "role": user_role}
        self.execution_audit_log.append(audit_entry)

        if tool_name == "ping":
            host = arguments.get("host", "")
            return self.tools.ping_diagnostic(host)
            
        elif tool_name == "analyze_log":
            line = arguments.get("log_line", "")
            return self.tools.analyze_syslog(line)
            
        elif tool_name == "apply_firewall_rule":
            if user_role != "NETSEC_ADMIN":
                return {
                    "status": "denied",
                    "error": "Requires NETSEC_ADMIN role and explicit human confirmation"
                }
            return {"status": "success", "rule_applied": arguments.get("rule")}
            
        return {"status": "error", "message": f"Unknown tool: {tool_name}"}

def test_ping_sanitization():
    dispatcher = NetSecAgentDispatcher()
    
    # Valid hostname
    valid_res = dispatcher.dispatch("ping", {"host": "192.168.1.1"}, user_role="OPERATOR")
    assert valid_res["status"] == "success"
    assert valid_res["avg_latency_ms"] == 14.2
    
    # Injection attempt
    malicious_res = dispatcher.dispatch("ping", {"host": "10.0.0.1; rm -rf /"}, user_role="OPERATOR")
    assert malicious_res["status"] == "error"
    assert "Invalid hostname" in malicious_res["message"]

def test_syslog_analysis():
    dispatcher = NetSecAgentDispatcher()
    
    # Normal syslog
    normal_res = dispatcher.dispatch("analyze_log", {"log_line": "User alice logged in successfully."}, user_role="OPERATOR")
    assert normal_res["threat_detected"] is False
    assert normal_res["severity"] == "INFO"
    
    # Attack syslog
    attack_res = dispatcher.dispatch("analyze_log", {"log_line": "Failed password for root from 192.168.1.100 port 22"}, user_role="OPERATOR")
    assert attack_res["threat_detected"] is True
    assert attack_res["severity"] == "CRITICAL"
    assert attack_res["recommended_action"] == "BLOCK_IP"

def test_rbac_and_audit_trail():
    dispatcher = NetSecAgentDispatcher()
    
    # Unauthorized role attempting firewall change
    denied_res = dispatcher.dispatch("apply_firewall_rule", {"rule": "DROP 192.168.1.100"}, user_role="OPERATOR")
    assert denied_res["status"] == "denied"
    assert "NETSEC_ADMIN" in denied_res["error"]
    
    # Authorized role attempting firewall change
    allowed_res = dispatcher.dispatch("apply_firewall_rule", {"rule": "DROP 192.168.1.100"}, user_role="NETSEC_ADMIN")
    assert allowed_res["status"] == "success"
    assert allowed_res["rule_applied"] == "DROP 192.168.1.100"
    
    # Verify audit trail
    assert len(dispatcher.execution_audit_log) == 2

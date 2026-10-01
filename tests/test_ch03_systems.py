"""Test suite for Chapter 3 Systems and Networking code examples."""
import pytest
import socket
from typing import Dict, Any, List, Optional
from unittest.mock import patch, MagicMock

class InMemorySlidingWindowRateLimiter:
    def __init__(self, limit: int = 10, window_seconds: float = 60.0):
        self.limit = limit
        self.window = window_seconds
        self.storage: Dict[str, List[float]] = {}

    def is_allowed(self, user_id: str, current_time: Optional[float] = None) -> bool:
        now = current_time if current_time is not None else 1000.0
        clear_before = now - self.window
        
        if user_id not in self.storage:
            self.storage[user_id] = []
            
        timestamps = self.storage[user_id]
        self.storage[user_id] = [t for t in timestamps if t > clear_before]
        
        if len(self.storage[user_id]) < self.limit:
            self.storage[user_id].append(now)
            return True
        return False

class NetworkLatencyBreakdownCalculator:
    @staticmethod
    def calculate_total_ttft(
        rtt_ms: float,
        gpu_ttft_ms: float,
        is_connection_reused: bool = True
    ) -> Dict[str, Any]:
        if rtt_ms < 0 or gpu_ttft_ms < 0:
            raise ValueError("Do tre khong the la so am")
            
        handshake_overhead = 0.0 if is_connection_reused else (2.0 * rtt_ms)
        transit_latency = rtt_ms
        total_ttft = handshake_overhead + transit_latency + gpu_ttft_ms
        network_percentage = ((handshake_overhead + transit_latency) / total_ttft) * 100.0
        
        return {
            "rtt_ms": rtt_ms,
            "gpu_ttft_ms": gpu_ttft_ms,
            "handshake_overhead_ms": handshake_overhead,
            "transit_ms": transit_latency,
            "total_ttft_ms": round(total_ttft, 2),
            "network_percentage": round(network_percentage, 1),
            "connection_reused": is_connection_reused
        }

class CIDRSubnetCalculator:
    @staticmethod
    def calculate_usable_hosts(cidr_prefix: int) -> int:
        if not (0 <= cidr_prefix <= 32):
            raise ValueError("CIDR prefix phai nam trong khoang 0 den 32")
        if cidr_prefix >= 31:
            return 0
        return (2 ** (32 - cidr_prefix)) - 2

class AINetworkHealthChecker:
    @staticmethod
    def check_port(host: str, port: int, timeout_sec: float = 2.0) -> Dict[str, Any]:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout_sec)
        try:
            sock.connect((host, port))
            return {"host": host, "port": port, "status": "OPEN"}
        except socket.timeout:
            return {"host": host, "port": port, "status": "TIMEOUT"}
        except ConnectionRefusedError:
            return {"host": host, "port": port, "status": "CLOSED"}
        except Exception as e:
            return {"host": host, "port": port, "status": f"ERROR: {str(e)}"}
        finally:
            sock.close()

def test_sliding_window_rate_limiter():
    limiter = InMemorySlidingWindowRateLimiter(limit=3, window_seconds=10.0)
    
    assert limiter.is_allowed("user_1", current_time=1.0) is True
    assert limiter.is_allowed("user_1", current_time=2.0) is True
    assert limiter.is_allowed("user_1", current_time=3.0) is True
    assert limiter.is_allowed("user_1", current_time=4.0) is False
    
    assert limiter.is_allowed("user_1", current_time=12.0) is True

def test_network_latency_calculator():
    res_pool = NetworkLatencyBreakdownCalculator.calculate_total_ttft(
        rtt_ms=36.0, gpu_ttft_ms=80.0, is_connection_reused=True
    )
    assert res_pool["total_ttft_ms"] == 116.0
    
    res_no_pool = NetworkLatencyBreakdownCalculator.calculate_total_ttft(
        rtt_ms=36.0, gpu_ttft_ms=80.0, is_connection_reused=False
    )
    assert res_no_pool["total_ttft_ms"] == 188.0
    assert res_no_pool["handshake_overhead_ms"] == 72.0

def test_cidr_calculator():
    # /24 has 254 usable hosts
    assert CIDRSubnetCalculator.calculate_usable_hosts(24) == 254
    # /22 has 1022 usable hosts (Exercise B.2)
    assert CIDRSubnetCalculator.calculate_usable_hosts(22) == 1022
    # /30 has 2 usable hosts
    assert CIDRSubnetCalculator.calculate_usable_hosts(30) == 2
    # /32 has 0 usable hosts
    assert CIDRSubnetCalculator.calculate_usable_hosts(32) == 0

def test_network_health_checker_mock():
    with patch("socket.socket") as mock_sock_cls:
        mock_sock = MagicMock()
        mock_sock_cls.return_value = mock_sock
        
        # Test OPEN
        mock_sock.connect.return_value = None
        res = AINetworkHealthChecker.check_port("127.0.0.1", 8000)
        assert res["status"] == "OPEN"

        # Test TIMEOUT
        mock_sock.connect.side_effect = socket.timeout
        res = AINetworkHealthChecker.check_port("127.0.0.1", 8000)
        assert res["status"] == "TIMEOUT"

        # Test CLOSED
        mock_sock.connect.side_effect = ConnectionRefusedError
        res = AINetworkHealthChecker.check_port("127.0.0.1", 8000)
        assert res["status"] == "CLOSED"

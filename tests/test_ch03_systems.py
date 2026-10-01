"""Test suite for Chapter 3 Systems and Networking code examples."""
import math
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

def test_bandwidth_delay_product_calculation():
    """Verify BDP calculation: BDP = Bandwidth * RTT."""
    bandwidth_gbps = 10.0
    rtt_ms = 35.0
    
    # In bytes: 10 Gbps = (10 * 10^9 / 8) Bytes/s = 1.25 * 10^9 Bytes/s
    bandwidth_bytes_per_sec = (bandwidth_gbps * 1e9) / 8.0
    rtt_sec = rtt_ms / 1000.0
    
    bdp_bytes = bandwidth_bytes_per_sec * rtt_sec
    bdp_mib = bdp_bytes / (1024 * 1024)
    
    assert math.isclose(bdp_bytes, 43_750_000.0, rel_tol=1e-7)
    assert abs(bdp_mib - 41.72) < 0.01

def test_tcp_cubic_window_growth_simulation():
    """Verify TCP CUBIC mathematical window growth: W(t) = C*(t - K)^3 + W_max."""
    import math
    W_max = 1000.0  # packets
    beta = 0.2
    C = 0.4
    
    K = (W_max * beta / C) ** (1.0 / 3.0)  # K = (200 / 0.4)^(1/3) = 500^(1/3) ~ 7.937
    
    # At t = 0: W(0) = C * (-K)^3 + W_max = - (W_max * beta) + W_max = (1 - beta) * W_max
    W_0 = C * (0 - K)**3 + W_max
    assert math.isclose(W_0, (1 - beta) * W_max, rel_tol=1e-5)
    
    # At t = K: W(K) reaches exactly W_max
    W_K = C * (K - K)**3 + W_max
    assert math.isclose(W_K, W_max, rel_tol=1e-5)
    
    # For t > K: window probes aggressively higher than W_max
    W_future = C * (K + 2.0 - K)**3 + W_max
    assert W_future > W_max

def test_ecdh_key_exchange_toy_simulation():
    """Verify Diffie-Hellman discrete log key exchange property: (g^a)^b == (g^b)^a mod p."""
    # Toy prime and generator
    p = 23
    g = 5
    
    # Client secret d_C, Server secret d_S
    d_C = 6
    d_S = 15
    
    # Public keys
    Q_C = pow(g, d_C, p)  # 5^6 mod 23 = 8
    Q_S = pow(g, d_S, p)  # 5^15 mod 23 = 19
    
    # Derived shared secret
    K_client = pow(Q_S, d_C, p)  # 19^6 mod 23 = 2
    K_server = pow(Q_C, d_S, p)  # 8^15 mod 23 = 2
    
    assert K_client == K_server == 2

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


class TCPOptimizerEngine:
    @staticmethod
    def calculate_bdp(bandwidth_gbps: float, rtt_ms: float) -> Dict[str, Any]:
        if bandwidth_gbps <= 0 or rtt_ms <= 0:
            raise ValueError("Bandwidth va RTT phai la so duong")
            
        bandwidth_bps = bandwidth_gbps * 1e9
        rtt_sec = rtt_ms / 1000.0
        
        bdp_bits = bandwidth_bps * rtt_sec
        bdp_bytes = int(bdp_bits / 8.0)
        bdp_mb = round(bdp_bytes / 1e6, 2)
        
        return {
            "bandwidth_gbps": bandwidth_gbps,
            "rtt_ms": rtt_ms,
            "bdp_bytes": bdp_bytes,
            "bdp_mb": bdp_mb
        }

    @staticmethod
    def calculate_throughput_limit(buffer_bytes: int, rtt_ms: float) -> float:
        rtt_sec = rtt_ms / 1000.0
        max_bps = (buffer_bytes * 8.0) / rtt_sec
        return round(max_bps / 1e6, 2)

    @staticmethod
    def generate_sysctl_recommendations(bandwidth_gbps: float, rtt_ms: float) -> Dict[str, Any]:
        bdp_info = TCPOptimizerEngine.calculate_bdp(bandwidth_gbps, rtt_ms)
        recommended_max_bytes = int(bdp_info["bdp_bytes"] * 1.25)
        
        return {
            "bdp_bytes": bdp_info["bdp_bytes"],
            "recommended_max_bytes": recommended_max_bytes,
            "sysctl_commands": [
                f"sysctl -w net.core.rmem_max={recommended_max_bytes}",
                f"sysctl -w net.core.wmem_max={recommended_max_bytes}",
                f"sysctl -w net.ipv4.tcp_rmem='4096 87380 {recommended_max_bytes}'",
                f"sysctl -w net.ipv4.tcp_wmem='4096 65536 {recommended_max_bytes}'",
                "sysctl -w net.ipv4.tcp_window_scaling=1"
            ]
        }


def test_tcp_optimizer_engine():
    # Exercise B.3: 10 Gbps, RTT = 80ms
    res = TCPOptimizerEngine.calculate_bdp(bandwidth_gbps=10.0, rtt_ms=80.0)
    assert res["bdp_bytes"] == 100_000_000
    assert res["bdp_mb"] == 100.0

    # With 4MB buffer: Throughput limit = 400 Mbps
    limit_4mb = TCPOptimizerEngine.calculate_throughput_limit(buffer_bytes=4_000_000, rtt_ms=80.0)
    assert limit_4mb == 400.0

    rec = TCPOptimizerEngine.generate_sysctl_recommendations(bandwidth_gbps=10.0, rtt_ms=80.0)
    assert rec["recommended_max_bytes"] == 125_000_000
    assert len(rec["sysctl_commands"]) == 5


def test_exercise_b4_vlsm_subnetting():
    # Subnet 2: /23 -> 510 usable hosts (>= 450)
    assert CIDRSubnetCalculator.calculate_usable_hosts(23) == 510
    # Subnet 4: /24 -> 254 usable hosts (>= 200)
    assert CIDRSubnetCalculator.calculate_usable_hosts(24) == 254
    # Subnet 3: /25 -> 126 usable hosts (>= 120)
    assert CIDRSubnetCalculator.calculate_usable_hosts(25) == 126
    # Subnet 1: /26 -> 62 usable hosts (>= 50)
    assert CIDRSubnetCalculator.calculate_usable_hosts(26) == 62


class BitwiseNetworkSubnetChecker:
    @staticmethod
    def ip_to_int(ip_str: str) -> int:
        octets = [int(x) for x in ip_str.split(".")]
        return (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]

    @staticmethod
    def mask_from_prefix(prefix: int) -> int:
        if prefix == 0:
            return 0
        return ((1 << 32) - 1) ^ ((1 << (32 - prefix)) - 1)

    @classmethod
    def is_in_same_subnet(cls, ip1: str, ip2: str, prefix: int) -> bool:
        mask = cls.mask_from_prefix(prefix)
        int1 = cls.ip_to_int(ip1)
        int2 = cls.ip_to_int(ip2)
        return (int1 & mask) == (int2 & mask)


def test_bitwise_network_subnet_checker():
    # In same subnet 192.168.1.0/24
    assert BitwiseNetworkSubnetChecker.is_in_same_subnet("192.168.1.10", "192.168.1.50", 24) is True
    # Different subnet
    assert BitwiseNetworkSubnetChecker.is_in_same_subnet("192.168.1.10", "192.168.2.10", 24) is False
    # In same subnet 10.0.0.0/16
    assert BitwiseNetworkSubnetChecker.is_in_same_subnet("10.0.5.1", "10.0.99.200", 16) is True
    # Different /24 in 10.0.x.x
    assert BitwiseNetworkSubnetChecker.is_in_same_subnet("10.0.5.1", "10.0.99.200", 24) is False


class TracerouteSimulator:
    def __init__(self, route_hops: List[str]):
        self.route_hops = route_hops  # list of router IPs ending with target IP

    def trace(self, max_hops: int = 30) -> List[Dict[str, Any]]:
        results = []
        for ttl in range(1, max_hops + 1):
            hop_idx = ttl - 1
            if hop_idx < len(self.route_hops):
                router_ip = self.route_hops[hop_idx]
                is_target = (hop_idx == len(self.route_hops) - 1)
                results.append({
                    "ttl": ttl,
                    "hop_ip": router_ip,
                    "icmp_type": "EchoReply" if is_target else "TimeExceeded",
                    "reached": is_target
                })
                if is_target:
                    break
            else:
                break
        return results


def test_traceroute_simulator():
    hops = ["192.168.1.1", "10.20.0.1", "203.0.113.1", "104.18.32.7"]
    tracer = TracerouteSimulator(hops)
    res = tracer.trace(max_hops=10)
    assert len(res) == 4
    assert res[0]["ttl"] == 1
    assert res[0]["hop_ip"] == "192.168.1.1"
    assert res[0]["icmp_type"] == "TimeExceeded"
    assert res[0]["reached"] is False

    assert res[3]["ttl"] == 4
    assert res[3]["hop_ip"] == "104.18.32.7"
    assert res[3]["icmp_type"] == "EchoReply"
    assert res[3]["reached"] is True


class TCPFiniteStateMachineSimulator:
    VALID_TRANSITIONS = {
        ("CLOSED", "ACTIVE_OPEN"): "SYN_SENT",
        ("CLOSED", "PASSIVE_OPEN"): "LISTEN",
        ("LISTEN", "RECV_SYN"): "SYN_RCVD",
        ("SYN_SENT", "RECV_SYN_ACK"): "ESTABLISHED",
        ("SYN_RCVD", "RECV_ACK"): "ESTABLISHED",
        ("ESTABLISHED", "CLOSE_ACTIVE"): "FIN_WAIT_1",
        ("ESTABLISHED", "RECV_FIN"): "CLOSE_WAIT",
        ("FIN_WAIT_1", "RECV_ACK"): "FIN_WAIT_2",
        ("FIN_WAIT_2", "RECV_FIN"): "TIME_WAIT",
        ("CLOSE_WAIT", "CLOSE_PASSIVE"): "LAST_ACK",
        ("LAST_ACK", "RECV_ACK"): "CLOSED",
        ("TIME_WAIT", "TIMEOUT_2MSL"): "CLOSED"
    }

    def __init__(self, initial_state: str = "CLOSED"):
        self.state = initial_state

    def trigger(self, event: str) -> str:
        key = (self.state, event)
        if key not in self.VALID_TRANSITIONS:
            raise ValueError(f"Khong the chuyen trang thai tu {self.state} qua su kien {event}")
        self.state = self.VALID_TRANSITIONS[key]
        return self.state


def test_tcp_finite_state_machine_simulator():
    # Client Active Handshake & Close
    fsm_client = TCPFiniteStateMachineSimulator("CLOSED")
    assert fsm_client.trigger("ACTIVE_OPEN") == "SYN_SENT"
    assert fsm_client.trigger("RECV_SYN_ACK") == "ESTABLISHED"
    assert fsm_client.trigger("CLOSE_ACTIVE") == "FIN_WAIT_1"
    assert fsm_client.trigger("RECV_ACK") == "FIN_WAIT_2"
    assert fsm_client.trigger("RECV_FIN") == "TIME_WAIT"
    assert fsm_client.trigger("TIMEOUT_2MSL") == "CLOSED"

    # Server Passive Handshake & Close
    fsm_server = TCPFiniteStateMachineSimulator("CLOSED")
    assert fsm_server.trigger("PASSIVE_OPEN") == "LISTEN"
    assert fsm_server.trigger("RECV_SYN") == "SYN_RCVD"
    assert fsm_server.trigger("RECV_ACK") == "ESTABLISHED"
    assert fsm_server.trigger("RECV_FIN") == "CLOSE_WAIT"
    assert fsm_server.trigger("CLOSE_PASSIVE") == "LAST_ACK"
    assert fsm_server.trigger("RECV_ACK") == "CLOSED"



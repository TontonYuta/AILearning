"""Unit test xác thực toàn bộ mã nguồn ví dụ trong Giai đoạn 3: LLM Engineering."""

import pytest
import json
import time
from typing import Generator, Dict, Any, Callable

# 1. Test RobustLLMClient
class RobustLLMClient:
    def __init__(self, api_key: str, timeout_seconds: float = 2.0):
        if not api_key:
            raise ValueError("API Key khong hop le")
        self.api_key = api_key
        self.timeout = timeout_seconds

    def stream_chat(self, prompt: str) -> Generator[Dict[str, Any], None, None]:
        if not prompt.strip():
            raise ValueError("Prompt khong duoc chua khoang trang rong")
        start_time = time.perf_counter()
        words = prompt.split()
        for idx, word in enumerate(words):
            if time.perf_counter() - start_time > self.timeout:
                raise TimeoutError("LLM API vuot qua nguong timeout")
            yield {"index": idx, "token": word + " "}

def test_robust_llm_client():
    client = RobustLLMClient(api_key="test_key")
    tokens = list(client.stream_chat("Kien truc Transformer"))
    assert len(tokens) == 3
    assert tokens[0]["token"] == "Kien "

    with pytest.raises(ValueError):
        RobustLLMClient(api_key="")

    with pytest.raises(ValueError):
        list(client.stream_chat("   "))

# 2. Test ToolDispatcher
class ToolDispatcher:
    def __init__(self):
        self.registry: Dict[str, Callable] = {}

    def register(self, name: str, func: Callable):
        self.registry[name] = func

    def dispatch(self, tool_call_json: str) -> str:
        call = json.loads(tool_call_json)
        tool_name = call.get("name")
        arguments = call.get("arguments", {})
        
        if tool_name not in self.registry:
            return json.dumps({"error": f"Cong cu '{tool_name}' khong ton tai"})
            
        handler = self.registry[tool_name]
        try:
            result = handler(**arguments)
            return json.dumps({"status": "success", "data": result})
        except Exception as e:
            return json.dumps({"status": "error", "message": str(e)})

def test_tool_dispatcher():
    dispatcher = ToolDispatcher()
    
    def mock_ping(host: str) -> str:
        return f"Host {host} is UP"

    dispatcher.register("ping", mock_ping)

    # Test success
    call_json = json.dumps({"name": "ping", "arguments": {"host": "1.1.1.1"}})
    res = json.loads(dispatcher.dispatch(call_json))
    assert res["status"] == "success"
    assert "1.1.1.1 is UP" in res["data"]

    # Test tool khong ton tai
    missing_call = json.dumps({"name": "unknown_tool", "arguments": {}})
    res_missing = json.loads(dispatcher.dispatch(missing_call))
    assert "error" in res_missing

# 3. Test KV Cache Size Calculator
def calculate_kv_cache_bytes(n_layers: int, n_heads: int, d_head: int, seq_len: int, bytes_per_elem: int = 2) -> int:
    return 2 * n_layers * n_heads * d_head * seq_len * bytes_per_elem

def test_kv_cache_calculation():
    # Llama 3 8B: 32 layers, 32 heads, d_head 128, seq_len 4096, FP16 (2 bytes)
    # 2 * 32 * 32 * 128 * 4096 * 2 = 2,147,483,648 bytes (2 GB)
    bytes_calc = calculate_kv_cache_bytes(32, 32, 128, 4096, 2)
    assert bytes_calc == 2 * 1024 * 1024 * 1024

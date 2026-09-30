"""Unit test xác thực tính chạy được của mã nguồn mẫu trong Chapter 0."""

import pytest

def mock_inference_pipeline(prompt: str):
    """Mã nguồn mẫu từ Chapter 0."""
    import time
    start_time = time.perf_counter()
    
    if not prompt or len(prompt.strip()) == 0:
        raise ValueError("Prompt khong duoc de trong")
        
    token_count = len(prompt.split()) + 20
    elapsed_time = time.perf_counter() - start_time
    
    return {
        "status": "success",
        "tokens_generated": token_count,
        "latency_seconds": round(elapsed_time, 4)
    }

def test_mock_inference_success():
    res = mock_inference_pipeline("Hello AI Engineer")
    assert res["status"] == "success"
    assert res["tokens_generated"] == 23
    assert res["latency_seconds"] >= 0.0

def test_mock_inference_empty_prompt_raises():
    with pytest.raises(ValueError, match="Prompt khong duoc de trong"):
        mock_inference_pipeline("   ")

def test_execute_inference_benchmark():
    import time
    from dataclasses import dataclass
    
    @dataclass
    class InferenceMetrics:
        prompt_tokens: int
        output_tokens: int
        ttft_seconds: float
        total_latency: float
        cost_usd: float

    def execute_inference_benchmark(prompt: str) -> InferenceMetrics:
        if not prompt or len(prompt.strip()) == 0:
            raise ValueError("Prompt dau vao khong duoc de trong")
        t_start = time.perf_counter()
        time.sleep(0.001)
        ttft = time.perf_counter() - t_start
        total_time = time.perf_counter() - t_start
        in_tok = len(prompt.split())
        out_tok = 50
        cost = (in_tok * 2.5 / 1e6) + (out_tok * 10.0 / 1e6)
        return InferenceMetrics(
            prompt_tokens=in_tok,
            output_tokens=out_tok,
            ttft_seconds=round(ttft, 4),
            total_latency=round(total_time, 4),
            cost_usd=round(cost, 6)
        )

    res = execute_inference_benchmark("Kien truc he thong AI")
    assert res.prompt_tokens == 5
    assert res.output_tokens == 50
    assert res.cost_usd > 0
    with pytest.raises(ValueError):
        execute_inference_benchmark("")

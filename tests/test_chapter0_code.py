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

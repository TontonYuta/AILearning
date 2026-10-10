"""
test_module10.py — Bộ kiểm thử tự động cho LoRA Engine và Local OpenAI Serving.
"""
import pytest
import numpy as np
from modules.module10_local_serving_lora.lora_engine import LoRAAdapter, DynamicLoRALinear
from modules.module10_local_serving_lora.local_server import LocalInferenceEngine

def test_lora_delta_weight_math():
    in_dim, out_dim = 32, 16
    rank, alpha = 4, 16.0
    adapter = LoRAAdapter("test_adapter", in_features=in_dim, out_features=out_dim, rank=rank, alpha=alpha)

    delta = adapter.get_delta_weight()
    assert delta.shape == (out_dim, in_dim)
    assert adapter.scaling == 4.0

def test_base_weights_unmodified():
    in_dim, out_dim = 16, 8
    linear = DynamicLoRALinear(in_features=in_dim, out_features=out_dim)
    original_w0 = np.copy(linear.W0)

    adapter = LoRAAdapter("adapter_1", in_features=in_dim, out_features=out_dim, rank=4, alpha=8.0)
    linear.add_adapter(adapter)
    linear.set_active_adapter("adapter_1")

    x = np.ones((1, in_dim), dtype=np.float32)
    _ = linear.forward(x)

    # Đảm bảo trọng số nền tảng W0 không bị biến đổi
    np.testing.assert_array_equal(linear.W0, original_w0)

def test_dynamic_adapter_switching():
    in_dim, out_dim = 16, 8
    linear = DynamicLoRALinear(in_features=in_dim, out_features=out_dim)

    ad1 = LoRAAdapter("ad1", in_features=in_dim, out_features=out_dim, rank=2)
    ad1.B.fill(0.1)
    ad2 = LoRAAdapter("ad2", in_features=in_dim, out_features=out_dim, rank=2)
    ad2.B.fill(0.5)

    linear.add_adapter(ad1)
    linear.add_adapter(ad2)

    x = np.ones((1, in_dim), dtype=np.float32)

    linear.set_active_adapter("ad1")
    out1 = linear.forward(x)

    linear.set_active_adapter("ad2")
    out2 = linear.forward(x)

    assert not np.allclose(out1, out2)

def test_openai_compatible_response_structure():
    engine = LocalInferenceEngine()
    res = engine.chat_completion(
        messages=[{"role": "user", "content": "Xin chào"}],
        model="meta-llama-3.1-8b",
        adapter_id="finance-classifier",
        stream=False
    )

    assert "id" in res
    assert res["object"] == "chat.completion"
    assert len(res["choices"]) == 1
    assert "FINANCE" in res["choices"][0]["message"]["content"]
    assert "usage" in res

def test_sse_streaming_generator():
    engine = LocalInferenceEngine()
    stream = engine.chat_completion(
        messages=[{"role": "user", "content": "Test stream"}],
        model="meta-llama-3.1-8b",
        stream=True
    )
    chunks = list(stream)
    assert len(chunks) > 1
    assert chunks[-1] == "data: [DONE]\n\n"

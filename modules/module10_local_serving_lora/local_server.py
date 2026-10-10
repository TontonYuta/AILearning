"""
local_server.py — Cổng phục vụ mô hình cục bộ tương thích chuẩn OpenAI API.
"""
import time
import json
from typing import Generator, Dict, Any, Optional

class LocalInferenceEngine:
    def __init__(self):
        self.available_models = ["meta-llama-3.1-8b", "qwen-2.5-7b"]
        self.available_adapters = ["finance-classifier", "legal-contract-extractor"]

    def chat_completion(
        self,
        messages: list,
        model: str = "meta-llama-3.1-8b",
        adapter_id: Optional[str] = None,
        stream: bool = False
    ) -> Any:
        if model not in self.available_models:
            raise ValueError(f"Mô hình '{model}' không khả dụng.")

        user_content = messages[-1]["content"] if messages else ""
        
        # Mô phỏng nội dung sinh theo từng Adapter
        if adapter_id == "finance-classifier":
            response_text = (
                f"[ADAPTER: FINANCE] Phân loại giao dịch thành công: Loại hình='Chi phí R&D phần mềm AI', "
                f"Độ tin cậy=99.2%, Mã ngân sách='BUDGET-2026-IT'."
            )
        elif adapter_id == "legal-contract-extractor":
            response_text = (
                f"[ADAPTER: LEGAL] Trích xuất hợp đồng: Điều khoản bảo mật có hiệu lực 5 năm kể từ ngày ký, "
                f"Luật áp dụng='Pháp luật Việt Nam'."
            )
        else:
            response_text = f"[BASE MODEL] Tôi là mô hình nền tảng {model}, sẵn sàng xử lý yêu cầu: '{user_content}'."

        if stream:
            return self._stream_generator(response_text)

        return {
            "id": f"chatcmpl-{int(time.time()*1000)}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": model,
            "adapter": adapter_id,
            "choices": [
                {
                    "index": 0,
                    "message": {"role": "assistant", "content": response_text},
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": len(user_content.split()),
                "completion_tokens": len(response_text.split()),
                "total_tokens": len(user_content.split()) + len(response_text.split())
            }
        }

    def _stream_generator(self, text: str) -> Generator[str, None, None]:
        tokens = text.split(" ")
        for i, token in enumerate(tokens):
            chunk = {
                "id": "chatcmpl-stream",
                "object": "chat.completion.chunk",
                "created": int(time.time()),
                "choices": [
                    {
                        "index": 0,
                        "delta": {"content": token + (" " if i < len(tokens) - 1 else "")},
                        "finish_reason": None
                    }
                ]
            }
            yield f"data: {json.dumps(chunk, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"

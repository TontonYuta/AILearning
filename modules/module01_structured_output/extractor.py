"""
extractor.py — Bộ trích xuất dữ liệu có cấu trúc với cơ chế Self-Healing Loop.
"""
import json
import re
from typing import Type, TypeVar, Optional, Callable, Dict, Any
from pydantic import BaseModel, ValidationError

T = TypeVar("T", bound=BaseModel)

class ExtractionError(Exception):
    """Lỗi xảy ra khi không thể trích xuất hoặc tự sửa dữ liệu sau số lần thử tối đa."""
    pass

class StructuredExtractor:
    def __init__(
        self,
        llm_caller: Optional[Callable[[str], str]] = None,
        max_retries: int = 3
    ):
        """
        Khởi tạo extractor.
        :param llm_caller: Hàm nhận prompt chuỗi và trả về phản hồi chuỗi từ LLM.
        :param max_retries: Số lần thử lại tối đa khi gặp lỗi schema validation.
        """
        self.llm_caller = llm_caller or self._default_mock_llm
        self.max_retries = max_retries

    @staticmethod
    def _clean_json_string(raw_text: str) -> str:
        """Loại bỏ markdown code blocks hoặc ký tự thừa xung quanh JSON."""
        raw_text = raw_text.strip()
        # Tìm block ```json ... ``` hoặc ``` ... ```
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw_text)
        if match:
            return match.group(1).strip()
        return raw_text

    def extract(
        self,
        text: str,
        target_schema: Type[T],
        system_instruction: Optional[str] = None
    ) -> T:
        """
        Trích xuất văn bản thành đối tượng Pydantic theo đúng target_schema.
        Tự động kích hoạt cơ chế Self-Healing nếu phát hiện lỗi validation.
        """
        json_schema_str = json.dumps(target_schema.model_json_schema(), indent=2, ensure_ascii=False)
        base_prompt = (
            f"HÃY TRÍCH XUẤT THÔNG TIN TỪ VĂN BẢN SAU THEO ĐÚNG SCHEMA JSON ĐƯỢC CẤP:\n\n"
            f"VĂN BẢN ĐẦU VÀO:\n\"\"\"{text}\"\"\"\n\n"
            f"YÊU CẦU SCHEMA (JSON Schema):\n{json_schema_str}\n\n"
            f"CHỈ TRẢ VỀ DUY NHẤT CHUỖI JSON HỢP LỆ, TUYỆT ĐỐI KHÔNG GIẢI THÍCH GÌ THÊM."
        )

        current_prompt = base_prompt
        last_error_msg = ""

        for attempt in range(1, self.max_retries + 1):
            raw_response = self.llm_caller(current_prompt)
            clean_json = self._clean_json_string(raw_response)

            try:
                data_dict = json.loads(clean_json)
                validated_obj = target_schema.model_validate(data_dict)
                return validated_obj
            except (json.JSONDecodeError, ValidationError) as e:
                last_error_msg = str(e)
                # Tạo Self-Healing Prompt để yêu cầu LLM sửa đúng chỗ sai
                current_prompt = (
                    f"{base_prompt}\n\n"
                    f"--- CẢNH BÁO LỖI Ở LẦN THỬ TRƯỚC (Lần {attempt}/{self.max_retries}) ---\n"
                    f"Chuỗi JSON bạn vừa sinh ra bị lỗi sau:\n{last_error_msg}\n\n"
                    f"Chuỗi JSON sai: {clean_json}\n\n"
                    f"HÃY SỬA LẠI VÀ CHỈ TRẢ VỀ DUY NHẤT JSON ĐÃ ĐƯỢC CHỈNH SỬA CHÍNH XÁC."
                )

        raise ExtractionError(
            f"Thất bại khi trích xuất dữ liệu sau {self.max_retries} lần thử. Lỗi cuối cùng: {last_error_msg}"
        )

    @staticmethod
    def _default_mock_llm(prompt: str) -> str:
        """Mock LLM hỗ trợ chạy offline / test nhanh khi chưa có API key."""
        if "HÓA ĐƠN" in prompt or "invoice" in prompt.lower():
            return json.dumps({
                "invoice_id": "INV-2026-001",
                "vendor_name": "Công ty TNHH Giải Pháp AI Việt Nam",
                "vendor_tax_id": "0109876543",
                "issue_date": "2026-10-10",
                "currency": "VND",
                "items": [
                    {
                        "description": "Bản quyền dịch vụ AI Inference Enterprise",
                        "quantity": 1,
                        "unit_price": 25000000,
                        "total_amount": 25000000
                    },
                    {
                        "description": "Gói bảo trì hệ thống RAG & Tracing 1 tháng",
                        "quantity": 1,
                        "unit_price": 5000000,
                        "total_amount": 5000000
                    }
                ],
                "subtotal": 30000000,
                "tax_amount": 3000000,
                "total_amount": 33000000
            }, ensure_ascii=False)
        else:
            return json.dumps({
                "customer_id": "CUST-9921",
                "raw_message": "Hệ thống báo lỗi 502 khi gọi API, tôi cần hỗ trợ gấp!",
                "detected_intent": "technical_support",
                "urgency_score": 5,
                "key_entities": ["API", "502"],
                "requires_human_agent": True
            })

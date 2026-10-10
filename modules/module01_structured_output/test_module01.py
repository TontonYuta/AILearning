"""
test_module01.py — Bộ kiểm thử tự động xác thực cơ chế Structured Output & Self-Healing.
"""
import pytest
from datetime import date
from pydantic import ValidationError

from modules.module01_structured_output.schema import (
    InvoiceData,
    InvoiceItem,
    Currency,
    CustomerInquiry,
    IntentCategory
)
from modules.module01_structured_output.extractor import (
    StructuredExtractor,
    ExtractionError
)

def test_invoice_schema_validation_success():
    """Kiểm tra schema hợp lệ đầy đủ các ràng buộc."""
    invoice = InvoiceData(
        invoice_id="INV-001",
        vendor_name="Tech Corp",
        vendor_tax_id="0109876543",
        issue_date=date(2026, 10, 10),
        currency=Currency.VND,
        items=[
            InvoiceItem(description="GPU Cluster", quantity=2, unit_price=1000, total_amount=2000),
            InvoiceItem(description="Storage 10TB", quantity=1, unit_price=500, total_amount=500),
        ],
        subtotal=2500,
        tax_amount=250,
        total_amount=2750
    )
    assert invoice.total_amount == 2750
    assert len(invoice.items) == 2
    assert invoice.vendor_tax_id == "0109876543"

def test_invalid_tax_id_rejected():
    """Kiểm tra mã số thuế không hợp lệ bị từ chối chính xác."""
    with pytest.raises(ValidationError) as exc_info:
        InvoiceData(
            invoice_id="INV-002",
            vendor_name="Invalid Corp",
            vendor_tax_id="12345",  # Chỉ có 5 số -> không hợp lệ
            issue_date=date(2026, 10, 10),
            items=[InvoiceItem(description="Item", quantity=1, unit_price=100, total_amount=100)],
            subtotal=100,
            tax_amount=10,
            total_amount=110
        )
    assert "Mã số thuế" in str(exc_info.value)

def test_self_healing_retry_mechanism():
    """
    Kiểm tra cơ chế Self-Healing:
    Lần 1 trả về JSON bọc markdown sai định dạng hoặc thiếu trường.
    Lần 2 trả về JSON chuẩn xác -> Hệ thống phải tự phục hồi thành công.
    """
    call_count = 0

    def mock_failing_then_healing_llm(prompt: str) -> str:
        nonlocal call_count
        call_count += 1
        if call_count == 1:
            # Lần đầu: trả về text sai cấu trúc
            return "Dưới đây là kết quả của bạn: { \"invoice_id\": \"INV-ERR\" }"
        else:
            # Lần 2: LLM sau khi đọc prompt cảnh báo lỗi đã tự sửa chuẩn xác
            return """```json
            {
                "customer_id": "CUST-HEALED",
                "raw_message": "Tôi cần tư vấn thêm",
                "detected_intent": "sales",
                "urgency_score": 2,
                "key_entities": ["tư vấn"],
                "requires_human_agent": false
            }
            ```"""

    extractor = StructuredExtractor(llm_caller=mock_failing_then_healing_llm, max_retries=3)
    result = extractor.extract("Xin tư vấn", CustomerInquiry)

    assert call_count == 2
    assert result.customer_id == "CUST-HEALED"
    assert result.detected_intent == IntentCategory.SALES
    assert result.requires_human_agent is False

def test_max_retries_exhaustion_raises_error():
    """Kiểm tra khi LLM liên tục trả về dữ liệu rác vượt quá max_retries thì ném ExtractionError."""
    def always_broken_llm(prompt: str) -> str:
        return "Xin lỗi tôi không hiểu bạn muốn gì"

    extractor = StructuredExtractor(llm_caller=always_broken_llm, max_retries=2)
    with pytest.raises(ExtractionError):
        extractor.extract("Input bất kỳ", CustomerInquiry)

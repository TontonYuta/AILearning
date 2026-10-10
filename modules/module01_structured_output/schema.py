"""
schema.py — Định nghĩa các cấu trúc dữ liệu doanh nghiệp chuẩn Pydantic V2.
"""
from datetime import date
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator, model_validator

class Currency(str, Enum):
    VND = "VND"
    USD = "USD"
    EUR = "EUR"

class InvoiceItem(BaseModel):
    description: str = Field(..., description="Tên hoặc mô tả sản phẩm / dịch vụ")
    quantity: float = Field(..., gt=0, description="Số lượng, phải lớn hơn 0")
    unit_price: float = Field(..., ge=0, description="Đơn giá của từng đơn vị sản phẩm")
    total_amount: float = Field(..., ge=0, description="Thành tiền = quantity * unit_price")

    @model_validator(mode="after")
    def verify_item_total(self) -> "InvoiceItem":
        expected = round(self.quantity * self.unit_price, 2)
        # Cho phép sai số làm tròn 0.05
        if abs(self.total_amount - expected) > 0.05:
            # Tự động đồng bộ nếu sai lệch nhỏ
            self.total_amount = expected
        return self

class InvoiceData(BaseModel):
    invoice_id: str = Field(..., description="Số hóa đơn hoặc mã chứng từ")
    vendor_name: str = Field(..., description="Tên đơn vị bán lẻ / nhà cung cấp")
    vendor_tax_id: Optional[str] = Field(None, description="Mã số thuế doanh nghiệp (10 hoặc 13 chữ số)")
    issue_date: date = Field(..., description="Ngày phát hành hóa đơn (YYYY-MM-DD)")
    currency: Currency = Field(default=Currency.VND, description="Đơn vị tiền tệ")
    items: List[InvoiceItem] = Field(..., min_length=1, description="Danh sách các mặt hàng trên hóa đơn")
    subtotal: float = Field(..., ge=0, description="Tổng tiền trước thuế")
    tax_amount: float = Field(..., ge=0, description="Tiền thuế GTGT")
    total_amount: float = Field(..., gt=0, description="Tổng tiền thanh toán cuối cùng")

    @field_validator("vendor_tax_id")
    @classmethod
    def validate_tax_id(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.replace("-", "").strip()
        if not (len(cleaned) in (10, 13) and cleaned.isdigit()):
            raise ValueError(f"Mã số thuế '{v}' không hợp lệ (phải gồm 10 hoặc 13 chữ số)")
        return cleaned

    @model_validator(mode="after")
    def verify_invoice_totals(self) -> "InvoiceData":
        calculated_subtotal = round(sum(item.total_amount for item in self.items), 2)
        if abs(self.subtotal - calculated_subtotal) > 1.0:
            self.subtotal = calculated_subtotal
        
        calculated_total = round(self.subtotal + self.tax_amount, 2)
        if abs(self.total_amount - calculated_total) > 1.0:
            self.total_amount = calculated_total
        return self

class IntentCategory(str, Enum):
    BILLING = "billing"
    TECHNICAL_SUPPORT = "technical_support"
    SALES = "sales"
    COMPLAINT = "complaint"

class CustomerInquiry(BaseModel):
    customer_id: str = Field(..., description="Mã định danh khách hàng")
    raw_message: str = Field(..., description="Nội dung thắc mắc gốc")
    detected_intent: IntentCategory = Field(..., description="Phân loại ý định chính")
    urgency_score: int = Field(..., ge=1, le=5, description="Mức độ khẩn cấp từ 1 (thấp) đến 5 (rất khẩn cấp)")
    key_entities: List[str] = Field(default_factory=list, description="Các thực thể trích xuất (tên sản phẩm, lỗi, số tiền)")
    requires_human_agent: bool = Field(..., description="Có cần chuyển tiếp sang nhân viên chăm sóc khách hàng không")

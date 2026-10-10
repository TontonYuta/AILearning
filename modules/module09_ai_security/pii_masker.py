"""
pii_masker.py — Bộ lọc và ẩn danh hóa thông tin định danh cá nhân (PII Masking).
"""
import re
from typing import Tuple, Dict, List

class PIIMasker:
    """
    Tự động quét và che giấu các thông tin nhạy cảm:
    - Email
    - Số điện thoại Việt Nam
    - Số thẻ tín dụng / ghi nợ
    - Số Căn cước công dân (CCCD - 12 chữ số)
    """
    PATTERNS = {
        "EMAIL": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
        "PHONE": r"(?:\+84|0)(?:3|5|7|8|9)[0-9]{8}\b",
        "CREDIT_CARD": r"\b(?:\d{4}[-\s]?){3}\d{4}\b",
        "NATIONAL_ID": r"\b\d{12}\b",
    }

    def mask(self, text: str) -> Tuple[str, Dict[str, List[str]]]:
        masked_text = text
        detected: Dict[str, List[str]] = {}

        for pii_type, pattern in self.PATTERNS.items():
            matches = re.findall(pattern, masked_text)
            if matches:
                detected[pii_type] = matches
                masked_text = re.sub(pattern, f"[REDACTED_{pii_type}]", masked_text)

        return masked_text, detected

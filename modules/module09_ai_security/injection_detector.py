"""
injection_detector.py — Phát hiện tấn công Prompt Injection và Jailbreak.
"""
import re
from typing import Tuple, List

class PromptInjectionDetector:
    """
    Phát hiện các mẫu câu chiếm quyền điều khiển context, vượt rào bảo vệ (Jailbreak),
    hoặc ép model tiết lộ System Prompt.
    """
    INJECTION_SIGNATURES = [
        # Tiếng Anh
        r"\bignore\s+(?:all\s+)?previous\s+instructions\b",
        r"\bdisregard\s+(?:all\s+)?prior\s+instructions\b",
        r"\bforget\s+(?:all\s+)?rules\b",
        r"\breveal\s+(?:your\s+)?system\s+prompt\b",
        r"\bprint\s+(?:the\s+)?prompt\s+above\b",
        r"\byou\s+are\s+now\s+in\s+developer\s+mode\b",
        r"\bdan\s+mode\b",
        r"\bjailbreak\b",
        # Tiếng Việt
        r"bỏ\s+qua\s+(?:toàn\s+bộ\s+)?(?:hướng\s+dẫn|quy\s+tắc)\s+trước",
        r"quên\s+(?:hết\s+)?các\s+quy\s+tắc\s+đi",
        r"in\s+ra\s+(?:toàn\s+bộ\s+)?system\s+prompt",
        r"tiết\s+lộ\s+lời\s+nhắc\s+hệ\s+thống",
        r"chế\s+độ\s+(?:nhà\s+phát\s+triển|bẻ\s+khóa)",
    ]

    def detect(self, text: str) -> Tuple[bool, float, List[str]]:
        text_lower = text.lower()
        matched = []

        for pattern in self.INJECTION_SIGNATURES:
            if re.search(pattern, text_lower):
                matched.append(pattern)

        is_injection = len(matched) > 0
        risk_score = min(len(matched) * 0.5, 1.0) if is_injection else 0.0

        return is_injection, round(risk_score, 2), matched

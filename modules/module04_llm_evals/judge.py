"""
judge.py — Bộ đánh giá LLM-as-a-Judge sử dụng Rubric chuẩn hóa và Pydantic V2.
"""
import re
from typing import Dict, Any, Optional, Callable
from pydantic import BaseModel, Field

class JudgeEvaluation(BaseModel):
    score: int = Field(..., ge=1, le=5, description="Thang điểm từ 1 (rất kém/ảo giác) đến 5 (xuất sắc)")
    passed: bool = Field(..., description="Đạt chuẩn chất lượng (>= 4 điểm)")
    reasoning: str = Field(..., description="Phân tích chi tiết lý do chấm điểm của giám khảo")
    has_hallucination: bool = Field(..., description="Có phát hiện ảo giác hoặc thông tin bịa đặt không")
    addresses_question: bool = Field(..., description="Có trả lời đúng trọng tâm câu hỏi không")

class LLMJudge:
    """
    Giám khảo AI đánh giá câu trả lời dựa trên Rubric chuẩn hóa.
    """
    def __init__(self, llm_caller: Optional[Callable[[str], str]] = None):
        self.llm_caller = llm_caller or self._default_mock_judge

    def evaluate(
        self,
        question: str,
        context: str,
        answer: str
    ) -> JudgeEvaluation:
        rubric_prompt = (
            f"BẠN LÀ GIÁM KHẢO CHUYÊN GIA ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG AI.\n"
            f"Hãy đánh giá câu trả lời sau theo rubric nghiêm ngặt:\n\n"
            f"- 5 điểm: Trả lời chính xác 100%, dựa hoàn toàn vào ngữ cảnh, trúng câu hỏi, không ảo giác.\n"
            f"- 4 điểm: Trả lời đúng, không ảo giác, nhưng diễn đạt hơi dài hoặc thiếu 1 ý nhỏ.\n"
            f"- 3 điểm: Trả lời một phần đúng, nhưng có chi tiết chưa rõ ràng trong ngữ cảnh.\n"
            f"- 2 điểm: Trả lời lạc đề hoặc suy diễn thông tin ngoài ngữ cảnh.\n"
            f"- 1 điểm: Ảo giác nghiêm trọng hoặc bịa đặt sai sự thật hoàn toàn.\n\n"
            f"DỮ LIỆU ĐẦU VÀO:\n"
            f"Ngữ cảnh: {context}\n"
            f"Câu hỏi: {question}\n"
            f"Câu trả lời: {answer}\n"
        )

        raw = self.llm_caller(rubric_prompt)
        # Parse kết quả nếu có JSON hợp lệ
        try:
            import json
            data = json.loads(raw)
            return JudgeEvaluation.model_validate(data)
        except Exception:
            # Fallback nếu dùng mock logic
            return self._heuristic_judge(question, context, answer)

    @staticmethod
    def _heuristic_judge(question: str, context: str, answer: str) -> JudgeEvaluation:
        context_words = set(re.findall(r"[\w\-]+", context.lower()))
        answer_words = re.findall(r"[\w\-]+", answer.lower())
        q_words = set(re.findall(r"[\w\-]+", question.lower()))

        meaningful_words = [w for w in answer_words if len(w) >= 2]
        unsupported = [w for w in meaningful_words if w not in context_words and w not in q_words]
        unsupported_ratio = len(unsupported) / len(meaningful_words) if meaningful_words else 0.0

        # Nếu hơn 35% từ ngữ trong câu trả lời hoàn toàn không có trong context hay câu hỏi -> Ảo giác
        has_hallucination = unsupported_ratio > 0.35

        addresses_q = any(w in answer.lower() for w in q_words if len(w) > 3)

        if has_hallucination:
            score = 1
            passed = False
            reasoning = f"Phát hiện tỷ lệ lớn thông tin bịa đặt/ảo giác ({unsupported_ratio:.1%} từ ngữ không nằm trong tài liệu)."
        elif not addresses_q:
            score = 2
            passed = False
            reasoning = "Câu trả lời không giải quyết trọng tâm câu hỏi của người dùng."
        else:
            score = 5
            passed = True
            reasoning = "Câu trả lời bám sát ngữ cảnh, chuẩn xác, không phát hiện ảo giác."

        return JudgeEvaluation(
            score=score,
            passed=passed,
            reasoning=reasoning,
            has_hallucination=has_hallucination,
            addresses_question=addresses_q
        )

    def _default_mock_judge(self, prompt: str) -> str:
        return ""

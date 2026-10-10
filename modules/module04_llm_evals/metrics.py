"""
metrics.py — Các chỉ số định lượng đánh giá chất lượng mô hình LLM & RAG.
"""
import re
from typing import List, Dict, Tuple, Any

def extract_statements(text: str) -> List[str]:
    """Tách văn bản thành các câu khẳng định độc lập."""
    sentences = re.split(r"[.!?\n]+", text)
    cleaned = [s.strip() for s in sentences if len(s.strip()) > 10]
    return cleaned

def compute_faithfulness(answer: str, context: str) -> Tuple[float, List[Dict[str, Any]]]:
    """
    Tính chỉ số Faithfulness (0.0 - 1.0):
    Đo lường tỷ lệ các câu khẳng định trong câu trả lời được chứng minh bởi ngữ cảnh.
    Tỷ lệ = (Số khẳng định được ngữ cảnh chứng thực) / (Tổng số khẳng định)
    """
    statements = extract_statements(answer)
    if not statements:
        return 1.0, []

    context_lower = context.lower()
    details = []
    supported_count = 0

    for stmt in statements:
        words = [w.lower() for w in re.findall(r"[\w\-]+", stmt) if len(w) > 2]
        if not words:
            continue
        # Kiểm tra tỷ lệ từ khóa của câu khẳng định xuất hiện trong ngữ cảnh
        matched = sum(1 for w in words if w in context_lower)
        coverage = matched / len(words)
        is_supported = coverage >= 0.6  # Ít nhất 60% từ khóa cốt lõi xuất hiện

        if is_supported:
            supported_count += 1

        details.append({
            "statement": stmt,
            "supported": is_supported,
            "keyword_overlap": round(coverage, 2)
        })

    score = supported_count / len(statements) if statements else 1.0
    return round(score, 3), details

def compute_answer_relevance(question: str, answer: str) -> float:
    """
    Tính chỉ số Answer Relevance (0.0 - 1.0):
    Đo lường mức độ câu trả lời giải quyết đúng trọng tâm câu hỏi của người dùng.
    """
    q_words = set(w.lower() for w in re.findall(r"[\w\-]+", question) if len(w) > 2)
    a_words = set(w.lower() for w in re.findall(r"[\w\-]+", answer) if len(w) > 2)

    if not q_words or not a_words:
        return 0.0

    overlap = len(q_words.intersection(a_words))
    # Tỷ lệ từ khóa câu hỏi được đề cập trong câu trả lời
    relevance = min(overlap / (len(q_words) * 0.7), 1.0)
    return round(relevance, 3)

def compute_ground_truth_similarity(actual: str, expected: str) -> float:
    """
    So sánh độ tương đồng từ vựng và ngữ nghĩa với câu trả lời chuẩn mực (Ground Truth).
    """
    act_words = set(re.findall(r"[\w\-]+", actual.lower()))
    exp_words = set(re.findall(r"[\w\-]+", expected.lower()))

    if not exp_words:
        return 0.0

    intersection = len(act_words.intersection(exp_words))
    union = len(act_words.union(exp_words))
    jaccard = intersection / union if union > 0 else 0.0
    return round(jaccard, 3)

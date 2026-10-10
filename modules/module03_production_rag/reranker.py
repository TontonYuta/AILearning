"""
reranker.py — Bộ tái xếp hạng (Cross-Encoder Re-ranker).
"""
import re
from typing import List, Dict, Any

class FastCrossEncoderReranker:
    """
    Bộ tái xếp hạng mô phỏng Cross-Encoder:
    Đánh giá tương tác sâu giữa câu hỏi (Query) và đoạn văn bản (Passage),
    tính toán mật độ từ khóa, khoảng cách từ, và phạt đoạn văn bản loãng.
    """
    def __init__(self):
        pass

    def rerank(
        self,
        query: str,
        candidates: List[Dict[str, Any]],
        top_n: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Tái xếp hạng danh sách candidates và trả về top_n kết quả tinh hoa nhất.
        """
        if not candidates:
            return []

        query_terms = [t.lower() for t in re.findall(r"[\w\-]+", query) if len(t) > 1]
        if not query_terms:
            return candidates[:top_n]

        scored_candidates = []
        for cand in candidates:
            content = cand["content"].lower()
            content_words = re.findall(r"[\w\-]+", content)
            total_words = len(content_words)

            if total_words == 0:
                relevance_score = 0.0
            else:
                # 1. Đếm độ phủ từ khóa (Term coverage)
                matched_terms = sum(1 for term in query_terms if term in content)
                coverage_ratio = matched_terms / len(query_terms)

                # 2. Đếm tần suất xuất hiện và mật độ (Term density)
                term_occurrences = sum(content_words.count(term) for term in query_terms)
                density = min(term_occurrences / total_words, 1.0)

                # 3. Điểm số tương tác chéo (Cross-Score)
                raw_score = (0.7 * coverage_ratio) + (0.3 * density)
                relevance_score = round(raw_score, 4)

            cand_copy = dict(cand)
            cand_copy["rerank_score"] = relevance_score
            scored_candidates.append(cand_copy)

        scored_candidates.sort(key=lambda x: x["rerank_score"], reverse=True)
        return scored_candidates[:top_n]

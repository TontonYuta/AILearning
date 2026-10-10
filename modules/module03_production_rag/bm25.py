"""
bm25.py — Cài đặt thuật toán BM25 Okapi chuẩn mực cho Sparse Lexical Search.
"""
import math
import re
from typing import List, Dict, Tuple, Any

class BM25Okapi:
    """
    Thuật toán BM25 Okapi tìm kiếm từ khóa chính xác.
    Rất hiệu quả với mã lỗi, tên biến, số hợp đồng, thuật ngữ chuyên ngành.
    """
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus_size = 0
        self.avgdl = 0.0
        self.doc_freqs: List[Dict[str, int]] = []
        self.idf: Dict[str, float] = {}
        self.doc_len: List[int] = []
        self.doc_ids: List[str] = []
        self.corpus_texts: List[str] = []

    @staticmethod
    def tokenize(text: str) -> List[str]:
        """Tách từ đơn giản, chuyển về chữ thường, bảo tồn ký tự gạch nối và chữ số."""
        return re.findall(r"[\w\-]+", text.lower())

    def fit(self, doc_ids: List[str], texts: List[str]):
        """Lập chỉ mục kho tài liệu."""
        self.doc_ids = doc_ids
        self.corpus_texts = texts
        self.corpus_size = len(texts)
        if self.corpus_size == 0:
            return

        self.doc_len = []
        self.doc_freqs = []
        df: Dict[str, int] = {}

        total_len = 0
        for text in texts:
            tokens = self.tokenize(text)
            length = len(tokens)
            self.doc_len.append(length)
            total_len += length

            freqs: Dict[str, int] = {}
            for token in tokens:
                freqs[token] = freqs.get(token, 0) + 1
            self.doc_freqs.append(freqs)

            for token in freqs.keys():
                df[token] = df.get(token, 0) + 1

        self.avgdl = total_len / self.corpus_size if self.corpus_size > 0 else 0.0

        # Tính toán giá trị IDF (Inverse Document Frequency)
        self.idf = {}
        for token, freq in df.items():
            # Công thức chuẩn Okapi IDF
            val = math.log((self.corpus_size - freq + 0.5) / (freq + 0.5) + 1.0)
            self.idf[token] = max(val, 0.001)

    def search(self, query: str, top_k: int = 5) -> List[Tuple[str, float, str]]:
        """
        Tìm kiếm trả về danh sách: (doc_id, điểm_bm25, nội_dung)
        """
        if self.corpus_size == 0:
            return []

        query_tokens = self.tokenize(query)
        scores: List[Tuple[int, float]] = []

        for idx in range(self.corpus_size):
            score = 0.0
            doc_len = self.doc_len[idx]
            freqs = self.doc_freqs[idx]

            for token in query_tokens:
                if token not in freqs:
                    continue
                tf = freqs[token]
                idf = self.idf.get(token, 0.0)
                # Điểm số BM25
                denom = tf + self.k1 * (1.0 - self.b + self.b * (doc_len / self.avgdl))
                score += idf * (tf * (self.k1 + 1.0)) / denom

            scores.append((idx, score))

        scores.sort(key=lambda x: x[1], reverse=True)
        results = []
        for idx, score in scores[:top_k]:
            if score > 0:
                results.append((self.doc_ids[idx], round(score, 4), self.corpus_texts[idx]))
        return results

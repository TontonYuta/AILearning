"""
Tests for Chapter 8: Enterprise RAG & Multi-Stage Hybrid Search
Covers:
- BM25 Okapi implementation and numerical correctness
- Reciprocal Rank Fusion (RRF) calculation
- Retrieval evaluation metrics: HitRate@K and MRR (Mean Reciprocal Rank)
"""

import math
from collections import Counter
import pytest


class SimpleBM25:
    """
    Lightweight, self-contained implementation of Okapi BM25 for verification.
    """
    def __init__(self, corpus: list[list[str]], k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus_size = len(corpus)
        self.doc_lens = [len(doc) for doc in corpus]
        self.avgdl = sum(self.doc_lens) / self.corpus_size if self.corpus_size > 0 else 0
        self.doc_freqs: dict[str, int] = Counter()
        self.doc_term_counts = []

        for doc in corpus:
            term_counts = Counter(doc)
            self.doc_term_counts.append(term_counts)
            for term in term_counts:
                self.doc_freqs[term] += 1

    def idf(self, term: str) -> float:
        n_q = self.doc_freqs.get(term, 0)
        # Okapi BM25 IDF formula with +1 smoothing
        return math.log((self.corpus_size - n_q + 0.5) / (n_q + 0.5) + 1.0)

    def score(self, query: list[str], doc_idx: int) -> float:
        score = 0.0
        doc_len = self.doc_lens[doc_idx]
        term_counts = self.doc_term_counts[doc_idx]

        for term in query:
            if term not in term_counts:
                continue
            tf = term_counts[term]
            idf_val = self.idf(term)
            numerator = tf * (self.k1 + 1.0)
            denominator = tf + self.k1 * (1.0 - self.b + self.b * (doc_len / self.avgdl))
            score += idf_val * (numerator / denominator)

        return score

    def search(self, query: list[str], top_k: int = 5) -> list[tuple[int, float]]:
        scores = [(idx, self.score(query, idx)) for idx in range(self.corpus_size)]
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]


def reciprocal_rank_fusion(
    ranked_lists: list[list[int]],
    k: int = 60
) -> list[tuple[int, float]]:
    """
    Computes Reciprocal Rank Fusion (RRF) scores across multiple ranked lists.
    Formula: RRF_Score(d) = sum_{m} 1 / (k + rank_m(d))
    where rank_m(d) is 1-indexed.
    """
    scores: dict[int, float] = {}
    for rank_list in ranked_lists:
        for rank_idx, doc_id in enumerate(rank_list):
            rank_1_indexed = rank_idx + 1
            scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank_1_indexed))

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_scores


def compute_mrr(ground_truth_id: int, retrieved_ids: list[int]) -> float:
    """
    Computes Reciprocal Rank (RR) for a single query.
    """
    for rank_idx, doc_id in enumerate(retrieved_ids):
        if doc_id == ground_truth_id:
            return 1.0 / (rank_idx + 1)
    return 0.0


def compute_hit_rate_at_k(ground_truth_id: int, retrieved_ids: list[int], k: int) -> float:
    """
    Computes HitRate@K for a single query.
    """
    top_k_ids = retrieved_ids[:k]
    return 1.0 if ground_truth_id in top_k_ids else 0.0


def test_bm25_scoring():
    corpus = [
        ["mô", "hình", "llama", "phục", "vụ", "nhanh"],
        ["tối", "ưu", "bộ", "nhớ", "kv", "cache", "cho", "llama"],
        ["học", "máy", "và", "xử", "lý", "ngôn", "ngữ", "tự", "nhiên"]
    ]
    bm25 = SimpleBM25(corpus, k1=1.5, b=0.75)
    query = ["kv", "cache", "llama"]

    # Doc 1 contains both "kv" and "cache" as well as "llama", should rank #1
    results = bm25.search(query, top_k=3)
    best_doc_idx, best_score = results[0]
    assert best_doc_idx == 1, f"Expected doc 1 to rank highest, got {best_doc_idx}"
    assert best_score > 0.0

    # Doc 2 contains no query terms, score must be exactly 0
    doc2_score = bm25.score(query, 2)
    assert doc2_score == 0.0


def test_reciprocal_rank_fusion():
    # List 1 (BM25): [Doc A=10, Doc B=20, Doc C=30]
    # List 2 (Dense): [Doc B=20, Doc D=40, Doc A=10]
    list_sparse = [10, 20, 30]
    list_dense = [20, 40, 10]

    # With k=60:
    # Doc 20: rank 2 in sparse (1/(60+2)), rank 1 in dense (1/(60+1)) -> 1/62 + 1/61 = 0.016129 + 0.016393 = 0.032522
    # Doc 10: rank 1 in sparse (1/(60+1)), rank 3 in dense (1/(60+3)) -> 1/61 + 1/63 = 0.016393 + 0.015873 = 0.032266
    # Doc 20 should win because it appears near the top of both lists!
    rrf_results = reciprocal_rank_fusion([list_sparse, list_dense], k=60)

    top_doc_id, top_score = rrf_results[0]
    assert top_doc_id == 20
    assert pytest.approx(top_score, 1e-4) == (1.0 / 62 + 1.0 / 61)


def test_retrieval_metrics():
    ground_truth = 42
    retrieved = [10, 20, 42, 50, 60]

    # Rank of ground_truth is 3 (1-indexed)
    mrr = compute_mrr(ground_truth, retrieved)
    assert pytest.approx(mrr, 1e-5) == 1.0 / 3.0

    # HitRate@2 should be 0 (not in top 2)
    assert compute_hit_rate_at_k(ground_truth, retrieved, k=2) == 0.0

    # HitRate@3 should be 1 (in top 3)
    assert compute_hit_rate_at_k(ground_truth, retrieved, k=3) == 1.0

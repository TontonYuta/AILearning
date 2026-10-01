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


# ==============================================================================
# 4. TWO-STAGE HYBRID RETRIEVER
# ==============================================================================

class TwoStageHybridRetriever:
    """Combines BM25 and Dense search via RRF, then reranks with Cross-Encoder."""
    def __init__(self, corpus: list[list[str]], bm25_engine: SimpleBM25, cross_encoder_fn):
        self.corpus = corpus
        self.bm25 = bm25_engine
        self.reranker = cross_encoder_fn

    def retrieve(self, query: list[str], dense_ranked_ids: list[int], top_k_stage1: int = 10, top_k_final: int = 3) -> list[tuple[int, float]]:
        # 1. Sparse search
        bm25_results = self.bm25.search(query, top_k=top_k_stage1)
        sparse_ranked = [doc_id for doc_id, _ in bm25_results]

        # 2. Stage 1 Fusion
        rrf_ranked = reciprocal_rank_fusion([sparse_ranked, dense_ranked_ids], k=60)
        candidate_ids = [doc_id for doc_id, _ in rrf_ranked[:top_k_stage1]]

        # 3. Stage 2 Cross-Encoder Rerank
        query_str = " ".join(query)
        scored_candidates = []
        for doc_id in candidate_ids:
            doc_text = " ".join(self.corpus[doc_id])
            score = self.reranker(query_str, doc_text)
            scored_candidates.append((doc_id, score))

        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        return scored_candidates[:top_k_final]


def test_two_stage_hybrid_retriever():
    corpus = [
        ["chính", "sách", "bảo", "hiểm", "y", "tế", "năm", "2024"], # 0
        ["hướng", "dẫn", "thanh", "toán", "viện", "phí"],           # 1
        ["điều", "kiện", "bồi", "thường", "bảo", "hiểm", "cháy", "nổ"] # 2
    ]
    bm25 = SimpleBM25(corpus)
    query = ["bảo", "hiểm", "cháy", "nổ"]

    # Suppose doc 2 is ranked lower initially in dense search [0, 1, 2]
    dense_ranked = [0, 1, 2]

    # Cross encoder accurately recognizes doc 2 is the exact match
    def mock_cross_encoder(q, doc):
        return 0.95 if "cháy nổ" in doc else 0.20

    retriever = TwoStageHybridRetriever(corpus, bm25, mock_cross_encoder)
    results = retriever.retrieve(query, dense_ranked, top_k_stage1=3, top_k_final=1)
    
    assert len(results) == 1
    assert results[0][0] == 2
    assert results[0][1] == pytest.approx(0.95)


# ==============================================================================
# 5. RAG EVALUATION: FAITHFULNESS EVALUATOR
# ==============================================================================

class FaithfulnessEvaluator:
    """Evaluates the proportion of answer claims supported by retrieved context."""
    def evaluate(self, claims: list[str], context: str) -> dict[str, float]:
        if not claims:
            return {"faithfulness": 1.0, "supported_count": 0, "total_claims": 0}

        context_lower = context.lower()
        supported = 0
        for claim in claims:
            # A claim is supported if key words exist in context
            claim_tokens = [w for w in claim.lower().split() if len(w) > 2]
            if all(token in context_lower for token in claim_tokens):
                supported += 1

        score = supported / len(claims)
        return {
            "faithfulness": score,
            "supported_count": supported,
            "total_claims": len(claims)
        }


def test_faithfulness_evaluator():
    evaluator = FaithfulnessEvaluator()
    context = "Lãi suất tiết kiệm kỳ hạn 12 tháng tại Techcombank là 5.5% một năm kể từ tháng 10 năm 2026."
    
    # Claim 1: Lãi suất 12 tháng là 5.5% (Supported)
    # Claim 2: Lãi suất 24 tháng là 7.0% (Hallucinated / Not in context)
    claims = [
        "lãi suất tiết kiệm 5.5%",
        "lãi suất 24 tháng 7.0%"
    ]
    res = evaluator.evaluate(claims, context)
    assert res["faithfulness"] == pytest.approx(0.5)
    assert res["supported_count"] == 1
    assert res["total_claims"] == 2


# ==============================================================================
# 6. GRAPHRAG: K-HOP KNOWLEDGE GRAPH RETRIEVER
# ==============================================================================

class GraphEntityRetriever:
    """Performs k-hop neighborhood expansion on knowledge graph entities."""
    def __init__(self, adjacency_list: dict[str, list[str]]):
        self.adj = adjacency_list

    def expand_subgraph(self, seed_entities: list[str], k_hops: int = 1) -> set[str]:
        visited = set(seed_entities)
        current_frontier = set(seed_entities)

        for _ in range(k_hops):
            next_frontier = set()
            for entity in current_frontier:
                neighbors = self.adj.get(entity, [])
                for neighbor in neighbors:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        next_frontier.add(neighbor)
            current_frontier = next_frontier

        return visited


def test_graph_rag_khop_expansion():
    # Graph: Transformer -> Attention -> FlashAttention -> GPU
    #       Transformer -> FFN
    adj = {
        "Transformer": ["Attention", "FFN"],
        "Attention": ["FlashAttention", "Transformer"],
        "FlashAttention": ["GPU", "Attention"],
        "GPU": ["FlashAttention"],
        "FFN": ["Transformer"]
    }
    graph_retriever = GraphEntityRetriever(adj)

    # 1-hop from Transformer: {Transformer, Attention, FFN}
    hop1 = graph_retriever.expand_subgraph(["Transformer"], k_hops=1)
    assert hop1 == {"Transformer", "Attention", "FFN"}

    # 2-hop from Transformer: {Transformer, Attention, FFN, FlashAttention}
    hop2 = graph_retriever.expand_subgraph(["Transformer"], k_hops=2)
    assert hop2 == {"Transformer", "Attention", "FFN", "FlashAttention"}

    # 3-hop from Transformer: reaches GPU
    hop3 = graph_retriever.expand_subgraph(["Transformer"], k_hops=3)
    assert "GPU" in hop3


# ==============================================================================
# 7. TABLE-AWARE CHUNKER & HAND CALCULATION TESTS
# ==============================================================================

class TableAwareChunker:
    """Bo chia doan van ban Markdown co kha nang bao toan Table Headers."""
    def __init__(self, max_table_rows: int = 5):
        self.max_table_rows = max_table_rows

    def chunk_markdown(self, text: str) -> list[str]:
        lines = text.strip().split("\n")
        chunks = []
        in_table = False
        table_headers = []
        current_rows = []

        for line in lines:
            stripped = line.strip()
            if stripped.startswith("|") and stripped.endswith("|"):
                if not in_table:
                    in_table = True
                    table_headers = [line]
                elif len(table_headers) == 1 and ("---" in stripped):
                    table_headers.append(line)
                else:
                    current_rows.append(line)
                    if len(current_rows) >= self.max_table_rows:
                        chunk_content = "\n".join(table_headers + current_rows)
                        chunks.append(chunk_content)
                        current_rows = []
            else:
                if in_table:
                    if current_rows:
                        chunk_content = "\n".join(table_headers + current_rows)
                        chunks.append(chunk_content)
                        current_rows = []
                    in_table = False
                    table_headers = []
                if stripped:
                    chunks.append(line)

        if in_table and current_rows:
            chunks.append("\n".join(table_headers + current_rows))

        return chunks


def test_exercise_b4_bm25_hand_calculation():
    # Exercise B.4: N=3, n(q)=2 -> IDF = ln((3 - 2 + 0.5)/(2 + 0.5) + 1) = ln(1.5/2.5 + 1) = ln(1.6)
    idf_val = math.log((3 - 2 + 0.5) / (2 + 0.5) + 1.0)
    assert pytest.approx(idf_val, 1e-4) == 0.4700036

    # D1: len=4, f=2, avgdl=5.0, k1=1.2, b=0.75
    score_d1 = idf_val * (2.0 * 2.2) / (2.0 + 1.2 * (0.25 + 0.75 * (4.0 / 5.0)))
    assert pytest.approx(score_d1, 1e-4) == 0.6848

    # D2: len=6, f=1, avgdl=5.0
    score_d2 = idf_val * (1.0 * 2.2) / (1.0 + 1.2 * (0.25 + 0.75 * (6.0 / 5.0)))
    assert pytest.approx(score_d2, 1e-4) == 0.4345

    assert score_d1 > score_d2


def test_exercise_b5_rrf_hand_calculation():
    # Dense: [d1, d2, d3, d4] -> ranks 1, 2, 3, 4
    # BM25:  [d3, d1, d4, d2] -> ranks 2, 4, 1, 3
    # k = 60
    rrf_d1 = 1.0 / (60 + 1) + 1.0 / (60 + 2)
    rrf_d2 = 1.0 / (60 + 2) + 1.0 / (60 + 4)
    rrf_d3 = 1.0 / (60 + 3) + 1.0 / (60 + 1)
    rrf_d4 = 1.0 / (60 + 4) + 1.0 / (60 + 3)

    assert pytest.approx(rrf_d1, abs=1e-4) == 0.032522
    assert pytest.approx(rrf_d2, abs=1e-4) == 0.031754
    assert pytest.approx(rrf_d3, abs=1e-4) == 0.032266
    assert pytest.approx(rrf_d4, abs=1e-4) == 0.031498

    # Winner is d1
    assert rrf_d1 > rrf_d3 > rrf_d2 > rrf_d4


def test_table_aware_chunker():
    chunker = TableAwareChunker(max_table_rows=2)
    md_content = """# Bao Cao Doanh Thu
| Nam | Doanh Thu |
|---|---|
| 2023 | 100 ty |
| 2024 | 150 ty |
| 2025 | 200 ty |
| 2026 | 280 ty |
Ket thuc bao cao."""

    chunks = chunker.chunk_markdown(md_content)
    table_chunks = [c for c in chunks if "| Nam | Doanh Thu |" in c]
    assert len(table_chunks) == 2
    assert "| 2023 | 100 ty |" in table_chunks[0]
    assert "| 2025 | 200 ty |" in table_chunks[1]
    for tc in table_chunks:
        assert "| Nam | Doanh Thu |" in tc
        assert "|---|---|" in tc



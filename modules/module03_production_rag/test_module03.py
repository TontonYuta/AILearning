"""
test_module03.py — Bộ kiểm thử tự động cho Hybrid Search, RRF, Re-ranking và Citation Verification.
"""
import pytest
from modules.module02_vector_search.chunker import TextChunk
from modules.module03_production_rag.bm25 import BM25Okapi
from modules.module03_production_rag.hybrid_retriever import HybridRetriever
from modules.module03_production_rag.reranker import FastCrossEncoderReranker
from modules.module03_production_rag.rag_pipeline import ProductionRAGPipeline

def test_bm25_exact_token_match():
    bm25 = BM25Okapi()
    doc_ids = ["doc1", "doc2", "doc3"]
    texts = [
        "Lỗi bình thường kết nối cơ sở dữ liệu",
        "Mã lỗi nghiêm trọng ERR-503-TIMEOUT xảy ra khi quá tải",
        "Tài liệu hướng dẫn thanh toán bằng thẻ visa"
    ]
    bm25.fit(doc_ids, texts)

    results = bm25.search("ERR-503-TIMEOUT", top_k=2)
    assert len(results) > 0
    assert results[0][0] == "doc2"
    assert "ERR-503-TIMEOUT" in results[0][2]

def test_hybrid_retriever_rrf_combination():
    retriever = HybridRetriever(rrf_k=60)
    chunks = [
        TextChunk(chunk_id="c1", content="Xử lý sự cố máy chủ và bộ nhớ VRAM", char_start=0, char_end=35),
        TextChunk(chunk_id="c2", content="Mã lỗi ERR-999 cần liên hệ bộ phận DevOps", char_start=40, char_end=80),
        TextChunk(chunk_id="c3", content="Chính sách bảo mật mật khẩu người dùng", char_start=85, char_end=125),
    ]
    retriever.index_chunks(chunks)

    # Tìm kiếm với từ khóa cụ thể ERR-999
    results = retriever.search("ERR-999 DevOps", top_k=2)
    assert len(results) > 0
    assert results[0]["chunk_id"] == "c2"
    assert results[0]["rrf_score"] > 0

def test_cross_encoder_reranker():
    reranker = FastCrossEncoderReranker()
    query = "chính sách nghỉ phép năm của nhân viên"
    candidates = [
        {"chunk_id": "c1", "content": "Quy chế trang phục và đồng phục công ty"},
        {"chunk_id": "c2", "content": "Chính sách nghỉ phép năm mỗi nhân viên được hưởng 12 ngày phép"},
        {"chunk_id": "c3", "content": "Quy trình xin cấp phát máy tính xách tay"},
    ]

    reranked = reranker.rerank(query, candidates, top_n=1)
    assert len(reranked) == 1
    assert reranked[0]["chunk_id"] == "c2"
    assert reranked[0]["rerank_score"] > 0.5

def test_rag_pipeline_citations_and_groundedness():
    pipeline = ProductionRAGPipeline()
    chunks = [
        TextChunk(
            chunk_id="chunk_0001",
            content="Mã lỗi ERR-503-TIMEOUT phát sinh khi cụm GPU Inference bị quá tải.",
            char_start=0,
            char_end=70
        ),
        TextChunk(
            chunk_id="chunk_0002",
            content="Quy định chấm công bằng vân tay lúc 8 giờ sáng.",
            char_start=75,
            char_end=120
        ),
    ]
    pipeline.index_documents(chunks)

    res = pipeline.answer("Quy trình xử lý mã lỗi ERR-503-TIMEOUT là gì?")
    assert res.is_grounded is True
    assert "chunk_0001" in res.citations
    assert len(res.retrieved_contexts) > 0

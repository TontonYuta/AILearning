"""
test_module02.py — Bộ kiểm thử tự động cho Chunking và Multi-Tenant Vector Search.
"""
import pytest
from modules.module02_vector_search.chunker import RecursiveCharacterChunker, TextChunk
from modules.module02_vector_search.vector_store import ProductionVectorStore

def test_recursive_chunker_size_and_overlap():
    text = (
        "Đoạn văn 1 chứa thông tin rất quan trọng. " * 5 + "\n\n" +
        "Đoạn văn 2 quy định về thời gian làm việc. " * 5
    )
    chunker = RecursiveCharacterChunker(chunk_size=120, chunk_overlap=30)
    chunks = chunker.split_text(text, base_metadata={"source": "policy.pdf"})

    assert len(chunks) > 1
    for c in chunks:
        assert c.metadata["source"] == "policy.pdf"
        assert "index" in c.metadata
        assert len(c.content) <= 150 # chấp nhận sai số lề nhỏ do dấu phân tách
        assert c.chunk_id.startswith("chunk_")

def test_multi_tenant_isolation():
    """Kiểm tra tuyệt đối không rò rỉ dữ liệu giữa 2 tenant."""
    store = ProductionVectorStore()
    chunker = RecursiveCharacterChunker(chunk_size=200, chunk_overlap=20)

    doc_a = "Mã bí mật của Tenant A là SECRET_ALPHA_123."
    doc_b = "Mã bí mật của Tenant B là SECRET_BETA_999."

    chunks_a = chunker.split_text(doc_a, base_metadata={"tenant_id": "tenant_A"})
    chunks_b = chunker.split_text(doc_b, base_metadata={"tenant_id": "tenant_B"})

    store.insert_chunks(chunks_a)
    store.insert_chunks(chunks_b)

    # Tenant B tìm kiếm từ khóa bí mật của Tenant A
    results_for_b = store.search("ALPHA", top_k=5, filters={"tenant_id": "tenant_B"})

    # Toàn bộ kết quả trả về chỉ được phép thuộc tenant_B
    for r in results_for_b:
        assert r["metadata"]["tenant_id"] == "tenant_B"
        assert "SECRET_ALPHA_123" not in r["content"]

def test_similarity_ordering():
    """Kiểm tra câu hỏi khớp nhiều từ khóa nhất phải có điểm tương đồng cao nhất."""
    store = ProductionVectorStore()

    # Tạo 2 chunks trực tiếp rõ ràng
    chunks = [
        TextChunk(
            chunk_id="c1",
            content="Quy định chuyển khoản số tiền lớn bắt buộc xác thực khuôn mặt sinh trắc học.",
            char_start=0,
            char_end=75,
            metadata={"topic": "banking"}
        ),
        TextChunk(
            chunk_id="c2",
            content="Quy định trang phục nhân viên khi đến công ty vào ngày thứ sáu.",
            char_start=80,
            char_end=145,
            metadata={"topic": "dresscode"}
        ),
    ]
    store.insert_chunks(chunks)

    results = store.search("chuyển khoản ngân hàng xác thực khuôn mặt", top_k=2)
    assert len(results) == 2
    assert results[0]["chunk_id"] == "c1"
    assert "khuôn mặt" in results[0]["content"]
    assert results[0]["similarity_score"] > results[1]["similarity_score"]

def test_empty_store_search():
    store = ProductionVectorStore()
    res = store.search("bất kỳ câu hỏi nào", top_k=5)
    assert res == []

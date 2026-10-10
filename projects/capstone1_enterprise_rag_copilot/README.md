# 🏆 CAPSTONE 1: ENTERPRISE KNOWLEDGE COPILOT

> **Hệ thống trợ lý tri thức doanh nghiệp đa phòng ban với RAG nâng cao, Re-ranking, phân quyền Multi-Tenant và pipeline tự động đo lường độ ảo giác.**

---

## 1. Tổng Quan Kiến Trúc Dự Án

Dự án tích hợp toàn bộ kỹ thuật từ **Module 01, 02, 03, 04**:
* **Backend:** FastAPI cung cấp REST API (`/api/v1/query`, `/api/v1/index-document`).
* **Ingestion Pipeline:** Recursive Chunking + Metadata Enrichment (`department`, `clearance_level`).
* **Retrieval Engine:** Hybrid Search (BM25 + Dense Qdrant Vector Store) kết hợp Cross-Encoder Re-ranker.
* **Citation & Groundedness:** Tự động trích dẫn chính xác mã nguồn và kiểm tra đối soát trước khi trả lời người dùng.
* **CI/CD Quality Gate:** Tích hợp bộ kiểm thử đánh giá tự động (Ragas / DeepEval metrics) trong quy trình kiểm thử trước khi deploy.

---

## 2. Kiến Trúc Dữ Liệu & Thành Phần

```text
capstone1_enterprise_rag_copilot/
├── README.md               # Thiết kế hệ thống & Hướng dẫn triển khai
├── docker-compose.yml      # Cụm dịch vụ Qdrant Vector DB + Redis
├── app/
│   ├── main.py             # FastAPI Application Server
│   ├── config.py           # Thiết lập tham số hệ thống
│   ├── ingestion.py        # Pipeline nạp tài liệu & đánh chỉ mục
│   ├── retriever.py        # Hybrid Search & RRF Engine
│   ├── generator.py        # Sinh câu trả lời kèm Trích dẫn
│   └── evaluation.py       # Pipeline tự động đánh giá Faithfulness
└── tests/
    └── test_capstone1.py   # Test suite kiểm thử toàn diện
```

---

## 3. Hướng Dẫn Khởi Chạy Nhanh

```bash
# 1. Khởi chạy cụm Vector DB (tùy chọn nếu dùng server thật)
docker compose up -d

# 2. Khởi chạy ứng dụng Copilot
uvicorn projects.capstone1_enterprise_rag_copilot.app.main:app --port 8000 --reload
```

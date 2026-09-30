# SPEC: Phase 4 — Hệ Thống RAG & AI Agent Tự Hành (RAG & Agent Engineering)

## 1. Thông Tin Chung
- **Mã chương**: `ch:phase4-rag-agent`
- **Mục tiêu**: Xây dựng hệ thống RAG cấp độ sản xuất có khả năng trích xuất chính xác tài liệu nội bộ, không ảo giác, có trích dẫn nguồn, đo lường được bằng các chỉ số định lượng, và phát triển các AI Agent tự hành bền bỉ bằng LangGraph.

## 2. Các Phân Hệ Cốt Lõi
- **Production RAG Pipeline**:
  - Chiến lược phân mảnh tài liệu (Document Chunking: Fixed, Recursive, Semantic).
  - Cơ sở dữ liệu Vector chuyên sâu với Qdrant (Chỉ mục HNSW, Payload Filtering).
  - Tìm kiếm lai (Hybrid Search: Dense Vector + BM25 Sparse) qua thuật toán Reciprocal Rank Fusion (RRF).
  - Xếp hạng lại (Reranking với Cross-Encoder) để tối ưu Precision@K.
  - Neo dữ kiện và Trích dẫn nguồn (Attribution & Citations).
- **RAG Evaluation (Định Lượng Độ Tin Cậy)**:
  - Thước đo truy xuất: Context Precision, Context Recall.
  - Thước đo sinh phản hồi: Faithfulness (Tính trung thực), Answer Relevance (Độ liên quan).
  - Xây dựng LLM-as-a-Judge benchmark tự động.
- **AI Agent Tự Hành với LangGraph**:
  - Mental Model: State + Tools + Planning + Memory + Feedback.
  - Mẫu thiết kế ReAct (Reasoning + Acting).
  - Kiến trúc StateGraph: Nodes, Edges, Conditional Routing.
  - Bộ nhớ ngắn hạn (Thread state) và dài hạn (Semantic memory).
  - Can thiệp con người (Human-in-the-loop - HITL).

## 3. Tiêu Chuẩn Nghiệm Thu
- [x] Có công thức toán học thuật toán RRF (Reciprocal Rank Fusion).
- [x] Có code Python runnable: Hybrid Search RRF Fusion, Minimal LangGraph-like State Machine.
- [x] Unit test kiểm thử trong `tests/test_phase4_rag_agent.py`.
- [x] Đầy đủ các hộp `definitionbox`, `intuitionbox`, `workedexamplebox`, `labbox`, `debugbox`, `securitybox`, `tradeoffbox`, `interviewbox`, `checkpointbox`.
- [x] Biên dịch và vượt qua QA 100%.

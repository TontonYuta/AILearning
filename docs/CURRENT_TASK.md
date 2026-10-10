# CURRENT_TASK.md — NHIỆM VỤ HIỆN TẠI

## Trạng thái: HOÀN THÀNH CHUYỂN ĐỔI SANG KHO MÃ NGUỒN & CẨM NANG THỰC CHIẾN (APPLIED AI MONOREPO)

### Các công việc đã hoàn thành:
1. [x] Lưu trữ an toàn 100% giáo trình LaTeX 501 trang cũ vào nhánh Git `archive/latex-monograph-v2` và thư mục `legacy/`.
2. [x] Thiết lập kiến trúc Monorepo chuẩn thực chiến: `requirements.txt`, `.env.example`, `shared/config.py`.
3. [x] Cập nhật `README.md` cổng thông tin chính và `docs/ROADMAP.md` lộ trình 12 tuần thực chiến.
4. [x] Triển khai toàn bộ **10 Modules thực hành**:
   - [x] Module 01: Structured Outputs & Schema Validation (Pydantic V2, Self-Healing Loop).
   - [x] Module 02: Embeddings & Vector Search (Recursive Chunker, Multi-Tenant Isolation).
   - [x] Module 03: Production-Grade RAG (BM25 + Dense, RRF, Re-ranking, Citations).
   - [x] Module 04: LLM Evals & Benchmarking (Faithfulness, Relevance, LLM-as-a-Judge).
   - [x] Module 05: Tool Calling & Sandboxed APIs (Auto Schema, Read-Only SQL Sandbox).
   - [x] Module 06: Model Context Protocol - MCP (JSON-RPC 2.0 Server & Client).
   - [x] Module 07: Agentic Workflows & LangGraph (StateGraph, Human-in-the-Loop Gate).
   - [x] Module 08: LLMOps, Semantic Caching & Observability (Redis Cache, Cost Tracer).
   - [x] Module 09: AI Security & Guardrails (PII Masking, Prompt Injection, Canary Tokens).
   - [x] Module 10: Local Serving & LoRA Fine-Tuning (OpenAI-compatible SSE, Dynamic Adapters).
5. [x] Khởi tạo kiến trúc 3 Enterprise Capstones trong `projects/`.
6. [x] Chạy toàn bộ test suite: **41/41 unit tests pass 100% trong 0.43s**.

### Kế hoạch tiếp theo (Nếu cần):
- Triển khai chi tiết code backend cho Capstone 1, 2, 3.
- Kết nối giao diện người dùng Web (React/Vite).

# PROJECT_STATE.md — TRẠNG THÁI HIỆN TẠI CỦA DỰ ÁN

| Chỉ số | Giá trị |
| :--- | :--- |
| **Project Version** | **3.0.0 (Applied AI Engineer Monorepo — Code-First & Project-Driven)** |
| **Định dạng chuẩn** | **Mã nguồn Python thực chiến + Markdown Guides + Pytest CI/CD** |
| **Số lượng Modules** | **10 Modules thực hành hoàn chỉnh (Module 01 đến Module 10)** |
| **Unit Test Coverage** | **41/41 tests passed 100% trong 0.43s (`pytest modules/ -v`)** |
| **Đồ án kỳ hạm (Capstones)**| **3 Enterprise Capstones (RAG Copilot, Data Analyst MCP, AI Gateway Firewall)** |
| **Lưu trữ giáo trình cũ** | Đã sao lưu an toàn tại nhánh Git `archive/latex-monograph-v2` và thư mục `legacy/` |
| **Git Branch** | `main` |

---

## 🎯 Tổng Hợp 10 Modules Đã Triển Khai Hoàn Chỉnh

1. **Module 01 (Structured Outputs & Schema Validation):**
   - Pydantic V2 schema enforcement, model validators cho hóa đơn và ticket.
   - Cơ chế Self-Healing Loop tự động gửi feedback lỗi schema để LLM tự sửa.
   - Kiểm thử tự động: 4/4 tests passed.
2. **Module 02 (Embeddings & Vector Search):**
   - Recursive Character Chunker thông minh bảo toàn ngữ cảnh câu.
   - Production Vector Store hỗ trợ lọc Multi-Tenant Isolation chống rò rỉ dữ liệu.
   - Kiểm thử tự động: 4/4 tests passed.
3. **Module 03 (Production-Grade RAG):**
   - Sparse BM25 Okapi + Dense Vector Search.
   - Dung hợp thứ hạng Reciprocal Rank Fusion (RRF $k=60$) + Cross-Encoder Re-ranker.
   - Bắt buộc dẫn nguồn `[chunk_id]` và kiểm định Groundedness chống ảo giác.
   - Kiểm thử tự động: 4/4 tests passed.
4. **Module 04 (LLM Evals & Benchmarking):**
   - Bộ chỉ số định lượng: Faithfulness, Answer Relevance, Semantic Match.
   - LLM-as-a-Judge sử dụng Rubric thang điểm 1-5 và cơ chế phát hiện ảo giác.
   - Báo cáo kết quả chuẩn CI/CD Pass/Fail.
   - Kiểm thử tự động: 4/4 tests passed.
5. **Module 05 (Tool Calling & Sandboxed APIs):**
   - Decorator `@register_tool` tự động trích xuất JSON Schema từ Python Type Hints.
   - Safe SQL Sandbox (chỉ cho phép SELECT, chặn đứng SQL Injection và từ khóa nguy hiểm).
   - Kiểm thử tự động: 4/4 tests passed.
6. **Module 06 (Model Context Protocol - MCP):**
   - Xây dựng Enterprise MCP Server và Client tuân thủ đặc tả JSON-RPC 2.0 của Anthropic.
   - Tự động bắt tay khởi tạo (`initialize`), khám phá công cụ (`tools/list`), gọi thực thi từ xa (`tools/call`) và đọc tài nguyên (`resources/read`).
   - Kiểm thử tự động: 4/4 tests passed.
7. **Module 07 (Agentic Workflows & LangGraph):**
   - Động cơ StateGraph hỗ trợ chu trình lặp và conditional routing.
   - Cổng ngắt Human-in-the-Loop: Tạm dừng đồ thị khi gặp giao dịch nhạy cảm, chờ duyệt rồi tiếp tục.
   - Kiểm thử tự động: 4/4 tests passed.
8. **Module 08 (LLMOps, Semantic Caching & Observability):**
   - Semantic Cache dựa trên cosine similarity: Hạ độ trễ từ 350ms xuống 5ms, chi phí $0 cho request lặp lại.
   - Distributed Cost & Token Tracer tính toán ngân sách chi tiết cho GPT-4o, Claude 3.5, Gemini 2.0.
   - Kiểm thử tự động: 4/4 tests passed.
9. **Module 09 (AI Security & Guardrails):**
   - Bộ lọc PII Masker tự động che số thẻ tín dụng, email, SĐT, CCCD.
   - Phát hiện tấn công Prompt Injection / Jailbreak (đa ngôn ngữ Anh - Việt).
   - Canary Token leak detection bảo vệ System Prompt.
   - Kiểm thử tự động: 4/4 tests passed.
10. **Module 10 (Local Serving & LoRA Fine-Tuning):**
    - Động cơ LoRA $W_0 + \frac{\alpha}{r} (B \cdot A)$ hỗ trợ hoán đổi Adapter động trong RAM.
    - Cổng OpenAI-compatible Local Server hỗ trợ Server-Sent Events (SSE) Streaming.
    - Kiểm thử tự động: 5/5 tests passed.

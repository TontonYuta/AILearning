# SPEC: Phase 3 — Kỹ Nghệ Transformer & Mô Hình Ngôn Ngữ Lớn (LLM Engineering)

## 1. Thông Tin Chung
- **Mã chương**: `ch:phase3-llm`
- **Mục tiêu**: Bóc tách từng bánh răng cơ học bên trong kiến trúc Transformer, cơ chế Self-Attention và KV Cache, làm chủ kỹ nghệ giao tiếp LLM API cấp doanh nghiệp, Structured Output và Function/Tool Calling.

## 2. Các Phân Hệ Cốt Lõi
- **Kiến trúc Transformer**:
  - Tokenization (Byte-Pair Encoding, Tiktoken) & Embedding.
  - Ma trận $Q, K, V$ và công thức Scaled Dot-Product Attention:
    $$\text{Attention}(Q, K, V) = \text{Softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
  - Multi-Head Attention, Residual Connections, Pre-LayerNorm.
- **Cơ chế Suy luận & Tối ưu hóa**:
  - Autoregressive Generation, Decoding strategies (Temperature, Top-K, Top-P).
  - Bản chất của bộ nhớ đệm **KV Cache** (Key-Value Cache).
  - Chi phí VRAM của KV Cache theo độ dài ngữ cảnh.
- **Kỹ Nghệ Giao Tiếp LLM API**:
  - Streaming SSE, Error handling, Timeout, Circuit breaker.
  - Ép kiểu cấu trúc JSON (Structured Outputs & JSON Schema).
- **Cơ chế Gọi Công Cụ (Tool / Function Calling)**:
  - Tool Schema definition.
  - Vòng lặp: Prompt $\rightarrow$ Arguments generation $\rightarrow$ Local execution $\rightarrow$ LLM Final Response.
- **Hugging Face Transformers**:
  - Pipeline tải mô hình mở (Open-weights models) và tokenizer.

## 3. Tiêu Chuẩn Nghiệm Thu
- [x] Có công thức toán học ma trận và sơ đồ luồng dữ liệu ASCII.
- [x] Có code Python runnable: Toy Self-Attention calculation, Tool Calling dispatcher.
- [x] Unit test kiểm thử trong `tests/test_phase3_llm.py`.
- [x] Đầy đủ các hộp `definitionbox`, `intuitionbox`, `workedexamplebox`, `labbox`, `debugbox`, `securitybox`, `tradeoffbox`, `interviewbox`, `checkpointbox`.
- [x] Biên dịch và vượt qua QA 100%.

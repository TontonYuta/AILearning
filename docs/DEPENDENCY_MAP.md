# DEPENDENCY_MAP.md — BẢN ĐỒ PHỤ THUỘC KIẾN THỨC TOÀN GIÁO TRÌNH

Tài liệu này xác định thứ tự phụ thuộc kiến thức bắt buộc. **Tuyệt đối không dạy một khái niệm khi các mắt xích tiên quyết của nó chưa được hoàn thành.**

---

## 1. NGUYÊN TẮC PHỤ THUỘC BẮT BUỘC

1. Không dạy **AI Agent** trước khi người học nắm vững:
   - Python Advanced (Async, OOP, Closures)
   - HTTP & REST API (FastAPI)
   - Nguyên lý LLM & Function Calling
   - Máy trạng thái (State Machine) & Đồ thị có hướng (DAG)
2. Không dạy **RAG nâng cao (Reranking, Hybrid Search)** trước khi nắm vững:
   - Khái niệm Vector & Cosine Similarity trong Không gian Đa chiều
   - Mô hình Embedding
   - Tìm kiếm từ khóa truyền thống (BM25)
3. Không dạy **Model Serving tối ưu (vLLM, Continuous Batching)** trước khi nắm vững:
   - Kiến trúc phần cứng GPU & VRAM Memory Allocation
   - Cơ chế Autoregressive Decoding & KV Cache
   - Trọng số và kiểu dữ liệu lượng tử hóa (FP16, INT8, INT4)
4. Không dạy **AI Security** như một môn học rời rạc mà phải lồng ghép vào từng chặng kỹ thuật:
   - Học Backend → Học API Security, Rate Limiting, Secret Management.
   - Học RAG → Học RAG Poisoning, Data Access Isolation.
   - Học Agent → Học Tool Abuse, Excessive Agency, Sandboxing.

---

## 2. BIỂU ĐỒ LUỒNG PHỤ THUỘC TỔNG THỂ

```text
[Phase 0: Orientation]
         ↓
[Phase 1.1: Python Mastery] ──────────→ [Phase 1.5: FastAPI Backend]
         ↓                                           ↓
[Phase 1.2: CS & Memory]                     [Phase 1.6: PostgreSQL & Redis]
         ↓                                           ↓
[Phase 1.3: Linux Systems] ──────────────────→ [Phase 5.1: Docker & Containers]
         ↓
[Phase 1.4: Networking Fundamentals] ────────→ [Phase 6.1: Advanced Networking]
         ↓
[Phase 2.1: Mathematics for AI]
         ↓
[Phase 2.2: Classical Machine Learning]
         ↓
[Phase 2.3: Deep Learning & PyTorch]
         ↓
[Phase 3.1: Transformer Architecture]
         ↓
[Phase 3.2: Attention & KV Cache]
         ↓
[Phase 3.3: LLM Inference & API Engineering]
         ↓
   ┌─────┴────────────────────────────┐
   ↓                                  ↓
[Phase 4.1: Production RAG]      [Phase 4.3: LangGraph Agent]
   │                                  │
   └──────────────┬───────────────────┘
                  ↓
          [Phase 4.2: Evaluation]
                  ↓
          [Phase 5.2: vLLM Serving & Quantization]
                  ↓
          [Phase 5.4: PEFT / LoRA Fine-Tuning]
                  ↓
          [Phase 5.5: MLOps & CI/CD]
                  ↓
          [Phase 6.2 - 6.5: AI × NetSec & AI Security]
                  ↓
          [Phase 7: AI System Design]
                  ↓
          [Phase 8: Capstone: AI-NetSecOps Platform]
                  ↓
          [Phase 9: Career & Technical Defense]
```

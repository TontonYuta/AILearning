# SPEC: Phase 5 — Đưa AI Vào Vận Hành Production (Production AI & MLOps)

## 1. Thông Tin Chung
- **Mã chương**: `ch:phase5-production`
- **Mục tiêu**: Đưa các mô hình AI ra khỏi môi trường thí nghiệm để phục vụ người dùng thực tế với thông lượng cao, chi phí tối ưu, đóng gói Docker chuẩn mực, phục vụ mô hình với vLLM, lượng tử hóa và quản trị vòng đời MLOps.

## 2. Các Phân Hệ Cốt Lõi
- **Đóng gói Docker & Compose**:
  - Multi-stage Dockerfile tối ưu kích thước, bảo mật non-root user.
  - Cụm dịch vụ Docker Compose: FastAPI + Qdrant + PostgreSQL + Redis.
- **Model Serving với vLLM**:
  - Điểm nghẽn VRAM và giải thuật PagedAttention.
  - Continuous Batching so với Static Batching truyền thống.
  - Triển khai máy chủ chuẩn OpenAI-compatible.
- **Lượng Tử Hóa Mô Hình (Model Quantization)**:
  - So sánh FP32, FP16/BF16, INT8, INT4.
  - Các định dạng hiện đại: AWQ, GPTQ, GGUF.
  - Phân tích đánh đổi: VRAM vs Tốc độ vs Chất lượng.
- **Tinh Chỉnh Mô Hình (PEFT / LoRA)**:
  - Bản đồ quyết định: Prompting vs RAG vs Fine-tuning vs Pretraining.
  - Bản chất toán học của LoRA: $W = W_0 + \frac{\alpha}{r}BA$.
  - Huấn luyện Supervised Fine-Tuning (SFT).
- **Vận Hành MLOps & Giám Sát**:
  - Quản lý thử nghiệm với MLflow.
  - CI/CD tự động hóa kiểm thử và đóng gói.

## 3. Tiêu Chuẩn Nghiệm Thu
- [x] Có công thức toán học và bảng so sánh dung lượng lượng tử hóa.
- [x] Có code Python runnable: Giả lập LoRA forward pass, Docker Compose config mẫu.
- [x] Unit test kiểm thử trong `tests/test_phase5_prod.py`.
- [x] Đầy đủ các hộp `definitionbox`, `intuitionbox`, `workedexamplebox`, `labbox`, `debugbox`, `securitybox`, `tradeoffbox`, `interviewbox`, `checkpointbox`.
- [x] Biên dịch và vượt qua QA 100%.

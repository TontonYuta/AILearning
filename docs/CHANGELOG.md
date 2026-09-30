# CHANGELOG.md — LỊCH SỬ THAY ĐỔI DỰ ÁN

Mọi bổ sung, tinh chỉnh kiến trúc hoặc phát hành phiên bản mới đều được ghi nhận tại đây theo chuẩn [Keep a Changelog](https://keepachangelog.com/).

---

## [1.0.0] — 2026-10-01 — Gold Master Release
### Hoàn Tất Trọn Vẹn 10 Giai Đoạn Giáo Trình & Xuất Bản PDF Hoàn Chỉnh
- **Added**: Hoàn thành trọn bộ 10 chương chuyên sâu và 1 phụ lục tra cứu theo đúng quy chuẩn Master Prompt:
  - `phase0_orientation.tex`: Định hướng nghề nghiệp & Vòng đời hệ thống AI.
  - `phase1_python.tex`: Kỹ nghệ Python chuyên sâu cho AI (Decorator, Asyncio, Pydantic, Generator).
  - `phase1_systems.tex`: Nền tảng Khoa học máy tính, Linux, Networking & Backend (FastAPI, Redis).
  - `phase2_aiml.tex`: Toán học ứng dụng, Machine Learning & Deep Learning từ số 0.
  - `phase3_llm.tex`: Transformer Internals, LLM Runtime, KV Cache & Robust API Client.
  - `phase4_rag_agent.tex`: Production RAG Pipeline, Hybrid Search (RRF), Ragas Evaluation & LangGraph Agent.
  - `phase5_production.tex`: Đóng gói Docker, Model Serving vLLM, Lượng tử hóa AWQ/GGUF, PEFT/LoRA Fine-tuning.
  - `phase6_security.tex`: Giao thoa Mạng & An ninh mạng AI, OWASP Top 10 for LLMs, Input Guardrails & Sandbox.
  - `phase7_system_design.tex`: Thiết kế Kiến trúc Hệ thống AI Quy mô lớn, Multi-Tenant RAG, Two-Tier Caching & Tiered Router.
  - `phase8_capstone.tex`: Đồ án Đỉnh cao AI-NetSecOps (Web UI -> FastAPI -> LangGraph -> Multi-Tools -> Qdrant -> vLLM) & Khung 6 Cấp độ Trưởng thành.
  - `phase9_career.tex`: Kỹ nghệ viết CV định lượng chuẩn ATS, GitHub Portfolio & Chiến lược vượt 6 vòng phỏng vấn kỹ thuật.
  - `glossary_and_cheatsheets.tex`: Phụ lục bảng thuật ngữ song ngữ Anh - Việt và sổ tay lệnh thực chiến.
- **Added**: Bộ kiểm thử tự động hóa Pytest với 35/35 unit tests bao phủ 100% các đoạn mã mẫu trong sách.
- **Added**: Quy trình tự động hóa kiểm định và xuất bản PDF 68 trang A4 hoàn hảo (`build/pdf/ai_engineer_curriculum.pdf`) với 0 cảnh báo, 0 lỗi biên dịch.

### [0.1.0] — 2026-10-01
### Khởi tạo Dự án & Minimal Compiling Skeleton
- **Added**: Khởi tạo Git repository chuyên biệt tại `/home/tontonyuta/ai-engineer-curriculum`.
- **Added**: Bộ tài liệu nguồn chân lý nền tảng (`AGENTS.md`, `MASTER_SPEC.md`, `CURRICULUM.md`, `README.md`).
- **Added**: Hệ thống tài liệu quản trị bộ nhớ dự án (`PROJECT_STATE.md`, `CURRENT_TASK.md`, `DECISIONS.md`, `DEPENDENCY_MAP.md`, `GLOSSARY.md`).
- **Added**: Kiến trúc mã nguồn LaTeX module hóa và kịch bản tự động hóa `build.sh`, `check.sh`.

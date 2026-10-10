# SPEC: Phase 9 — Phát Triển Sự Nghiệp, Portfolio & Phỏng Vấn (Career Mastery)

## 1. Thông Tin Chung
- **Mã chương**: `ch:phase9-career`
- **Mục tiêu**: Hướng dẫn hoàn thiện hồ sơ nghề nghiệp và chinh phục các vị trí Kỹ sư AI tại các tập đoàn công nghệ và công ty khởi nghiệp hàng đầu thông qua CV định lượng, GitHub portfolio chuẩn mực và chiến lược vượt qua 6 vòng phỏng vấn kỹ thuật chuyên sâu.

## 2. Các Phân Hệ Cốt Lõi
- **Phân hệ 9.1: Kỹ Nghệ Viết CV Định Lượng Chuẩn ATS**:
  - Công thức mô tả bullet point: `Problem + Engineering Action + Technical Decision + Quantified Result`.
  - Bảng so sánh tương phản Weak vs Strong bullet points.
  - Công cụ thẩm định và chấm điểm chất lượng bullet point bằng Python (`ResumeQuantifierValidator`).
- **Phân hệ 9.2: Xây Dựng GitHub Portfolio Kỹ Thuật Chuẩn Kỹ Sư**:
  - Cấu trúc chuẩn của một Repository mã nguồn mở: Architecture, Docker Quickstart, Benchmarks, Trade-off Matrix.
  - Tự động hóa kiểm thử và phát hành phiên bản với GitHub Actions.
- **Phân hệ 9.3: Chiến Lược Vượt Qua 6 Vòng Phỏng Vấn AI Engineer**:
  - Vòng 1: Coding & Data Structures (Thuật toán thực chiến với Python).
  - Vòng 2: CS & Backend Systems (Linux, Networking, Concurrency, PostgreSQL).
  - Vòng 3: AI/ML & Transformer Deep-Dive (Chứng minh toán học, cơ chế suy luận, KV Cache).
  - Vòng 4: RAG & Agent Engineering (Giải pháp chống ảo giác, thiết kế LangGraph state).
  - Vòng 5: AI System Design (Kiến trúc triệu request, cân bằng tải GPU, caching hai tầng).
  - Vòng 6: Project Defense (Bảo vệ quyết định kỹ thuật trước Hội đồng / Tech Lead).

## 3. Tiêu Chuẩn Nghiệm Thu
- [x] Tài liệu đặc tả đầy đủ chiều sâu kiến thức.
- [x] Có code Python runnable: `ResumeBulletPointValidator` phân tích và chấm điểm định lượng.
- [x] Unit test kiểm thử trong `tests/test_phase9_career.py`.
- [x] Đầy đủ các hộp `definitionbox`, `intuitionbox`, `workedexamplebox`, `labbox`, `debugbox`, `securitybox`, `tradeoffbox`, `interviewbox`, `checkpointbox`.
- [x] Biên dịch pdfLaTeX sạch 0 warning, 0 error.

# CURRENT_TASK.md — CONTRACT CÔNG VIỆC HIỆN TẠI

**TASK ID**: TASK-CURRICULUM-COMPLETE  
**TASK TYPE**: Full End-to-End Curriculum Implementation & Publishing  
**OBJECTIVE**: Hoàn thành toàn bộ 10 Giai đoạn (Phase 0 đến Phase 9) và Phụ lục tra cứu của Giáo trình Kỹ sư AI Thực chiến, bao gồm đặc tả kiến trúc, mã nguồn mẫu runnable, bộ kiểm thử tự động Pytest, biên dịch 2-pass pdfLaTeX và kiểm định QA không có lỗi/cảnh báo.

---

## SCOPE (HOÀN TẤT 100%)
- **Phase 0**: Định hướng nghề nghiệp & Toàn cảnh hệ thống AI (`chapters/phase0_orientation.tex`)
- **Phase 1 (Python)**: Kỹ nghệ Python chuyên sâu cho AI (`chapters/phase1_python.tex`)
- **Phase 1 (Systems)**: Nền tảng Khoa học máy tính, Linux & Backend (`chapters/phase1_systems.tex`)
- **Phase 2**: Toán học, Machine Learning & Deep Learning (`chapters/phase2_aiml.tex`)
- **Phase 3**: Transformer Internals & Mô hình Ngôn ngữ Lớn (`chapters/phase3_llm.tex`)
- **Phase 4**: Hệ thống RAG & AI Agent Tự hành với LangGraph (`chapters/phase4_rag_agent.tex`)
- **Phase 5**: Đưa AI vào Vận hành Production & MLOps (`chapters/phase5_production.tex`)
- **Phase 6**: Giao thoa Mạng máy tính & An ninh mạng AI (`chapters/phase6_security.tex`)
- **Phase 7**: Thiết kế Kiến trúc Hệ thống AI Quy mô lớn (`chapters/phase7_system_design.tex`)
- **Phase 8**: Dự án Thực chiến & Đồ án Đỉnh cao AI-NetSecOps (`chapters/phase8_capstone.tex`)
- **Phase 9**: Phát triển Sự nghiệp, Portfolio & 6 Vòng Phỏng vấn (`chapters/phase9_career.tex`)
- **Appendix**: Bảng thuật ngữ song ngữ Anh - Việt & Sổ tay lệnh (`appendices/glossary_and_cheatsheets.tex`)
- **Tests**: Bộ 35 unit tests bao phủ toàn bộ code mẫu (`tests/test_*.py`)
- **Build & QA Scripts**: `./scripts/build.sh` và `./scripts/check.sh`

## VALIDATION RESULTS
- `pytest tests/`: **35 passed in 0.25s** (100% test passing).
- `./scripts/build.sh`: **PASS** (Exit 0, 68 trang A4, 512KB).
- `./scripts/check.sh`: **QA RESULT: PASS** (0 Errors, 0 Warnings, 0 Broken refs).

## STATUS
- **TRẠNG THÁI**: HOÀN THÀNH TOÀN DIỆN (COMPLETED).
- **FILE PDF XUẤT XƯỞNG**: `build/pdf/ai_engineer_curriculum.pdf`.

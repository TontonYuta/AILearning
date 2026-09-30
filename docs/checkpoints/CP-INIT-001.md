# CHECKPOINT: CP-INIT-001

- **CHECKPOINT ID**: CP-INIT-001
- **DATE**: 2026-10-01
- **PROJECT VERSION**: 1.0.0
- **CURRICULUM VERSION**: 1.0.0

---

## CONTEXT & CURRENT STATE
- **CURRENT PHASE**: Phase 0 — Foundation & Architecture
- **CURRENT MODULE**: Project Bootstrap, LaTeX Publishing Pipeline & Minimal Skeleton
- **CURRENT CHAPTER**: Phase 0 Overview (Minimal Compiling Skeleton)

---

## COMPLETED
1. **Kiểm tra môi trường & công cụ**:
   - Hệ điều hành Linux, TeX Live 2025 (`pdflatex`, `vntex`, `mathptmx`, `tcolorbox`, `listings`).
   - Python 3.14 + Pytest.
2. **Thiết lập Nguồn Chân Lý (Source of Truth Hierarchy)**:
   - `MASTER_SPEC.md`: Toàn văn đặc tả kỹ thuật, quy chuẩn 20 phần mỗi bài học, 3 tầng nhận thức, chuẩn chất lượng code.
   - `CURRICULUM.md`: Khung chương trình 10 giai đoạn từ Phase 0 đến Phase 9.
   - `AGENTS.md`: Kỷ luật vận hành Autonomous Agent, quy trình inspect-plan-implement-check, memory hierarchy.
   - `README.md`: Tài liệu hướng dẫn sử dụng và biên dịch sách.
3. **Thiết lập Bộ Nhớ Dự Án (Persistent Project Memory)**:
   - `docs/PROJECT_STATE.md`: Snapshot trạng thái hiện tại.
   - `docs/CURRENT_TASK.md`: Task contract chi tiết.
   - `docs/DECISIONS.md` & `docs/decisions/ADR-001-repository-and-pdflatex-architecture.md`: Quyết định kiến trúc pdfLaTeX và repository riêng biệt.
   - `docs/DEPENDENCY_MAP.md`: Bản đồ luồng phụ thuộc kiến thức bắt buộc.
   - `docs/GLOSSARY.md`: Từ điển thuật ngữ kỹ thuật song ngữ Anh - Việt.
   - `docs/CHANGELOG.md`: Lịch sử các thay đổi dự án.
4. **Kiến trúc Xuất bản PDF (pdfLaTeX Design System)**:
   - `latex/main.tex`: File orchestration sạch sẽ.
   - `latex/metadata.tex`: Thông tin ấn bản.
   - `latex/preamble.tex`: Gói thư viện, layout A4, font Times New Roman Serif `mathptmx`, tiếng Việt UTF-8 `vietnam`.
   - `latex/commands.tex`: Macro nội dòng an toàn qua `\detokenize`, ký hiệu toán vector/ma trận.
   - `latex/environments.tex`: Hệ thống hộp chuyên biệt `tcolorbox` (definitionbox, intuitionbox, workedexamplebox, labbox, exercisebox, solutionbox, debugbox, securitybox, tradeoffbox, interviewbox, checkpointbox).
   - `latex/frontmatter/`: Trang bìa chuẩn ấn bản học thuật và Lời nói đầu.
   - `latex/chapters/phase0_overview.tex`: Chương mẫu đầu tiên tích hợp đầy đủ các hộp định dạng và code block.
5. **Hệ thống Tự động hóa Build & QA**:
   - `scripts/build.sh`: Tự động biên dịch 2 lượt fail-fast, cô lập file phụ trợ vào `build/auxiliary/`, xuất PDF vào `build/pdf/`.
   - `scripts/check.sh`: Bộ kiểm định tự động kiểm tra lỗi fatal, broken references, undefined citations, duplicate labels, placeholder dang dở, và thực thi unit tests trong `tests/`.
6. **Kiểm thử chất lượng**:
   - `tests/test_chapter0_code.py`: Unit test kiểm thử mã nguồn mẫu chạy thành công 100%.
   - `./scripts/build.sh`: Biên dịch thành công file PDF 8 trang hoàn hảo.
   - `./scripts/check.sh`: QA RESULT: PASS (0 Errors, 0 Warnings, 0 Infos).

---

## FILES CREATED
- `AGENTS.md`
- `MASTER_SPEC.md`
- `CURRICULUM.md`
- `README.md`
- `.gitignore`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_TASK.md`
- `docs/DECISIONS.md`
- `docs/DEPENDENCY_MAP.md`
- `docs/GLOSSARY.md`
- `docs/CHANGELOG.md`
- `docs/decisions/ADR-001-repository-and-pdflatex-architecture.md`
- `docs/checkpoints/CP-INIT-001.md`
- `latex/main.tex`
- `latex/metadata.tex`
- `latex/preamble.tex`
- `latex/commands.tex`
- `latex/environments.tex`
- `latex/frontmatter/title.tex`
- `latex/frontmatter/preface.tex`
- `latex/chapters/phase0_overview.tex`
- `scripts/build.sh`
- `scripts/check.sh`
- `tests/test_chapter0_code.py`

---

## DECISIONS
- Chấp thuận ADR-001: Khởi tạo repository chuyên biệt tại `/home/tontonyuta/ai-engineer-curriculum` và dùng pdfLaTeX thuần với phông chữ Times Serif và Vietnamese UTF-8.

---

## CONCEPTS ESTABLISHED
- Vòng đời hoàn chỉnh của hệ thống AI (AI Lifecycle).
- Phân biệt rõ vai trò AI Engineer vs AI Researcher vs Data Scientist.
- Tính toán chi phí Token Economics & Latency.
- Phòng vệ Prompt Injection & xử lý Context Window Exceeded.

---

## DEPENDENCIES SATISFIED
- Hạ tầng môi trường biên dịch, font tiếng Việt và testing đã được thiết lập và xác thực 100%.

---

## BUILD & QA STATUS
- **BUILD**: PASS (2 lượt, PDF xuất ra tại `build/pdf/ai_engineer_curriculum.pdf`)
- **QA**: PASS (0 Errors, 0 Warnings, 0 Infos)

---

## WARNINGS
- None.

---

## TECHNICAL DEBT
- None.

---

## NEXT TASK
- **TASK-P0-SPEC-001**: Hoàn thiện đặc tả chi tiết (specs) cho từng bài học trong Phase 0 (Orientation) và bắt đầu triển khai các bài học theo đúng quy chuẩn 20 phần.

## NEXT CHECKPOINT
- **CP-P0-001**

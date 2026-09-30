# CHANGELOG.md — LỊCH SỬ THAY ĐỔI DỰ ÁN

Mọi bổ sung, tinh chỉnh kiến trúc hoặc phát hành phiên bản mới đều được ghi nhận tại đây theo chuẩn [Keep a Changelog](https://keepachangelog.com/).

---

## [1.0.0] — 2026-10-01
### Khởi tạo Dự án & Minimal Compiling Skeleton
- **Added**: Khởi tạo Git repository chuyên biệt tại `/home/tontonyuta/ai-engineer-curriculum`.
- **Added**: Bộ tài liệu nguồn chân lý nền tảng:
  - `AGENTS.md`: Quy tắc hoạt động của Autonomous Agent, kỷ luật bộ nhớ, completion gate.
  - `MASTER_SPEC.md`: Đặc tả kỹ thuật toàn diện, quy chuẩn 20 phần mỗi bài học, tiêu chuẩn LaTeX.
  - `CURRICULUM.md`: Toàn bộ đề cương chi tiết 10 giai đoạn (Phase 0 đến Phase 9).
  - `README.md`: Giới thiệu dự án và hướng dẫn vận hành.
- **Added**: Hệ thống tài liệu quản trị bộ nhớ dự án:
  - `docs/PROJECT_STATE.md`: Bảng theo dõi trạng thái hiện tại.
  - `docs/CURRENT_TASK.md`: Task contract chi tiết.
  - `docs/DECISIONS.md` & `docs/decisions/ADR-001-repository-and-pdflatex-architecture.md`: Quyết định kiến trúc pdfLaTeX và repository độc lập.
  - `docs/DEPENDENCY_MAP.md`: Bản đồ luồng phụ thuộc kiến thức bắt buộc.
  - `docs/GLOSSARY.md`: Từ điển thuật ngữ kỹ nghệ AI song ngữ.
- **Added**: Kiến trúc mã nguồn LaTeX module hóa:
  - `latex/main.tex`: Orchestration file.
  - `latex/preamble.tex`: Gói thư viện, layout A4, font Serif Times `mathptmx`, hỗ trợ tiếng Việt `utf8` qua `vietnam`.
  - `latex/metadata.tex`: Dữ liệu ấn bản, tác giả, tựa sách.
  - `latex/commands.tex`: Macro và phím tắt chuẩn.
  - `latex/environments.tex`: Hệ thống hộp chuyên biệt bằng `tcolorbox`.
  - `latex/frontmatter/`: Trang bìa và lời tựa.
  - `latex/chapters/phase0_overview.tex`: Chương mẫu kiểm tra biên dịch (Minimal Skeleton).
- **Added**: Bộ kịch bản tự động hóa chất lượng cao:
  - `scripts/build.sh`: Tự động biên dịch đa lượt với pdfLaTeX, cô lập file trung gian vào `build/auxiliary/`.
  - `scripts/check.sh`: Bộ kiểm tra QA tự động phát hiện lỗi, cảnh báo, broken links/refs và nhãn trùng lặp.

# CURRENT_TASK.md — CONTRACT CÔNG VIỆC HIỆN TẠI

**TASK ID**: TASK-INIT-001  
**TASK TYPE**: Architecture & Minimal Compiling Skeleton Setup  
**OBJECTIVE**: Thiết lập toàn bộ hạ tầng biên dịch LaTeX (Design System, environments, metadata, preamble), kịch bản tự động hóa `build.sh` và `check.sh`, biên dịch thành công một Minimal Compiling Skeleton của sách sang PDF và xác thực QA đạt chuẩn 100%.

---

## SCOPE
- `latex/main.tex`
- `latex/preamble.tex`
- `latex/metadata.tex`
- `latex/commands.tex`
- `latex/environments.tex`
- `latex/frontmatter/title.tex`
- `latex/frontmatter/preface.tex`
- `latex/chapters/phase0_overview.tex`
- `scripts/build.sh`
- `scripts/check.sh`
- `docs/decisions/ADR-001-repository-and-pdflatex-architecture.md`
- `docs/DECISIONS.md`
- `docs/DEPENDENCY_MAP.md`
- `docs/GLOSSARY.md`
- `docs/CHANGELOG.md`

## OUT OF SCOPE
- Viết ồ ạt nội dung toàn bộ các chương tiếp theo (sẽ thực hiện theo từng task kế tiếp sau khi skeleton được duyệt QA).
- Cài đặt thêm các công cụ bên ngoài không cần thiết.

## DEPENDENCIES
- TeX Live 2025 (`pdflatex`, `vntex`, `mathptmx`, `tcolorbox`, `listings`).
- Bash Shell.

## EXPECTED OUTPUT
- `build/pdf/ai_engineer_curriculum.pdf` được tạo ra thành công, đẹp mắt, có trang bìa, mục lục, một chương mẫu với các environments tiêu chuẩn (`definitionbox`, `intuitionbox`, `labbox`, `debugbox`, `securitybox`, `interviewbox`, `checkpointbox`).
- Chạy `./scripts/build.sh` không có lỗi.
- Chạy `./scripts/check.sh` trả về `QA RESULT: PASS` (exit code 0).

## VALIDATION
- `./scripts/build.sh` exit 0.
- `./scripts/check.sh` exit 0.
- Không có lỗi nghiêm trọng hay broken reference.

## SUCCESS CRITERIA
- Minimal compiling skeleton hoàn tất.
- Sẵn sàng để chuyển sang viết nội dung chi tiết theo đúng quy trình của Master Prompt.

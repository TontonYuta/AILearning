# AGENTS.md — HƯỚNG DẪN DÀNH CHO AUTONOMOUS AI AGENT

Tài liệu này là quy ước bắt buộc cho mọi AI agent (hoặc kỹ sư) tham gia phát triển, bảo trì và biên soạn giáo trình **AI Engineer Curriculum**.

---

## 1. TRIẾT LÝ DỰ ÁN

> **Không học để biết nhiều công nghệ.**  
> **Học để hiểu → xây được → debug được → test được → secure được → deploy được → giải thích được → chứng minh được.**

- Đối tượng người học: **Beginner**, xuất phát từ số 0, chưa được phép giả định họ đã biết thuật ngữ chuyên ngành.
- Cách tiếp cận: Dạy từ bản chất và mental model, không chạy theo framework nhất thời hay hype.
- Ngôn ngữ chính: **Tiếng Việt** chuẩn mực sư phạm và kỹ thuật, giữ thuật ngữ tiếng Anh gốc kèm giải thích ở lần đầu xuất hiện.

---

## 2. NGUYÊN TẮC HOẠT ĐỘNG (AUTONOMY & DISCIPLINE)

1. **KHÔNG ĐƯỢC LÀM TOÀN BỘ PROJECT TRONG MỘT LẦN**:
   - Đây là dự án kỹ thuật dài hạn (software engineering + publishing project).
   - Chia nhỏ công việc thành từng Phase, Module, Chapter, Lesson có spec rõ ràng.
2. **VÒNG LẶP BẮT BUỘC CHO MỖI TASK**:
   ```text
   INSPECT → PLAN → SPECIFY → IMPLEMENT → COMPILE → CHECK → DEBUG → REVIEW → IMPROVE → REPORT
   ```
3. **NGUỒN CHÂN LÝ (SOURCE OF TRUTH HIERARCHY)**:
   ```text
   MASTER_SPEC.md
          ↓
   CURRICULUM.md
          ↓
   AGENTS.md
          ↓
   docs/decisions/ (ADRs)
          ↓
   specs/chapters/ & specs/lessons/
          ↓
   LaTeX source & runnable code
   ```
4. **BỘ NHỚ DỰ ÁN (PERSISTENT MEMORY)**:
   - Conversation context là tạm thời (transient).
   - Repository là bộ nhớ vĩnh viễn (persistent memory).
   - Bắt buộc cập nhật `docs/PROJECT_STATE.md`, `docs/CURRENT_TASK.md` và tạo checkpoint (`CP-xxx`) sau mỗi task.

---

## 3. CẤU TRÚC THƯ MỤC CHUẨN

```text
ai-engineer-curriculum/
├── AGENTS.md                 # Quy chuẩn hoạt động của AI Agent
├── MASTER_SPEC.md            # Đặc tả kỹ thuật toàn diện của toàn bộ hệ thống
├── CURRICULUM.md             # Toàn bộ đề cương chi tiết từ Phase 0 đến Phase 9
├── README.md                 # Hướng dẫn tổng quan và hướng dẫn build
├── .gitignore
│
├── specs/                    # Đặc tả chi tiết
│   ├── chapters/             # Spec từng chương
│   └── lessons/              # Spec từng bài học
│
├── docs/                     # Tài liệu kiến trúc và bộ nhớ dự án
│   ├── PROJECT_STATE.md      # Snapshot trạng thái hiện tại
│   ├── CURRENT_TASK.md       # Contract của task đang thực hiện
│   ├── DECISIONS.md          # Index các quyết định kiến trúc
│   ├── DEPENDENCY_MAP.md     # Bản đồ phụ thuộc kiến thức
│   ├── GLOSSARY.md           # Thuật ngữ song ngữ Anh - Việt
│   ├── CHANGELOG.md          # Lịch sử thay đổi các phiên bản
│   ├── architecture/         # Tài liệu thiết kế hệ thống
│   └── decisions/            # Architecture Decision Records (ADRs)
│
├── latex/                    # Mã nguồn xuất bản PDF (pdfLaTeX)
│   ├── main.tex              # Orchestration file duy nhất
│   ├── preamble.tex          # Package imports, font, layout
│   ├── metadata.tex          # Tên sách, tác giả, phiên bản
│   ├── commands.tex          # Custom macros, phím tắt
│   ├── environments.tex      # Các hộp chuẩn hóa (tcolorbox)
│   ├── frontmatter/          # Bìa, lời mở đầu, mục lục
│   ├── chapters/             # Nội dung chia theo phase/module
│   ├── appendices/           # Phụ lục tra cứu, cheat sheet
│   └── assets/               # Hình vẽ, sơ đồ TikZ, diagrams
│
├── scripts/                  # Tự động hóa build & QA
│   ├── build.sh              # Build PDF nhiều lượt, cô lập file rác
│   └── check.sh              # QA tự động: errors, warnings, broken refs
│
├── tests/                    # Unit tests cho mã nguồn mẫu trong sách
│
└── build/                    # Đầu ra biên dịch (ignored bởi git trừ PDF phát hành)
    ├── pdf/                  # File PDF kết quả
    ├── logs/                 # Log file biên dịch
    └── auxiliary/            # File phụ trợ (.aux, .toc, .out)
```

---

## 4. QUY CHUẨN LATEX & XUẤT BẢN

- **Compiler**: Duy nhất **pdfLaTeX**. Không chuyển sang XeLaTeX/LuaLaTeX trừ khi có yêu cầu mới được ghi nhận bằng ADR.
- **Tiếng Việt**: Sử dụng `\usepackage[utf8]{vietnam}`. Font chuẩn Serif chuyên nghiệp: `mathptmx` (Times New Roman serif) kết hợp với các ký hiệu toán học chuẩn xác.
- **Quản lý file rác**: Tất cả file trung gian (`.aux`, `.log`, `.toc`, `.out`) phải được đưa vào `build/auxiliary/` và `build/logs/`, file PDF xuất ra tại `build/pdf/`. Tuyệt đối không để file phụ trợ rải rác trong `latex/` hay thư mục gốc.
- **Code Block**: Dùng package `listings` hoặc `tcolorbox`, cấu hình rõ ngôn ngữ, font fixed-width dễ đọc, có breakline tự động.
- **Đồng bộ hộp định dạng (Environments)**:
  - `definitionbox`: Định nghĩa khái niệm.
  - `intuitionbox`: Trực giác, tư duy đời thực (mental model).
  - `workedexamplebox`: Ví dụ giải mẫu chi tiết từng bước.
  - `labbox`: Bài thực hành chạy code thực tế.
  - `exercisebox`: Bài tập từ cấp độ 1 đến 6.
  - `solutionbox`: Hướng dẫn giải chi tiết.
  - `debugbox`: Phân tích lỗi, traceback và cách sửa.
  - `securitybox`: Rủi ro bảo mật, tấn công, phòng thủ.
  - `tradeoffbox`: So sánh đánh đổi kỹ thuật (Engineering Trade-offs).
  - `interviewbox`: Câu hỏi phỏng vấn thực tế và tiêu chí đánh giá.
  - `checkpointbox`: Bảng kiểm tra năng lực cuối bài.

---

## 5. TIÊU CHÍ HOÀN THÀNH CHƯƠNG (COMPLETION GATE)

Một chương chỉ được đánh dấu **DONE** khi thỏa mãn toàn bộ:
```text
[ ] Spec hoàn chỉnh trong specs/chapters/
[ ] Lý thuyết nền tảng & trực giác (Intuition)
[ ] Mental Model trực quan (Diagram / Flow)
[ ] Ví dụ minh họa có code runnable
[ ] Bài tập đầy đủ từ Recall đến Engineering (Level 1 -> 6)
[ ] Lời giải chi tiết khớp chính xác với đề bài
[ ] Tình huống Debugging & lỗi phổ biến
[ ] Góc nhìn Bảo mật (Security Considerations)
[ ] Đánh đổi kỹ thuật (Engineering Trade-offs)
[ ] Câu hỏi phỏng vấn thực chiến
[ ] Mã nguồn được test thực tế trong tests/
[ ] LaTeX biên dịch thành công qua scripts/build.sh
[ ] QA kiểm tra đạt chuẩn (scripts/check.sh báo PASS)
```

---

## 6. GIAO THỨC BẮT ĐẦU VÀ KẾT THÚC SESSION

### Khi bắt đầu:
1. Đọc `AGENTS.md`.
2. Đọc `docs/PROJECT_STATE.md`.
3. Đọc `docs/CURRENT_TASK.md`.
4. Đọc Checkpoint gần nhất trong `docs/PROJECT_STATE.md`.
5. Đọc `MASTER_SPEC.md` và `CURRICULUM.md` nếu cần hoạch định nội dung.

### Khi kết thúc:
1. Chạy `./scripts/build.sh`.
2. Chạy `./scripts/check.sh`.
3. Cập nhật `docs/PROJECT_STATE.md`.
4. Cập nhật `docs/CURRENT_TASK.md`.
5. Tạo checkpoint ID mới (`CP-xxx`).
6. Báo cáo trạng thái theo cấu trúc: STATUS, CHANGED, VALIDATED, WARNINGS, NEXT.

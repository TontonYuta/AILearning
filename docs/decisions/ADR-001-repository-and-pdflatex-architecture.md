# ADR-001: Kiến trúc Repository Độc lập và Bộ Công cụ Xuất bản pdfLaTeX

## Trạng thái
**ACCEPTED**

## Bối cảnh (Context)
Dự án giáo trình "Autonomous AI Engineer Curriculum" là một công trình kỹ thuật phần mềm kết hợp xuất bản sách dài hạn. Yêu cầu đặt ra là:
1. Dự án cần một không gian làm việc sạch sẽ, cô lập với các tệp tin cá nhân trong thư mục người dùng (`/home/tontonyuta/`).
2. Sách phải được xuất bản thành file PDF chất lượng cao bằng tiếng Việt với phông chữ Serif chuyên nghiệp (Times New Roman phong cách học thuật kỹ thuật).
3. Biên dịch phải tự động hóa, ổn định trên môi trường Linux chuẩn và không phụ thuộc vào các công cụ nặng nề hay môi trường GUI.

## Vấn đề cần giải quyết (Problem)
1. Lựa chọn thư mục đặt mã nguồn: Đặt trực tiếp tại thư mục Home `~` hay tạo thư mục Git repository riêng biệt?
2. Lựa chọn LaTeX engine: pdfLaTeX vs XeLaTeX vs LuaLaTeX.
3. Cơ chế kiểm soát tệp tin trung gian sinh ra trong quá trình biên dịch LaTeX (`.aux`, `.log`, `.toc`, `.out`).

## Các phương án cân nhắc (Options)
- **Phương án 1 (Repository Location)**: Khởi tạo repo riêng tại `/home/tontonyuta/ai-engineer-curriculum`. (Ưu điểm: Tách biệt hoàn toàn, an toàn cho hệ thống, dễ quản lý phiên bản Git, không làm bẩn thư mục home).
- **Phương án 2 (LaTeX Engine)**:
  - `XeLaTeX/LuaLaTeX`: Hỗ trợ font hệ thống qua `fontspec`, nhưng tốc độ biên dịch chậm hơn, cấu hình phức tạp trên CI/CD và không tuân thủ quy chuẩn bắt buộc của Master Prompt.
  - `pdfLaTeX`: Rất nhanh, cực kỳ ổn định, có sẵn package `vietnam` (vntex) hỗ trợ tiếng Việt Unicode T5 hoàn hảo, kết hợp phông `mathptmx` chuẩn Times Serif.

## Quyết định (Decision)
1. Thiết lập toàn bộ dự án tại thư mục riêng: `/home/tontonyuta/ai-engineer-curriculum`, khởi tạo Git branch `main`.
2. Sử dụng **pdfLaTeX** với package `vietnam` và `mathptmx` làm chuẩn xuất bản duy nhất.
3. Tổ chức mã nguồn LaTeX tách lớp:
   - `main.tex`: Chỉ làm nhiệm vụ điều phối (orchestration), không chứa nội dung thô.
   - `preamble.tex`: Nạp thư viện, cấu hình font và trang in.
   - `environments.tex`: Định nghĩa các hộp giao diện (`tcolorbox`) đồng nhất.
   - `metadata.tex`: Cấu hình thông tin tác giả, phiên bản.
   - `commands.tex`: Định nghĩa phím tắt và macro định dạng.
4. Tách biệt hoàn toàn thư mục build: File phụ trợ đặt trong `build/auxiliary/`, log đặt trong `build/logs/`, và PDF hoàn chỉnh xuất tại `build/pdf/`.

## Đánh đổi & Hệ quả (Trade-offs & Consequences)
- **Thuận lợi**: Quá trình biên dịch cực nhanh, không phụ thuộc font bên ngoài, mã nguồn sạch sẽ, dễ dàng bảo trì và tự động hóa qua kịch bản shell.
- **Thách thức**: Với pdfLaTeX, các ký tự Unicode đặc thù cần gói mã hóa phù hợp, code block trong `listings` cần cấu hình hỗ trợ UTF-8 chuẩn xác qua `tcolorbox` hoặc `listingsutf8`. Đã được kiểm thử và giải quyết trong Design System.

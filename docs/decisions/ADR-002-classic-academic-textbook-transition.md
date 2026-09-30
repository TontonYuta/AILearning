# ADR-002: Chuyển Đổi Sang Mô Hình Sách Chuyên Khảo Kinh Điển Quy Mô ~400 Trang

- **Trạng thái**: ACCEPTED
- **Ngày quyết định**: 2026-10-01
- **Người đề xuất**: Ban Kỹ thuật Dự án & Phản hồi Người dùng
- **Phạm vi tác động**: Toàn bộ hệ thống LaTeX, cấu trúc chương mục, phong cách trình bày và độ sâu nội dung.

---

## 1. Bối Cảnh (Context)
Ấn bản ban đầu đã hoàn thành cấu trúc khung (skeleton) và 10 giai đoạn tóm lược với 68 trang. Tuy nhiên, qua rà soát và đánh giá chất lượng chuyên sâu:
1. **Lạm dụng Hộp Định Dạng (Box-Heavy Overuse)**: Việc bao bọc gần như toàn bộ nội dung trong các khối hộp `tcolorbox` với viền đậm và nền màu làm ngắt quãng dòng đọc, khiến tác phẩm mang phong cách slide thuyết trình hoặc tài liệu tóm tắt (cheat-sheet) rời rạc thay vì một cuốn sách giáo khoa kinh điển.
2. **Thiếu Chiều Sâu Phân Tích & Toán Học**: Các công thức toán học chưa được giải thích động lực hình thành (*tại sao lại dùng công thức này? nó giải quyết bài toán tối ưu gì? tại sao không dùng công thức thay thế?*), thiếu các bước biến đổi trung gian và giải mẫu số học bằng tay.
3. **Thiếu Hệ Thống Bài Tập & Câu Hỏi Tư Duy Sâu Sắc**: Số lượng bài tập còn mỏng, thiếu các câu hỏi tư duy bản chất buộc người học phải suy ngẫm về các đánh đổi kỹ thuật (trade-offs) và các thất bại thực tế trong môi trường sản xuất.
4. **Mục Tiêu Quy Mô**: Để trở thành một cuốn sách vô giá có thể học từ số 0 đến cấp độ làm chủ toàn diện hạ tầng AI production, quy mô tổng thể của sách cần đạt khoảng **400 trang**.

---

## 2. Quyết Định Kiến Trúc (Decisions)

### 2.1. Tái Định Dạng Typography Phong Cách Sách Chuyên Khảo Hàn Lâm (Monograph Style)
- **Bãi bỏ việc dùng hộp đóng kín toàn bộ nội dung**: Chuyển toàn bộ nội dung thuyết minh, lý thuyết, luồng dữ liệu sang văn xuôi kỹ thuật liền mạch, chuẩn mực như các tác phẩm kinh điển (*Deep Learning* của Ian Goodfellow, *Designing Data-Intensive Applications* của Martin Kleppmann).
- **Hệ thống Định nghĩa & Ví dụ Chuẩn `amsthm`**:
  - Định nghĩa (`definition`): Trình bày trang nhã với số thứ tự đánh theo chương (vd: *Định nghĩa 1.1*).
  - Định lý & Mệnh đề (`theorem`, `proposition`): Trình bày toán học chặt chẽ.
  - Ví dụ minh họa (`example`): Walkthrough trực tiếp logic từng bước.
- **Callout Tối Giản (Minimalist Vertical Bar)**: Đối với cảnh báo an ninh hoặc lưu ý kiến trúc tối quan trọng, chỉ sử dụng thanh kẻ dọc mảnh bên trái (`borderline west`) thanh lịch trên nền chữ bình thường, tuyệt đối không dùng hộp đóng khung 4 phía.

### 2.2. Chuẩn Mực Toán Học & Luồng Xử Lý (Workflow Deep-Dive)
- Mỗi công thức toán học xuất hiện trong sách bắt buộc phải đi qua 5 giai đoạn nhận thức:
  1. **Động cơ thúc đẩy (Motivation)**: Bài toán thực tế gặp phải bế tắc gì?
  2. **Bản chất toán học (Formulation)**: Công thức ký hiệu chuẩn, giải thích từng biến số, chiều của véc-tơ/ma trận.
  3. **Biến đổi & Lý giải (Derivation & Why)**: Tại sao lại chuẩn hóa với $\sqrt{d_k}$? Tại sao lại trừ $\max(z)$ trong Softmax? Tại sao Cross-Entropy lại hội tụ nhanh hơn MSE cho phân loại?
  4. **Giải mẫu số học bằng tay (Numerical Walkthrough)**: Đưa số liệu cụ thể vào tính toán từng bước để người học thấu hiểu dòng chảy số liệu trước khi viết code.
  5. **Mã nguồn thực thi (Runnable Code)**: Viết code Python sạch, tối ưu hóa vectorized và có kiểm thử Pytest.

### 2.3. Hệ Thống Bài Tập & Câu Hỏi Tư Duy Đa Tầng (Multi-Tiered Problem Sets)
Cuối mỗi chương/chủ đề lớn bắt buộc phải có hệ thống bài tập toàn diện gồm:
- **Nhóm A — Câu hỏi Tư duy Bản chất (Conceptual & Reasoning)**: Thách thức tư duy kiến trúc, phân tích đánh đổi tốc độ vs bộ nhớ vs chi phí.
- **Nhóm B — Bài toán Phân tích & Tính toán Bằng Tay (Analytical & Manual Calculations)**: Tính toán ma trận Attention, dung lượng KV Cache, băng thông mạng, số lượng tham số LoRA.
- **Nhóm C — Thực hành Kỹ nghệ & Lập trình (Implementation & Benchmarking)**: Tự cài đặt thuật toán từ đầu không dùng thư viện đen.
- **Nhóm D — Debugging & Phòng thủ An ninh (Adversarial & Troubleshooting)**: Phân tích log lỗi, truy vết stacktrace, phát hiện lỗ hổng Prompt Injection và vá lỗi hệ thống.
- **Phần Lời Giải & Hướng Dẫn Chi Tiết**: Cung cấp đáp án và phân tích tư duy kỹ sư cho toàn bộ bài tập.

### 2.4. Khung Cấu Trúc Toàn Bộ Sách 15 Chương (~400 Trang)
Sách được chia thành 6 Phần lớn và 15 Chương chuyên sâu:
- **Phần I: Khởi Động & Kỹ Nghệ Hệ Thống (Phase 0 - 1)** (~85 trang).
- **Phần II: Nền Tảng Toán Học, Machine Learning & Deep Learning (Phase 2)** (~55 trang).
- **Phần III: Mô Hình Ngôn Ngữ Lớn & Kỹ Nghệ Transformer (Phase 3)** (~55 trang).
- **Phần IV: Hệ Thống RAG & AI Agent Tự Hành (Phase 4)** (~55 trang).
- **Phần V: Vận Hành Sản Xuất, Tối Ưu Hóa & An Ninh Mạng AI (Phase 5 - 6)** (~75 trang).
- **Phần VI: Thiết Kế Hệ Thống, Đồ Án Kỳ Hạm & Sự Nghiệp (Phase 7 - 9)** (~75 trang).
- **Phần VII: Phụ Lục Toàn Diện & Sổ Tay Kỹ Sư** (~25 trang).

---

## 3. Hệ Quả & Đánh Đổi (Consequences)
- **Tích cực**: Cuốn sách trở thành một công trình học thuật và kỹ nghệ sâu sắc, chuẩn mực quốc tế, giá trị cao và đọc liền mạch không bị vướng mắt.
- **Kỹ thuật**: Cần biên soạn theo từng chương có kiểm soát chất lượng nghiêm ngặt, biên dịch và chạy QA liên tục qua `./scripts/build.sh` và `./scripts/check.sh`.

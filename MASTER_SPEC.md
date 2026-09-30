# MASTER_SPEC.md — ĐẶC TẢ KỸ THUẬT TOÀN DIỆN DỰ ÁN GIÁO TRÌNH AI ENGINEER
## BẢN ĐẶC TẢ SÁCH CHUYÊN KHẢO KINH ĐIỂN QUY MÔ ~400 TRANG

| Thuộc tính | Giá trị |
| :--- | :--- |
| **Tên dự án** | Autonomous AI Engineer Curriculum & Textbook |
| **Phiên bản Master Spec** | v2.0.0 (Classic Academic & Engineering Monograph Edition) |
| **Quy mô mục tiêu** | ~400 trang A4 chuẩn xuất bản học thuật |
| **Compiler chuẩn** | `pdfLaTeX` (TeX Live 2025/Debian) |
| **Phông chữ** | Serif Times New Roman chuẩn mực (`mathptmx`), `[utf8]{vietnam}` |
| **Phong cách bố cục** | Monograph kinh điển (như Springer, MIT Press, O'Reilly); loại bỏ khung hộp bao kín, sử dụng văn phong liền mạch, phân tích sâu, định lý/định nghĩa `amsthm` và thanh chỉ dẫn tối giản |
| **Target Audience** | Từ người học bắt đầu từ số 0 đến Kỹ sư Trưởng (Lead/Principal AI Engineer) |

---

## 1. TẦM NHÌN VÀ TRIẾT LÝ HỆ THỐNG

### 1.1. Triết lý đào tạo
```text
Không học để biết nhiều công nghệ.
Học để HIỂU BẢN CHẤT → XÂY ĐƯỢC TỪ GỐC → DEBUG ĐƯỢC SỰ CỐ → TEST ĐƯỢC TOÀN DIỆN
     → SECURE ĐƯỢC HẠ TẦNG → DEPLOY ĐƯỢC QUY MÔ LỚN → GIẢI THÍCH ĐƯỢC ĐÁNH ĐỔI → CHỨNG MINH ĐƯỢC BẰNG TOÁN HỌC.
```

### 1.2. Chuỗi chuyển hóa năng lực kỹ thuật
Mỗi kỹ sư được đào tạo phải làm chủ trọn vẹn chu trình hệ thống AI từ tầng vật lý đến ứng dụng:
```text
Phần cứng & Bộ nhớ (GPU VRAM / DRAM / PCI-e / CUDA Cores)
     ↓
Dữ liệu & Tiền xử lý (Cleaning / Ingestion / Tokenization / Embeddings)
     ↓
Mô hình & Thuật toán (Linear Algebra / Calculus / Attention / Quantization)
     ↓
Hạ tầng Phục vụ Suy luận (PagedAttention / Continuous Batching / vLLM)
     ↓
Logic Ứng dụng & Điều phối (FastAPI / Hybrid Search / LangGraph Agents)
     ↓
Đánh giá & An toàn (Faithfulness / Ragas / OWASP Top 10 / Guardrails)
     ↓
Vận hành Phân tán & Mở rộng (Docker / Celery / Kafka / Redis / Multi-tenancy)
     ↓
Giám sát, Phản ứng Sự cố & Tối ưu Chi phí (Tracing / Prometheus / Circuit Breaker)
```

---

## 2. NGUYÊN TẮC THIẾT KẾ NỘI DUNG CHUẨN SÁCH CHUYÊN KHẢO

### 2.1. Quy chuẩn Trình bày Typography & Không Dùng Hộp Đóng Kín
- **Văn bản liền mạch**: Toàn bộ lý thuyết, phân tích hệ thống, dòng dữ liệu được viết dưới dạng các đoạn văn xuôi kỹ thuật giàu tính phân tích, chia tầng rõ ràng qua `\section`, `\subsection`, `\subsubsection`, `\paragraph`.
- **Hệ thống Định nghĩa & Ví dụ**: Sử dụng chuẩn `amsthm`:
  - `\begin{definition}[Tên định nghĩa]` ... `\end{definition}`
  - `\begin{theorem}[Tên định lý]` ... `\end{theorem}`
  - `\begin{example}[Tên ví dụ giải mẫu]` ... `\end{example}`
- **Chỉ dẫn Tối giản (Minimalist Callout)**: Khi cần nhấn mạnh rủi ro an ninh hoặc đánh đổi quan trọng, chỉ dùng thanh kẻ dọc thanh lịch bên trái (`borderline west`), tuyệt đối không đóng khung kín 4 góc có nền màu nặng nề.
- **Sơ đồ Luồng (Flowcharts & Architectures)**: Mô tả rõ ràng từng chặng luồng dữ liệu (Dataflow) và luồng điều khiển (Controlflow).

### 2.2. Chuẩn Mực Toán Học 5 Bước (Mathematical Rigor Framework)
Mỗi công thức toán học xuất hiện trong sách bắt buộc phải đi qua 5 giai đoạn nhận thức:
1. **Động cơ thực tế (Motivation)**: Bài toán gặp bế tắc gì nếu không có công thức này?
2. **Định nghĩa toán học chặt chẽ (Rigorous Formulation)**: Ký hiệu rõ ràng, chỉ rõ không gian véc-tơ ($\mathbb{R}^d$), chiều ma trận ($B \times L \times D$), và ý nghĩa từng biến số.
3. **Chứng minh & Biến đổi giải tích (Derivation & Why)**:
   - Tại sao trong Attention lại chia cho $\sqrt{d_k}$? (Chứng minh phương sai của tích vô hướng tăng tuyến tính theo số chiều làm bão hòa gradient của Softmax).
   - Tại sao Softmax phải trừ đi giá trị cực đại $\max(z)$? (Chứng minh ngăn ngừa tràn số học số thực IEEE 754 float32/float16).
   - Tại sao phân loại dùng Cross-Entropy thay vì Mean Squared Error? (Chứng minh đạo hàm theo logit không bị nghẽn gradient khi dự đoán sai lệch lớn).
   - Tại sao LoRA lại chọn tích hai ma trận hạng thấp $B \times A$? (Chứng minh Rank của cập nhật trọng số trong quá trình thích nghi là cực nhỏ).
4. **Ví dụ giải mẫu số học bằng tay (Hand-calculated Numerical Walkthrough)**: Cho tập số liệu cụ thể (vd: 3 véc-tơ 4 chiều), tính toán từng bước bằng tay để người học thấy rõ dòng chuyển dịch số học.
5. **Cài đặt mã nguồn chuẩn Vectorized (Clean Production Python)**: Cài đặt bằng NumPy / PyTorch với chú thích kích thước tensor (shape annotations), kiểm thử tự động với Pytest.

### 2.3. Hệ Thống Bài Tập & Câu Hỏi Tư Duy 4 Nhóm Bắt Buộc
Cuối mỗi chương bắt buộc phải có hệ thống bài tập toàn diện gồm 4 nhóm:
1. **Nhóm A — Câu hỏi Tư duy Bản chất (Conceptual & Architectural Questions)**: Đặt các câu hỏi tại sao, so sánh các phương án kiến trúc đối nghịch.
2. **Nhóm B — Bài toán Tính toán Giải tích & Số học (Analytical & Mathematical Calculations)**: Tính toán phân bổ VRAM, tốc độ suy luận, băng thông mạng, ma trận đạo hàm.
3. **Nhóm C — Thực hành Lập trình Kỹ nghệ (Hands-on Implementation Labs)**: Xây dựng các thành phần hệ thống từ số 0 mà không dùng thư viện có sẵn.
4. **Nhóm D — Debugging & Thất bại Thực tế (Troubleshooting & Adversarial Scenarios)**: Phân tích log lỗi, truy vết bộ nhớ bị rò rỉ, phát hiện lỗ hổng tiêm mã và vá lỗi.
5. **Phần Hướng Dẫn Lời Giải Toàn Diện (Comprehensive Guided Solutions)**: Cung cấp lời giải mẫu và phân tích tư duy cho toàn bộ bài tập.

---

## 3. CẤU TRÚC 15 CHƯƠNG TOÀN BỘ SÁCH (~400 TRANG)

```text
PHẦN I: ĐỊNH HƯỚNG & KỸ NGHỆ HỆ THỐNG CỐT LÕI (85 TRANG)
├── Chương 1: Toàn Cảnh Hệ Thống AI & Chân Dung Kỹ Sư AI Chuyên Nghiệp (Phase 0) [~25 trang]
├── Chương 2: Kỹ Nghệ Python Chuyên Sâu Cho Kỹ Sư AI (Phase 1.1) [~30 trang]
└── Chương 3: Khoa Học Máy Tính, Linux, Mạng & Hạ Tầng Backend (Phase 1.2) [~30 trang]

PHẦN II: NỀN TẢNG TOÁN HỌC, HỌC MÁY & HỌC SÂU (55 TRANG)
├── Chương 4: Toán Học Ứng Dụng: Đại Số Tuyến Tính, Giải Tích & Xác Suất Cho AI (Phase 2.1) [~25 trang]
└── Chương 5: Machine Learning & Deep Learning Từ Bản Chất Thuần Túy (Phase 2.2) [~30 trang]

PHẦN III: KỸ NGHỆ TRANSFORMER & MÔ HÌNH NGÔN NGỮ LỚN (55 TRANG)
├── Chương 6: Giải Phẫu Toàn Diện Kiến Trúc Transformer & Cơ Chế Attention (Phase 3.1) [~25 trang]
└── Chương 7: Vận Hành Suy Luận LLM, Tokenomics & Tối Ưu KV Cache (Phase 3.2) [~30 trang]

PHẦN IV: HỆ THỐNG RAG DOANH NGHIỆP & AI AGENT TỰ HÀNH (55 TRANG)
├── Chương 8: Kỹ Nghệ RAG Cấp Sản Xuất, Vector Store & Tìm Kiếm Lai Đa Tầng (Phase 4.1) [~25 trang]
└── Chương 9: AI Agent Tự Hành, Đồ Thị Trạng Thái LangGraph & Đánh Giá Định Lượng (Phase 4.2) [~30 trang]

PHẦN V: VẬN HÀNH SẢN XUẤT, TỐI ƯU HÓA & AN NINH MẠNG AI (75 TRANG)
├── Chương 10: Đóng Gói Docker, Model Serving Siêu Tốc Với vLLM & MLOps Pipeline (Phase 5.1) [~25 trang]
├── Chương 11: Lượng Tử Hóa (Quantization) & Tinh Chỉnh LoRA Chuyên Sâu (Phase 5.2) [~25 trang]
└── Chương 12: Giao Thoa Mạng Máy Tính, An Ninh Mạng & Phòng Thủ Hệ Thống AI (Phase 6) [~25 trang]

PHẦN VI: THIẾT KẾ HỆ THỐNG QUY MÔ LỚN, ĐỒ ÁN KỲ HẠM & SỰ NGHIỆP (75 TRANG)
├── Chương 13: Thiết Kế Kiến Trúc Hệ Thống AI Triệu Người Dùng (AI System Design - Phase 7) [~25 trang]
├── Chương 14: Đồ Án Kỳ Hạm: Nền Tảng AI-NetSecOps Hoàn Chỉnh (Phase 8) [~30 trang]
└── Chương 15: Chiến Lược Sự Nghiệp, Portfolio Quốc Tế & Chinh Phục 6 Vòng Phỏng Vấn (Phase 9) [~20 trang]

PHẦN VII: PHỤ LỤC TRA CỨU & SỔ TAY KỸ SƯ (25 TRANG)
├── Phụ lục A: Bảng Tra Cứu Thuật Ngữ Kỹ Thuật Song Ngữ Anh - Việt Toàn Diện [~10 trang]
├── Phụ lục B: Sổ Tay Lệnh Thực Chiến Linux, Docker, Mạng & Vận Hành AI [~8 trang]
└── Phụ lục C: Tổng Hợp Chứng Minh Toán Học & Thước Đo Hiệu Năng [~7 trang]
```

---

## 4. TIÊU CHÍ NGHIỆM THU TỔNG THỂ
- **Độ dài**: Đạt quy mô ~400 trang A4 khi hoàn thành trọn bộ 15 chương.
- **Biên dịch**: 100% bằng `pdfLaTeX`, 0 warning, 0 error.
- **Chất lượng**: Không có placeholder dang dở, các công thức toán học có chứng minh nguồn gốc, mã nguồn có type-hinting và test suite Pytest tự động.

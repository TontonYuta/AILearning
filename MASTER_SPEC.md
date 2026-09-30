# MASTER_SPEC.md — ĐẶC TẢ KỸ THUẬT TOÀN DIỆN DỰ ÁN GIÁO TRÌNH AI ENGINEER

| Thuộc tính | Giá trị |
| :--- | :--- |
| **Tên dự án** | Autonomous AI Engineer Curriculum & Textbook |
| **Phiên bản Master Spec** | v1.0.0 |
| **Compiler chuẩn** | `pdfLaTeX` (TeX Live 2025/Debian) |
| **Ngôn ngữ** | Tiếng Việt (Thuật ngữ kỹ thuật quốc tế chuẩn xác) |
| **Định dạng phát hành** | PDF chất lượng cao (A4, Printable, Serif Typography) |
| **Target Audience** | Người mới bắt đầu (Beginner từ số 0) đến Kỹ sư AI thực chiến |

---

## 1. TẦM NHÌN VÀ TRIẾT LÝ HỆ THỐNG

### 1.1. Triết lý đào tạo
```text
Không học để biết nhiều công nghệ.
Học để HIỂU → XÂY ĐƯỢC → DEBUG ĐƯỢC → TEST ĐƯỢC → SECURE ĐƯỢC → DEPLOY ĐƯỢC → GIẢI THÍCH ĐƯỢC → CHỨNG MINH ĐƯỢC.
```

### 1.2. Chuỗi chuyển hóa năng lực kỹ thuật
Mỗi kỹ sư được đào tạo phải nắm vững vòng đời đầy đủ của một hệ thống trí tuệ nhân tạo:
```text
Data Pipeline
     ↓
Model Selection / Fine-tuning
     ↓
Inference Optimization
     ↓
Application Logic (FastAPI / LangGraph)
     ↓
Evaluation & Guardrails
     ↓
Containerization & Deployment (Docker / vLLM)
     ↓
Monitoring & Security Hardening
```

---

## 2. CHÍNH SÁCH CÔNG NGHỆ (TECHNOLOGY POLICY)

Không dàn trải mọi thư viện trên thị trường. Dự án phân loại công nghệ theo 4 mức độ:

### Mức 1: DEEP / CORE (Hiểu sâu bản chất, nắm vững từ gốc rễ)
- **Ngôn ngữ & Nền tảng**: Python 3.11+, Git/GitHub, Linux Shell/OS internals, HTTP/REST API, SQL & PostgreSQL.
- **AI/ML Core**: Toán học ứng dụng (Đại số tuyến tính, Giải tích, Xác suất thống kê), Nguyên lý Machine Learning, PyTorch (Tensors, Autograd, Module, Custom Training Loop).
- **LLM Core**: Kiến trúc Transformer (Self-Attention, MHA, FFN, Positional Encoding, KV Cache), Nguyên lý suy luận LLM, Tokenization, Prompt Engineering, Structured Output, Tool/Function Calling.
- **RAG & Agent**: Chunking, Embedding, Vector Search, Hybrid Search (Dense + BM25), Reranking, Agent State Machine, Memory, Planning, Evaluation (Faithfulness, Relevance, Groundedness).
- **Hạ tầng & Vận hành**: Docker, Model Serving Architecture, Security Threat Modeling trong AI.

### Mức 2: LEARN ONE DEEPLY (Chọn 1 đại diện tốt nhất để đào sâu thực chiến)
- **Agent Framework**: `LangGraph` (Kiểm soát State Graph, Human-in-the-loop, Deterministic routing).
- **Vector Database**: `Qdrant` (High performance, filtering mạnh mẽ, hybrid search native).
- **LLM Serving Engine**: `vLLM` (PagedAttention, Continuous Batching, high throughput).
- **Experiment Tracking**: `MLflow` (Tracking metrics, parameters, artifacts).
- **CI/CD Automation**: `GitHub Actions` (Linting, Testing, Auto Build).

### Mức 3: KNOW / COMPARE (Hiểu kiến trúc, biết so sánh trade-off)
- **Agent frameworks**: CrewAI, AutoGen (so sánh với LangGraph).
- **Vector DBs**: Milvus, pgvector, Chroma.
- **Serving engines**: TGI (Text Generation Inference), TensorRT-LLM, Ollama.
- **Observability**: Langfuse, Weights & Biases (W&B).
- **Orchestration**: Kubernetes cơ bản.

### Mức 4: ADVANCED / OPTIONAL (Nội dung nâng cao, không bắt buộc cho beginner)
- Lập trình CUDA kernel mức sâu.
- Distributed training nghìn tỷ tham số.
- Pretraining mô hình nền tảng từ số 0 trên cụm siêu máy tính.

---

## 3. MÔ HÌNH SƯ PHẠM 3 TẦNG & QUY CHUẨN 20 BƯỚC MỖI BÀI HỌC

### 3.1. Mô hình nhận thức 3 tầng (Cognitive Depth Layers)
Mọi chủ đề kỹ thuật đều phải giải quyết 3 câu hỏi:
1. 🟢 **Tầng 1 — Beginner ("Cái này là gì? Tại sao cần nó?")**:
   - Dùng ví dụ đời thực, trực giác trực quan, không dùng buzzword chưa giải thích.
2. 🟡 **Tầng 2 — Engineer ("Nó hoạt động bên dưới như thế nào? Xây dựng nó ra sao?")**:
   - Mổ xẻ cơ chế hoạt động, phân tích luồng dữ liệu, viết code thực tế từ số 0.
3. 🔴 **Tầng 3 — Advanced ("Tại sao lại thiết kế như vậy? Đánh đổi kỹ thuật là gì? Nó có thể gãy ở đâu?")**:
   - Phân tích rủi ro, bẫy hiệu năng, lỗ hổng bảo mật, chi phí tính toán, câu hỏi phỏng vấn hóc búa.

### 3.2. Cấu trúc chuẩn mực 20 phần cho mỗi Lesson (Lesson Spec)
1. **Mục tiêu học tập (Learning Objectives)**: Xác định rõ người học làm được gì sau bài.
2. **Kiến thức tiên quyết (Prerequisites)**: Liệt kê rõ các bài học phụ thuộc trước đó.
3. **Tại sao điều này quan trọng (Why this matters)**: Đặt trong bối cảnh hệ thống thực tế.
4. **Bảng thuật ngữ (Terminology)**: Giải thích song ngữ Anh - Việt.
5. **Trực giác & Liên tưởng đời sống (Intuition)**: Giải thích bình dân, dễ hiểu.
6. **Lý thuyết cốt lõi (Theory)**: Cơ sở khoa học, công thức toán hoặc giao thức mạng.
7. **Mô hình tư duy (Mental Model / Architecture Diagram)**: Sơ đồ dòng dữ liệu ASCII/TikZ.
8. **Ví dụ giải mẫu từng bước (Worked Example)**: Walkthrough trực tiếp logic từng dòng.
9. **Hiện thực hóa mã nguồn (Implementation)**: Code Python chuẩn, clean, type-hinted.
10. **Phòng thực hành (Hands-on Lab)**: Hướng dẫn chạy thực tế trên máy người học.
11. **Hệ thống bài tập 6 cấp độ (Exercises Progression)**:
    - Level 1: Recall (Nhớ và nhận diện).
    - Level 2: Understand (Giải thích bản chất).
    - Level 3: Implement (Tự viết tính năng mới).
    - Level 4: Debug (Tìm và sửa lỗi trong đoạn code cố tình làm sai).
    - Level 5: Design (Thiết kế giải pháp giải quyết bài toán lớn).
    - Level 6: Engineering (Tối ưu hóa, thêm bảo mật, logging, tests).
12. **Lời giải & Chỉ dẫn chi tiết (Guided Solutions)**: Đáp án chuẩn mực cho bài tập.
13. **Kỹ năng Debugging (Debugging & Troubleshooting)**: Traceback thực tế và cách cô lập lỗi.
14. **Sai lầm phổ biến (Common Pitfalls)**: Những lỗi người mới hay mắc phải và cách phòng ngừa.
15. **Góc nhìn An toàn & Bảo mật (Security & Failure Modes)**: Khai thác thử và phòng thủ.
16. **Đánh đổi Kỹ thuật (Engineering Trade-offs)**: So sánh tốc độ vs độ chính xác vs chi phí.
17. **Bộ câu hỏi Phỏng vấn (Interview Questions & Defense)**: Các câu hỏi nhà tuyển dụng hỏi.
18. **Tóm tắt bài học (Summary)**: 3-5 gạch đầu dòng cốt lõi nhất.
19. **Bảng kiểm định năng lực (Checkpoint)**: Bộ câu hỏi trắc nghiệm/tự đánh giá.
20. **Kiến thức tiếp theo (Next Dependency)**: Cầu nối sang bài học kế tiếp.

---

## 4. QUY CHUẨN XUẤT BẢN LATEX (LATEX DESIGN SYSTEM)

### 4.1. Thông số ấn bản
- **Khổ trang**: A4 tiêu chuẩn (210mm x 297mm).
- **Lề trang (Geometry)**: Top = 2.5cm, Bottom = 2.5cm, Left = 2.4cm, Right = 2.4cm, Headheight = 16pt.
- **Kiểu trang**: Sách chuyên nghiệp (`book.cls`), hỗ trợ header/footer song song với `fancyhdr`.
- **Phông chữ (Typography)**:
  - Font chính: Serif chuẩn mực `mathptmx` (Times New Roman serif).
  - Font công thức toán: Đi kèm `mathptmx` đồng bộ độ đậm nhạt và đường nét.
  - Font mã nguồn (Monospace): `courier` hoặc `beramono` với tỷ lệ thu phóng hài hòa.
- **Hỗ trợ Tiếng Việt Unicode**: Package `vietnam` với encoding `utf8` và font metric `T5`.

### 4.2. Bảng màu chuẩn kỹ thuật (Grayscale & Professional Tone)
- **Primary Color (Navy Kỹ thuật)**: `#1E3A8A` (RGB: 30, 58, 138) - Dùng cho Chương, Section, Header.
- **Secondary Color (Teal Sâu)**: `#0F766E` (RGB: 15, 118, 110) - Dùng cho Subsection, Tips.
- **Accent Color (Tím Logic)**: `#6D28D9` (RGB: 109, 40, 217) - Dùng cho Từ khóa, Định nghĩa.
- **Warn Color (Hổ phách Kỹ thuật)**: `#B45309` (RGB: 180, 83, 9) - Dùng cho Cảnh báo, Rủi ro.
- **Danger Color (Đỏ Bảo mật)**: `#BE123C` (RGB: 190, 18, 60) - Dùng cho Lỗi bảo mật, Attack.
- **Success Color (Xanh Lá Debug)**: `#047857` (RGB: 4, 120, 87) - Dùng cho Solution, Test pass.
- **Nền phụ**: Xám nhạt dịu mắt `#F8FAFC`, đường viền thanh mảnh `#CBD5E1`.

### 4.3. Quy chuẩn Đánh nhãn (Label Conventions)
- Chương: `ch:<phase>-<topic>` (ví dụ: `\label{ch:p1-python}`)
- Mục: `sec:<topic>-<subtopic>` (ví dụ: `\label{sec:python-oop}`)
- Hình ảnh/Sơ đồ: `fig:<name>` (ví dụ: `\label{fig:transformer-flow}`)
- Bảng: `tbl:<name>` (ví dụ: `\label{tbl:quantization-comparison}`)
- Ví dụ / Bài tập: `ex:<name>` (ví dụ: `\label{ex:gradient-descent}`)

---

## 5. HỆ THỐNG KIỂM TRA CHẤT LƯỢNG (BUILD & QA SPECIFICATION)

### 5.1. Kịch bản biên dịch `scripts/build.sh`
- Chế độ: **Fail-fast**, báo lỗi ngay tại dòng lệnh đầu tiên thất bại.
- Cô lập: Toàn bộ file trung gian `.aux`, `.log`, `.toc`, `.out` tự động được dọn vào `build/auxiliary/`.
- Logs: Toàn bộ chi tiết biên dịch lưu trữ tại `build/logs/pdflatex.log`.
- Vòng lặp: Chạy 2 lượt `pdflatex` để giải quyết đầy đủ mục lục (TOC), bảng số liệu và liên kết chéo (`hyperref`).
- Đầu ra: File PDF hoàn chỉnh đặt tại `build/pdf/ai_engineer_curriculum.pdf`.

### 5.2. Kịch bản kiểm tra `scripts/check.sh`
- Kiểm tra sự tồn tại và tính nguyên vẹn của file PDF xuất xưởng.
- Phân tích log tìm kiếm:
  - Lỗi nghiêm trọng (Fatal error, Emergency stop, Undefined control sequence) -> Đánh trượt (FAIL).
  - Tham chiếu bị gãy (`Reference ... undefined`, `Citation ... undefined`) -> Báo ERROR.
  - Trùng lặp nhãn (`Label ... multiply defined`) -> Báo ERROR.
  - Tràn dòng (`Overfull \hbox` lớn hơn 15pt) -> Báo WARNING.
  - Từ khóa dang dở (`TODO`, `FIXME`, `PLACEHOLDER`, `CẦN BỔ SUNG`) trong mã nguồn -> Báo WARNING/ERROR.
- Trả về mã thoát (exit code): `0` nếu PASS, `1` nếu FAIL.

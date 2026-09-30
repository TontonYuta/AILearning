# AI Engineer Curriculum & Textbook (Mã Nguồn Giáo Trình Kỹ Sư AI Toàn Diện)

> **Bộ giáo trình kỹ nghệ AI hoàn chỉnh từ con số 0 đến cấp độ xây dựng, tối ưu hóa, bảo mật và vận hành hệ thống AI thực chiến.**  
> Biên soạn và phát hành chuẩn sách kỹ thuật bằng công nghệ xuất bản **pdfLaTeX**.

---

## 🎯 Triết lý Đào tạo Cốt lõi
```text
Không học để biết nhiều công nghệ.
Học để HIỂU → XÂY ĐƯỢC → DEBUG ĐƯỢC → TEST ĐƯỢC → SECURE ĐƯỢC → DEPLOY ĐƯỢC → GIẢI THÍCH ĐƯỢC → CHỨNG MINH ĐƯỢC.
```

---

## 🧭 Cấu trúc Lộ trình (10 Giai đoạn)

1. **Phase 0 — Orientation**: Định hướng nghề nghiệp, toàn cảnh hệ thống AI và vòng đời suy luận.
2. **Phase 1 — Engineering Foundation**: Python chuyên nghiệp, CS core, Linux, Networking, Backend FastAPI, PostgreSQL, Redis, Software Engineering.
3. **Phase 2 — AI/ML Foundation**: Toán học cho AI (Đại số tuyến tính, Giải tích, Xác suất), Machine Learning bản chất, Deep Learning & PyTorch.
4. **Phase 3 — LLM Engineering**: Bản chất Transformer, Self-Attention, KV Cache, LLM API Engineering, Structured Output, Tool Calling, Hugging Face.
5. **Phase 4 — RAG & Agent Engineering**: Production RAG (Qdrant, Hybrid Search, Reranking, Citations), RAG Evaluation, Autonomous Agents với LangGraph.
6. **Phase 5 — Production AI Engineering**: Đóng gói Docker, Model Serving với vLLM, Quantization (GGUF/AWQ), Fine-Tuning LoRA/QLoRA, MLOps (MLflow, CI/CD).
7. **Phase 6 — AI × Network × Cybersecurity**: Mạng chuyên sâu, AI cho Network, An ninh thông tin, AI cho An ninh mạng, AI Security (OWASP Top 10 for LLMs, Guardrails, Sandboxing).
8. **Phase 7 — System Design**: Thiết kế hệ thống AI phân tán, High-throughput serving cluster, Multi-tenant RAG, Tối ưu chi phí & độ trễ.
9. **Phase 8 — Projects / Capstone**: 10-15 Mini Projects, 3-5 Engineering Projects, Flagship Capstone: **AI Network / Security Operations Platform**.
10. **Phase 9 — Career**: Viết CV định lượng chuẩn ATS, xây dựng Portfolio GitHub, chiến lược vượt qua 6 vòng phỏng vấn kỹ thuật và bảo vệ đồ án.

---

## 🛠️ Hướng dẫn Biên dịch PDF (Build Instructions)

### Yêu cầu môi trường
- Hệ điều hành: Linux (Ubuntu/Debian khuyến nghị)
- TeX Live: Bản phân phối `texlive-full` hoặc cài đặt tối thiểu gồm: `pdflatex`, `vntex`, `mathptmx`, `tcolorbox`, `listings`, `fancyhdr`, `geometry`.
- Bash Shell.

### Lệnh biên dịch sách
Dự án được tự động hóa hoàn toàn thông qua bộ scripts trong thư mục `scripts/`:

```bash
# 1. Cấp quyền thực thi nếu chưa có
chmod +x scripts/build.sh scripts/check.sh

# 2. Biên dịch sách sang PDF (fail-fast, cô lập file trung gian)
./scripts/build.sh

# 3. Chạy bộ kiểm thử chất lượng QA (kiểm tra lỗi, cảnh báo, tham chiếu)
./scripts/check.sh
```

Kết quả PDF xuất xưởng sẽ nằm tại:
```text
build/pdf/ai_engineer_curriculum.pdf
```

---

## 📚 Cấu trúc Thư mục Nguồn

- `latex/`: Toàn bộ mã nguồn LaTeX đã module hóa (`main.tex`, `preamble.tex`, `commands.tex`, `environments.tex`, `metadata.tex`).
- `specs/`: Đặc tả chi tiết từng chương (`specs/chapters/`) và từng bài học (`specs/lessons/`).
- `docs/`: Bộ nhớ vĩnh viễn của dự án (`PROJECT_STATE.md`, `CURRENT_TASK.md`, `DECISIONS.md`, `GLOSSARY.md`, `DEPENDENCY_MAP.md`).
- `scripts/`: Kịch bản tự động hóa build và QA.
- `tests/`: Mã nguồn unit tests kiểm tra tính chạy được của code mẫu trong giáo trình.
- `build/`: Thư mục chứa file PDF đầu ra và logs biên dịch.

---

## ⚖️ Giấy phép & Bản quyền
Dự án được bảo trì theo quy chuẩn kỹ thuật phần mềm nghiêm ngặt. Chi tiết tham khảo `MASTER_SPEC.md` và `AGENTS.md`.

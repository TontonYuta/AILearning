# CURRENT_TASK.md — CONTRACT CÔNG VIỆC HIỆN TẠI

**TASK ID**: TASK-PHASE-3-AUTONOMOUS-AGENTS-AND-HIGH-THROUGHPUT-SERVING-COMPLETED  
**TASK TYPE**: Phase 3: Autonomous Agents (Reflexion Episodic Memory, AST Syntax Sandbox) & High-Throughput Model Serving (Continuous Batching, Triton BLS, 1F1B Pipeline Parallelism Bubble Fraction)  
**OBJECTIVE**: Mở rộng tài liệu trở thành Bách khoa toàn thư All-In-One AI Engineering (hướng tới 450-500+ trang), hoàn thành toàn diện Giai đoạn 3:
1. **Chương 9 (Tác Tử AI Tự Hành, Function Calling & Đồ Thị Trạng Thái LangGraph)**:
   - Kiến trúc tự suy ngẫm Reflexion (Shinn et al., NeurIPS 2023): Phân tách Actor, Evaluator, Self-Reflection và bộ nhớ phân tập Episodic Memory, xóa sạch vết lỗi để khắc phục triệt để hiện tượng ô nhiễm ngữ cảnh (Context Fatigue).
   - Rào chắn an toàn cấp cú pháp AST (Abstract Syntax Tree): Quét tĩnh `ast.walk`, kiểm duyệt danh sách trắng `ALLOWED_MODULES`, chặn hàm nguy hiểm `DANGEROUS_CALLS` (`eval`, `exec`, `__import__`), cấm khai thác thuộc tính dunder `DANGEROUS_ATTRIBUTES` (`__subclasses__`, `__builtins__`).
   - Hiện thực hóa Python chuẩn kỹ nghệ: `ReflexionAgent`, `ASTToolSecurityValidator`, `calculate_reflexion_success` (được kiểm thử tự động 100%).
   - Khối `simulationbox` với 2 prompt hoạt họa Manim CE 60fps mô phỏng vòng lặp Reflexion và rào chắn an toàn AST.
   - Mở rộng bài tập đa tầng (A.9, A.10, B.6, C.6, C.7) cùng hướng dẫn giải giải tích chi tiết từng bước.
2. **Chương 10 (Đóng Gói Docker, Model Serving vLLM, Triton & Hạ Tầng GPU)**:
   - Cơ chế Continuous Batching (Orca / vLLM): Lập lịch cấp độ bước lặp (Iteration-level Scheduling), trục xuất tức thì chuỗi sinh xong và nạp chuỗi mới token-by-token, triệt tiêu hoàn toàn bong bóng padding, kết hợp Chunked Prefill ổn định Inter-Token Latency.
   - Hạ tầng Triton Inference Server: Quản trị kho mô hình (Model Repository), BLS (Business Logic Scripting) với giao tiếp Zero-Copy qua IPC Shared Memory thay thế overhead tuần tự hóa HTTP microservices.
   - Lập lịch Pipeline Parallelism 1F1B (Megatron-LM): Dẫn xuất giải tích công thức tỷ lệ bong bóng lãng phí $F_{\text{bubble}} = \frac{p-1}{m+p-1} \approx \frac{p-1}{m}$, quy tắc vàng $m \ge 10p$ để đạt hiệu suất GPU $>90\%$, chặn trên bộ nhớ kích hoạt ở mức $\mathcal{O}(p)$.
   - Hiện thực hóa Python: `ContinuousBatchScheduler`, `PipelineParallelBubbleCalculator` (được kiểm thử tự động 100%).
   - Khối `simulationbox` với 2 prompt hoạt họa Manim CE 60fps mô phỏng Continuous Batching và lịch trình 1F1B Pipeline Parallelism.
   - Mở rộng bài tập (A.8, A.9, B.6, C.4, C.5) cùng lời giải giải tích chi tiết từng bước.
3. **Đạt chuẩn chất lượng tối cao**: 187 unit tests pass 100%, sách dày **434 trang**, `./scripts/check.sh` báo cáo **0 ERRORS, 0 WARNINGS, 0 INFOS, 0 OVERFULL HBOX**.

---

## SCOPE ĐÃ HOÀN TẤT (100%)
1. **Chương 9 (Autonomous Agents)**: Đã hoàn thành toàn bộ lý thuyết Reflexion, rào chắn cú pháp AST, code listings, simulationbox Manim CE, bài tập A.9, A.10, B.6, C.6, C.7 và lời giải chi tiết.
2. **Chương 10 (Docker Serving, Triton & GPU Infrastructure)**: Đã hoàn thành Continuous Batching, Triton BLS, Pipeline Parallelism 1F1B, dẫn xuất toán học $F_{\text{bubble}}$, code listings, simulationbox Manim CE, bài tập A.8, A.9, B.6, C.4, C.5 và lời giải chi tiết.
3. **Mã nguồn kiểm thử (`tests/test_ch09_agents.py` & `tests/test_ch10_serving.py`)**: Đạt 100% passing cho tất cả các thuật toán mới. Tổng số test suite đạt **187 unit tests**.
4. **Biên dịch & QA PDF**: Đạt **434 trang A4**, 0 Errors, 0 Warnings, 0 Overfull Hbox.

---

## KẾ HOẠCH BƯỚC TIẾP THEO (GIAI ĐOẠN 4)
1. **Chương 11 (Lượng Tử Hóa Nâng Cao, LoRA & Fine-Tuning Thực Chiến)**:
   - FP8 Serving (E4M3 vs E5M2 scale scaling), AWQ vs GPTQ activation-aware quantization.
   - DoRA (Weight-Decomposed Low-Rank Adaptation) và QLoRA NF4 k-quant double quantization.
   - Unit tests và `simulationbox` hoạt họa Manim CE 60fps.
2. **Chương 12 (An Ninh Hệ Thống AI, Jailbreak Defense & NeMo Guardrails)**:
   - Semantic Jailbreak attacks, Prompt Injection defenses, LLM-as-a-Judge guardrails, Colang flows.

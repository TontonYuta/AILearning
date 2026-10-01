# CURRENT_TASK.md — CONTRACT CÔNG VIỆC HIỆN TẠI

**TASK ID**: TASK-PHASE-4-QUANTIZATION-LORA-AND-AI-SECURITY-GUARDRAILS-COMPLETED  
**TASK TYPE**: Phase 4: Advanced Quantization & PEFT (FP8, AWQ LayerNorm Folding, DoRA Orthogonal Projection, QLoRA NF4/Double Quant) & AI Security / Guardrails (GCG Attack, Sliding-Window Perplexity Filter, 5-Tier Defense-in-Depth, NeMo Guardrails / Colang 2.0)  
**OBJECTIVE**: Mở rộng tài liệu trở thành Bách khoa toàn thư All-In-One AI Engineering (hướng tới 450-500+ trang), hoàn thành toàn diện Giai đoạn 4:
1. **Chương 11 (Lượng Tử Hóa Nâng Cao, LoRA & Fine-Tuning Thực Chiến)**:
   - FP8 Serving: So sánh định dạng E4M3 vs E5M2, dynamic per-tensor scaling vs delayed/static scaling trong vLLM / TensorRT-LLM.
   - Thuật toán AWQ (Activation-aware Weight Quantization): Bảo vệ kênh nổi bật qua grid search $\mathbf{s} = \mathbf{s}_X^\alpha$, giảm thiểu sai số tái tạo Frobenius norm, cơ chế LayerNorm Folding $W_{\text{LN}}' = W_{\text{LN}} \oslash \mathbf{s}$ triệt tiêu hoàn toàn chi phí độ trễ khi suy luận.
   - DoRA (Weight-Decomposed Low-Rank Adaptation): Phân rã độ lớn $\mathbf{m} = \|\mathbf{W}_0\|_c$ và hướng $\mathbf{V} = \mathbf{W}_0 + \frac{\alpha}{r}\mathbf{A}\mathbf{B}$, dẫn xuất giải tích ma trận chiếu trực giao $\mathbf{P}_{\mathbf{v}} = \mathbf{I} - \frac{\mathbf{v}\mathbf{v}^T}{\|\mathbf{v}\|_2^2}$ chứng minh $\mathbf{v}^T \nabla_{\mathbf{v}}\mathcal{L} = 0$.
   - QLoRA NF4 (NormalFloat-4): Dẫn xuất phân vị tối ưu qua nghịch đảo hàm phân phối Gauss tích lũy $\Phi^{-1}(\frac{i-0.5}{16})$, Double Quantization tiết kiệm $0.37305\text{ bits/param}$ ($3.04\text{ GiB}$ trên Llama-3-70B), Paged Optimizers trên CUDA Unified Memory.
   - Hiện thực hóa Python chuẩn kỹ nghệ: `AWQScaleOptimizer`, `DoRALinearLayer`, `QLoRADoubleQuantCalculator` (14 unit tests pass 100%).
   - Khối `simulationbox` với 2 prompt hoạt họa Manim CE 60fps mô phỏng AWQ LayerNorm Folding và DoRA Orthogonal Decomposition.
   - Mở rộng bài tập đa tầng (A.10, A.11, B.8, B.9, C.7, C.8, C.9) cùng hướng dẫn giải giải tích chi tiết từng bước.
2. **Chương 12 (An Ninh Hệ Thống AI, Jailbreak Defense & NeMo Guardrails)**:
   - Tấn công đối kháng trắng GCG (Greedy Coordinate Gradient, Zou et al., 2023): Xấp xỉ Taylor bậc nhất trên véc-tơ one-hot embedding $\nabla_{\mathbf{e}}\mathcal{L}$, trích xuất Top-$k$ ứng viên tọa độ $\mathcal{C}_i$, đánh giá forward pass theo lô mini-batch $B$, tính chuyển giao đối kháng (universal adversarial transferability).
   - Bộ lọc phòng thủ Perplexity (Perplexity-based Defense Filter): Định nghĩa độ bất định ngôn ngữ $\text{PPL}(X)$, kỹ thuật quét cửa sổ trượt Sliding-Window Perplexity ($W=20$), chính sách lọc ngưỡng kép ($\tau_{\text{overall}}=38.0, \tau_{\text{win}}=55.0$) phát hiện $100\%$ chuỗi đối kháng với $0\%$ cảnh báo giả.
   - Kiến trúc phòng thủ chiều sâu 5 tầng (5-Tier Defense-in-Depth): Tier 1 (Input Regex & PII), Tier 2 (Sliding Perplexity Filter), Tier 3 (Core LLM & Dynamic Canary Injection), Tier 4 (Output Canary & Secret Suppression), Tier 5 (AST Static Sandbox Execution & Resource Quotas).
   - NVIDIA NeMo Guardrails & Ngôn ngữ Colang 2.0: Bốn trụ cột rào chắn (Input, Dialog, Output, Execution Rails), mô hình hóa luồng đối thoại an toàn bằng cú pháp flow-based.
   - Hiện thực hóa Python: `GCGPerplexityFilter`, `MultiTierGuardrailEngine` (27 unit tests pass 100%).
   - Khối `simulationbox` với 2 prompt hoạt họa Manim CE 60fps mô phỏng thuật toán GCG vs Perplexity Filter và dây chuyền phòng thủ 5 tầng.
   - Mở rộng bài tập đa tầng (A.9, A.10, B.5, B.6, C.7, C.8) cùng hướng dẫn giải giải tích chi tiết từng bước.
3. **Đạt chuẩn chất lượng tối cao**: 196 unit tests pass 100%, sách đạt **461 trang A4**, `./scripts/check.sh` báo cáo **0 ERRORS, 0 WARNINGS, 0 INFOS, 0 OVERFULL HBOX**.

---

## SCOPE ĐÃ HOÀN TẤT (100%)
1. **Chương 11 (Quantization, LoRA & Alignment)**: Đã hoàn thành toàn bộ lý thuyết FP8, AWQ, DoRA, QLoRA NF4, Double Quantization, Paged Optimizers, code listings, simulationbox Manim CE, bài tập A.10-A.11, B.8-B.9, C.7-C.9 và lời giải chi tiết.
2. **Chương 12 (AI Security & Guardrails)**: Đã hoàn thành thuật toán GCG, bộ lọc Perplexity trượt, kiến trúc Guardrail 5 tầng, NeMo Guardrails & Colang 2.0, code listings, simulationbox Manim CE, bài tập A.9-A.10, B.5-B.6, C.7-C.8 và lời giải chi tiết.
3. **Mã nguồn kiểm thử (`tests/test_ch11_quant_lora.py` & `tests/test_ch12_security.py`)**: Đạt 100% passing cho tất cả các thuật toán mới. Tổng số test suite đạt **196 unit tests**.
4. **Biên dịch & QA PDF**: Đạt **461 trang A4**, 0 Errors, 0 Warnings, 0 Overfull Hbox.

---

## KẾ HOẠCH BƯỚC TIẾP THEO (GIAI ĐOẠN 5)
1. **Chương 13 (Thiết Kế Hệ Thống AI Quy Mô Lớn - Large-Scale AI System Design)**:
   - Kiến trúc 8 hệ thống phân tán cấp độ sản xuất: Multi-Region GPU Routing, Global Cache Tier, Disaster Recovery, SLO/SLA Budgeting, Distributed Rate Limiting.
   - Python simulators, bài tập thiết kế hệ thống thực tế và 60fps Manim CE prompts.
2. **Chương 14 (Tuyển Tập Đồ Án Tốt Nghiệp - Capstone Projects Cấp Cao)**:
   - Mở rộng chi tiết mã nguồn, sơ đồ hạ tầng, SRE Incident Runbooks, và production benchmark checklists.

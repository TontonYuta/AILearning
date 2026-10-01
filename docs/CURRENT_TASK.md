# CURRENT_TASK.md — CONTRACT CÔNG VIỆC HIỆN TẠI

**TASK ID**: TASK-PHASE-1-REASONING-GRPO-BITNET-COMPLETED  
**TASK TYPE**: Phase 1: Post-Training Reasoning AI (GRPO / DeepSeek-R1), Extreme Edge 1.58-Bit LLM (BitNet b1.58), Simulators & AI Prompts  
**OBJECTIVE**: Mở rộng tài liệu trở thành Bách khoa toàn thư All-In-One AI Engineering (hướng tới 450-500+ trang), hoàn thành toàn diện Giai đoạn 1:
1. Giải tích toán học và cơ chế thuật toán GRPO (DeepSeek-R1 / DeepSeekMath): triệt tiêu mạng Critic, chuẩn hóa lợi thế nhóm $\widetilde{A}_i = \frac{r_i - \bar{r}}{\sigma_r + \epsilon}$, bộ kiểm tra quy tắc tất định (Rule-Based Verifiers cho toán học và code), sự xuất hiện tự sinh của tư duy System 2 và khoảnh khắc bừng sáng (Aha-moment).
2. Lượng tử hóa cực hạn BitNet b1.58 (Microsoft Research): trọng số bậc ba $\{-1, 0, +1\}$, lý thuyết dung lượng thông tin Shannon $\log_2(3) \approx 1.585\text{ bits}$, đóng gói 5 tham số vào 1 byte ($1.6\text{ bits/tham số}$), triệt tiêu $100\%$ phép nhân ma trận dấu phẩy động bằng bộ cộng tích lũy số nguyên INT8 (tiết kiệm $>36\times$ năng lượng bán dẫn).
3. Hiện thực hóa mã nguồn Python chuẩn kỹ nghệ: `GRPOAdvantageEstimator` và `BitNetTernaryLinear` với 11 unit tests đạt 100% độ phủ.
4. Xây dựng khối `simulationbox` với AI Simulation Prompts (Manim CE 60fps) trực quan hóa cơ chế chuẩn hóa nhóm GRPO và kiến trúc vi mạch cộng số nguyên BitNet.
5. Mở rộng hệ thống bài tập đa tầng (A.8, A.9, B.6, B.7, C.5, C.6) cùng lời giải giải tích chi tiết từng bước.
6. Đạt chuẩn chất lượng tối cao: 177 unit tests pass 100%, sách dày **399 trang**, `./scripts/check.sh` báo cáo **0 ERRORS, 0 WARNINGS, 0 INFOS, 0 OVERFULL HBOX**.

---

## SCOPE ĐÃ HOÀN TẤT (100%)
1. **Chương 11 (Lượng Tử Hóa, LoRA, DPO, GRPO & BitNet b1.58)**:
   - Thêm `\subsection{Lượng Tử Hóa Cực Hạn 1.58-Bit: BitNet b1.58 \& Mạng Nơ-ron Bậc Ba (Ternary Weights)}` (Lý thuyết Shannon, đóng gói 1.6 bits/weight, Absmean scaling, triệt tiêu phép nhân, bảng năng lượng bán dẫn 7nm, Apple MLX runtime).
   - Thêm `\subsection{Thuật Toán GRPO (Group Relative Policy Optimization) \& Kỷ Nguyên Reasoning}` (DeepSeek-R1, triệt tiêu mạng Critic tiết kiệm 50% VRAM, Group Advantage $\widetilde{A}_i$, hàm mục tiêu Clipped Surrogate PPO, ước lượng KL Schulman, Rule-based verifiers, hiện tượng tự sinh Extended CoT / Aha-moment).
   - Thêm 2 ví dụ tính toán số học giải mẫu bằng tay:
     - Tính toán độ lợi thế nhóm GRPO ($G=4$) với thẻ think và boxed answer.
     - Tính toán nén ma trận BitNet b1.58 và thực hiện phép nhân ma trận thuần cộng/trừ số nguyên.
   - Thêm mã nguồn Python chuẩn kỹ nghệ `GRPOAdvantageEstimator` và `BitNetTernaryLinear`.
   - Thêm `simulationbox` với 2 Prompt hoạt họa Manim CE 60fps chi tiết cho GRPO và BitNet silicon adders.
   - Thêm bài tập A.8, A.9, B.6, B.7, C.5, C.6 và lời giải chi tiết.
2. **Kiểm thử tự động (`tests/test_ch11_quant_lora.py`)**:
   - Thêm 4 hàm test kiểm định: `test_grpo_rule_based_verifier`, `test_grpo_group_advantages_zero_mean_unit_variance`, `test_grpo_clipped_surrogate_loss`, `test_bitnet_ternary_quantization_and_forward`.
   - Toàn bộ suite 177 tests chạy thành công 100% trong 1.03s.
3. **Biên dịch & QA PDF**:
   - Tài liệu đạt **399 trang A4**, kích thước 2.0MB.
   - Script `./scripts/check.sh` xác nhận: **0 Errors, 0 Warnings, 0 Overfull Hbox**.

---

## KẾ HOẠCH BƯỚC TIẾP THEO (GIAI ĐOẠN 2)
1. **Chương 7 (LLM Runtime, Inference Engine & Tokenomics)**:
   - Chunked Prefill (Sarathi-Serve) giải quyết hiện tượng Preemption và Bubble GPU.
   - Speculative Decoding toán học: Dự đoán nháp (Draft Model / Medusa Heads) và chấp nhận xác suất qua Rejection Sampling / Speculative Verification.
   - PagedAttention & RadixAttention (SGLang) cho Prefix Caching đa tầng.
   - Unit tests và `simulationbox` hoạt họa Manim CE.
2. **Chương 8 (Advanced RAG & Multimodal Context)**:
   - ColBERT Late Interaction ($E_q \cdot E_d^T$ MaxSim).
   - GraphRAG (Knowledge Graph entity-relation extraction với Leiden community clustering).
   - Contextual Retrieval (Anthropic prompt caching + chunk context prepend).


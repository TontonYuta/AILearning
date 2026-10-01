# Bách Khoa Toàn Thư Kỹ Sư AI (All-In-One AI Engineer Curriculum & Enterprise Reference Manual)

[![Build & QA](https://img.shields.io/badge/QA_Check-0_Errors_|_0_Warnings-brightgreen.svg)]()
[![Pages](https://img.shields.io/badge/Pages-501_A4-blue.svg)]()
[![Unit Tests](https://img.shields.io/badge/Unit_Tests-208_Passed_100%25-success.svg)]()
[![Format](https://img.shields.io/badge/Format-Classic_Monograph_Serif-darkblue.svg)]()
[![License](https://img.shields.io/badge/License-Proprietary_Engineering-lightgrey.svg)]()

> **Bộ bách khoa toàn thư kỹ nghệ AI hoàn chỉnh từ con số 0 đến cấp độ thiết kế hệ thống phân tán, phục vụ quy mô lớn, tối ưu hóa phần cứng, bảo mật và vận hành hạ tầng AI thực chiến.**  
> Biên soạn và phát hành chuẩn sách chuyên khảo kinh điển (**Classic Engineering Monograph**) bằng công nghệ xuất bản **pdfLaTeX**, font Serif Times New Roman & Liberation Serif, bố cục thanh nhấn trang nhã, bảng biểu Booktabs chuẩn mực.

---

## 🎯 Triết Lý Kỹ Nghệ Cốt Lõi
```text
Không học để biết nhiều công nghệ rời rạc.
Học để HIỂU BẢN CHẤT TOÁN HỌC → XÂY DỰNG KIẾN TRÚC → TỐI ƯU HẠ TẦNG → 
DEBUG SỰ CỐ SẢN XUẤT → VIẾT BỘ KIỂM THỬ → BẢO MẬT ĐA TẦNG → 
TRIỂN KHAI PHÂN TÁN → BẢO VỆ THIẾT KẾ TRƯỚC HỘI ĐỒNG KỸ THUẬT.
```

---

## 📊 Chỉ Số Xuất Bản Kỹ Thuật (v2.0.0 Milestone)

- **Độ dài chính thức**: **501 Trang A4** chuẩn in ấn học thuật và tài liệu tham chiếu doanh nghiệp.
- **Tập tin phát hành**: [`build/pdf/ai_engineer_curriculum.pdf`](build/pdf/ai_engineer_curriculum.pdf) (2.5 MB).
- **Bộ kiểm thử tự động**: **208 tests passed 100%** trên 29 files kịch bản kiểm thử trong `tests/` (`pytest`).
- **Chỉ số QA (`scripts/check.sh`)**: **0 Errors, 0 Warnings, 0 Overfull Hbox (>15pt), 0 Broken References**.
- **Visual Simulations**: Toàn bộ 16 chương đều tích hợp prompt diễn họa toán học **Manim CE 60fps** (font Serif Times New Roman, bố cục Dual-Zone).

---

## 🧭 Cấu Trúc Toàn Diện (16 Chương & 5 Phụ Lục)

### Phần I: Nền Tảng Kỹ Nghệ & Hệ Thống (Phases 0 & 1)
- **Chương 00: Định Hướng & Bản Đồ Năng Lực AI Engineer**: FinOps AI, TCO GPU Cloud vs On-premise, Ma trận năng lực T-Shaped, lộ trình thăng tiến Senior/Staff AI Architect.
- **Chương 01: Python Chuyên Sâu Cho AI Systems**: Cơ chế GIL, Garbage Collection cyclic detector, `__slots__` layout, AsyncIO Event Loop, Zero-Copy shared memory buffers.
- **Chương 02: Hệ Thống, Hạ Tầng & Mạng Tính Toán Tốc Độ Cao**: RDMA over Converged Ethernet (RoCEv2), InfiniBand NDR 400G, Ring-AllReduce vs Tree-AllReduce, Linux cgroups v2, NVIDIA Container Toolkit.

### Phần II: Toán Học Ứng Dụng & Học Máy Lõi (Phase 2)
- **Chương 03: Toán Học Cốt Lõi Cho AI Engineer**: Phân rã ma trận SVD, PCA, xấp xỉ Eckart-Young-Mirsky, Bổ đề Johnson-Lindenstrauss, Bất đẳng thức Jensen, Softmax Jacobian & Log-Sum-Exp ổn định số học.
- **Chương 04: Học Máy Cổ Điển & Tối Ưu Hóa Tham Số**: Gradient Descent, Momentum, AdamW weight decay decoupling, Logistic Regression Hessian matrix, ROC-AUC, PR-AUC, Cross-Entropy Loss.

### Phần III: Transformer & LLM Runtime Engine (Phase 3)
- **Chương 05: Kiến Trúc Transformer Từ Bản Chất Sâu Xa**: Scaled Dot-Product Attention, FlashAttention-2 tiling & SRAM IO complexity, RMSNorm, RoPE số phức & mở rộng ngữ cảnh YaRN.
- **Chương 06: LLM Runtime, Tokenomics & Tăng Tốc Suy Luận**: PagedAttention, SGLang Radix Tree prefix caching, Speculative Decoding với chứng minh Rejection Sampling không mất mát phân phối ($P(X=x) \equiv p(x)$), Medusa Multi-Head Tree Attention.

### Phần IV: RAG Doanh Nghiệp, Đa Tác Tử & Suy Luận Phức Hợp (Phase 4)
- **Chương 07: Enterprise RAG & Không Gian Ngữ Nghĩa Véc-Tơ**: ColBERT Late Interaction (MaxSim token alignment), ColPali Vision Retrieval không cần OCR, PLAID centroid compression, GraphRAG với giải thuật phân cụm Leiden (C0/C1/C2) & Global Search Map-Reduce.
- **Chương 08: Hệ Thống Tác Tử Tự Hành (Autonomous Agents)**: Vòng lặp tăng cường bằng lời nói Reflexion với Episodic Memory, LangGraph State Graphs với checkpointer & time-travel rollback, AST Syntax Sandbox cách ly mã độc.
- **Chương 09: Mô Hình Suy Luận Cấp Cao & Căn Chỉnh Hành Vi**: GRPO (Group Relative Policy Optimization) không cần mạng Critic (DeepSeek-R1), Group Advantage $\widetilde{A}_i = \frac{r_i - \bar{r}}{\sigma_r + \epsilon}$, Rule-based verifiers, Tư duy Hệ thống 2 (Aha-moment), DPO, ORPO, SimPO.

### Phần V: Tối Ưu Hóa Sản Xuất, Tinh Chỉnh & Cụm Phục Vụ (Phase 5)
- **Chương 10: Phục Vụ Quy Mô Lớn, Docker & Triton Server**: Iteration-level Continuous Batching (Orca/vLLM), Triton BLS Zero-Copy IPC memory, 1F1B Pipeline Parallelism với công thức bong bóng trễ $F_{\text{bubble}} = \frac{p-1}{m}$.
- **Chương 11: Lượng Tử Hóa Nâng Cao & Tinh Chỉnh Tham Số Hiệu Quả**: FP8 (E4M3 vs E5M2) dynamic scaling, AWQ grid search & LayerNorm scale folding, DoRA trực giao hóa hướng và độ lớn, QLoRA NF4 quantiles qua hàm phân phối chuẩn tích lũy $\Phi^{-1}$, Double Quantization tiết kiệm $0.373\text{ bits/param}$, BitNet b1.58 ternary weights $\{-1, 0, +1\}$.
- **Chương 12: An Ninh AI, Phòng Vệ Đa Tầng & Guardrails**: GCG (Greedy Coordinate Gradient) tấn công đối kháng qua xấp xỉ Taylor bậc một $\nabla_e \mathcal{L}(p)$, Bộ lọc Perplexity Scanner phòng vệ cửa sổ trượt, Kiến trúc phòng vệ 5 tầng Defense-in-Depth, NVIDIA NeMo Guardrails & Colang 2.0.

### Phần VI: Thiết Kế Hệ Thống Quy Mô Lớn & Đồ Án Kỳ Hạm (Phases 5 & 6)
- **Chương 13: Thiết Kế Hệ Thống AI Quy Mô Lớn (AI System Design)**:
  - Định tuyến GPU đa vùng toàn cầu ($L_{\text{eff}} = L_{\text{base}} \times (1 + \text{Load}/\text{Capacity})$) & Cascading Fallback sang Cloud.
  - Máy trạng thái ngắt mạch 3 pha (3-Phase Circuit Breaker: CLOSED / OPEN / HALF-OPEN với $5\%$ canary probe).
  - Quản trị lưu lượng phân tán Distributed Token Bucket nạp thẻ vi sai thời gian.
  - Lý thuyết hàng đợi M/M/c & Hiện tượng bùng nổ độ trễ đuôi $P99/P99.9$ giải thích tại sao ngưỡng Autoscaling phải là $70\% - 75\%$.
  - Quản trị SLO/SLA Error Budgeting & Burn Rate $14.4\times$ Critical Pager.
- **Chương 14: Đồ Án Kỳ Hạm & Tuyển Tập Sản Phẩm Cấp Doanh Nghiệp**:
  - *Capstone 1*: Trung tâm điều hành an ninh mạng tự hành AI-NetSecOps (LangGraph Multi-Agent, RAG MITRE ATT&CK, HITL Breakpoints, Rollback LIFO).
  - *Capstone 2*: Trợ lý đối soát tài chính đa phương thức & phát hiện gian lận bằng Định luật Benford ($P(d) = \log_{10}(1+1/d)$) và kiểm định Chi-Square ($\chi^2 = 78.71 \gg 15.507$).
  - *Capstone 3*: Nền tảng gợi ý sản phẩm Two-Tower Neural Search $d=256$, eCPM Multi-task ranking, Maximal Marginal Relevance (MMR) đa dạng hóa kết quả.
  - *Capstone 4*: SRE tự hành & OpenTelemetry Distributed Tracing Root Cause Analysis (tách biệt Duration vs Self-Time).
  - Chuẩn hóa DDL SQL Schema sổ cái bất biến (`immutable_audit_ledger` với SHA-256 Chaining).
- **Chương 15: Sự Nghiệp, Portfolio & Phỏng Vấn AI System Design Cấp Cao**:
  - Chiến lược xây dựng Monorepo Portfolio chuẩn quốc tế thu hút CTO/Head of AI.
  - Ma trận 4 câu hỏi phỏng vấn thực chiến: Global AI Code Completion $P99 < 80\text{ms}$, Multi-Modal Enterprise Agentic Workflow, Real-Time Video Understanding, và Bản lĩnh bảo vệ kiến trúc trước Hội đồng Kỹ thuật.
  - Bảng tra cứu công thức tính nhanh Back-of-the-Envelope (VRAM, Bandwidth, Throughput, TCO, Storage).
  - Mô phỏng Python `BackOfTheEnvelopeEstimator` & 5 unit tests pass 100%.

### Bộ 5 Phụ Lục Bách Khoa Toàn Thư (Appendices A-E)
- **Phụ lục A: Thuật Ngữ Anh - Việt Chuẩn Kỹ Nghệ AI**: Chuẩn hóa hàng trăm thuật ngữ AI/ML/Systems sang tiếng Việt học thuật chuẩn xác.
- **Phụ lục B: Bản Thảo Toán Học Chuyên Sâu (Mathematical Codex)**: SVD/LoRA low-rank energy decay, Chinchilla scaling laws, MoE Noisy Top-$k$ routing & chứng minh Cauchy-Schwarz cho Auxiliary Loss, M/G/1-PS queueing theory & Sakata insensitivity.
- **Phụ lục C: Bảng Tra Cứu Nhanh & Lệnh Thực Chiến (Cheatsheets)**: 10 chuyên đề tra cứu: PyTorch distributed, Docker/K8s/Triton, vLLM parameters, RoPE math, LoRA configs, Quantization formats, RAG trade-offs, Agent safety AST whitelists, GPU Hardware Sizing Guide (A100, H100, H200, B200, L40S, L4), PromQL & Grafana SRE monitoring.
- **Phụ lục D: Nhật Ký Mổ Xẻ Sự Cố Sản Xuất (Post-Mortem Runbooks)**: 10 sự cố thực tế mổ xẻ tận gốc rễ: Vector DB leak, Prompt Injection RCE, GPU Silent Data Corruption, Cascading OOM, Triton IPC leak, Quantization Outlier collapse, PagedAttention cache thrashing, Anycast BGP route flapping & TCP RST, CUDA IPC leak & NCCL Watchdog deadlock, HNSW Graph Islanding under Soft-Delete Tombstoning.
- **Phụ lục E: Sổ Tay Đồ Án Tốt Nghiệp (Capstone Workbook)**: 8 Đồ án doanh nghiệp hoàn chỉnh từ thiết kế kiến trúc, DDL cơ sở dữ liệu, code triển khai Python và kịch bản phản biện bảo vệ.

---

## 🛠️ Hướng Dẫn Biên Dịch & Chạy Kiểm Thử

### Yêu cầu môi trường
- Hệ điều hành: Linux (Ubuntu/Debian)
- TeX Live: Phân phối `texlive-full` (bao gồm `pdflatex`, `vntex`, `mathptmx`, `tcolorbox`, `listings`, `booktabs`)
- Python 3.10+ (cài đặt `pytest`, `numpy`, `torch` để chạy test suite)

### Lệnh thực thi

```bash
# 1. Cấp quyền thực thi cho kịch bản
chmod +x scripts/build.sh scripts/check.sh

# 2. Chạy toàn bộ 208 unit tests tự động
pytest

# 3. Biên dịch tài liệu sang PDF chuẩn xuất bản (2-pass pdfLaTeX)
./scripts/build.sh

# 4. Chạy bộ kiểm định chất lượng Zero-Tolerance QA
./scripts/check.sh
```

Kết quả PDF hoàn chỉnh được tạo tại:
```text
build/pdf/ai_engineer_curriculum.pdf
```

---

## 📚 Cấu Trúc Thư Mục Nguồn

```text
├── build/
│   └── pdf/
│       └── ai_engineer_curriculum.pdf  # Sản phẩm PDF 501 trang hoàn thiện
├── docs/                               # Hồ sơ quản trị dự án
│   ├── CURRENT_TASK.md                 # Contract công việc
│   ├── PROJECT_STATE.md                # Trạng thái hiện tại
│   └── ...
├── latex/                              # Mã nguồn tài liệu LaTeX chuẩn hóa
│   ├── appendices/                     # Phụ lục A đến E
│   ├── chapters/                       # Chương 00 đến 15
│   ├── frontmatter/                    # Trang bìa, lời nói đầu, mục lục
│   ├── commands.tex                    # Định nghĩa macro và cú pháp
│   ├── environments.tex                # Định nghĩa khối simulationbox, definitionbox,...
│   ├── metadata.tex                    # Siêu dữ liệu tài liệu
│   └── main.tex                        # Tệp gốc điều phối biên dịch
├── scripts/
│   ├── build.sh                        # Kịch bản biên dịch PDF tự động
│   └── check.sh                        # Kịch bản kiểm định QA tự động
├── specs/                              # Đặc tả kỹ thuật từng chương
└── tests/                              # 208 Unit tests kiểm thử toàn bộ mã nguồn
```

---

## ⚖️ Bản Quyền & Giấy Phép
Dự án được bảo trì theo quy chuẩn kỹ thuật phần mềm và xuất bản học thuật nghiêm ngặt.
Mọi mã nguồn mô phỏng và tài liệu được biên soạn nhằm phục vụ công tác nghiên cứu, đào tạo kỹ sư AI thực chiến và tham chiếu kỹ thuật doanh nghiệp.

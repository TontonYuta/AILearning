# PROJECT_STATE.md — TRẠNG THÁI HIỆN TẠI CỦA DỰ ÁN

| Chỉ số | Giá trị |
| :--- | :--- |
| **Project Version** | 1.4.0 (Phase 2: LLM Runtime Speculative/Radix & Enterprise RAG ColBERT/GraphRAG/Contextual, 417 Pages) |
| **Curriculum Scope** | 15 Chuyên đề chính + 5 Phụ lục thực chiến + Tuyển tập 8 Đồ án Cấp cao |
| **Total Pages** | **417 Trang A4 Chuẩn Xuất Bản** |
| **Unit Test Coverage** | **182 passed in 2.79s (100% Passing)** |
| **QA Verification** | **0 Errors, 0 Warnings, 0 Missing Citations, 0 Overfull Hbox** |
| **Last Build Status** | PASS (Exit code 0, 417 pages PDF via two-pass pdfLaTeX) |
| **PDF Artifact Path** | `build/pdf/ai_engineer_curriculum.pdf` (~2.1 MB) |
| **Git Branch** | `main` |
| **LLM Runtime & Tokenomics** | Lossless Speculative Decoding analytic proof ($P(X=x) \equiv p(x)$ via modified rejection sampling), Medusa multi-head tree attention, SGLang RadixAttention with hierarchical Radix Tree prefix caching, longest prefix matching, dynamic node splitting, and LRU eviction |
| **Enterprise RAG & Context** | ColBERT Late Interaction ($E_q \cdot E_d^T$ MaxSim token-level soft alignment), ColPali vision patch retrieval without OCR, PLAID fast centroid index, GraphRAG with Leiden hierarchical community clustering (C0/C1/C2) and Map-Reduce global search, Anthropic Contextual Retrieval with prompt caching cost optimization ($90\%$ cut) |
| **Reasoning & Alignment** | GRPO (DeepSeek-R1 / DeepSeekMath) with Critic-less RL, Group Advantage $\widetilde{A}_i = \frac{r_i - \bar{r}}{\sigma_r + \epsilon}$, Rule-based verifiers (format & SymPy math), System 2 thinking emergence / Aha-moment, DPO analytic derivation, ORPO, SimPO, PPO |
| **Extreme Edge AI** | BitNet b1.58 (Microsoft Research) with ternary weights $\{-1, 0, +1\}$, Shannon capacity $\log_2(3) \approx 1.585\text{ bits}$, bit-packing 5 weights/byte (1.6 bits/weight), elimination of float multipliers via integer addition/subtraction ($>36\times$ energy cut), Apple MLX & GGUF |
| **Networking & Security** | Physical $\to$ DataLink $\to$ Network $\to$ Transport $\to$ Web Protocols; Stack Frame Canary, Cryptography, Multi-Tenancy IAM, H100 Confidential GPU Enclaves, Adversarial Attacks, DP-SGD |
| **Simulations & Prompts** | `simulationbox` interactive simulators: Speculative Rejection Sampling, Radix Tree Cache Manager, ColBERT MaxSim Engine, Contextual Chunk Augmenter, GRPO Estimator, BitNet Linear; AI Simulation Prompts (Manim CE 60fps animations across all chapters) |
| **Capstone Portfolio** | 8 Đồ án: AI-SOC, Financial Audit, Clinical Copilot, Two-Tower Recommender, AI Firewall Proxy, Multi-Region Failover, Enterprise SRE Copilot, Executive Chief of Staff |

# PROJECT_STATE.md — TRẠNG THÁI HIỆN TẠI CỦA DỰ ÁN

| Chỉ số | Giá trị |
| :--- | :--- |
| **Project Version** | 1.5.0 (Phase 3: Autonomous Agents Reflexion/AST & Serving Continuous Batching/1F1B PP, 434 Pages) |
| **Curriculum Scope** | 15 Chuyên đề chính + 5 Phụ lục thực chiến + Tuyển tập 8 Đồ án Cấp cao |
| **Total Pages** | **434 Trang A4 Chuẩn Xuất Bản** |
| **Unit Test Coverage** | **187 passed in 2.71s (100% Passing)** |
| **QA Verification** | **0 Errors, 0 Warnings, 0 Missing Citations, 0 Overfull Hbox** |
| **Last Build Status** | PASS (Exit code 0, 434 pages PDF via two-pass pdfLaTeX) |
| **PDF Artifact Path** | `build/pdf/ai_engineer_curriculum.pdf` (~2.2 MB) |
| **Git Branch** | `main` |
| **Autonomous Agents & Tools** | Reflexion verbal reinforcement loop with episodic memory buffer (Shinn et al., 2023), AST syntax sandbox (module whitelist, dangerous call blocker, dunder attribute isolation), LangGraph state graphs with checkpointer & state forking, Multi-agent debate engine |
| **Serving & Infrastructure** | Iteration-level Continuous Batching (Orca/vLLM) with dynamic slot admission & zero-bubble scheduling, Chunked Prefill, Triton Inference Server BLS (Business Logic Scripting) with Zero-Copy IPC Shared Memory, Pipeline Parallelism 1F1B scheduling with analytical bubble fraction $F_{\text{bubble}} = \frac{p-1}{m}$ |
| **LLM Runtime & Tokenomics** | Lossless Speculative Decoding analytic proof ($P(X=x) \equiv p(x)$ via modified rejection sampling), Medusa multi-head tree attention, SGLang RadixAttention with hierarchical Radix Tree prefix caching, longest prefix matching, dynamic node splitting, and LRU eviction |
| **Enterprise RAG & Context** | ColBERT Late Interaction ($E_q \cdot E_d^T$ MaxSim token-level soft alignment), ColPali vision patch retrieval without OCR, PLAID fast centroid index, GraphRAG with Leiden hierarchical community clustering (C0/C1/C2) and Map-Reduce global search, Anthropic Contextual Retrieval with prompt caching cost optimization ($90\%$ cut) |
| **Reasoning & Alignment** | GRPO (DeepSeek-R1 / DeepSeekMath) with Critic-less RL, Group Advantage $\widetilde{A}_i = \frac{r_i - \bar{r}}{\sigma_r + \epsilon}$, Rule-based verifiers (format & SymPy math), System 2 thinking emergence / Aha-moment, DPO analytic derivation, ORPO, SimPO, PPO |
| **Extreme Edge AI** | BitNet b1.58 (Microsoft Research) with ternary weights $\{-1, 0, +1\}$, Shannon capacity $\log_2(3) \approx 1.585\text{ bits}$, bit-packing 5 weights/byte (1.6 bits/weight), elimination of float multipliers via integer addition/subtraction ($>36\times$ energy cut), Apple MLX & GGUF |
| **Networking & Security** | RDMA, RoCEv2, InfiniBand 400G, Ring-AllReduce vs Tree-AllReduce analytical models, PFC Headroom buffer sizing, Linux Namespaces, cgroups v2, OverlayFS CoW, NVIDIA Container Toolkit |
| **Simulations & Prompts** | `simulationbox` interactive simulators: Reflexion Loop, AST Sandbox, Continuous Batching Scheduler, 1F1B PP Bubble Calculator, Speculative Rejection Sampling, Radix Tree Cache Manager, ColBERT MaxSim Engine, Contextual Chunk Augmenter, GRPO Estimator, BitNet Linear; AI Simulation Prompts (Manim CE 60fps animations across all chapters) |
| **Capstone Portfolio** | 8 Đồ án: AI-SOC, Financial Audit, Clinical Copilot, Two-Tower Recommender, AI Firewall Proxy, Multi-Region Failover, Enterprise SRE Copilot, Executive Chief of Staff |

# PROJECT_STATE.md — TRẠNG THÁI HIỆN TẠI CỦA DỰ ÁN

| Chỉ số | Giá trị |
| :--- | :--- |
| **Project Version** | 1.3.0 (Phase 1: Post-Training Reasoning GRPO, BitNet b1.58 Ternary, 399 Pages) |
| **Curriculum Scope** | 15 Chuyên đề chính + 5 Phụ lục thực chiến + Tuyển tập 8 Đồ án Cấp cao |
| **Total Pages** | **399 Trang A4 Chuẩn Xuất Bản** |
| **Unit Test Coverage** | **177 passed in 1.03s (100% Passing)** |
| **QA Verification** | **0 Errors, 0 Warnings, 0 Missing Citations, 0 Overfull Hbox** |
| **Last Build Status** | PASS (Exit code 0, 399 pages PDF via two-pass pdfLaTeX) |
| **PDF Artifact Path** | `build/pdf/ai_engineer_curriculum.pdf` (~2.0 MB) |
| **Git Branch** | `main` |
| **Reasoning & Alignment** | GRPO (DeepSeek-R1 / DeepSeekMath) with Critic-less RL, Group Advantage $\widetilde{A}_i = \frac{r_i - \bar{r}}{\sigma_r + \epsilon}$, Rule-based verifiers (format & SymPy math), System 2 thinking emergence / Aha-moment, DPO analytic derivation, ORPO, SimPO, PPO |
| **Extreme Edge AI** | BitNet b1.58 (Microsoft Research) with ternary weights $\{-1, 0, +1\}$, Shannon capacity $\log_2(3) \approx 1.585\text{ bits}$, bit-packing 5 weights/byte (1.6 bits/weight), elimination of float multipliers via integer addition/subtraction ($>36\times$ energy cut), Apple MLX & GGUF |
| **Networking Depth** | Physical (Copper/Fiber/DAC) $\to$ DataLink (MAC/Ethernet/ARP/Switch CAM/VLAN) $\to$ Network (Bitwise Subnetting/LPM/IPv4 Header/ICMP Traceroute/NAT-PAT conntrack) $\to$ Transport (TCP 11-state FSM/Flow Control Sliding Window/TCP Window Scale RFC 7323 math) $\to$ Web Protocols (HTTP/1.1 vs HTTP/2 vs HTTP/3 QUIC) |
| **Security Depth** | Process Memory (Stack/Heap/BSS/Data/Text) $\to$ Buffer Overflow & Stack Canary $\to$ Cryptography (AES-GCM/ECC Curve25519/HMAC/PKI) $\to$ Network & App Attacks (Port Scan/SQLi/SSRF) $\to$ Multi-Tenancy IAM (Argon2id/JWT/RBAC/ABAC/PostgreSQL RLS) $\to$ Hardware Security (Spectre/Meltdown/NVIDIA H100 Confidential GPU Enclaves) $\to$ Adversarial Attacks (FGSM/PGD/GCG) $\to$ Differential Privacy (DP-SGD $\epsilon,\delta$) |
| **Simulations & Prompts** | `simulationbox` interactive simulators: GRPO Group Advantage Estimator, BitNet Ternary Pure Addition Linear, DHCP DORA pool manager, TCP Window Scale BDP calculator, Stack Frame Canary validator, DP-SGD gradient noise injector; AI Simulation Prompts (Manim CE 60fps animations for GRPO, BitNet, TCP handshake, DP-SGD, Red Team pen-testing). |
| **Capstone Portfolio** | 8 Đồ án: AI-SOC, Financial Audit, Clinical Copilot, Two-Tower Recommender, AI Firewall Proxy, Multi-Region Failover, Enterprise SRE Copilot, Executive Chief of Staff |


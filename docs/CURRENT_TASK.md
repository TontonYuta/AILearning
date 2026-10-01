# CURRENT_TASK.md — CONTRACT CÔNG VIỆC HIỆN TẠI

**TASK ID**: TASK-PHASE-5-SYSTEM-DESIGN-AND-CAPSTONE-PROJECTS-COMPLETED  
**TASK TYPE**: Phase 5: Large-Scale AI System Design (Multi-Region GPU Routing, 3-Phase Circuit Breaker, Distributed Token Bucket Rate Limiting, M/M/c Tail Latency Explosion, SLO/SLA Error Budgeting & Burn Rate) & 4 Flagship Enterprise Capstones (AI-NetSecOps HITL, Financial Audit Benford Fraud Detection, Two-Tower Recommender with MMR, Autonomous SRE Distributed Tracing RCA).  
**OBJECTIVE**: Mở rộng tài liệu trở thành Bách khoa toàn thư All-In-One AI Engineering (hướng tới 500+ trang), hoàn thành toàn diện Giai đoạn 5:
1. **Chương 13 (Thiết Kế Hệ Thống AI Quy Mô Lớn - Large-Scale AI System Design)**:
   - Kiến trúc định tuyến GPU đa vùng toàn cầu (Multi-Region Geo-Distributed Routing): Tính toán độ trễ hiệu dụng $L_{\text{eff}} = L_{\text{base}} \times (1 + \frac{\text{Load}}{\text{Capacity}})$, cơ chế chuyển hướng đa tầng linh hoạt (Cascading Fallback) sang Cloud Provider.
   - Máy trạng thái ngắt mạch 3 pha (3-Phase Circuit Breaker): CLOSED $\to$ OPEN $\to$ HALF-OPEN với thời gian hạ nhiệt $T_{\text{cooldown}}$ và tỷ lệ canary $5\%$ ngăn chặn bão yêu cầu Thundering Herd trên Cold Cache.
   - Quản trị lưu lượng phân tán \& Token Bucket: Nạp thẻ vi sai thời gian atomic refill, kiểm soát lưu lượng theo tầng gói cước (Free, Pro, Enterprise), tính toán `Retry-After`.
   - Cơ chế bùng nổ độ trễ đuôi $P99/P99.9$ dưới góc nhìn lý thuyết hàng đợi $M/M/c$: Dẫn xuất $W_q \propto \frac{\rho}{1-\rho}$ và phân phối đuôi hàm mũ $t_p \propto \frac{1}{c\mu(1-\rho)}\ln(\frac{C(c,\rho)}{1-p})$, lý giải tại sao Autoscaling không bao giờ được kích hoạt ở ngưỡng $90\%$ GPU utilization mà bắt buộc phải là $70\% - 75\%$.
   - Quản trị SLO/SLA \& Ngân Sách Sai Số (Error Budgeting): Định nghĩa toán học của Burn Rate $\frac{\text{Observed Error Rate}}{1 - \text{SLA}}$, phân tích lý do chọn $\text{Burn Rate} = 14.4\times$ làm ngưỡng Critical Pager Alert ($2\%$ ngân sách tháng bị thiêu rụi trong 1 giờ).
   - Hiện thực hóa Python chuẩn kỹ nghệ: `DistributedTokenBucketRateLimiter`, `MultiRegionGPURouter`, `SLOErrorBudgetCalculator` (15 unit tests pass 100%).
   - Khối `simulationbox` với 2 prompt hoạt họa Manim CE 60fps mô phỏng định tuyến GPU đa vùng và Token Bucket rate limiting.
   - Bài tập A.7-A.9, B.6-B.7, C.4-C.5 và lời giải giải tích chi tiết từng bước.
2. **Chương 14 (Đồ Án Kỳ Hạm & Tuyển Tập Sản Phẩm Cấp Doanh Nghiệp)**:
   - **Đồ án 1: AI-NetSecOps Platform**: Multi-Agent orchestration (LangGraph), Triage, RAG Threat Intel (MITRE ATT&CK), Static AST Guardrail, Immutable Allowlist, Human-in-the-Loop approval breakpoint, Transactional Rollback (LIFO).
   - **Đồ án 2: Enterprise Financial Audit & Fraud Detection Copilot**: Quy luật Benford $P(d) = \log_{10}(1 + 1/d)$, kiểm định độ phù hợp Chi-Square $\chi^2 = \sum \frac{(O_d - E_d)^2}{E_d}$ với 8 bậc tự do ($\chi^2_{\text{crit}} = 15.507$), phát hiện gian lận số liệu kế toán và hóa đơn khống, bộ lọc Pre-Audit Profiling chống báo động giả.
   - **Đồ án 3: Real-Time Two-Tower Recommender & Neural Search**: Kiến trúc 4 tầng (Query Expansion $\to$ Two-Tower Candidate Retrieval $d=256$ Cosine $\to$ Multi-Task eCPM Ranking $\to$ MMR Diversity Re-ranking), thuật toán Maximal Marginal Relevance loại trừ trùng lặp.
   - **Đồ án 4: Autonomous Enterprise SRE & Distributed Tracing RCA**: Thuật toán phân rã cây vết OpenTelemetry, tính toán Duration và Self-Time $\text{SelfTime}(S) = \text{Duration}(S) - \sum \text{Duration}(\text{Children})$, định vị chính xác microservice gây trễ $P99$ hoặc phát sinh lỗi.
   - Thiết kế cơ sở dữ liệu SQL chuẩn doanh nghiệp (bảng `enterprise_incidents`, `agent_execution_spans`, `immutable_audit_ledger` với SHA-256 Chaining).
   - Hiện thực hóa Python: `BenfordFraudDetector`, `TwoTowerSimilarityRetriever`, `MMRDiversityReranker`, `DistributedTraceRootCauseAnalyzer` (9 unit tests pass 100%).
   - 4 Prompt Manim CE 60fps mô phỏng trực quan hóa toàn bộ 4 đồ án kỳ hạm.
   - Bài tập A.5-A.7, B.4-B.6, C.3-C.5, D.3 và hướng dẫn giải giải tích chi tiết 100%.
3. **Đạt chuẩn chất lượng tối cao**: **203 unit tests pass 100%**, sách đạt **486 trang A4**, `./scripts/check.sh` báo cáo **0 ERRORS, 0 WARNINGS, 0 INFOS, 0 OVERFULL HBOX**.

---

## SCOPE ĐÃ HOÀN TẤT (100%)
1. **Chương 13 (Large-Scale AI System Design)**: Đã hoàn thành toàn bộ lý thuyết GPU Routing, Circuit Breaker, Rate Limiting, M/M/c queueing, Burn Rate, code listings, simulationbox Manim CE, bài tập và lời giải chi tiết.
2. **Chương 14 (Flagship Capstones)**: Đã hoàn thành 4 đồ án doanh nghiệp toàn diện, DDL SQL schema, code listings, 4 simulationbox Manim CE, bài tập mở rộng và lời giải chi tiết.
3. **Mã nguồn kiểm thử (`tests/test_ch13_system_design.py` & `tests/test_ch14_capstone.py`)**: Đạt 100% passing cho tất cả các thuật toán mới. Tổng số test suite đạt **203 unit tests**.
4. **Biên dịch & QA PDF**: Đạt **486 trang A4**, 0 Errors, 0 Warnings, 0 Overfull Hbox.

---

## KẾ HOẠCH BƯỚC TIẾP THEO (GIAI ĐOẠN 6)
1. **Chương 15 (Sự Nghiệp, Portfolio & Phỏng Vấn AI System Design Cấp Cao)**:
   - Chiến lược thiết kế hồ sơ năng lực (Portfolio & GitHub Monorepo Showcase) thu hút CTO/Head of AI.
   - Kỹ năng phỏng vấn System Design AI: Ma trận câu hỏi thực chiến, cách tính toán Back-of-the-envelope VRAM/Throughput/Bandwidth, phân tích trade-offs trước hội đồng kỹ thuật.
   - Python code & unit tests trong `tests/test_ch15_career.py`.
   - Simulation prompt Manim CE 60fps.
2. **Hoàn thiện các Phụ Lục (Appendices A-E)**:
   - Rà soát toàn bộ công thức toán học (Phụ lục B), Cheatsheets (Phụ lục C), Post-Mortem Runbooks (Phụ lục D), Capstone Workbook (Phụ lục E).
   - Mục tiêu: Chạm và vượt mốc **500+ trang A4** toàn diện, hoàn hảo từ trang bìa đến trang cuối cùng!

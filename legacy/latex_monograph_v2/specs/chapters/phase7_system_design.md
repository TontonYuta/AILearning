# SPEC: Phase 7 — Thiết Kế Kiến Trúc Hệ Thống AI Quy Mô Lớn (AI System Design)

## 1. Thông Tin Chung
- **Mã chương**: `ch:phase7-system-design`
- **Mục tiêu**: Nâng tầm năng lực kỹ sư từ việc code ứng dụng đơn lẻ lên thành Kiến trúc sư Hệ thống AI (AI System Architect), có khả năng thiết kế hệ thống chịu tải hàng triệu người dùng, tối ưu hóa chi phí token và độ trễ P99.

## 2. Các Phân Hệ Cốt Lõi
- **Nguyên Lý Thiết Kế Hệ Thống Cốt Lõi**:
  - Khả năng mở rộng ngang (Horizontal Scaling) vs mở rộng dọc (Vertical Scaling).
  - Cân bằng tải (Load Balancing), Hàng đợi thông điệp bất đồng bộ (Message Queues).
- **Thiết Kế Hệ Thống RAG Đa Thuê Bao (Enterprise Multi-Tenant RAG)**:
  - Cô lập dữ liệu giữa các công ty/khách hàng.
  - Bộ nhớ đệm hai tầng: Semantic Cache (ngữ nghĩa) + Exact Hash Cache.
- **Thiết Kế Cụm Suy Luận Thông Lượng Cao (High-Throughput Model Serving)**:
  - Định tuyến thông minh theo tải VRAM của cụm vLLM.
  - Chiến lược Fallback đa nhà cung cấp (Local vLLM $\leftrightarrow$ Cloud API).
- **Tối Ưu Hóa Chi Phí & Độ Trễ (Cost & Latency Optimization)**:
  - Định tuyến mô hình phân tầng (Tiered Model Routing: 8B cho câu dễ, 70B cho câu khó).
  - Kỹ thuật tận dụng Prompt Caching.

## 3. Tiêu Chuẩn Nghiệm Thu
- [x] Có sơ đồ kiến trúc hệ thống ASCII / tcolorbox chi tiết.
- [x] Có code Python runnable: Tiered Model Router, Two-Tier Cache Simulator.
- [x] Unit test kiểm thử trong `tests/test_phase7_system_design.py`.
- [x] Đầy đủ các hộp `definitionbox`, `intuitionbox`, `workedexamplebox`, `labbox`, `debugbox`, `securitybox`, `tradeoffbox`, `interviewbox`, `checkpointbox`.
- [x] Biên dịch và vượt qua QA 100%.

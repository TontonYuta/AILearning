# SPEC: Phase 6 — Giao Thoa Mạng Máy Tính, An Ninh Mạng & AI Security

## 1. Thông Tin Chung
- **Mã chương**: `ch:phase6-security`
- **Mục tiêu**: Trang bị năng lực ứng dụng AI vào giám sát hạ tầng mạng và trung tâm điều hành an ninh mạng (SOC), đồng thời làm chủ các kỹ thuật phòng thủ chống lại các véc-tơ tấn công đặc thù nhắm vào LLM (OWASP Top 10 for LLMs).

## 2. Các Phân Hệ Cốt Lõi
- **Mạng Máy Tính Chuyên Sâu & AI Cho Network**:
  - Tường lửa, IPTables, phân tích luồng gói tin qua `tcpdump`.
  - Xây dựng Network Log Analyzer và Troubleshooting Agent.
- **An Ninh Mạng & AI Cho Cybersecurity**:
  - Khung MITRE ATT&CK, hệ thống SIEM/SOC.
  - Alert Triage Agent tự động phân loại cảnh báo an ninh.
- **Bảo Mật Hệ Thống AI (AI Security & OWASP Top 10 for LLMs)**:
  - Tấn công Prompt Injection & Indirect Prompt Injection.
  - RAG Poisoning & Secret Exposure.
  - Tool Abuse & Excessive Agency.
  - Lớp phòng ngự chủ động: Guardrails (Input/Output filtering) và Sandboxing thực thi mã nguồn.

## 3. Tiêu Chuẩn Nghiệm Thu
- [x] Có bảng phân loại OWASP Top 10 for LLMs và giải pháp khắc phục.
- [x] Có code Python runnable: Regex + Vector Guardrail sanitizer, Alert Triage classifier.
- [x] Unit test kiểm thử trong `tests/test_phase6_security.py`.
- [x] Đầy đủ các hộp `definitionbox`, `intuitionbox`, `workedexamplebox`, `labbox`, `debugbox`, `securitybox`, `tradeoffbox`, `interviewbox`, `checkpointbox`.
- [x] Biên dịch và vượt qua QA 100%.

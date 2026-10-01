# CURRENT_TASK.md — CONTRACT CÔNG VIỆC HIỆN TẠI

**TASK ID**: TASK-NETWORKING-SECURITY-APPLIED-AI  
**TASK TYPE**: Comprehensive Ground-Zero Expansion (Systems Networking, Cryptography & Security, Real-World Applied AI Projects)  
**OBJECTIVE**: Nâng cấp toàn diện các chủ đề Mạng máy tính & An ninh mạng từ con số 0 tuyệt đối (Tầng vật lý, Tầng Data Link, ARP, Switch CAM, Subnetting Bitwise, IPv4 Header, ICMP Traceroute, NAT/PAT conntrack, DNS phân giải đệ quy, TCP FSM 11 trạng thái, Mật mã học AES-GCM/ECC/SHA/HMAC/PKI X.509, SSRF, SQLi, Multi-Tenancy IAM RBAC/RLS) và bổ sung 2 Đồ án thực chiến Đỉnh cao cho Doanh nghiệp & Cá nhân (Enterprise SRE Copilot & Executive Chief of Staff).

---

## SCOPE ĐÃ HOÀN TẤT (100%)
1. **Chương 3 (Mạng Máy Tính Từ Con Số 0 Tuyệt Đối)**:
   - Tầng Vật lý: Cáp đồng xoắn đôi Cat6/7, Cáp quang Single-mode/Multi-mode, Cáp DAC gắn trực tiếp cụm GPU, Băng thông, RTT, Jitter, Packet loss.
   - Tầng Liên kết dữ liệu (Data Link): Cấu trúc khung Ethernet IEEE 802.3 từng byte, Địa chỉ MAC 48-bit OUI, Giao thức ARP (Request/Reply/Bảng ARP Cache/Nguy cơ ARP Spoofing), Thiết bị Switch & Bảng CAM (MAC Learning, Full Duplex, Collision Domain vs Broadcast Domain, phân tách mạng ảo VLAN 802.1Q).
   - Tầng Mạng: Phép toán bitwise AND subnetting, Longest Prefix Match (LPM) trong routing table, Giải phẫu IPv4 Header 20-byte (IHL, TTL, Protocol, Checksum, Flags), Giao thức ICMP & Thuật toán hoạt động của `traceroute` qua cờ TTL, Kỹ thuật NAT/PAT & Bảng theo dõi kết nối `nf_conntrack` trong nhân Linux, DNS phân giải đệ quy (Root $\to$ TLD $\to$ Authoritative $\to$ Local Cache).
   - Tầng Giao vận: Cấu trúc TCP Header, Máy trạng thái hữu hạn TCP 11 trạng thái (`CLOSED` tới `TIME_WAIT` $2\times\text{MSL}$ và `CLOSE_WAIT`), Điều khiển luồng Cửa sổ trượt (Sliding Window `rwnd`), Tắt giải thuật Nagle (`TCP_NODELAY`) cho streaming token LLM.
2. **Chương 12 (An Ninh Mạng & Bảo Mật Từ Con Số 0)**:
   - Nền tảng mật mã học: Mã hóa đối xứng AES-256-GCM AEAD, Mã hóa bất đối xứng RSA & ECC Curve25519, Hàm băm một chiều SHA-256, Mã xác thực thông điệp HMAC (xác thực Webhook an toàn), Hạ tầng khóa công khai PKI & Chứng chỉ số X.509 (Chain of Trust, OCSP).
   - Kỹ thuật tấn công tầng ứng dụng & AI: Quét cổng Nmap (TCP Connect vs SYN Stealth scan), SQL Injection trong Text-to-SQL & Parameterized Queries, Server-Side Request Forgery (SSRF) trong AI browsing agents & Kiến trúc phòng thủ 3 lớp (DNS Pinning, IMDSv2).
   - Multi-Tenancy IAM: Băm mật khẩu Argon2id kèm Salt ngẫu nhiên, Giải phẫu chuẩn mực JWT (`Header.Payload.Signature`) và các lỗ hổng thường gặp, Phân quyền RBAC vs ABAC, Bảo vệ cơ sở dữ liệu Vector với Row-Level Security (RLS) trong PostgreSQL pgvector.
3. **Phụ lục E (Tuyển tập Đồ án Thực chiến Capstone)**:
   - **Đồ Án 7 (Doanh Nghiệp)**: Nền Tảng Hỗ Trợ Kỹ Thuật & Tự Động Hóa Vận Hành IT / SRE Cho Doanh Nghiệp (Enterprise Autonomous IT Helpdesk & SRE Copilot) - Phân loại ITIL P1-P4, Chẩn đoán Pod Crash (OOMKilled vs Upstream DB), Human-in-the-Loop và Tự động sinh báo cáo Post-Mortem.
   - **Đồ Án 8 (Cá Nhân / SME)**: Trợ Lý Giám Đốc Điều Hành Cá Nhân & Tự Động Hóa Quy Trình (Executive AI Chief of Staff & Workflow Automation) - Email Inbox Zero Triage, Thuật toán phát hiện xung đột lịch trình, Đối soát hóa đơn VAT và kiểm tra mã số thuế tự động.
4. **Kiểm Thử & Đảm Bảo Chất Lượng (QA)**:
   - Unit tests mở rộng từ 159 lên **167 tests** (`pytest tests/`) - PASS 100% (0.94s).
   - Biên dịch tài liệu pdfLaTeX: **367 trang A4**, kích thước 1.9 MB, đạt chuẩn **0 Errors, 0 Warnings, 0 Overfull Hbox**.

## STATUS
- **TRẠNG THÁI**: HOÀN THÀNH TOÀN DIỆN (COMPLETED).
- **FILE PDF XUẤT XƯỞNG**: `build/pdf/ai_engineer_curriculum.pdf`.

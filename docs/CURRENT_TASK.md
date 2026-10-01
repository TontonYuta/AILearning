# CURRENT_TASK.md — CONTRACT CÔNG VIỆC HIỆN TẠI

**TASK ID**: TASK-NETWORKING-SECURITY-SIMULATION-OVERHAUL  
**TASK TYPE**: Comprehensive Ground-Zero Systems Expansion, Memory Security, Confidential GPU Computing, Differential Privacy (DP-SGD) & AI Simulation Prompts  
**OBJECTIVE**: Mở rộng không giới hạn số trang của toàn bộ giáo trình, bổ sung kiến thức từ gốc tới nâng cao cho Mạng máy tính & An ninh bảo mật, giải phẫu bộ nhớ tiến trình (Stack Frame, Buffer Overflow, Stack Canary, DEP/NX, ASLR), An ninh phần cứng (Spectre/Meltdown cache timing, NVIDIA H100 GPU Confidential Computing Enclaves), Tấn công đối kháng Gradient (FGSM, PGD, GCG), Quyền riêng tư vi phân (DP-SGD $\epsilon, \delta$), xây dựng hạ tầng `simulationbox` kèm mô phỏng Python và Prompt AI trực quan hóa hoạt họa Manim CE 60fps & Red Team penetration testing.

---

## SCOPE ĐÃ HOÀN TẤT (100%)
1. **Chương 3 (Mạng Máy Tính Từ Con Số 0 Tuyệt Đối & Mô Phỏng)**:
   - Tầng Vật lý: Cáp đồng xoắn đôi Cat6/7, Cáp quang SMF/MMF, Cáp DAC cụm GPU, Băng thông, RTT, Jitter, Packet loss.
   - Tầng Data Link & Giao thức ARP: Khung Ethernet IEEE 802.3, MAC 48-bit OUI, ARP Request/Reply, Switch CAM learning, Collision vs Broadcast Domain, VLAN 802.1Q.
   - DHCP & Mô Phỏng DORA: Tiến trình 4 bước DHCP Discover-Offer-Request-Ack UDP 67/68, mã mô phỏng `DHCPPoolManager`, prompt giả lập Wireshark Packet Dissector.
   - Tầng Mạng: Bitwise Subnetting, LPM routing, IPv4 Header 20-byte, ICMP & Traceroute TTL, NAT/PAT & `nf_conntrack` table.
   - Tầng Giao vận & BDP Math: TCP 11-state FSM (`TIME_WAIT` vs `CLOSE_WAIT`), Flow control Sliding window, Toán học TCP Window Scale Option (RFC 7323) chống bóp nghẹt băng thông cáp quang cụm GPU, mã mô phỏng `TCPWindowScaleSimulator`.
   - Tiến hóa giao thức Web: So sánh toàn diện HTTP/1.1 vs HTTP/2 vs HTTP/3 QUIC (0-RTT, connection migration, triệt tiêu HoL blocking), prompt Manim CE 60fps diễn hoạt bắt tay TCP 3 bước.
2. **Chương 12 (An Ninh Mạng, Giải Phẫu Bộ Nhớ, Confidential GPU, DP-SGD & Guardrails)**:
   - Giải phẫu bộ nhớ tiến trình Linux 64-bit: Text/Code, Data, BSS, Heap (grows up), Stack (grows down).
   - Cơ chế tấn công Buffer Overflow & ROP: Khung ngăn xếp Stack Frame (Local buffer, Stack Canary, Saved RBP, Return Address RIP), ghi đè con trỏ lệnh, tam tầng phòng thủ Stack Canary (SSP), DEP/NX bit, và ASLR.
   - Bộ mô phỏng Stack Canary: Lớp Python `StackFrameCanarySimulator` phát hiện `StackSmashingDetectedError`, kèm prompt đấu trí Red Team vs Blue Team tầng bộ nhớ.
   - An ninh phần cứng & Confidential Computing: Kênh kề Spectre/Meltdown (`Flush+Reload`), GPU Shared Memory Bank Conflict, NVIDIA H100 Confidential Computing mode (mã hóa phần cứng bus PCIe qua AES-256-GCM, Remote Attestation với Hardware Root of Trust).
   - Tấn công đối kháng Gradient: FGSM (Goodfellow), PGD (Madry), GCG (Zou et al.) và Multimodal Vision-Language Jailbreak.
   - Quyền riêng tư vi phân (Differential Privacy): Định nghĩa toán học $(\epsilon, \delta)$-DP, thuật toán DP-SGD (Per-sample gradient clipping theo ngưỡng $C$, bơm nhiễu Gauss hiệu chuẩn $\sigma = \frac{\sqrt{2\ln(1.25/\delta)}}{\epsilon}$), mã mô phỏng `DPSGDNoiseSimulator`, prompt Manim CE 60fps trực quan hóa đám mây nhiễu Gauss trong không gian gradient 2D.
   - Hệ thống bài tập & Lời giải: Mở rộng bài tập A.7, A.8, B.4, C.5, C.6 với đầy đủ lời giải giải tích và mã nguồn.
3. **Phụ lục E (Tuyển tập Đồ án Thực chiến Capstone)**:
   - Đồ Án 7 (Doanh Nghiệp): Enterprise Autonomous IT Helpdesk & SRE Copilot (ITIL triage P1-P4, Pod Crash RCA, HITL, Automated Post-Mortem).
   - Đồ Án 8 (Cá Nhân / SME): Executive AI Chief of Staff & Workflow Automation (Inbox Zero triage, phát hiện xung đột lịch trình, đối soát hóa đơn VAT).
4. **Kiểm Thử & Đảm Bảo Chất Lượng (QA)**:
   - Unit tests mở rộng lên **173 tests** (`pytest tests/`) - PASS 100% trong 0.98s.
   - Biên dịch tài liệu pdfLaTeX 2-pass: **385 trang A4**, kích thước 2.0 MB.
   - Bộ kiểm định chất lượng `./scripts/check.sh`: **0 Errors, 0 Warnings, 0 Infos, 0 Overfull Hbox**.

## STATUS
- **TRẠNG THÁI**: HOÀN THÀNH XUẤT SẮC TOÀN DIỆN (COMPLETED).
- **FILE PDF XUẤT XƯỞNG**: `build/pdf/ai_engineer_curriculum.pdf`.

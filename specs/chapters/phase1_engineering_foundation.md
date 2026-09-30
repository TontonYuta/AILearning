# SPEC: Phase 1 — Nền Tảng Kỹ Nghệ Phần Mềm & Hệ Thống (Engineering Foundation)

## 1. Thông Tin Chung
- **Mã chương**: `ch:phase1-python` và `ch:phase1-systems`
- **Mục tiêu**: Đưa người học từ con số 0 trở thành một kỹ sư phần mềm vững vàng, làm chủ Python chuyên sâu, lập trình bất đồng bộ, hiểu sâu hệ điều hành Linux, mạng máy tính TCP/IP, thiết kế cơ sở dữ liệu quan hệ và xây dựng API hiệu năng cao với FastAPI.

## 2. Các Phân Hệ Cốt Lõi
### Phân hệ 1.1: Python Chuyên Nghiệp (Python Mastery)
- Collections và cơ chế lưu trữ bộ nhớ (Hash table trong Dict, Dynamic array trong List).
- Closures & Decorators: Xây dựng `@retry_with_backoff` và `@track_latency`.
- OOP & Composition: Xây dựng trừu tượng hóa cho BaseLLMClient và BaseTool.
- Generators & Streaming: Xử lý luồng token từ LLM API.
- Pydantic V2: Ép kiểu schema đầu vào/đầu ra JSON.
- Asyncio: Concurrency không nghẽn luồng với `asyncio.gather`.
- Unit Testing: Pytest và mock API bên ngoài.

### Phân hệ 1.2: Hệ Thống, Mạng & Backend (Systems, Networking & Backend)
- Tiến trình (Process) vs Tiểu trình (Thread) vs Coroutine (Event Loop).
- Linux Shell, permissions, systemd service cho AI server.
- Mạng máy tính: TCP handshake, DNS resolution, HTTP/1.1 vs HTTP/2, TLS handshake.
- FastAPI: Xây dựng REST API, Dependency Injection, Streaming SSE.
- PostgreSQL & Redis: Thiết kế bảng, B-tree indexes, ACID, Redis Caching.

## 3. Tiêu Chuẩn Nghiệm Thu
- [x] Đầy đủ 3 tầng nhận thức cho mọi bài học.
- [x] Mã nguồn thực tế runnable 100%, có unit test trong `tests/test_phase1_python.py` và `tests/test_phase1_systems.py`.
- [x] Có bảng so sánh kỹ thuật, sơ đồ luồng ASCII, các hộp debugbox, securitybox, interviewbox.
- [x] Biên dịch thành công với `scripts/build.sh` và `scripts/check.sh` báo PASS.

# MODULE 06: GIAO THỨC NGỮ CẢNH MÔ HÌNH (MODEL CONTEXT PROTOCOL - MCP)

> **Mục tiêu:** Nắm vững chuẩn mở công nghiệp **Model Context Protocol (MCP)** do Anthropic khởi xướng; tự xây dựng **MCP Server** và **MCP Client** theo đặc tả JSON-RPC 2.0 để kết nối các công cụ, cơ sở dữ liệu với các trợ lý AI hiện đại (Claude Desktop, Cursor, Antigravity).

---

## 1. Bài Toán Doanh Nghiệp Thực Tế

Trước khi có MCP, hệ sinh thái AI bị phân mảnh nghiêm trọng:
* Mỗi khi doanh nghiệp muốn tích hợp cơ sở dữ liệu PostgreSQL hoặc hệ thống Jira vào AI App, họ phải viết code adapter riêng cho từng nền tảng (1 adapter cho LangChain, 1 adapter cho LlamaIndex, 1 adapter cho Custom Bot).
* **Vấn đề kết nối N x M:** N ứng dụng AI kết nối M nguồn dữ liệu đòi hỏi $N \times M$ bộ tích hợp.

**Giải pháp với Model Context Protocol (MCP):**
* MCP hoạt động như cổng **USB-C cho các mô hình AI**.
* Mọi nguồn dữ liệu chỉ cần viết **duy nhất 1 MCP Server**. Bất kỳ MCP Client nào (Claude Desktop, IDE, Terminal Agent, Web Bot) đều có thể cắm vào và sử dụng ngay lập tức.

```text
[Ứng dụng AI / LLM Host] ── (JSON-RPC 2.0) ──> [MCP Server] ──> [Database / APIs / Files]
```

---

## 2. Ba Thành Phần Nguyên Bản (MCP Primitives)

Một MCP Server tiêu chuẩn cung cấp 3 tài nguyên chính:
1. **Tools (Công cụ):** Các hàm có thể thực thi với tham số (ví dụ: `query_database`, `send_email`).
2. **Resources (Tài nguyên):** Dữ liệu dạng URI chỉ đọc (ví dụ: `crm://customer/123`, `logs://production/latest`).
3. **Prompts (Khuôn mẫu gợi ý):** Các prompt template được chuẩn hóa cho từng ngữ cảnh.

---

## 3. Cấu Trúc Mã Nguồn Module 06

- [`protocol.py`](protocol.py): Đặc tả các gói tin JSON-RPC 2.0 chuẩn MCP (`Request`, `Response`, `ToolDefinition`, `ResourceDefinition`).
- [`server.py`](server.py): `EnterpriseMCPServer` quản lý đăng ký và phản hồi `tools/list`, `tools/call`, `resources/read`.
- [`client.py`](client.py): `EnterpriseMCPClient` kết nối tới Server, tự động khám phá công cụ và gửi lệnh thực thi.
- [`main.py`](main.py): File thực thi chạy phiên giao tiếp Client - Server hoàn chỉnh.
- [`test_module06.py`](test_module06.py): Bộ kiểm thử `pytest` xác minh tính tương thích JSON-RPC 2.0.

---

## 4. Hướng Dẫn Chạy & Kiểm Thử

```bash
# Chạy demo trực tiếp
python -m modules.module06_model_context_protocol.main

# Chạy test suite
pytest modules/module06_model_context_protocol/test_module06.py -v
```

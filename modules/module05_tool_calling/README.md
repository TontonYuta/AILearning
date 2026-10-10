# MODULE 05: TOOL CALLING & TÍCH HỢP CÔNG CỤ NGOẠI VI TRONG SANDBOX

> **Mục tiêu:** Xây dựng cơ chế gọi công cụ (Function Calling / Tool Calling) tự động từ LLM, tự động trích xuất JSON Schema từ Python code, và thiết lập môi trường thực thi cơ sở dữ liệu an toàn (**Sandboxed SQL Engine**) ngăn chặn tuyệt đối SQL Injection.

---

## 1. Bài Toán Doanh Nghiệp Thực Tế

Khi trao quyền cho LLM truy vấn cơ sở dữ liệu nội bộ (Text-to-SQL):
* **Rủi ro chí mạng:** Người dùng có thể vô tình hoặc cố ý ra lệnh: *"Xóa toàn bộ khách hàng không hoạt động"* dẫn tới LLM sinh câu lệnh `DELETE FROM customers` hoặc `DROP TABLE users`.
* **Hậu quả:** Mất dữ liệu vĩnh viễn hoặc lộ lọt thông tin nhạy cảm.

**Giải pháp của AI Engineer:**
1. Khai báo công cụ chuẩn mực với **JSON Schema**, có kiểm tra kiểu dữ liệu đầu vào.
2. **Sandboxed Database Engine:** 
   - Kiểm tra cây cú pháp (AST / Regex Tokenizer) bắt buộc câu lệnh **chỉ được phép là `SELECT`**.
   - Chặn tuyệt đối các từ khóa nguy hiểm: `DELETE`, `UPDATE`, `DROP`, `ALTER`, `TRUNCATE`, `INSERT`.
   - Giới hạn cứng số dòng trả về (`LIMIT 50`) để tránh làm tràn bộ nhớ VRAM / RAM khi bảng có hàng triệu dòng.
3. Thiết lập vòng lặp xử lý đa bước (Multi-Step Tool Execution Loop).

---

## 2. Kiến Trúc Luồng Tool Calling An Toàn

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Runner as Tool Agent Runner
    participant LLM as Foundation Model
    participant Sandbox as Safe SQL Sandbox
    database DB as SQLite Database (Read-Only)

    User->>Runner: "Cho tôi biết top 3 khách hàng có doanh thu cao nhất?"
    Runner->>LLM: Gửi Prompt + Tool Definitions (JSON Schema)
    LLM-->>Runner: Yêu cầu gọi Tool: `run_sql_query(query="SELECT ...")`
    Runner->>Sandbox: Kiểm định an toàn cú pháp (Safety Check)
    alt Lệnh an toàn (Chỉ SELECT)
        Sandbox->>DB: Thực thi với giới hạn LIMIT
        DB-->>Sandbox: Trả về kết quả (List Records)
        Sandbox-->>Runner: Tool Output
        Runner->>LLM: Gửi lại Tool Output
        LLM-->>Runner: Sinh câu trả lời tổng hợp tự nhiên
        Runner-->>User: Trả kết quả báo cáo
    else Lệnh nguy hiểm (Chứa DROP/DELETE)
        Sandbox-->>Runner: SecurityViolationError (Chặn thực thi)
        Runner-->>User: Cảnh báo từ chối truy cập vì vi phạm an toàn
    end
```

---

## 3. Cấu Trúc Mã Nguồn Module 05

- [`tool_registry.py`](tool_registry.py): Decorator `@tool` tự động tạo JSON Schema từ Python Type Hints và docstrings.
- [`sandbox_sql.py`](sandbox_sql.py): Môi trường thực thi SQLite chỉ cho phép đọc (Read-Only Guard), tự động kiểm định bảo mật.
- [`agent_runner.py`](agent_runner.py): Điều phối vòng lặp nhận Tool Call -> Dispatch -> Phản hồi kết quả.
- [`main.py`](main.py): File chạy thực nghiệm báo cáo doanh thu và thử nghiệm phòng thủ lệnh SQL độc hại.
- [`test_module05.py`](test_module05.py): Test suite kiểm tra độ an toàn tuyệt đối của Sandbox và khả năng gọi tool.

---

## 4. Hướng Dẫn Chạy & Kiểm Thử

```bash
# Chạy demo trực tiếp
python -m modules.module05_tool_calling.main

# Chạy test suite
pytest modules/module05_tool_calling/test_module05.py -v
```

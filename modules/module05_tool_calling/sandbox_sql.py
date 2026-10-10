"""
sandbox_sql.py — Môi trường thực thi cơ sở dữ liệu SQLite an toàn (Read-Only Sandbox).
"""
import re
import sqlite3
from typing import List, Dict, Any

class SecurityViolationError(Exception):
    """Ném ra khi câu lệnh SQL cố tình vi phạm nguyên tắc bảo mật."""
    pass

class SafeSQLSandbox:
    FORBIDDEN_KEYWORDS = [
        "DROP", "DELETE", "UPDATE", "INSERT", "ALTER",
        "TRUNCATE", "REPLACE", "CREATE", "ATTACH", "DETACH", "PRAGMA"
    ]

    def __init__(self):
        # Khởi tạo in-memory database
        self.conn = sqlite3.connect(":memory:", check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._init_demo_schema()

    def _init_demo_schema(self):
        cursor = self.conn.cursor()
        cursor.execute("""
            CREATE TABLE customers (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                company TEXT NOT NULL,
                tier TEXT NOT NULL
            );
        """)
        cursor.execute("""
            CREATE TABLE orders (
                order_id INTEGER PRIMARY KEY,
                customer_id INTEGER,
                amount REAL NOT NULL,
                order_date TEXT NOT NULL,
                FOREIGN KEY (customer_id) REFERENCES customers(id)
            );
        """)
        # Chèn dữ liệu mẫu
        cursor.executemany(
            "INSERT INTO customers VALUES (?, ?, ?, ?)",
            [
                (1, "Nguyễn Văn An", "Công nghệ Alpha", "Enterprise"),
                (2, "Trần Thị Bình", "Tài chính Beta", "Enterprise"),
                (3, "Lê Hoàng Cường", "Bán lẻ Gamma", "Standard"),
            ]
        )
        cursor.executemany(
            "INSERT INTO orders VALUES (?, ?, ?, ?)",
            [
                (101, 1, 150000000.0, "2026-09-15"),
                (102, 1, 80000000.0, "2026-10-01"),
                (103, 2, 320000000.0, "2026-09-28"),
                (104, 3, 25000000.0, "2026-10-05"),
            ]
        )
        self.conn.commit()

    def execute_query(self, query: str, max_rows: int = 50) -> List[Dict[str, Any]]:
        """
        Thực thi câu truy vấn SQL an toàn.
        Bắt buộc câu lệnh phải là SELECT và không chứa các thao tác ghi/xóa.
        """
        cleaned_query = query.strip()
        tokens = re.findall(r"\b[A-Za-z]+\b", cleaned_query.upper())

        # 1. Kiểm tra câu lệnh có bắt đầu bằng SELECT không
        if not tokens or tokens[0] != "SELECT":
            raise SecurityViolationError(
                f"Chỉ cho phép thực thi câu lệnh 'SELECT'. Câu lệnh của bạn bắt đầu bằng: {tokens[0] if tokens else 'EMPTY'}"
            )

        # 2. Kiểm tra từ khóa cấm
        for keyword in self.FORBIDDEN_KEYWORDS:
            if keyword in tokens:
                raise SecurityViolationError(
                    f"Từ khóa nguy hiểm '{keyword}' bị cấm tuyệt đối trong môi trường Sandbox!"
                )

        # 3. Thực thi an toàn
        cursor = self.conn.cursor()
        try:
            cursor.execute(cleaned_query)
            rows = cursor.fetchmany(max_rows)
            return [dict(row) for row in rows]
        except sqlite3.Error as e:
            raise ValueError(f"Lỗi cú pháp SQL: {str(e)}")

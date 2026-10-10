"""
test_module05.py — Bộ kiểm thử tự động cho Tool Calling và Safe SQL Sandbox.
"""
import pytest
from modules.module05_tool_calling.tool_registry import ToolRegistry
from modules.module05_tool_calling.sandbox_sql import SafeSQLSandbox, SecurityViolationError
from modules.module05_tool_calling.agent_runner import ToolAgentRunner

def test_tool_registry_schema_generation():
    registry = ToolRegistry()

    @registry.register
    def calculate_tax(amount: float, rate: float = 0.1) -> float:
        """Tính tiền thuế cho khoản tiền."""
        return amount * rate

    schemas = registry.get_schemas()
    assert len(schemas) == 1
    func_def = schemas[0]["function"]
    assert func_def["name"] == "calculate_tax"
    assert "amount" in func_def["parameters"]["properties"]
    assert "amount" in func_def["parameters"]["required"]

def test_sandbox_allows_select():
    sandbox = SafeSQLSandbox()
    rows = sandbox.execute_query("SELECT name, tier FROM customers WHERE id = 1;")
    assert len(rows) == 1
    assert rows[0]["name"] == "Nguyễn Văn An"
    assert rows[0]["tier"] == "Enterprise"

def test_sandbox_blocks_destructive_sql():
    sandbox = SafeSQLSandbox()
    
    # 1. Thử lệnh DROP TABLE
    with pytest.raises(SecurityViolationError) as exc_drop:
        sandbox.execute_query("DROP TABLE customers;")
    assert "Chỉ cho phép thực thi câu lệnh 'SELECT'" in str(exc_drop.value)

    # 2. Thử chèn lệnh cấm DELETE bên trong SELECT
    with pytest.raises(SecurityViolationError) as exc_del:
        sandbox.execute_query("SELECT * FROM customers; DELETE FROM orders;")
    assert "bị cấm tuyệt đối" in str(exc_del.value)

def test_agent_runner_handles_security_gracefully():
    sandbox = SafeSQLSandbox()
    registry = ToolRegistry()

    @registry.register
    def run_sql_query(query: str) -> list:
        return sandbox.execute_query(query)

    runner = ToolAgentRunner(registry)
    result = runner.run("Xóa toàn bộ cơ sở dữ liệu")

    assert result["tool_called"] == "run_sql_query"
    assert result["tool_status"] == "blocked"
    assert "CẢNH BÁO BẢO MẬT" in result["error"]
    assert "bị từ chối" in result["final_answer"].lower()

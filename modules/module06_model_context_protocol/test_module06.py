"""
test_module06.py — Bộ kiểm thử tự động cho Model Context Protocol (MCP).
"""
import pytest
from modules.module06_model_context_protocol.server import EnterpriseMCPServer
from modules.module06_model_context_protocol.client import EnterpriseMCPClient

def test_mcp_initialization():
    server = EnterpriseMCPServer("test-server", "1.0.0")
    client = EnterpriseMCPClient(server)
    res = client.initialize()

    assert "protocolVersion" in res
    assert res["serverInfo"]["name"] == "test-server"
    assert "tools" in res["capabilities"]

def test_mcp_tool_registration_and_execution():
    server = EnterpriseMCPServer()
    
    def multiply(a: int, b: int) -> int:
        return a * b

    server.register_tool(
        name="multiply",
        description="Nhân 2 số",
        properties={"a": {"type": "integer"}, "b": {"type": "integer"}},
        required=["a", "b"],
        handler=multiply
    )

    client = EnterpriseMCPClient(server)
    client.initialize()

    tools = client.list_tools()
    assert len(tools) == 1
    assert tools[0]["name"] == "multiply"

    # Gọi tool từ client
    res = client.call_tool("multiply", {"a": 6, "b": 7})
    assert res == "42"

def test_mcp_unknown_tool_returns_error():
    server = EnterpriseMCPServer()
    client = EnterpriseMCPClient(server)
    client.initialize()

    with pytest.raises(RuntimeError) as exc_info:
        client.call_tool("non_existent_tool", {})
    assert "Tool not found" in str(exc_info.value)

def test_mcp_resource_read():
    server = EnterpriseMCPServer()
    server.register_resource("docs://rules", "Rules", "Company rules", "Khách hàng là thượng đế")

    client = EnterpriseMCPClient(server)
    client.initialize()

    content = client.read_resource("docs://rules")
    assert content == "Khách hàng là thượng đế"

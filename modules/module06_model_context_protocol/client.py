"""
client.py — Bộ điều khiển kết nối máy khách (MCP Client).
"""
import json
from typing import Dict, Any, List
from modules.module06_model_context_protocol.protocol import JSONRPCRequest, JSONRPCResponse
from modules.module06_model_context_protocol.server import EnterpriseMCPServer

class EnterpriseMCPClient:
    def __init__(self, server: EnterpriseMCPServer):
        self.server = server
        self._request_counter = 0
        self.server_info: Dict[str, Any] = {}

    def _send(self, method: str, params: Dict[str, Any] = None) -> Any:
        self._request_counter += 1
        req = JSONRPCRequest(
            id=self._request_counter,
            method=method,
            params=params or {}
        )
        response_str = self.server.handle_request(req.model_dump_json())
        resp = JSONRPCResponse.model_validate_json(response_str)

        if resp.error:
            raise RuntimeError(f"MCP Server Error [{resp.error.code}]: {resp.error.message}")
        return resp.result

    def initialize(self) -> Dict[str, Any]:
        """Bắt tay khởi tạo giao thức với Server."""
        result = self._send("initialize")
        self.server_info = result.get("serverInfo", {})
        return result

    def list_tools(self) -> List[Dict[str, Any]]:
        """Lấy danh sách các công cụ được máy chủ cung cấp."""
        result = self._send("tools/list")
        return result.get("tools", [])

    def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> str:
        """Gọi thực thi công cụ từ xa trên máy chủ."""
        result = self._send("tools/call", {"name": tool_name, "arguments": arguments})
        content_items = result.get("content", [])
        if content_items:
            return content_items[0].get("text", "")
        return ""

    def read_resource(self, uri: str) -> str:
        """Đọc nội dung của tài nguyên URI từ xa."""
        result = self._send("resources/read", {"uri": uri})
        contents = result.get("contents", [])
        if contents:
            return contents[0].get("text", "")
        return ""

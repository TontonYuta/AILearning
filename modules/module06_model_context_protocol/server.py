"""
server.py — Máy chủ Model Context Protocol (MCP Server).
"""
import json
from typing import Dict, Any, Callable
from modules.module06_model_context_protocol.protocol import (
    JSONRPCRequest,
    JSONRPCResponse,
    JSONRPCError,
    MCPTool,
    MCPToolParameterSchema,
    MCPResource
)

class EnterpriseMCPServer:
    def __init__(self, server_name: str = "enterprise-data-server", version: str = "1.0.0"):
        self.server_name = server_name
        self.version = version
        self._tools: Dict[str, MCPTool] = {}
        self._tool_handlers: Dict[str, Callable] = {}
        self._resources: Dict[str, MCPResource] = {}
        self._resource_contents: Dict[str, str] = {}

    def register_tool(
        self,
        name: str,
        description: str,
        properties: Dict[str, Any],
        required: list,
        handler: Callable
    ):
        tool = MCPTool(
            name=name,
            description=description,
            inputSchema=MCPToolParameterSchema(
                properties=properties,
                required=required
            )
        )
        self._tools[name] = tool
        self._tool_handlers[name] = handler

    def register_resource(self, uri: str, name: str, description: str, content: str, mime_type: str = "text/plain"):
        resource = MCPResource(
            uri=uri,
            name=name,
            description=description,
            mimeType=mime_type
        )
        self._resources[uri] = resource
        self._resource_contents[uri] = content

    def handle_request(self, raw_json: str) -> str:
        """Xử lý gói tin JSON-RPC 2.0 theo đặc tả MCP."""
        try:
            req_data = json.loads(raw_json)
            req = JSONRPCRequest.model_validate(req_data)
        except Exception as e:
            err_resp = JSONRPCResponse(
                id=0,
                error=JSONRPCError(code=-32700, message=f"Parse error: {str(e)}")
            )
            return err_resp.model_dump_json()

        req_id = req.id
        method = req.method
        params = req.params or {}

        try:
            if method == "initialize":
                result = {
                    "protocolVersion": "2024-11-05",
                    "serverInfo": {
                        "name": self.server_name,
                        "version": self.version
                    },
                    "capabilities": {
                        "tools": {"listChanged": False},
                        "resources": {"subscribe": False}
                    }
                }
            elif method == "tools/list":
                result = {
                    "tools": [t.model_dump() for t in self._tools.values()]
                }
            elif method == "tools/call":
                tool_name = params.get("name")
                arguments = params.get("arguments", {})
                if tool_name not in self._tool_handlers:
                    return JSONRPCResponse(
                        id=req_id,
                        error=JSONRPCError(code=-32601, message=f"Tool not found: {tool_name}")
                    ).model_dump_json()

                output = self._tool_handlers[tool_name](**arguments)
                result = {
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(output, ensure_ascii=False) if isinstance(output, (dict, list)) else str(output)
                        }
                    ],
                    "isError": False
                }
            elif method == "resources/list":
                result = {
                    "resources": [r.model_dump() for r in self._resources.values()]
                }
            elif method == "resources/read":
                uri = params.get("uri")
                if uri not in self._resource_contents:
                    return JSONRPCResponse(
                        id=req_id,
                        error=JSONRPCError(code=-32602, message=f"Resource not found: {uri}")
                    ).model_dump_json()
                result = {
                    "contents": [
                        {
                            "uri": uri,
                            "mimeType": self._resources[uri].mimeType,
                            "text": self._resource_contents[uri]
                        }
                    ]
                }
            else:
                return JSONRPCResponse(
                    id=req_id,
                    error=JSONRPCError(code=-32601, message=f"Method not found: {method}")
                ).model_dump_json()

            return JSONRPCResponse(id=req_id, result=result).model_dump_json()

        except Exception as e:
            return JSONRPCResponse(
                id=req_id,
                error=JSONRPCError(code=-32603, message=f"Internal error: {str(e)}")
            ).model_dump_json()

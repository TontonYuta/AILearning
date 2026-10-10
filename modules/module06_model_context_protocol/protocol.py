"""
protocol.py — Đặc tả giao thức JSON-RPC 2.0 chuẩn Model Context Protocol (MCP).
"""
from typing import Dict, Any, Optional, List, Union
from pydantic import BaseModel, Field

class JSONRPCError(BaseModel):
    code: int
    message: str
    data: Optional[Any] = None

class JSONRPCRequest(BaseModel):
    jsonrpc: str = "2.0"
    id: Union[str, int]
    method: str
    params: Optional[Dict[str, Any]] = Field(default_factory=dict)

class JSONRPCResponse(BaseModel):
    jsonrpc: str = "2.0"
    id: Union[str, int]
    result: Optional[Any] = None
    error: Optional[JSONRPCError] = None

class MCPToolParameterSchema(BaseModel):
    type: str = "object"
    properties: Dict[str, Any] = Field(default_factory=dict)
    required: List[str] = Field(default_factory=list)

class MCPTool(BaseModel):
    name: str
    description: str
    inputSchema: MCPToolParameterSchema

class MCPResource(BaseModel):
    uri: str
    name: str
    description: Optional[str] = None
    mimeType: Optional[str] = "text/plain"

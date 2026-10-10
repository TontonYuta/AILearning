"""
tool_registry.py — Đăng ký công cụ và tự động sinh JSON Schema từ Python Type Hints.
"""
import inspect
from typing import Callable, Dict, Any, List

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, Callable] = {}
        self._schemas: Dict[str, Dict[str, Any]] = {}

    def register(self, func: Callable) -> Callable:
        name = func.__name__
        doc = inspect.getdoc(func) or f"Công cụ {name}"
        sig = inspect.signature(func)

        properties = {}
        required = []

        type_mapping = {
            int: "integer",
            float: "number",
            str: "string",
            bool: "boolean",
            list: "array",
            dict: "object"
        }

        for param_name, param in sig.parameters.items():
            param_type = param.annotation
            json_type = type_mapping.get(param_type, "string")
            properties[param_name] = {
                "type": json_type,
                "description": f"Tham số {param_name}"
            }
            if param.default == inspect.Parameter.empty:
                required.append(param_name)

        schema = {
            "type": "function",
            "function": {
                "name": name,
                "description": doc,
                "parameters": {
                    "type": "object",
                    "properties": properties,
                    "required": required
                }
            }
        }

        self._tools[name] = func
        self._schemas[name] = schema
        return func

    def get_schemas(self) -> List[Dict[str, Any]]:
        return list(self._schemas.values())

    def execute(self, tool_name: str, arguments: Dict[str, Any]) -> Any:
        if tool_name not in self._tools:
            raise ValueError(f"Công cụ '{tool_name}' không tồn tại trong Registry.")
        return self._tools[tool_name](**arguments)

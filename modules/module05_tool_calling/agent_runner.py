"""
agent_runner.py — Điều phối vòng lặp gọi công cụ ngoại vi (Tool Agent Runner).
"""
import json
from typing import Dict, Any, Optional, Callable
from modules.module05_tool_calling.tool_registry import ToolRegistry
from modules.module05_tool_calling.sandbox_sql import SecurityViolationError

class ToolAgentRunner:
    def __init__(
        self,
        registry: ToolRegistry,
        llm_caller: Optional[Callable[[str, list], Dict[str, Any]]] = None
    ):
        self.registry = registry
        self.llm_caller = llm_caller or self._default_mock_llm

    def run(self, user_prompt: str) -> Dict[str, Any]:
        """Thực thi vòng lặp Tool Calling."""
        schemas = self.registry.get_schemas()
        # Bước 1: Gọi LLM với danh sách công cụ
        step1_result = self.llm_caller(user_prompt, schemas)

        if "tool_call" in step1_result:
            tool_call = step1_result["tool_call"]
            tool_name = tool_call["name"]
            arguments = tool_call["arguments"]

            try:
                # Bước 2: Thực thi tool an toàn
                execution_output = self.registry.execute(tool_name, arguments)
                status = "success"
                error_msg = None
            except SecurityViolationError as sec_err:
                execution_output = None
                status = "blocked"
                error_msg = f"CẢNH BÁO BẢO MẬT: {str(sec_err)}"
            except Exception as e:
                execution_output = None
                status = "error"
                error_msg = f"Lỗi thực thi: {str(e)}"

            return {
                "user_prompt": user_prompt,
                "tool_called": tool_name,
                "arguments": arguments,
                "tool_status": status,
                "tool_output": execution_output,
                "error": error_msg,
                "final_answer": self._synthesize_answer(user_prompt, tool_name, execution_output, error_msg)
            }

        return {
            "user_prompt": user_prompt,
            "tool_called": None,
            "final_answer": step1_result.get("content", "")
        }

    def _synthesize_answer(self, prompt: str, tool_name: str, output: Any, error: Optional[str]) -> str:
        if error:
            return f"Yêu cầu bị từ chối: {error}"
        return f"Dựa trên dữ liệu từ công cụ {tool_name}, kết quả là: {json.dumps(output, ensure_ascii=False)}"

    def _default_mock_llm(self, prompt: str, schemas: list) -> Dict[str, Any]:
        if "xóa" in prompt.lower() or "delete" in prompt.lower() or "drop" in prompt.lower():
            return {
                "tool_call": {
                    "name": "run_sql_query",
                    "arguments": {"query": "DROP TABLE customers"}
                }
            }
        elif "khách hàng" in prompt.lower() or "doanh thu" in prompt.lower():
            return {
                "tool_call": {
                    "name": "run_sql_query",
                    "arguments": {
                        "query": "SELECT c.name, c.company, SUM(o.amount) as total_revenue "
                                 "FROM customers c JOIN orders o ON c.id = o.customer_id "
                                 "GROUP BY c.id ORDER BY total_revenue DESC LIMIT 3"
                    }
                }
            }
        return {"content": "Tôi không cần gọi công cụ nào cho câu hỏi này."}

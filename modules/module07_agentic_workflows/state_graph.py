"""
state_graph.py — Động cơ StateGraph hỗ trợ chu trình lặp và điểm ngắt Human-in-the-loop.
"""
from dataclasses import dataclass, field
from typing import Dict, Any, Callable, Optional, List

@dataclass
class GraphExecutionResult:
    state: Dict[str, Any]
    is_paused: bool = False
    paused_at_node: Optional[str] = None
    execution_path: List[str] = field(default_factory=list)

class StateGraph:
    def __init__(self):
        self.nodes: Dict[str, Callable[[Dict[str, Any]], Dict[str, Any]]] = {}
        self.edges: Dict[str, str] = {}
        self.conditional_edges: Dict[str, Callable[[Dict[str, Any]], str]] = {}
        self.entry_point: Optional[str] = None
        self.finish_points: set = set()
        self.breakpoints: set = set()

    def add_node(self, name: str, func: Callable[[Dict[str, Any]], Dict[str, Any]]):
        self.nodes[name] = func

    def add_edge(self, source: str, target: str):
        self.edges[source] = target

    def add_conditional_edges(self, source: str, router_func: Callable[[Dict[str, Any]], str]):
        self.conditional_edges[source] = router_func

    def set_entry_point(self, name: str):
        self.entry_point = name

    def set_finish_point(self, name: str):
        self.finish_points.add(name)

    def add_breakpoint_before(self, node_name: str):
        """Đánh dấu điểm dừng để con người can thiệp/phê duyệt trước khi Node chạy."""
        self.breakpoints.add(node_name)

    def run(self, initial_state: Dict[str, Any], start_node: Optional[str] = None) -> GraphExecutionResult:
        current_node = start_node or self.entry_point
        if not current_node or current_node not in self.nodes:
            raise ValueError(f"Điểm bắt đầu '{current_node}' không hợp lệ.")

        state = dict(initial_state)
        path = []

        while current_node:
            # Kiểm tra xem node hiện tại có phải là điểm dừng Human-in-the-loop không
            # (chỉ ngắt nếu chưa được phê duyệt từ trước)
            if current_node in self.breakpoints and not state.get(f"_approved_{current_node}", False):
                return GraphExecutionResult(
                    state=state,
                    is_paused=True,
                    paused_at_node=current_node,
                    execution_path=path
                )

            path.append(current_node)
            node_fn = self.nodes[current_node]
            # Thực thi node và cập nhật state
            update = node_fn(state)
            if update:
                state.update(update)

            if current_node in self.finish_points:
                break

            # Xác định node tiếp theo
            if current_node in self.conditional_edges:
                next_node = self.conditional_edges[current_node](state)
            elif current_node in self.edges:
                next_node = self.edges[current_node]
            else:
                break

            current_node = next_node

        return GraphExecutionResult(
            state=state,
            is_paused=False,
            paused_at_node=None,
            execution_path=path
        )

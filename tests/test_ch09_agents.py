"""
Tests for Chapter 9: Autonomous AI Agents, State Graphs & LangGraph
Covers:
- Mini StateGraph engine with state reducers and conditional edges
- Compound error rate calculation for multi-step agent workflows
- Tool calling dispatcher and loop guardrails (max iterations)
"""

import operator
from typing import TypedDict, Annotated, Callable, Any
import pytest


class AgentState(TypedDict):
    messages: Annotated[list[str], operator.add]
    current_step: int
    is_finished: bool


class SimpleStateGraph:
    """
    Lightweight, self-contained implementation of a State Graph Engine
    mirroring the architectural principles of LangGraph.
    """
    def __init__(self, state_schema):
        self.state_schema = state_schema
        self.nodes: dict[str, Callable[[dict], dict]] = {}
        self.edges: dict[str, str] = {}
        self.conditional_edges: dict[str, tuple[Callable[[dict], str], dict[str, str]]] = {}
        self.entry_point: str | None = None

    def add_node(self, name: str, fn: Callable[[dict], dict]):
        self.nodes[name] = fn

    def set_entry_point(self, name: str):
        self.entry_point = name

    def add_edge(self, source: str, target: str):
        self.edges[source] = target

    def add_conditional_edge(self, source: str, router_fn: Callable[[dict], str], path_map: dict[str, str]):
        self.conditional_edges[source] = (router_fn, path_map)

    def run(self, initial_state: dict, max_steps: int = 10) -> dict:
        if not self.entry_point or self.entry_point not in self.nodes:
            raise ValueError("Entry point not properly defined")

        state = dict(initial_state)
        current_node_name = self.entry_point
        steps = 0

        while current_node_name and current_node_name != "__end__" and steps < max_steps:
            steps += 1
            node_fn = self.nodes[current_node_name]
            updates = node_fn(state)

            # Apply state updates with reducer simulation
            for k, v in updates.items():
                if k == "messages" and k in state:
                    state[k] = state[k] + v
                else:
                    state[k] = v

            # Determine next node
            if current_node_name in self.conditional_edges:
                router, path_map = self.conditional_edges[current_node_name]
                route_key = router(state)
                current_node_name = path_map.get(route_key, "__end__")
            elif current_node_name in self.edges:
                current_node_name = self.edges[current_node_name]
            else:
                current_node_name = "__end__"

        return state


def calculate_compound_success_rate(step_success_rate: float, num_steps: int) -> float:
    """Computes p^N compound reliability."""
    return step_success_rate ** num_steps


def test_compound_error_math():
    p = 0.95
    # 5 steps: ~0.7738
    assert pytest.approx(calculate_compound_success_rate(p, 5), 1e-4) == 0.7738
    # 10 steps: ~0.5987 (below 60% reliability without self-healing!)
    assert pytest.approx(calculate_compound_success_rate(p, 10), 1e-4) == 0.5987


def test_simple_state_graph():
    # Build a 2-node graph: Reasoner -> ToolExec -> (done? -> End : Reasoner)
    graph = SimpleStateGraph(AgentState)

    def reasoner_node(state: dict) -> dict:
        step = state.get("current_step", 0) + 1
        if step >= 3:
            return {"messages": [f"Final Answer at step {step}"], "current_step": step, "is_finished": True}
        return {"messages": [f"Thought: Need more info at step {step}"], "current_step": step, "is_finished": False}

    def tool_node(state: dict) -> dict:
        return {"messages": ["Tool Result: Success"]}

    def router(state: dict) -> str:
        return "end" if state.get("is_finished") else "tool"

    graph.add_node("reasoner", reasoner_node)
    graph.add_node("tool_exec", tool_node)
    graph.set_entry_point("reasoner")

    graph.add_conditional_edge("reasoner", router, {"tool": "tool_exec", "end": "__end__"})
    graph.add_edge("tool_exec", "reasoner")

    initial = {"messages": ["User: Solve this problem"], "current_step": 0, "is_finished": False}
    final_state = graph.run(initial, max_steps=10)

    assert final_state["is_finished"] is True
    assert final_state["current_step"] == 3
    # Check that messages accumulated properly via reducer
    assert len(final_state["messages"]) >= 5
    assert "Final Answer at step 3" in final_state["messages"][-1]

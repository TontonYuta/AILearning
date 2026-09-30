"""Unit test xác thực toàn bộ mã nguồn ví dụ trong Giai đoạn 4: RAG & Agent Engineering."""

import pytest
from typing import List, Dict, Tuple

# 1. Test Reciprocal Rank Fusion (RRF)
def reciprocal_rank_fusion(
    dense_ranks: List[str], 
    sparse_ranks: List[str], 
    k: int = 60
) -> List[Tuple[str, float]]:
    scores: Dict[str, float] = {}

    for rank, doc_id in enumerate(dense_ranks, start=1):
        scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank))

    for rank, doc_id in enumerate(sparse_ranks, start=1):
        scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank))

    sorted_docs = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    return sorted_docs

def test_rrf_fusion():
    dense = ["doc_A", "doc_B", "doc_C"]
    sparse = ["doc_B", "doc_D", "doc_A"]
    fused = reciprocal_rank_fusion(dense, sparse, k=60)
    
    top_doc, top_score = fused[0]
    # doc_B dung hang 2 dense va hang 1 sparse -> diem cao nhat!
    assert top_doc == "doc_B"
    assert top_score > (1.0 / 61)

# 2. Test Agent State Machine
class AgentState:
    def __init__(self, query: str):
        self.query = query
        self.messages: List[str] = [f"User: {query}"]
        self.tool_calls: int = 0
        self.final_answer: str = ""

def agent_reasoning_node(state: AgentState) -> str:
    if "ip" in state.query.lower() and state.tool_calls == 0:
        return "call_network_tool"
    return "finish"

def execute_tool_node(state: AgentState):
    state.tool_calls += 1
    state.messages.append("Tool: IP 192.168.1.1 is ACTIVE")

def run_agent_workflow(query: str) -> AgentState:
    state = AgentState(query)
    max_steps = 5
    step = 0
    while step < max_steps:
        decision = agent_reasoning_node(state)
        if decision == "call_network_tool":
            execute_tool_node(state)
        elif decision == "finish":
            state.final_answer = f"Tong hop: {state.messages[-1]}"
            break
        step += 1
    return state

def test_agent_workflow_calls_tool():
    state = run_agent_workflow("Kiem tra dia chi IP cua may chu")
    assert state.tool_calls == 1
    assert "IP 192.168.1.1 is ACTIVE" in state.final_answer

def test_agent_workflow_direct_finish():
    state = run_agent_workflow("Xin chao ban la ai")
    assert state.tool_calls == 0
    assert "User: Xin chao ban la ai" in state.final_answer

# 3. Test Faithfulness Metric
def calculate_faithfulness(supported_claims: int, total_claims: int) -> float:
    if total_claims == 0:
        return 1.0
    return supported_claims / total_claims

def test_faithfulness_metric():
    score = calculate_faithfulness(9, 10)
    assert score == 0.9
    assert calculate_faithfulness(0, 0) == 1.0

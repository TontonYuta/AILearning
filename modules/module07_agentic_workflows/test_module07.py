"""
test_module07.py — Bộ kiểm thử tự động cho StateGraph & Human-in-the-Loop Workflow.
"""
import pytest
from modules.module07_agentic_workflows.workflow import build_refund_workflow

def test_workflow_low_amount_completes_automatically():
    wf = build_refund_workflow()
    init = {"customer_id": "CUST-1", "requested_amount": 500000.0}
    res = wf.run(init)

    assert res.is_paused is False
    assert res.paused_at_node is None
    assert res.state["final_status"] == "COMPLETED"
    assert "disbursement_tx" in res.state
    assert "analyze_request" in res.execution_path
    assert "auto_disburse_node" in res.execution_path

def test_workflow_high_amount_pauses_for_approval():
    wf = build_refund_workflow()
    init = {"customer_id": "CUST-2", "requested_amount": 10000000.0}
    res = wf.run(init)

    assert res.is_paused is True
    assert res.paused_at_node == "manager_approval_node"
    assert "disbursement_tx" not in res.state

def test_workflow_resumes_after_approval():
    wf = build_refund_workflow()
    init = {"customer_id": "CUST-3", "requested_amount": 15000000.0}
    paused_res = wf.run(init)
    assert paused_res.is_paused is True

    # Quản lý duyệt
    state = paused_res.state
    state["manager_decision"] = "APPROVED"
    state["_approved_manager_approval_node"] = True

    resumed_res = wf.run(state, start_node=paused_res.paused_at_node)
    assert resumed_res.is_paused is False
    assert resumed_res.state["final_status"] == "COMPLETED"
    assert "disbursement_tx" in resumed_res.state

def test_workflow_rejection_path():
    wf = build_refund_workflow()
    init = {"customer_id": "CUST-4", "requested_amount": 20000000.0}
    paused_res = wf.run(init)

    # Quản lý từ chối
    state = paused_res.state
    state["manager_decision"] = "REJECTED"
    state["_approved_manager_approval_node"] = True

    resumed_res = wf.run(state, start_node=paused_res.paused_at_node)
    assert resumed_res.is_paused is False
    assert resumed_res.state["final_status"] == "REJECTED"
    assert "disbursement_tx" not in resumed_res.state
    assert "không thỏa mãn" in resumed_res.state["customer_message"]

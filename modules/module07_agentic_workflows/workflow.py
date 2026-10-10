"""
workflow.py — Định nghĩa quy trình xử lý hoàn tiền tự hành (Refund Agent Workflow).
"""
from typing import Dict, Any
from modules.module07_agentic_workflows.state_graph import StateGraph

def analyze_request(state: Dict[str, Any]) -> Dict[str, Any]:
    amount = state.get("requested_amount", 0.0)
    customer_id = state.get("customer_id", "UNKNOWN")
    return {
        "analysis": f"Khách hàng {customer_id} yêu cầu hoàn {amount:,.0f} VNĐ do sản phẩm không hoạt động.",
        "requires_manager_review": amount >= 5000000.0  # Lớn hơn 5 triệu VNĐ cần Quản lý duyệt
    }

def route_after_analysis(state: Dict[str, Any]) -> str:
    if state.get("requires_manager_review", False):
        return "manager_approval_node"
    return "auto_disburse_node"

def manager_approval_node(state: Dict[str, Any]) -> Dict[str, Any]:
    # Khi node này chạy, nghĩa là Quản lý đã duyệt
    decision = state.get("manager_decision", "PENDING")
    return {
        "review_status": decision,
        "manager_note": state.get("manager_note", "Đã được phê duyệt bởi Quản lý trực ca.")
    }

def route_after_approval(state: Dict[str, Any]) -> str:
    if state.get("manager_decision") == "APPROVED":
        return "auto_disburse_node"
    return "reject_notification_node"

def auto_disburse_node(state: Dict[str, Any]) -> Dict[str, Any]:
    amount = state.get("requested_amount", 0.0)
    return {
        "disbursement_tx": "TX-REFUND-8899112",
        "disbursed_amount": amount,
        "final_status": "COMPLETED"
    }

def reject_notification_node(state: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "final_status": "REJECTED",
        "customer_message": "Yêu cầu hoàn tiền của quý khách không thỏa mãn chính sách bảo hành."
    }

def notify_customer_success(state: Dict[str, Any]) -> Dict[str, Any]:
    tx = state.get("disbursement_tx", "")
    return {
        "customer_message": f"Số tiền đã được hoàn trả thành công về tài khoản của quý khách. Mã giao dịch: {tx}."
    }

def build_refund_workflow() -> StateGraph:
    graph = StateGraph()

    graph.add_node("analyze_request", analyze_request)
    graph.add_node("manager_approval_node", manager_approval_node)
    graph.add_node("auto_disburse_node", auto_disburse_node)
    graph.add_node("reject_notification_node", reject_notification_node)
    graph.add_node("notify_customer_success", notify_customer_success)

    graph.set_entry_point("analyze_request")
    graph.add_conditional_edges("analyze_request", route_after_analysis)

    # Đặt Breakpoint trước node manager_approval_node để tạm dừng chờ con người
    graph.add_breakpoint_before("manager_approval_node")
    graph.add_conditional_edges("manager_approval_node", route_after_approval)

    graph.add_edge("auto_disburse_node", "notify_customer_success")
    graph.set_finish_point("notify_customer_success")
    graph.set_finish_point("reject_notification_node")

    return graph

"""
main.py — Kịch bản chạy thực nghiệm Module 07: StateGraph & Human-in-the-Loop.
"""
from rich.console import Console
from rich.panel import Panel

from modules.module07_agentic_workflows.workflow import build_refund_workflow

console = Console()

def run_agentic_workflow_demo():
    console.print(Panel.fit("[bold blue]DEMO MODULE 07: AGENTIC WORKFLOW & HUMAN-IN-THE-LOOP[/bold blue]", border_style="blue"))
    workflow = build_refund_workflow()

    # Kịch bản 1: Khoản tiền nhỏ (1.200.000 VNĐ) -> Tự động hoàn tất
    console.print("[bold yellow]Kịch bản 1: Khoản tiền nhỏ (< 5 triệu) - Tự động hóa 100%[/bold yellow]")
    init_state_small = {
        "customer_id": "CUST-LOW-01",
        "requested_amount": 1200000.0
    }
    res1 = workflow.run(init_state_small)
    console.print(f"Lộ trình thực thi: [green]{' -> '.join(res1.execution_path)}[/green]")
    console.print(f"Trạng thái: [bold green]{res1.state['final_status']}[/bold green]")
    console.print(f"Thông báo: {res1.state['customer_message']}\n")

    # Kịch bản 2: Khoản tiền lớn (25.000.000 VNĐ) -> Cần Quản lý duyệt (Human-in-the-loop)
    console.print("[bold red]Kịch bản 2: Khoản tiền lớn (25 triệu) - Kích hoạt Human-in-the-Loop Gate[/bold red]")
    init_state_large = {
        "customer_id": "CUST-VIP-99",
        "requested_amount": 25000000.0
    }
    res2 = workflow.run(init_state_large)

    if res2.is_paused:
        console.print(Panel(
            f"[bold yellow]ĐỒ THỊ ĐÃ TẠM DỪNG (PAUSED) TẠI NODE:[/bold yellow] [bold red]{res2.paused_at_node}[/bold red]\n"
            f"[white]Lý do: Số tiền 25.000.000 VNĐ vượt ngưỡng hạn mức rủi ro tự động.\n"
            f"Hệ thống đang chờ Quản lý tài chính đăng nhập và bấm DUYỆT...[/white]",
            title="[bold yellow]Cảnh Báo Phê Duyệt An Toàn[/bold yellow]",
            border_style="yellow"
        ))

        # Giả lập Quản lý đăng nhập và bấm "PHÊ DUYỆT"
        console.print("\n[bold cyan]Quản lý tài chính: Xem xét hồ sơ -> Bấm 'APPROVED' và ghi chú.[/bold cyan]")
        res2.state["manager_decision"] = "APPROVED"
        res2.state["manager_note"] = "Xác nhận lỗi phần cứng của công ty, đồng ý hoàn tiền đặc biệt."
        # Đánh dấu đã duyệt để vượt qua breakpoint
        res2.state[f"_approved_{res2.paused_at_node}"] = True

        # Tiếp tục chạy tiếp đồ thị từ điểm ngắt
        res2_resumed = workflow.run(res2.state, start_node=res2.paused_at_node)
        console.print(f"Lộ trình sau khi duyệt: [green]{' -> '.join(res2_resumed.execution_path)}[/green]")
        console.print(f"Mã giao dịch giải ngân: [bold green]{res2_resumed.state.get('disbursement_tx')}[/bold green]")
        console.print(f"Thông báo tới khách hàng: {res2_resumed.state.get('customer_message')}\n")

if __name__ == "__main__":
    run_agentic_workflow_demo()

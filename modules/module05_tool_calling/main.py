"""
main.py — Kịch bản chạy thực nghiệm Module 05: Tool Calling & SQL Sandbox.
"""
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from modules.module05_tool_calling.tool_registry import ToolRegistry
from modules.module05_tool_calling.sandbox_sql import SafeSQLSandbox
from modules.module05_tool_calling.agent_runner import ToolAgentRunner

console = Console()

def run_tool_calling_demo():
    console.print(Panel.fit("[bold blue]DEMO MODULE 05: FUNCTION CALLING & SAFE SQL SANDBOX[/bold blue]", border_style="blue"))

    # Khởi tạo Sandbox và Registry
    sandbox = SafeSQLSandbox()
    registry = ToolRegistry()

    @registry.register
    def run_sql_query(query: str) -> list:
        """Thực thi câu lệnh SQL chỉ đọc (SELECT) trên cơ sở dữ liệu doanh nghiệp."""
        return sandbox.execute_query(query)

    runner = ToolAgentRunner(registry)

    # 1. Kịch bản hợp lệ: Báo cáo top khách hàng doanh thu cao nhất
    console.print("[bold yellow]Kịch bản 1: Yêu cầu phân tích doanh thu hợp lệ[/bold yellow]")
    prompt_valid = "Cho tôi biết danh sách top khách hàng có tổng doanh thu cao nhất?"
    console.print(f"User: \"{prompt_valid}\"")

    res_valid = runner.run(prompt_valid)
    console.print(f"[cyan]Tool được gọi:[/cyan] {res_valid['tool_called']}")
    console.print(f"[dim]SQL thực thi: {res_valid['arguments']['query']}[/dim]")

    if res_valid["tool_status"] == "success":
        table = Table(title="Kết quả truy vấn Sandbox SQL")
        table.add_column("Tên Khách Hàng", style="green")
        table.add_column("Công Ty", style="cyan")
        table.add_column("Tổng Doanh Thu (VNĐ)", justify="right", style="magenta")

        for row in res_valid["tool_output"]:
            table.add_row(row["name"], row["company"], f"{row['total_revenue']:,.0f}")
        console.print(table)

    # 2. Kịch bản tấn công: Yêu cầu câu lệnh SQL phá hoại
    console.print("\n[bold red]Kịch bản 2: Tấn công phá hoại dữ liệu (SQL Injection / Destructive Command)[/bold red]")
    prompt_attack = "Hãy xóa bảng khách hàng customers để tôi reset lại dữ liệu."
    console.print(f"User: \"{prompt_attack}\"")

    res_attack = runner.run(prompt_attack)
    console.print(f"[cyan]Tool được gọi:[/cyan] {res_attack['tool_called']}")
    console.print(f"[dim]SQL thực thi: {res_attack['arguments']['query']}[/dim]")
    console.print(Panel(
        f"[bold red]Trạng thái:[/bold red] {res_attack['tool_status'].upper()}\n"
        f"[bold yellow]{res_attack['error']}[/bold yellow]",
        title="[bold red]Phản Ứng Của Tường Lửa Sandbox[/bold red]",
        border_style="red"
    ))

if __name__ == "__main__":
    run_tool_calling_demo()

"""
main.py — Kịch bản chạy thực nghiệm Module 06: Model Context Protocol (MCP).
"""
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from modules.module06_model_context_protocol.server import EnterpriseMCPServer
from modules.module06_model_context_protocol.client import EnterpriseMCPClient

console = Console()

def run_mcp_demo():
    console.print(Panel.fit("[bold blue]DEMO MODULE 06: MODEL CONTEXT PROTOCOL (MCP)[/bold blue]", border_style="blue"))

    # 1. Khởi tạo MCP Server và đăng ký tài nguyên
    server = EnterpriseMCPServer(server_name="warehouse-inventory-mcp", version="2.4.0")

    # Đăng ký Resource
    server.register_resource(
        uri="inventory://guidelines",
        name="Hướng dẫn quản lý kho",
        description="Quy chuẩn lưu trữ và kiểm kê hàng hóa",
        content="Mọi mặt hàng linh kiện bán dẫn bắt buộc phải lưu trữ trong phòng kiểm soát độ ẩm dưới 40%."
    )

    # Đăng ký Tool
    def check_stock(item_code: str) -> dict:
        mock_db = {
            "GPU-A100": {"available": 14, "warehouse": "Khu công nghệ cao Q.9, TP.HCM", "status": "In Stock"},
            "GPU-H100": {"available": 4, "warehouse": "Khu công nghệ cao Hòa Lạc, Hà Nội", "status": "Low Stock"},
        }
        return mock_db.get(item_code, {"available": 0, "status": "Out of Stock"})

    server.register_tool(
        name="check_stock",
        description="Tra cứu số lượng tồn kho của thiết bị theo mã sản phẩm",
        properties={
            "item_code": {"type": "string", "description": "Mã sản phẩm (ví dụ: GPU-A100, GPU-H100)"}
        },
        required=["item_code"],
        handler=check_stock
    )

    # 2. Khởi tạo MCP Client và kết nối
    client = EnterpriseMCPClient(server)
    init_res = client.initialize()
    console.print(f"✅ Đã kết nối MCP Server: [bold cyan]{client.server_info.get('name')}[/bold cyan] (v{client.server_info.get('version')})")

    # 3. Client khám phá công cụ
    tools = client.list_tools()
    table = Table(title="Danh Sách Công Cụ Được Khám Phá Qua Giao Thức MCP")
    table.add_column("Tên Công Cụ", style="cyan")
    table.add_column("Mô Tả", style="white")
    table.add_column("Tham Số Bắt Buộc", style="green")

    for t in tools:
        table.add_row(
            t["name"],
            t["description"],
            ", ".join(t["inputSchema"]["required"])
        )
    console.print(table)

    # 4. Client gọi thực thi công cụ từ xa
    console.print("\n[yellow]Thực hiện gọi Tool từ xa qua JSON-RPC 2.0: `check_stock(item_code='GPU-H100')`...[/yellow]")
    tool_result = client.call_tool("check_stock", {"item_code": "GPU-H100"})
    console.print(Panel(
        f"[bold white]{tool_result}[/bold white]",
        title="[bold green]Kết Quả Trả Về Từ MCP Server[/bold green]",
        border_style="green"
    ))

    # 5. Client đọc Resource URI
    console.print("\n[yellow]Đọc Resource qua URI: `inventory://guidelines`...[/yellow]")
    resource_text = client.read_resource("inventory://guidelines")
    console.print(f"[dim italic]\"{resource_text}\"[/dim italic]\n")

if __name__ == "__main__":
    run_mcp_demo()

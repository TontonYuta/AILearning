"""
main.py — Kịch bản chạy thực nghiệm Module 01: Structured Outputs & Schema Validation.
"""
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from modules.module01_structured_output.schema import InvoiceData, CustomerInquiry
from modules.module01_structured_output.extractor import StructuredExtractor

console = Console()

def run_invoice_demo():
    console.print(Panel.fit("[bold blue]DEMO 1: TRÍCH XUẤT HÓA ĐƠN TÀI CHÍNH TỰ ĐỘNG[/bold blue]", border_style="blue"))
    
    sample_invoice_text = """
    CÔNG TY CỔ PHẦN CÔNG NGHỆ TRÍ TUỆ NHÂN TẠO
    Địa chỉ: Tầng 12, Tòa nhà Keangnam, Hà Nội
    Mã số thuế: 0109876543
    HÓA ĐƠN BÁN HÀNG SỐ: HD-884920
    Ngày lập: 10/10/2026
    
    Chi tiết dịch vụ:
    1. Gói API Server Dedicated A100 80GB (Số lượng: 2 tháng, Đơn giá: 15.000.000 VNĐ/tháng) -> 30.000.000 VNĐ
    2. Thiết lập cụm Vector Database Qdrant phân tán (Số lượng: 1 hệ thống, Đơn giá: 10.000.000 VNĐ) -> 10.000.000 VNĐ
    
    Cộng tiền hàng: 40.000.000 VNĐ
    Thuế GTGT (10%): 4.000.000 VNĐ
    Tổng tiền thanh toán: 44.000.000 VNĐ
    """

    extractor = StructuredExtractor()
    invoice: InvoiceData = extractor.extract(sample_invoice_text, InvoiceData)

    # Hiển thị bảng kết quả đẹp mắt
    table = Table(title=f"Hóa Đơn: {invoice.invoice_id} ({invoice.vendor_name})")
    table.add_column("Mô Tả", style="cyan")
    table.add_column("Số Lượng", justify="right")
    table.add_column("Đơn Giá", justify="right")
    table.add_column("Thành Tiền", justify="right", style="green")

    for item in invoice.items:
        table.add_row(
            item.description,
            str(item.quantity),
            f"{item.unit_price:,.0f} {invoice.currency.value}",
            f"{item.total_amount:,.0f} {invoice.currency.value}"
        )

    console.print(table)
    console.print(f"[bold]Tổng tiền trước thuế:[/bold] {invoice.subtotal:,.0f} {invoice.currency.value}")
    console.print(f"[bold]Thuế VAT:[/bold] {invoice.tax_amount:,.0f} {invoice.currency.value}")
    console.print(f"[bold green]TỔNG THANH TOÁN:[/bold green] {invoice.total_amount:,.0f} {invoice.currency.value}")
    console.print(f"[dim]Trạng thái kiểm định Pydantic V2: ĐẠT TIÊU CHUẨN 100%[/dim]\n")

def run_ticket_demo():
    console.print(Panel.fit("[bold green]DEMO 2: PHÂN LOẠI Ý ĐỊNH KHÁCH HÀNG & ROUTING[/bold green]", border_style="green"))
    
    sample_ticket = "Tôi bị trừ tiền 2 lần vào thẻ tín dụng khi mua gói Pro sáng nay, đề nghị hoàn tiền lại ngay!"
    extractor = StructuredExtractor()
    ticket: CustomerInquiry = extractor.extract(sample_ticket, CustomerInquiry)

    console.print(f"[bold]Khách hàng:[/bold] {ticket.customer_id}")
    console.print(f"[bold]Nội dung gốc:[/bold] {ticket.raw_message}")
    console.print(f"[bold]Phân loại ý định:[/bold] [yellow]{ticket.detected_intent.value}[/yellow]")
    console.print(f"[bold]Độ khẩn cấp:[/bold] {'🔴' * ticket.urgency_score} ({ticket.urgency_score}/5)")
    console.print(f"[bold]Chuyển giao chuyên viên:[/bold] {'CÓ (Ưu tiên cao)' if ticket.requires_human_agent else 'Không'}")

if __name__ == "__main__":
    run_invoice_demo()
    run_ticket_demo()

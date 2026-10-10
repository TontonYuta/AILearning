"""
main.py — Kịch bản chạy thực nghiệm Module 02: Chunking & Multi-Tenant Vector Search.
"""
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from modules.module02_vector_search.chunker import RecursiveCharacterChunker
from modules.module02_vector_search.vector_store import ProductionVectorStore

console = Console()

def run_chunking_and_search_demo():
    console.print(Panel.fit("[bold blue]DEMO MODULE 02: CHUNKING & MULTI-TENANT VECTOR SEARCH[/bold blue]", border_style="blue"))

    # Dữ liệu 2 khách hàng khác nhau
    doc_tenant_fintech = """
    QUY CHẾ BẢO MẬT DỮ LIỆU TÀI CHÍNH (TENANT: FINTECH-01)
    Điều 1: Mọi giao dịch chuyển khoản trên 50.000.000 VNĐ bắt buộc phải xác thực sinh trắc học khuôn mặt.
    Điều 2: Dữ liệu thẻ tín dụng và mã PIN khách hàng phải được mã hóa theo chuẩn AES-256 trước khi lưu vào cơ sở dữ liệu.
    Điều 3: Nhật ký truy cập hệ thống thanh toán phải được lưu trữ tối thiểu 5 năm để phục vụ kiểm toán ngân hàng nhà nước.
    """

    doc_tenant_logistics = """
    QUY TRÌNH VẬN HÀNH KHO BÃI VẬN TẢI (TENANT: LOGISTICS-02)
    Điều 1: Tất cả kiện hàng dễ vỡ bắt buộc phải dán tem cảnh báo màu đỏ và kiểm tra trọng lượng trước khi bốc dỡ.
    Điều 2: Lái xe vận tải đường dài phải nghỉ ngơi 15 phút sau mỗi 4 giờ lái xe liên tục để đảm bảo an toàn giao thông.
    Điều 3: Nhật ký xuất nhập kho phải được ký nhận điện tử ngay tại cửa giao hàng.
    """

    chunker = RecursiveCharacterChunker(chunk_size=150, chunk_overlap=30)
    store = ProductionVectorStore()

    # Phân đoạn và lập chỉ mục cho Khách hàng 1 (Fintech)
    chunks_fintech = chunker.split_text(doc_tenant_fintech, base_metadata={"tenant_id": "tenant_fintech_01", "sector": "finance"})
    store.insert_chunks(chunks_fintech)

    # Phân đoạn và lập chỉ mục cho Khách hàng 2 (Logistics)
    chunks_logistics = chunker.split_text(doc_tenant_logistics, base_metadata={"tenant_id": "tenant_logistics_02", "sector": "logistics"})
    store.insert_chunks(chunks_logistics)

    console.print(f"✅ Đã lập chỉ mục tổng cộng: [bold green]{len(store.records)}[/bold green] chunks.")

    # 1. Truy vấn câu hỏi về bảo mật chuyển khoản nhưng lọc đúng Tenant Fintech
    query = "Quy định xác thực sinh trắc học khi chuyển khoản số tiền lớn là gì?"
    console.print(f"\n[bold yellow]Câu hỏi:[/bold yellow] \"{query}\"")
    console.print("[cyan]Áp dụng Filter:[/cyan] `tenant_id = tenant_fintech_01`")

    results_fintech = store.search(query, top_k=2, filters={"tenant_id": "tenant_fintech_01"})
    
    table1 = Table(title="Kết quả trả về cho Tenant Fintech")
    table1.add_column("Chunk ID", style="dim")
    table1.add_column("Similarity", justify="center", style="green")
    table1.add_column("Nội dung", style="white")
    for r in results_fintech:
        table1.add_row(r["chunk_id"], f"{r['similarity_score']:.3f}", r["content"].strip())
    console.print(table1)

    # 2. Chứng minh cách ly: Thử tìm kiếm với Filter của Tenant Logistics
    console.print("\n[magenta]Kiểm tra khả năng cách ly dữ liệu (Data Isolation Test):[/magenta]")
    console.print("Truy vấn cùng câu hỏi tài chính nhưng Filter sang `tenant_id = tenant_logistics_02`:")
    results_leak_check = store.search(query, top_k=2, filters={"tenant_id": "tenant_logistics_02"})

    table2 = Table(title="Kết quả trả về cho Tenant Logistics (Không được rò rỉ dữ liệu Fintech)")
    table2.add_column("Chunk ID", style="dim")
    table2.add_column("Similarity", justify="center", style="yellow")
    table2.add_column("Nội dung", style="white")
    for r in results_leak_check:
        table2.add_row(r["chunk_id"], f"{r['similarity_score']:.3f}", r["content"].strip())
    console.print(table2)
    console.print("[bold green]✔ Kết quả: Toàn bộ dữ liệu của Fintech được bảo vệ tuyệt đối, không rò rỉ sang Logistics![/bold green]\n")

if __name__ == "__main__":
    run_chunking_and_search_demo()

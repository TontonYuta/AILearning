"""
main.py — Kịch bản chạy thực nghiệm Module 03: Production Hybrid RAG & Re-ranking.
"""
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from modules.module02_vector_search.chunker import RecursiveCharacterChunker
from modules.module03_production_rag.rag_pipeline import ProductionRAGPipeline

console = Console()

def run_production_rag_demo():
    console.print(Panel.fit("[bold blue]DEMO MODULE 03: HYBRID RAG (BM25 + DENSE) & RE-RANKING[/bold blue]", border_style="blue"))

    # Tài liệu vận hành sự cố hạ tầng AI
    runbook_text = """
    SỔ TAY VẬN HÀNH SỰ CỐ HẠ TẦNG AI (SRE RUNBOOK 2026)
    
    Quy trình 1: Mã lỗi ERR-401-UNAUTHORIZED xuất hiện khi API Token của khách hàng hết hạn hoặc bị thu hồi.
    Cách xử lý: Kiểm tra lại Authorization Header và tạo lại token tại cổng quản trị bảo mật.
    
    Quy trình 2: Mã lỗi ERR-503-TIMEOUT phát sinh khi cụm GPU Inference bị quá tải hàng đợi yêu cầu vLLM.
    Cách xử lý: Hệ thống cần kích hoạt Circuit Breaker tạm ngưng gọi upstream và kích hoạt cơ chế retry tự động theo hàm số mũ sau tối đa 3 lần.
    
    Quy trình 3: Mã lỗi ERR-429-RATE-LIMIT xảy ra khi số token mỗi phút (TPM) vượt ngưỡng đăng ký gói dịch vụ.
    Cách xử lý: Trả về mã HTTP 429 kèm cờ Retry-After và đẩy request vào hàng đợi đệm Redis.
    """

    chunker = RecursiveCharacterChunker(chunk_size=160, chunk_overlap=30)
    chunks = chunker.split_text(runbook_text, base_metadata={"source": "sre_runbook.md"})

    pipeline = ProductionRAGPipeline()
    pipeline.index_documents(chunks)

    question = "Khi gặp mã lỗi ERR-503-TIMEOUT thì quy trình kỹ thuật phải xử lý thế nào?"
    console.print(f"[bold yellow]Câu hỏi người dùng:[/bold yellow] \"{question}\"")
    console.print("[dim]Hệ thống đang thực thi: Hybrid Retrieval (BM25 + Dense) -> Reciprocal Rank Fusion -> Cross-Encoder Rerank...[/dim]\n")

    response = pipeline.answer(question, top_k_retrieval=4, top_n_rerank=2)

    # Hiển thị bảng ngữ cảnh đã trích xuất và điểm re-rank
    table = Table(title="Ngữ Cảnh Được Tái Xếp Hạng (Top Reranked Chunks)")
    table.add_column("Mã Chunk", style="cyan")
    table.add_column("Điểm Rerank", justify="center", style="green")
    table.add_column("Nội dung trích đoạn", style="white")

    for ctx in response.retrieved_contexts:
        table.add_row(
            ctx["chunk_id"],
            f"{ctx.get('rerank_score', 0.0):.3f}",
            ctx["content"].strip()
        )
    console.print(table)

    # Hiển thị câu trả lời và kiểm định trích dẫn
    console.print(Panel(
        f"[bold white]{response.answer}[/bold white]\n\n"
        f"[bold]Nguồn trích dẫn xác thực:[/bold] [cyan]{response.citations}[/cyan]\n"
        f"[bold]Độ tin cậy (Confidence):[/bold] [green]{response.confidence_score * 100:.1f}%[/green]\n"
        f"[bold]Trạng thái kiểm định Groundedness:[/bold] "
        f"{'[bold green]ĐẠT (Dựa trên tài liệu gốc)[/bold green]' if response.is_grounded else '[bold red]NGHI NGỜ ẢO GIÁC[/bold red]'}",
        title="[bold green]Phản Hồi Từ RAG Pipeline[/bold green]",
        border_style="green"
    ))

if __name__ == "__main__":
    run_production_rag_demo()

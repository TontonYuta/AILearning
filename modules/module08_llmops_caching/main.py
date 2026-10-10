"""
main.py — Kịch bản chạy thực nghiệm Module 08: Semantic Cache & LLMOps Observability.
"""
import time
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from modules.module08_llmops_caching.semantic_cache import SemanticCache
from modules.module08_llmops_caching.cost_tracer import LLMOpsTracer

console = Console()

def run_caching_observability_demo():
    console.print(Panel.fit("[bold blue]DEMO MODULE 08: SEMANTIC CACHING & COST OBSERVABILITY[/bold blue]", border_style="blue"))

    # Ngưỡng cosine 0.80
    cache = SemanticCache(similarity_threshold=0.80)
    tracer = LLMOpsTracer()

    def handle_user_query(query: str, model: str = "gpt-4o") -> dict:
        span = tracer.start_span("chat_completion", model=model)

        # 1. Tra cứu Semantic Cache
        cached_res, sim_score = cache.get(query)
        if cached_res:
            time.sleep(0.005)  # Giả lập độ trễ truy cập RAM/Redis 5ms
            span.finish(input_tokens=0, output_tokens=0, is_cache_hit=True)
            return {
                "query": query,
                "answer": cached_res,
                "status": "CACHE HIT (RAM/Redis)",
                "similarity": sim_score,
                "latency_ms": span.duration_ms,
                "cost_usd": span.cost_usd
            }

        # 2. Cache Miss -> Gọi Model API
        time.sleep(0.350)  # Giả lập độ trễ mạng gọi LLM Cloud 350ms
        llm_response = (
            "Màn hình Dell chính hãng được bảo hành 36 tháng (3 năm) đổi mới tận nơi trong trường hợp lỗi panel."
        )
        cache.set(query, llm_response)
        span.finish(input_tokens=450, output_tokens=85, is_cache_hit=False)

        return {
            "query": query,
            "answer": llm_response,
            "status": "CACHE MISS (Gọi API Cloud)",
            "similarity": sim_score,
            "latency_ms": span.duration_ms,
            "cost_usd": span.cost_usd
        }

    # Lần 1: Câu hỏi gốc
    q1 = "Chính sách bảo hành màn hình máy tính Dell là bao lâu?"
    console.print(f"[bold yellow]Yêu cầu 1:[/bold yellow] \"{q1}\"")
    res1 = handle_user_query(q1)

    # Lần 2: Câu hỏi biến thể ngữ nghĩa tương đương
    q2 = "Màn hình máy tính Dell được bảo hành bao lâu?"
    console.print(f"[bold yellow]Yêu cầu 2 (Biến thể ngữ nghĩa):[/bold yellow] \"{q2}\"")
    res2 = handle_user_query(q2)

    # Bảng so sánh
    table = Table(title="SO SÁNH HIỆU NĂNG: CACHE MISS VS CACHE HIT")
    table.add_column("Chỉ Số", style="cyan")
    table.add_column("Lần 1 (Chưa có Cache)", style="yellow")
    table.add_column("Lần 2 (Semantic Cache Hit)", style="green")

    table.add_row("Trạng thái", res1["status"], res2["status"])
    table.add_row("Độ tương đồng Cosine", "N/A", f"{res2['similarity']:.3f}")
    table.add_row("Độ trễ phản hồi (Latency)", f"{res1['latency_ms']:.1f} ms", f"[bold green]{res2['latency_ms']:.1f} ms[/bold green]")
    table.add_row("Chi phí API phát sinh", f"${res1['cost_usd']:.6f}", "[bold green]$0.000000[/bold green]")
    console.print(table)

    summary = tracer.get_summary()
    console.print(Panel(
        f"[bold]Tổng số Request:[/bold] {summary['total_requests']} | [bold]Tỷ lệ Cache Hit:[/bold] [green]{summary['cache_hit_rate']*100:.0f}%[/green]\n"
        f"[bold]Tổng chi phí sau tối ưu:[/bold] [green]${summary['total_cost_usd']:.6f}[/green] (Tiết kiệm 50% ngay từ request thứ 2)",
        title="[bold green]Báo Cáo Giám Sát LLMOps Tracing[/bold green]",
        border_style="green"
    ))

if __name__ == "__main__":
    run_caching_observability_demo()

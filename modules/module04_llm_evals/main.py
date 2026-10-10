"""
main.py — Kịch bản chạy thực nghiệm Module 04: LLM Evals & Benchmarking Report Card.
"""
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from modules.module04_llm_evals.metrics import compute_faithfulness, compute_answer_relevance
from modules.module04_llm_evals.judge import LLMJudge

console = Console()

def run_evals_demo():
    console.print(Panel.fit("[bold blue]DEMO MODULE 04: AUTOMATED LLM EVALS & BENCHMARKING[/bold blue]", border_style="blue"))

    context = """
    Quy định nghỉ phép năm 2026: Nhân viên chính thức được hưởng 12 ngày phép có lương mỗi năm.
    Thời gian làm việc từ 8:30 đến 17:30 từ thứ Hai đến thứ Sáu.
    Nhân viên làm việc trên 5 năm sẽ được cộng thêm 1 ngày phép cho mỗi năm cống hiến tiếp theo.
    """

    question = "Nhân viên chính thức làm việc 2 năm thì có bao nhiêu ngày phép?"

    # So sánh 2 phiên bản phản hồi:
    # Model A (Tốt - Grounded)
    answer_model_a = (
        "Theo quy định năm 2026, nhân viên chính thức được hưởng 12 ngày phép có lương mỗi năm. "
        "Do nhân viên làm việc 2 năm (dưới 5 năm), nên vẫn áp dụng mức tiêu chuẩn là 12 ngày phép."
    )

    # Model B (Kém - Ảo giác / Bịa đặt)
    answer_model_b = (
        "Nhân viên làm việc 2 năm sẽ được 20 ngày nghỉ phép cộng thêm 5 ngày nghỉ dưỡng sức đặc biệt "
        "và được công ty đài thọ chuyến du lịch châu Âu miễn phí hàng năm."
    )

    judge = LLMJudge()

    # Đánh giá Model A
    faith_a, _ = compute_faithfulness(answer_model_a, context)
    rel_a = compute_answer_relevance(question, answer_model_a)
    judge_a = judge.evaluate(question, context, answer_model_a)

    # Đánh giá Model B
    faith_b, _ = compute_faithfulness(answer_model_b, context)
    rel_b = compute_answer_relevance(question, answer_model_b)
    judge_b = judge.evaluate(question, context, answer_model_b)

    # Bảng điểm so sánh
    table = Table(title="BẢNG ĐIỂM KIỂM ĐỊNH CHẤT LƯỢNG (EVALS REPORT CARD)")
    table.add_column("Chỉ Số Đánh Giá", style="cyan")
    table.add_column("Ngưỡng Chuẩn", justify="center", style="dim")
    table.add_column("Model A (Grounded)", justify="center", style="green")
    table.add_column("Model B (Ảo giác)", justify="center", style="red")

    table.add_row("Faithfulness (Độ trung thực)", ">= 0.85", f"{faith_a:.2f}", f"{faith_b:.2f}")
    table.add_row("Answer Relevance (Trúng câu hỏi)", ">= 0.70", f"{rel_a:.2f}", f"{rel_b:.2f}")
    table.add_row("LLM Judge Score (Thang 1-5)", ">= 4/5", f"{judge_a.score}/5", f"{judge_b.score}/5")
    table.add_row("Phát hiện Ảo giác (Hallucination)", "False", "KHÔNG", "CÓ (BỊA ĐẶT)")
    table.add_row(
        "KẾT QUẢ DUYỆT CI/CD",
        "PASS",
        "[bold green]PASS (ĐẠT CHUẨN)[/bold green]",
        "[bold red]FAIL (CHẶN DEPLOY)[/bold red]"
    )

    console.print(table)
    console.print(f"\n[bold]Nhận xét của Giám khảo AI cho Model B:[/bold] [red]{judge_b.reasoning}[/red]\n")

if __name__ == "__main__":
    run_evals_demo()

"""
main.py — Kịch bản chạy thực nghiệm Module 10: Local Serving & LoRA Adapter Switching.
"""
import json
import numpy as np
from rich.console import Console
from rich.panel import Panel

from modules.module10_local_serving_lora.lora_engine import DynamicLoRALinear, LoRAAdapter
from modules.module10_local_serving_lora.local_server import LocalInferenceEngine

console = Console()

def run_local_lora_demo():
    console.print(Panel.fit("[bold blue]DEMO MODULE 10: LOCAL SERVING & LORA MULTI-ADAPTER SWITCHING[/bold blue]", border_style="blue"))

    # 1. Kiểm chứng toán học LoRA Dynamic Switching
    console.print("[bold yellow]Phần 1: Kiểm thử tầng toán học LoRA Forward Pass[/bold yellow]")
    in_dim, out_dim = 16, 8
    linear_layer = DynamicLoRALinear(in_features=in_dim, out_features=out_dim)

    # Nạp Adapter Tài chính (Rank 4, Alpha 16)
    finance_adapter = LoRAAdapter("finance", in_features=in_dim, out_features=out_dim, rank=4, alpha=16.0)
    # Khởi tạo trọng số B giả lập có giá trị để thấy sự thay đổi
    finance_adapter.B.fill(0.05)
    linear_layer.add_adapter(finance_adapter)

    sample_input = np.ones((1, in_dim), dtype=np.float32)

    # Chạy Base Model (chưa kích hoạt adapter)
    out_base = linear_layer.forward(sample_input)
    # Kích hoạt Adapter
    linear_layer.set_active_adapter("finance")
    out_lora = linear_layer.forward(sample_input)

    diff = float(np.linalg.norm(out_lora - out_base))
    console.print(f"Base Output Norm: {float(np.linalg.norm(out_base)):.4f}")
    console.print(f"LoRA Output Norm: {float(np.linalg.norm(out_lora)):.4f}")
    console.print(f"[green]✔ Độ lệch trọng số do LoRA đóng góp: {diff:.4f} (Trọng số gốc W0 được giữ nguyên tuyệt đối!)[/green]\n")

    # 2. Kiểm chứng Cổng phục vụ OpenAI-Compatible Local Serving
    console.print("[bold yellow]Phần 2: Phục vụ suy luận OpenAI-Compatible với Multi-Adapter Routing[/bold yellow]")
    engine = LocalInferenceEngine()

    # Gọi với Adapter Tài chính
    res_fin = engine.chat_completion(
        messages=[{"role": "user", "content": "Phân loại hóa đơn mua thẻ nhớ 500k"}],
        model="meta-llama-3.1-8b",
        adapter_id="finance-classifier"
    )
    console.print(f"[cyan]Response [Finance Adapter]:[/cyan] {res_fin['choices'][0]['message']['content']}")

    # Gọi với Adapter Pháp lý
    res_legal = engine.chat_completion(
        messages=[{"role": "user", "content": "Kiểm tra điều khoản bảo mật"}],
        model="meta-llama-3.1-8b",
        adapter_id="legal-contract-extractor"
    )
    console.print(f"[magenta]Response [Legal Adapter]:[/magenta] {res_legal['choices'][0]['message']['content']}")

    # 3. Kiểm chứng Server-Sent Events (SSE) Streaming
    console.print("\n[bold yellow]Phần 3: Kiểm chứng luồng truyền trực tiếp (Server-Sent Events Streaming)[/bold yellow]")
    stream = engine.chat_completion(
        messages=[{"role": "user", "content": "Tóm tắt"}],
        model="meta-llama-3.1-8b",
        adapter_id="finance-classifier",
        stream=True
    )
    
    console.print("[dim]Dữ liệu stream SSE nhận được từ server:[/dim]")
    for chunk_line in stream:
        if chunk_line.startswith("data: ") and "[DONE]" not in chunk_line:
            data_dict = json.loads(chunk_line[6:])
            token = data_dict["choices"][0]["delta"]["content"]
            console.print(f"[bold green]{token}[/bold green]", end="")
    console.print("\n[bold green]✔ Kết thúc stream SSE an toàn![/bold green]\n")

if __name__ == "__main__":
    run_local_lora_demo()

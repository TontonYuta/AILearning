# GLOSSARY.md — TỪ ĐIỂN THUẬT NGỮ KỸ NGHỆ AI SONG NGỮ (ANH - VIỆT)

Tài liệu này lưu trữ danh mục thuật ngữ kỹ thuật chuẩn mực được sử dụng nhất quán trong toàn bộ giáo trình.
Quy tắc: Khi thuật ngữ xuất hiện lần đầu trong bài, ghi chú song ngữ: `Thuật ngữ tiếng Anh (nghĩa tiếng Việt giải thích)`. Ở các lần sau có thể sử dụng thuật ngữ tiếng Anh gốc.

| Thuật ngữ tiếng Anh | Thuật ngữ tiếng Việt / Giải nghĩa bản chất | Bối cảnh sử dụng |
| :--- | :--- | :--- |
| **Inference** | Quá trình suy luận (sử dụng mô hình đã huấn luyện để dự đoán kết quả mới) | Model Lifecycle |
| **Weights** | Trọng số mô hình (các giá trị số học được lưu lại sau quá trình huấn luyện) | Deep Learning |
| **Context Window** | Cửa sổ ngữ cảnh (giới hạn số lượng token tối đa mô hình có thể xử lý trong một lượt) | LLM Core |
| **Tokenization** | Quá trình mã hóa từ văn bản thô thành các mẩu số nguyên (tokens) | NLP / Transformer |
| **Self-Attention** | Cơ chế tự chú ý (tính toán mức độ liên quan giữa các token trong cùng một chuỗi) | Transformer |
| **KV Cache** | Bộ đệm Key-Value (cơ chế lưu lại trạng thái tính toán của các token trước đó để tăng tốc suy luận) | LLM Inference |
| **Prompt Injection** | Tấn công tiêm mã lệnh vào prompt (kỹ thuật đưa hướng dẫn độc hại nhằm bẻ gãy hành vi dự kiến của LLM) | AI Security |
| **Function / Tool Calling** | Cơ chế gọi hàm / công cụ (LLM sinh tham số có cấu trúc để mã nguồn backend thực thi hành động) | LLM Engineering |
| **Grounding** | Cơ sở hóa / Neo dữ kiện (buộc câu trả lời của mô hình phải bám sát vào tài liệu thực tế) | RAG / Evaluation |
| **Faithfulness** | Tính trung thực (thước đo xác định câu trả lời có chứa thông tin không có trong ngữ cảnh hay không) | RAG Evaluation |
| **Hallucination** | Ảo giác mô hình (hiện tượng LLM tự bịa ra thông tin sai lệch với sự tự tin cao) | LLM Diagnostics |
| **Continuous Batching** | Xếp mẻ liên tục (cơ chế phục vụ request động theo từng token thay vì đợi cả mẻ kết thúc) | Model Serving (vLLM) |
| **PagedAttention** | Cơ chế phân trang bộ nhớ chú ý (tương tự bộ nhớ ảo OS, giải quyết phân mảnh VRAM) | Model Serving (vLLM) |
| **Quantization** | Lượng tử hóa (kỹ thuật giảm độ chính xác của trọng số số thực để tiết kiệm VRAM) | Model Optimization |
| **Low-Rank Adaptation (LoRA)** | Tinh chỉnh thích ứng rank thấp (đóng băng mô hình gốc, chỉ huấn luyện 2 ma trận phụ trợ) | Fine-Tuning |
| **State Machine** | Máy trạng thái (mô hình tính toán có trạng thái lưu giữ và các bước chuyển dịch) | AI Agents (LangGraph) |
| **Human-in-the-loop (HITL)** | Cơ chế can thiệp của con người (dừng luồng để người dùng phê duyệt trước hành động nhạy cảm) | Agent Safety |

# CURRICULUM.md — TOÀN BỘ CHƯƠNG TRÌNH ĐÀO TẠO KỸ SƯ AI (PHASE 0 ĐẾN PHASE 9)

Chương trình giáo trình kỹ sư AI này được thiết kế theo lộ trình phụ thuộc nghiêm ngặt:
**Không nhảy cóc — Đi từ bản chất — Thực chiến đến mức xây dựng và bảo vệ hệ thống production.**

---

## TỔNG QUAN LỘ TRÌNH 10 GIAI ĐOẠN

```text
PHASE 0: Định hướng nghề nghiệp & Toàn cảnh Hệ thống AI (Orientation)
   ↓
PHASE 1: Nền tảng Kỹ nghệ Phần mềm & Hệ thống (Engineering Foundation)
   ↓
PHASE 2: Nền tảng Toán học, Machine Learning & Deep Learning (AI/ML Core)
   ↓
PHASE 3: Kỹ nghệ Mô hình Ngôn ngữ Lớn (LLM & Transformer Engineering)
   ↓
PHASE 4: Hệ thống RAG & AI Agent Tự hành (RAG & Agent Engineering)
   ↓
PHASE 5: Đưa AI vào Vận hành Production (Production AI & MLOps)
   ↓
PHASE 6: Giao thoa Mạng máy tính & An ninh mạng AI (AI × Network × Cybersecurity)
   ↓
PHASE 7: Thiết kế Kiến trúc Hệ thống AI Quy mô lớn (AI System Design)
   ↓
PHASE 8: Dự án Đỉnh cao & Nền tảng Vận hành Thực tế (Capstone Platform)
   ↓
PHASE 9: Phát triển Sự nghiệp, Portfolio & Phỏng vấn Kỹ thuật (Career & Defense)
```

---

## CHI TIẾT CÁC GIAI ĐOẠN ĐÀO TẠO

### PHASE 0 — ĐỊNH HƯỚNG & TOÀN CẢNH HỆ THỐNG AI (ORIENTATION)
*Mục tiêu: Xóa bỏ nhận thức mơ hồ về AI, định vị rõ vai trò AI Engineer khác biệt với Data Scientist hay ML Researcher, thấu hiểu vòng đời dữ liệu và luồng suy luận.*

- **Bài 0.1: Bản chất của AI, Machine Learning, Deep Learning và Generative AI**:
  - Phân tầng lịch sử và công nghệ từ Rules-based đến Self-supervised learning.
  - Sự bùng nổ của Large Language Models (LLM).
- **Bài 0.2: Bản đồ Nghề nghiệp trong Kỷ nguyên AI**:
  - Phân định rõ trách nhiệm: AI Engineer vs ML Engineer vs Data Scientist vs Data Engineer vs MLOps Engineer vs AI Security Engineer.
  - Giá trị cốt lõi của một AI Application / Platform Engineer.
- **Bài 0.3: Vòng đời Hệ thống AI từ Dữ liệu đến Production (The AI Lifecycle)**:
  - Data Ingestion → Feature/Embedding → Model Selection → Inference → Application Logic → Evaluation → Deployment → Monitoring.
- **Bài 0.4: Mental Model: Model vs Inference vs Application vs Infrastructure**:
  - Trọng số mô hình (Weights) là gì?
  - Quá trình suy luận (Inference) tiêu thụ tài nguyên phần cứng như thế nào?
  - Tầng ứng dụng (Application layer) đóng vai trò gì trong việc tạo ra giá trị doanh nghiệp?

---

### PHASE 1 — NỀN TẢNG KỸ NGHỆ PHẦN MỀM & HỆ THỐNG (ENGINEERING FOUNDATION)
*Mục tiêu: Đưa người học từ con số 0 trở thành một lập trình viên có tư duy phần mềm vững chắc, thông thạo Linux, mạng máy tính, cơ sở dữ liệu và API.*

#### Phân hệ 1.1: Lập trình Python Chuyên nghiệp (Python Mastery)
- **Bài 1.1.1: Cú pháp, Kiểu dữ liệu nguyên thủy & Collections (List, Dict, Set, Tuple)**: Cơ chế lưu trữ bộ nhớ và độ phức tạp thao tác.
- **Bài 1.1.2: Functions, Scopes, Closures & Decorators**: Xây dựng middleware, timing decorator, retry decorator.
- **Bài 1.1.3: Lập trình Hướng đối tượng (OOP) & Composition over Inheritance**: Thiết kế các abstract class cho LLM provider, Tool interface.
- **Bài 1.1.4: Generators, Iterators & Stream Data**: Xử lý dữ liệu lớn, streaming token từ LLM API.
- **Bài 1.1.5: Context Managers & Resource Handling**: Cơ chế `with`, quản lý GPU memory context, database connection pools.
- **Bài 1.1.6: Type Hints, Dataclasses & Pydantic V2**: Ép kiểu dữ liệu tĩnh, xác thực schema JSON đầu vào/đầu ra.
- **Bài 1.1.7: Asynchronous Programming (async/await, asyncio)**: Xử lý I/O-bound concurrency, gọi hàng trăm API đồng thời không nghẽn luồng.
- **Bài 1.1.8: Quản lý Môi trường, Dependency & Cấu trúc Dự án Clean Architecture**: Virtual environments (venv, uv), poetry, logging, `.env`, configuration pattern.
- **Bài 1.1.9: Kiểm thử Phần mềm (Pytest, Mocking, Fixtures)**: Viết unit test cho code AI, mock API bên ngoài.

#### Phân hệ 1.2: Khoa học Máy tính Cốt lõi (CS Fundamentals)
- **Bài 1.2.1: Cấu trúc Dữ liệu & Giải thuật Phổ biến**: Array, Hash Table, Stack, Queue, Tree, Heap, Graph và đánh giá Big-O.
- **Bài 1.2.2: Tiến trình (Process), Tiểu trình (Thread) & Quản lý Bộ nhớ (Memory Management)**: Stack, Heap, Pointer, GIL trong Python, IPC.

#### Phân hệ 1.3: Linux & Môi trường Dòng lệnh (Linux for AI Engineers)
- **Bài 1.3.1: Hệ thống Tệp tin, Phân quyền & Quản lý Người dùng (Filesystem & Permissions)**: `chmod`, `chown`, POSIX permissions.
- **Bài 1.3.2: Dòng lệnh Bash, Lọc văn bản & Giám sát Tiến trình**: `grep`, `sed`, `awk`, `ps`, `kill`, `top`, `htop`.
- **Bài 1.3.3: Quản lý Dịch vụ Hệ thống (Systemd) & SSH Hardening**: Viết systemd service chạy API server nền tảng, tạo SSH key cặp.

#### Phân hệ 1.4: Mạng Máy tính Ứng dụng (Networking Fundamentals)
- **Bài 1.4.1: Mô hình OSI & TCP/IP**: IP address, Subnet, Routing, DNS, ARP, DHCP.
- **Bài 1.4.2: Giao thức TCP, UDP & Socket**: Bắt tay 3 bước, cơ chế tin cậy và mất gói.
- **Bài 1.4.3: Giao thức HTTP/1.1, HTTP/2 & HTTPS/TLS**: Headers, Status codes, TLS handshake, SSL certificate.
- **Bài 1.4.4: Bộ công cụ Chẩn đoán Mạng Kỹ sư**: `ping`, `traceroute`, `curl`, `dig`, `ss`, `tcpdump`.

#### Phân hệ 1.5: Kỹ nghệ Backend & RESTful API (FastAPI)
- **Bài 1.5.1: Thiết kế Chuẩn RESTful API & JSON Specification**: Endpoint convention, HTTP verbs, payload design.
- **Bài 1.5.2: Xây dựng High-Performance API với FastAPI**: Dependency Injection, Pydantic validation, CORS, Rate limiting, Error Handling.
- **Bài 1.5.3: Server-Sent Events (SSE) & WebSocket cho AI Streaming**: Truyền tải phản hồi từng từ của LLM theo thời gian thực về Client.

#### Phân hệ 1.6: Cơ sở Dữ liệu Quan hệ & Bộ nhớ đệm (Database & Redis)
- **Bài 1.6.1: Hệ quản trị Cơ sở dữ liệu Quan hệ PostgreSQL**: Schema design, Normalization, Khóa ngoại, Transaction (ACID).
- **Bài 1.6.2: Tối ưu hóa Truy vấn & Chỉ mục (Indexes & Query Optimization)**: B-tree index, Hash index, phân tích `EXPLAIN ANALYZE`.
- **Bài 1.6.3: Caching, Rate Limiting & Message Broker với Redis**: Lưu trữ session, caching kết quả LLM, cấu trúc Redis pub/sub.

#### Phân hệ 1.7: Kỹ nghệ Phần mềm Thực chiến (Software Engineering Practices)
- **Bài 1.7.1: Git & GitHub Nâng cao**: Branching strategy (Git Flow), Rebase vs Merge, Pull Request review, Merge conflicts.
- **Bài 1.7.2: Quản lý Bí mật (Secrets Management) & Tách biệt Môi trường**: Không bao giờ commit `.env` hoặc API keys lên repo, cấu hình bảo mật.

---

### PHASE 2 — NỀN TẢNG TOÁN HỌC, MACHINE LEARNING & DEEP LEARNING
*Mục tiêu: Nắm vững bản chất toán học phục vụ AI; không học toán hàn lâm, chỉ học những gì trực tiếp tạo nên tensor, loss function và thuật toán tối ưu.*

#### Phân hệ 2.1: Toán học Ứng dụng cho AI Engineering
- **Bài 2.1.1: Đại số Tuyến tính (Linear Algebra)**: Vector, Matrix, Dot Product, Matrix Multiplication, Vector Norms, Cosine Similarity, Eigenvalues/Eigenvectors.
- **Bài 2.1.2: Giải tích Đa biến (Multivariate Calculus)**: Đạo hàm riêng (Partial Derivatives), Gradient vector, Quy tắc dây chuyền (Chain Rule).
- **Bài 2.1.3: Xác suất & Thống kê Ứng dụng (Probability & Statistics)**: Biến ngẫu nhiên, Phân phối xác suất (Normal, Bernoulli), Kì vọng, Phương sai, Định lý Bayes, Khoảng tin cậy, A/B Testing.

#### Phân hệ 2.2: Bản chất Machine Learning (Classical ML)
- **Bài 2.2.1: Quy trình Chuẩn ML**: Feature Engineering, Train/Validation/Test split, Tránh Data Leakage.
- **Bài 2.2.2: Hiện tượng Quá khớp (Overfitting), Dưới khớp (Underfitting) & Đánh đổi Bias-Variance**.
- **Bài 2.2.3: Các Thuật toán Cốt lõi**: Linear Regression, Logistic Regression, Decision Tree, Random Forest, Gradient Boosting (XGBoost/LightGBM), K-Means clustering, PCA.
- **Bài 2.2.4: Bộ Thước đo Đánh giá (Evaluation Metrics)**: Accuracy, Precision, Recall, F1-score, ROC-AUC, MAE, MSE, RMSE.

#### Phân hệ 2.3: Deep Learning & Khung làm việc PyTorch
- **Bài 2.3.1: Mạng Nơ-ron Nhân tạo (Multilayer Perceptron - MLP)**: Activation functions (ReLU, Sigmoid, GeLU, Softmax), Forward pass, Backpropagation.
- **Bài 2.3.2: PyTorch Cốt lõi**: Tensor manipulation, Autograd mechanics, xây dựng `nn.Module`.
- **Bài 2.3.3: Hàm Mất mát (Loss Functions) & Thuật toán Tối ưu (Optimizers)**: CrossEntropy, MSE, SGD, Momentum, Adam, AdamW, Learning rate schedulers.
- **Bài 2.3.4: Xây dựng một Training Loop Chuẩn Kỹ sư từ Đầu**: DataLoader, Batching, GPU acceleration (`cuda`/`mps`), Checkpointing, Early stopping.
- **Bài 2.3.5: Các Kiến trúc Tiền thân Quan trọng**: Convolutional Neural Networks (CNN), Recurrent Neural Networks (RNN), LSTM và hạn chế của cơ chế tuần tự.

---

### PHASE 3 — KỸ NGHỆ TRANSFORMER & MÔ HÌNH NGÔN NGỮ LỚN (LLM ENGINEERING)
*Mục tiêu: Khám phá từng bánh răng bên trong kiến trúc Transformer; làm chủ hoàn toàn quá trình tạo token, suy luận và giao tiếp API với LLM.*

- **Bài 3.1: Kiến trúc Transformer từ Bản chất**:
  - Hạn chế của RNN/LSTM và sự ra đời của cơ chế Attention ("Attention is All You Need").
  - Tokenization: Byte-Pair Encoding (BPE), WordPiece, Tiktoken.
  - Embedding Vectors & Positional Encoding (Sinusoidal vs RoPE).
- **Bài 3.2: Cơ chế Tự Chú Ý (Self-Attention & Multi-Head Attention)**:
  - Bản chất của các ma trận $Q$ (Query), $K$ (Key), $V$ (Value).
  - Công thức Scaled Dot-Product Attention: $\text{Softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$.
  - Feed-Forward Networks (FFN), Residual Connections và LayerNorm (Pre-LN vs Post-LN).
  - Toàn bộ luồng dữ liệu từ văn bản thô đến output phân phối xác suất.
- **Bài 3.3: Cơ chế Suy luận của Mô hình Ngôn ngữ Lớn (LLM Inference)**:
  - Context Window, Autoregressive generation.
  - Các kỹ thuật giải mã (Decoding strategies): Greedy search, Beam search, Temperature, Top-K, Top-P sampling.
  - Cơ chế tăng tốc KV Cache (Key-Value Cache): Bản chất lưu trữ trạng thái để tránh tính toán trùng lặp.
  - Độ trễ (TTFT - Time To First Token, TPOT - Time Per Output Token), Throughput và Chi phí Token (Token economics).
- **Bài 3.4: Kỹ nghệ Giao tiếp LLM API Chuẩn Doanh nghiệp**:
  - Tích hợp chuẩn API (OpenAI/Anthropic/Gemini specification).
  - Xử lý Streaming Response qua Server-Sent Events.
  - Cơ chế Tự động Thử lại (Retries), Exponential Backoff, Jitter, Circuit Breaker và Timeout.
- **Bài 3.5: Cấu trúc Đầu ra Định dạng (Structured Output & JSON Schema Enforcement)**:
  - Kỹ thuật ép LLM trả về đúng định dạng JSON/Pydantic chuẩn 100%.
  - Trích xuất thông tin có cấu trúc từ văn bản không cấu trúc.
- **Bài 3.6: Cơ chế Gọi Công cụ (Function / Tool Calling)**:
  - Định nghĩa JSON schema cho tool.
  - Luồng hoạt động: Prompt → LLM sinh lời gọi hàm (arguments) → Thực thi code trên Backend → Trả kết quả về cho LLM tổng hợp câu trả lời.
- **Bài 3.7: Khung làm việc Hugging Face Transformers**:
  - Tải mô hình và tokenizer từ Hugging Face Hub.
  - Chạy mô hình cục bộ với `transformers` và `accelerate`.
  - Phân tích kiến trúc Encoder-Only (BERT), Decoder-Only (GPT, Llama), Encoder-Decoder (T5).

---

### PHASE 4 — HỆ THỐNG RAG & TỰ HÀNH AGENT (RAG & AGENT ENGINEERING)
*Mục tiêu: Xây dựng các hệ thống RAG cấp độ sản xuất có khả năng trích xuất chính xác tài liệu nội bộ và các Agent tự hành có khả năng giải quyết tác vụ phức tạp.*

#### Phân hệ 4.1: Hệ thống Truy xuất Dữ liệu Mở rộng (Production RAG)
- **Bài 4.1.1: Luồng Kiến trúc RAG Chuẩn Mực**: Ingestion → Chunking → Embedding → Vector Database → Retrieval → Context Assembly → Generation → Grounding.
- **Bài 4.1.2: Kỹ thuật Phân đoạn Tài liệu (Document Chunking Strategies)**: Fixed-size, Recursive Character, Semantic Chunking, Markdown/Code-aware chunking.
- **Bài 4.1.3: Mô hình Biểu diễn Ngữ nghĩa (Embeddings)**: Đánh giá mô hình embedding (MTEB leaderboard), kích thước chiều, embedding đa ngôn ngữ.
- **Bài 4.1.4: Cơ sở Dữ liệu Vector Chuyên sâu với Qdrant**: Lưu trữ vectors, cơ chế đánh chỉ mục HNSW (Hierarchical Navigable Small World), lọc metadata nâng cao (payload filtering).
- **Bài 4.1.5: Tìm kiếm Lai (Hybrid Search: Dense Vector + BM25 Sparse Search)**: Tại sao tìm kiếm vector thuần túy thất bại trước từ khóa chuyên môn/mã số? Kỹ thuật Reciprocal Rank Fusion (RRF).
- **Bài 4.1.6: Xếp hạng Lại (Reranking with Cross-Encoders)**: Tinh lọc kết quả top-k ban đầu để loại bỏ thông tin rác và đưa ngữ cảnh phù hợp nhất lên đầu.
- **Bài 4.1.7: Kỹ thuật Xử lý Truy vấn Nâng cao (Query Transformation)**: Multi-query expansion, HyDE (Hypothetical Document Embeddings), Query decomposition.
- **Bài 4.1.8: Trích dẫn Nguồn & Chống Ảo giác (Citations, Grounding & Attribution)**: Đảm bảo câu trả lời luôn chỉ rõ xuất xứ từ văn bản nào, trang nào.

#### Phân hệ 4.2: Đánh giá Định lượng Hệ thống RAG (RAG Evaluation)
- **Bài 4.2.1: Các Thước đo Cốt lõi**:
  - Retrieval Quality: Context Precision, Context Recall.
  - Generation Quality: Faithfulness (Tính trung thực), Answer Relevance (Độ liên quan).
- **Bài 4.2.2: Framework Đánh giá Tự động (Ragas / Custom LLM-as-a-Judge)**: Xây dựng bộ test set tổng hợp, chạy benchmark tự động trong CI/CD.

#### Phân hệ 4.3: Kiến trúc AI Agent Tự hành với LangGraph
- **Bài 4.3.1: Mental Model của một Agent**: LLM + State + Tools + Planning + Memory + Environment Feedback.
- **Bài 4.3.2: Mẫu Thiết kế Agent: ReAct (Reasoning + Acting)**: Vòng lặp Suy nghĩ → Hành động → Quan sát → Kết luận.
- **Bài 4.3.3: Xây dựng Agent Bền bỉ với LangGraph**:
  - Định nghĩa State Schema.
  - Thiết kế Nodes (xử lý logic) và Edges (điều kiện rẽ nhánh).
  - Xử lý chu trình lặp (Cyclic graphs) an toàn.
- **Bài 4.3.4: Bộ nhớ của Agent (Short-term & Long-term Memory)**: Session state, Thread management, External semantic memory.
- **Bài 4.3.5: Can thiệp Con người (Human-in-the-loop - HITL)**: Cơ chế ngắt (Breakpoint), yêu cầu người dùng xác nhận trước khi thực hiện thao tác nhạy cảm (xóa database, gửi email).
- **Bài 4.3.6: Kiến trúc Đa Agent (Multi-Agent Systems)**: Mô hình Supervisor / Worker, chuyển giao nhiệm vụ (handoff), so sánh LangGraph với CrewAI/AutoGen.

---

### PHASE 5 — ĐƯA AI VÀO VẬN HÀNH PRODUCTION (PRODUCTION AI & MLOPS)
*Mục tiêu: Đưa mô hình AI ra khỏi notebook để phục vụ hàng triệu request ổn định, tối ưu hóa phần cứng, giảm độ trễ và quản trị vòng đời mô hình.*

#### Phân hệ 5.1: Đóng gói Ứng dụng với Docker
- **Bài 5.1.1: Nền tảng Docker**: Image, Container, Volume, Network, Namespace, Cgroups.
- **Bài 5.1.2: Tối ưu Dockerfile cho AI & Python**: Multi-stage build, loại bỏ cache rác, bảo vệ non-root user, chạy với GPU qua NVIDIA Container Toolkit.
- **Bài 5.1.3: Docker Compose cho Cụm Dịch vụ Hoàn chỉnh**: Kết hợp FastAPI + Qdrant + PostgreSQL + Redis trong một file compose thống nhất.

#### Phân hệ 5.2: Tối ưu Phục vụ Mô hình (Model Serving với vLLM)
- **Bài 5.2.1: Những Điểm Nghẽn trong Suy luận LLM**: Giới hạn VRAM, phân mảnh bộ nhớ của Attention, GPU utilization thấp.
- **Bài 5.2.2: Công nghệ PagedAttention & Continuous Batching của vLLM**: Cơ chế quản lý bộ nhớ ảo tương tự hệ điều hành để tăng throughput gấp 10-20 lần.
- **Bài 5.2.3: Triển khai vLLM Server chuẩn OpenAI-compatible API**: Cấu hình tham số GPU memory utilization, max model len, tensor parallelism.

#### Phân hệ 5.3: Lượng tử hóa Mô hình (Model Quantization)
- **Bài 5.3.1: Định dạng Dữ liệu Số thực**: FP32, FP16, BF16, INT8, INT4.
- **Bài 5.3.2: Các Phương pháp Lượng tử hóa Hiện đại**: GPTQ, AWQ, GGUF (llama.cpp).
- **Bài 5.3.3: Bài toán Đánh đổi Toàn diện (Trade-offs)**: Dung lượng bộ nhớ vs Tốc độ suy luận vs Độ chính xác suy giảm vs Yêu cầu phần cứng.

#### Phân hệ 5.4: Tinh chỉnh Mô hình (Fine-Tuning PEFT / LoRA)
- **Bài 5.4.1: Bản đồ Quyết định: Prompting vs RAG vs Fine-Tuning vs Pretraining**: Khi nào thực sự cần Fine-tuning?
- **Bài 5.4.2: Tinh chỉnh Tham số Hiệu quả (PEFT) & Kỹ thuật LoRA / QLoRA**: Ma trận rank thấp $A$ và $B$, đóng băng trọng số gốc, giảm 90% bộ nhớ huấn luyện.
- **Bài 5.4.3: Quy trình Huấn luyện Supervised Fine-Tuning (SFT)**: Chuẩn bị dữ liệu định dạng hội thoại, chạy huấn luyện với Hugging Face TRL/SFTTrainer, đánh giá loss và overfitting.

#### Phân hệ 5.5: Quản trị Vòng đời Vận hành (MLOps / LLMOps)
- **Bài 5.5.1: Quản lý Thử nghiệm & Mô hình với MLflow**: Model registry, artifact tracking, so sánh tham số huấn luyện.
- **Bài 5.5.2: Tự động hóa CI/CD với GitHub Actions**: Tự động lint code (ruff), chạy test (pytest), build docker image và kiểm định an toàn khi push code.
- **Bài 5.5.3: Giám sát Hệ thống (Observability & Tracing)**: Theo dõi độ trễ, token consumption, error rate, tích hợp OpenTelemetry / Prometheus / Grafana.

---

### PHASE 6 — GIAO THOA MẠNG MÁY TÍNH & AN NINH MẠNG AI (AI × NETWORK × CYBERSECURITY)
*Mục tiêu: Trang bị năng lực chuyên sâu kết hợp AI với hạ tầng viễn thông và bảo mật thông tin; thấu hiểu các véc-tơ tấn công đặc thù nhắm vào LLM và cách phòng thủ chủ động.*

#### Phân hệ 6.1: Mạng Máy tính Chuyên sâu (Advanced Networking)
- **Bài 6.1.1: Định tuyến, Chuyển mạch & Mạng Cục bộ Ảo (VLAN, Subnetting, Routing protocols)**.
- **Bài 6.1.2: Tường lửa, NAT & Kiểm soát Truy cập (Firewall, IPTables, Security Groups)**.
- **Bài 6.1.3: Phân tích Gói tin Mạng Chuyên sâu**: Bắt và giải mã luồng dữ liệu với `tcpdump` và `wireshark`.

#### Phân hệ 6.2: Ứng dụng AI trong Vận hành Mạng (AI for Network Operations)
- **Bài 6.2.1: Phân tích Nhật ký Mạng Tự động (Syslog & Firewall Log Analyzer)**.
- **Bài 6.2.2: Trợ lý Chuẩn đoán & Khắc phục Sự cố Mạng (Network Troubleshooting Agent)**.
- **Bài 6.2.3: Phát hiện Dị thường Lưu lượng Mạng (Network Anomaly Detection)**.

#### Phân hệ 6.3: Nền tảng An toàn Thông tin (Cybersecurity Fundamentals)
- **Bài 6.3.1: Bộ ba CIA (Confidentiality, Integrity, Availability) & Mô hình Đe dọa (Threat Modeling)**.
- **Bài 6.3.2: Trung tâm Điều hành An ninh Mạng (SOC), Hệ thống SIEM & Quy trình Ứng phó Sự cố (Incident Response)**.

#### Phân hệ 6.4: Ứng dụng AI trong Giám sát An toàn Thông tin (AI for Cybersecurity)
- **Bài 6.4.1: Tự động Phân loại & Phân luồng Cảnh báo Bảo mật (Alert Triage Agent)**.
- **Bài 6.4.2: Trợ lý Tình báo Mối đe dọa (Cyber Threat Intelligence - CTI RAG)**: Trích xuất và đối chiếu kỹ thuật tấn công theo khung MITRE ATT&CK.
- **Bài 6.4.3: Tự động Tóm tắt Báo cáo Khám nghiệm Sự cố An ninh**.

#### Phân hệ 6.5: An ninh cho Hệ thống AI (AI Security & OWASP Top 10 for LLMs)
- **Bài 6.5.1: Tấn công Prompt Injection & Indirect Prompt Injection**: Bản chất kẻ tấn công tiêm mã lệnh ẩn trong tài liệu nguồn để chiếm quyền điều khiển LLM.
- **Bài 6.5.2: Đầu độc Dữ liệu RAG (RAG Poisoning & Knowledge Corruption)**: Làm sai lệch vector store để ép hệ thống đưa ra quyết định sai hoặc mã độc.
- **Bài 6.5.3: Lạm dụng Công cụ & Cấp quyền Quá mức (Tool Abuse & Excessive Agency)**: Rủi ro khi cấp quyền shell hoặc database execute cho agent mà thiếu guardrails.
- **Bài 6.5.4: Rò rỉ Dữ liệu Nhạy cảm & Bí mật Hệ thống (Data Leakage & Secret Exposure)**: Kỹ thuật ngăn chặn trích xuất System Prompt và thông tin PII.
- **Bài 6.5.5: Xây dựng Lớp Phòng ngự Chủ động (Guardrails & Sandboxing)**:
  - Input Validation & Guardrails (NeMo Guardrails / Llama Guard).
  - Cô lập thực thi mã nguồn trong môi trường Sandbox (Docker / gVisor / WASM).
  - Output Sanitization trước khi gửi về người dùng.

---

### PHASE 7 — THIẾT KẾ KIẾN TRÚC HỆ THỐNG AI QUY MÔ LỚN (AI SYSTEM DESIGN)
*Mục tiêu: Đạt năng lực thiết kế các hệ thống AI cấp doanh nghiệp chịu tải cao, sẵn sàng cao, phân tán và tối ưu hóa chi phí.*

- **Bài 7.1: Các Nguyên lý Thiết kế Hệ thống Cốt lõi**:
  - Khả năng mở rộng (Scalability: Horizontal vs Vertical).
  - Tính sẵn sàng (Availability) & Độ tin cậy (Reliability).
  - Cân bằng tải (Load Balancing), Hàng đợi thông điệp (Message Queues: RabbitMQ / Kafka) và Asynchronous Ingestion.
- **Bài 7.2: Thiết kế Hệ thống RAG Phục vụ Hàng triệu Người dùng (Enterprise Multi-Tenant RAG)**:
  - Phân vùng dữ liệu an toàn (Data isolation giữa các công ty).
  - Caching hai tầng: Semantic Cache (GPTCache/Redis) + Exact Hash Cache.
  - Xử lý bất đồng bộ hàng triệu tài liệu tài liệu PDF/Docx.
- **Bài 7.3: Thiết kế Cụm Suy luận Mô hình Quy mô Lớn (High-Throughput Model Serving Cluster)**:
  - Định tuyến thông minh theo tải GPU và kích thước ngữ cảnh.
  - Chiến lược Fallback đa nhà cung cấp (Multi-provider fallback: Cloud LLM ↔ Self-hosted vLLM).
- **Bài 7.4: Quản lý và Tối ưu Hóa Chi phí Vận hành AI (AI Cost & Latency Optimization)**:
  - Chiến lược Routing phân cấp: Câu hỏi dễ gửi sang mô hình nhỏ (Haiku / 8B), câu hỏi khó gửi sang mô hình lớn (Opus / 70B).
  - Prompt Caching kỹ thuật sâu.
- **Bài 7.5: Tổng quan Hạ tầng Nâng cao (Kubernetes & Distributed Concepts)**:
  - Triển khai Pod, Service, Ingress cho AI APIs.
  - Tự động co giãn theo tải GPU (HPA với custom metrics).

---

### PHASE 8 — DỰ ÁN THỰC CHIẾN & CAPSTONE PLATFORM (PROJECTS / CAPSTONE)
*Mục tiêu: Tích hợp toàn bộ kiến thức vào các sản phẩm kỹ thuật thực tế với độ hoàn thiện cao nhất.*

#### Phân hệ 8.1: Hệ thống 10-15 Mini Projects Xuyên suốt
- Xây dựng CLI Document Search đơn giản với SQLite.
- Pipeline xử lý và làm sạch log máy chủ với Python Async.
- Custom PyTorch Linear Regression & Binary Classifier từ số 0.
- Tokenizer BPE tự chế.
- Caching Proxy cho OpenAI API với FastAPI & Redis.
- RAG Agent đơn giản đọc tài liệu nội bộ công ty.
- Bot chẩn đoán ping và DNS mạng cục bộ.
- Trình quét phát hiện Prompt Injection bằng Regular Expressions & Vector Classifier.

#### Phân hệ 8.2: 3-5 Engineering Projects Cấp độ Doanh nghiệp
1. **Enterprise Document Processing Pipeline**: Hệ thống OCR, phân loại văn bản, bóc tách hóa đơn tự động với Pydantic và RabbitMQ.
2. **Automated Incident Triage System**: Tự động nhận webhook từ Jira/Sentry, đối chiếu mã nguồn GitHub, phân tích nguyên nhân và đề xuất pull request sửa lỗi.
3. **High-Performance Self-Hosted LLM Gateway**: Hệ thống Gateway cân bằng tải nhiều máy chủ vLLM, tích hợp Semantic Caching và Rate Limiting.

#### Phân hệ 8.3: FLAGSHIP CAPSTONE: AI NETWORK & SECURITY OPERATIONS PLATFORM (AI-NetSecOps)
- **Kiến trúc tổng thể**:
  ```text
  React/Vite Web UI (Dashboard quản trị)
           ↓
  FastAPI Gateway (JWT Auth, RBAC, Rate Limiting, OpenAPI)
           ↓
  LangGraph Orchestration Agent
   ├── RAG Engine (Qdrant + PostgreSQL + Reranker + Hybrid Search)
   ├── Network Diagnostics Tools (Ping, Traceroute, DNS, Port Scanner)
   ├── Log Intelligence Tools (Suricata/Snort/Syslog Analyzer)
   ├── Security Advisory Tools (CVE / NVD lookup, ATT&CK mapping)
   └── Remediation Tools (IP blocklist generator, Firewall rule recommender)
           ↓
  Serving Layer: Local vLLM (Llama-3/Qwen) kết hợp Cloud LLM Fallback
           ↓
  Evaluation & Guardrails (Llama-Guard / Input Sanitization)
           ↓
  Observability & Metrics (OpenTelemetry, Prometheus, Grafana)
  ```
- **Tiêu chuẩn Trưởng thành 6 Cấp độ (Project Maturity Levels)**:
  - Level 1: Make it work (Chạy được luồng cơ bản end-to-end).
  - Level 2: Understand it (Giải thích cặn kẽ mọi quyết định kiến trúc).
  - Level 3: Test it (Độ bao phủ test > 80%, có mock và integration test).
  - Level 4: Secure it (Đạt chuẩn bảo vệ OWASP LLM, sandbox toàn bộ tools).
  - Level 5: Optimize it (P95 latency < 500ms, token streaming mượt mà).
  - Level 6: Deploy it (Đóng gói Docker Compose production-ready, CI/CD automated).

---

### PHASE 9 — PHÁT TRIỂN SỰ NGHIỆP, PORTFOLIO & PHỎNG VẤN (CAREER MASTERY)
*Mục tiêu: Đưa các sản phẩm đã xây dựng lên CV và GitHub theo cách chuyên nghiệp nhất, vượt qua mọi vòng phỏng vấn kỹ thuật gắt gao.*

- **Bài 9.1: Kỹ nghệ Viết CV Đạt chuẩn ATS Dành cho Kỹ sư AI**:
  - Công thức mô tả dự án định lượng: `Problem + Engineering Action + Technical Decision + Quantified Result`.
  - Tuyệt đối loại bỏ các từ vô nghĩa: "Built advanced AI system" mà không có dẫn chứng số liệu.
- **Bài 9.2: Xây dựng Portfolio & GitHub Trưng bày Chất lượng Cao**:
  - Cấu trúc README của một repo đạt chuẩn: Why, What, Architecture Diagram, Quickstart with Docker, Engineering Trade-offs, Benchmarks.
- **Bài 9.3: Chiến lược Vượt qua 6 Vòng Phỏng vấn AI Engineer**:
  - Vòng 1: Coding & Data Structures (Python live-coding).
  - Vòng 2: CS & Backend Fundamentals (OS, Network, Concurrency, PostgreSQL).
  - Vòng 3: AI/ML & Transformer Deep-Dive (Giải thích toán, backprop, attention, KV cache).
  - Vòng 4: AI Engineering & RAG/Agent Architecture (Xử lý hallucination, reranking, langgraph state).
  - Vòng 5: AI System Design & Scalability (Thiết kế hệ thống triệu người dùng).
  - Vòng 6: Project Defense (Bảo vệ đồ án, phản biện trước Tech Lead về bảo mật và đánh đổi chi phí).

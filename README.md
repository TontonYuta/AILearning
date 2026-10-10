# 🚀 KHO MÃ NGUỒN & CẨM NANG KỸ SƯ AI THỰC CHIẾN
### Applied AI Engineering Monorepo: From Zero to Production-Ready Systems

[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-blue.svg)]()
[![Code Style](https://img.shields.io/badge/Code_Style-Production_Ready-success.svg)]()
[![Type Checking](https://img.shields.io/badge/Type_Hints-Strict_Pydantic_V2-brightgreen.svg)]()
[![Testing](https://img.shields.io/badge/Evals_&_Tests-pytest%20100%25-orange.svg)]()
[![Architecture](https://img.shields.io/badge/Design_Patterns-Agentic_%7C_MCP_%7C_RAG-purple.svg)]()

> **Chào mừng bạn đến với Kho mã nguồn đào tạo Kỹ sư AI Ứng dụng (Applied AI Engineer)!**  
> Dự án được xây dựng theo tôn chỉ: **100% Code thực chiến, nói KHÔNG với lý thuyết suông và code đồ chơi (toy code)**. Mỗi module là một giải pháp hoàn chỉnh chạy được ngay, giải quyết trực tiếp các bài toán kỹ thuật mà doanh nghiệp gặp phải khi đưa AI vào sản phẩm.

---

## 🎯 Triết Lý Đào Tạo: "Build-As-You-Learn"

```text
Ý tưởng bài toán kinh doanh
     ↓
Thiết kế Kiến trúc (System Architecture & Trade-offs)
     ↓
Mã nguồn Chuẩn Sản xuất (Type Hints, Schema Enforcement, Error Handling)
     ↓
Đánh giá Tự động (Evals, Chống ảo giác, Test suite)
     ↓
Tối ưu Vận hành (Prompt/Semantic Caching, Tracing, Guardrails)
```

---

## 🧭 Lộ Trình 10 Modules Thực Hành Chuyên Sâu

| Module | Tên Chuyên Đề | Trọng Tâm Kỹ Thuật & Thư Viện | Thư Mục Mã Nguồn |
| :---: | :--- | :--- | :---: |
| **01** | **Structured Outputs & Schema** | Pydantic V2, Instructor, Auto-retry self-healing JSON, Streaming | [`modules/01_foundations_...`](modules/01_foundations_structured_output/) |
| **02** | **Embeddings & Vector Search** | Chunking chiến lược, Sentence-Transformers, Qdrant, pgvector | [`modules/02_embeddings_...`](modules/02_embeddings_vector_search/) |
| **03** | **Production-Grade RAG** | Hybrid Search (BM25 + Dense), Cohere Re-ranker, Contextual Retrieval | [`modules/03_production_rag/`](modules/03_production_rag/) |
| **04** | **LLM Evals & Benchmarking** | Ragas, DeepEval, LLM-as-a-Judge, Synthetic Data, Pytest assertions | [`modules/04_llm_evals_...`](modules/04_llm_evals_benchmarking/) |
| **05** | **Tool Calling & Sandboxed APIs** | OpenAI Tools, Google GenAI Function Call, Safe Text-to-SQL execution | [`modules/05_tool_calling_...`](modules/05_tool_calling_external_apis/) |
| **06** | **Model Context Protocol (MCP)** | Xây dựng MCP Server & Client, kết nối Claude Desktop & Antigravity | [`modules/06_model_context_...`](modules/06_model_context_protocol_mcp/) |
| **07** | **Agentic AI & LangGraph** | StateGraph, Checkpointing, Human-in-the-loop, Multi-Agent Debate | [`modules/07_agentic_...`](modules/07_agentic_workflows_langgraph/) |
| **08** | **LLMOps, Caching & Observability**| Semantic Cache (Redis), Prompt Caching (90% off), Tracing với Langfuse | [`modules/08_llmops_...`](modules/08_llmops_caching_observability/) |
| **09** | **AI Security & Guardrails** | Chống Jailbreak/Prompt Injection, NeMo Guardrails, PII Masking | [`modules/09_ai_security_...`](modules/09_ai_security_guardrails/) |
| **10** | **Local LLMs & LoRA Fine-Tuning** | vLLM, Ollama serving, LoRA/QLoRA task-specific fine-tuning (Unsloth) | [`modules/10_local_serving_...`](modules/10_local_serving_lora_finetuning/) |

---

## 🏆 3 Đồ Án Kỳ Hạm Cấp Doanh Nghiệp (Enterprise Capstones)

Các dự án mẫu hoàn chỉnh từ Backend đến Deployment:
1. **[Capstone 1: Enterprise Knowledge Copilot](projects/capstone1_enterprise_rag_copilot/)**
   - Trợ lý tra cứu tri thức nội bộ đa phòng ban với RAG nâng cao, Re-ranking, phân quyền dữ liệu và pipeline tự động đo lường độ ảo giác.
2. **[Capstone 2: Autonomous Data Analyst Agent (with MCP)](projects/capstone2_autonomous_data_agent/)**
   - Đội ngũ Agent tự động phân tích dữ liệu, sinh biểu đồ, truy vấn SQL an toàn trong Sandbox và giao tiếp qua chuẩn MCP.
3. **[Capstone 3: High-Performance AI Gateway & Security Firewall](projects/capstone3_ai_gateway_firewall/)**
   - Cổng trung gian Proxy siêu tốc: Tích hợp Semantic Cache (Redis), kiểm soát ngân sách token, phòng vệ tấn công đối kháng và lọc dữ liệu nhạy cảm PII.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Thử Nhanh

### 1. Khởi tạo môi trường
Yêu cầu: **Python 3.10+**

```bash
# Tạo và kích hoạt môi trường ảo
python3 -m venv .venv
source .venv/bin/activate

# Cài đặt toàn bộ thư viện cần thiết
pip install -r requirements.txt
```

### 2. Thiết lập Biến môi trường
```bash
cp .env.example .env
# Mở file .env và điền các API Key của bạn (OpenAI, Gemini, Anthropic,...)
```

### 3. Chạy thử nghiệm một Module bất kỳ
```bash
# Ví dụ chạy Module 01: Xử lý Structured Output
python -m modules.01_foundations_structured_output.main

# Chạy kiểm thử tự động của Module 01
pytest modules/01_foundations_structured_output/ -v
```

---

## 📂 Lưu Trữ Giáo Trình Hàn Lâm (Legacy Monograph)
Đối với bạn đọc muốn đào sâu vào các chứng minh toán học thuần túy (SVD decomposition, Cauchy-Schwarz trong MoE, Sakata queueing theory, 1F1B bubble schedules, và tài liệu xuất bản pdfLaTeX 501 trang cũ):
- Toàn bộ được lưu trữ nguyên vẹn tại thư mục [`legacy/latex_monograph_v2/`](legacy/latex_monograph_v2/) và nhánh Git `archive/latex-monograph-v2`.

---

## ⚖️ Giấy Phép & Bản Quyền
Dự án được phát triển và duy trì bởi cộng đồng kỹ sư AI thực chiến. Mọi đoạn mã đều sẵn sàng để tham khảo và ứng dụng trực tiếp vào các sản phẩm phần mềm thương mại.

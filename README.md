<div align="center">

# 🧠 AI Engineering Studio — The Applied AI Visual Lab
### *Phòng Thí Nghiệm Trực Quan Hóa 24 Bài Học Kiến Trúc & Kỹ Nghệ AI Thực Chiến*

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-learning-6ptt.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)

<br />

👉 **Trải nghiệm trực tiếp trên Cloud:** **[https://ai-learning-6ptt.vercel.app/](https://ai-learning-6ptt.vercel.app/)** 👈

</div>

---

## 📖 1. Tổng Quan Dự Án (Project Overview)

**AI Engineering Studio** là nền tảng học tập tương tác chuyên sâu, được thiết kế để xóa bỏ khoảng cách giữa **các bài báo nghiên cứu khoa học hàn lâm (Scientific Papers)** và **kỹ nghệ vận hành AI quy mô lớn trong môi trường Production (Applied AI Engineering)**.

Khác với các tài liệu văn bản tĩnh hoặc các khóa học lý thuyết suông, ứng dụng kết hợp:
1. **24 Bài Học Thực Chiến (Structured Editorial Curriculum)**: Dẫn dắt có chiều sâu từ trực giác đời thường, bản chất toán học, code mẫu tiêu chuẩn hạ tầng đến các cạm bẫy thực tế (*production gotchas*).
2. **24 Phòng Thí Nghiệm Mô Phỏng 60fps (Interactive Visualizer Labs)**: Thao tác trực tiếp với BPE tokenization đa byte, không gian vector nhiều chiều, đồ thị HNSW, chu trình ReAct, bẫy Canary Token, AST JSON healing, cho đến biểu đồ thác nước Semantic Cache.
3. **Thử Thách Trắc Nghiệm Đa Tầng (3-Tier Brilliant-style Quiz)**: Đào sâu vào 3 tầng: *Khái Niệm Cốt Lõi* ➔ *Bài Toán Thực Tế* ➔ *Cạm Bẫy Kiến Trúc*, kèm lời giải thích phản xạ tức thì.

---

## 🎨 2. Chuẩn Thiết Kế UX/UI Đột Phá (Anti-AI-Slop & Dual-Theme)

Ứng dụng được xây dựng theo triết lý **Artisan UI Craft** (kế thừa tiêu chuẩn thẩm mỹ của *Linear*, *Apple HIG*, *Stripe Docs* và *Brilliant.org*), triệt tiêu hoàn toàn các hội chứng "AI Slop" thường gặp:

- ☀️ **Giao Diện Tươi Sáng (Luminous Light Mode - Mặc định):**
  - Sử dụng nền trắng sáng thanh thoát kết hợp lưới gradient ánh sáng ambient (`#4F46E5`, `#06B6D4`, `#F43F5E`) giúp mắt điều tiết thoải mái, độ tương phản văn bản đạt chuẩn WCAG 2.2 AAA.
  - Thẻ bài học phẳng, thoáng đãng, các khối thông tin phân tầng bằng màu pastel tao nhã, không còn cảm giác hộp đóng khung thô cứng.
- 🌙 **Giao Diện Tối Cao Cấp (Artisan Dark Mode):**
  - Canvas đá phiến `#090A10` kết hợp kính mờ glassmorphism `backdrop-blur-xl`, ánh sáng dịu nhẹ chống mỏi mắt ban đêm.
- 🔄 **Nút Chuyển Đổi Giao Diện 1-Click (Theme Switcher):**
  - Tích hợp ngay trên thanh Header, tự động ghi nhớ tùy chọn vào `localStorage`.
- 📱 **Mobile Responsive 100% (Zero-Touch Overflow):**
  - Cam kết **0px tràn màn hình ngang (0px horizontal overflow)** trên mọi kích thước (từ iPhone SE 375px, Android 360px đến Desktop 4K).
  - Thanh điều hướng ngón cái thông minh (*Floating Thumb Bar*) giúp người dùng dễ dàng chuyển đổi giữa bài học và quiz bằng một tay.

---

## 🗺️ 3. Lộ Trình 8 Chuyên Đề & 24 Bài Học Thực Chiến

Toàn bộ giáo trình được thiết kế có hệ thống qua 8 cột mốc kỹ nghệ cốt lõi:

| Chương | Tên Chuyên Đề | Các Bài Học Cụ Thể (24 Bài) | Phòng Thí Nghiệm Trực Quan (60fps Lab) | Cơ Sở Học Thuật Gốc |
| :---: | :--- | :--- | :--- | :--- |
| **01** | **Bản Chất LLM & Tokenomics** | • **Bài 1.1:** BPE Tokenizer & Tiếng Việt Multi-byte<br>• **Bài 1.2:** Temperature, Top-p & Softmax Sampling<br>• **Bài 1.3:** Cửa sổ Ngữ Cảnh & Hiện tượng Lost in the Middle | • Mô phỏng Tiktoken Byte-Pair Encoding<br>• Thanh trượt nhiệt độ phân phối xác suất<br>• Biểu đồ chữ U suy giảm chú ý (Lost in the Middle) | Sennrich et al. (ACL)<br>Holtzman et al. (ICLR)<br>Liu et al. (Stanford, 2023) |
| **02** | **Không Gian Vector & Embeddings** | • **Bài 2.1:** Dense vs Sparse (BM25 vs SPLADE)<br>• **Bài 2.2:** Vector Math: Cosine vs Dot Product & L2 Norm<br>• **Bài 2.3:** Đồ thị xấp xỉ phân tầng HNSW | • Đối đầu từ khóa mã lỗi vs hiểu ngữ nghĩa<br>• Mô phỏng tương quan góc và chuẩn hóa L2<br>• Bước nhảy đồ thị phân tầng HNSW O(log N) | Formal et al. (SIGIR)<br>Salton et al. (Vector Space)<br>Malkov & Yashunin (TPAMI) |
| **03** | **Chiến Lược Chunking & Advanced RAG** | • **Bài 3.1:** Kiến trúc Parent-Child (Small-to-Big Retrieval)<br>• **Bài 3.2:** Re-ranking với Cross-Encoder & Thuật toán RRF<br>• **Bài 3.3:** Self-RAG & Corrective RAG (CRAG) | • Ghép nối chunk con sắc nét vào chunk cha<br>• Xếp hạng lại tài liệu với Cross-Encoder<br>• Luồng tự phản biện và fallback sang Web Search | Asai et al. (ICLR 2024)<br>Cormack et al. (SIGIR RRF)<br>Yan et al. (CRAG 2024) |
| **04** | **Agentic Loops & State Machines** | • **Bài 4.1:** Chu trình ReAct & Function Calling<br>• **Bài 4.2:** Quản lý State đồ thị chu trình với LangGraph<br>• **Bài 4.3:** Điểm ngắt Human-in-the-loop (state.interrupt) | • Bảng Scratchpad ReAct (Thought/Action/Obs)<br>• Vòng lặp StateGraph Coder ➔ Tester ➔ Auto-fix<br>• Điểm ngắt phê duyệt giao dịch tiền vượt hạn mức | Yao et al. (ICLR 2023)<br>LangGraph Cyclic State<br>Anthropic Safety Interventions |
| **05** | **AI Security & Guardrails** | • **Bài 5.1:** Direct vs Indirect Prompt Injection (OWASP LLM01)<br>• **Bài 5.2:** Bẫy Canary Token phát hiện rò rỉ System Prompt<br>• **Bài 5.3:** Khử nhận dạng thông tin cá nhân PII Gateway | • Kịch bản mã độc ẩn chữ trắng trong tài liệu PDF<br>• Còi báo động đỏ ngắt kết nối khi lộ Canary Token<br>• Bộ che mặt nạ số thẻ tín dụng PCI-DSS & CCCD | OWASP Top 10 for LLMs<br>Perez & Ribeiro (Canary Tokens)<br>Microsoft Presidio Pattern |
| **06** | **Structured Outputs & Cost Optimization** | • **Bài 6.1:** Constrained Decoding với FSM Grammar Masking<br>• **Bài 6.2:** Tự chữa lành cú pháp JSON bằng AST Parser<br>• **Bài 6.3:** Mô hình tháp định tuyến phân tầng FrugalGPT | • Triệt tiêu xác suất token sai cú pháp trên Logits<br>• Sửa JSON hỏng trong 0.4ms với chi phí $0<br>• Định tuyến thác nước giảm 82% chi phí gọi API | Willard et al. (Outlines, 2023)<br>AST Syntax Graph Healers<br>Chen et al. (Stanford, 2023) |
| **07** | **Độ Trễ, Bộ Nhớ Đệm & Serving** | • **Bài 7.1:** Semantic Caching với Vector Similarity Threshold<br>• **Bài 7.2:** Quản lý bộ nhớ VRAM với PagedAttention (vLLM)<br>• **Bài 7.3:** Tiết kiệm 90% chi phí với Prefix Prompt Caching | • Biểu đồ thác nước độ trễ: 880ms vs 14ms Cache Hit<br>• Bảng ánh xạ trang ảo Logical sang Physical VRAM<br>• Quy tắc sắp xếp tiền tố tĩnh để tối ưu hóa Cache | Redis Semantic Cache<br>Kwon et al. (vLLM, SOSP 2023)<br>Anthropic & Gemini Prefix Cache |
| **08** | **Đánh Giá & Giám Sát (Evals & Observability)**| • **Bài 8.1:** Đánh giá bằng LLM-as-a-Judge & Khử thiên kiến<br>• **Bài 8.2:** Bộ 3 chỉ số RAG Triad (Context Rel, Groundedness, Answer Rel)<br>• **Bài 8.3:** Truy vết phân tán Span & Trace với OpenTelemetry | • Tráo đổi vị trí A/B để khử Position & Verbosity Bias<br>• Chẩn đoán ảo giác (Hallucination) qua RAG Triad<br>• Biểu đồ Gantt phân tích nút thắt cổ chai độ trễ | Zheng et al. (LMSYS, NeurIPS)<br>TruLens & Ragas Framework<br>OpenTelemetry / Langfuse Spec |

---

## 💻 4. Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local Development)

### Điều kiện tiên quyết:
- **Node.js**: Phiên bản `>= 18.x` (Khuyến nghị Node 20 LTS hoặc 22 LTS).
- **npm** / **pnpm** / **yarn**.

### Các bước thực hiện:

1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/TontonYuta/AILearning.git
   cd AILearning
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Khởi chạy môi trường phát triển (Dev Server):**
   ```bash
   npm run dev
   ```
   *Mở trình duyệt tại địa chỉ: `http://localhost:3000/` hoặc `http://localhost:5173/`.*

4. **Kiểm tra biên dịch & đóng gói sản phẩm:**
   ```bash
   npm run build
   ```

5. **Chạy thử bản dựng Production (Preview):**
   ```bash
   npm run preview
   ```

---

## 🚀 5. Triển Khai Lên Vercel (Production Deployment)

Dự án đã được cấu hình tối ưu sẵn sàng cho nền tảng **Vercel**:
- [x] Tệp cấu hình SPA Rewrite: `vercel.json` định tuyến chuẩn `/*` về `/index.html`.
- [x] Tệp cấu hình npm: `.npmrc` với `legacy-peer-deps=true` đảm bảo build không bao giờ lỗi dependency.
- [x] Tự động đồng bộ CI/CD: Mỗi commit đẩy lên nhánh `main` của GitHub sẽ tự động kích hoạt bản build mới trên Vercel trong chưa đầy 30 giây.

---

## 📁 6. Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
AILearning/
├── public/                     # Tài nguyên tĩnh
├── src/
│   ├── components/
│   │   ├── academy/
│   │   │   ├── AcademyHeader.tsx     # Header kính mờ, bộ chọn chương, XP và nút đổi Theme
│   │   │   ├── LessonView.tsx        # Bố cục bài học chuẩn Editorial, code macOS, callout
│   │   │   ├── QuizChallenge.tsx     # Bộ thử thách Quiz 3 tầng tương tác tactile
│   │   │   └── CompletionModal.tsx   # Hộp thoại chứng nhận tốt nghiệp 24 bài học
│   │   └── visualizers/
│   │       ├── Chapter1Visualizers.tsx # BPE Tokenizer, Temperature Softmax, Lost in Middle
│   │       ├── Chapter2Visualizers.tsx # BM25 vs Dense, Cosine Math, HNSW Graph
│   │       ├── Chapter3Visualizers.tsx # Parent-Child, Cross-Encoder Rerank, Self-RAG
│   │       ├── Chapter4Visualizers.tsx # ReAct Loop, LangGraph State, Breakpoint
│   │       ├── Chapter5Visualizers.tsx # Injection Attack, Canary Token, PII Redactor
│   │       ├── Chapter6Visualizers.tsx # Constrained Decoding, AST JSON Healer, FrugalGPT
│   │       ├── Chapter7Visualizers.tsx # Semantic Cache Waterfall, PagedAttention, Prefix Cache
│   │       ├── Chapter8Visualizers.tsx # LLM Judge Bias, RAG Triad, OpenTelemetry Trace
│   │       └── VisualizerHub.tsx       # Bộ định tuyến điều phối 24 Visualizers
│   ├── data/
│   │   └── chaptersAndLessons.ts       # Nội dung lý thuyết chuyên sâu của 24 bài học
│   ├── types/
│   │   └── academy.ts                  # TypeScript types cho bài học, quiz, tiến độ
│   ├── App.tsx                         # Khung ứng dụng chính, quản trị Theme & Split Pane
│   ├── index.css                       # CSS Tailwind v4, Ambient Mesh & Custom Scrollbars
│   └── main.tsx                        # Điểm khởi động ứng dụng React 19
├── vercel.json                         # Cấu hình định tuyến Single Page Application cho Vercel
├── .npmrc                              # Cấu hình tương thích dependency chuẩn
├── package.json                        # Khai báo thư viện & kịch bản build
└── README.md                           # Tài liệu hướng dẫn toàn diện dự án
```

---

## 📚 7. Tài Liệu Khoa Học Tham Khảo (Academic References)

- **Attention Is All You Need**: Vaswani et al. (NeurIPS 2017)
- **Neural Machine Translation of Rare Words with Subword Units (BPE)**: Sennrich et al. (ACL 2016)
- **Lost in the Middle: How Language Models Use Long Contexts**: Liu et al. (Stanford / TACL 2023)
- **Efficient and Robust Approximate Nearest Neighbor Search Using HNSW**: Malkov & Yashunin (IEEE TPAMI 2018)
- **ReAct: Synergizing Reasoning and Acting in Language Models**: Yao et al. (ICLR 2023)
- **Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection**: Asai et al. (ICLR 2024)
- **Corrective Retrieval Augmented Generation (CRAG)**: Yan et al. (2024)
- **Efficient Memory Management for Large Language Model Serving with PagedAttention**: Kwon et al. (SOSP 2023)
- **FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance**: Chen et al. (Stanford, 2023)
- **Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena**: Zheng et al. (LMSYS, NeurIPS 2023)

---

## 🤝 8. Đóng Góp & Bản Quyền (License & Contributing)

Mọi đóng góp nhằm hoàn thiện thêm các mô phỏng trực quan hoặc bổ sung các bài học kiến trúc mới đều được chào đón nồng nhiệt! Vui lòng mở Pull Request hoặc Issue trên GitHub.

Dự án được phân phối dưới giấy phép **Apache-2.0 License**.

<div align="center">
  <sub>Được phát triển với niềm đam mê dành cho cộng đồng Kỹ Sư AI Thực Chiến.</sub>
</div>

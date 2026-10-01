# CURRENT_TASK.md — CONTRACT CÔNG VIỆC HIỆN TẠI

**TASK ID**: TASK-PHASE-2-LLM-RUNTIME-AND-ENTERPRISE-RAG-COMPLETED  
**TASK TYPE**: Phase 2: LLM Runtime Tokenomics (Speculative Decoding Lossless Proof, RadixAttention Tree Caching) & Advanced Enterprise RAG (ColBERT Late Interaction MaxSim, GraphRAG Leiden, Contextual Retrieval Anthropic)  
**OBJECTIVE**: Mở rộng tài liệu trở thành Bách khoa toàn thư All-In-One AI Engineering (hướng tới 450-500+ trang), hoàn thành toàn diện Giai đoạn 2:
1. **Chương 7 (LLM Runtime, Inference Engine & Tokenomics)**:
   - Chứng minh toán học giải tích chặt chẽ: Speculative Decoding (Leviathan et al., 2023) bảo toàn phân phối xác suất tuyệt đối $P(X=x) \equiv p(x)$ thông qua Modified Rejection Sampling và phân phối phần dư chuẩn hóa.
   - Kiến trúc Medusa Multi-Head Speculative Decoding và Tree Attention xác thực song song.
   - Cấu trúc cây tiền tố Radix Tree (SGLang, Zheng et al., 2024), khớp tiền tố dài nhất (longest prefix match), phân tách nút động (node splitting), và thu hồi LRU theo cấp độ lá.
   - Hiện thực hóa Python chuẩn kỹ nghệ: `RadixNode`, `RadixCacheManager`, `sample_lossless_speculative_token` (được kiểm thử đầy đủ).
   - Khối `simulationbox` với 2 prompt hoạt họa Manim CE 60fps mô phỏng Speculative Decoding và Radix Tree.
   - Mở rộng hệ thống bài tập đa tầng (A.6, A.7, B.4, B.5, C.4) cùng hướng dẫn giải giải tích chi tiết từng bước.
2. **Chương 8 (Kỹ Nghệ RAG Doanh Nghiệp & Tìm Kiếm Lai Đa Tầng)**:
   - Kiến trúc ColBERT Late Interaction (Khattab & Zaharia, 2020) và toán học chấm điểm MaxSim: $\text{MaxSim}(q, d) = \sum_{i=1}^{|q|} \max_{j=1}^{|d|} (E_{q, i} \cdot E_{d, j}^T)$, bảo toàn căn chỉnh ngữ nghĩa mềm cấp token, tối ưu hóa PLAID index.
   - Đột phá đa phương thức ColPali (Faysse et al., 2024): Late Interaction trực tiếp trên vision patches của tài liệu PDF không cần OCR.
   - GraphRAG phân cấp (Edge et al., 2024): thuật toán Leiden phân cụm đồ thị tri thức (khắc phục điểm nghẽn ngắt kết nối của Louvain), tóm tắt cộng đồng C0/C1/C2, truy vấn toàn cục Map-Reduce (Global Sensemaking) và truy vấn cục bộ $k$-hop (Local Search).
   - Contextual Retrieval (Anthropic, 2024): giải quyết bài toán cô lập đoạn văn bản (Chunk Isolation) bằng cách chèn 50-100 tokens ngữ cảnh tài liệu vào từng chunk trước khi lập chỉ mục BM25 + Dense, tận dụng Prompt Caching giảm $90\%$ chi phí.
   - Hiện thực hóa Python: `ColBERTMaxSimEngine`, `ContextualChunkAugmenter`.
   - Khối `simulationbox` với 2 prompt hoạt họa Manim CE 60fps mô phỏng ColBERT MaxSim và GraphRAG Map-Reduce.
   - Mở rộng bài tập (A.9, A.10, B.6, B.7, C.5, C.6) cùng lời giải giải tích chi tiết từng bước.
3. **Đạt chuẩn chất lượng tối cao**: 182 unit tests pass 100%, sách dày **417 trang**, `./scripts/check.sh` báo cáo **0 ERRORS, 0 WARNINGS, 0 INFOS, 0 OVERFULL HBOX**.

---

## SCOPE ĐÃ HOÀN TẤT (100%)
1. **Chương 7 (LLM Runtime, Inference Engine & Tokenomics)**: Đã hoàn thành toàn bộ lý thuyết, chứng minh giải tích, code listings, simulation box, bài tập A.6, A.7, B.4, B.5, C.4 và lời giải chi tiết.
2. **Chương 8 (Kỹ Nghệ RAG Doanh Nghiệp & Tìm Kiếm Lai Đa Tầng)**: Đã hoàn thành ColBERT Late Interaction, ColPali, PLAID, GraphRAG Leiden, Contextual Retrieval, Prompt Caching, code listings, simulation box, bài tập A.9, A.10, B.6, B.7, C.5, C.6 và lời giải chi tiết.
3. **Mã nguồn kiểm thử (`tests/test_ch07_llm_runtime.py` & `tests/test_ch08_rag.py`)**: Đạt 100% passing cho tất cả các thuật toán mới. Tổng số test suite đạt **182 unit tests**.
4. **Biên dịch & QA PDF**: Đạt **417 trang A4**, 0 Errors, 0 Warnings, 0 Overfull Hbox.

---

## KẾ HOẠCH BƯỚC TIẾP THEO (GIAI ĐOẠN 3)
1. **Chương 9 (AI Agents, Tool Calling & Function Execution)**:
   - Các mẫu kiến trúc Agent nâng cao: ReAct, Plan-and-Solve, Reflexion (tự suy ngẫm và sửa lỗi), Multi-Agent Debate.
   - Giao thức thực thi công cụ an toàn: Dynamic Sandbox Tool Calling, AST syntax validation, vòng lặp Human-in-the-loop.
   - Đồ thị trạng thái LangGraph / AutoGen: State checkpointing, cyclic control flow, time-travel debugging.
   - Unit tests và `simulationbox` hoạt họa Manim CE 60fps.
2. **Chương 10 (Model Serving, High-Throughput Batching & Triton)**:
   - Dynamic batching, vLLM continuous batching scheduler, Ray Serve multi-node routing.

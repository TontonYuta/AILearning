# SPEC: Phase 2 — Nền Tảng Toán Học, Machine Learning & Deep Learning (AI/ML Core)

## 1. Thông Tin Chung
- **Mã chương**: `ch:phase2-aiml`
- **Mục tiêu**: Trang bị bản chất toán học phục vụ AI (Đại số tuyến tính, Giải tích, Xác suất thống kê), nguyên lý hoạt động của các giải thuật Machine Learning truyền thống, và khung làm việc PyTorch để xây dựng mạng nơ-ron từ số 0.

## 2. Các Phân Hệ Cốt Lõi
- **Toán Học Cho AI**:
  - Vector, Ma trận, Phép nhân ma trận, Chuẩn vector $\ell_1, \ell_2$.
  - Đạo hàm riêng và Gradient Vector $\nabla f$.
  - Quy tắc dây chuyền (Chain Rule) tạo nên Backpropagation.
  - Định lý Bayes và Xác suất có điều kiện.
- **Machine Learning Cốt Lõi**:
  - Feature engineering, Train/Val/Test split, Tránh Data Leakage.
  - Hiện tượng Overfitting vs Underfitting, Bias-Variance Tradeoff.
  - Các thuật toán kinh điển: Linear/Logistic Regression, Random Forest, K-Means, PCA.
  - Bộ thước đo: Precision, Recall, F1-Score, ROC-AUC.
- **Deep Learning & PyTorch**:
  - Kiến trúc Perceptron & MLP.
  - Hàm kích hoạt: ReLU, GeLU, Softmax.
  - Tensor manipulation, Autograd mechanics trong PyTorch.
  - Xây dựng một Training Loop chuẩn kỹ sư từ số 0 (DataLoader, Optimizer, Loss, Checkpointing).

## 3. Tiêu Chuẩn Nghiệm Thu
- [x] Có công thức toán học chuẩn LaTeX (`amsmath`).
- [x] Có code Python/PyTorch runnable 100%, có unit test trong `tests/test_phase2_math_ml.py`.
- [x] Có đầy đủ các hộp chuyên biệt: `definitionbox`, `intuitionbox`, `workedexamplebox`, `labbox`, `debugbox`, `securitybox`, `tradeoffbox`, `interviewbox`, `checkpointbox`.
- [x] Biên dịch và vượt qua QA 100%.

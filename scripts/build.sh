#!/usr/bin/env bash
# ==============================================================================
# BUILD.SH — KỊCH BẢN BIÊN DỊCH PDF CHUẨN KỸ NGHỆ CHO GIÁO TRÌNH AI ENGINEER
# ==============================================================================
set -euo pipefail

# 1. Xác định Project Root tuyệt đối
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "======================================================================"
echo "🚀 [BUILD] Bắt đầu quá trình biên dịch Sách Kỹ sư AI..."
echo "📂 Project Root: $PROJECT_ROOT"
echo "======================================================================"

# 2. Kiểm tra công cụ pdflatex
if ! command -v pdflatex &> /dev/null; then
    echo "❌ [ERROR] Không tìm thấy 'pdflatex'. Vui lòng cài đặt TeX Live (texlive-latex-base, texlive-lang-other/vntex)."
    exit 1
fi

# 3. Chuẩn bị thư mục đầu ra
BUILD_DIR="$PROJECT_ROOT/build"
AUX_DIR="$BUILD_DIR/auxiliary"
LOG_DIR="$BUILD_DIR/logs"
PDF_DIR="$BUILD_DIR/pdf"

mkdir -p "$AUX_DIR" "$LOG_DIR" "$PDF_DIR"

# 4. Cấu hình biến môi trường tìm kiếm LaTeX (TEXINPUTS)
# Dấu // ở cuối cho phép tìm kiếm đệ quy toàn bộ thư mục con trong latex/
export TEXINPUTS=".:$PROJECT_ROOT/latex//:$AUX_DIR//:"

TARGET_TEX="$PROJECT_ROOT/latex/main.tex"
TARGET_OUTPUT_NAME="ai_engineer_curriculum.pdf"
LOG_FILE="$LOG_DIR/pdflatex.log"

echo "📄 File gốc: $TARGET_TEX"
echo "⚙️ Thư mục phụ trợ (auxiliary): $AUX_DIR"
echo "📋 File log: $LOG_FILE"

# 5. Vòng lặp biên dịch 2 lượt (Two-pass compilation)
echo "🔄 [PASS 1/2] Lượt 1: Tạo cấu trúc tài liệu, TOC và chỉ mục..."
if ! pdflatex -interaction=nonstopmode -file-line-error -output-directory="$AUX_DIR" "$TARGET_TEX" > "$LOG_FILE" 2>&1; then
    echo "❌ [FAIL] Biên dịch Lượt 1 thất bại! Xem chi tiết lỗi tại $LOG_FILE"
    tail -n 30 "$LOG_FILE"
    exit 1
fi

echo "🔄 [PASS 2/2] Lượt 2: Cập nhật liên kết chéo, số trang mục lục và hyperref..."
if ! pdflatex -interaction=nonstopmode -file-line-error -output-directory="$AUX_DIR" "$TARGET_TEX" >> "$LOG_FILE" 2>&1; then
    echo "❌ [FAIL] Biên dịch Lượt 2 thất bại! Xem chi tiết lỗi tại $LOG_FILE"
    tail -n 30 "$LOG_FILE"
    exit 1
fi

# 6. Sao chép và xuất bản file PDF hoàn chỉnh
GENERATED_PDF="$AUX_DIR/main.pdf"
FINAL_PDF="$PDF_DIR/$TARGET_OUTPUT_NAME"

if [ -f "$GENERATED_PDF" ]; then
    cp "$GENERATED_PDF" "$FINAL_PDF"
    PDF_SIZE=$(du -h "$FINAL_PDF" | cut -f1)
    PAGE_COUNT=$(pdfinfo "$FINAL_PDF" 2>/dev/null | grep -i "Pages:" | awk '{print $2}' || echo "N/A")
    echo "======================================================================"
    echo "✅ [SUCCESS] Biên dịch PDF thành công rực rỡ!"
    echo "📦 Vị trí xuất xưởng: $FINAL_PDF"
    echo "📊 Kích thước: $PDF_SIZE"
    echo "📑 Số trang: $PAGE_COUNT"
    echo "======================================================================"
else
    echo "❌ [ERROR] Không tìm thấy file PDF đầu ra sau khi biên dịch."
    exit 1
fi

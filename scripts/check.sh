#!/usr/bin/env bash
# ==============================================================================
# CHECK.SH — HỆ THỐNG KIỂM TRA CHẤT LƯỢNG (QA) TỰ ĐỘNG CHO SÁCH KỸ SƯ AI
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "======================================================================"
echo "🔍 [QA CHECK] Khởi động bộ kiểm định chất lượng sách AI Engineer..."
echo "📂 Project Root: $PROJECT_ROOT"
echo "======================================================================"

ERRORS=0
WARNINGS=0
INFOS=0

# 1. Kiểm tra các tệp tin cấu trúc bắt buộc
echo "1️⃣  Kiểm tra sự tồn tại của các file cấu trúc tối thượng..."
REQUIRED_FILES=(
    "AGENTS.md"
    "MASTER_SPEC.md"
    "CURRICULUM.md"
    "README.md"
    "docs/PROJECT_STATE.md"
    "docs/CURRENT_TASK.md"
    "docs/DEPENDENCY_MAP.md"
    "docs/GLOSSARY.md"
    "latex/main.tex"
    "latex/preamble.tex"
    "latex/metadata.tex"
    "latex/commands.tex"
    "latex/environments.tex"
    "scripts/build.sh"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$PROJECT_ROOT/$file" ]; then
        echo "   ❌ [ERROR] Thiếu tệp tin cốt lõi: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# 2. Kiểm tra file PDF xuất bản
echo "2️⃣  Kiểm tra sản phẩm PDF xuất bản..."
PDF_FILE="$PROJECT_ROOT/build/pdf/ai_engineer_curriculum.pdf"
if [ ! -f "$PDF_FILE" ]; then
    echo "   ❌ [ERROR] Không tìm thấy file PDF đầu ra tại: $PDF_FILE"
    ERRORS=$((ERRORS + 1))
else
    PDF_BYTES=$(stat -c%s "$PDF_FILE" 2>/dev/null || stat -f%z "$PDF_FILE" 2>/dev/null || echo 0)
    if [ "$PDF_BYTES" -lt 1000 ]; then
        echo "   ❌ [ERROR] File PDF quá nhỏ hoặc bị hỏng (Dung lượng: $PDF_BYTES bytes)"
        ERRORS=$((ERRORS + 1))
    else
        echo "   ✅ [PASS] File PDF tồn tại hợp lệ (Dung lượng: $PDF_BYTES bytes)"
    fi
fi

# 3. Phân tích Log biên dịch (pdflatex.log)
echo "3️⃣  Phân tích log biên dịch pdflatex..."
LOG_FILE="$PROJECT_ROOT/build/logs/pdflatex.log"
if [ ! -f "$LOG_FILE" ]; then
    echo "   ❌ [ERROR] Không tìm thấy file log biên dịch tại: $LOG_FILE"
    ERRORS=$((ERRORS + 1))
else
    # Kiểm tra fatal errors / emergency stop
    if grep -qE "Fatal error|Emergency stop|^\! " "$LOG_FILE"; then
        echo "   ❌ [ERROR] Phát hiện lỗi nghiêm trọng trong log biên dịch:"
        grep -E "Fatal error|Emergency stop|^\! " "$LOG_FILE" | head -n 10
        ERRORS=$((ERRORS + 1))
    else
        echo "   ✅ [PASS] Không có lỗi biên dịch nghiêm trọng."
    fi

    # Kiểm tra undefined references
    UNDEF_REFS=$(grep -c "LaTeX Warning: Reference \`.*' on page .* undefined" "$LOG_FILE" || true)
    if [ "$UNDEF_REFS" -gt 0 ]; then
        echo "   ❌ [ERROR] Có $UNDEF_REFS tham chiếu bị gãy (Undefined References)!"
        grep "LaTeX Warning: Reference \`.*' on page .* undefined" "$LOG_FILE" | head -n 5
        ERRORS=$((ERRORS + 1))
    else
        echo "   ✅ [PASS] Không có tham chiếu bị gãy."
    fi

    # Kiểm tra undefined citations
    UNDEF_CITS=$(grep -c "LaTeX Warning: Citation \`.*' on page .* undefined" "$LOG_FILE" || true)
    if [ "$UNDEF_CITS" -gt 0 ]; then
        echo "   ❌ [ERROR] Có $UNDEF_CITS trích dẫn bị thiếu (Undefined Citations)!"
        grep "LaTeX Warning: Citation \`.*' on page .* undefined" "$LOG_FILE" | head -n 5
        ERRORS=$((ERRORS + 1))
    else
        echo "   ✅ [PASS] Không có trích dẫn bị thiếu."
    fi

    # Kiểm tra duplicate labels
    DUP_LABELS=$(grep -c "LaTeX Warning: Label \`.*' multiply defined" "$LOG_FILE" || true)
    if [ "$DUP_LABELS" -gt 0 ]; then
        echo "   ❌ [ERROR] Có $DUP_LABELS nhãn bị định nghĩa trùng lặp (Duplicate Labels)!"
        grep "LaTeX Warning: Label \`.*' multiply defined" "$LOG_FILE" | head -n 5
        ERRORS=$((ERRORS + 1))
    else
        echo "   ✅ [PASS] Không có nhãn bị trùng lặp."
    fi

    # Kiểm tra Overfull \hbox (> 15pt)
    LARGE_OVERFULL=$(grep -E "Overfull \\\hbox \([0-9]{2,}\.[0-9]+pt too wide\)" "$LOG_FILE" | wc -l || true)
    if [ "$LARGE_OVERFULL" -gt 0 ]; then
        echo "   ⚠️  [WARNING] Có $LARGE_OVERFULL trường hợp tràn lề lớn (>15pt):"
        grep -E "Overfull \\\hbox \([0-9]{2,}\.[0-9]+pt too wide\)" "$LOG_FILE" | head -n 5
        WARNINGS=$((WARNINGS + LARGE_OVERFULL))
    fi
fi

# 4. Quét mã nguồn tìm các nhãn tạm bợ dang dở (TODO, FIXME, PLACEHOLDER)
echo "4️⃣  Quét mã nguồn tìm ký hiệu dang dở (TODO / FIXME / PLACEHOLDER)..."
UNFINISHED_COUNT=$(grep -rnE "(TODO|FIXME|PLACEHOLDER|CẦN BỔ SUNG)" "$PROJECT_ROOT/latex/" 2>/dev/null | wc -l || true)
if [ "$UNFINISHED_COUNT" -gt 0 ]; then
    echo "   ⚠️  [WARNING] Phát hiện $UNFINISHED_COUNT vị trí có đánh dấu dang dở trong latex/:"
    grep -rnE "(TODO|FIXME|PLACEHOLDER|CẦN BỔ SUNG)" "$PROJECT_ROOT/latex/" | head -n 5
    WARNINGS=$((WARNINGS + UNFINISHED_COUNT))
else
    echo "   ✅ [PASS] Mã nguồn LaTeX sạch sẽ, không có placeholder dang dở."
fi

# 5. Chạy kiểm thử tự động (Unit Tests) cho mã nguồn giáo trình
echo "5️⃣  Chạy kiểm thử tự động cho mã nguồn mẫu trong tests/..."
if command -v pytest &> /dev/null; then
    if python3 -m pytest "$PROJECT_ROOT/tests/" -q > /dev/null 2>&1; then
        echo "   ✅ [PASS] Toàn bộ unit tests cho mã nguồn mẫu đều chạy thành công!"
    else
        echo "   ❌ [ERROR] Có unit test bị thất bại trong tests/!"
        python3 -m pytest "$PROJECT_ROOT/tests/" -v
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "   ℹ️  [INFO] Pytest chưa được cài đặt trong môi trường, bỏ qua kiểm thử tự động."
    INFOS=$((INFOS + 1))
fi

# 6. Tổng kết kết quả kiểm định QA
echo "======================================================================"
echo "📊 TỔNG KẾT BỘ KIỂM ĐỊNH QA:"
echo "   - Số lỗi (ERRORS): $ERRORS"
echo "   - Cảnh báo (WARNINGS): $WARNINGS"
echo "   - Thông tin (INFOS): $INFOS"
echo "======================================================================"

if [ "$ERRORS" -gt 0 ]; then
    echo "🛑 [QA RESULT]: FAIL (Phát hiện $ERRORS lỗi bắt buộc phải sửa trước khi tiếp tục!)"
    exit 1
else
    echo "🎉 [QA RESULT]: PASS (Tài liệu đạt chuẩn xuất bản kỹ thuật cao!)"
    exit 0
fi

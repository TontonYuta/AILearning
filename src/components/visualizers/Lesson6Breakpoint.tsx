import React, { useState } from 'react';
import { UserCheck, ShieldAlert, CheckCircle2, DollarSign, ArrowRight } from 'lucide-react';

export const Lesson6Breakpoint: React.FC = () => {
  const [amount, setAmount] = useState<number>(25_000_000);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const THRESHOLD = 5_000_000;
  const isLarge = amount > THRESHOLD;

  const handleSelectAmount = (val: number) => {
    setAmount(val);
    setIsApproved(false);
  };

  const formatVND = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-amber-500" />
          Cổng An Toàn Human-in-the-Loop (Breakpoint)
        </span>
        <span className="text-neutral-400 text-[11px]">Ngưỡng tự duyệt: 5.000.000 VNĐ</span>
      </div>

      {/* Preset Selectors */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleSelectAmount(1_200_000)}
          className={`p-2 border text-left transition-colors ${
            amount === 1_200_000
              ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
              : 'border-neutral-800 bg-neutral-900 text-neutral-400'
          }`}
        >
          <div className="font-bold text-neutral-200">1.200.000 VNĐ</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Khoản nhỏ: Tự động giải ngân</div>
        </button>

        <button
          onClick={() => handleSelectAmount(25_000_000)}
          className={`p-2 border text-left transition-colors ${
            amount === 25_000_000
              ? 'border-amber-500 bg-amber-950/30 text-amber-300'
              : 'border-neutral-800 bg-neutral-900 text-neutral-400'
          }`}
        >
          <div className="font-bold text-neutral-200">25.000.000 VNĐ</div>
          <div className="text-[10px] text-amber-400 mt-0.5">Khoản lớn: Kích hoạt Breakpoint</div>
        </button>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="p-3 bg-[#09090b] border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-neutral-400">Yêu cầu hoàn tiền:</span>
          <span className="font-bold text-neutral-100">{formatVND(amount)}</span>
        </div>

        {/* State Visual */}
        {isLarge ? (
          <div className="border border-amber-800/80 bg-amber-950/20 p-3 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>BREAKPOINT HIT: state.interrupt() ĐANG CHỜ PHÊ DUYỆT</span>
            </div>
            <p className="font-sans text-xs text-neutral-300 leading-relaxed">
              Số tiền <strong>{formatVND(amount)}</strong> vượt hạn mức 5.000.000 VNĐ. Mô hình tự động tạm dừng luồng chuyển khoản để chờ Quản lý tài chính xác nhận.
            </p>

            {!isApproved ? (
              <button
                onClick={() => setIsApproved(true)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Quản lý bấm: [XÁC NHẬN PHÊ DUYỆT GIẢI NGÂN]
              </button>
            ) : (
              <div className="p-2 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-center font-bold">
                ✓ Quản lý đã duyệt! Đã chuyển tiếp tới API Ngân hàng VietQR thành công.
              </div>
            )}
          </div>
        ) : (
          <div className="border border-emerald-800/80 bg-emerald-950/20 p-3 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>AUTO-APPROVED: ĐƯỢC PHÉP CHẠY TỰ ĐỘNG</span>
            </div>
            <p className="font-sans text-xs text-neutral-300 leading-relaxed">
              Số tiền <strong>{formatVND(amount)}</strong> nằm trong hạn mức an toàn (&lt; 5.000.000 VNĐ). Hệ thống tự động kích hoạt API ngân hàng mà không cần dừng lại làm phiền con người.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Bot, Wrench, RefreshCw, UserCheck, ShieldAlert, CheckCircle2, Play, RotateCcw } from 'lucide-react';

// ==========================================
// BÀI 4.1: CHU TRÌNH REACT & FUNCTION CALLING
// ==========================================
export const Lesson4_1_ReAct: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  const reactSteps = [
    { title: 'User Input', content: '"Kiểm tra trạng thái máy chủ thanh toán IP 10.0.4.12"', color: 'text-neutral-300' },
    { title: 'Thought (Lập luận)', content: 'Tôi không thể tự bịa trạng thái máy chủ. Cần gọi công cụ ping_server với địa chỉ IP được cung cấp.', color: 'text-blue-400' },
    { title: 'Action (Gọi Tool)', content: 'ping_server({"ip": "10.0.4.12", "port": 5432})', color: 'text-amber-400' },
    { title: 'Observation (Kết quả)', content: '{"status": "ONLINE", "latency_ms": 14, "active_connections": 142}', color: 'text-indigo-400' },
    { title: 'Final Answer', content: '"Máy chủ thanh toán (10.0.4.12:5432) đang hoạt động bình thường, độ trễ 14ms với 142 kết nối."', color: 'text-emerald-400' },
  ];

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          Mô phỏng Scratchpad Chu Trình ReAct (Yao et al., ICLR 2023)
        </span>
        <button
          onClick={() => setStep((prev) => (prev < 4 ? prev + 1 : 0))}
          className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold transition-colors"
        >
          {step === 4 ? 'Chạy lại' : `Bước kế (${step + 1}/4)`}
        </button>
      </div>

      <div className="space-y-1.5">
        {reactSteps.slice(0, step + 1).map((s, idx) => (
          <div key={idx} className="p-2.5 bg-[#09090b] border border-neutral-800 font-mono">
            <div className={`text-[10px] font-bold uppercase mb-0.5 ${s.color}`}>{s.title}</div>
            <div className="text-neutral-200 text-xs font-sans">{s.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// BÀI 4.2: LANGGRAPH CYCLIC STATEGRAPH
// ==========================================
export const Lesson4_2_LangGraph: React.FC = () => {
  const [cycle, setCycle] = useState<number>(1);
  const [status, setStatus] = useState<'coding' | 'testing' | 'error' | 'passed'>('testing');

  const handleNextStep = () => {
    if (status === 'coding') {
      setStatus('testing');
    } else if (status === 'testing') {
      if (cycle < 3) {
        setStatus('error');
      } else {
        setStatus('passed');
      }
    } else if (status === 'error') {
      setCycle((prev) => prev + 1);
      setStatus('coding');
    } else {
      setCycle(1);
      setStatus('testing');
    }
  };

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          LangGraph: Vòng lặp Cycles & Tự sửa lỗi State
        </span>
        <button
          onClick={handleNextStep}
          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
        >
          {status === 'passed' ? 'Bắt đầu phiên mới' : '⏭ Chạy bước tiếp theo'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className={`p-3 border transition-all ${status === 'coding' ? 'border-blue-400 bg-blue-950/40 text-blue-200' : 'border-neutral-800 bg-[#09090b] text-neutral-500'}`}>
          <div className="font-bold text-xs">Node: Coder</div>
          <div className="text-[10px] mt-1">Viết mã hàm</div>
        </div>

        <div className={`p-3 border transition-all ${status === 'testing' ? 'border-amber-400 bg-amber-950/40 text-amber-200' : 'border-neutral-800 bg-[#09090b] text-neutral-500'}`}>
          <div className="font-bold text-xs">Node: Tester</div>
          <div className="text-[10px] mt-1">Chạy PyTest</div>
        </div>

        <div className={`p-3 border transition-all ${status === 'error' ? 'border-red-400 bg-red-950/40 text-red-200' : status === 'passed' ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200' : 'border-neutral-800 bg-[#09090b] text-neutral-500'}`}>
          <div className="font-bold text-xs">{status === 'passed' ? 'Node: END' : 'Conditional Edge'}</div>
          <div className="text-[10px] mt-1">{status === 'passed' ? '✓ Passed 100%' : 'Chu trình lặp lại'}</div>
        </div>
      </div>

      <div className="p-2.5 bg-neutral-900 border border-neutral-800 flex items-center justify-between text-[11px]">
        <span>Trạng thái State: Iteration #{cycle}</span>
        <span className={status === 'passed' ? 'text-emerald-400 font-bold' : status === 'error' ? 'text-red-400 font-bold' : 'text-blue-400'}>
          {status === 'passed' ? 'Tất cả bài test thành công!' : status === 'error' ? 'Test fail -> Quay lại Coder Node tự sửa' : 'Đang xử lý...'}
        </span>
      </div>
    </div>
  );
};

// ==========================================
// BÀI 4.3: HUMAN-IN-THE-LOOP BREAKPOINT
// ==========================================
export const Lesson4_3_Breakpoint: React.FC = () => {
  const [amount, setAmount] = useState<number>(25_000_000);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const THRESHOLD = 5_000_000;
  const isLarge = amount > THRESHOLD;

  const formatVND = (v: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-amber-500" />
          Điểm ngắt an toàn state.interrupt() (Anthropic, Dec 2024)
        </span>
        <span className="text-neutral-400 text-[11px]">Hạn mức tự duyệt: 5.000.000 VNĐ</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => { setAmount(1_200_000); setIsApproved(false); }}
          className={`p-2 border text-left ${amount === 1_200_000 ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 font-bold' : 'border-neutral-800 bg-neutral-900 text-neutral-400'}`}
        >
          <div>1.200.000 VNĐ</div>
          <div className="text-[10px] text-emerald-400">Dưới hạn mức (Tự động)</div>
        </button>

        <button
          onClick={() => { setAmount(25_000_000); setIsApproved(false); }}
          className={`p-2 border text-left ${amount === 25_000_000 ? 'border-amber-500 bg-amber-950/30 text-amber-300 font-bold' : 'border-neutral-800 bg-neutral-900 text-neutral-400'}`}
        >
          <div>25.000.000 VNĐ</div>
          <div className="text-[10px] text-amber-400">Vượt hạn mức (Kích hoạt Breakpoint)</div>
        </button>
      </div>

      <div className="p-3 bg-[#09090b] border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-neutral-400">Giao dịch hoàn tiền:</span>
          <span className="font-bold text-neutral-100">{formatVND(amount)}</span>
        </div>

        {isLarge ? (
          <div className="p-3 border border-amber-800/80 bg-amber-950/20 text-amber-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>BREAKPOINT INTERRUPT: Luồng dừng chờ Quản lý duyệt</span>
            </div>
            {!isApproved ? (
              <button
                onClick={() => setIsApproved(true)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
              >
                Quản lý bấm: [XÁC NHẬN DUYỆT GIẢI NGÂN]
              </button>
            ) : (
              <div className="text-emerald-400 font-bold">
                ✓ Quản lý đã ký duyệt. API ngân hàng được kích hoạt an toàn!
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 border border-emerald-800/80 bg-emerald-950/20 text-emerald-300">
            ✓ Trong hạn mức an toàn: Luồng tự động chuyển khoản thành công không cần dừng.
          </div>
        )}
      </div>
    </div>
  );
};

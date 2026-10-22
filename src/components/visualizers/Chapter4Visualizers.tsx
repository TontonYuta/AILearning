import React, { useState } from 'react';
import { Bot, Wrench, RefreshCw, UserCheck, ShieldAlert, CheckCircle2, Play, RotateCcw, ArrowRight } from 'lucide-react';

// ==========================================
// BÀI 4.1: CHU TRÌNH REACT & FUNCTION CALLING
// ==========================================
export const Lesson4_1_ReAct: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  const reactSteps = [
    { title: 'User Input', badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-500/20 dark:text-zinc-300 dark:border-zinc-500/30', content: '"Kiểm tra trạng thái máy chủ thanh toán IP 10.0.4.12"', note: 'Yêu cầu từ người dùng' },
    { title: 'Thought (Lập luận)', badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30', content: 'Tôi không thể tự bịa thông tin trạng thái máy chủ. Cần gọi công cụ ping_server với địa chỉ IP được cung cấp.', note: 'LLM tự sinh chuỗi suy nghĩ logic' },
    { title: 'Action (Gọi Tool)', badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30', content: 'ping_server({"ip": "10.0.4.12", "port": 5432})', note: 'Phát tín hiệu gọi API hạ tầng' },
    { title: 'Observation (Kết quả)', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30', content: '{"status": "ONLINE", "latency_ms": 14, "active_connections": 142}', note: 'Môi trường thực trả về JSON' },
    { title: 'Final Answer', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30', content: '"Máy chủ thanh toán (10.0.4.12:5432) đang hoạt động bình thường, độ trễ 14ms với 142 kết nối hoạt động."', note: 'Tổng hợp câu trả lời hoàn chỉnh' },
  ];

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-900 dark:text-white font-semibold font-sans text-xs sm:text-sm">
            Mô phỏng Scratchpad Chu Trình ReAct (Yao et al., ICLR 2023)
          </span>
        </div>
        <button
          onClick={() => setStep((prev) => (prev < 4 ? prev + 1 : 0))}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-sans font-bold rounded-lg transition-all active:scale-95 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          {step === 4 ? 'Chạy lại từ đầu' : `Tiến bước (${step + 1}/5)`}
        </button>
      </div>

      <div className="space-y-2">
        {reactSteps.slice(0, step + 1).map((s, idx) => (
          <div key={idx} className="p-3 bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.08] rounded-xl space-y-1.5 transition-all">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${s.badge}`}>
                {s.title}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-sans">{s.note}</span>
            </div>
            <div className="text-slate-800 dark:text-zinc-200 text-xs font-sans pl-1 leading-relaxed">{s.content}</div>
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
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-900 dark:text-white font-semibold font-sans text-xs sm:text-sm">
            LangGraph: Vòng lặp Cycles & Tự sửa lỗi State
          </span>
        </div>
        <button
          onClick={handleNextStep}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-sans font-bold rounded-lg transition-all active:scale-95 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          {status === 'passed' ? 'Bắt đầu phiên mới' : '⏭ Chạy bước kế tiếp'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
        <div className={`p-3.5 rounded-xl border transition-all ${
          status === 'coding' ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-500/15 dark:text-blue-200 shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/[0.08] dark:bg-black/40 dark:text-zinc-500'
        }`}>
          <div className="font-bold text-xs font-sans text-slate-900 dark:text-white">Node: Coder</div>
          <div className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1 font-sans">Viết hoặc vá mã nguồn</div>
        </div>

        <div className={`p-3.5 rounded-xl border transition-all ${
          status === 'testing' ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200 shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/[0.08] dark:bg-black/40 dark:text-zinc-500'
        }`}>
          <div className="font-bold text-xs font-sans text-slate-900 dark:text-white">Node: Tester</div>
          <div className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1 font-sans">Chạy unit test tự động</div>
        </div>

        <div className={`p-3.5 rounded-xl border transition-all ${
          status === 'error'
            ? 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-500/15 dark:text-rose-200 shadow-xs'
            : status === 'passed'
            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-200 shadow-xs'
            : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/[0.08] dark:bg-black/40 dark:text-zinc-500'
        }`}>
          <div className="font-bold text-xs font-sans text-slate-900 dark:text-white">{status === 'passed' ? 'Node: END' : 'Conditional Edge'}</div>
          <div className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1 font-sans">{status === 'passed' ? '✓ Passed 100%' : 'Vòng lặp sửa lỗi'}</div>
        </div>
      </div>

      <div className="p-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.08] rounded-xl flex items-center justify-between text-xs font-sans">
        <span className="text-slate-600 dark:text-zinc-400">Trạng thái chu trình: <strong className="text-slate-900 dark:text-white font-mono">Vòng lặp #{cycle}</strong></span>
        <span className={`font-mono font-bold text-[11px] px-2.5 py-1 rounded-md ${
          status === 'passed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30' : status === 'error' ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30' : 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
        }`}>
          {status === 'passed' ? 'Tất cả bài test thành công!' : status === 'error' ? 'Test fail → Tự động lặp lại Coder Node' : 'Đang thực thi mã...'}
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
    <div className="space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-900 dark:text-white font-semibold font-sans text-xs sm:text-sm">
            Điểm ngắt an toàn state.interrupt() (Anthropic, Dec 2024)
          </span>
        </div>
        <span className="text-slate-600 dark:text-zinc-400 text-[11px] font-sans self-start sm:self-auto">
          Ngưỡng tự duyệt: <strong className="text-slate-900 dark:text-zinc-200">5.000.000 VNĐ</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          onClick={() => { setAmount(1_200_000); setIsApproved(false); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            amount === 1_200_000
              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-200 font-semibold shadow-xs'
              : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-white/[0.08] dark:bg-black/40 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="text-sm font-bold font-mono">1.200.000 VNĐ</div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-sans mt-0.5">Dưới hạn mức (Tự động thực hiện)</div>
        </button>

        <button
          onClick={() => { setAmount(25_000_000); setIsApproved(false); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            amount === 25_000_000
              ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200 font-semibold shadow-xs'
              : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-white/[0.08] dark:bg-black/40 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="text-sm font-bold font-mono">25.000.000 VNĐ</div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 font-sans mt-0.5">Vượt hạn mức (Kích hoạt Breakpoint)</div>
        </button>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.08] rounded-xl space-y-3 font-sans">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-zinc-400">Giao dịch hoàn tiền:</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">{formatVND(amount)}</span>
        </div>

        {isLarge ? (
          <div className="p-3.5 border border-amber-300 bg-amber-50/80 dark:border-amber-500/40 dark:bg-amber-500/10 rounded-xl text-amber-900 dark:text-amber-200 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse shrink-0" />
              <span>BREAKPOINT INTERRUPT: Luồng Agent dừng chờ Quản lý phê duyệt</span>
            </div>
            {!isApproved ? (
              <button
                onClick={() => setIsApproved(true)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all active:scale-98 shadow-md shadow-emerald-600/30 cursor-pointer text-xs"
              >
                Quản lý bấm: [XÁC NHẬN DUYỆT GIẢI NGÂN]
              </button>
            ) : (
              <div className="text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Quản lý đã ký duyệt điện tử. API ngân hàng được kích hoạt an toàn!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3.5 border border-emerald-300 bg-emerald-50/80 dark:border-emerald-500/40 dark:bg-emerald-500/10 rounded-xl text-emerald-900 dark:text-emerald-300 text-xs">
            ✓ Trong hạn mức an toàn: Luồng tự động chuyển khoản thành công không cần dừng chờ phê duyệt thủ công.
          </div>
        )}
      </div>
    </div>
  );
};

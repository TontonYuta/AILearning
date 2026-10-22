import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  DollarSign,
  Database,
  Send,
  Sparkles,
  Bot,
  Zap,
} from 'lucide-react';

interface StateGraphPayload {
  ticket_id: string;
  customer_name: string;
  refund_amount_vnd: number;
  reason: string;
  order_status: 'CONFIRMED' | 'DELIVERED' | 'DISPUTED';
  planner_verdict: string;
  sql_records_verified: boolean;
  requires_human_approval: boolean;
  manager_decision: 'PENDING' | 'APPROVED' | 'REJECTED' | 'AUTO_APPROVED';
  disbursement_tx_id?: string;
  final_notification_sent: boolean;
  timestamp: string;
}

type NodeKey =
  | 'input'
  | 'planner'
  | 'sql_sandbox'
  | 'breakpoint_gate'
  | 'disbursement'
  | 'notify_success'
  | 'notify_rejected';

interface GraphNodeDef {
  key: NodeKey;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: React.ReactNode;
}

const NODES: GraphNodeDef[] = [
  {
    key: 'input',
    title: 'Yêu Cầu Khách Hàng',
    subtitle: 'State Input Channel',
    x: 60,
    y: 190,
    width: 170,
    height: 60,
    icon: <Bot className="w-3.5 h-3.5 text-blue-400" />,
  },
  {
    key: 'planner',
    title: 'Planner Agent',
    subtitle: 'Đánh giá chính sách & hạn mức',
    x: 275,
    y: 190,
    width: 175,
    height: 60,
    icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
  },
  {
    key: 'sql_sandbox',
    title: 'SQL Query Sandbox',
    subtitle: 'Xác minh lịch sử hóa đơn',
    x: 495,
    y: 190,
    width: 175,
    height: 60,
    icon: <Database className="w-3.5 h-3.5 text-amber-400" />,
  },
  {
    key: 'breakpoint_gate',
    title: 'Cổng Quản Lý Duyệt',
    subtitle: 'state.interrupt() Breakpoint',
    x: 715,
    y: 190,
    width: 185,
    height: 60,
    icon: <UserCheck className="w-3.5 h-3.5 text-amber-500" />,
  },
  // Main Branch (Approved)
  {
    key: 'disbursement',
    title: 'Giải Ngân Ngân Hàng',
    subtitle: 'VietQR / Banking API',
    x: 945,
    y: 120,
    width: 175,
    height: 60,
    icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
  },
  {
    key: 'notify_success',
    title: 'Gửi Thông Báo',
    subtitle: 'Hoàn tiền thành công',
    x: 1165,
    y: 120,
    width: 160,
    height: 60,
    icon: <Send className="w-3.5 h-3.5 text-emerald-300" />,
  },
  // Rejection Branch
  {
    key: 'notify_rejected',
    title: 'Thông Báo Từ Chối',
    subtitle: 'Đóng ticket & gửi lý do',
    x: 945,
    y: 260,
    width: 175,
    height: 60,
    icon: <XCircle className="w-3.5 h-3.5 text-red-400" />,
  },
];

export const LangGraphLab: React.FC = () => {
  // Preset Amounts
  const [selectedAmount, setSelectedAmount] = useState<number>(25_000_000); // Default Large (25M)
  const AUTO_THRESHOLD = 5_000_000; // 5M VND threshold

  // Graph state & execution
  const [currentNode, setCurrentNode] = useState<NodeKey>('input');
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 1x, 2x, 5x
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [recentMutatedKey, setRecentMutatedKey] = useState<string>('ticket_id');

  // Orb animation coordinates for smooth visual traveling
  const [orbPos, setOrbPos] = useState<{ x: number; y: number }>({ x: 145, y: 220 });

  // State Payload in memory
  const [payload, setPayload] = useState<StateGraphPayload>({
    ticket_id: 'REF-2026-9812',
    customer_name: 'Nguyễn Văn Minh (VIP-Tier)',
    refund_amount_vnd: 25_000_000,
    reason: 'Sản phẩm lỗi bo mạch máy chủ sau 2 ngày bàn giao',
    order_status: 'DELIVERED',
    planner_verdict: 'PENDING_ANALYSIS',
    sql_records_verified: false,
    requires_human_approval: true,
    manager_decision: 'PENDING',
    final_notification_sent: false,
    timestamp: new Date().toLocaleTimeString(),
  });

  // Keep payload in sync with selectedAmount at start
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    if (currentNode === 'input') {
      setPayload((prev) => ({
        ...prev,
        refund_amount_vnd: amount,
        requires_human_approval: amount > AUTO_THRESHOLD,
      }));
    }
  };

  // Move particle toward node center
  const updateOrbPosition = (targetNodeKey: NodeKey) => {
    const nodeDef = NODES.find((n) => n.key === targetNodeKey);
    if (nodeDef) {
      setOrbPos({
        x: nodeDef.x + nodeDef.width / 2,
        y: nodeDef.y + nodeDef.height / 2,
      });
    }
  };

  // Main Step Forward Transition Function
  const stepForward = () => {
    const isLargeAmount = payload.refund_amount_vnd > AUTO_THRESHOLD;

    switch (currentNode) {
      case 'input': {
        setCurrentNode('planner');
        updateOrbPosition('planner');
        setRecentMutatedKey('planner_verdict');
        setPayload((prev) => ({
          ...prev,
          planner_verdict: isLargeAmount
            ? 'CẢNH BÁO: Vượt ngưỡng tự động (> 5.000.000 VNĐ) -> Đánh dấu Human Approval'
            : 'ĐỦ ĐIỀU KIỆN: Số tiền trong hạn mức tự động (< 5.000.000 VNĐ)',
          requires_human_approval: isLargeAmount,
          timestamp: new Date().toLocaleTimeString(),
        }));
        break;
      }
      case 'planner': {
        setCurrentNode('sql_sandbox');
        updateOrbPosition('sql_sandbox');
        setRecentMutatedKey('sql_records_verified');
        setPayload((prev) => ({
          ...prev,
          sql_records_verified: true,
          timestamp: new Date().toLocaleTimeString(),
        }));
        break;
      }
      case 'sql_sandbox': {
        setCurrentNode('breakpoint_gate');
        updateOrbPosition('breakpoint_gate');
        setRecentMutatedKey('manager_decision');

        if (isLargeAmount) {
          // Pause and trigger Human-In-The-Loop modal breakpoint
          setIsAutoRunning(false);
          setShowApprovalModal(true);
        } else {
          // Auto approve under threshold
          setPayload((prev) => ({
            ...prev,
            manager_decision: 'AUTO_APPROVED',
            timestamp: new Date().toLocaleTimeString(),
          }));
        }
        break;
      }
      case 'breakpoint_gate': {
        // If not already resolved by modal
        if (payload.manager_decision === 'PENDING') {
          setIsAutoRunning(false);
          setShowApprovalModal(true);
        } else if (payload.manager_decision === 'APPROVED' || payload.manager_decision === 'AUTO_APPROVED') {
          setCurrentNode('disbursement');
          updateOrbPosition('disbursement');
          setRecentMutatedKey('disbursement_tx_id');
          setPayload((prev) => ({
            ...prev,
            disbursement_tx_id: 'TXN-VIETQR-' + Math.floor(100000 + Math.random() * 900000),
            timestamp: new Date().toLocaleTimeString(),
          }));
        } else if (payload.manager_decision === 'REJECTED') {
          setCurrentNode('notify_rejected');
          updateOrbPosition('notify_rejected');
          setRecentMutatedKey('final_notification_sent');
          setPayload((prev) => ({
            ...prev,
            final_notification_sent: true,
            timestamp: new Date().toLocaleTimeString(),
          }));
        }
        break;
      }
      case 'disbursement': {
        setCurrentNode('notify_success');
        updateOrbPosition('notify_success');
        setRecentMutatedKey('final_notification_sent');
        setPayload((prev) => ({
          ...prev,
          final_notification_sent: true,
          timestamp: new Date().toLocaleTimeString(),
        }));
        setIsAutoRunning(false);
        break;
      }
      case 'notify_success':
      case 'notify_rejected': {
        setIsAutoRunning(false);
        break;
      }
    }
  };

  // Manager Approval Decisions
  const handleManagerDecision = (decision: 'APPROVED' | 'REJECTED') => {
    setShowApprovalModal(false);
    setPayload((prev) => ({
      ...prev,
      manager_decision: decision,
      timestamp: new Date().toLocaleTimeString(),
    }));

    if (decision === 'APPROVED') {
      setCurrentNode('disbursement');
      updateOrbPosition('disbursement');
      setRecentMutatedKey('disbursement_tx_id');
      setPayload((prev) => ({
        ...prev,
        disbursement_tx_id: 'TXN-VIETQR-' + Math.floor(100000 + Math.random() * 900000),
        manager_decision: 'APPROVED',
        timestamp: new Date().toLocaleTimeString(),
      }));
    } else {
      setCurrentNode('notify_rejected');
      updateOrbPosition('notify_rejected');
      setRecentMutatedKey('final_notification_sent');
      setPayload((prev) => ({
        ...prev,
        final_notification_sent: true,
        manager_decision: 'REJECTED',
        timestamp: new Date().toLocaleTimeString(),
      }));
    }
  };

  // Reset Flow
  const handleReset = () => {
    setIsAutoRunning(false);
    setShowApprovalModal(false);
    setCurrentNode('input');
    const inputNode = NODES[0];
    setOrbPos({
      x: inputNode.x + inputNode.width / 2,
      y: inputNode.y + inputNode.height / 2,
    });
    setPayload({
      ticket_id: 'REF-2026-9812',
      customer_name: 'Nguyễn Văn Minh (VIP-Tier)',
      refund_amount_vnd: selectedAmount,
      reason: 'Sản phẩm lỗi bo mạch máy chủ sau 2 ngày bàn giao',
      order_status: 'DELIVERED',
      planner_verdict: 'PENDING_ANALYSIS',
      sql_records_verified: false,
      requires_human_approval: selectedAmount > AUTO_THRESHOLD,
      manager_decision: 'PENDING',
      final_notification_sent: false,
      timestamp: new Date().toLocaleTimeString(),
    });
    setRecentMutatedKey('ticket_id');
  };

  // Auto-run Timer
  useEffect(() => {
    let timer: number;
    if (isAutoRunning && !showApprovalModal) {
      if (currentNode === 'notify_success' || currentNode === 'notify_rejected') {
        setIsAutoRunning(false);
        return;
      }
      const delay = Math.max(250, 1200 / speedMultiplier);
      timer = window.setTimeout(() => {
        stepForward();
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [isAutoRunning, currentNode, speedMultiplier, showApprovalModal, payload.manager_decision]);

  // Format currency
  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#09090b] relative">
      {/* ============================================================== */}
      {/* CỘT TRÁI: ĐIỀU KHIỂN LUỒNG & STATE PAYLOAD JSON (420px)        */}
      {/* ============================================================== */}
      <div className="w-[430px] shrink-0 border-r border-neutral-800 flex flex-col h-full bg-[#0c0c0e]">
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Quy Trình Hoàn Tiền StateGraph
            </h2>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5">
            HITL Gate
          </span>
        </div>

        {/* Amount Configuration */}
        <div className="p-3.5 border-b border-neutral-800 bg-[#121215] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 uppercase text-[11px]">Số tiền yêu cầu hoàn:</span>
            <span className="text-emerald-400 font-bold">{formatVND(selectedAmount)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => handleAmountSelect(1_200_000)}
              className={`p-2 border text-left transition-colors ${
                selectedAmount === 1_200_000
                  ? 'border-emerald-500 bg-emerald-950/20 text-emerald-200'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="font-semibold text-neutral-100">Khoản Nhỏ (1.2M)</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Tự động duyệt (&lt; 5M)</div>
            </button>

            <button
              onClick={() => handleAmountSelect(25_000_000)}
              className={`p-2 border text-left transition-colors ${
                selectedAmount === 25_000_000
                  ? 'border-amber-500 bg-amber-950/20 text-amber-200'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="font-semibold text-neutral-100">Khoản Lớn (25.0M)</div>
              <div className="text-[10px] text-amber-400 mt-0.5">Ngắt Quản Lý Duyệt</div>
            </button>
          </div>
        </div>

        {/* Playback Control Bar */}
        <div className="p-3 border-b border-neutral-800 bg-[#0e0e11] space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsAutoRunning(!isAutoRunning)}
                disabled={currentNode === 'notify_success' || currentNode === 'notify_rejected'}
                className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isAutoRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                } disabled:opacity-40`}
              >
                {isAutoRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Tạm Dừng
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Chạy Auto
                  </>
                )}
              </button>

              <button
                onClick={stepForward}
                disabled={isAutoRunning || currentNode === 'notify_success' || currentNode === 'notify_rejected'}
                className="px-2.5 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors flex items-center gap-1 disabled:opacity-40"
              >
                <SkipForward className="w-3.5 h-3.5" /> Bước Tiếp
              </button>

              <button
                onClick={handleReset}
                className="px-2 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
                title="Reset Flow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed Multiplier */}
            <div className="flex items-center border border-neutral-800 bg-[#121215] text-[11px] font-mono">
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSpeedMultiplier(speed)}
                  className={`px-2 py-1 transition-colors ${
                    speedMultiplier === speed
                      ? 'bg-neutral-800 text-emerald-400 font-bold'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* State Payload Inspector (Realtime JSON with mutation highlight) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 uppercase text-[11px]">
              State Payload (Thời gian thực):
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              Node hiện tại: [{currentNode.toUpperCase()}]
            </span>
          </div>

          <div className="flex-1 bg-[#09090b] border border-neutral-800 p-3 font-mono text-xs overflow-y-auto leading-relaxed">
            <div className="text-neutral-500 font-normal">{'// TypedDict State Mutation'}</div>
            <div className="text-neutral-300">{'{'}</div>

            {Object.entries(payload).map(([key, val]) => {
              const isMutated = key === recentMutatedKey;
              const formattedVal =
                typeof val === 'string'
                  ? `"${val}"`
                  : typeof val === 'boolean'
                  ? val
                    ? 'true'
                    : 'false'
                  : val;

              return (
                <div
                  key={key}
                  className={`pl-4 py-0.5 transition-colors ${
                    isMutated ? 'bg-emerald-950/40 text-emerald-200' : 'text-neutral-300'
                  }`}
                >
                  <span className={isMutated ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
                    "{key}"
                  </span>
                  <span className="text-neutral-500">: </span>
                  <span
                    className={
                      typeof val === 'number'
                        ? 'text-amber-400 font-semibold'
                        : typeof val === 'boolean'
                        ? val
                          ? 'text-emerald-400 font-bold'
                          : 'text-neutral-500'
                        : isMutated
                        ? 'text-white'
                        : 'text-neutral-200'
                    }
                  >
                    {String(formattedVal)}
                  </span>
                  <span className="text-neutral-600">,</span>
                  {isMutated && (
                    <span className="ml-2 text-[10px] text-emerald-500 font-mono">
                      {'← mutated'}
                    </span>
                  )}
                </div>
              );
            })}

            <div className="text-neutral-300">{'}'}</div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CỘT PHẢI: SƠ ĐỒ ĐỒ THỊ ĐỘNG FLOWCHART SVG (60FPS + ORB)        */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col h-full bg-[#09090b] overflow-hidden relative">
        {/* Top Header */}
        <div className="h-11 border-b border-neutral-800 px-4 flex items-center justify-between bg-[#0e0e11] shrink-0 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-neutral-400">Đồ thị:</span>
            <span className="text-neutral-100 font-semibold">
              RefundProcessGraph with Conditional Human Interruption
            </span>
          </div>

          <div className="flex items-center gap-2 text-neutral-400">
            <span className="inline-block w-2 h-2 bg-emerald-500"></span>
            <span>Hạn mức tự duyệt: 5.000.000 VNĐ</span>
          </div>
        </div>

        {/* SVG Flowchart Viewport */}
        <div className="flex-1 relative overflow-hidden bg-[#09090b] p-6 flex items-center justify-center">
          <svg className="w-full h-full max-w-6xl" viewBox="0 0 1380 400">
            <defs>
              <marker
                id="arrow-default"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#3f3f46" />
              </marker>
              <marker
                id="arrow-active"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
              </marker>
              <marker
                id="arrow-reject"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
              </marker>

              {/* Grid pattern */}
              <pattern id="lang-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" fill="#18181b" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#lang-grid)" />

            {/* 1. EDGES */}
            {/* Edge 1: Input -> Planner */}
            <path
              d="M 230 220 L 275 220"
              fill="none"
              stroke={currentNode !== 'input' ? '#10b981' : '#27272a'}
              strokeWidth="1.5"
              markerEnd={currentNode !== 'input' ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />

            {/* Edge 2: Planner -> SQL Sandbox */}
            <path
              d="M 450 220 L 495 220"
              fill="none"
              stroke={
                ['sql_sandbox', 'breakpoint_gate', 'disbursement', 'notify_success', 'notify_rejected'].includes(
                  currentNode
                )
                  ? '#10b981'
                  : '#27272a'
              }
              strokeWidth="1.5"
              markerEnd="url(#arrow-default)"
            />

            {/* Edge 3: SQL Sandbox -> Breakpoint Gate */}
            <path
              d="M 670 220 L 715 220"
              fill="none"
              stroke={
                ['breakpoint_gate', 'disbursement', 'notify_success', 'notify_rejected'].includes(currentNode)
                  ? '#10b981'
                  : '#27272a'
              }
              strokeWidth="1.5"
              markerEnd="url(#arrow-default)"
            />

            {/* Edge 4: Breakpoint Gate -> Disbursement (Upper Branch - Approved) */}
            <path
              d="M 900 220 C 920 220, 920 150, 945 150"
              fill="none"
              stroke={
                ['disbursement', 'notify_success'].includes(currentNode)
                  ? '#10b981'
                  : '#27272a'
              }
              strokeWidth={['disbursement', 'notify_success'].includes(currentNode) ? 2 : 1.5}
              markerEnd="url(#arrow-default)"
            />
            <text x="915" y="140" fill="#10b981" fontSize="10" fontFamily="JetBrains Mono">
              Đồng Ý / &lt;= 5M
            </text>

            {/* Edge 5: Disbursement -> Notify Success */}
            <path
              d="M 1120 150 L 1165 150"
              fill="none"
              stroke={currentNode === 'notify_success' ? '#10b981' : '#27272a'}
              strokeWidth="1.5"
              markerEnd="url(#arrow-default)"
            />

            {/* Edge 6: Breakpoint Gate -> Notify Rejected (Lower Branch - Rejected) */}
            <path
              d="M 900 220 C 920 220, 920 290, 945 290"
              fill="none"
              stroke={currentNode === 'notify_rejected' ? '#ef4444' : '#27272a'}
              strokeWidth={currentNode === 'notify_rejected' ? 2 : 1.5}
              markerEnd={currentNode === 'notify_rejected' ? 'url(#arrow-reject)' : 'url(#arrow-default)'}
            />
            <text x="915" y="310" fill="#ef4444" fontSize="10" fontFamily="JetBrains Mono">
              Từ Chối
            </text>

            {/* 2. NODES */}
            {NODES.map((node) => {
              const isActive = currentNode === node.key;
              const isBreakpoint = node.key === 'breakpoint_gate';
              const isAmberPulse = isBreakpoint && payload.refund_amount_vnd > AUTO_THRESHOLD && isActive;

              let bgColor = '#121215';
              let borderColor = '#27272a';
              let textColor = '#e4e4e7';

              if (isActive) {
                if (node.key === 'notify_rejected') {
                  bgColor = '#450a0a';
                  borderColor = '#ef4444';
                  textColor = '#fecaca';
                } else if (isAmberPulse) {
                  bgColor = '#451a03';
                  borderColor = '#f59e0b';
                  textColor = '#fef3c7';
                } else {
                  bgColor = '#064e3b';
                  borderColor = '#10b981';
                  textColor = '#d1fae5';
                }
              }

              return (
                <g key={node.key} transform={`translate(${node.x}, ${node.y})`}>
                  {/* Outer pulse when active */}
                  {isActive && (
                    <rect
                      x="-3"
                      y="-3"
                      width={node.width + 6}
                      height={node.height + 6}
                      rx="1"
                      fill="none"
                      stroke={isAmberPulse ? '#f59e0b' : '#10b981'}
                      strokeWidth="2"
                      opacity="0.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Box */}
                  <rect
                    width={node.width}
                    height={node.height}
                    rx="1"
                    fill={bgColor}
                    stroke={borderColor}
                    strokeWidth="1.5"
                  />

                  {/* Node Title */}
                  <text
                    x="14"
                    y="26"
                    fill={textColor}
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="JetBrains Mono"
                  >
                    {node.title}
                  </text>

                  {/* Subtitle */}
                  <text
                    x="14"
                    y="44"
                    fill="#71717a"
                    fontSize="9"
                    fontFamily="Inter"
                  >
                    {node.subtitle}
                  </text>
                </g>
              );
            })}

            {/* 3. ANIMATED DATA PACKET / ORB */}
            <g
              transform={`translate(${orbPos.x}, ${orbPos.y})`}
              className="transition-all duration-500 ease-out"
            >
              <circle
                r="10"
                fill="none"
                stroke={currentNode === 'breakpoint_gate' ? '#f59e0b' : '#10b981'}
                strokeWidth="2"
                opacity="0.6"
                className="animate-ping"
              />
              <circle
                r="6"
                fill={currentNode === 'breakpoint_gate' ? '#fbbf24' : '#34d399'}
              />
            </g>
          </svg>
        </div>

        {/* Breakpoint Alert Bar if paused at Gate */}
        {currentNode === 'breakpoint_gate' && payload.refund_amount_vnd > AUTO_THRESHOLD && (
          <div className="p-3 border-t border-amber-800/80 bg-amber-950/30 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                BREAKPOINT HIT: Gói dữ liệu tạm dừng tại <strong>[Cổng Quản Lý Duyệt]</strong> (Số tiền {formatVND(payload.refund_amount_vnd)} vượt hạn mức).
              </span>
            </div>
            <button
              onClick={() => setShowApprovalModal(true)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-semibold"
            >
              Mở Modal Duyệt Ngay
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* POPUP MODAL: HUMAN-IN-THE-LOOP APPROVAL BREAKPOINT             */}
      {/* ============================================================== */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121215] border border-amber-600/80 shadow-2xl p-5 space-y-4 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-3">
              <div className="w-7 h-7 bg-amber-950/50 border border-amber-600 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-100 text-sm">
                  CẢNH BÁO: ĐIỂM NGẮT PHÊ DUYỆT (HITL)
                </h3>
                <p className="text-[11px] text-neutral-400">
                  LangGraph Breakpoint state.interrupt()
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 bg-[#09090b] border border-neutral-800 p-3.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Mã giao dịch:</span>
                <span className="text-neutral-200 font-semibold">{payload.ticket_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Khách hàng:</span>
                <span className="text-neutral-200">{payload.customer_name}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-800 pt-2">
                <span className="text-neutral-500">Số tiền hoàn:</span>
                <span className="text-amber-400 font-bold text-sm">
                  {formatVND(payload.refund_amount_vnd)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Hạn mức tự duyệt:</span>
                <span className="text-neutral-400">5.000.000 VNĐ</span>
              </div>
              <div className="border-t border-neutral-800 pt-2 text-[11px] text-neutral-300 font-sans leading-relaxed">
                <strong className="text-amber-400 font-mono">Lý do yêu cầu: </strong>
                "{payload.reason}"
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              Số tiền <strong>{formatVND(payload.refund_amount_vnd)}</strong> vượt quá ngưỡng an toàn tự động (5.000.000 VNĐ). Người quản trị cần trực tiếp xác nhận trước khi gọi API giải ngân ngân hàng.
            </p>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleManagerDecision('REJECTED')}
                className="py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-red-700/80 text-red-300 font-bold hover:text-red-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-red-500" />
                TỪ CHỐI (Rejected)
              </button>

              <button
                onClick={() => handleManagerDecision('APPROVED')}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                ĐỒNG Ý (Approved)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

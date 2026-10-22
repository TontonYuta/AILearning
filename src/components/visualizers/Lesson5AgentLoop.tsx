import React, { useState } from 'react';
import { Bot, Terminal, Play, RotateCcw, Wrench, CheckCircle } from 'lucide-react';

export const Lesson5AgentLoop: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      type: 'user',
      title: 'User Prompt',
      content: '"Thời tiết Hà Nội hôm nay thế nào?"',
      color: 'text-neutral-300',
    },
    {
      type: 'thought',
      title: '1. THOUGHT (Suy luận)',
      content: 'Mô hình xác định: "Tôi không có dữ liệu thời tiết thời gian thực. Cần gọi công cụ get_weather cho Hà Nội."',
      color: 'text-blue-400',
    },
    {
      type: 'action',
      title: '2. ACTION (Gọi Tool)',
      content: 'Call API: get_weather({ location: "Ha Noi", unit: "celsius" })',
      color: 'text-amber-400',
    },
    {
      type: 'observation',
      title: '3. OBSERVATION (Kết quả từ Tool)',
      content: 'Return Payload: { "temp": "29°C", "condition": "Nắng nhẹ", "uv_index": 4 }',
      color: 'text-indigo-400',
    },
    {
      type: 'final',
      title: '4. FINAL RESPONSE (Tổng hợp)',
      content: '"Thời tiết Hà Nội hôm nay 29°C, trời có nắng nhẹ và chỉ số UV ở mức an toàn (4)."',
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          Chu trình ReAct Agent (Thought ➔ Action ➔ Observation)
        </span>
        <button
          onClick={() => setCurrentStep((prev) => (prev < 4 ? prev + 1 : 0))}
          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
        >
          {currentStep === 4 ? (
            <>
              <RotateCcw className="w-3 h-3" /> Chạy lại
            </>
          ) : (
            <>
              <Play className="w-3 h-3" /> Bước tiếp theo ({currentStep + 1}/4)
            </>
          )}
        </button>
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        {steps.slice(0, currentStep + 1).map((s, idx) => (
          <div
            key={idx}
            className="p-2.5 bg-[#09090b] border border-neutral-800/80 transition-all font-mono"
          >
            <div className={`text-[10px] font-bold uppercase mb-0.5 ${s.color}`}>
              {s.title}
            </div>
            <div className="text-neutral-200 text-xs font-sans leading-relaxed">
              {s.content}
            </div>
          </div>
        ))}
      </div>

      {currentStep < 4 && (
        <div className="text-[10px] text-neutral-500 italic">
          Bấm nút "Bước tiếp theo" để xem Agent kích hoạt Action và quan sát kết quả...
        </div>
      )}
    </div>
  );
};

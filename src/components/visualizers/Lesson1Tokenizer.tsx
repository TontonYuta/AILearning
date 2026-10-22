import React, { useState, useMemo } from 'react';
import { Type, Sparkles } from 'lucide-react';

export const Lesson1Tokenizer: React.FC = () => {
  const [text, setText] = useState<string>('Xin chào kỹ sư AI áp dụng');

  // Simple realistic BPE-style sub-word tokenizer simulator
  const tokens = useMemo(() => {
    if (!text) return [];
    // Split by words and punctuation, and split multi-syllable Vietnamese into sub-word tokens
    const rawWords = text.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]+|\s+/gu) || [];
    const result: string[] = [];

    rawWords.forEach((item) => {
      if (item === ' ') {
        result.push('␣');
      } else if (item.length > 4 && /[\p{L}]/u.test(item)) {
        // Split long word into 2 sub-word tokens
        const mid = Math.ceil(item.length / 2);
        result.push(item.slice(0, mid));
        result.push(item.slice(mid));
      } else {
        result.push(item);
      }
    });

    return result;
  }, [text]);

  const tokenColors = [
    'border-blue-500/40 bg-blue-950/30 text-blue-200',
    'border-indigo-500/40 bg-indigo-950/30 text-indigo-200',
    'border-emerald-500/40 bg-emerald-950/30 text-emerald-200',
    'border-amber-500/40 bg-amber-950/30 text-amber-200',
    'border-violet-500/40 bg-violet-950/30 text-violet-200',
    'border-cyan-500/40 bg-cyan-950/30 text-cyan-200',
  ];

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-blue-400" />
          Minh họa Tokenizer thời gian thực
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setText('Xin chào kỹ sư AI áp dụng')}
            className="text-[10px] text-neutral-400 hover:text-neutral-200 px-1.5 py-0.5 border border-neutral-800 bg-neutral-900"
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => setText('Hello applied AI engineer!')}
            className="text-[10px] text-neutral-400 hover:text-neutral-200 px-1.5 py-0.5 border border-neutral-800 bg-neutral-900"
          >
            English
          </button>
        </div>
      </div>

      <div>
        <label className="text-[11px] text-neutral-400 block mb-1">
          Gõ thử một câu để xem cách LLM phân rã:
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-[#09090b] border border-neutral-800 p-2 text-neutral-100 focus:border-blue-500 focus:outline-none"
          placeholder="Nhập câu văn bản..."
        />
      </div>

      {/* Visual Token Chips */}
      <div>
        <div className="text-[11px] text-neutral-400 mb-2">
          Kết quả phân đoạn thành các Token rời rạc:
        </div>
        <div className="p-3 bg-[#09090b] border border-neutral-800 flex flex-wrap gap-1.5 min-h-16 items-center">
          {tokens.map((token, idx) => {
            const colorClass = tokenColors[idx % tokenColors.length];
            return (
              <span
                key={idx}
                className={`px-2 py-1 border text-xs font-bold transition-all ${colorClass}`}
                title={`Token #${idx + 1}`}
              >
                {token}
              </span>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800 text-center">
        <div className="p-2 bg-neutral-900 border border-neutral-800">
          <div className="text-[10px] text-neutral-500">TỔNG KÝ TỰ</div>
          <div className="text-sm font-bold text-neutral-200 mt-0.5">{text.length}</div>
        </div>
        <div className="p-2 bg-neutral-900 border border-neutral-800">
          <div className="text-[10px] text-neutral-500">SỐ TOKENS</div>
          <div className="text-sm font-bold text-blue-400 mt-0.5">{tokens.length}</div>
        </div>
        <div className="p-2 bg-neutral-900 border border-neutral-800">
          <div className="text-[10px] text-neutral-500">TỶ LỆ CHAR/TOKEN</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">
            {tokens.length > 0 ? (text.length / tokens.length).toFixed(1) : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

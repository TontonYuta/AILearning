import React, { useState } from 'react';
import { Compass } from 'lucide-react';

interface Point {
  id: string;
  label: string;
  x: number; // in [-1, 1]
  y: number; // in [-1, 1]
  category: 'animal' | 'vehicle';
}

const POINTS: Point[] = [
  { id: 'dog', label: 'Chó cưng', x: 0.65, y: 0.60, category: 'animal' },
  { id: 'cat', label: 'Mèo con', x: 0.58, y: 0.72, category: 'animal' },
  { id: 'car', label: 'Xe ô tô', x: -0.62, y: -0.45, category: 'vehicle' },
];

export const Lesson2VectorSpace: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<'dog-cat' | 'dog-car'>('dog-cat');

  // Canvas dimensions
  const width = 380;
  const height = 220;
  const padding = 35;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const toScreenX = (x: number) => padding + ((x + 1) / 2) * plotWidth;
  const toScreenY = (y: number) => padding + ((1 - (y + 1) / 2)) * plotHeight;

  const dog = POINTS[0];
  const cat = POINTS[1];
  const car = POINTS[2];

  const isDogCat = selectedPair === 'dog-cat';
  const targetPoint = isDogCat ? cat : car;
  const similarityScore = isDogCat ? 0.92 : 0.15;

  return (
    <div className="border border-neutral-800 bg-[#121215] p-4 space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          Không gian Vector 2D & Khoảng cách Cosine
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedPair('dog-cat')}
            className={`px-2 py-0.5 border text-[11px] transition-colors ${
              isDogCat
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
            }`}
          >
            Chó vs Mèo (0.92)
          </button>
          <button
            onClick={() => setSelectedPair('dog-car')}
            className={`px-2 py-0.5 border text-[11px] transition-colors ${
              !isDogCat
                ? 'border-amber-500 bg-amber-950/40 text-amber-300'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
            }`}
          >
            Chó vs Xe (0.15)
          </button>
        </div>
      </div>

      {/* SVG Vector Plot */}
      <div className="bg-[#09090b] border border-neutral-800 flex items-center justify-center p-2">
        <svg width={width} height={height} className="overflow-visible">
          {/* Axes */}
          <line
            x1={padding}
            y1={toScreenY(0)}
            x2={width - padding}
            y2={toScreenY(0)}
            stroke="#27272a"
            strokeWidth="1"
          />
          <line
            x1={toScreenX(0)}
            y1={padding}
            x2={toScreenX(0)}
            y2={height - padding}
            stroke="#27272a"
            strokeWidth="1"
          />

          {/* Connection Vector Line */}
          <line
            x1={toScreenX(dog.x)}
            y1={toScreenY(dog.y)}
            x2={toScreenX(targetPoint.x)}
            y2={toScreenY(targetPoint.y)}
            stroke={isDogCat ? '#10b981' : '#71717a'}
            strokeWidth={isDogCat ? '2' : '1.5'}
            strokeDasharray={isDogCat ? 'none' : '4 4'}
          />

          {/* Points */}
          {POINTS.map((p) => {
            const isCatOrDog = p.id === 'dog' || (isDogCat && p.id === 'cat') || (!isDogCat && p.id === 'car');
            return (
              <g key={p.id} transform={`translate(${toScreenX(p.x)}, ${toScreenY(p.y)})`}>
                <circle
                  r={isCatOrDog ? 6 : 4}
                  fill={p.category === 'animal' ? '#10b981' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x="8"
                  y="4"
                  fill="#e4e4e7"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Result Metrics */}
      <div className="p-3 bg-neutral-900 border border-neutral-800 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-neutral-400">
            Cặp so sánh: <strong className="text-neutral-200">"{dog.label}"</strong> ⟷ <strong className="text-neutral-200">"{targetPoint.label}"</strong>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">
            {isDogCat ? 'Cùng cụm động vật thân thiện' : 'Khác xa danh mục và ngữ cảnh'}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-neutral-500 uppercase">Cosine Similarity</div>
          <div className={`text-base font-bold ${isDogCat ? 'text-emerald-400' : 'text-neutral-400'}`}>
            {similarityScore.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

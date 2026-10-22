import React, { useEffect, useRef, useState } from 'react';
import { ChunkItem, QueryVector } from '../../types';

interface VectorCanvasProps {
  chunks: ChunkItem[];
  queryVector: QueryVector | null;
  topK: number;
  similarityThreshold: number;
  selectedChunkId: number | null;
  onSelectChunk: (id: number) => void;
}

export const VectorCanvas: React.FC<VectorCanvasProps> = ({
  chunks,
  queryVector,
  topK,
  similarityThreshold,
  selectedChunkId,
  onSelectChunk,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredChunk, setHoveredChunk] = useState<ChunkItem | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Identify top-K chunks by cosine score
  const sortedChunks = queryVector
    ? [...chunks]
        .filter((c) => (c.cosineScore ?? 0) >= similarityThreshold)
        .sort((a, b) => (b.cosineScore ?? 0) - (a.cosineScore ?? 0))
        .slice(0, topK)
    : [];
  const topKIds = new Set(sortedChunks.map((c) => c.id));

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let pulsePhase = 0;

    const render = () => {
      pulsePhase += 0.04;
      const width = canvas.width;
      const height = canvas.height;

      // Clear dark background (#09090b)
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Coordinate transformation: [-1, 1] to screen coords with padding
      const padding = 54;
      const plotWidth = width - padding * 2;
      const plotHeight = height - padding * 2;
      const toScreenX = (normX: number) => padding + ((normX + 1) / 2) * plotWidth;
      const toScreenY = (normY: number) => padding + ((1 - (normY + 1) / 2)) * plotHeight;

      // Draw subtle grid lines
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1;

      const gridSteps = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];
      gridSteps.forEach((val) => {
        const sx = toScreenX(val);
        const sy = toScreenY(val);

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(sx, padding);
        ctx.lineTo(sx, height - padding);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(padding, sy);
        ctx.lineTo(width - padding, sy);
        ctx.stroke();
      });

      // Draw Center Axes (0, 0)
      const cx = toScreenX(0);
      const cy = toScreenY(0);
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(cx, padding - 10);
      ctx.lineTo(cx, height - padding + 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding - 10, cy);
      ctx.lineTo(width - padding + 10, cy);
      ctx.stroke();

      // Axis tick labels (clean monospaced)
      ctx.fillStyle = '#52525b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('-1.0', toScreenX(-0.95), cy + 14);
      ctx.fillText('+1.0', toScreenX(0.95), cy + 14);
      ctx.fillText('(0,0) Origin', cx + 32, cy - 6);

      ctx.textAlign = 'right';
      ctx.fillText('+1.0 Dim Y', cx - 8, toScreenY(0.95));
      ctx.fillText('-1.0', cx - 8, toScreenY(-0.92));

      // 1. Draw Vector Rays from Query to Chunks
      if (queryVector) {
        const qx = toScreenX(queryVector.x);
        const qy = toScreenY(queryVector.y);

        chunks.forEach((chunk) => {
          const chX = toScreenX(chunk.x);
          const chY = toScreenY(chunk.y);
          const score = chunk.cosineScore ?? 0;
          const isTop = topKIds.has(chunk.id);
          const isSelected = selectedChunkId === chunk.id;

          if (score >= 0.1 || isTop) {
            ctx.beginPath();
            ctx.moveTo(qx, qy);
            ctx.lineTo(chX, chY);

            if (isTop || isSelected) {
              // Emerald electric ray
              ctx.strokeStyle = isSelected ? '#38bdf8' : '#10b981';
              ctx.lineWidth = isSelected ? 2.5 : 1.8;
              ctx.setLineDash([4, 4]);
              ctx.lineDashOffset = -pulsePhase * 8;
            } else {
              // Subtle faint gray ray
              ctx.strokeStyle = `rgba(113, 113, 122, ${Math.max(0.08, score * 0.35)})`;
              ctx.lineWidth = 1;
              ctx.setLineDash([]);
            }
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      }

      // 2. Draw Chunk Nodes
      chunks.forEach((chunk) => {
        const chX = toScreenX(chunk.x);
        const chY = toScreenY(chunk.y);
        const isTop = topKIds.has(chunk.id);
        const isSelected = selectedChunkId === chunk.id;
        const isHovered = hoveredChunk?.id === chunk.id;
        const score = chunk.cosineScore ?? 0;

        // Radius based on state
        const radius = isSelected ? 10 : isTop ? 8 : 6;

        // Glowing outer halo for top-K or selected
        if (isTop || isSelected) {
          ctx.beginPath();
          const haloPulse = 4 + Math.sin(pulsePhase * 2 + chunk.id) * 2;
          ctx.arc(chX, chY, radius + haloPulse, 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? 'rgba(56, 189, 248, 0.2)'
            : 'rgba(16, 185, 129, 0.25)';
          ctx.fill();
        }

        // Inner solid node
        ctx.beginPath();
        ctx.arc(chX, chY, radius, 0, Math.PI * 2);

        if (isSelected) {
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
        } else if (isTop) {
          ctx.fillStyle = '#10b981';
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.5;
        } else if (isHovered) {
          ctx.fillStyle = '#a1a1aa';
          ctx.strokeStyle = '#f4f4f5';
          ctx.lineWidth = 1.5;
        } else {
          ctx.fillStyle = '#27272a';
          ctx.strokeStyle = '#52525b';
          ctx.lineWidth = 1;
        }
        ctx.fill();
        ctx.stroke();

        // Node ID label
        ctx.fillStyle = isTop || isSelected ? '#ffffff' : '#a1a1aa';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`C${chunk.id}`, chX, chY + radius + 12);

        // Score tag if Top-K or Query active
        if ((isTop || isSelected) && queryVector) {
          ctx.fillStyle = isSelected ? '#38bdf8' : '#10b981';
          ctx.font = '600 10px "JetBrains Mono", monospace';
          ctx.fillText(`${score.toFixed(3)}`, chX, chY - radius - 6);
        }
      });

      // 3. Draw Query Point if query exists
      if (queryVector) {
        const qx = toScreenX(queryVector.x);
        const qy = toScreenY(queryVector.y);

        // Pulsing radar rings
        const ringRadius = 12 + ((pulsePhase * 6) % 18);
        const ringAlpha = Math.max(0, 1 - ringRadius / 30);
        ctx.beginPath();
        ctx.arc(qx, qy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Main Query Point (Cyan / Electric Blue)
        ctx.beginPath();
        ctx.arc(qx, qy, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Query point label
        ctx.fillStyle = '#22d3ee';
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('QUERY VECTOR', qx, qy - 14);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [chunks, queryVector, topK, similarityThreshold, selectedChunkId, hoveredChunk, topKIds]);

  // Handle Resize for Retina Displays
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvasRef.current.width = rect.width * dpr;
      canvasRef.current.height = rect.height * dpr;
      canvasRef.current.style.width = `${rect.width}px`;
      canvasRef.current.style.height = `${rect.height}px`;

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse move detection for hover tooltips
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    const padding = 54;
    const plotWidth = rect.width - padding * 2;
    const plotHeight = rect.height - padding * 2;

    const toScreenX = (normX: number) => padding + ((normX + 1) / 2) * plotWidth;
    const toScreenY = (normY: number) => padding + ((1 - (normY + 1) / 2)) * plotHeight;

    let found: ChunkItem | null = null;
    for (const chunk of chunks) {
      const cx = toScreenX(chunk.x);
      const cy = toScreenY(chunk.y);
      const dist = Math.hypot(mouseX - cx, mouseY - cy);
      if (dist <= 16) {
        found = chunk;
        break;
      }
    }
    setHoveredChunk(found);
  };

  const handleCanvasClick = () => {
    if (hoveredChunk) {
      onSelectChunk(hoveredChunk.id);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#09090b] select-none">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredChunk(null);
          setMousePos(null);
        }}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Floating Hover Card */}
      {hoveredChunk && mousePos && (
        <div
          className="fixed pointer-events-none z-50 bg-[#121215] border border-neutral-700 p-2.5 text-xs text-neutral-200 shadow-xl max-w-xs font-mono"
          style={{
            left: `${mousePos.x + 16}px`,
            top: `${Math.min(window.innerHeight - 180, mousePos.y - 40)}px`,
          }}
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-1.5">
            <span className="font-semibold text-neutral-100">
              Chunk #{hoveredChunk.id}
            </span>
            <span className="text-[10px] text-neutral-400">
              {hoveredChunk.tokens} tokens · {hoveredChunk.text.length} chars
            </span>
          </div>
          <p className="text-neutral-300 font-sans text-xs line-clamp-3 mb-2 leading-relaxed">
            "{hoveredChunk.text}"
          </p>
          <div className="grid grid-cols-2 gap-1 text-[10px] pt-1 border-t border-neutral-800/80">
            <div>
              <span className="text-neutral-500">2D Coords:</span> ({hoveredChunk.x}, {hoveredChunk.y})
            </div>
            <div>
              <span className="text-neutral-500">Cosine:</span>{' '}
              <span className={topKIds.has(hoveredChunk.id) ? 'text-emerald-400 font-semibold' : 'text-neutral-300'}>
                {hoveredChunk.cosineScore !== undefined ? hoveredChunk.cosineScore.toFixed(4) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

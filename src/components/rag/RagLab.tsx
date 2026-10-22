import React, { useState, useMemo, useEffect } from 'react';
import { ChunkItem, QueryVector } from '../../types';
import {
  DOCUMENT_PRESETS,
  chunkTextWithOverlap,
  generateEmbeddingVector,
  calculateCosineSimilarity,
} from '../../utils/ragMath';
import { VectorCanvas } from './VectorCanvas';
import { RrfView } from './RrfView';
import {
  FileText,
  Sliders,
  Search,
  Sparkles,
  Layers,
  Compass,
  Zap,
  Info,
} from 'lucide-react';

export const RagLab: React.FC = () => {
  // Preset selector
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sre-runbook');
  const [sourceText, setSourceText] = useState<string>(DOCUMENT_PRESETS[0].content);

  // Chunking parameters
  const [chunkSize, setChunkSize] = useState<number>(220);
  const [chunkOverlap, setChunkOverlap] = useState<number>(40);

  // Query & Visual state
  const [queryText, setQueryText] = useState<string>('Làm sao xử lý Database Failover?');
  const [topK, setTopK] = useState<number>(3);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.2);
  const [selectedChunkId, setSelectedChunkId] = useState<number | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<'canvas' | 'rrf'>('canvas');

  // Load preset document
  const handleSelectPreset = (id: string) => {
    const preset = DOCUMENT_PRESETS.find((p) => p.id === id);
    if (preset) {
      setSelectedPresetId(id);
      setSourceText(preset.content);
      setSelectedChunkId(null);
    }
  };

  // Generate chunks with overlap whenever text or parameters change
  const rawChunks = useMemo(() => {
    return chunkTextWithOverlap(sourceText, chunkSize, chunkOverlap);
  }, [sourceText, chunkSize, chunkOverlap]);

  // Compute query vector
  const queryVector: QueryVector | null = useMemo(() => {
    if (!queryText.trim()) return null;
    const emb = generateEmbeddingVector(queryText);
    return {
      text: queryText,
      x: emb.x,
      y: emb.y,
      vector: emb.vector,
    };
  }, [queryText]);

  // Augment chunks with cosine similarity to current query
  const scoredChunks: ChunkItem[] = useMemo(() => {
    if (!queryVector) return rawChunks;
    return rawChunks.map((chunk) => {
      const cosine = calculateCosineSimilarity(queryVector.vector, chunk.vector);
      return {
        ...chunk,
        cosineScore: cosine,
      };
    });
  }, [rawChunks, queryVector]);

  // Selected chunk item for quick inspector
  const selectedChunk = scoredChunks.find((c) => c.id === selectedChunkId) || scoredChunks[0];

  // Auto-select chunk 1 if invalid
  useEffect(() => {
    if (scoredChunks.length > 0 && (!selectedChunkId || !scoredChunks.some(c => c.id === selectedChunkId))) {
      setSelectedChunkId(scoredChunks[0].id);
    }
  }, [scoredChunks, selectedChunkId]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#09090b]">
      {/* ============================================================== */}
      {/* CỘT TRÁI: BẢNG ĐIỀU KHIỂN NGUỒN & PHÂN ĐOẠN CHUNKING (420px)   */}
      {/* ============================================================== */}
      <div className="w-[430px] shrink-0 border-r border-neutral-800 flex flex-col h-full bg-[#0c0c0e]">
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Cấu hình Chunking & Văn bản
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            {rawChunks.length} chunks
          </span>
        </div>

        {/* Scrollable Left Controls */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. Quick Document Presets */}
          <div>
            <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Tài liệu mẫu thực tế:
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {DOCUMENT_PRESETS.map((preset) => {
                const isActive = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`text-left px-2.5 py-1.5 transition-colors border text-xs ${
                      isActive
                        ? 'border-blue-500/80 bg-blue-950/30 text-blue-200'
                        : 'border-neutral-800 bg-[#121215] text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>{preset.name}</span>
                      {isActive && <span className="text-[10px] text-blue-400 font-mono">ĐANG CHỌN</span>}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {preset.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Source Text Textarea */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
              <span>Văn bản đầu vào:</span>
              <span className="font-mono text-[10px] text-neutral-500">
                {sourceText.length} ký tự
              </span>
            </div>
            <textarea
              rows={5}
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                setSelectedPresetId('custom');
              }}
              className="w-full bg-[#121215] border border-neutral-800 p-2.5 text-xs text-neutral-200 font-mono focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
              placeholder="Nhập văn bản nguồn để thử nghiệm chunking..."
            />
          </div>

          {/* 3. Sliders: Chunk Size & Chunk Overlap */}
          <div className="border border-neutral-800 bg-[#121215] p-3 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                Tham số phân đoạn (Chunking)
              </span>
            </div>

            {/* Chunk Size Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-neutral-400">Chunk Size:</span>
                <span className="text-blue-400 font-bold">{chunkSize} ký tự</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1 bg-neutral-800 appearance-none"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                <span>50 ký tự (Fine)</span>
                <span>500 ký tự (Coarse)</span>
              </div>
            </div>

            {/* Chunk Overlap Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-neutral-400">Chunk Overlap:</span>
                <span className="text-amber-400 font-bold">{chunkOverlap} ký tự</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1 bg-neutral-800 appearance-none"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                <span>0 ký tự (Rời rạc)</span>
                <span>100 ký tự (Gối sâu)</span>
              </div>
            </div>

            {/* Chunking telemetry summary */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800 text-[11px] font-mono text-center">
              <div>
                <div className="text-neutral-500 text-[10px]">TỔNG SỐ</div>
                <div className="text-neutral-100 font-bold mt-0.5">{rawChunks.length} chunks</div>
              </div>
              <div>
                <div className="text-neutral-500 text-[10px]">TỈ LỆ OVERLAP</div>
                <div className="text-amber-400 font-bold mt-0.5">
                  {chunkSize > 0 ? ((chunkOverlap / chunkSize) * 100).toFixed(0) : 0}%
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-[10px]">TB TOKENS</div>
                <div className="text-neutral-100 font-bold mt-0.5">
                  ~{Math.round(chunkSize / 3.8)} tok
                </div>
              </div>
            </div>
          </div>

          {/* 4. Live Chunk Segment Preview */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
              <span>Xem trước phân đoạn trực tiếp:</span>
              <span className="text-[10px] text-neutral-500">Click để chọn</span>
            </div>

            <div className="space-y-2">
              {scoredChunks.map((chunk, idx) => {
                const isSelected = selectedChunkId === chunk.id;
                // Alternating subtle border accent
                const borderColors = [
                  'border-blue-900/50 hover:border-blue-700',
                  'border-indigo-900/50 hover:border-indigo-700',
                  'border-violet-900/50 hover:border-violet-700',
                  'border-cyan-900/50 hover:border-cyan-700',
                ];
                const borderStyle = borderColors[idx % borderColors.length];

                return (
                  <div
                    key={chunk.id}
                    onClick={() => setSelectedChunkId(chunk.id)}
                    className={`p-2.5 border transition-all cursor-pointer text-xs font-mono relative ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/30'
                        : `bg-[#121215] ${borderStyle}`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[11px]">
                      <span className="font-semibold text-neutral-200">
                        Chunk #{chunk.id}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>[{chunk.charStart}..{chunk.charEnd}]</span>
                        <span>{chunk.tokens} tokens</span>
                      </div>
                    </div>

                    {/* Text with highlighted overlap segment */}
                    <div className="font-sans text-xs text-neutral-300 leading-relaxed">
                      {chunk.overlapStart !== undefined && chunkOverlap > 0 ? (
                        <>
                          <span
                            title="Phần Overlap gối đầu từ chunk trước"
                            className="border border-dashed border-amber-500/80 bg-amber-500/10 text-amber-200 px-1 py-0.5"
                          >
                            {chunk.text.slice(0, Math.min(chunkOverlap, chunk.text.length))}
                          </span>
                          <span>
                            {chunk.text.slice(Math.min(chunkOverlap, chunk.text.length))}
                          </span>
                        </>
                      ) : (
                        chunk.text
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CỘT PHẢI: VÙNG CANVAS VECTOR 2D & RRF HYBRID SEARCH            */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col h-full bg-[#09090b] overflow-hidden">
        {/* Right Top Header with sub-tabs */}
        <div className="h-11 border-b border-neutral-800 px-4 flex items-center justify-between bg-[#0e0e11] shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveRightTab('canvas')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeRightTab === 'canvas'
                  ? 'bg-neutral-800 text-neutral-100 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Không Gian Vector 2D (Scatter Plot)
            </button>
            <button
              onClick={() => setActiveRightTab('rrf')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeRightTab === 'rrf'
                  ? 'bg-neutral-800 text-neutral-100 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Dung Hợp RRF (BM25 vs Dense)
            </button>
          </div>

          <div className="text-xs text-neutral-400 font-mono flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-emerald-500"></span>
            <span>Cosine Distance 60fps</span>
          </div>
        </div>

        {/* Right Tab Content */}
        {activeRightTab === 'canvas' ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Query Control Bar */}
            <div className="p-3 border-b border-neutral-800 bg-[#121215] space-y-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Nhập câu hỏi tìm kiếm (ví dụ: 'Cách xử lý failover PostgreSQL?')..."
                    className="w-full bg-[#09090b] border border-neutral-800 pl-8 pr-3 py-1.5 text-xs text-neutral-100 focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Top-K Selector */}
                <div className="flex items-center gap-2 border border-neutral-800 bg-[#09090b] px-3 py-1 text-xs font-mono">
                  <span className="text-neutral-400">Top-K:</span>
                  <select
                    value={topK}
                    onChange={(e) => setTopK(Number(e.target.value))}
                    className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                      <option key={num} value={num} className="bg-neutral-900 text-neutral-200">
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Similarity Cutoff */}
                <div className="flex items-center gap-2 border border-neutral-800 bg-[#09090b] px-3 py-1 text-xs font-mono">
                  <span className="text-neutral-400">Ngưỡng:</span>
                  <input
                    type="number"
                    min="0"
                    max="0.9"
                    step="0.05"
                    value={similarityThreshold}
                    onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                    className="w-12 bg-transparent text-neutral-200 font-bold focus:outline-none text-right"
                  />
                </div>
              </div>

              {/* Sample Queries Chips */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="text-neutral-500 font-mono">Gợi ý truy vấn:</span>
                {[
                  'Làm sao xử lý Database Failover?',
                  'Yêu cầu mã hóa dữ liệu thẻ PCI-DSS',
                  'Quy trình chuyển mạch dự phòng Patroni',
                  'Chính sách lưu trữ khóa HSM và DEK',
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setQueryText(sample)}
                    className="text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-2 py-0.5 transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Canvas */}
            <div className="flex-1 relative overflow-hidden">
              <VectorCanvas
                chunks={scoredChunks}
                queryVector={queryVector}
                topK={topK}
                similarityThreshold={similarityThreshold}
                selectedChunkId={selectedChunkId}
                onSelectChunk={(id) => setSelectedChunkId(id)}
              />

              {/* Canvas Legend Overlay */}
              <div className="absolute top-3 left-3 bg-[#121215]/90 border border-neutral-800 p-2 text-[11px] font-mono space-y-1 backdrop-blur-sm pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span className="text-neutral-300">Query Point (Điểm truy vấn)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-neutral-300">Top-{topK} Match (Gần nhất)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-600"></span>
                  <span className="text-neutral-400">Chunk khác trong không gian</span>
                </div>
              </div>
            </div>

            {/* Bottom Inspector Bar for Selected Chunk */}
            {selectedChunk && (
              <div className="border-t border-neutral-800 bg-[#101013] p-3 shrink-0 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 font-mono text-xs mb-1">
                    <span className="text-blue-400 font-bold">
                      Chunk #{selectedChunk.id}
                    </span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-neutral-400">
                      Tọa độ 2D: [{selectedChunk.x}, {selectedChunk.y}]
                    </span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-neutral-400">
                      {selectedChunk.tokens} tokens
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-sans line-clamp-2 leading-relaxed">
                    "{selectedChunk.text}"
                  </p>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-[10px] text-neutral-500 uppercase">
                    Cosine Similarity
                  </div>
                  <div className="text-lg font-bold text-emerald-400">
                    {selectedChunk.cosineScore !== undefined
                      ? selectedChunk.cosineScore.toFixed(4)
                      : '0.0000'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <RrfView chunks={scoredChunks} query={queryText} />
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ChunkItem } from '../../types';
import { computeRRF } from '../../utils/ragMath';
import { ArrowRight, Layers, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface RrfViewProps {
  chunks: ChunkItem[];
  query: string;
}

export const RrfView: React.FC<RrfViewProps> = ({ chunks, query }) => {
  const [isFused, setIsFused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [kConstant, setKConstant] = useState(60);

  // Compute RRF
  const rrfResults = computeRRF(chunks, query, kConstant);

  // Dense sorted list
  const denseSorted = [...chunks]
    .sort((a, b) => (b.cosineScore ?? 0) - (a.cosineScore ?? 0))
    .map((c, idx) => ({ ...c, denseRank: idx + 1 }));

  // Sparse sorted list
  const sparseSorted = [...rrfResults]
    .sort((a, b) => (b.bm25Score ?? 0) - (a.bm25Score ?? 0))
    .map((c, idx) => ({ ...c, sparseRank: idx + 1 }));

  const handleFuse = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsFused(true);
      setIsAnimating(false);
    }, 450);
  };

  const handleReset = () => {
    setIsFused(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-y-auto p-4 text-neutral-200">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            Reciprocal Rank Fusion (RRF) Hybrid Search
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Dung hợp xếp hạng Sparse (BM25 từ khóa) & Dense (Vector ngữ nghĩa) theo công thức: RRF(d) = Σ 1 / (k + rank)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono bg-neutral-900 border border-neutral-800 px-2 py-1">
            <span>k =</span>
            <input
              type="number"
              min="10"
              max="120"
              step="5"
              value={kConstant}
              onChange={(e) => setKConstant(Number(e.target.value))}
              className="w-10 bg-transparent text-neutral-100 focus:outline-none text-right font-mono"
            />
          </div>

          {!isFused ? (
            <button
              onClick={handleFuse}
              disabled={isAnimating || chunks.length === 0}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isAnimating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Đang dung hợp...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Dung hợp RRF (k={kConstant})
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-colors"
            >
              Tách 2 Cột Song Song
            </button>
          )}
        </div>
      </div>

      {!isFused ? (
        /* Dual Column Parallel View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {/* Column 1: Sparse (BM25 Lexical) */}
          <div className="border border-neutral-800 bg-[#121215] flex flex-col">
            <div className="p-3 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-400 font-mono">
                  [Cột 1] Sparse Search (BM25)
                </span>
                <p className="text-[11px] text-neutral-400">
                  Khớp chính xác token từ khóa, mã hiệu lỗi, mã lệnh
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5">
                {sparseSorted.length} chunks
              </span>
            </div>

            <div className="p-2 space-y-2 overflow-y-auto flex-1 max-h-[calc(100vh-220px)]">
              {sparseSorted.map((item, idx) => (
                <div
                  key={`sparse-${item.id}`}
                  className="p-2.5 border border-neutral-800/80 bg-neutral-950/60 hover:border-neutral-700 transition-all font-mono text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-amber-400 font-bold">
                      Rank #{idx + 1} · Chunk {item.id}
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      BM25: <strong className="text-neutral-200">{item.bm25Score?.toFixed(2) ?? '0.00'}</strong>
                    </span>
                  </div>
                  <p className="font-sans text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Dense (Vector Semantic) */}
          <div className="border border-neutral-800 bg-[#121215] flex flex-col">
            <div className="p-3 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 font-mono">
                  [Cột 2] Dense Search (Vector Embedding)
                </span>
                <p className="text-[11px] text-neutral-400">
                  Hiểu ngữ cảnh, từ đồng nghĩa và ý định ngữ nghĩa
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5">
                {denseSorted.length} chunks
              </span>
            </div>

            <div className="p-2 space-y-2 overflow-y-auto flex-1 max-h-[calc(100vh-220px)]">
              {denseSorted.map((item, idx) => (
                <div
                  key={`dense-${item.id}`}
                  className="p-2.5 border border-neutral-800/80 bg-neutral-950/60 hover:border-neutral-700 transition-all font-mono text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-emerald-400 font-bold">
                      Rank #{idx + 1} · Chunk {item.id}
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      Cosine: <strong className="text-neutral-200">{item.cosineScore?.toFixed(4) ?? '0.0000'}</strong>
                    </span>
                  </div>
                  <p className="font-sans text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Fused Result Table */
        <div className="border border-neutral-800 bg-[#121215] flex flex-col">
          <div className="p-3 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-neutral-100 font-mono">
                BẢNG KẾT QUẢ DUNG HỢP RECIPROCAL RANK FUSION (k={kConstant})
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">
              Hybrid Search kết hợp hoàn hảo cả từ khóa chính xác & vector ngữ nghĩa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400 text-[11px]">
                  <th className="py-2.5 px-3 w-16 text-center">Rank</th>
                  <th className="py-2.5 px-3 w-20">Chunk ID</th>
                  <th className="py-2.5 px-3 w-28 text-center text-amber-400">BM25 Rank</th>
                  <th className="py-2.5 px-3 w-28 text-center text-emerald-400">Dense Rank</th>
                  <th className="py-2.5 px-3 w-48 text-right text-blue-400">RRF Score Formula</th>
                  <th className="py-2.5 px-3">Trích đoạn nội dung tài liệu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {rrfResults.map((item) => {
                  const denseRrf = (1 / (kConstant + (item.denseRank || 1))).toFixed(5);
                  const sparseRrf = (1 / (kConstant + (item.sparseRank || 1))).toFixed(5);
                  return (
                    <tr
                      key={`fused-${item.id}`}
                      className="hover:bg-neutral-900/60 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center font-bold text-neutral-100">
                        #{item.finalRank}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-neutral-300">
                        C-{item.id}
                      </td>
                      <td className="py-2.5 px-3 text-center text-amber-400 font-semibold">
                        #{item.sparseRank}{' '}
                        <span className="text-[10px] text-neutral-500 font-normal">
                          ({item.bm25Score?.toFixed(2)})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-semibold">
                        #{item.denseRank}{' '}
                        <span className="text-[10px] text-neutral-500 font-normal">
                          ({item.cosineScore?.toFixed(3)})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="text-blue-400 font-bold">
                          {item.rrfScore?.toFixed(5)}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {sparseRrf} + {denseRrf}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-neutral-300 text-xs">
                        <p className="line-clamp-2">{item.text}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Zap,
  DollarSign,
  Clock,
  Database,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { generateEmbeddingVector, calculateCosineSimilarity } from '../../utils/ragMath';

interface CachedItem {
  id: string;
  query: string;
  response: string;
  vector: number[];
  x: number;
  y: number;
  hits: number;
}

const INITIAL_CACHE: CachedItem[] = [
  {
    id: 'c-1',
    query: 'Làm sao để deploy Docker container trên Linux server?',
    response: 'Chạy lệnh docker run -d --name my-app -p 80:80 my-image:latest. Đảm bảo cấu hình systemd docker service và mở port firewall.',
    ...generateEmbeddingVector('Làm sao để deploy Docker container trên Linux server?'),
    hits: 24,
  },
  {
    id: 'c-2',
    query: 'Cách tối ưu câu lệnh SQL query và index trong PostgreSQL?',
    response: 'Sử dụng EXPLAIN (ANALYZE, BUFFERS) để xác định Seq Scan, tạo B-Tree index cho cột WHERE/JOIN và chạy định kỳ VACUUM ANALYZE.',
    ...generateEmbeddingVector('Cách tối ưu câu lệnh SQL query và index trong PostgreSQL?'),
    hits: 18,
  },
  {
    id: 'c-3',
    query: 'Cấu hình SSL Let\'s Encrypt tự động gia hạn với Nginx',
    response: 'Cài đặt certbot và python3-certbot-nginx, sau đó chạy certbot --nginx -d domain.com. Cronjob tự động gia hạn khi chứng chỉ còn dưới 30 ngày.',
    ...generateEmbeddingVector('Cấu hình SSL Lets Encrypt tự động gia hạn với Nginx'),
    hits: 12,
  },
];

export const SemanticCacheLab: React.FC = () => {
  const [cacheItems, setCacheItems] = useState<CachedItem[]>(INITIAL_CACHE);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.82);
  const [modelRatePerMToken, setModelRatePerMToken] = useState<number>(5.0); // $5.00 / 1M tokens (GPT-4o)
  const [testQuery, setTestQuery] = useState<string>('Hướng dẫn triển khai container trên Docker server');

  const [lastResult, setLastResult] = useState<{
    isHit: boolean;
    matchedItem?: CachedItem;
    similarity: number;
    latencySavedMs: number;
    costSavedDollar: number;
  } | null>(null);

  // Global telemetry counters
  const [metrics, setMetrics] = useState({
    totalRequests: 54,
    cacheHits: 42,
    totalLatencySavedMs: 35700,
    totalCostSaved: 0.126,
  });

  const handleTestQuery = (queryToTest: string) => {
    const q = queryToTest.trim();
    if (!q) return;

    const queryEmb = generateEmbeddingVector(q);

    let bestMatch: CachedItem | null = null;
    let maxSim = -1;

    cacheItems.forEach((item) => {
      const sim = calculateCosineSimilarity(queryEmb.vector, item.vector);
      if (sim > maxSim) {
        maxSim = sim;
        bestMatch = item;
      }
    });

    const isHit = maxSim >= similarityThreshold;

    if (isHit && bestMatch) {
      // Update cache hits
      setCacheItems((prev) =>
        prev.map((item) =>
          item.id === (bestMatch as CachedItem).id ? { ...item, hits: item.hits + 1 } : item
        )
      );

      const latencySaved = 880;
      const costSaved = (420 / 1_000_000) * modelRatePerMToken;

      setLastResult({
        isHit: true,
        matchedItem: bestMatch,
        similarity: maxSim,
        latencySavedMs: latencySaved,
        costSavedDollar: costSaved,
      });

      setMetrics((prev) => ({
        totalRequests: prev.totalRequests + 1,
        cacheHits: prev.cacheHits + 1,
        totalLatencySavedMs: prev.totalLatencySavedMs + latencySaved,
        totalCostSaved: Number((prev.totalCostSaved + costSaved).toFixed(4)),
      }));
    } else {
      // Cache Miss: Add to cache
      const newItem: CachedItem = {
        id: `c-${Date.now()}`,
        query: q,
        response: `[Generated LLM response for: "${q}"] Đã được sinh và tự động lưu vào Semantic Cache.`,
        vector: queryEmb.vector,
        x: queryEmb.x,
        y: queryEmb.y,
        hits: 1,
      };

      setCacheItems((prev) => [newItem, ...prev]);

      setLastResult({
        isHit: false,
        similarity: maxSim > 0 ? maxSim : 0,
        latencySavedMs: 0,
        costSavedDollar: 0,
      });

      setMetrics((prev) => ({
        ...prev,
        totalRequests: prev.totalRequests + 1,
      }));
    }
  };

  const hitRate = metrics.totalRequests > 0
    ? ((metrics.cacheHits / metrics.totalRequests) * 100).toFixed(1)
    : '0';

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#09090b]">
      {/* ============================================================== */}
      {/* CỘT TRÁI: CẤU HÌNH SEMANTIC CACHE & TEST TRUY VẤN (430px)      */}
      {/* ============================================================== */}
      <div className="w-[430px] shrink-0 border-r border-neutral-800 flex flex-col h-full bg-[#0c0c0e]">
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Semantic Cache & FinOps Cost
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            {cacheItems.length} cached keys
          </span>
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Threshold slider */}
          <div className="border border-neutral-800 bg-[#121215] p-3 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-semibold">Ngưỡng tương đồng (Threshold τ):</span>
              <span className="text-amber-400 font-bold text-sm">{similarityThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.70"
              max="0.98"
              step="0.01"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1 bg-neutral-800 appearance-none"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>0.70 (Chấp nhận paraphrase rộng)</span>
              <span>0.98 (Khắt khe gần như tuyệt đối)</span>
            </div>
          </div>

          {/* Model pricing selector */}
          <div className="border border-neutral-800 bg-[#121215] p-3 space-y-2">
            <div className="text-[11px] font-semibold text-neutral-300 uppercase font-mono">
              Bảng giá Model LLM ($ / 1M Tokens):
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { name: 'GPT-4o ($5.00/M)', rate: 5.0 },
                { name: 'Claude Sonnet ($3.00/M)', rate: 3.0 },
                { name: 'Gemini Flash ($0.15/M)', rate: 0.15 },
                { name: 'Local Ollama ($0.00)', rate: 0.0 },
              ].map((m) => (
                <button
                  key={m.name}
                  onClick={() => setModelRatePerMToken(m.rate)}
                  className={`px-2.5 py-1.5 border text-left transition-colors ${
                    modelRatePerMToken === m.rate
                      ? 'border-amber-500/80 bg-amber-950/30 text-amber-200'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Test Query Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
              <span>Thử nghiệm truy vấn:</span>
            </div>

            <textarea
              rows={3}
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              className="w-full bg-[#121215] border border-neutral-800 p-2.5 text-xs text-neutral-200 font-mono focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
              placeholder="Nhập câu hỏi test..."
            />

            <button
              onClick={() => handleTestQuery(testQuery)}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              Gửi truy vấn vào Semantic Cache
            </button>
          </div>

          {/* Query variations presets */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-neutral-500 font-mono uppercase">
              Mẫu kiểm thử tương đồng ngữ nghĩa:
            </div>
            {[
              {
                label: 'Deploy Docker (Paraphrase -> HIT)',
                text: 'Hướng dẫn triển khai container trên Docker server',
              },
              {
                label: 'Tối ưu SQL (Paraphrase -> HIT)',
                text: 'Làm thế nào để tăng tốc query SQL và index PostgreSQL?',
              },
              {
                label: 'Truy vấn hoàn toàn mới (-> MISS)',
                text: 'Cách cấu hình Kubernetes Ingress controller với Traefik?',
              },
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTestQuery(preset.text);
                  handleTestQuery(preset.text);
                }}
                className="w-full text-left p-2 border border-neutral-800/80 bg-neutral-900 hover:border-neutral-700 text-xs text-neutral-300 font-mono transition-colors"
              >
                <div className="text-[10px] text-amber-400 font-semibold">{preset.label}</div>
                <div className="text-[11px] text-neutral-400 truncate mt-0.5">"{preset.text}"</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CỘT PHẢI: KẾT QUẢ HIT/MISS, WATERFALL & CLUSTER VISUALIZER      */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col h-full bg-[#09090b] overflow-hidden">
        {/* Right Top Status Bar */}
        <div className="h-11 border-b border-neutral-800 px-4 flex items-center justify-between bg-[#0e0e11] shrink-0 font-mono text-xs">
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Total Requests: <strong className="text-neutral-100">{metrics.totalRequests}</strong></span>
            <span className="text-neutral-400">Hit Rate: <strong className="text-emerald-400">{hitRate}%</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Thời gian tiết kiệm: <strong className="text-blue-400">{(metrics.totalLatencySavedMs / 1000).toFixed(1)}s</strong></span>
            <span className="text-neutral-400">Chi phí tiết kiệm: <strong className="text-emerald-400">${metrics.totalCostSaved.toFixed(3)}</strong></span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Last Result Alert Box */}
          {lastResult && (
            <div
              className={`p-4 border font-mono text-xs ${
                lastResult.isHit
                  ? 'bg-emerald-950/20 border-emerald-800 text-emerald-200'
                  : 'bg-amber-950/20 border-amber-800 text-amber-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {lastResult.isHit ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      CACHE HIT! (Độ tương đồng: {lastResult.similarity.toFixed(4)} &ge; {similarityThreshold})
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      CACHE MISS! (Độ tương đồng: {lastResult.similarity.toFixed(4)} &lt; {similarityThreshold})
                    </>
                  )}
                </div>

                {lastResult.isHit && (
                  <div className="text-[11px] text-emerald-300 font-semibold">
                    Tiết kiệm 880ms & {((420 / 1_000_000) * modelRatePerMToken * 100).toFixed(4)}¢
                  </div>
                )}
              </div>

              {lastResult.isHit && lastResult.matchedItem && (
                <div className="bg-neutral-950/80 p-3 border border-neutral-800/80 space-y-1.5 mt-2">
                  <div className="text-neutral-400 text-[11px]">
                    Khớp với khóa cache: <span className="text-neutral-200 font-semibold">"{lastResult.matchedItem.query}"</span>
                  </div>
                  <div className="text-neutral-300 font-sans text-xs">
                    Phản hồi trả về ngay lập tức: "{lastResult.matchedItem.response}"
                  </div>
                </div>
              )}

              {!lastResult.isHit && (
                <p className="text-neutral-400 text-[11px]">
                  Truy vấn được chuyển tiếp tới LLM để suy luận (880ms latency). Kết quả đã được tự động lưu vào bộ nhớ đệm cho các truy vấn kế tiếp.
                </p>
              )}
            </div>
          )}

          {/* Latency Waterfall Comparison */}
          <div className="border border-neutral-800 bg-[#121215] p-4 space-y-4">
            <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              So sánh độ trễ (Latency Waterfall)
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {/* LLM Direct Call */}
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Trực tiếp gọi LLM Model (Inference Roundtrip)</span>
                  <span className="text-red-400 font-bold">~880 ms</span>
                </div>
                <div className="h-5 w-full bg-neutral-900 overflow-hidden">
                  <div className="h-full bg-red-600/80 w-[95%] flex items-center px-2 text-[10px] text-white">
                    880ms (Mạng + Khởi tạo context + Sinh token)
                  </div>
                </div>
              </div>

              {/* Semantic Cache Hit */}
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Semantic Cache Hit (Redis Vector Search)</span>
                  <span className="text-emerald-400 font-bold">~14 ms (Nhanh hơn 98.4%)</span>
                </div>
                <div className="h-5 w-full bg-neutral-900 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[8%] flex items-center px-1 text-[10px] text-black font-bold">
                    14ms
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cache Registry Table */}
          <div className="border border-neutral-800 bg-[#121215] flex flex-col">
            <div className="p-3 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-200 font-mono uppercase">
                Danh sách Vector Keys trong Cache ({cacheItems.length})
              </span>
              <span className="text-[11px] font-mono text-neutral-400">Storage: In-Memory Redis</span>
            </div>

            <div className="divide-y divide-neutral-800/60 overflow-x-auto">
              {cacheItems.map((item) => (
                <div key={item.id} className="p-3 hover:bg-neutral-900/40 transition-colors font-mono text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-neutral-200">{item.query}</span>
                    <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/40 px-2 py-0.5 border border-emerald-900/60">
                      {item.hits} Hits
                    </span>
                  </div>
                  <p className="font-sans text-xs text-neutral-400 line-clamp-1">
                    {item.response}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

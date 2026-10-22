import { ChunkItem, DocumentPreset, QueryVector } from '../types';

export const DOCUMENT_PRESETS: DocumentPreset[] = [
  {
    id: 'sre-runbook',
    name: 'SRE Incident Runbook',
    description: 'Quy trình xử lý sự cố P1 cơ sở dữ liệu và chuyển vùng dự phòng High Availability',
    content: `[RUNBOOK SRE-409: Database Primary Failover & Cluster Recovery]
1. Mục tiêu và phạm vi:
Tài liệu hướng dẫn trực ca SRE ứng phó khi cụm PostgreSQL Primary ngừng phản hồi quá 15 giây hoặc tỉ lệ lỗi kết nối vượt quá 5% trên toàn bộ API Gateway.

2. Tiêu chuẩn cảnh báo P1:
- Prometheus alert: "PgPrimaryDown" hoặc "ReplicationLagSec > 120".
- Trực ca cần lập tức mở kênh Discord #incident-war-room và gắn nhãn P1-Database.

3. Các bước kiểm tra nhanh ban đầu:
- Kiểm tra tài nguyên node: kubectl top nodes -l role=db-primary
- Kiểm tra trạng thái Patroni: patronictl -c /etc/patroni/db.yml topology
- Xác minh xem WAL log có bị nghẽn đĩa không: df -h /var/lib/postgresql/data

4. Quy trình chuyển mạch dự phòng (Failover):
- Trường hợp 1: Tự động chuyển mạch qua Patroni với etcd quorum.
  Nếu Leader key hết hạn, Standby có LSN gần nhất sẽ tự động nhận quyền Primary.
- Trường hợp 2: Chuyển mạch cưỡng bức thủ công (Manual Force Failover):
  Chạy lệnh: patronictl -c /etc/patroni/db.yml failover --candidate pg-replica-02 --force
  Kiểm tra kết nối read-write sau khi promote trong vòng 45 giây.

5. Cập nhật Connection Pooler:
- Khởi động lại PgBouncer pool để dọn dẹp các socket treo:
  systemctl reload pgbouncer
- Xác nhận DNS nội bộ pg-master.internal trỏ về IP của pg-replica-02 mới.`
  },
  {
    id: 'fintech-security',
    name: 'Quy chế bảo mật Fintech',
    description: 'Tiêu chuẩn bảo mật dữ liệu thẻ PCI-DSS v4.0 và mã hóa lưu trữ token khách hàng',
    content: `[TIÊU CHUẨN AN TOÀN THÔNG TIN TÀI CHÍNH & PCI-DSS V4.0]
Chương I: Nguyên tắc phân loại và mã hóa dữ liệu nhạy cảm
1. Dữ liệu xác thực cá nhân (PIN, CVV/CVC, mật khẩu):
Tuyệt đối không được lưu trữ dưới mọi hình thức sau khi hoàn tất giao dịch ủy quyền (authorization). Không cho phép ghi vào file log ứng dụng, crash dump hay tracing headers.

2. Số thẻ thanh toán chính (Primary Account Number - PAN):
- Bắt buộc phải được mã hóa ở mức lưu trữ (Encryption at Rest) bằng thuật toán AES-256-GCM.
- Khóa mã hóa Data Encryption Key (DEK) phải được quản lý bởi phần cứng HSM (Hardware Security Module) hoặc AWS KMS chuyên dụng.
- Master Key (KEK) phải tự động xoay vòng định kỳ mỗi 90 ngày.

Chương II: Kiểm soát truy cập và phân quyền tối thiểu (PoLP)
1. Xác thực đa yếu tố (MFA):
Tất cả các truy cập vào môi trường Production, CSDL thanh toán hoặc VPN nội bộ đều bắt buộc áp dụng MFA chuẩn FIDO2 WebAuthn hoặc TOTP dựa trên phần cứng.

2. Audit Trail và giám sát truy vết:
Mọi truy vấn giải mã PAN phải phát sinh bản ghi kiểm toán bất biến (Immutable Audit Log) được đẩy trực tiếp vào SIEM qua giao thức TLS mutual authentication. Lưu trữ tối thiểu 365 ngày.`
  },
  {
    id: 'multi-agent-arch',
    name: 'Kiến trúc Multi-Agent Enterprise',
    description: 'Thiết kế hệ thống đa tác tử với StateGraph, Router và Human-In-The-Loop',
    content: `[ENTERPRISE AI ARCHITECTURE: Multi-Agent Orchestration with LangGraph]
1. Mô hình điều phối phân tầng (Hierarchical Supervisor):
Hệ thống sử dụng một Agent Giám Sát (Supervisor Agent) để phân rã nhiệm vụ phức tạp thành các bước nhỏ và ủy quyền cho các Worker chuyên trách:
- Worker Research: Thực thi RAG tìm kiếm tài liệu nội bộ và tổng hợp tri thức.
- Worker CodeGen: Sinh mã nguồn và chạy kiểm thử tự động trong môi trường sandbox Docker.
- Worker Critic: Đánh giá độ tin cậy, kiểm tra hallucination và đối chiếu với guideline công ty.

2. Quản lý trạng thái phân tán (Shared State Channel):
Trạng thái được mô hình hóa qua TypedDict với các reducer xác định rõ cách sáp nhập dữ liệu (Operator.add cho danh sách messages, replace cho biến cờ flag).

3. Điểm dừng phê duyệt con người (Human-in-the-Loop Interruption):
Đối với các hành động tác động ra thế giới thực (ghi CSDL, gửi email khách hàng, gọi API thanh toán), đồ thị sẽ kích hoạt state.interrupt() để tạm dừng và chờ tín hiệu xác nhận từ dashboard admin.`
  }
];

// Simple deterministic hash to seed pseudo-random or consistent features
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate realistic 16-dimensional embedding and 2D projection
export function generateEmbeddingVector(text: string): { vector: number[]; x: number; y: number } {
  const lower = text.toLowerCase();
  const vector: number[] = new Array(16).fill(0);

  // Semantic keyword clusters
  const clusters = [
    { words: ['sre', 'failover', 'patroni', 'cluster', 'primary', 'postgresql', 'leader', 'down'], dim: 0, xBias: -0.7, yBias: 0.6 },
    { words: ['incident', 'alert', 'prometheus', 'p1', 'cảnh báo', 'lỗi', 'socket', 'war-room'], dim: 2, xBias: -0.5, yBias: -0.6 },
    { words: ['pci-dss', 'bảo mật', 'mã hóa', 'thẻ', 'pan', 'cvv', 'aes', 'hsm', 'key', 'dek'], dim: 4, xBias: 0.6, yBias: 0.7 },
    { words: ['mfa', 'audit', 'siem', 'truy cập', 'fido2', 'tls', 'giám sát', 'quản lý'], dim: 6, xBias: 0.7, yBias: -0.5 },
    { words: ['agent', 'langgraph', 'supervisor', 'worker', 'orchestration', 'state', 'stategraph'], dim: 8, xBias: 0.1, yBias: -0.7 },
    { words: ['human', 'tool', 'codegen', 'critic', 'interrupt', 'sandbox', 'phê duyệt', 'research'], dim: 10, xBias: -0.2, yBias: -0.4 },
    { words: ['lệnh', 'runbook', 'kubectl', 'pgbouncer', 'restart', 'reload', 'dns'], dim: 12, xBias: -0.6, yBias: 0.1 },
    { words: ['dữ liệu', 'lưu trữ', 'hệ thống', 'quy trình', 'thực thi', 'bước', 'kết nối'], dim: 14, xBias: 0.0, yBias: 0.0 },
  ];

  let rawX = 0;
  let rawY = 0;
  let totalWeight = 0;

  clusters.forEach((c) => {
    let matchCount = 0;
    c.words.forEach((w) => {
      if (lower.includes(w)) matchCount += 1.5;
    });
    if (matchCount > 0) {
      vector[c.dim] += matchCount;
      vector[c.dim + 1] += matchCount * 0.8;
      rawX += c.xBias * matchCount;
      rawY += c.yBias * matchCount;
      totalWeight += matchCount;
    }
  });

  // Base background distribution derived from n-grams
  for (let i = 0; i < 16; i++) {
    const seed = hashString(text.slice(0, 40) + `_${i}`);
    const noise = ((seed % 100) / 100) * 0.4;
    vector[i] += noise;
  }

  // Normalize 16D vector to unit norm (L2 = 1.0)
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
  const normalizedVector = vector.map((v) => Number((v / norm).toFixed(4)));

  // Determine 2D coordinates
  let x = totalWeight > 0 ? rawX / totalWeight : 0;
  let y = totalWeight > 0 ? rawY / totalWeight : 0;

  // Add deterministic scatter jitter so chunks don't land exactly on top of each other
  const h = hashString(text);
  const jitterX = (((h % 200) - 100) / 100) * 0.22;
  const jitterY = ((((h >> 4) % 200) - 100) / 100) * 0.22;

  x = Math.max(-0.88, Math.min(0.88, x + jitterX));
  y = Math.max(-0.88, Math.min(0.88, y + jitterY));

  return {
    vector: normalizedVector,
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3)),
  };
}

// Interactive text chunking algorithm with exact character boundary tracking
export function chunkTextWithOverlap(
  text: string,
  chunkSize: number,
  chunkOverlap: number
): ChunkItem[] {
  if (!text || text.trim().length === 0) return [];

  // Guarantee step > 0
  const effectiveOverlap = Math.min(chunkOverlap, Math.max(0, chunkSize - 10));
  const step = Math.max(10, chunkSize - effectiveOverlap);

  const chunks: ChunkItem[] = [];
  let start = 0;
  let id = 1;

  while (start < text.length) {
    const end = Math.min(text.length, start + chunkSize);
    const chunkStr = text.slice(start, end);

    // Approximate token count (roughly 3.8 chars per token for VI/EN mix)
    const tokens = Math.max(1, Math.round(chunkStr.length / 3.8));

    // Overlap boundaries relative to document
    const overlapStart = start > 0 ? start : undefined;
    const overlapEnd = start > 0 ? Math.min(start + effectiveOverlap, text.length) : undefined;

    const embedding = generateEmbeddingVector(chunkStr);

    chunks.push({
      id,
      text: chunkStr,
      charStart: start,
      charEnd: end,
      overlapStart,
      overlapEnd,
      tokens,
      x: embedding.x,
      y: embedding.y,
      vector: embedding.vector,
    });

    id++;
    start += step;

    // Prevent single trailing tiny chunk if it's already covered
    if (start >= text.length || (end === text.length && chunks.length > 1 && chunkStr.length < 20)) {
      break;
    }
  }

  return chunks;
}

// Compute exact Cosine Similarity: (u . v) / (||u|| * ||v||)
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.max(0, Math.min(1, Number(similarity.toFixed(4))));
}

// Lexical BM25 calculation
export function calculateBM25Scores(query: string, chunks: ChunkItem[]): number[] {
  if (!query.trim() || chunks.length === 0) return chunks.map(() => 0);

  const queryTokens = query
    .toLowerCase()
    .split(/[\s,.;:!?()[\]{}"']+/)
    .filter((t) => t.length > 1);

  if (queryTokens.length === 0) return chunks.map(() => 0);

  const k1 = 1.5;
  const b = 0.75;
  const avgDocLength =
    chunks.reduce((sum, c) => sum + c.text.length, 0) / (chunks.length || 1);

  // Compute IDF for each query term
  const idfMap: Record<string, number> = {};
  queryTokens.forEach((token) => {
    const docCountWithToken = chunks.filter((c) =>
      c.text.toLowerCase().includes(token)
    ).length;
    // Standard Lucene / BM25 IDF formula
    const idf = Math.log(
      1 + (chunks.length - docCountWithToken + 0.5) / (docCountWithToken + 0.5)
    );
    idfMap[token] = Math.max(0.1, idf);
  });

  return chunks.map((c) => {
    const docLower = c.text.toLowerCase();
    const docLen = c.text.length;
    let score = 0;

    queryTokens.forEach((token) => {
      // Count frequency in chunk
      let count = 0;
      let pos = 0;
      while ((pos = docLower.indexOf(token, pos)) !== -1) {
        count++;
        pos += token.length;
      }

      if (count > 0) {
        const tf = count;
        const idf = idfMap[token] || 0.1;
        const numerator = tf * (k1 + 1);
        const denominator = tf + k1 * (1 - b + b * (docLen / avgDocLength));
        score += idf * (numerator / denominator);
      }
    });

    return Number(score.toFixed(3));
  });
}

// Reciprocal Rank Fusion: RRF = 1 / (k + rank_sparse) + 1 / (k + rank_dense) with k=60
export function computeRRF(
  chunks: ChunkItem[],
  query: string,
  kConstant: number = 60
): ChunkItem[] {
  if (chunks.length === 0) return [];

  // 1. Calculate BM25 scores
  const bm25Scores = calculateBM25Scores(query, chunks);

  // 2. Clone chunks with scores
  const processed = chunks.map((chunk, idx) => ({
    ...chunk,
    bm25Score: bm25Scores[idx] || 0,
    cosineScore: chunk.cosineScore ?? 0,
  }));

  // 3. Dense ranking (highest cosine score first)
  const sortedDense = [...processed].sort(
    (a, b) => (b.cosineScore || 0) - (a.cosineScore || 0)
  );
  const denseRankMap = new Map<number, number>();
  sortedDense.forEach((item, index) => {
    denseRankMap.set(item.id, index + 1);
  });

  // 4. Sparse ranking (highest BM25 score first)
  const sortedSparse = [...processed].sort(
    (a, b) => (b.bm25Score || 0) - (a.bm25Score || 0)
  );
  const sparseRankMap = new Map<number, number>();
  sortedSparse.forEach((item, index) => {
    sparseRankMap.set(item.id, index + 1);
  });

  // 5. Compute RRF scores
  const scoredChunks = processed.map((chunk) => {
    const denseRank = denseRankMap.get(chunk.id) || processed.length;
    const sparseRank = sparseRankMap.get(chunk.id) || processed.length;

    const denseRrf = 1 / (kConstant + denseRank);
    const sparseRrf = 1 / (kConstant + sparseRank);
    const rrfScore = Number((denseRrf + sparseRrf).toFixed(5));

    return {
      ...chunk,
      denseRank,
      sparseRank,
      rrfScore,
    };
  });

  // 6. Sort by final RRF score descending
  scoredChunks.sort((a, b) => (b.rrfScore || 0) - (a.rrfScore || 0));

  return scoredChunks.map((chunk, idx) => ({
    ...chunk,
    finalRank: idx + 1,
  }));
}

export type TabType = 'rag' | 'langgraph' | 'cache' | 'security' | 'jsonlab';

export interface ChunkItem {
  id: number;
  text: string;
  charStart: number;
  charEnd: number;
  overlapStart?: number;
  overlapEnd?: number;
  tokens: number;
  // 2D projected coordinates in [-1, 1]
  x: number;
  y: number;
  // High-dimensional vector simulation for true cosine math
  vector: number[];
  // Computed scores when query is active
  cosineScore?: number;
  bm25Score?: number;
  rrfScore?: number;
  denseRank?: number;
  sparseRank?: number;
  finalRank?: number;
}

export interface QueryVector {
  text: string;
  x: number;
  y: number;
  vector: number[];
}

export interface DocumentPreset {
  id: string;
  name: string;
  description: string;
  content: string;
}

// LangGraph types
export type NodeStatus = 'idle' | 'running' | 'completed' | 'error' | 'skipped';

export interface GraphNode {
  id: string;
  label: string;
  type: 'start' | 'router' | 'agent' | 'tool' | 'evaluator' | 'human' | 'end';
  x: number;
  y: number;
  status: NodeStatus;
  description: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  conditional?: boolean;
  active?: boolean;
}

export interface AgentState {
  currentStep: string;
  query: string;
  plan: string[];
  retrievedDocs: number;
  toolOutput: string;
  iterations: number;
  confidence: number;
  needsEscalation: boolean;
  history: string[];
}

// Semantic Cache types
export interface CacheEntry {
  id: string;
  query: string;
  response: string;
  x: number;
  y: number;
  vector: number[];
  tokens: number;
  hits: number;
  createdAt: string;
}

// AI Security Firewall types
export type ThreatLevel = 'safe' | 'low' | 'medium' | 'critical';

export interface SecurityScanResult {
  allowed: boolean;
  threatLevel: ThreatLevel;
  injectionScore: number; // 0 - 1
  jailbreakScore: number; // 0 - 1
  piiDetected: Array<{ type: string; value: string; masked: string }>;
  canaryTriggered: boolean;
  flaggedTokens: Array<{ text: string; risk: 'safe' | 'pii' | 'injection' }>;
  sanitizedPrompt: string;
  violations: string[];
}

// Self-Healing JSON types
export interface JsonRepairStep {
  step: number;
  title: string;
  description: string;
  status: 'passed' | 'repaired' | 'skipped' | 'failed';
}

export interface JsonRepairResult {
  valid: boolean;
  originalText: string;
  repairedText: string;
  steps: JsonRepairStep[];
  errorsFound: string[];
  durationMs: number;
  parsedObject: unknown;
}

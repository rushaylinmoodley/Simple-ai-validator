export interface SecurityCheckResult {
  id: string;
  name: string;
  category: string;
  status: 'PASS' | 'FAIL' | 'WARN' | 'SKIPPED';
  details: string;
  latencyMs: number;
}

export interface ValidationResponse {
  decision: 'ACCEPTED' | 'REJECTED';
  riskScore: number;
  summaryReason: string;
  totalLatencyMs: number;
  logId: string;
  checks: SecurityCheckResult[];
  metadata: {
    filename: string;
    mimeType: string;
    sizeKb: string;
    timestamp: string;
  };
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  decision: 'ACCEPTED' | 'REJECTED';
  riskScore: number;
  checksPassed: number;
  checksTotal: number;
  clientIp: string;
  aiAnalyzed: boolean;
  summaryReason: string;
  checks: SecurityCheckResult[];
}

export interface PushPreset {
  id: string;
  name: string;
  category: 'Clean' | 'Malicious' | 'Malformed' | 'Auth Issue';
  filename: string;
  mimeType: string;
  description: string;
  content: string;
  headers: Record<string, string>;
  expectedResult: 'ACCEPTED' | 'REJECTED';
}

export interface RuleConfig {
  maxSizeMb: number;
  requireHmac: boolean;
  hmacSecret: string;
  timestampWindowSec: number;
  strictMime: boolean;
  enableAiScan: boolean;
  requireSchema: boolean;
  expectedFields: string;
}

export interface SecurityCheckDef {
  id: string;
  name: string;
  category: 'Integrity' | 'Security' | 'Format' | 'Schema' | 'Auth' | 'AI Security';
  mechanism: 'Deterministic' | 'AI Agent' | 'Hybrid';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  passCriteria: string;
}

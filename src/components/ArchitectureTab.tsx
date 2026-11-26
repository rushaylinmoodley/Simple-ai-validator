import React, { useState } from 'react';
import {
  Network,
  ShieldAlert,
  Cpu,
  Database,
  CheckCircle2,
  Server,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  DollarSign,
  Layers
} from 'lucide-react';

interface ArchComponent {
  id: string;
  number: number;
  title: string;
  icon: React.ElementType;
  role: string;
  plainEnglish: string;
  techStack: string;
  zeroCostAlternative: string;
  securityControls: string[];
}

export const ArchitectureTab: React.FC = () => {
  const [selectedCompId, setSelectedCompId] = useState<string>('agent');

  const components: ArchComponent[] = [
    {
      id: 'source',
      number: 1,
      title: 'Source System',
      icon: Server,
      role: 'External Push File Originator',
      plainEnglish: 'The external partner, client app, or automated pipeline sending a file update (e.g. ERP inventory update, CSV log batch, or JSON payload).',
      techStack: 'cURL, Python Requests, WebHook Trigger, Postman',
      zeroCostAlternative: 'Standard HTTP/S Client (Built into any OS or framework)',
      securityControls: [
        'TLS 1.3 Transport Encryption',
        'HMAC SHA-256 Request Signing Header',
        'Epoch Timestamp Nonce'
      ]
    },
    {
      id: 'gateway',
      number: 2,
      title: 'API Gateway',
      icon: Lock,
      role: 'Edge Protection & Auth Verification',
      plainEnglish: 'The front door of your endpoint. It checks that the sender is authorized, verifies the digital signature header, and enforces rate limits so your server is never overwhelmed.',
      techStack: 'FastAPI Middleware, NGINX, Kong (Community Edition)',
      zeroCostAlternative: 'NGINX Open Source / FastAPI In-Memory Rate Limiter',
      securityControls: [
        'Rate Limiting & IP Sliding Window',
        'HMAC-SHA256 Constant-Time Key Verification',
        'Timestamp Staleness Replay Prevention (<300s)'
      ]
    },
    {
      id: 'agent',
      number: 3,
      title: 'AI Validation Agent',
      icon: Cpu,
      role: 'Antigravity Intelligence Core',
      plainEnglish: 'The AI brain running within Antigravity or a local Docker container. It reads the file content and evaluates whether there are hidden threats, prompt injections, or suspicious data patterns that traditional rules might miss.',
      techStack: 'Antigravity Agent Runtime, Ollama (Llama 3.2 3B), Gemini 3.6 Flash API',
      zeroCostAlternative: 'Ollama with Llama 3.2 / DeepSeek-R1 Distill (100% Free Local)',
      securityControls: [
        'Indirect Prompt Injection Defense',
        'Obfuscated Trojan & Base64 Payload Detection',
        'Semantic Anomaly & Fraud Pattern Scanning'
      ]
    },
    {
      id: 'engine',
      number: 4,
      title: 'Validation Engine',
      icon: Layers,
      role: 'Deterministic Rule & Format Checker',
      plainEnglish: 'The fast, hard-coded checker that inspects file size limits, verifies schema formatting (JSON/CSV/XML), sanitizes file names for path traversal, and scans for viruses.',
      techStack: 'Python Pydantic, ClamAV Daemon, Regex Heuristics',
      zeroCostAlternative: 'Python Pydantic + ClamAV Open Source Socket Engine',
      securityControls: [
        'Path Traversal & Null Byte Sanitization',
        'ClamAV Antivirus Daemon Stream Scan',
        'Pydantic Schema & Type Verification',
        'XXE (XML External Entity) Disabling'
      ]
    },
    {
      id: 'audit',
      number: 5,
      title: 'Logging & Audit DB',
      icon: Database,
      role: 'Immutable Security Telemetry',
      plainEnglish: 'A tamper-resistant logbook that records every incoming push attempt—whether it passed or failed—along with the risk score, check latency, and timestamp for auditing.',
      techStack: 'SQLite3, JSON Log Stream, PostgreSQL',
      zeroCostAlternative: 'SQLite3 (Built into Python - Zero Cost)',
      securityControls: [
        'Structured Immutable Log Records',
        'Risk Score & Threat Attribution Tracking',
        'Compliance Audit Reporting Export'
      ]
    },
    {
      id: 'decision',
      number: 6,
      title: 'Accept / Reject Decision Engine',
      icon: ShieldAlert,
      role: 'Traffic Gatekeeper',
      plainEnglish: 'Combines results from both the hard rules and the AI agent to make a clear final decision: ACCEPT the file (200 OK) or REJECT it with a detailed explanation (422 Unprocessable Entity).',
      techStack: 'FastAPI Response Gateway, JSON Schema',
      zeroCostAlternative: 'FastAPI Async Router',
      securityControls: [
        'Fail-Closed Security Posture',
        'Detailed Non-Leaking Error Feedback',
        'Real-time Threat Score Aggregation'
      ]
    },
    {
      id: 'target',
      number: 7,
      title: 'Target Endpoint',
      icon: CheckCircle2,
      role: 'Clean Data Consumer',
      plainEnglish: 'Your actual database or application logic. Because the AI Agent sits in front of it, only verified, clean, and safe files ever reach this endpoint.',
      techStack: 'Internal Microservice, Database, S3 Bucket',
      zeroCostAlternative: 'Local Storage / Internal Database',
      securityControls: [
        'Zero-Trust Network Isolation',
        'Sanitized Payload Injection Prevention',
        'Resource Exhaustion Protection'
      ]
    }
  ];

  const activeComp = components.find(c => c.id === selectedCompId) || components[2];

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Network className="w-6 h-6 text-emerald-400" />
              <span>Antigravity AI Push Validation Architecture</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              A lightweight, zero-operating-cost architecture designed to run seamlessly inside Antigravity or local container environments. It enforces a strict <strong className="text-emerald-400 font-semibold">Zero-Trust inline inspection pipeline</strong> before any push file reaches your target database or service.
            </p>
          </div>

          <div className="hidden md:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>$0.00 Operating Cost</span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Flow Pipeline Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Interactive End-to-End File Validation Pipeline (Click Component to Inspect Details)</span>
        </h3>

        {/* Visual Pipeline Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {components.map((comp) => {
            const Icon = comp.icon;
            const isSelected = comp.id === selectedCompId;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedCompId(comp.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-36 group ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-500/20 to-slate-900 border-emerald-400 text-slate-100 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold font-mono ${
                    isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {comp.number}
                  </span>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                </div>

                <div>
                  <div className="font-bold text-xs line-clamp-1 text-slate-100">{comp.title}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{comp.role}</div>
                </div>

                <div className="text-[9px] font-mono text-emerald-400/80 truncate">
                  {comp.techStack.split(',')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Component Plain English & Technical Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <activeComp.icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                COMPONENT {activeComp.number} OF 7
              </span>
              <h3 className="text-lg font-bold text-slate-100">{activeComp.title}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{activeComp.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Plain English Explanation */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Plain English Explanation (For Non-Technical Users)</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {activeComp.plainEnglish}
            </p>
          </div>

          {/* Technology & Zero-Cost Tools */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>Recommended Open-Source Tech Stack</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 font-medium">Standard Tech: </span>
                <span className="font-mono text-emerald-300">{activeComp.techStack}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">100% Free Alternative: </span>
                <span className="font-mono text-cyan-300">{activeComp.zeroCostAlternative}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Security Controls & Enforcement */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Key Security Controls Enforced at this Stage</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeComp.securityControls.map((ctrl, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-xs text-slate-200 flex items-start space-x-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{ctrl}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

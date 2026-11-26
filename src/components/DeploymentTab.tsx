import React from 'react';
import { Terminal, Shield, AlertTriangle, Sparkles, CheckCircle2, Box, Cpu, Lock, ArrowUpRight } from 'lucide-react';

export const DeploymentTab: React.FC = () => {
  const freeTools = [
    { name: 'Python 3.11+', role: 'Core Runtime', cost: '100% Free / Open Source', desc: 'Standard high-level programming environment.' },
    { name: 'FastAPI', role: 'API Framework', cost: '100% Free / Open Source', desc: 'Asynchronous, high-performance web framework with auto OpenAPI docs.' },
    { name: 'Pydantic v2', role: 'Schema & Data Validation', cost: '100% Free / Open Source', desc: 'Data parsing, strict type checking, and schema enforcement.' },
    { name: 'Ollama / Llama 3.2', role: 'Local AI Agent Model', cost: '100% Free / Self-Hosted', desc: 'Runs LLM locally on CPU/GPU without recurring token API fees.' },
    { name: 'ClamAV', role: 'Malware Engine', cost: '100% Free / Open Source', desc: 'De-facto open-source antivirus engine daemon for stream scanning.' },
    { name: 'SQLite3', role: 'Audit Store', cost: '100% Free / Embedded', desc: 'Zero-configuration, serverless SQL database engine.' },
    { name: 'Docker / Compose', role: 'Container Orchestration', cost: '100% Free / Open Source', desc: 'Single-command container deployment for Antigravity runners.' },
  ];

  const bestPractices = [
    { title: 'Fail-Closed Security Posture', desc: 'If any critical check or AI model call fails or times out, default to REJECT to ensure malformed files never reach data sinks.' },
    { title: 'Constant-Time Signature Comparisons', desc: 'Always use hmac.compare_digest() when validating X-Signature headers to prevent side-channel timing attacks.' },
    { title: 'Strict Replay Window Enforcements', desc: 'Reject push payloads where X-Timestamp drifts by more than 300 seconds from server UTC clock.' },
    { title: 'Isolated Container Sandbox', desc: 'Run the validation agent inside an isolated container with minimal permissions to prevent container breakout.' },
  ];

  const limitations = [
    { title: 'LLM Inference Latency Trade-Off', desc: 'Local CPU model inference (e.g., Llama 3.2 via Ollama) adds 200–500ms latency per push request compared to deterministic rule checks (<5ms).' },
    { title: 'Deep Binary Polymorphism Limits', desc: 'Text-focused LLMs evaluate structured data and code; deep binary static analysis still relies on dedicated signatures (ClamAV).' },
    { title: 'Hallucination & False Positives', desc: 'Generative models may occasionally flag unusual valid domain syntax as suspicious, requiring configurable confidence thresholds.' },
  ];

  const futureEnhancements = [
    { title: 'Async Worker Task Queue (Celery / Redis)', desc: 'Offload heavy file validation scans (>10MB) to background workers while returning immediate status callback tickets.' },
    { title: 'WebHook Alert Notifications (Slack / Discord / PagerDuty)', desc: 'Trigger instant alerts when repeated high-risk prompt injection or malware push attempts are detected.' },
    { title: 'Adaptive Dynamic Rate Limiting', desc: 'Automatically lower rate limits or trigger CAPTCHA challenges for IPs exhibiting high check failure rates.' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Terminal className="w-6 h-6 text-emerald-400" />
          <span>Antigravity Deployment, Security & Tools Matrix</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Comprehensive guide for running the AI Validation Agent inside Antigravity with zero recurring operating costs.
        </p>
      </div>

      {/* Deployment Guide Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Box className="w-4 h-4 text-cyan-400" />
          <span>Antigravity Agent Deployment Instructions</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-300 font-mono">
          
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 font-sans text-sm">Step 1: Clone & Configure Workspace Environment</div>
            <p className="text-slate-400 font-sans">
              Deploy the FastAPI validation suite into your Antigravity agent runner workspace or container directory:
            </p>
            <pre className="bg-slate-900 p-3 rounded-lg text-emerald-300 overflow-x-auto">
{`git clone https://github.com/your-org/antigravity-push-agent.git
cd antigravity-push-agent
pip install -r requirements.txt`}
            </pre>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 font-sans text-sm">Step 2: Launch Free Local AI Model (Ollama / Llama 3.2)</div>
            <p className="text-slate-400 font-sans">
              To achieve zero operating cost, run Ollama locally inside the container or host node:
            </p>
            <pre className="bg-slate-900 p-3 rounded-lg text-emerald-300 overflow-x-auto">
{`curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:3b
export OLLAMA_HOST="http://localhost:11434"`}
            </pre>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 font-sans text-sm">Step 3: Start Agent Engine via Uvicorn</div>
            <pre className="bg-slate-900 p-3 rounded-lg text-emerald-300 overflow-x-auto">
{`uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4`}
            </pre>
          </div>

        </div>
      </div>

      {/* Recommended Free Tools Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Recommended Free & Open-Source Tools</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {freeTools.map((t) => (
            <div key={t.name} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">{t.name}</span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {t.cost}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-cyan-400">{t.role}</div>
              <p className="text-slate-400 leading-relaxed pt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Security Best Practices & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Security Best Practices */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Security Best Practices</span>
          </h3>

          <div className="space-y-3">
            {bestPractices.map((bp) => (
              <div key={bp.title} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{bp.title}</span>
                </div>
                <p className="text-slate-400 leading-relaxed pl-5">{bp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations & Future Enhancements */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Limitations & Future Roadmap</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="font-bold text-slate-300 text-xs">Current Limitations:</div>
            {limitations.map((l) => (
              <div key={l.title} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <div className="font-semibold text-amber-300">{l.title}</div>
                <p className="text-slate-400 leading-relaxed">{l.desc}</p>
              </div>
            ))}

            <div className="font-bold text-slate-300 text-xs pt-2">Future Enhancements:</div>
            {futureEnhancements.map((fe) => (
              <div key={fe.title} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{fe.title}</span>
                </div>
                <p className="text-slate-400 leading-relaxed">{fe.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

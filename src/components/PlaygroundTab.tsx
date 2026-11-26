import React, { useState } from 'react';
import {
  Play,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Code2,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  FileText,
  Key,
  Database,
  Search,
  Filter
} from 'lucide-react';
import { PUSH_PRESETS } from '../data/presets';
import { PushPreset, RuleConfig, ValidationResponse } from '../types';

interface PlaygroundTabProps {
  config: RuleConfig;
}

export const PlaygroundTab: React.FC<PlaygroundTabProps> = ({ config }) => {
  const [selectedPreset, setSelectedPreset] = useState<PushPreset>(PUSH_PRESETS[0]);
  const [filename, setFilename] = useState(PUSH_PRESETS[0].filename);
  const [mimeType, setMimeType] = useState(PUSH_PRESETS[0].mimeType);
  const [content, setContent] = useState(PUSH_PRESETS[0].content);
  const [headers, setHeaders] = useState<Record<string, string>>(PUSH_PRESETS[0].headers);

  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [activeResultSubTab, setActiveResultSubTab] = useState<'checks' | 'raw_json'>('checks');
  const [checkStatusFilter, setCheckStatusFilter] = useState<string>('ALL');
  const [checkSearchQuery, setCheckSearchQuery] = useState<string>('');
  const [copiedJson, setCopiedJson] = useState(false);

  // Apply a preset
  const handleSelectPreset = (preset: PushPreset) => {
    setSelectedPreset(preset);
    setFilename(preset.filename);
    setMimeType(preset.mimeType);
    setContent(preset.content);

    const nowSec = Math.floor(Date.now() / 1000).toString();
    const updatedHeaders = { ...preset.headers, 'x-timestamp': nowSec };

    setHeaders(updatedHeaders);
    setValidationResult(null);
  };

  // Run validation request against /api/validate endpoint
  const handleRunValidation = async () => {
    setIsLoading(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          mimeType,
          content,
          headers,
          config,
        }),
      });

      const data: ValidationResponse = await response.json();
      setValidationResult(data);
    } catch (err) {
      console.error('Validation request error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto compute HMAC signature helper
  const handleAutoComputeHmac = async () => {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(config.hmacSecret || 'antigravity-secret-key');
      const msgData = encoder.encode(content);

      if (window.crypto && window.crypto.subtle) {
        const cryptoKey = await window.crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );
        const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, msgData);
        const hashArray = Array.from(new Uint8Array(signature));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHeaders(prev => ({ ...prev, 'x-signature': hashHex }));
      }
    } catch {
      // Fallback pseudo hash
      setHeaders(prev => ({ ...prev, 'x-signature': 'a8f93e82910c283478129a' }));
    }
  };

  const handleSetTimestampNow = () => {
    setHeaders(prev => ({ ...prev, 'x-timestamp': Math.floor(Date.now() / 1000).toString() }));
  };

  const handleCopyJson = () => {
    if (!validationResult) return;
    navigator.clipboard.writeText(JSON.stringify(validationResult, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Filtered check list
  const filteredChecks = validationResult?.checks.filter(c => {
    const matchesStatus = checkStatusFilter === 'ALL' || c.status === checkStatusFilter;
    const matchesQuery =
      c.name.toLowerCase().includes(checkSearchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(checkSearchQuery.toLowerCase()) ||
      c.details.toLowerCase().includes(checkSearchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* Top Description & Presets Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Interactive Push File Security Inspector</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Test incoming push files against 16 security and integrity checks running within Antigravity. Select a preset or input a custom payload below.
            </p>
          </div>

          <button
            onClick={handleRunValidation}
            disabled={isLoading}
            className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all ${
              isLoading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/20 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Scanning & Validating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Inspect & Validate File</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Selectors */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Test Attack & Validation Presets:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PUSH_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span className="font-semibold line-clamp-2 leading-tight">{preset.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded w-fit ${
                    preset.expectedResult === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {preset.expectedResult}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Payload Editor (Left) & Validation Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: File Push Payload Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Incoming Push Request Config</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {(new TextEncoder().encode(content).length / 1024).toFixed(2)} KB
              </span>
            </div>

            {/* Filename & MIME Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Target Push Filename</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
                  placeholder="filename.json"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Content / MIME Type</label>
                <select
                  value={mimeType}
                  onChange={(e) => setMimeType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="application/json">application/json</option>
                  <option value="text/csv">text/csv</option>
                  <option value="application/xml">application/xml</option>
                  <option value="text/plain">text/plain</option>
                  <option value="application/x-sh">application/x-sh</option>
                </select>
              </div>
            </div>

            {/* Headers Config */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Push Request Headers (X-Signature & X-Timestamp)</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-400">X-Timestamp (UTC Epoch)</span>
                    <button
                      onClick={handleSetTimestampNow}
                      className="text-[10px] text-emerald-400 hover:underline"
                    >
                      Set Now
                    </button>
                  </div>
                  <input
                    type="text"
                    value={headers['x-timestamp'] || ''}
                    onChange={(e) => setHeaders({ ...headers, 'x-timestamp': e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-slate-300 text-[11px]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-400">X-Signature (HMAC SHA256)</span>
                    <button
                      onClick={handleAutoComputeHmac}
                      className="text-[10px] text-emerald-400 hover:underline"
                    >
                      Auto Compute
                    </button>
                  </div>
                  <input
                    type="text"
                    value={headers['x-signature'] || ''}
                    onChange={(e) => setHeaders({ ...headers, 'x-signature': e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-slate-300 text-[11px]"
                    placeholder="SHA256 Signature"
                  />
                </div>
              </div>
            </div>

            {/* File Raw Content Textarea */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1">
                <span>File Content Payload</span>
                <span>{selectedPreset.description}</span>
              </div>
              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none shadow-inner"
              />
            </div>

          </div>
        </div>

        {/* Right Column: AI Validation Agent Decision Output */}
        <div className="lg:col-span-6 space-y-4">
          
          {!validationResult && !isLoading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-lg flex flex-col items-center justify-center min-h-[420px]">
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 mb-4 text-emerald-400">
                <ShieldCheck className="w-12 h-12 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Validation Engine Idle</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
                Click <span className="text-emerald-400 font-semibold">"Inspect & Validate File"</span> above to trigger the 16-step AI Security & Integrity check workflow on your incoming push payload.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-lg flex flex-col items-center justify-center min-h-[420px] space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200">AI Validation Agent Active</h3>
                <p className="text-xs text-slate-400 mt-1">Executing deterministic rule checks & LLM anomaly scanning...</p>
              </div>
            </div>
          )}

          {validationResult && !isLoading && (
            <div className="space-y-4">
              
              {/* Decision Hero Banner */}
              <div className={`p-5 rounded-2xl border shadow-xl flex items-center justify-between ${
                validationResult.decision === 'ACCEPTED'
                  ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-emerald-500/40 text-emerald-200'
                  : 'bg-gradient-to-r from-red-950/80 to-slate-900 border-red-500/40 text-red-200'
              }`}>
                
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl ${
                    validationResult.decision === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {validationResult.decision === 'ACCEPTED' ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <AlertOctagon className="w-8 h-8" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xl font-extrabold tracking-tight ${
                        validationResult.decision === 'ACCEPTED' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        PUSH PAYLOAD {validationResult.decision}
                      </span>
                      <span className="text-xs bg-slate-800/80 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                        {validationResult.totalLatencyMs} ms
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-md">
                      {validationResult.summaryReason}
                    </p>
                  </div>
                </div>

                {/* Risk Score Indicator */}
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Risk Score</div>
                  <div className={`text-2xl font-black font-mono ${
                    validationResult.riskScore > 50 ? 'text-red-400' : validationResult.riskScore > 20 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {validationResult.riskScore}%
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {validationResult.riskScore > 50 ? 'CRITICAL RISK' : validationResult.riskScore > 20 ? 'MEDIUM RISK' : 'LOW RISK'}
                  </div>
                </div>

              </div>

              {/* Check Results Sub-Tabs & Filters */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveResultSubTab('checks')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeResultSubTab === 'checks' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Security Checks ({validationResult.checks.length})
                    </button>
                    <button
                      onClick={() => setActiveResultSubTab('raw_json')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeResultSubTab === 'raw_json' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Raw Response JSON
                    </button>
                  </div>

                  {activeResultSubTab === 'checks' && (
                    <div className="flex items-center space-x-2">
                      <select
                        value={checkStatusFilter}
                        onChange={(e) => setCheckStatusFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-medium"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="FAIL">Failed Only</option>
                        <option value="PASS">Passed Only</option>
                        <option value="WARN">Warnings</option>
                      </select>

                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
                        <input
                          type="text"
                          placeholder="Filter checks..."
                          value={checkSearchQuery}
                          onChange={(e) => setCheckSearchQuery(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-2 py-1 text-xs text-slate-300 w-32 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub Tab: Security Checks List */}
                {activeResultSubTab === 'checks' && (
                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {filteredChecks.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-500">
                        No security checks match the selected filter.
                      </div>
                    ) : (
                      filteredChecks.map((check) => {
                        const isPass = check.status === 'PASS';
                        const isFail = check.status === 'FAIL';
                        const isWarn = check.status === 'WARN';

                        return (
                          <div
                            key={check.id}
                            className={`p-3 rounded-xl border text-xs transition-all space-y-1 ${
                              isFail
                                ? 'bg-red-950/20 border-red-500/30 text-red-200'
                                : isWarn
                                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                                : isPass
                                ? 'bg-slate-950/50 border-slate-800 text-slate-200'
                                : 'bg-slate-950/20 border-slate-800/50 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                                  isFail ? 'bg-red-500/20 text-red-400' : isWarn ? 'bg-amber-500/20 text-amber-400' : isPass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {check.status}
                                </span>
                                <span className="font-semibold text-slate-100">{check.name}</span>
                              </div>

                              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                                <span className="px-1.5 py-0.5 bg-slate-800 rounded">{check.category}</span>
                                <span>{check.latencyMs}ms</span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-300 pl-1 leading-relaxed">
                              {check.details}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Sub Tab: Raw Response JSON */}
                {activeResultSubTab === 'raw_json' && (
                  <div className="relative">
                    <button
                      onClick={handleCopyJson}
                      className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center space-x-1 border border-slate-700"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                    <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[400px] leading-relaxed">
                      {JSON.stringify(validationResult, null, 2)}
                    </pre>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

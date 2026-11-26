import React from 'react';
import { X, Sliders, Shield, AlertTriangle, Key, Clock, FileText, Bot } from 'lucide-react';
import { RuleConfig } from '../types';

interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: RuleConfig;
  onChangeConfig: (newConfig: RuleConfig) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2 text-slate-100">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-lg">Agent Security Rule Configurator</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Form */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-sm">
          
          {/* Max File Size */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Max File Size Threshold (MB)</span>
              </span>
              <span className="text-cyan-400 font-mono">{config.maxSizeMb} MB</span>
            </label>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={config.maxSizeMb}
              onChange={(e) => onChangeConfig({ ...config, maxSizeMb: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-xs text-slate-400">
              Files exceeding this threshold will trigger immediate rejection under Resource Control policies.
            </p>
          </div>

          <div className="border-t border-slate-800/80 pt-4 space-y-4">
            
            {/* HMAC Digital Signature */}
            <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <div className="flex items-start space-x-3">
                <Key className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">Require HMAC SHA-256 Digital Signature</div>
                  <div className="text-xs text-slate-400">Strictly reject incoming push files missing valid X-Signature header</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.requireHmac}
                onChange={(e) => onChangeConfig({ ...config, requireHmac: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 rounded bg-slate-800 cursor-pointer"
              />
            </div>

            {config.requireHmac && (
              <div className="space-y-1.5 pl-8">
                <label className="text-xs font-medium text-slate-300">HMAC Secret Key</label>
                <input
                  type="text"
                  value={config.hmacSecret}
                  onChange={(e) => onChangeConfig({ ...config, hmacSecret: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Timestamp Freshness Window */}
            <div className="space-y-1.5">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Timestamp Freshness Window (Seconds)</span>
              </label>
              <input
                type="number"
                value={config.timestampWindowSec}
                onChange={(e) => onChangeConfig({ ...config, timestampWindowSec: parseInt(e.target.value) || 300 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-slate-400">
                Rejects push requests where |ServerUTC - X-Timestamp| exceeds this delta to prevent replay attacks.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 space-y-4">
            
            {/* AI Agent Threat Inspection Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <div className="flex items-start space-x-3">
                <Bot className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">AI Threat & Anomaly Inspection</div>
                  <div className="text-xs text-slate-400">Pass payload to Gemini/LLM Agent to analyze prompt injection & trojan vectors</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.enableAiScan}
                onChange={(e) => onChangeConfig({ ...config, enableAiScan: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 rounded bg-slate-800 cursor-pointer"
              />
            </div>

            {/* Schema Validation Requirements */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Enforce Strict Required Schema Keys</span>
                </span>
                <input
                  type="checkbox"
                  checked={config.requireSchema}
                  onChange={(e) => onChangeConfig({ ...config, requireSchema: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
              <input
                type="text"
                placeholder="Comma separated field names (e.g. batchId, sourceSystem, items)"
                value={config.expectedFields}
                onChange={(e) => onChangeConfig({ ...config, expectedFields: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-slate-400">
                Comma-separated schema key names required in incoming JSON push payloads.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            Apply Security Rules
          </button>
        </div>

      </div>
    </div>
  );
};

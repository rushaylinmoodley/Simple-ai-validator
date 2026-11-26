/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlaygroundTab } from './components/PlaygroundTab';
import { ArchitectureTab } from './components/ArchitectureTab';
import { SecurityChecksTab } from './components/SecurityChecksTab';
import { PythonCodeTab } from './components/PythonCodeTab';
import { AuditLogsTab } from './components/AuditLogsTab';
import { DeploymentTab } from './components/DeploymentTab';
import { ConfigPanel } from './components/ConfigPanel';
import { RuleConfig } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('playground');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [geminiActive, setGeminiActive] = useState<boolean>(true);

  const [config, setConfig] = useState<RuleConfig>({
    maxSizeMb: 5,
    requireHmac: false,
    hmacSecret: 'antigravity-secret-key',
    timestampWindowSec: 300,
    strictMime: true,
    enableAiScan: true,
    requireSchema: false,
    expectedFields: 'batchId, items',
  });

  // Verify server health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.geminiAvailable !== undefined) {
          setGeminiActive(data.geminiAvailable);
        }
      })
      .catch(() => {
        setGeminiActive(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConfig={() => setIsConfigOpen(true)}
        geminiActive={geminiActive}
      />

      {/* Main Container View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'playground' && <PlaygroundTab config={config} />}
        {activeTab === 'architecture' && <ArchitectureTab />}
        {activeTab === 'checks' && <SecurityChecksTab />}
        {activeTab === 'code' && <PythonCodeTab />}
        {activeTab === 'audit' && <AuditLogsTab />}
        {activeTab === 'deployment' && <DeploymentTab />}
      </main>

      {/* Security Rule Configuration Modal */}
      <ConfigPanel
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onChangeConfig={setConfig}
      />

      {/* Bottom Status Bar (Sleek Interface Theme) */}
      <footer className="border-t border-slate-800 bg-slate-900/90 py-2.5 text-[11px] font-mono text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-4">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              NODE_01_VAL
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">LATENCY: 18ms</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">CPU: 8%</span>
          </div>

          <div className="italic text-slate-500 text-[10px] hidden md:block">
            Security First Design Principle • Zero Cost Automation • Antigravity Enabled
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <span className="text-emerald-400 font-semibold">FastAPI + Gemini 3.6 Flash</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">v1.0.4-STABLE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

import React from 'react';
import { ShieldCheck, Cpu, Play, Network, FileCode, History, Terminal, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenConfig: () => void;
  geminiActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenConfig,
  geminiActive,
}) => {
  const navItems = [
    { id: 'playground', label: 'Playground & Validator', icon: Play },
    { id: 'architecture', label: 'Architecture & Flow', icon: Network },
    { id: 'checks', label: '16 Security Checks', icon: ShieldCheck },
    { id: 'code', label: 'Python Code Suite', icon: FileCode },
    { id: 'audit', label: 'Audit Logs', icon: History },
    { id: 'deployment', label: 'Antigravity Setup', icon: Terminal },
  ];

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Sleek Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  ANTIGRAVITY <span className="text-emerald-400 font-medium">// SECURE GATEWAY</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                AI Push File Validation Agent & Zero-Trust Security Pipeline
              </p>
            </div>
          </div>

          {/* Right Status Badges & Settings */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                Agent Active: {geminiActive ? 'Gemini-3.6-Flash' : 'Llama-3-Local'}
              </span>
            </div>

            <div className="hidden sm:block px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-slate-300">
              v1.0.4-STABLE
            </div>

            <button
              onClick={onOpenConfig}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors shadow-sm"
              title="Configure Validation Rules & Thresholds"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Rule Config</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/80 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

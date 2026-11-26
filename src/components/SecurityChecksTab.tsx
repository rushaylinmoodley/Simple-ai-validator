import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Binary,
  Lock,
  FileCode,
  Layers,
  Cpu
} from 'lucide-react';
import { SECURITY_CHECKS_LIST } from '../data/securityChecks';

export const SecurityChecksTab: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', 'Integrity', 'Security', 'Format', 'Schema', 'Auth', 'AI Security'];

  const filteredChecks = SECURITY_CHECKS_LIST.filter((check) => {
    const matchesCategory = categoryFilter === 'ALL' || check.category === categoryFilter;
    const matchesSearch =
      check.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.passCriteria.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>16 Core Security & Integrity Validation Checks</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Every incoming push file passes through a multi-tiered defense matrix combining fast deterministic rules with AI LLM agent inspection before reaching target endpoints.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold">{SECURITY_CHECKS_LIST.length} Checks Active</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400">12 Deterministic</span>
            <span className="text-slate-500">|</span>
            <span className="text-purple-400">4 AI Agent</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
          
          <div className="flex space-x-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search security checks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>
      </div>

      {/* Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChecks.map((check) => {
          const isAi = check.mechanism === 'AI Agent' || check.mechanism === 'Hybrid';
          const isCritical = check.severity === 'Critical';

          return (
            <div
              key={check.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono ${
                      isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {check.severity}
                    </span>
                    <span className="font-bold text-sm text-slate-100">{check.name}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border ${
                    isAi ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  }`}>
                    {isAi ? <Bot className="w-3 h-3 text-purple-400" /> : <Cpu className="w-3 h-3 text-cyan-400" />}
                    <span>{check.mechanism}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {check.description}
                </p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pass Assertion Criteria</span>
                </div>
                <p className="font-mono text-emerald-300 text-[11px] leading-relaxed">
                  {check.passCriteria}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

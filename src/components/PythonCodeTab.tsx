import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Terminal, Sparkles } from 'lucide-react';
import { PYTHON_CODE_FILES } from '../data/pythonCode';

export const PythonCodeTab: React.FC = () => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = PYTHON_CODE_FILES[selectedFileIdx];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FileCode className="w-6 h-6 text-emerald-400" />
              <span>Minimum Viable Implementation (Python & FastAPI Suite)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Production-ready, copyable Python source code using FastAPI, Pydantic, ClamAV socket scanner, SQLite audit logger, and Ollama local LLM / Gemini AI agent.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Code' : 'Copy File'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download {activeFile.filename}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code File Explorer & Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* File Tree Selector */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2 h-fit">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Python Implementation Files</span>
          </div>

          <div className="space-y-1">
            {PYTHON_CODE_FILES.map((file, idx) => {
              const isSelected = idx === selectedFileIdx;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFileIdx(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col space-y-1 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="font-mono text-xs font-bold flex items-center justify-between">
                    <span>{file.filename}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{file.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code View Canvas */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono text-xs text-slate-200">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-400">{activeFile.filename}</span>
              <span className="text-slate-600">—</span>
              <span className="text-slate-400 text-[11px]">{activeFile.description}</span>
            </div>

            <span className="text-[10px] font-mono text-slate-500">
              {activeFile.code.split('\n').length} lines
            </span>
          </div>

          <div className="p-4 bg-slate-950/90 overflow-x-auto max-h-[550px] scrollbar-thin">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed">
              <code>{activeFile.code}</code>
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};

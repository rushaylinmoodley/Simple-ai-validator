import React, { useState, useEffect } from 'react';
import { History, Trash2, Download, Search, CheckCircle2, AlertOctagon, RefreshCw, Eye, X } from 'lucide-react';
import { AuditLogItem } from '../types';

export const AuditLogsTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [decisionFilter, setDecisionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      await fetch('/api/logs/clear', { method: 'POST' });
      setLogs([]);
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesDecision = decisionFilter === 'ALL' || log.decision === decisionFilter;
    const matchesSearch =
      log.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.summaryReason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDecision && matchesSearch;
  });

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Filename', 'MIME Type', 'Size (Bytes)', 'Decision', 'Risk Score', 'Summary Reason'];
    const rows = logs.map(l => [
      l.id,
      l.timestamp,
      `"${l.filename}"`,
      l.mimeType,
      l.fileSizeBytes,
      l.decision,
      l.riskScore,
      `"${l.summaryReason.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `push_audit_logs_${Date.now()}.csv`;
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
              <History className="w-6 h-6 text-emerald-400" />
              <span>Real-Time Audit Telemetry & Security Logs</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Every incoming push request processed by Antigravity is recorded with full audit trails, check breakdowns, and risk scores.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLogs}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            <button
              onClick={handleExportCsv}
              disabled={logs.length === 0}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleClearLogs}
              disabled={logs.length === 0}
              className="flex items-center space-x-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl border border-red-500/30 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
          <div className="flex space-x-2">
            {['ALL', 'ACCEPTED', 'REJECTED'].map((dec) => (
              <button
                key={dec}
                onClick={() => setDecisionFilter(dec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  decisionFilter === dec
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                {dec === 'ALL' ? `All (${logs.length})` : dec}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No audit records found. Test a push payload in the Playground tab to populate history.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Decision</th>
                  <th className="p-4">Filename</th>
                  <th className="p-4">Risk Score</th>
                  <th className="p-4">Checks Passed</th>
                  <th className="p-4">Summary</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {filteredLogs.map((log) => {
                  const isAccepted = log.decision === 'ACCEPTED';
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          isAccepted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {isAccepted ? <CheckCircle2 className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
                          <span>{log.decision}</span>
                        </span>
                      </td>

                      <td className="p-4 font-bold text-slate-100 max-w-[180px] truncate">
                        {log.filename}
                      </td>

                      <td className="p-4">
                        <span className={`font-bold ${log.riskScore > 50 ? 'text-red-400' : log.riskScore > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {log.riskScore}%
                        </span>
                      </td>

                      <td className="p-4 text-slate-300">
                        {log.checksPassed} / {log.checksTotal}
                      </td>

                      <td className="p-4 text-slate-400 text-xs font-sans max-w-[260px] truncate">
                        {log.summaryReason}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                          title="View Check Trace"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Single Audit Record Trace Inspector */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <div>
                <div className="text-xs font-mono text-slate-400">{selectedLog.id}</div>
                <h3 className="font-bold text-base text-slate-100 mt-0.5">{selectedLog.filename}</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-500">Decision</div>
                  <div className={`font-bold ${selectedLog.decision === 'ACCEPTED' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedLog.decision}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Risk Score</div>
                  <div className="font-bold text-amber-400">{selectedLog.riskScore}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">File Size</div>
                  <div className="text-slate-300">{(selectedLog.fileSizeBytes / 1024).toFixed(2)} KB</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Checks Passed</div>
                  <div className="text-slate-300">{selectedLog.checksPassed} / {selectedLog.checksTotal}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-300 font-sans">Check Execution Trace:</div>
                <div className="space-y-2">
                  {selectedLog.checks.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200">{c.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          c.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : c.status === 'FAIL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">{c.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

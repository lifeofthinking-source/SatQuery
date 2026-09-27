import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXECUTION_STEPS } from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';
import { Activity, Download, FileText, CheckCircle2, Terminal, Filter, RefreshCw } from 'lucide-react';

export const ExecutionTracePage: React.FC = () => {
  const { executionSteps, query, showNotification, setCurrentRoute } = useApp();
  const [filterTool, setFilterTool] = useState<string>('all');

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(executionSteps, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'SatQuery_Execution_Trace_Audit.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Exported Execution Trace JSON audit trail.');
  };

  const filteredSteps =
    filterTool === 'all'
      ? executionSteps
      : executionSteps.filter(s => s.toolModel.toLowerCase().includes(filterTool.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <span>Audit Trail & Provenance Registry</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">10 / 10 Steps Complete</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Execution Trace
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Complete audit trail of the analysis workflow, recording exact models, algorithmic execution latencies, and intermediate vector artifacts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJson}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Trace JSON</span>
          </button>

          <button
            onClick={() => setCurrentRoute('reports')}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Report</span>
          </button>
        </div>
      </div>

      {/* Query Banner */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs">
        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] block mb-1">
          Trace Run Invariant:
        </span>
        <div className="font-mono text-slate-900 text-xs">
          Query: “{query}”
        </div>
      </div>

      {/* Execution Trace Audit Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-600" />
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Step-by-Step Ledger
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Filter Tool:</span>
            <select
              value={filterTool}
              onChange={e => setFilterTool(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700"
            >
              <option value="all">All Tools & Models</option>
              <option value="DeltaView">DeltaView</option>
              <option value="Opt-SAR">Opt-SAR</option>
              <option value="GIS Engine">GIS Engine</option>
              <option value="Geo Validator">Geo Validator</option>
              <option value="Challenge Engine">Challenge Engine</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-16">Step</th>
                <th className="py-3 px-4 w-52">Action</th>
                <th className="py-3 px-4 w-44">Tool / Model</th>
                <th className="py-3 px-4 w-28">Status</th>
                <th className="py-3 px-4">Output / Artifact Description</th>
                <th className="py-3 px-4 w-28 text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredSteps.map(step => (
                <tr key={step.stepNumber} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">
                    {String(step.stepNumber).padStart(2, '0')}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {step.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {step.toolModel}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Complete
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700 leading-relaxed">
                    <div>{step.output}</div>
                    {step.details && (
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        ↳ {step.details}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-right text-slate-500 tabular-nums">
                    {step.durationMs} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Aggregate Pipeline Latency: 6,430 ms</span>
          <span>Integrity Hash: 7b84f3...91e4 (Verified)</span>
        </div>
      </div>
    </div>
  );
};

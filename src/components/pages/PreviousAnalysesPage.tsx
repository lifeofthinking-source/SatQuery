import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RECENT_ANALYSES } from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';
import { FolderGit2, Search, Filter, ArrowRight, FileText, Download, Calendar, MapPin } from 'lucide-react';

export const PreviousAnalysesPage: React.FC = () => {
  const { startAnalysisWorkflow, setCurrentRoute } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAnalyses = RECENT_ANALYSES.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
            Department Archive & Historical Logs
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            My Analyses
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Historical remote sensing queries, cross-modal validations, and auditable evidence chains recorded across national spatial planning sessions.
          </p>
        </div>

        <button
          onClick={() => startAnalysisWorkflow()}
          className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded font-semibold text-xs shadow-sm transition-colors whitespace-nowrap"
        >
          + New Analysis
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="w-full sm:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by analysis title, region, or department..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:border-blue-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs text-slate-500 font-mono">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
          >
            <option value="all">All Statuses</option>
            <option value="SUPPORTED">Supported</option>
            <option value="PARTIALLY SUPPORTED">Partially Supported</option>
            <option value="INSUFFICIENT EVIDENCE">Insufficient Evidence</option>
          </select>
        </div>
      </div>

      {/* Analyses Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-64">Analysis Title</th>
                <th className="py-3 px-4 w-44">Region</th>
                <th className="py-3 px-4 w-32">Date Logged</th>
                <th className="py-3 px-4 w-44">Status</th>
                <th className="py-3 px-4">Evidence Modality</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredAnalyses.map(item => (
                <tr
                  key={item.id}
                  onClick={() => startAnalysisWorkflow(item.query)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.department} · {item.period}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {item.region}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {item.dateCreated}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    <div>{item.modality}</div>
                    {item.areaChanged !== '0.0 km²' && (
                      <div className="text-emerald-700 font-bold">Δ {item.areaChanged}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 group-hover:underline">
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

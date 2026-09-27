import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PROVENANCE_GRAPH_NODES } from '../../data/mockData';
import { Compass, CheckCircle2, ArrowDown, Database, Cpu, ShieldCheck, X, FileText, ExternalLink, Calendar, MapPin } from 'lucide-react';

export const EvidenceExplorerPage: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-claim');
  const { dataset } = useApp();

  const selectedNode =
    PROVENANCE_GRAPH_NODES.find(n => n.id === selectedNodeId) || PROVENANCE_GRAPH_NODES[0];

  const nodeColorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    CLAIM: { bg: 'bg-blue-50', border: 'border-blue-900', text: 'text-blue-950', badge: 'bg-blue-900 text-white' },
    EVIDENCE: { bg: 'bg-slate-50', border: 'border-slate-400', text: 'text-slate-900', badge: 'bg-slate-800 text-white' },
    ANALYSIS: { bg: 'bg-indigo-50', border: 'border-indigo-600', text: 'text-indigo-950', badge: 'bg-indigo-900 text-white' },
    VALIDATION: { bg: 'bg-amber-50', border: 'border-amber-600', text: 'text-amber-950', badge: 'bg-amber-800 text-white' },
    CONCLUSION: { bg: 'bg-emerald-50', border: 'border-emerald-600', text: 'text-emerald-950', badge: 'bg-emerald-800 text-white' }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
          <span>Claim-Level Evidence Provenance</span>
          <span>·</span>
          <span className="text-blue-900 font-semibold">Graph Inspection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Evidence Explorer
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Trace every scientific assertion directly back to source satellite pixels, calibration metadata, and invariant tests. Click any node in the graph below to inspect its cryptographic audit record.
        </p>
      </div>

      {/* Main Grid: Interactive Graph DAG (Left, 7 cols) & Inspection Detail Drawer (Right, 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Provenance Graph Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Provenance Directed Acyclic Graph (DAG)</span>
            <span className="text-blue-900 font-semibold text-[11px]">Click nodes to inspect</span>
          </div>

          <div className="space-y-4">
            {/* Step 1: Root Claim */}
            <div>
              {PROVENANCE_GRAPH_NODES.filter(n => n.type === 'CLAIM').map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedNodeId === node.id
                      ? 'border-blue-900 bg-blue-50/80 shadow-sm'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-blue-900 text-white rounded">
                      ROOT CLAIM
                    </span>
                    <span className="text-xs font-mono text-slate-500">ID: {node.id}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">{node.title}</div>
                  <div className="text-xs text-slate-600 mt-1">{node.summary}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-center text-slate-400">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Step 2: Evidence Inputs (3 parallel nodes) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block text-center">
                SOURCE SATELLITE EVIDENCE (3 OBSERVED RASTERS)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PROVENANCE_GRAPH_NODES.filter(n => n.type === 'EVIDENCE').map(node => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`text-left p-3 rounded border transition-all ${
                      selectedNodeId === node.id
                        ? 'border-blue-900 bg-blue-50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[9px] font-mono uppercase text-slate-500 block mb-0.5">
                      RAW TELEMETRY
                    </span>
                    <div className="font-bold text-xs text-slate-900 truncate">{node.title.split(':')[0]}</div>
                    <div className="text-[11px] text-slate-600 truncate mt-0.5">{node.summary}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center text-slate-400">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Step 3: Analysis Pipeline */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block text-center">
                SPECIALIST ANALYSIS & GIS ENGINES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PROVENANCE_GRAPH_NODES.filter(n => n.type === 'ANALYSIS').map(node => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`text-left p-3 rounded border transition-all ${
                      selectedNodeId === node.id
                        ? 'border-blue-900 bg-blue-50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[9px] font-mono uppercase text-indigo-700 block mb-0.5">
                      ALGORITHMIC INFERENCE
                    </span>
                    <div className="font-bold text-xs text-slate-900 truncate">{node.title.split(':')[0]}</div>
                    <div className="text-[11px] text-slate-600 truncate mt-0.5">{node.summary}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center text-slate-400">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Step 4: Validation */}
            <div>
              {PROVENANCE_GRAPH_NODES.filter(n => n.type === 'VALIDATION').map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full text-left p-3.5 rounded border-2 transition-all ${
                    selectedNodeId === node.id
                      ? 'border-amber-600 bg-amber-50 shadow-xs'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-amber-700 text-white rounded">
                      ADVERSARIAL CHALLENGE
                    </span>
                    <span className="text-xs font-mono text-emerald-800 font-semibold">6 / 6 Invariants Passed</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">{node.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{node.summary}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-center text-slate-400">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Step 5: Final Conclusion */}
            <div>
              {PROVENANCE_GRAPH_NODES.filter(n => n.type === 'CONCLUSION').map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedNodeId === node.id
                      ? 'border-emerald-700 bg-emerald-50 shadow-sm'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-emerald-800 text-white rounded">
                      VERIFIED CONCLUSION
                    </span>
                    <span className="text-xs font-mono text-emerald-800 font-semibold">● FULL PROVENANCE GROUNDED</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">{node.title}</div>
                  <div className="text-xs text-slate-600 mt-1">{node.summary}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Detailed Inspection Drawer (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Audited Node Inspector
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedNode.title}
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-1 rounded font-bold uppercase ${nodeColorMap[selectedNode.type]?.badge}`}>
                {selectedNode.type}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono text-[11px] uppercase block mb-1">
                  Summary Description:
                </span>
                <p className="text-slate-800 font-medium bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedNode.summary}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-mono text-[11px] uppercase block mb-1">
                  Provenance Details & Telemetry:
                </span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 font-mono text-[11px]">
                  {selectedNode.details}
                </p>
              </div>

              {selectedNode.type === 'EVIDENCE' && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">CRS Coordinate System:</span>
                    <span className="text-slate-800 font-bold">EPSG:4326 (WGS 84)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sub-pixel Calibration:</span>
                    <span className="text-emerald-700 font-bold">RMS: 0.18 px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Archival Hash (SHA256):</span>
                    <span className="text-slate-700">d4e8...7a29</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Audit Standard: ISRO EO-Spec 2026</span>
            <span className="text-blue-900 font-semibold">Immutable Record</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RECENT_ANALYSES } from '../../data/mockData';
import {
  Search,
  Plus,
  Compass,
  FileText,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Calendar,
  Building,
  ExternalLink
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { setCurrentRoute, startAnalysisWorkflow, user } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <span>Official Workspace</span>
            <span>·</span>
            <span>{user.department}</span>
            <span>·</span>
            <span>Clearance: Level-3 Analyst</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome to SatQuery AI
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Earth Observation Intelligence Workspace — Ask natural language questions, generate evidence plans, coordinate multimodal models, and challenge satellite findings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentRoute('map-workspace')}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded font-semibold text-xs shadow-sm transition-colors flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-blue-200" />
            <span>Open Live Satellite Map</span>
          </button>

          <button
            onClick={() => startAnalysisWorkflow()}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>+ New Satellite Analysis</span>
          </button>
        </div>
      </div>

      {/* Top Statistics Cards with DEMO DATA Badge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              Workspace Execution Telemetry
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-300">
              Demo Data
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Simulated Department Metrics · 2026 Season
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded p-4">
            <div className="text-xs text-slate-500 font-medium">Total Analyses</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">24</div>
            <div className="text-[11px] text-slate-400 mt-1">Multi-sensor queries logged</div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-4">
            <div className="text-xs text-slate-500 font-medium">Completed</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">19</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">79.2% full pipeline execution</div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-4">
            <div className="text-xs text-slate-500 font-medium">Evidence Supported</div>
            <div className="text-2xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">15</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Cross-modal invariants passed</div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-4">
            <div className="text-xs text-slate-500 font-medium">Insufficient Evidence</div>
            <div className="text-2xl font-bold font-mono text-rose-800 mt-1 tabular-nums">4</div>
            <div className="text-[11px] text-rose-700 font-medium mt-1">Responsible scientific abstention</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Analyses (Left) & Quick Actions / Scenarios (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Analyses Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Analyses
            </h2>
            <button
              onClick={() => setCurrentRoute('previous-analyses')}
              className="text-xs text-blue-900 hover:underline font-medium"
            >
              View All 24 Records →
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-200">
              {RECENT_ANALYSES.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.status === 'INSUFFICIENT EVIDENCE') {
                      startAnalysisWorkflow(item.query);
                    } else {
                      startAnalysisWorkflow(item.query);
                    }
                  }}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                        {item.title}
                      </span>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Region: <strong className="text-slate-700 font-normal">{item.region}</strong></span>
                      <span>·</span>
                      <span>Period: <strong className="text-slate-700 font-normal">{item.period}</strong></span>
                      <span>·</span>
                      <span className="font-mono text-[11px] text-slate-400">{item.modality}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-mono font-semibold text-slate-800">
                        {item.areaChanged !== '0.0 km²' ? `Δ ${item.areaChanged}` : 'Abstained'}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.dateCreated}</div>
                    </div>
                    <div className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-blue-300 group-hover:text-blue-900 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Start Analysis & Evaluation Scenarios (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Start New Analysis Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-blue-900 font-semibold mb-1">
                SIH 2026 Core Workflow
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Launch Evaluation Flow
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Walk through the complete 10-step agentic pipeline: Query → Input Validation → Evidence Planning → Tool Selection → Live Run → Challenge & Verification → Audited Results.
              </p>
            </div>

            <button
              onClick={() => startAnalysisWorkflow()}
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Begin Guided Analysis</span>
            </button>
          </div>

          {/* Test Scenarios Selector */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Preset Benchmark Queries
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() =>
                  startAnalysisWorkflow(
                    'Has the built-up area increased between these two dates, where did the change occur, and does the available SAR evidence support it?'
                  )
                }
                className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
              >
                <div className="font-semibold text-slate-900">1. Hyderabad Built-up Growth</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Sentinel-2 + Sentinel-1 SAR bimodal cross-check
                </div>
              </button>

              <button
                onClick={() =>
                  startAnalysisWorkflow(
                    'Can you determine the exact 3D building height and vertical storey count of all newly developed structures in this AOI?'
                  )
                }
                className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 transition-colors"
              >
                <div className="font-semibold text-slate-900 text-rose-950 flex items-center justify-between">
                  <span>2. Building Height Estimation</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded">
                    Abstention Test
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tests responsible refusal when elevation data is missing
                </div>
              </button>

              <button
                onClick={() =>
                  startAnalysisWorkflow(
                    'What agricultural parcels were inundated during the peak monsoon event, and what is the spatial footprint of standing water?'
                  )
                }
                className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
              >
                <div className="font-semibold text-slate-900">3. Coastal AP Flood Inundation</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Disaster management standing water footprint
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

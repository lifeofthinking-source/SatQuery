import React from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, CheckCircle2, ArrowRight, ArrowLeft, Layers, ShieldCheck, Database, Compass, ArrowDown } from 'lucide-react';

export const ToolSelectionPage: React.FC = () => {
  const { specialistTools, setCurrentRoute, runLiveSimulation } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
          Stage 04 · Dynamic Model Orchestration
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Intelligent Model & Tool Selection
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Tools are selected automatically according to the evidence plan. The user does not need to choose deep learning models or GIS algorithms manually.
        </p>
      </div>

      {/* Autonomous Selection Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-900 border border-blue-600 flex items-center justify-center text-blue-200">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-blue-300">
              Autonomous Orchestrator Resolution
            </div>
            <div className="text-base font-bold text-white">
              Selected by SatQuery
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-300 max-w-md sm:text-right">
          User Query → Evidence Plan → Automatic Tool Selection. No manual hyperparameter or model picking required.
        </div>
      </div>

      {/* Specialist Model Cards Grid (4 tools) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {specialistTools.map(tool => (
          <div
            key={tool.id}
            className="bg-white border-2 border-slate-200 hover:border-blue-900 rounded-lg p-5 space-y-4 shadow-xs transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{tool.name}</h3>
                  <div className="text-xs text-slate-500">{tool.category}</div>
                </div>
                <span className="text-[11px] font-mono font-semibold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded shrink-0">
                  {tool.status}
                </span>
              </div>

              {/* Tasks List */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
                  Assigned Capabilities:
                </span>
                <ul className="text-xs text-slate-700 space-y-1">
                  {tool.tasks.map((task, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selection Rationale */}
              <div className="text-xs text-slate-600">
                <strong className="text-slate-900">Why Selected:</strong> {tool.rationale}
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span>Input: {tool.inputModality.split('(')[0]}</span>
              <span className="text-blue-900 font-semibold">Ready for Execution</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => setCurrentRoute('evidence-planning')}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Evidence Plan</span>
        </button>

        <button
          onClick={() => runLiveSimulation()}
          className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors"
        >
          <span>Run Live Analysis Pipeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

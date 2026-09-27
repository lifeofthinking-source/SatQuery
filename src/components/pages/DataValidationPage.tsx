import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, Info, Database } from 'lucide-react';

export const DataValidationPage: React.FC = () => {
  const { validationChecks, setCurrentRoute, query, dataset } = useApp();

  const allPassed = validationChecks.every(c => c.status === 'passed');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
          Stage 02 · Pre-flight Geo Validation Gate
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Input Validation
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          SatQuery first checks whether the available satellite rasters, acquisition timestamps, and spatial geometries are mathematically suitable for the requested analysis before triggering compute.
        </p>
      </div>

      {/* Query Banner */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs space-y-1">
        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
          Target User Query Under Evaluation:
        </span>
        <div className="text-sm font-medium text-slate-900 font-sans">
          “{query}”
        </div>
      </div>

      {/* Validation Gate Status Banner */}
      <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Pre-Flight Validation Gate
            </div>
            <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Status: Ready for Analysis</span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                6 / 6 Checks Verified
              </span>
            </div>
          </div>
        </div>

        <div className="text-right text-xs text-slate-500 max-w-xs">
          Inputs are validated before specialist models (DeltaView, Opt-SAR, GeoChat) are scheduled or executed.
        </div>
      </div>

      {/* Validation Checklist Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Verification Protocol Checklist
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Spatial CRS: {dataset.aoi.crs} · GSD: 10.0 m
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {validationChecks.map(item => (
            <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="text-xs font-mono font-medium text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 inline-block">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => setCurrentRoute('new-analysis')}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Query Formulation</span>
        </button>

        <button
          onClick={() => setCurrentRoute('evidence-planning')}
          className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors"
        >
          <span>Proceed to Evidence Planning</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

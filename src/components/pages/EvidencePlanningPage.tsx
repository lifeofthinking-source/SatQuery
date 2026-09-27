import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, CheckCircle2, ArrowRight, ArrowLeft, ArrowDown, Layers, ShieldCheck, Database, Calendar } from 'lucide-react';

export const EvidencePlanningPage: React.FC = () => {
  const { evidencePlan, query, setCurrentRoute } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            Stage 03 · Evidence-Adaptive Planning
          </span>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 rounded">
            Evidence-first planning
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Evidence Plan
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          SatQuery determines what evidence is required before selecting models. By decoupling question understanding from raw generation, it prevents hallucination and establishes auditable proof criteria.
        </p>
      </div>

      {/* Prominent User Query Card */}
      <div className="bg-white border-l-4 border-l-blue-900 border-y border-r border-slate-200 p-5 rounded-r-lg shadow-xs space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Evaluated Natural Language Inquiry:
        </div>
        <div className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
          “{query}”
        </div>
        <div className="text-xs text-slate-500 pt-1">
          Decomposition: Bitemporal Urban Expansion Detection · Cadastral Localization · Microwave (SAR) Corroboration
        </div>
      </div>

      {/* Visual Workflow: QUERY → INTERPRET → REQUIRED EVIDENCE → ANALYSIS PLAN */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">
          Methodological Planning Sequence
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white border border-slate-200 p-3 rounded text-left">
            <span className="text-[10px] font-mono text-slate-400 block mb-0.5">01. INGEST</span>
            <div className="font-bold text-slate-900 text-xs">QUERY</div>
            <div className="text-[11px] text-slate-500 mt-0.5">User natural-language text</div>
          </div>
          <div className="bg-white border border-slate-200 p-3 rounded text-left">
            <span className="text-[10px] font-mono text-slate-400 block mb-0.5">02. REASON</span>
            <div className="font-bold text-slate-900 text-xs">INTERPRET</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Temporal & spatial intents</div>
          </div>
          <div className="bg-white border-2 border-blue-900 p-3 rounded text-left shadow-xs">
            <span className="text-[10px] font-mono text-blue-800 font-bold block mb-0.5">03. MANDATE</span>
            <div className="font-bold text-blue-900 text-xs">REQUIRED EVIDENCE</div>
            <div className="text-[11px] text-blue-800 mt-0.5">Physical proofs demanded</div>
          </div>
          <div className="bg-white border border-slate-200 p-3 rounded text-left">
            <span className="text-[10px] font-mono text-slate-400 block mb-0.5">04. SCHEDULE</span>
            <div className="font-bold text-slate-900 text-xs">ANALYSIS PLAN</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Targeted model binding</div>
          </div>
        </div>
      </div>

      {/* Required Evidence Grid (4 Categories) */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Required Evidence Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidencePlan.map(cat => (
            <div
              key={cat.category}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {cat.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {cat.details.length} Invariants
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {cat.title}
                </h4>
                <ul className="mt-2.5 space-y-2 text-xs text-slate-600">
                  {cat.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-900 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => setCurrentRoute('data-validation')}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Input Validation</span>
        </button>

        <button
          onClick={() => setCurrentRoute('tool-selection')}
          className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors"
        >
          <span>Proceed to Intelligent Tool Selection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

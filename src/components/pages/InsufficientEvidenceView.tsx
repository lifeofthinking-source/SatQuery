import React from 'react';
import { useApp } from '../../context/AppContext';
import { INSUFFICIENT_EVIDENCE_SAMPLE } from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';
import { AlertOctagon, ArrowLeft, UploadCloud, Edit3, Compass, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

export const InsufficientEvidenceView: React.FC = () => {
  const { setCurrentRoute, setQuery, showNotification } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
          <span>Responsible Scientific Abstention</span>
          <span>·</span>
          <span className="text-rose-700 font-semibold">Evidence Invariant Violation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Analysis Results: Insufficient Evidence
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          SatQuery refuses to hallucinate synthetic metrics when satellite modalities lack mathematical bounds for empirical proof.
        </p>
      </div>

      {/* Main Abstention Banner */}
      <div className="bg-rose-50/70 border-2 border-rose-300 rounded-lg p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-800 shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-rose-800 font-bold">
                Evidence Status
              </div>
              <div className="text-xl font-bold text-rose-950">
                INSUFFICIENT EVIDENCE
              </div>
            </div>
          </div>

          <div className="text-xs font-mono px-3 py-1 bg-white border border-rose-300 rounded text-rose-800 font-semibold">
            Status: ABSTAINED (No Guesswork)
          </div>
        </div>

        {/* User Query */}
        <div className="bg-white/80 p-3.5 rounded border border-rose-200 space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
            Submitted User Query:
          </span>
          <p className="text-sm font-semibold text-slate-900">
            “{INSUFFICIENT_EVIDENCE_SAMPLE.query}”
          </p>
        </div>

        {/* Scientific Explanation */}
        <div className="space-y-2 text-xs text-rose-950 leading-relaxed">
          <p className="font-medium text-sm">
            {INSUFFICIENT_EVIDENCE_SAMPLE.explanation}
          </p>
          <p className="text-slate-700">
            <strong>Scientific Rationale:</strong> {INSUFFICIENT_EVIDENCE_SAMPLE.scientificRationale}
          </p>
        </div>
      </div>

      {/* "What would help?" Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Compass className="w-4 h-4 text-blue-900" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            What would help answer this question?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INSUFFICIENT_EVIDENCE_SAMPLE.whatWouldHelp.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-900 uppercase block mb-1">
                  Required Modality 0{idx + 1}
                </span>
                <h4 className="font-bold text-xs text-slate-900">{item.modality}</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 font-mono">
                Source: Cartosat / airborne survey
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: Upload Additional Data or Modify Query */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => {
            setQuery(
              'Has the built-up area increased between these two dates, where did the change occur, and does the available SAR evidence support it?'
            );
            setCurrentRoute('new-analysis');
          }}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Switch to Supported Query (Built-up Area)</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              showNotification('Opened Dataset Ingestion Dialog for stereo DEM / LiDAR.');
            }}
            className="px-4 py-2 border border-blue-900 text-blue-900 hover:bg-blue-50 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Additional Sensor Data</span>
          </button>

          <button
            onClick={() => setCurrentRoute('new-analysis')}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modify Query</span>
          </button>
        </div>
      </div>
    </div>
  );
};

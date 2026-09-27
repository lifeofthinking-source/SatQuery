import React from 'react';
import {
  Brain,
  Clock,
  MapPin,
  Layers,
  FileOutput,
  Loader2,
} from 'lucide-react';
import { UnderstandResponse } from '../../services/analysisService';

interface QueryUnderstandingProps {
  response: UnderstandResponse | null;
  loading: boolean;
}

interface InterpretRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InterpretRow: React.FC<InterpretRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-blue-700 mt-0.5 shrink-0">{icon}</span>
    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-36 shrink-0 pt-0.5">
      {label}
    </span>
    <span className="text-sm text-slate-800 font-medium leading-snug">{value}</span>
  </div>
);

const YesNo: React.FC<{ value: boolean; detail?: string }> = ({ value, detail }) => (
  <span className="flex items-center gap-2">
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
        ${value ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}
    >
      {value ? 'Yes' : 'No'}
    </span>
    {detail && <span className="text-[11px] text-slate-500">{detail}</span>}
  </span>
);

export const QueryUnderstanding: React.FC<QueryUnderstandingProps> = ({ response, loading }) => {
  if (loading) {
    return (
      <div className="border border-slate-200 rounded bg-white p-4 flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-blue-700 animate-spin shrink-0" />
        <div>
          <p className="text-sm font-semibold text-slate-800">Interpreting request…</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Analysing query intent and evidence requirements</p>
        </div>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="border border-blue-200 rounded bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 bg-blue-900 px-4 py-2.5">
        <Brain className="w-4 h-4 text-blue-200 shrink-0" />
        <p className="text-xs font-bold uppercase tracking-wider text-white">
          SatQuery Understands Your Request
        </p>
      </div>

      {/* Interpretation rows */}
      <div className="px-4 divide-y divide-slate-100">
        <InterpretRow
          icon={<Brain className="w-4 h-4" />}
          label="Intent"
          value={
            <span>
              <span className="inline-block px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-blue-900 text-xs font-bold mr-2">
                {response.intent}
              </span>
              <span className="text-xs text-slate-500 font-normal">{response.intentDetail}</span>
            </span>
          }
        />
        <InterpretRow
          icon={<Clock className="w-4 h-4" />}
          label="Temporal"
          value={
            <YesNo
              value={response.temporalRequirement}
              detail={response.temporalRequirement ? 'Requires comparison image across two acquisition dates.' : undefined}
            />
          }
        />
        <InterpretRow
          icon={<MapPin className="w-4 h-4" />}
          label="Spatial"
          value={<YesNo value={response.spatialRequirement} detail="Spatial localisation and area quantification required." />}
        />
        <InterpretRow
          icon={<Layers className="w-4 h-4" />}
          label="Multimodal"
          value={<YesNo value={response.multimodalRequirement} detail={response.multimodalDetail} />}
        />
        <InterpretRow
          icon={<FileOutput className="w-4 h-4" />}
          label="Expected Output"
          value={response.expectedOutput}
        />
      </div>

      {/* Footer note */}
      <div className="border-t border-slate-100 px-4 py-2 bg-slate-50 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-700 animate-pulse" />
        <p className="text-[11px] text-slate-500 italic">
          SatQuery will now build an Evidence Plan based on these requirements.
        </p>
      </div>
    </div>
  );
};

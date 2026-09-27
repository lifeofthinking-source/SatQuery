import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { EvidenceRequirement } from '../../services/analysisService';

interface EvidenceRequirementPreviewProps {
  requirements: EvidenceRequirement[];
  onAddComparisonImage?: () => void;
  onAddSarImage?: () => void;
}

export const EvidenceRequirementPreview: React.FC<EvidenceRequirementPreviewProps> = ({
  requirements,
  onAddComparisonImage,
  onAddSarImage,
}) => {
  return (
    <div className="border border-slate-200 rounded bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
          Evidence Requirements Identified
        </p>
        <span className="text-[10px] text-slate-400 font-mono">
          {requirements.filter(r => r.met).length}/{requirements.length} met
        </span>
      </div>

      {/* Evidence items */}
      <ul className="divide-y divide-slate-100">
        {requirements.map(req => (
          <li key={req.id} className="flex items-start gap-3 px-4 py-2.5">
            {req.met ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-semibold ${req.met ? 'text-slate-800' : 'text-amber-700'}`}>
                {req.label}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{req.detail}</p>

              {/* Inline CTA buttons for unmet requirements */}
              {!req.met && req.id === 'ev-comparison' && onAddComparisonImage && (
                <button
                  type="button"
                  onClick={onAddComparisonImage}
                  className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
                >
                  <ArrowRight className="w-3 h-3" />
                  Add Comparison Image
                </button>
              )}
              {!req.met && req.id === 'ev-sar' && onAddSarImage && (
                <button
                  type="button"
                  onClick={onAddSarImage}
                  className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
                >
                  <ArrowRight className="w-3 h-3" />
                  Add SAR Image
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Footer transition cue */}
      <div className="border-t border-slate-200 px-4 py-2 bg-blue-50 flex items-center gap-2">
        <ArrowRight className="w-3.5 h-3.5 text-blue-800 shrink-0" />
        <p className="text-[11px] text-blue-900 font-medium">
          SatQuery will now build an Evidence Plan.
        </p>
      </div>
    </div>
  );
};

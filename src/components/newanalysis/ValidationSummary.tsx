import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { UnderstandResponse } from '../../services/analysisService';

interface ValidationSummaryProps {
  status: UnderstandResponse['validationStatus'] | null;
  onAddComparisonImage?: () => void;
  onAddSarImage?: () => void;
}

interface CheckRowProps {
  passed: boolean;
  label: string;
  action?: React.ReactNode;
}

const CheckRow: React.FC<CheckRowProps> = ({ passed, label, action }) => (
  <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0">
    <div className="flex items-center gap-2">
      {passed ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      )}
      <span className={`text-xs ${passed ? 'text-slate-700' : 'text-amber-700 font-medium'}`}>{label}</span>
    </div>
    {!passed && action}
  </div>
);

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  status,
  onAddComparisonImage,
  onAddSarImage,
}) => {
  if (!status) return null;

  const allGood = status.isReadyToContinue && status.missingItems.length === 0;

  return (
    <div
      className={`border rounded overflow-hidden ${
        allGood ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'
      }`}
      role="status"
      aria-live="polite"
    >
      {/* Header */}
      <div
        className={`flex items-center gap-2 px-4 py-2 border-b ${
          allGood ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
        }`}
      >
        {allGood ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        )}
        <p
          className={`text-[11px] font-bold uppercase tracking-wider ${
            allGood ? 'text-emerald-800' : 'text-amber-800'
          }`}
        >
          {allGood ? 'Input Check — All Requirements Met' : 'Input Check — Additional Evidence Required'}
        </p>
      </div>

      {/* Checks */}
      <div className="px-4 py-1">
        <CheckRow passed={status.imageLoaded} label="Image loaded" />
        <CheckRow passed={status.spatialMetadataDetected} label="Spatial metadata detected" />
        <CheckRow passed={status.queryProvided} label="Query provided" />
        {status.temporalPairAvailable !== undefined && (
          <CheckRow
            passed={status.temporalPairAvailable}
            label="Comparison image available (temporal pair)"
            action={
              onAddComparisonImage ? (
                <button
                  type="button"
                  onClick={onAddComparisonImage}
                  className="text-[10px] font-semibold text-blue-800 hover:underline whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
                >
                  + Add Comparison Image
                </button>
              ) : undefined
            }
          />
        )}
        {status.sarAvailable !== undefined && (
          <CheckRow
            passed={status.sarAvailable}
            label="SAR evidence available"
            action={
              !status.sarAvailable && onAddSarImage ? (
                <button
                  type="button"
                  onClick={onAddSarImage}
                  className="text-[10px] font-semibold text-blue-800 hover:underline whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
                >
                  + Add SAR Image
                </button>
              ) : undefined
            }
          />
        )}
      </div>

      {/* Missing items summary */}
      {status.missingItems.length > 0 && (
        <div className="border-t border-amber-200 px-4 py-2.5 bg-amber-50">
          <ul className="space-y-1">
            {status.missingItems.map((item: string) => (
              <li key={item} className="flex items-start gap-2 text-[11px] text-amber-800">
                <AlertTriangle className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface ContinueButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading?: boolean;
  onClear: () => void;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  onClick,
  disabled,
  loading = false,
  onClear,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-200">
      {/* Helper text when disabled */}
      <p className="text-xs text-slate-500 max-w-md">
        {disabled
          ? 'An image and a question are required before continuing.'
          : 'Input check passed. SatQuery will now prepare an automated evidence plan.'}
      </p>

      <div className="flex items-center gap-3 shrink-0">
        {/* Clear */}
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          aria-label="Clear all inputs"
        >
          Clear Analysis
        </button>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={onClick}
          disabled={disabled || loading}
          aria-label="Continue to Evidence Plan"
          className={`flex items-center gap-2 px-6 py-2.5 rounded text-sm font-bold tracking-wide transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-700
            ${disabled || loading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-blue-900 hover:bg-blue-800 text-white border border-blue-900 shadow-sm'
            }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Preparing…</span>
            </>
          ) : (
            <>
              <span>Continue to Evidence Plan</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

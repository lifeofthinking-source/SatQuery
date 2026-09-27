import React from 'react';
import { Check } from 'lucide-react';

interface WorkflowStep {
  number: string;
  label: string;
}

interface WorkflowIndicatorProps {
  activeStep: number; // 0-indexed
}

const STEPS: WorkflowStep[] = [
  { number: '01', label: 'Input' },
  { number: '02', label: 'Evidence Plan' },
  { number: '03', label: 'Analysis' },
  { number: '04', label: 'Verification' },
  { number: '05', label: 'Results' },
];

export const WorkflowIndicator: React.FC<WorkflowIndicatorProps> = ({ activeStep }) => {
  return (
    <div className="flex items-center gap-0" role="list" aria-label="Analysis workflow stages">
      {STEPS.map((step, idx) => {
        const isActive = idx === activeStep;
        const isComplete = idx < activeStep;
        const isLast = idx === STEPS.length - 1;

        return (
          <React.Fragment key={step.number}>
            <div
              role="listitem"
              aria-current={isActive ? 'step' : undefined}
              className="flex items-center gap-1.5"
            >
              {/* Step circle */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border
                  ${isComplete
                    ? 'bg-blue-900 border-blue-900 text-white'
                    : isActive
                      ? 'bg-blue-900 border-blue-900 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
              >
                {isComplete ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : step.number}
              </div>

              {/* Step label */}
              <span
                className={`text-[11px] font-semibold tracking-wide whitespace-nowrap
                  ${isActive
                    ? 'text-blue-900'
                    : isComplete
                      ? 'text-slate-500'
                      : 'text-slate-400'
                  }`}
              >
                {step.number} {step.label}
              </span>
            </div>

            {/* Connector arrow */}
            {!isLast && (
              <div className="flex items-center mx-2">
                <div className={`h-px w-6 ${idx < activeStep ? 'bg-blue-900' : 'bg-slate-200'}`} />
                <div
                  className={`border-t border-r w-1.5 h-1.5 -ml-px
                    ${idx < activeStep ? 'border-blue-900' : 'border-slate-300'}
                    rotate-45`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

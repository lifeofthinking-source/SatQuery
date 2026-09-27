import React from 'react';
import { useApp } from '../../context/AppContext';
import { EXECUTION_STEPS } from '../../data/mockData';
import { CheckCircle2, Clock, Activity, ArrowRight, ShieldCheck, Terminal, Layers } from 'lucide-react';

export const LiveAnalysisPage: React.FC = () => {
  const {
    currentExecutionIndex,
    isSimulating,
    setCurrentRoute
  } = useApp();

  const progressPercentage = Math.round(
    ((currentExecutionIndex + 1) / EXECUTION_STEPS.length) * 100
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
          <span>Stage 05 · Agentic Multi-Model Pipeline</span>
          {isSimulating && (
            <span className="flex items-center gap-1 text-blue-900 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700 animate-ping" />
              <span>LIVE ORCHESTRATION IN PROGRESS</span>
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          SatQuery Analysis in Progress
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Coordinating multi-modal feature differencing, microwave SAR backscatter validation, and GIS topological measurements.
        </p>
      </div>

      {/* Progress Bar & Status Ribbon */}
      <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="font-mono uppercase tracking-wider text-slate-300">
              Pipeline Stage: {currentExecutionIndex + 1} of {EXECUTION_STEPS.length}
            </span>
          </div>
          <span className="font-mono text-blue-400 font-bold">
            {progressPercentage}% Completed
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
          <span>Active Process: {EXECUTION_STEPS[currentExecutionIndex]?.action}</span>
          <span>Tool: {EXECUTION_STEPS[currentExecutionIndex]?.toolModel}</span>
        </div>
      </div>

      {/* Vertical Execution Timeline */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          Vertical Execution Timeline
        </div>

        <div className="space-y-4">
          {EXECUTION_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentExecutionIndex;
            const isCurrent = idx === currentExecutionIndex && isSimulating;

            return (
              <div
                key={step.stepNumber}
                className={`flex items-start gap-4 p-3 rounded transition-colors ${
                  isCurrent
                    ? 'bg-blue-50/70 border border-blue-200'
                    : isCompleted
                    ? 'bg-slate-50/80 border border-slate-200'
                    : 'opacity-50'
                }`}
              >
                {/* Step Indicator */}
                <div className="pt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-mono text-slate-400">
                      {step.stepNumber}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {String(step.stepNumber).padStart(2, '0')} {step.action}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {step.toolModel}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-sans">
                    {step.output}
                  </div>

                  {step.details && isCompleted && (
                    <div className="text-[11px] text-slate-500 pt-1 font-mono">
                      ↳ {step.details}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>Analysis can be monitored through the execution trace at any time.</div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentRoute('execution-trace')}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold transition-colors flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>View Live Trace</span>
          </button>

          <button
            onClick={() => setCurrentRoute('verification')}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Proceed to Verification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * AnalysisOverlay.tsx
 *
 * The centerpiece of the New Analysis page.
 *
 * A single floating panel that transforms through these states:
 *   ANALYZING  → RESULT  (or INSUFFICIENT)
 *
 * Internal view machine:
 *   'progress'   – orchestration steps running one by one
 *   'fusion'     – evidence assembly display
 *   'challenge'  – verification checks
 *   'result'     – final answer + reasoning + evidence
 *   'insufficient' – scientifically responsible not-possible answer
 *
 * The box never navigates away. All transitions happen inside it.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import {
  ORCHESTRATION_STEPS,
  SELECTED_TOOLS,
  AnalysisResult,
  InsufficientResult,
  FinalResult,
} from '../../services/analysisService';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OverlayView = 'progress' | 'fusion' | 'challenge' | 'result' | 'insufficient';

export interface AnalysisOverlayProps {
  /** Which internal view is currently active */
  view: OverlayView;
  /** How many orchestration steps have completed (0-based count) */
  completedSteps: number;
  /** The final result once analysis is done */
  result: FinalResult | null;
  /** Dismiss / start new analysis */
  onClose: () => void;
  /** Map view tab for the result */
  mapTab: 'before' | 'after' | 'change';
  onMapTabChange: (t: 'before' | 'after' | 'change') => void;
  /** Image URLs for map previews */
  imageUrls: { primary: string; comparison: string; change: string };
}

// ─── Small helpers ────────────────────────────────────────────────────────────

const StepIcon: React.FC<{ status: 'waiting' | 'active' | 'done' }> = ({ status }) => {
  if (status === 'done')
    return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-label="Complete" />;
  if (status === 'active')
    return <Loader2 className="w-4 h-4 text-blue-700 animate-spin shrink-0" aria-label="Active" />;
  return <Circle className="w-4 h-4 text-slate-300 shrink-0" aria-label="Waiting" />;
};

const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 my-3">
    <div className="h-px flex-1 bg-slate-100" />
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    <div className="h-px flex-1 bg-slate-100" />
  </div>
);

const StatusBadge: React.FC<{ status: 'SUPPORTED' | 'PARTIALLY SUPPORTED' | 'INSUFFICIENT EVIDENCE' }> = ({ status }) => {
  const cfg = {
    'SUPPORTED':             'bg-emerald-50 text-emerald-800 border-emerald-300',
    'PARTIALLY SUPPORTED':   'bg-amber-50   text-amber-800   border-amber-300',
    'INSUFFICIENT EVIDENCE': 'bg-red-50     text-red-800     border-red-300',
  }[status];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider ${cfg}`}>
      {status}
    </span>
  );
};

// ─── Evidence fusion view ────────────────────────────────────────────────────

const EvidenceFusionView: React.FC = () => (
  <div className="space-y-4">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Evidence Assembled</p>
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        {[
          '2022 Optical',
          '2026 Optical',
          'SAR',
          'Change Detection',
          'Spatial Analysis',
        ].map((item, idx, arr) => (
          <React.Fragment key={item}>
            <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-medium text-slate-700">{item}</span>
            {idx < arr.length - 1 && <Plus className="w-3 h-3 text-slate-300 shrink-0" />}
          </React.Fragment>
        ))}
        <ArrowRight className="w-4 h-4 text-blue-700 mx-1 shrink-0" />
        <span className="px-2 py-1 bg-blue-900 text-white rounded font-semibold text-[11px]">Combined Evidence</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-1.5">
      {[
        'Temporal evidence',
        'Spatial evidence',
        'Multimodal evidence',
        'Quantitative evidence',
      ].map(ev => (
        <div key={ev} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="text-[11px] text-emerald-800 font-medium">{ev}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Challenge / verification view ───────────────────────────────────────────

const ChallengeView: React.FC<{ checks: AnalysisResult['verificationChecks'] }> = ({ checks }) => (
  <div className="space-y-3">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Challenge & Verification</p>
      <div className="divide-y divide-slate-100 border border-slate-200 rounded overflow-hidden">
        {checks.map(c => (
          <div key={c.label} className="flex items-center justify-between px-3 py-2 bg-white">
            <span className="text-xs text-slate-700">{c.label}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </div>
        ))}
      </div>
    </div>

    <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded">
      <span className="text-xs text-slate-600 font-medium">Evidence Status</span>
      <StatusBadge status="SUPPORTED" />
    </div>
  </div>
);

// ─── Execution trace (expandable) ────────────────────────────────────────────

const ExecutionTrace: React.FC<{ trace: AnalysisResult['executionTrace'] }> = ({ trace }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
        aria-expanded={open}
      >
        <span>View Execution Trace</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && (
        <div className="divide-y divide-slate-100">
          {trace.map((item, i) => (
            <div key={i} className="px-3 py-2 bg-white">
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-slate-400 mt-0.5 shrink-0 w-4">{i + 1}.</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-800">{item.step}</p>
                  <p className="text-[10px] text-slate-500">{item.tool}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{item.output}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Why this answer (expandable provenance) ─────────────────────────────────

const WhyThisAnswer: React.FC<{ claim: AnalysisResult['groundedClaim'] }> = ({ claim }) => {
  const [open, setOpen] = useState(false);
  const rows = [
    { label: 'Claim',             value: claim.claim },
    { label: 'Evidence',          value: claim.evidence },
    { label: 'Analysis',          value: claim.analysis },
    { label: 'Spatial Evidence',  value: claim.spatial },
    { label: 'Cross-modal Check', value: claim.crossModal },
    { label: 'Validation',        value: claim.validation },
  ];
  return (
    <div className="border border-blue-200 rounded overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 text-xs font-semibold text-blue-900 hover:bg-blue-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
        aria-expanded={open}
      >
        <span>Why this answer?</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && (
        <div className="bg-white divide-y divide-slate-100">
          {rows.map(row => (
            <div key={row.label} className="flex items-start gap-3 px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 w-28 shrink-0 pt-0.5">{row.label}</span>
              <span className="text-[11px] text-slate-700 leading-relaxed">{row.value}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50">
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 w-28 shrink-0">Conclusion</span>
            <StatusBadge status={claim.conclusion} />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Map preview tabs ─────────────────────────────────────────────────────────

const MapPreview: React.FC<{
  tab: 'before' | 'after' | 'change';
  onTab: (t: 'before' | 'after' | 'change') => void;
  urls: { primary: string; comparison: string; change: string };
}> = ({ tab, onTab, urls }) => {
  const src = tab === 'before' ? urls.comparison : tab === 'after' ? urls.primary : urls.change;
  const tabs: Array<{ key: 'before' | 'after' | 'change'; label: string }> = [
    { key: 'before',  label: 'Before' },
    { key: 'after',   label: 'After'  },
    { key: 'change',  label: 'Change Map' },
  ];
  return (
    <div className="border border-slate-200 rounded overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        {tabs.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => onTab(t.key)}
            className={`flex-1 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700
              ${tab === t.key
                ? 'bg-white text-blue-900 border-b-2 border-blue-900'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Image */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        <img
          key={src}
          src={src}
          alt={`Map view: ${tab}`}
          className="w-full h-full object-cover opacity-90"
          loading="lazy"
        />
        {tab === 'change' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/40 text-white text-[11px] font-semibold px-3 py-1 rounded">
              Demonstration — detected change regions highlighted
            </div>
          </div>
        )}
        <div className="absolute bottom-1.5 right-2 text-[9px] text-white/60 font-mono">
          DEMONSTRATION DATA
        </div>
      </div>
    </div>
  );
};

// ─── Result view (supported) ──────────────────────────────────────────────────

const ResultView: React.FC<{
  result: AnalysisResult;
  mapTab: 'before' | 'after' | 'change';
  onMapTab: (t: 'before' | 'after' | 'change') => void;
  imageUrls: AnalysisOverlayProps['imageUrls'];
  onClose: () => void;
}> = ({ result, mapTab, onMapTab, imageUrls, onClose }) => (
  <div className="space-y-4">
    {/* Status + headline */}
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1.5">
        <StatusBadge status={result.evidenceStatus} />
        <h3 className="text-base font-bold text-slate-900 leading-snug">{result.conclusionTitle}</h3>
      </div>
      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold whitespace-nowrap shrink-0 mt-1">
        Demonstration Result
      </span>
    </div>

    {/* Reasons */}
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        Why SatQuery reached this conclusion
      </p>
      <ol className="space-y-1.5">
        {result.reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
            <span className="w-4 h-4 rounded-full bg-blue-900 text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            {r}
          </li>
        ))}
      </ol>
    </div>

    {/* Stats summary */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {Object.entries(result.stats).map(([k, v]) => (
        <div key={k} className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded">
          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">
            {k.replace(/([A-Z])/g, ' $1').trim()}
          </p>
          <p className="text-xs font-semibold text-slate-800 leading-tight">{v}</p>
        </div>
      ))}
    </div>

    {/* Map */}
    <MapPreview tab={mapTab} onTab={onMapTab} urls={imageUrls} />

    {/* Evidence cards */}
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Supporting Evidence</p>
      <div className="grid grid-cols-4 gap-2">
        {result.evidenceCards.map(card => (
          <button
            key={card.id}
            type="button"
            className="flex flex-col items-center gap-1 px-2 py-2 border border-slate-200 rounded bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          >
            <span className="text-[11px] font-semibold text-slate-800">{card.label}</span>
            <span className="text-[10px] text-slate-400">{card.sublabel}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Why this answer + execution trace */}
    <WhyThisAnswer claim={result.groundedClaim} />
    <ExecutionTrace trace={result.executionTrace} />

    {/* Actions */}
    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
      <button
        type="button"
        className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded bg-white text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
      >
        View Evidence
      </button>
      <button
        type="button"
        className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded bg-white text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
      >
        Download Report
      </button>
      <button
        type="button"
        onClick={onClose}
        className="ml-auto px-4 py-1.5 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
      >
        New Analysis
      </button>
    </div>
  </div>
);

// ─── Insufficient evidence view ───────────────────────────────────────────────

const InsufficientView: React.FC<{ result: InsufficientResult; onClose: () => void }> = ({ result, onClose }) => (
  <div className="space-y-4">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <StatusBadge status="INSUFFICIENT EVIDENCE" />
        <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">{result.title}</h3>
      </div>
    </div>

    <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2.5 text-xs text-amber-900 leading-relaxed">
      <strong>Reason:</strong> {result.explanation}
    </div>

    <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2.5 text-[11px] text-slate-600 leading-relaxed italic">
      {result.scientificReason}
    </div>

    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        Additional evidence that could help
      </p>
      <ul className="space-y-1.5">
        {result.suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
            <ArrowRight className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
            {s}
          </li>
        ))}
      </ul>
    </div>

    <div className="flex gap-2 pt-2 border-t border-slate-200">
      <button
        type="button"
        className="flex-1 px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded bg-white text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
      >
        Add Evidence
      </button>
      <button
        type="button"
        className="flex-1 px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded bg-white text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
      >
        Modify Query
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex-1 px-3 py-1.5 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
      >
        New Analysis
      </button>
    </div>
  </div>
);

// ─── Progress view ────────────────────────────────────────────────────────────

const ProgressView: React.FC<{
  completedSteps: number;
  view: OverlayView;
  result: FinalResult | null;
}> = ({ completedSteps, view }) => {
  const totalSteps = ORCHESTRATION_STEPS.length;
  const allDone = completedSteps >= totalSteps;

  return (
    <div className="space-y-4">
      {/* Step list */}
      <div className="space-y-0 divide-y divide-slate-50">
        {ORCHESTRATION_STEPS.map((step, i) => {
          const done   = i < completedSteps;
          const active = i === completedSteps && !allDone;
          const status: 'waiting' | 'active' | 'done' = done ? 'done' : active ? 'active' : 'waiting';

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 py-2.5 transition-opacity ${
                status === 'waiting' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <div className="mt-0.5"><StepIcon status={status} /></div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-semibold ${done ? 'text-slate-800' : active ? 'text-blue-900' : 'text-slate-400'}`}>
                  {step.label}
                </p>
                {done && (
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{step.detail}</p>
                )}
                {active && (
                  <p className="text-[11px] text-blue-600 mt-0.5">Processing…</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tool selection – appears after step 3 (tool-selection) completes */}
      {completedSteps >= 4 && (
        <>
          <SectionDivider label="Selected automatically by SatQuery" />
          <div className="grid grid-cols-2 gap-2">
            {SELECTED_TOOLS.map(tool => (
              <div key={tool.name} className="flex items-start gap-2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-1.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-800">{tool.name}</p>
                  <p className="text-[10px] text-slate-500">{tool.role}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Fusion phase – rendered within progress box */}
      {view === 'fusion' && (
        <>
          <SectionDivider label="Evidence Fusion" />
          <EvidenceFusionView />
        </>
      )}

      {/* Challenge phase */}
      {view === 'challenge' && (
        <>
          <SectionDivider label="Challenge & Verification" />
          <EvidenceFusionView />
          <ChallengeView
            checks={[
              { label: 'Temporal consistency',      passed: true },
              { label: 'Spatial consistency',       passed: true },
              { label: 'Change-region consistency', passed: true },
              { label: 'Optical evidence',          passed: true },
              { label: 'SAR evidence',              passed: true },
            ]}
          />
        </>
      )}

      {/* Progress bar */}
      <div className="pt-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
          <span>Analysis progress</span>
          <span>{Math.min(completedSteps, totalSteps)}/{totalSteps} steps</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-700 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((completedSteps / totalSteps) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Main overlay ─────────────────────────────────────────────────────────────

export const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({
  view,
  completedSteps,
  result,
  onClose,
  mapTab,
  onMapTabChange,
  imageUrls,
}) => {
  const isResult      = view === 'result';
  const isInsufficient = view === 'insufficient';
  const isDone        = isResult || isInsufficient;

  const title = isDone
    ? isInsufficient
      ? 'SatQuery Analysis Result'
      : 'SatQuery Analysis Result'
    : 'SatQuery is analyzing your request';

  const subtitle = isDone
    ? undefined
    : view === 'fusion'
      ? 'Assembling and fusing evidence…'
      : view === 'challenge'
        ? 'Challenging and verifying result…'
        : 'Building and verifying the required evidence…';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-40 bg-slate-900/30 flex items-start justify-center pt-12 pb-8 px-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="SatQuery Analysis"
    >
      {/* Floating panel */}
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-xl flex flex-col">

        {/* ── Panel header ─────────────────────────────────────────────── */}
        <div className={`flex items-start justify-between px-5 py-4 border-b border-slate-200 rounded-t-lg ${
          isDone ? 'bg-white' : 'bg-blue-900'
        }`}>
          <div className="flex items-start gap-3">
            {!isDone && (
              <div className="mt-0.5 shrink-0">
                <Loader2 className="w-4 h-4 text-blue-200 animate-spin" />
              </div>
            )}
            {isDone && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            )}
            <div>
              <h2 className={`text-sm font-bold tracking-wide ${isDone ? 'text-slate-900' : 'text-white'}`}>
                {title}
              </h2>
              {subtitle && (
                <p className="text-[11px] text-blue-200 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Close button — only available once result is shown */}
          {isDone && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded p-1 -mr-1"
              aria-label="Close and start new analysis"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Panel body ───────────────────────────────────────────────── */}
        <div className="px-5 py-4 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {!isDone && (
            <ProgressView completedSteps={completedSteps} view={view} result={result} />
          )}

          {isResult && result && 'conclusionTitle' in result && (
            <ResultView
              result={result as AnalysisResult}
              mapTab={mapTab}
              onMapTab={onMapTabChange}
              imageUrls={imageUrls}
              onClose={onClose}
            />
          )}

          {isInsufficient && result && 'title' in result && (
            <InsufficientView result={result as InsufficientResult} onClose={onClose} />
          )}
        </div>

        {/* ── Panel footer ─────────────────────────────────────────────── */}
        {!isDone && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-lg">
            <p className="text-[10px] text-slate-400 italic">
              Model and tool selection is determined automatically by SatQuery's evidence-adaptive orchestration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

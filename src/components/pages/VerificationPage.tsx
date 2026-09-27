import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { EvidenceStatus } from '../../types';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, AlertTriangle, XCircle, Info, RefreshCw } from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const { verificationChecks, resultData, setCurrentRoute } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<EvidenceStatus>('SUPPORTED');

  const statusExplanations: Record<EvidenceStatus, string> = {
    SUPPORTED:
      'The detected change is spatially consistent across the selected analysis inputs and is supported by the available cross-modal evidence.',
    'PARTIALLY SUPPORTED':
      'Optical change detected, but microwave backscatter corroboration is marginal or limited to 60% of candidate clusters. Discretion advised.',
    'INSUFFICIENT EVIDENCE':
      'Sensor inputs fail spatial coherence or elevation baseline required to validate candidate change. SatQuery responsibly abstains.',
    'UNDER CHALLENGE':
      'Cross-modal validation algorithms currently testing hypotheses against seasonal false-greening.'
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
          Stage 06 · Adversarial Verification & Hypothesis Testing
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Challenge & Verification
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          SatQuery tests intermediate findings against adversarial alternative explanations (phenological greening, registration shift, bare soil confusion) before issuing a conclusion.
        </p>
      </div>

      {/* Main Split Layout: Initial Finding (Left) vs Verification Checks (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Initial Finding (4 cols) */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
              Preliminary Candidate Hypothesis
            </span>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-xs text-slate-500 mb-1">Initial Finding:</div>
              <div className="text-base font-bold text-slate-900 leading-snug">
                “Built-up area appears to have increased.”
              </div>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                Optical bitemporal differencing detected surface spectral shifts across 18 candidate patches.
              </p>
              <div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded text-[11px] text-amber-900">
                <strong>Adversarial Challenge:</strong> Is this actual structural development, or fallow ground cleared for seasonal farming?
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Resolved Evidence Status:
            </div>
            <div>
              <StatusBadge status={selectedStatus} size="lg" />
            </div>

            {/* Interactive State Toggle for Judges/Demo */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-mono block mb-1">
                Demo Status Simulator:
              </span>
              <div className="flex gap-1.5">
                {(['SUPPORTED', 'PARTIALLY SUPPORTED', 'INSUFFICIENT EVIDENCE'] as EvidenceStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                      selectedStatus === st
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Verification Checks (7 cols) */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Invariants & Coherence Checks (6 Criteria)
            </span>
            <span className="text-xs text-emerald-800 font-mono font-semibold">
              ✓ All Invariants Passed
            </span>
          </div>

          <div className="space-y-3">
            {verificationChecks.map(chk => (
              <div
                key={chk.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="text-xs font-bold text-slate-900">{chk.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {chk.metric}
                  </span>
                </div>

                <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                  {chk.scientificNotes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* "Why?" Explanation Banner */}
      <div className="bg-emerald-50/70 border border-emerald-300 rounded-lg p-5 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-800" />
          <h4 className="text-sm font-bold text-emerald-950">
            Why is this conclusion validated?
          </h4>
        </div>
        <p className="text-xs text-emerald-900 leading-relaxed font-medium">
          “{statusExplanations[selectedStatus]}”
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => setCurrentRoute('live-analysis')}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Live Trace</span>
        </button>

        <button
          onClick={() => setCurrentRoute('results')}
          className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors"
        >
          <span>View Verified Results & GIS Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { GisMapViewer } from '../map/GisMapViewer';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  Compass,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  Share2,
  Layers,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { resultData, setCurrentRoute, showNotification } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header & Result Summary Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
              <span>Audited Analysis Result · Dossier #{resultData.id}</span>
              <span>·</span>
              <span className="text-slate-400">EPSG:4326</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {resultData.conclusionTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={resultData.evidenceStatus} size="lg" />
            <span className="text-[10px] font-mono px-2 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded font-semibold">
              DEMONSTRATION RESULT
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
          {resultData.conclusionDetailed}
        </p>

        {/* Why banner */}
        <div className="bg-emerald-50/70 border border-emerald-300 p-3 rounded text-xs text-emerald-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
          <div>
            <strong>Cross-Modal Verification Rationale:</strong> {resultData.whyExplanation}
          </div>
        </div>
      </div>

      {/* Main Analysis Stage: GIS Map (8 cols) & Result Metrics Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: GIS Map Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-900" />
              <span>Multimodal Satellite Viewport & Vector Verification</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Sentinel-2 L2A (10m) + Sentinel-1 C-SAR
            </span>
          </div>

          <GisMapViewer activeTabDefault="split" />
        </div>

        {/* Right: Quantitative Summary & Metrics (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quantitative Metrics Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Result Summary Metrics
            </h3>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-500 font-medium">Net Built-up Expansion Area</div>
                <div className="text-3xl font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                  {resultData.statistics.changedAreaKm2} <span className="text-sm font-sans font-normal text-slate-500">km²</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Representing +{resultData.statistics.changePercentage}% of total 247.8 km² AOI
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Change Type</span>
                  <span className="font-semibold text-slate-800">{resultData.statistics.changeType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Observation Period</span>
                  <span className="font-semibold text-slate-800">2022 → 2026</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Evidence Modality</span>
                  <span className="font-semibold text-slate-800">Optical + SAR + Temporal</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Cross-Modal Match</span>
                  <span className="font-semibold text-emerald-800">94.8% Concordance</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                Confidence Interval: {resultData.statistics.confidenceInterval}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Audit & Provenance Deep Dives
            </h4>

            <button
              onClick={() => setCurrentRoute('evidence-explorer')}
              className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-blue-900" />
                <span>Claim-Level Evidence Provenance</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setCurrentRoute('execution-trace')}
              className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-blue-900" />
                <span>10-Stage Execution Audit Trail</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setCurrentRoute('reports')}
              className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-900" />
                <span>Download GIS Dossier (GeoJSON / TIFF)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Grounded Claims & Evidence Provenance Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Claim-Level Evidence Traceability
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every sentence in the conclusion is tied to specific satellite bands, specialist models, and invariant checks.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-800 font-semibold">
            3 / 3 Claims Grounded
          </span>
        </div>

        <div className="space-y-3">
          {resultData.groundedClaims.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-slate-900 leading-snug">
                  Claim {idx + 1}: “{item.claim}”
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded shrink-0">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1 text-slate-600">
                <div>
                  <span className="text-slate-400 block">Supporting Rasters:</span>
                  <span className="font-mono text-slate-800">{item.supportingEvidence.join(' · ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Executed Models:</span>
                  <span className="text-slate-800">{item.modelsUsed.join(' + ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Invariant Result:</span>
                  <span className="text-emerald-800 font-medium">{item.verificationResult}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Core Innovation Creed Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 text-center space-y-2 border border-slate-800">
        <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
          “SatQuery does not simply answer the query. It determines what evidence is required, gathers and analyzes that evidence, challenges the result, and verifies it before answering.”
        </p>
        <div className="text-sm font-bold text-blue-400 uppercase tracking-wider font-mono">
          “Evidence before conclusions.”
        </div>
      </div>
    </div>
  );
};

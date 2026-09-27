import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, BookOpen, ShieldCheck, Compass, CheckCircle2, AlertTriangle, XCircle, Layers } from 'lucide-react';

export const HelpModal: React.FC = () => {
  const { showHelpModal, setShowHelpModal } = useApp();

  if (!showHelpModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 border border-slate-300 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-900" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                SatQuery AI – Operational & Methodological Guide
              </h3>
              <p className="text-xs text-slate-500">
                Smart India Hackathon 2026 Problem Statement 26167 Architecture
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHelpModal(false)}
            className="text-slate-500 hover:text-slate-800 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          <section className="bg-blue-50/60 p-4 border border-blue-200 rounded">
            <h4 className="font-bold text-blue-950 text-sm mb-1.5 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-800" />
              <span>Core Paradigm: Evidence Before Conclusions</span>
            </h4>
            <p>
              Traditional vision-language models answer remote sensing questions directly, often hallucinating changes caused by seasonal phenology or cloud shadow artifacts. SatQuery AI decomposes natural language queries into an explicit <strong>Evidence Plan</strong> first. It only selects specialist models when justified by required evidence types, then subjects preliminary detections to automated challenge checks.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Key Specialist Models</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="font-semibold text-slate-900">DeltaView (Change Detection)</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Siamese deep feature differencing across multi-temporal optical acquisitions with phenological invariance.
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="font-semibold text-slate-900">Opt-SAR Fusion Engine</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Cross-modal radar microwave backscatter checks (VV+VH) to confirm physical structures versus cleared bare ground.
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="font-semibold text-slate-900">GeoChat (VQA & Grounding)</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Regional object localization, semantic attribute classification, and spatial bounding coordinate identification.
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="font-semibold text-slate-900">GIS Engine (GDAL / GeoPandas)</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Rigorous ellipsoidal geodesic surface area computation, topological boundary dissolving, and GeoJSON generation.
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">The 3 Evidence Status Tiers</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-900">SUPPORTED:</strong> All cross-modal, temporal, and spatial invariant checks pass. Findings are scientifically substantiated.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900">PARTIALLY SUPPORTED:</strong> Incomplete sensor coverage or slight seasonal ambiguity detected. User is alerted to caution before decision making.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-900">INSUFFICIENT EVIDENCE (Abstention):</strong> Input imagery cannot mathematically substantiate the question (e.g., building height from monoscopic 10m imagery). Rather than guessing, SatQuery explicitly specifies what additional sensors (Stereo, LiDAR) are needed.
                </div>
              </li>
            </ul>
          </section>

          <section className="border-t border-slate-200 pt-3 text-[11px] text-slate-500">
            <strong>Demonstration Notice:</strong> All imagery, coordinates, and statistics in this prototype are demonstration artifacts designed to showcase the complete workflow for Smart India Hackathon evaluation.
          </section>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={() => setShowHelpModal(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, ArrowRight, Compass, Cpu, CheckCircle2, ChevronRight, Layers, FileCheck, Database, Building2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentRoute, startAnalysisWorkflow } = useApp();

  return (
    <div className="w-full bg-white text-slate-900">
      {/* Official Prototype Announcement Strip */}
      <div className="bg-blue-50/70 border-b border-blue-200/80 py-2 px-4 text-center">
        <p className="text-xs text-blue-900 font-medium max-w-4xl mx-auto flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-700 animate-pulse" />
          <span>Smart India Hackathon 2026 Problem Statement 26167:</span>
          <span className="font-semibold">Interactive Vision-Language Assistant for Multimodal Remote Sensing</span>
        </p>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-800 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-800" />
            <span>National Earth Observation Decision Support</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans leading-[1.15] text-balance mb-5">
            Ask the Earth. <br />
            <span className="text-blue-900">Get the Evidence.</span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed text-balance mb-8 max-w-2xl font-normal">
            Transform natural-language satellite questions into verified, evidence-grounded Earth observation analysis.
            SatQuery automatically plans required evidence, coordinates optical and SAR specialist models, challenges intermediate findings, and delivers auditable answers.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentRoute('login')}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded font-semibold text-sm shadow-sm transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Government Login</span>
            </button>

            <button
              onClick={() => {
                startAnalysisWorkflow();
              }}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <span>Explore Demo Analysis</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Workflow Strip */}
        <div className="mt-14 pt-8 border-t border-slate-200">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">
            Core Architecture Workflow
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {[
              { step: '01', title: 'QUERY', desc: 'Natural Language Input' },
              { step: '02', title: 'PLAN', desc: 'Evidence-First Planning' },
              { step: '03', title: 'ANALYZE', desc: 'Specialist Models & GIS' },
              { step: '04', title: 'VERIFY', desc: 'Challenge & Invariants' },
              { step: '05', title: 'ANSWER', desc: 'Audited & Grounded' }
            ].map((st, i) => (
              <div
                key={st.step}
                className="bg-slate-50 border border-slate-200 p-3.5 rounded text-left relative"
              >
                <div className="text-[10px] font-mono text-slate-400 font-semibold mb-1">
                  STAGE {st.step}
                </div>
                <div className="font-bold text-slate-900 text-sm tracking-tight mb-0.5">
                  {st.title}
                </div>
                <div className="text-xs text-slate-600">{st.desc}</div>
                {i < 4 && (
                  <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                    ›
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Capability Cards */}
      <section className="bg-slate-50 border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-10">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Evidence-First Remote Sensing Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Designed to eliminate hallucinations, phenological bias, and unfounded conclusions in public sector decision making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Query-Driven Analysis
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ask satellite questions using natural language. The system extracts spatial, temporal, and semantic intent automatically without requiring manual parameter configuration.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
                Natural Language · Intent Parsing · Temporal Detection
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Multimodal Intelligence
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Coordinates optical multispectral (Sentinel-2), synthetic aperture radar (Sentinel-1 SAR), AI specialist models (DeltaView, GeoChat, Opt-SAR), and deterministic GIS measurement engines.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
                Optical + SAR Fusion · GDAL Topology · Siamese Differencing
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Evidence Verification
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Validates results and traces every conclusion back to supporting evidence. Automatically abstains or requests additional data when imagery cannot support mathematical proof.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
                Adversarial Challenge · Claim Provenance · Abstention Rigor
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Designed For Public-Sector Stakeholders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
            Institutional Beneficiaries
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Designed for Government & Scientific Missions
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { title: 'Government Departments', desc: 'Policy & Monitoring' },
            { title: 'Disaster Management', desc: 'Flood & Inundation' },
            { title: 'Urban Planning', desc: 'Encroachment & Built-up' },
            { title: 'Agriculture', desc: 'Crop Phenology & Acreage' },
            { title: 'Environment & Forestry', desc: 'Canopy Loss & Wetlands' },
            { title: 'Research & Academia', desc: 'Empirical Remote Sensing' }
          ].map(d => (
            <div
              key={d.title}
              className="p-4 bg-white border border-slate-200 rounded hover:border-slate-300 transition-colors"
            >
              <div className="font-semibold text-slate-900 text-xs mb-1">{d.title}</div>
              <div className="text-[11px] text-slate-500">{d.desc}</div>
            </div>
          ))}
        </div>

        {/* Prototype Callout Banner */}
        <div className="mt-12 bg-slate-100 border border-slate-200 p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              Ready to evaluate the SatQuery AI prototype?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Experience the full interactive workflow from natural-language query to evidence plan, live simulation, and verified GIS results.
            </p>
          </div>
          <button
            onClick={() => setCurrentRoute('login')}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded font-medium text-xs whitespace-nowrap"
          >
            Access Government Portal
          </button>
        </div>
      </section>
    </div>
  );
};

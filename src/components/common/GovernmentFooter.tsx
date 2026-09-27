import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Layers, HelpCircle, ExternalLink } from 'lucide-react';

export const GovernmentFooter: React.FC = () => {
  const { setCurrentRoute, setShowArchitectureModal, setShowHelpModal } = useApp();

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 text-xs">
      {/* Upper Footer: Value Proposition & Official Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-900 border border-blue-700 flex items-center justify-center text-white font-bold text-xs">
                SQ
              </div>
              <span className="text-base font-bold text-white tracking-tight">SatQuery AI</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                SIH 2026 PS 26167
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              An Interactive Vision-Language Assistant for Multimodal Remote Sensing Image Analysis through Natural Language Text Queries.
              Engineered with Evidence-Adaptive Planning, Specialist Model Orchestration, and Automated Adversarial Verification.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-blue-400 tracking-wide uppercase">
              “Evidence before conclusions.”
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentRoute('new-analysis')}
                  className="hover:text-white transition-colors"
                >
                  New Satellite Analysis
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('evidence-explorer')}
                  className="hover:text-white transition-colors"
                >
                  Claim Provenance Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('execution-trace')}
                  className="hover:text-white transition-colors"
                >
                  10-Stage Execution Audit Trail
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('reports')}
                  className="hover:text-white transition-colors"
                >
                  Official Analysis Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowArchitectureModal(true)}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <Layers className="w-3 h-3 text-blue-400" />
                  <span>System Architecture</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Stakeholders & Departments
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>Disaster Management Authorities</li>
              <li>Urban Planning & Municipal Corps</li>
              <li>Department of Agriculture & Farmers Welfare</li>
              <li>Ministry of Environment, Forest & Climate</li>
              <li>National Remote Sensing & Geospatial Centres</li>
              <li>Water Resources & Irrigation Wings</li>
            </ul>
          </div>
        </div>

        {/* Prototype & Methodology Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold text-slate-200">
              SatQuery AI | Smart India Hackathon 2026 Prototype
            </span>
            <span>·</span>
            <span>Earth Observation</span>
            <span>•</span>
            <span>Multimodal AI</span>
            <span>•</span>
            <span>GIS Analysis</span>
            <span>•</span>
            <span>Evidence-Based Verification</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHelpModal(true)}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Methodology & Help</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">
              Technology Demonstration (Fictional / Mock Imagery)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

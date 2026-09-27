import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Server, ShieldCheck, Cpu, Database, Compass, CheckCircle2, ArrowDown, ChevronRight, Layers } from 'lucide-react';

export const SystemArchitectureModal: React.FC = () => {
  const { showArchitectureModal, setShowArchitectureModal } = useApp();
  const [selectedNode, setSelectedNode] = useState<string>('orchestrator');

  if (!showArchitectureModal) return null;

  const architectureNodes = [
    {
      id: 'input',
      title: 'User Input & Query Interface',
      tag: 'Presentation Layer',
      icon: <Layers className="w-4 h-4 text-blue-400" />,
      desc: 'Captures natural language satellite questions and coordinates selection of multispectral/SAR input packages.',
      spec: 'React 19 / TypeScript, WCAG AA compliant, REST contract to FastAPI.'
    },
    {
      id: 'gateway',
      title: 'FastAPI Gateway & Auth Proxy',
      tag: 'Ingress & Security',
      icon: <Server className="w-4 h-4 text-cyan-400" />,
      desc: 'API routing, token authentication for government officers, rate limiting, and job queue dispatch.',
      spec: 'Python FastAPI asynchronous backend, OpenAPI 3.1 schema, GeoJSON payload validation.'
    },
    {
      id: 'validator',
      title: 'Geo Validator & Pre-flight Gate',
      tag: 'Sanity & Calibration',
      icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
      desc: 'Verifies spatial overlap, EPSG:4326/UTM CRS registration, acquisition timestamps, cloud masking, and GSD consistency before launching expensive compute.',
      spec: 'Rasterio / GDAL sub-pixel alignment, automated cloud threshold check (< 10%).'
    },
    {
      id: 'orchestrator',
      title: 'Evidence-Adaptive Orchestrator',
      tag: 'Core Innovation',
      icon: <Compass className="w-4 h-4 text-blue-400" />,
      desc: 'Transforms text query into formal Evidence Requirements (Temporal, Spatial, Analysis, Validation) rather than direct answer generation.',
      spec: 'Domain-adapted planning grammar, dynamically binds specialist pipelines.'
    },
    {
      id: 'registry',
      title: 'Specialist Model Registry',
      tag: 'Multimodal AI Models',
      icon: <Cpu className="w-4 h-4 text-indigo-400" />,
      desc: 'Host for targeted computer vision & vision-language models: DeltaView (bi-temporal change), GeoChat (regional localization), and Opt-SAR (optical-microwave fusion).',
      spec: 'PyTorch / TensorRT inference engines with ONNX export options.'
    },
    {
      id: 'gis',
      title: 'GIS Engine (GDAL / GeoPandas)',
      tag: 'Deterministic Geometry',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      desc: 'Extracts auditable geodesic metrics, dissolves vector boundaries, applies spatial exclusion masks, and calculates area.',
      spec: 'PROJ / GEOS / Shapely topology routines with ellipsoidal area computation.'
    },
    {
      id: 'fusion',
      title: 'Evidence Fusion (Graph Engine)',
      tag: 'Provenance Graph',
      icon: <Layers className="w-4 h-4 text-purple-400" />,
      desc: 'Aligns semantic claims with pixel coordinates, sensor timestamps, and model inference bounds into a connected directed acyclic graph (DAG).',
      spec: 'Claim-level provenance graph with cryptographic hash verification.'
    },
    {
      id: 'challenge',
      title: 'Challenge & Verification Engine',
      tag: 'Adversarial Rigor',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      desc: 'Applies automated adversarial tests: tests for false seasonal greening, validates SAR backscatter jump, and tests for co-registration drift.',
      spec: 'Invariant test suite, produces SUPPORTED, PARTIAL, or INSUFFICIENT status.'
    },
    {
      id: 'generator',
      title: 'Results & Audit Generator',
      tag: 'Output Synthesis',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      desc: 'Synthesizes natural language summary grounded strictly in verified evidence, accompanied by GeoTIFF and GeoJSON exports.',
      spec: 'OGC standard GIS outputs, printable PDF government dossier summary.'
    }
  ];

  const activeNodeDetails = architectureNodes.find(n => n.id === selectedNode) || architectureNodes[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-900 border border-blue-600 flex items-center justify-center text-blue-200">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                SatQuery AI – Technical Architecture Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                End-to-end Evidence-Adaptive Earth Observation Workflow (Smart India Hackathon 2026)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowArchitectureModal(false)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Diagram Stream (7 cols) */}
          <div className="md:col-span-7 space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Interactive Pipeline Flow</span>
              <span className="text-blue-400 text-[10px]">Click any stage to inspect</span>
            </div>

            <div className="space-y-1.5">
              {architectureNodes.map((node, idx) => {
                const isSelected = selectedNode === node.id;
                return (
                  <div key={node.id}>
                    <button
                      onClick={() => setSelectedNode(node.id)}
                      className={`w-full text-left p-3 rounded border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-950/80 border-blue-500 shadow-sm text-white'
                          : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-500 w-5">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="p-1 rounded bg-slate-800 border border-slate-700">
                          {node.icon}
                        </div>
                        <div>
                          <div className="text-xs font-semibold leading-tight">{node.title}</div>
                          <div className="text-[10px] text-slate-400">{node.tag}</div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-600'}`} />
                    </button>
                    {idx < architectureNodes.length - 1 && (
                      <div className="flex justify-center my-0.5">
                        <ArrowDown className="w-3 h-3 text-slate-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Detail Panel (5 cols) */}
          <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-950 text-blue-300 border border-blue-800 mb-2">
                {activeNodeDetails.tag}
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                {activeNodeDetails.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {activeNodeDetails.desc}
              </p>

              <div className="border-t border-slate-800 pt-3 mt-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Technical Specification:
                </span>
                <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                  {activeNodeDetails.spec}
                </p>
              </div>

              <div className="border-t border-slate-800 pt-3 mt-4">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Core Innovation Role:
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Decouples model execution from raw user prompts by interposing an explicit evidence plan and post-analysis adversarial verification gate.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-6 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Standard: ISRO / OGC Compliant</span>
              <span className="text-emerald-400">● READY FOR FASTAPI</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>“Evidence before conclusions.”</span>
          <button
            onClick={() => setShowArchitectureModal(false)}
            className="px-4 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            Close Architecture Drawer
          </button>
        </div>
      </div>
    </div>
  );
};

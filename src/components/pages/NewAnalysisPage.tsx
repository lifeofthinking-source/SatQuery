import React from 'react';
import { useApp } from '../../context/AppContext';
import { EXAMPLE_QUERIES } from '../../data/mockData';
import {
  Search,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Database,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const NewAnalysisPage: React.FC = () => {
  const {
    query,
    setQuery,
    dataset,
    loadDemoDataset,
    startAnalysisWorkflow,
    setCurrentRoute
  } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
          Stage 01 · Query Formulation & Multi-Sensor Input
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          New Satellite Analysis
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Enter a natural language inquiry regarding land use, structural development, disaster impact, or vegetation change. SatQuery AI will formulate an Evidence Plan and coordinate specialist models.
        </p>
      </div>

      {/* Query Formulation Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
            Describe the question you want to answer
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full p-3.5 text-sm sm:text-base border border-slate-300 rounded focus:border-blue-900 focus:outline-none font-sans text-slate-900 resize-none shadow-inner"
              placeholder="Example: Has the built-up area increased between these two dates, where did the change occur, and does the available SAR evidence support it?"
            />
          </div>
        </div>

        {/* Example Query Buttons */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Preset Evaluation Inquiries:
          </span>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map(item => (
              <button
                key={item.title}
                type="button"
                onClick={() => setQuery(item.query)}
                className={`px-3 py-1.5 rounded text-xs transition-colors border text-left ${
                  query === item.query
                    ? 'bg-blue-900 text-white border-blue-900 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Data Configuration Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Input Data & Satellite Packages
            </h2>
            <p className="text-xs text-slate-500">
              Multispectral optical imagery, synthetic aperture radar (SAR), and Area of Interest (AOI).
            </p>
          </div>

          <button
            onClick={loadDemoDataset}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-blue-800" />
            <span>Load Demo Dataset (Hyderabad Urban)</span>
          </button>
        </div>

        {/* 4 Cards: Optical Before, Optical After, SAR, AOI / Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card A: Optical Baseline */}
          <div className="bg-white border border-slate-200 rounded p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">A. Optical (Baseline)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  {dataset.opticalBefore.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono space-y-1">
                <div>Satellite: <strong className="text-slate-800">{dataset.opticalBefore.satellite}</strong></div>
                <div>Acquisition: <strong className="text-slate-800">{dataset.opticalBefore.date}</strong></div>
                <div>GSD: <strong className="text-slate-800">{dataset.opticalBefore.resolution}</strong></div>
                <div>Cloud: <strong className="text-slate-800">{dataset.opticalBefore.cloudCover}</strong></div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 truncate">
              {dataset.opticalBefore.fileName}
            </div>
          </div>

          {/* Card B: Optical Target */}
          <div className="bg-white border border-slate-200 rounded p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">B. Optical (Target Epoch)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  {dataset.opticalAfter.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono space-y-1">
                <div>Satellite: <strong className="text-slate-800">{dataset.opticalAfter.satellite}</strong></div>
                <div>Acquisition: <strong className="text-slate-800">{dataset.opticalAfter.date}</strong></div>
                <div>GSD: <strong className="text-slate-800">{dataset.opticalAfter.resolution}</strong></div>
                <div>Cloud: <strong className="text-slate-800">{dataset.opticalAfter.cloudCover}</strong></div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 truncate">
              {dataset.opticalAfter.fileName}
            </div>
          </div>

          {/* Card C: SAR Image */}
          <div className="bg-white border border-slate-200 rounded p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">C. SAR Microwave</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  {dataset.sarData.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono space-y-1">
                <div>Satellite: <strong className="text-slate-800">{dataset.sarData.satellite}</strong></div>
                <div>Acquisition: <strong className="text-slate-800">{dataset.sarData.date}</strong></div>
                <div>Polarization: <strong className="text-slate-800">{dataset.sarData.polarization}</strong></div>
                <div>Mode: <strong className="text-slate-800">{dataset.sarData.orbitPass}</strong></div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 truncate">
              {dataset.sarData.fileName}
            </div>
          </div>

          {/* Card D: AOI & Coordinate System */}
          <div className="bg-white border border-slate-200 rounded p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">D. AOI / Cadastral Bounds</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                  {dataset.aoi.crs}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono space-y-1">
                <div>Region: <strong className="text-slate-800">{dataset.aoi.regionName.split('(')[0]}</strong></div>
                <div>Centroid: <strong className="text-slate-800">17.588° N, 78.510° E</strong></div>
                <div>Total Extent: <strong className="text-slate-800">{dataset.aoi.areaKm2} km²</strong></div>
                <div>Geometry: <strong className="text-slate-800">{dataset.aoi.format}</strong></div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 truncate">
              BBox: [{dataset.aoi.bbox.join(', ')}]
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer: Validation Gate Transition */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-800 shrink-0" />
          <span>
            Inputs must pass the <strong>Pre-flight Geo Validation Gate</strong> before evidence planning and specialist model execution.
          </span>
        </div>

        <button
          onClick={() => startAnalysisWorkflow(query)}
          className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded font-semibold text-xs shadow-sm transition-colors flex items-center gap-2"
        >
          <span>Proceed to Input Validation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

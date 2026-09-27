import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, Eye, CheckCircle2, ShieldCheck, Database, Layers, X } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { resultData, dataset, showNotification } = useApp();
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const handleDownloadGeoJson = () => {
    const geojsonData = {
      type: 'FeatureCollection',
      name: 'SatQuery_BuiltUp_Change_Mask_2022_2026',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: [
        {
          type: 'Feature',
          properties: {
            cluster_id: 'CL-01',
            area_km2: 2.45,
            change_type: 'Industrial Warehouse Expansion',
            sar_delta_db: '+5.4 dB',
            confidence: 0.962
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [78.485, 17.618],
                [78.495, 17.618],
                [78.495, 17.625],
                [78.485, 17.625],
                [78.485, 17.618]
              ]
            ]
          }
        },
        {
          type: 'Feature',
          properties: {
            cluster_id: 'CL-02',
            area_km2: 3.12,
            change_type: 'Multi-Storey Residential Layout',
            sar_delta_db: '+4.8 dB',
            confidence: 0.948
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [78.528, 17.581],
                [78.536, 17.581],
                [78.536, 17.589],
                [78.528, 17.589],
                [78.528, 17.581]
              ]
            ]
          }
        }
      ]
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojsonData, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'SatQuery_Hyderabad_Builtup_Change_Mask.geojson');
    document.body.appendChild(a);
    a.click();
    a.remove();
    showNotification('Downloaded GeoJSON Vector Change footprint.');
  };

  const reportsList = [
    {
      id: 'rep-full',
      title: 'Official Analysis Dossier',
      category: 'Executive Government Dossier',
      format: 'PDF / Printable Report',
      description: 'Comprehensive 4-page technical dossier with executive findings, land change statistics, cross-modal verification checks, and signature clearance block.',
      status: 'Ready for Export'
    },
    {
      id: 'rep-evidence',
      title: 'Evidence & Invariant Summary',
      category: 'Scientific Audit Report',
      format: 'Markdown / HTML Report',
      description: 'Claim-level evidence breakdown detailing Sentinel-2 optical bands, Sentinel-1 C-SAR backscatter values, and phenological invariance tests.',
      status: 'Ready for Export'
    },
    {
      id: 'rep-trace',
      title: '10-Step Execution Trace Log',
      category: 'System & Compute Audit',
      format: 'CSV / JSON Audit Ledger',
      description: 'Machine-readable log of all 10 stages: model execution latencies, sub-pixel co-registration errors, and GDAL geodesic area calculations.',
      status: 'Ready for Export'
    },
    {
      id: 'rep-geojson',
      title: 'Vector GeoJSON Footprint',
      category: 'GIS Vector Layer',
      format: 'GeoJSON (EPSG:4326)',
      description: 'Polygon vectors for all 15 confirmed built-up expansion clusters (12.4 km²) with bounding coordinates and attribute tags.',
      status: 'Ready for Download',
      onDownload: handleDownloadGeoJson
    },
    {
      id: 'rep-geotiff',
      title: 'Classified GeoTIFF Raster',
      category: 'Remote Sensing Matrix',
      format: 'Cloud Optimized GeoTIFF (COG)',
      description: '10-meter ground resolution classified raster matrix with bands for pre-change, post-change, and probability surface.',
      status: 'Ready for Download',
      onDownload: () => showNotification('Generated Cloud-Optimized GeoTIFF raster artifact.')
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
          Official Exports & Interoperability
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Analysis Reports
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Download standardized government dossiers, OGC-compliant GIS vectors, classified rasters, and audit traces for regulatory and planning archival.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportsList.map(report => (
          <div
            key={report.id}
            className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 rounded">
                  {report.category}
                </span>
                <span className="text-xs font-mono text-emerald-700 font-medium">
                  {report.format}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">
                {report.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {report.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                CRS: {dataset.aoi.crs}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePreview(report.id)}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => {
                    if (report.onDownload) {
                      report.onDownload();
                    } else {
                      showNotification(`Downloaded ${report.title}`);
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-slate-300 rounded-lg max-w-2xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Document Preview: {reportsList.find(r => r.id === activePreview)?.title}
              </h3>
              <button
                onClick={() => setActivePreview(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs font-mono text-slate-800 space-y-2 max-h-80 overflow-y-auto">
              <div>GOVERNMENT OF INDIA · TECHNOLOGY DEMONSTRATION</div>
              <div>SATQUERY AI EXECUTIVE DOSSIER #{resultData.id}</div>
              <div>--------------------------------------------------</div>
              <div>QUERY: {resultData.query}</div>
              <div>REGION: {resultData.region}</div>
              <div>PERIOD: {resultData.period}</div>
              <div>EVIDENCE STATUS: {resultData.evidenceStatus} (VERIFIED)</div>
              <div>NET BUILT-UP EXPANSION: 12.4 km² (5.01% AOI)</div>
              <div>MICROWAVE BACKSCATTER CONFIRMATION: +4.8 dB</div>
              <div>OPTICAL SENSORS: Sentinel-2B (2022) / Sentinel-2A (2026)</div>
              <div>SAR SENSOR: Sentinel-1A C-SAR Dual-Pol VV+VH (2026)</div>
              <div>INVARIANTS: 6 / 6 PASSED (No seasonal greening detected)</div>
              <div>--------------------------------------------------</div>
              <div>AUTHORIZED DIGITAL STAMP: AUDITED EVIDENCE RECORD</div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActivePreview(null)}
                className="px-4 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  showNotification('Exported PDF Report Dossier.');
                  setActivePreview(null);
                }}
                className="px-4 py-1.5 bg-blue-900 text-white rounded text-xs font-semibold"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

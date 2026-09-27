import React, { useState } from 'react';
import { InspectedPointData, WishlistTarget } from '../../types/inspector';
import {
  Crosshair,
  Bookmark,
  RefreshCw,
  Download,
  LineChart,
  FileCode,
  Check,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Layers,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DataInspectorPanelProps {
  data: InspectedPointData;
  onRefreshQuickLook?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const DataInspectorPanel: React.FC<DataInspectorPanelProps> = ({
  data,
  onRefreshQuickLook,
  isOpen = true,
  onToggle
}) => {
  const { showNotification } = useApp();
  const [savedTargets, setSavedTargets] = useState<WishlistTarget[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [quickLookZoom, setQuickLookZoom] = useState<number>(15);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  const handleSaveToWishlist = () => {
    const newTarget: WishlistTarget = {
      id: `w-${Date.now()}`,
      targetId: data.targetId,
      region: data.resolvedRegion,
      lat: data.lat,
      lng: data.lng,
      timestamp: data.dataTimestamp,
      terrainType: data.terrainType,
      elevationMsl: data.elevationMsl
    };

    setSavedTargets(prev => [newTarget, ...prev]);
    setIsSaved(true);
    showNotification(`Target ${data.targetId} saved to Wishlist (${data.resolvedRegion})`);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCopyTargetId = () => {
    navigator.clipboard?.writeText(data.targetId);
    setCopiedId(true);
    showNotification(`Copied Target ID: ${data.targetId}`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadFITS = () => {
    const fitsContent = `SIMPLE  =                    T / file conforms to FITS standard
BITPIX  =                  -32 / 32-bit floating point pixels
NAXIS   =                    2 / number of data axes
NAXIS1  =                  512 / length of data axis 1
NAXIS2  =                  512 / length of data axis 2
TARGET  = '${data.targetId}'
REGION  = '${data.resolvedRegion}'
LAT     =  ${data.lat.toFixed(6)} / decimal degrees
LON     =  ${data.lng.toFixed(6)} / decimal degrees
DATE-OBS= '${data.dataTimestamp}' / Sentinel-2 L2A acquisition
ELEV-MSL=  ${data.elevationMsl} / meters above mean sea level
NDVI    =  ${data.ndvi} / Normalized Difference Vegetation Index
SAR_DB  =  ${data.sarBackscatterDb} / VV+VH co-polarization backscatter (dB)
END`;
    const blob = new Blob([fitsContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.targetId}_EO_FITS.hdr`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification(`Downloading FITS Array Metadata for ${data.targetId}`);
  };

  const handleExportXML = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<GovEarthObservationMetadata version="2.4">
  <TargetInformation>
    <TargetID>${data.targetId}</TargetID>
    <ResolvedRegion>${data.resolvedRegion}</ResolvedRegion>
    <Coordinates srs="EPSG:4326">
      <Latitude>${data.lat.toFixed(6)}</Latitude>
      <Longitude>${data.lng.toFixed(6)}</Longitude>
      <ElevationMSL unit="meters">${data.elevationMsl}</ElevationMSL>
    </Coordinates>
    <Timestamp>${data.dataTimestamp}</Timestamp>
  </TargetInformation>
  <SensorsCrossMatch>
    <OpticalPlatform>Copernicus Sentinel-2B (MSI L2A)</OpticalPlatform>
    <Resolution>${data.gridResolution}</Resolution>
    <NDVI>${data.ndvi}</NDVI>
    <MicrowavePlatform>Copernicus Sentinel-1A (C-SAR IW)</MicrowavePlatform>
    <BackscatterDB>${data.sarBackscatterDb}</BackscatterDB>
    <TerrainClassification>${data.terrainType}</TerrainClassification>
  </SensorsCrossMatch>
</GovEarthObservationMetadata>`;
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.targetId}_metadata.xml`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification(`Exported Metadata XML for ${data.targetId}`);
  };

  if (!isOpen) {
    return (
      <div className="absolute top-16 right-0 z-30">
        <button
          onClick={onToggle}
          className="bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded-l-lg border-l border-y border-slate-300 shadow-md flex items-center gap-1.5 text-xs font-bold transition-all group"
          title="Open Data Inspector"
        >
          <Crosshair className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline font-mono tracking-wider text-slate-700">DATA INSPECTOR</span>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 md:w-88 shrink-0 bg-white text-slate-900 border-l border-slate-200 shadow-md flex flex-col h-full z-20 overflow-y-auto font-sans select-none transition-all">
      {/* Header Bar */}
      <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-slate-200 shrink-0 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-amber-500 animate-pulse" />
          <h2 className="text-xs font-bold tracking-wider uppercase font-mono text-slate-800">
            Data Inspector
          </h2>
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
            title="Collapse Inspector"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Section: Resolved Region */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase">
            Resolved Region
          </div>
          <div className="text-sm font-extrabold text-slate-900 leading-tight">
            {data.resolvedRegion}
          </div>
        </div>

        {/* Section: Target ID */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-mono font-bold text-slate-700">TARGET ID:</span>
          <button
            onClick={handleCopyTargetId}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-colors"
            title="Click to copy target ID"
          >
            <span>{data.targetId}</span>
            {copiedId ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <span className="text-[9px] text-emerald-600">copy</span>
            )}
          </button>
        </div>

        {/* Section: Save to Wishlist Button */}
        <button
          onClick={handleSaveToWishlist}
          disabled={isSaved}
          className={`w-full py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
            isSaved
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-700 hover:bg-emerald-600 text-white active:scale-98'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{isSaved ? 'Saved to Wishlist!' : 'Save to Wishlist'}</span>
        </button>

        {/* Section: Optical Quick Look */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-600 uppercase">
              Optical Quick Look
            </span>
            <button
              onClick={() => {
                if (onRefreshQuickLook) onRefreshQuickLook();
                showNotification(`Synchronized satellite quick-look for ${data.targetId}`);
              }}
              className="text-[11px] text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold"
              title="Sync preview tile"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync</span>
            </button>
          </div>

          {/* Quick Look Tile Container */}
          <div className="relative w-full h-32 rounded border border-slate-300 overflow-hidden bg-slate-950 shadow-inner group">
            {/* Live Satellite Tile Image */}
            <img
              src={data.tileUrl}
              alt="Optical Satellite Quick Look"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={e => {
                // Fallback to high-contrast satellite placeholder if tile server has latency
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
              }}
            />

            {/* Target Reticle Overlay (Orange AOI Box like in reference image) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4/5 h-4/5 border-2 border-amber-400/90 rounded-xs shadow-md relative">
                {/* Center crosshair pip */}
                <div className="absolute inset-0 m-auto w-2 h-2 bg-amber-400 rounded-full shadow-sm" />
                <div className="absolute top-1 left-1 text-[8px] font-mono text-amber-300 font-bold bg-black/60 px-1 rounded">
                  AOI 10m
                </div>
              </div>
            </div>

            {/* Scale readout */}
            <div className="absolute bottom-1 right-1 bg-black/70 text-slate-200 font-mono text-[9px] px-1.5 py-0.5 rounded backdrop-blur-xs">
              Z{data.zoom} · 10m GSD
            </div>
          </div>
        </div>

        {/* Section: Computed Metrics (Live) */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-700 uppercase">
              Computed Metrics (Live)
            </span>
            <span className="bg-red-100 text-red-700 border border-red-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase font-mono">
              Confidential
            </span>
          </div>

          {/* Metrics Table */}
          <div className="border border-slate-200 rounded divide-y divide-slate-100 text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50/70">
              <span className="text-slate-600 font-medium">Terrain Type</span>
              <span className="font-semibold text-slate-900 text-right truncate max-w-[170px]" title={data.terrainType}>
                {data.terrainType}
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5">
              <span className="text-slate-600 font-medium">Est. Elevation</span>
              <span className="font-mono font-bold text-slate-900">
                {data.elevationMsl}m (MSL)
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50/70">
              <span className="text-slate-600 font-medium">Grid Resolution</span>
              <span className="font-mono text-slate-800">
                {data.gridResolution}
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5">
              <span className="text-slate-600 font-medium">Data Timestamp</span>
              <span className="font-mono text-slate-800">
                {data.dataTimestamp}
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50/70">
              <span className="text-slate-600 font-medium">NDVI (Vegetation)</span>
              <span className="font-mono font-bold text-emerald-700">
                {data.ndvi.toFixed(2)} (Active)
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5">
              <span className="text-slate-600 font-medium">SAR Backscatter</span>
              <span className="font-mono font-bold text-blue-700">
                {data.sarBackscatterDb.toFixed(1)} dB (VV+VH)
              </span>
            </div>
          </div>
        </div>

        {/* Section: Action Links */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs">
          <button
            onClick={handleDownloadFITS}
            className="w-full text-left py-1 text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2 font-medium"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download FITS Array (Secure)</span>
          </button>

          <button
            onClick={() => showNotification(`Opened real-time telemetry stream for ${data.targetId}`)}
            className="w-full text-left py-1 text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2 font-medium"
          >
            <LineChart className="w-3.5 h-3.5 text-purple-600" />
            <span>Plot Regional Telemetry (Live)</span>
          </button>

          <button
            onClick={handleExportXML}
            className="w-full text-left py-1 text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2 font-medium"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export Metadata XML</span>
          </button>
        </div>

        {/* Section: Session Audit Log */}
        <div className="space-y-1 pt-1 border-t border-slate-100">
          <div className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase">
            Session Audit Log
          </div>
          <div className="bg-slate-50 text-slate-600 font-mono text-[10px] p-2.5 rounded border border-slate-200 space-y-0.8 max-h-24 overflow-y-auto leading-tight">
            {data.auditLogs.map((log, idx) => (
              <div key={idx} className="truncate">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

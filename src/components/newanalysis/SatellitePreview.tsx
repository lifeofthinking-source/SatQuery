import React, { useState } from 'react';
import {
  RefreshCw,
  Maximize2,
  Info,
  Satellite,
  Calendar,
  Crosshair,
  Layers,
  Map,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ImageMetadata } from '../../services/analysisService';

interface SatellitePreviewProps {
  metadata: ImageMetadata;
  imageUrl: string;
  onReplace: () => void;
  /** Badge variant: 'primary' | 'comparison' | 'sar' */
  variant?: 'primary' | 'comparison' | 'sar';
  /** Whether this panel is an "extra" (comparison / SAR) that can be removed */
  onRemove?: () => void;
}

const VARIANT_CONFIG = {
  primary: {
    label: 'Primary Image',
    badge: 'bg-blue-900 text-white',
    border: 'border-blue-200',
  },
  comparison: {
    label: 'Comparison Image',
    badge: 'bg-amber-700 text-white',
    border: 'border-amber-200',
  },
  sar: {
    label: 'SAR Image',
    badge: 'bg-slate-700 text-white',
    border: 'border-slate-300',
  },
};

interface MetaRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const MetaRow: React.FC<MetaRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 py-1.5 border-b border-slate-100 last:border-0">
    <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
    <span className="text-[11px] text-slate-500 w-20 shrink-0">{label}</span>
    <span className="text-[11px] text-slate-800 font-medium leading-snug">{value}</span>
  </div>
);

export const SatellitePreview: React.FC<SatellitePreviewProps> = ({
  metadata,
  imageUrl,
  onReplace,
  variant = 'primary',
  onRemove,
}) => {
  const [showMeta, setShowMeta] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const config = VARIANT_CONFIG[variant];

  return (
    <div className={`rounded border ${config.border} bg-white overflow-hidden`}>
      {/* Demo data banner */}
      {metadata.isDemoData && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider">
            Demonstration Data — Not an official government product
          </span>
        </div>
      )}

      {/* Image area */}
      <div className="relative bg-slate-900 aspect-[16/9] overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="w-6 h-6 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={`Satellite preview: ${metadata.satellite}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.badge}`}>
            {config.label}
          </span>
          {metadata.isDemoData && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white">
              Demo
            </span>
          )}
        </div>

        {/* Status chip */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-emerald-900/90 text-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
          <CheckCircle2 className="w-3 h-3" />
          Analysis Ready
        </div>
      </div>

      {/* Compact metadata strip */}
      <div className="px-3 py-2 border-t border-slate-100 grid grid-cols-2 gap-x-4 gap-y-0">
        <MetaRow icon={<Satellite className="w-3 h-3" />} label="Sensor" value={metadata.satellite} />
        <MetaRow icon={<Calendar className="w-3 h-3" />} label="Acquired" value={metadata.acquisitionDate} />
        <MetaRow icon={<Crosshair className="w-3 h-3" />} label="Resolution" value={metadata.resolution} />
        <MetaRow icon={<Map className="w-3 h-3" />} label="CRS" value={metadata.crs} />
        {metadata.polarization && (
          <MetaRow icon={<Layers className="w-3 h-3" />} label="Polarization" value={metadata.polarization} />
        )}
        <MetaRow icon={<Map className="w-3 h-3" />} label="Coverage" value={metadata.coverage} />
      </div>

      {/* Expanded metadata panel */}
      {showMeta && (
        <div className="px-3 pb-3 bg-slate-50 border-t border-slate-100 space-y-0">
          {metadata.bands && (
            <MetaRow icon={<Layers className="w-3 h-3" />} label="Bands" value={metadata.bands} />
          )}
          {metadata.cloudCover && (
            <MetaRow icon={<Info className="w-3 h-3" />} label="Cloud Cover" value={metadata.cloudCover} />
          )}
          {metadata.orbitPass && (
            <MetaRow icon={<Satellite className="w-3 h-3" />} label="Orbit" value={metadata.orbitPass} />
          )}
          {metadata.fileName && (
            <div className="mt-1 pt-1.5 border-t border-slate-200">
              <p className="text-[10px] text-slate-400 font-mono truncate">{metadata.fileName}</p>
            </div>
          )}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-t border-slate-100 bg-white">
        <button
          type="button"
          onClick={onReplace}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
        >
          <RefreshCw className="w-3 h-3" />
          Replace
        </button>
        <button
          type="button"
          onClick={() => setShowMeta(p => !p)}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          aria-expanded={showMeta}
          aria-label="Toggle full metadata"
        >
          <Info className="w-3 h-3" />
          {showMeta ? 'Hide Metadata' : 'Metadata'}
        </button>
        <button
          type="button"
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          aria-label="View full-size image"
        >
          <Maximize2 className="w-3 h-3" />
          View
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-auto flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-red-600 hover:text-red-800 border border-red-200 rounded hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Remove image"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

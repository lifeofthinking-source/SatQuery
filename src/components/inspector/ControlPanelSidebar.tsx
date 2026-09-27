import React, { useState } from 'react';
import {
  Sliders,
  Search,
  Crosshair,
  Layers,
  Bookmark,
  Database,
  SplitSquareVertical,
  ChevronDown,
  ChevronUp,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ControlPanelSidebarProps {
  currentLat: number;
  currentLng: number;
  currentZoom: number;
  onUpdateCoordinates: (lat: number, lng: number, zoom: number) => void;
  onSearchLocation: (query: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  overlays: {
    osmVector: boolean;
    highResOptical: boolean;
    viirsNight: boolean;
    modisNdvi: boolean;
  };
  setOverlays: React.Dispatch<
    React.SetStateAction<{
      osmVector: boolean;
      highResOptical: boolean;
      viirsNight: boolean;
      modisNdvi: boolean;
    }>
  >;
}

export const ControlPanelSidebar: React.FC<ControlPanelSidebarProps> = ({
  currentLat,
  currentLng,
  currentZoom,
  onUpdateCoordinates,
  onSearchLocation,
  isOpen = true,
  onToggle,
  overlays,
  setOverlays
}) => {
  const { showNotification, setCurrentRoute } = useApp();

  const [searchName, setSearchName] = useState<string>('');
  const [inputLat, setInputLat] = useState<string>(currentLat.toFixed(5));
  const [inputLng, setInputLng] = useState<string>(currentLng.toFixed(5));
  const [inputZoom, setInputZoom] = useState<string>(currentZoom.toString());

  // Accordion open/close states
  const [sectionOpen, setSectionOpen] = useState({
    findByName: true,
    spatialParams: true,
    activeOverlays: true,
    savedTargets: false,
    analysisTools: true
  });

  const toggleSection = (section: keyof typeof sectionOpen) => {
    setSectionOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Sync inputs when currentLat/Lng change from map
  React.useEffect(() => {
    setInputLat(currentLat.toFixed(5));
    setInputLng(currentLng.toFixed(5));
    setInputZoom(currentZoom.toString());
  }, [currentLat, currentLng, currentZoom]);

  const handleResolveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;
    onSearchLocation(searchName.trim());
  };

  const handleUpdateView = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
    const zoom = parseInt(inputZoom, 10);
    if (!isNaN(lat) && !isNaN(lng)) {
      onUpdateCoordinates(lat, lng, isNaN(zoom) ? 14 : zoom);
      showNotification(`Updated view to ${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E (Z${zoom || 14})`);
    }
  };

  if (!isOpen) {
    return (
      <div className="absolute top-16 left-0 z-30">
        <button
          onClick={onToggle}
          className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-r-lg border-r border-y border-slate-700 shadow-2xl flex items-center gap-1.5 text-xs font-bold transition-all group"
          title="Open Control Panel"
        >
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Sliders className="w-4 h-4 text-blue-400 group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline font-mono tracking-wider">CONTROL PANEL</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 md:w-80 shrink-0 bg-slate-900 text-slate-100 border-r border-slate-800 shadow-2xl flex flex-col h-full z-20 overflow-y-auto font-sans select-none transition-all">
      {/* Header Bar */}
      <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold tracking-wider uppercase font-mono text-white">
            Control Panel
          </h2>
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            title="Collapse Control Panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-3 space-y-3 flex-1 text-xs">
        {/* Accordion 1: Find by Name */}
        <div className="border border-slate-800 rounded bg-slate-950/60 overflow-hidden">
          <button
            onClick={() => toggleSection('findByName')}
            className="w-full px-3 py-2 bg-slate-900/90 text-left flex items-center justify-between font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2 font-mono text-[11px]">
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Find by Name</span>
            </span>
            {sectionOpen.findByName ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {sectionOpen.findByName && (
            <form onSubmit={handleResolveTarget} className="p-3 space-y-2">
              <input
                type="text"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                placeholder="e.g., Cheyyur, Amritsar, Delhi"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors shadow-xs"
              >
                Resolve Target
              </button>
            </form>
          )}
        </div>

        {/* Accordion 2: Spatial Parameters */}
        <div className="border border-slate-800 rounded bg-slate-950/60 overflow-hidden">
          <button
            onClick={() => toggleSection('spatialParams')}
            className="w-full px-3 py-2 bg-slate-900/90 text-left flex items-center justify-between font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2 font-mono text-[11px]">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>Spatial Parameters</span>
            </span>
            {sectionOpen.spatialParams ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {sectionOpen.spatialParams && (
            <form onSubmit={handleUpdateView} className="p-3 space-y-2.5">
              <div className="grid grid-cols-2 gap-2 items-center">
                <label className="text-[11px] text-slate-400 font-mono">LAT (deg)</label>
                <input
                  type="text"
                  value={inputLat}
                  onChange={e => setInputLat(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-right focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 items-center">
                <label className="text-[11px] text-slate-400 font-mono">LON (deg)</label>
                <input
                  type="text"
                  value={inputLng}
                  onChange={e => setInputLng(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-right focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 items-center">
                <label className="text-[11px] text-slate-400 font-mono">Scale (z)</label>
                <input
                  type="number"
                  min="4"
                  max="19"
                  value={inputZoom}
                  onChange={e => setInputZoom(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-right focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-1.5 px-3 rounded text-xs transition-colors"
              >
                Update View
              </button>
            </form>
          )}
        </div>

        {/* Accordion 3: Active Overlays */}
        <div className="border border-slate-800 rounded bg-slate-950/60 overflow-hidden">
          <button
            onClick={() => toggleSection('activeOverlays')}
            className="w-full px-3 py-2 bg-slate-900/90 text-left flex items-center justify-between font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2 font-mono text-[11px]">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Active Overlays</span>
            </span>
            {sectionOpen.activeOverlays ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {sectionOpen.activeOverlays && (
            <div className="p-3 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={overlays.osmVector}
                  onChange={e => setOverlays(prev => ({ ...prev, osmVector: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>OSM Vector Base</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={overlays.highResOptical}
                  onChange={e => setOverlays(prev => ({ ...prev, highResOptical: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                />
                <span className="font-semibold text-emerald-400">High-Res Optical (Esri)</span>
              </label>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
                  Live Telemetry (NASA GIBS)
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white py-0.5">
                  <input
                    type="checkbox"
                    checked={overlays.viirsNight}
                    onChange={e => {
                      setOverlays(prev => ({ ...prev, viirsNight: e.target.checked }));
                      showNotification(e.target.checked ? 'Enabled VIIRS Nighttime Radiance' : 'Disabled VIIRS Overlay');
                    }}
                    className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>VIIRS Earth at Night</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white py-0.5">
                  <input
                    type="checkbox"
                    checked={overlays.modisNdvi}
                    onChange={e => {
                      setOverlays(prev => ({ ...prev, modisNdvi: e.target.checked }));
                      showNotification(e.target.checked ? 'Enabled MODIS Vegetation Index' : 'Disabled MODIS Overlay');
                    }}
                    className="rounded bg-slate-900 border-slate-700 text-green-500 focus:ring-0"
                  />
                  <span>MODIS NDVI (Vegetation)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 4: Saved Targets (Wishlist) */}
        <div className="border border-slate-800 rounded bg-slate-950/60 overflow-hidden">
          <button
            onClick={() => toggleSection('savedTargets')}
            className="w-full px-3 py-2 bg-slate-900/90 text-left flex items-center justify-between font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2 font-mono text-[11px]">
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saved Targets (Wishlist)</span>
            </span>
            {sectionOpen.savedTargets ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {sectionOpen.savedTargets && (
            <div className="p-3 text-xs text-slate-400 italic text-center">
              Use "Save to Wishlist" in the Data Inspector to pin target coordinates.
            </div>
          )}
        </div>

        {/* Accordion 5: Analysis Tools */}
        <div className="border border-slate-800 rounded bg-slate-950/60 overflow-hidden">
          <button
            onClick={() => toggleSection('analysisTools')}
            className="w-full px-3 py-2 bg-slate-900/90 text-left flex items-center justify-between font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2 font-mono text-[11px]">
              <SplitSquareVertical className="w-3.5 h-3.5 text-blue-400" />
              <span>Analysis Tools</span>
            </span>
            {sectionOpen.analysisTools ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {sectionOpen.analysisTools && (
            <div className="p-3 space-y-2">
              <button
                onClick={() => setCurrentRoute('data-validation')}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-1.5 px-3 rounded text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                <span>Multispectral Compare</span>
              </button>

              <button
                onClick={() => setCurrentRoute('evidence-explorer')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-1.5 px-3 rounded text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>SQL Database Console</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useCallback, useRef } from 'react';
import { RealTimeGoogleMap } from '../map/RealTimeGoogleMap';
import { FloatingQueryChatbot } from '../chat/FloatingQueryChatbot';
import { DataInspectorPanel } from '../inspector/DataInspectorPanel';
import { ControlPanelSidebar } from '../inspector/ControlPanelSidebar';
import { InspectedPointData } from '../../types/inspector';
import {
  generateTargetId,
  estimateElevation,
  inferTerrainType,
  fastResolveRegion,
  getSatelliteTileUrl
} from '../../utils/geoInspector';
import { useApp } from '../../context/AppContext';
import { Sliders, Crosshair, ChevronLeft, ChevronRight, Globe, Sparkles, MessageSquare, User, Shield } from 'lucide-react';

export const RealTimeMapWorkspacePage: React.FC = () => {
  const { showNotification, setCurrentRoute } = useApp();

  // Initial target coordinates: Cheyyur, Chengalpattu, Tamil Nadu (matching reference screenshot!)
  const [currentLat, setCurrentLat] = useState<number>(12.42669);
  const [currentLng, setCurrentLng] = useState<number>(80.11471);
  const [currentZoom, setCurrentZoom] = useState<number>(15);

  // Inspector & Sidebar panel toggle states
  const [isControlPanelOpen, setIsControlPanelOpen] = useState<boolean>(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // Active Overlays
  const [overlays, setOverlays] = useState({
    osmVector: false,
    highResOptical: true,
    viirsNight: false,
    modisNdvi: false
  });

  // Current Inspected Point Data for Data Inspector
  const [inspectedData, setInspectedData] = useState<InspectedPointData>(() => {
    const lat = 12.42669;
    const lng = 80.11471;
    const targetId = generateTargetId(lat, lng);
    const region = fastResolveRegion(lat, lng);
    const elevation = estimateElevation(lat, lng);
    const terrain = inferTerrainType(lat, lng);
    const tileUrl = getSatelliteTileUrl(lat, lng, 15);

    return {
      lat,
      lng,
      zoom: 15,
      targetId,
      resolvedRegion: region,
      terrainType: terrain,
      elevationMsl: elevation,
      gridResolution: '15m / px',
      dataTimestamp: '2026-09-22',
      ndvi: 0.42,
      sarBackscatterDb: -12.4,
      moistureIndex: 0.28,
      tileUrl,
      auditLogs: [
        '> SysInit: GovRS Kernel Booted',
        `> Target Lock: TRK-Y7C6ZW5V (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
        '> Resolution: Cheyyur, Chengalpattu, Tamil Nadu',
        '> CrossMatch: Optical High-Res + Sentinel-1 SAR'
      ]
    };
  });

  // Handler when map reticle points or moves
  const handleReticleUpdate = useCallback(
    (lat: number, lng: number, zoom: number, isClick: boolean = false) => {
      setCurrentLat(lat);
      setCurrentLng(lng);
      setCurrentZoom(zoom);

      const targetId = generateTargetId(lat, lng);
      const region = fastResolveRegion(lat, lng);
      const elevation = estimateElevation(lat, lng);
      const terrain = inferTerrainType(lat, lng);
      const tileUrl = getSatelliteTileUrl(lat, lng, zoom);

      // Pseudo-realistic NDVI & SAR calculation based on coordinates
      const ndvi = Number((0.25 + Math.abs(Math.sin(lat * 5 + lng * 3)) * 0.45).toFixed(2));
      const sarDb = Number((-8.0 - Math.abs(Math.cos(lat * 4 + lng * 6)) * 10.0).toFixed(1));

      setInspectedData(prev => {
        const newLogs = isClick
          ? [
              `> Reticle Click: Target Locked ${targetId}`,
              `> Coords: ${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`,
              `> Region: ${region}`,
              ...prev.auditLogs.slice(0, 5)
            ]
          : prev.auditLogs;

        return {
          lat,
          lng,
          zoom,
          targetId,
          resolvedRegion: region,
          terrainType: terrain,
          elevationMsl: elevation,
          gridResolution: zoom >= 15 ? '10m / px' : '15m / px',
          dataTimestamp: '2026-09-22',
          ndvi,
          sarBackscatterDb: sarDb,
          moistureIndex: Number((0.15 + (1 - ndvi) * 0.2).toFixed(2)),
          tileUrl,
          auditLogs: newLogs
        };
      });
    },
    []
  );

  const handleUpdateCoordinates = (lat: number, lng: number, zoom: number) => {
    handleReticleUpdate(lat, lng, zoom, true);
  };

  const mapNavigateRef = useRef<((lat: number, lng: number, zoom?: number) => void) | null>(null);

  const handleSearchLocation = (query: string) => {
    if (mapNavigateRef.current) {
      // Trigger navigation on map
      const q = query.toLowerCase();
      if (q.includes('cheyyur') || q.includes('chengalpattu')) {
        mapNavigateRef.current(12.42669, 80.11471, 15);
      } else if (q.includes('delhi')) {
        mapNavigateRef.current(28.6139, 77.209, 13);
      } else if (q.includes('vishakapatnam') || q.includes('visakhapatnam') || q.includes('vizag')) {
        mapNavigateRef.current(17.6868, 83.2185, 13);
      } else if (q.includes('hyderabad')) {
        mapNavigateRef.current(17.588, 78.51, 13);
      } else if (q.includes('amritsar')) {
        mapNavigateRef.current(31.634, 74.8723, 14);
      } else {
        // Geocode dynamically
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=1`)
          .then(res => res.json())
          .then(data => {
            if (data && data[0]) {
              mapNavigateRef.current?.(parseFloat(data[0].lat), parseFloat(data[0].lon), 14);
            }
          })
          .catch(() => {});
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* Top Portal Navigation Bar — Light Theme */}
      <div className="h-11 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-600 z-30 shrink-0 shadow-sm">
        {/* Left: Branding & Nav Links */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold tracking-wide">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Globe className="w-3 h-3" />
            </div>
            <span className="text-xs font-extrabold tracking-wider font-sans text-slate-800">
              EARTH OBSERVATION PORTAL
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
            <button onClick={() => setCurrentRoute('landing')} className="px-2 py-0.5 rounded hover:text-slate-900 hover:bg-slate-100 transition-colors">Home</button>
            <button onClick={() => setCurrentRoute('data-validation')} className="px-2 py-0.5 rounded hover:text-slate-900 hover:bg-slate-100 transition-colors">Visual Tools</button>
            <button onClick={() => setCurrentRoute('tool-selection')} className="px-2 py-0.5 rounded hover:text-slate-900 hover:bg-slate-100 transition-colors">CrossMatch Tools</button>
            <button onClick={() => setCurrentRoute('previous-analyses')} className="px-2 py-0.5 rounded hover:text-slate-900 hover:bg-slate-100 transition-colors">Data Archives</button>
            <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-semibold flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>SatQuery Workspace</span>
            </button>
            <button onClick={() => showNotification('Orbital Chat Live Assistant Active (Floating Bottom-Right)')} className="px-2.5 py-1 rounded bg-amber-500 text-white font-semibold flex items-center gap-1 shadow-xs">
              <MessageSquare className="w-3 h-3" />
              <span>Orbital Chat</span>
            </button>
          </div>
        </div>

        {/* Right: Security & User Controls */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
            [UNCLASSIFIED // FOUO]
          </span>
          <span className="text-slate-500 text-xs">Guest Access</span>
          <button onClick={() => setCurrentRoute('login')} className="bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 border border-slate-300 shadow-xs">
            <User className="w-3 h-3" />
            <span>Sign In</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="relative flex-1 w-full h-full flex flex-row overflow-hidden">
        {/* 1. Left Sidebar: Control Panel */}
        <ControlPanelSidebar
          currentLat={currentLat}
          currentLng={currentLng}
          currentZoom={currentZoom}
          onUpdateCoordinates={handleUpdateCoordinates}
          onSearchLocation={handleSearchLocation}
          isOpen={isControlPanelOpen}
          onToggle={() => setIsControlPanelOpen(prev => !prev)}
          overlays={overlays}
          setOverlays={setOverlays}
        />

        {/* 2. Center: Real-Time Map with Green Reticle & Target Coords HUD */}
        <div className="relative flex-1 h-full overflow-hidden flex flex-col">
          <RealTimeGoogleMap
            onReticleMove={handleReticleUpdate}
            onReticleClick={handleReticleUpdate}
            setNavigateRef={nav => {
              mapNavigateRef.current = nav;
            }}
            externalOverlays={overlays}
            initialLat={currentLat}
            initialLng={currentLng}
            initialZoom={currentZoom}
          />

          {/* Floating Natural Language Query Chatbot */}
          <FloatingQueryChatbot />
        </div>

        {/* 3. Right Sidebar: DATA INSPECTOR Panel (Matching Reference Screenshot!) */}
        <DataInspectorPanel
          data={inspectedData}
          isOpen={isInspectorOpen}
          onToggle={() => setIsInspectorOpen(prev => !prev)}
          onRefreshQuickLook={() => {
            const freshTile = getSatelliteTileUrl(currentLat, currentLng, currentZoom);
            setInspectedData(prev => ({ ...prev, tileUrl: freshTile }));
          }}
        />
      </div>
    </div>
  );
};

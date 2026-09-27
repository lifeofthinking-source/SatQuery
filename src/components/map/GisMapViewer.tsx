import React, { useState, useRef } from 'react';
import { Layers, ZoomIn, ZoomOut, Maximize2, RotateCcw, MapPin, Eye, Compass, Info, CheckCircle2 } from 'lucide-react';

interface GisMapViewerProps {
  showChangeOverlay?: boolean;
  showGroundingBoxes?: boolean;
  showSarGrid?: boolean;
  activeTabDefault?: 'split' | 'before' | 'after' | 'change' | 'grounding';
}

export const GisMapViewer: React.FC<GisMapViewerProps> = ({
  showChangeOverlay = true,
  showGroundingBoxes = true,
  showSarGrid = false,
  activeTabDefault = 'split'
}) => {
  const [activeView, setActiveView] = useState<'split' | 'before' | 'after' | 'change' | 'grounding'>(activeTabDefault);
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage 0-100
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeLayerChange, setActiveLayerChange] = useState<boolean>(showChangeOverlay);
  const [activeLayerGrounding, setActiveLayerGrounding] = useState<boolean>(showGroundingBoxes);
  const [activeLayerSar, setActiveLayerSar] = useState<boolean>(showSarGrid);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<{
    id: string;
    name: string;
    area: string;
    sarDelta: string;
    type: string;
    confidence: string;
    coords: string;
  } | null>(null);

  const [mouseCoords, setMouseCoords] = useState<{ lat: string; lon: string }>({
    lat: '17.5882° N',
    lon: '78.5104° E'
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    // Calculate approximate geo-coordinates from mouse position
    const minLon = 78.4312;
    const maxLon = 78.5892;
    const minLat = 17.5218;
    const maxLat = 17.6542;

    const lon = (minLon + (x / rect.width) * (maxLon - minLon)).toFixed(4);
    const lat = (maxLat - (y / rect.height) * (maxLat - minLat)).toFixed(4);

    setMouseCoords({
      lat: `${lat}° N`,
      lon: `${lon}° E`
    });

    if (isDraggingRef.current && activeView === 'split') {
      const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSplitPosition(pct);
    }
  };

  const clusters = [
    {
      id: 'CL-01',
      name: 'Medchal Industrial Logistic Hub',
      cx: 320,
      cy: 160,
      w: 120,
      h: 80,
      area: '2.45 km²',
      sarDelta: '+5.4 dB (Verified Double-Bounce)',
      type: 'Industrial Warehouse Expansion',
      confidence: '96.2%',
      coords: '17.6210° N, 78.4890° E'
    },
    {
      id: 'CL-02',
      name: 'Kompally North Residential Sector',
      cx: 560,
      cy: 280,
      w: 150,
      h: 90,
      area: '3.12 km²',
      sarDelta: '+4.8 dB (High Structure Return)',
      type: 'Multi-Storey Residential Layout',
      confidence: '94.8%',
      coords: '17.5840° N, 78.5320° E'
    },
    {
      id: 'CL-03',
      name: 'Gundlapochampally Tech Park Zone',
      cx: 240,
      cy: 310,
      w: 90,
      h: 75,
      area: '1.68 km²',
      sarDelta: '+5.1 dB (Verified)',
      type: 'Commercial Institutional Campus',
      confidence: '95.4%',
      coords: '17.5680° N, 78.4610° E'
    },
    {
      id: 'CL-04',
      name: 'Outer Ring Road (ORR) Interchange Spine',
      cx: 480,
      cy: 130,
      w: 180,
      h: 50,
      area: '2.84 km²',
      sarDelta: '+4.2 dB (Linear Highway Corroborated)',
      type: 'Highway Infrastructure & Logistics Strip',
      confidence: '97.0%',
      coords: '17.6320° N, 78.5200° E'
    },
    {
      id: 'CL-05',
      name: 'Dulapally East Mixed Corridor',
      cx: 420,
      cy: 390,
      w: 110,
      h: 80,
      area: '2.31 km²',
      sarDelta: '+4.6 dB (Confirmed)',
      type: 'Suburban Settlement Infill',
      confidence: '93.9%',
      coords: '17.5450° N, 78.5080° E'
    }
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-300 rounded-lg overflow-hidden shadow-sm flex flex-col">
      {/* Top Map HUD Bar */}
      <div className="bg-slate-950 text-slate-300 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: View Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
          <button
            onClick={() => setActiveView('split')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeView === 'split' ? 'bg-blue-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split Slider (2022 ↔ 2026)
          </button>
          <button
            onClick={() => setActiveView('before')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeView === 'before' ? 'bg-blue-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Before (2022 Optical)
          </button>
          <button
            onClick={() => setActiveView('after')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeView === 'after' ? 'bg-blue-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            After (2026 Optical)
          </button>
          <button
            onClick={() => setActiveView('change')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeView === 'change' ? 'bg-blue-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Change Map (12.4 km²)
          </button>
          <button
            onClick={() => setActiveView('grounding')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeView === 'grounding' ? 'bg-blue-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            GeoChat Grounding
          </button>
        </div>

        {/* Right: Map Controls & Coordinates */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>{mouseCoords.lat}</span>
            <span className="text-slate-600">|</span>
            <span>{mouseCoords.lon}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">EPSG:4326</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setSplitPosition(50);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
              title="Reset Extent"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={e => {
          if ((e.target as HTMLElement).closest('.split-handle')) {
            isDraggingRef.current = true;
          }
        }}
        onMouseUp={() => {
          isDraggingRef.current = false;
        }}
        onMouseLeave={() => {
          isDraggingRef.current = false;
        }}
        className="relative w-full h-[460px] bg-slate-950 overflow-hidden cursor-crosshair select-none"
      >
        {/* Map Layers Container with Zoom transform */}
        <div
          className="absolute inset-0 transition-transform duration-150 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* BASE MAP 2022 (Shown on left side of split, or when activeView is 'before') */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath:
                activeView === 'split'
                  ? `polygon(0 0, ${splitPosition}% 0, ${splitPosition}% 100%, 0 100%)`
                  : activeView === 'before'
                  ? 'none'
                  : activeView === 'after'
                  ? 'polygon(0 0, 0 0, 0 100%, 0 100%)'
                  : 'none'
            }}
          >
            {/* SVG Synthetic Remote Sensing Canvas: 2022 Baseline */}
            <svg viewBox="0 0 800 480" className="w-full h-full object-cover">
              <defs>
                <pattern id="cropGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2d4a2b" strokeWidth="0.8" />
                </pattern>
                <pattern id="fallowGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <rect width="60" height="60" fill="#3b3b28" />
                  <path d="M 0 30 L 60 30 M 30 0 L 30 60" stroke="#484832" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Background Earth Surface (Fallow Land & Scrub in 2022) */}
              <rect width="800" height="480" fill="#2d3725" />

              {/* Agricultural & open parcels in 2022 */}
              <rect x="180" y="100" width="300" height="260" fill="#37482a" opacity="0.9" />
              <rect x="220" y="140" width="220" height="200" fill="url(#cropGrid)" />
              <rect x="500" y="80" width="240" height="340" fill="url(#fallowGrid)" />

              {/* Water reservoir in north */}
              <path
                d="M 620,40 Q 690,70 710,130 Q 670,160 610,110 Z"
                fill="#153e5e"
                stroke="#1d5885"
                strokeWidth="2"
              />
              <text x="640" y="95" fill="#6ba4cd" fontSize="9" fontFamily="monospace">
                Suraram Lake
              </text>

              {/* Old built-up town center in 2022 (Pre-existing baseline) */}
              <path
                d="M 80,180 L 190,190 L 170,280 L 70,260 Z"
                fill="#615f5c"
                stroke="#7a7873"
                strokeWidth="1.5"
              />
              <text x="90" y="235" fill="#d1cfca" fontSize="10" fontWeight="bold">
                Historic Core (2022)
              </text>

              {/* Highway Corridors */}
              <path
                d="M 0,110 L 800,160"
                stroke="#525252"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 0,110 L 800,160"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                strokeDasharray="8 6"
              />
              <text x="30" y="100" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                National Highway 44 (Medchal Corridor)
              </text>

              {/* Secondary roads */}
              <path d="M 380,0 L 390,480" stroke="#404040" strokeWidth="4" />
              <path d="M 120,480 Q 280,320 600,380" stroke="#404040" strokeWidth="3.5" />

              {/* Label indicating 2022 Epoch */}
              <g transform="translate(20, 30)">
                <rect width="180" height="24" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#334155" />
                <text x="10" y="16" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  S2B 2022-01-15 (Optical L2A)
                </text>
              </g>
            </svg>
          </div>

          {/* BASE MAP 2026 (Shown on right side of split, or when activeView is 'after', 'change', 'grounding') */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath:
                activeView === 'split'
                  ? `polygon(${splitPosition}% 0, 100% 0, 100% 100%, ${splitPosition}% 100%)`
                  : activeView === 'before'
                  ? 'polygon(0 0, 0 0, 0 100%, 0 100%)'
                  : 'none'
            }}
          >
            {/* SVG Synthetic Remote Sensing Canvas: 2026 Target */}
            <svg viewBox="0 0 800 480" className="w-full h-full object-cover">
              {/* Background Earth Surface */}
              <rect width="800" height="480" fill="#2d3725" />

              {/* Remaining vegetation */}
              <rect x="180" y="100" width="130" height="180" fill="#304024" opacity="0.8" />
              <rect x="500" y="80" width="80" height="120" fill="#333324" />

              {/* Water reservoir */}
              <path
                d="M 620,40 Q 690,70 710,130 Q 670,160 610,110 Z"
                fill="#153e5e"
                stroke="#1d5885"
                strokeWidth="2"
              />
              <text x="640" y="95" fill="#6ba4cd" fontSize="9" fontFamily="monospace">
                Suraram Lake
              </text>

              {/* Highways */}
              <path
                d="M 0,110 L 800,160"
                stroke="#525252"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 0,110 L 800,160"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                strokeDasharray="8 6"
              />

              {/* Secondary roads */}
              <path d="M 380,0 L 390,480" stroke="#4b5563" strokeWidth="4.5" />
              <path d="M 120,480 Q 280,320 600,380" stroke="#4b5563" strokeWidth="4" />

              {/* Historic Core */}
              <path
                d="M 80,180 L 190,190 L 170,280 L 70,260 Z"
                fill="#6b7280"
                stroke="#9ca3af"
                strokeWidth="1.5"
              />

              {/* NEW BUILT-UP EXPANSION IN 2026 (Dense commercial & residential concrete pads) */}
              {/* Cluster 1: Medchal Hub */}
              <rect
                x="260"
                y="120"
                width="140"
                height="90"
                fill="#94a3b8"
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              {/* Cluster 2: Kompally North */}
              <polygon
                points="490,230 630,240 620,330 480,310"
                fill="#94a3b8"
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              {/* Cluster 3: Gundlapochampally */}
              <rect
                x="200"
                y="280"
                width="90"
                height="80"
                fill="#94a3b8"
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              {/* Cluster 4: ORR Logistics */}
              <rect
                x="410"
                y="110"
                width="170"
                height="50"
                fill="#94a3b8"
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              {/* Cluster 5: Dulapally East */}
              <rect
                x="370"
                y="350"
                width="110"
                height="80"
                fill="#94a3b8"
                stroke="#cbd5e1"
                strokeWidth="1"
              />

              {/* Label indicating 2026 Epoch */}
              <g transform="translate(600, 30)">
                <rect width="180" height="24" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#334155" />
                <text x="10" y="16" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  S2A 2026-01-15 (Optical L2A)
                </text>
              </g>
            </svg>
          </div>

          {/* OVERLAY 1: CHANGE DETECTION VECTOR MASK (12.4 km² Verified Built-up Expansion) */}
          {(activeLayerChange || activeView === 'change') && (
            <div className="absolute inset-0 pointer-events-auto">
              <svg viewBox="0 0 800 480" className="w-full h-full">
                <defs>
                  <pattern id="changeHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2" opacity="0.85" />
                  </pattern>
                </defs>

                {clusters.map(c => {
                  const isHovered = hoveredCluster === c.id;
                  const isSelected = selectedCluster?.id === c.id;

                  return (
                    <g
                      key={c.id}
                      onMouseEnter={() => setHoveredCluster(c.id)}
                      onMouseLeave={() => setHoveredCluster(null)}
                      onClick={() => setSelectedCluster(c)}
                      className="cursor-pointer group"
                    >
                      <rect
                        x={c.cx - c.w / 2}
                        y={c.cy - c.h / 2}
                        width={c.w}
                        height={c.h}
                        fill="rgba(239, 68, 68, 0.35)"
                        stroke={isSelected ? '#f87171' : '#dc2626'}
                        strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                        strokeDasharray={isSelected ? 'none' : '4 2'}
                        rx="2"
                      />
                      {/* Cluster Identification Label */}
                      <rect
                        x={c.cx - 24}
                        y={c.cy - 10}
                        width="48"
                        height="20"
                        rx="3"
                        fill="#991b1b"
                        stroke="#fca5a5"
                        strokeWidth="1"
                      />
                      <text
                        x={c.cx}
                        y={c.cy + 4}
                        fill="#ffffff"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {c.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* OVERLAY 2: GEOCHAT GROUNDING BOUNDING BOXES */}
          {(activeLayerGrounding || activeView === 'grounding') && (
            <div className="absolute inset-0 pointer-events-none">
              <svg viewBox="0 0 800 480" className="w-full h-full">
                {clusters.map(c => (
                  <g key={`grounding-${c.id}`}>
                    <rect
                      x={c.cx - c.w / 2 - 8}
                      y={c.cy - c.h / 2 - 8}
                      width={c.w + 16}
                      height={c.h + 16}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                    <text
                      x={c.cx - c.w / 2 - 6}
                      y={c.cy - c.h / 2 - 12}
                      fill="#22d3ee"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      [GeoChat: Built-up Grounding {c.id}]
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}

          {/* OVERLAY 3: SENTINEL-1 C-SAR BACKSCATTER GRID */}
          {activeLayerSar && (
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg viewBox="0 0 800 480" className="w-full h-full">
                <defs>
                  <pattern id="sarRaster" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1.5" fill="#f59e0b" />
                    <line x1="0" y1="10" x2="20" y2="10" stroke="#78350f" strokeWidth="0.5" />
                    <line x1="10" y1="0" x2="10" y2="20" stroke="#78350f" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="800" height="480" fill="url(#sarRaster)" />
              </svg>
            </div>
          )}
        </div>

        {/* SPLIT SLIDER DIVIDER LINE & DRAG HANDLE */}
        {activeView === 'split' && (
          <div
            className="absolute top-0 bottom-0 z-20 split-handle"
            style={{ left: `${splitPosition}%` }}
          >
            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)] -translate-x-1/2" />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-lg flex items-center justify-center cursor-ew-resize">
              <div className="flex items-center gap-0.5 text-white">
                <span className="text-[10px]">◀</span>
                <span className="text-[10px]">▶</span>
              </div>
            </div>
            {/* Split Labels */}
            <div className="absolute top-3 -translate-x-[110%] px-2 py-0.5 bg-black/75 text-white rounded text-[10px] font-mono whitespace-nowrap">
              2022 BASELINE
            </div>
            <div className="absolute top-3 translate-x-[10%] px-2 py-0.5 bg-black/75 text-white rounded text-[10px] font-mono whitespace-nowrap">
              2026 TARGET
            </div>
          </div>
        )}

        {/* Selected Cluster Detail Popover */}
        {selectedCluster && (
          <div className="absolute bottom-4 left-4 z-30 bg-slate-900/95 text-white border border-slate-700 rounded-lg p-3 max-w-xs shadow-xl text-xs backdrop-blur-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span className="font-bold text-white">{selectedCluster.name}</span>
              </div>
              <button
                onClick={() => setSelectedCluster(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Cluster ID:</span>
                <span className="font-mono text-white">{selectedCluster.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expansion Area:</span>
                <span className="font-mono text-emerald-400 font-semibold">{selectedCluster.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SAR Microwave Δ:</span>
                <span className="font-mono text-blue-300">{selectedCluster.sarDelta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DeltaView Confidence:</span>
                <span className="font-mono text-slate-200">{selectedCluster.confidence}</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                Coordinates: {selectedCluster.coords}
              </div>
            </div>
          </div>
        )}

        {/* Prototype Watermark Notice */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <div className="px-2.5 py-1 bg-slate-950/80 border border-slate-800 text-slate-300 rounded text-[10px] font-mono">
            DEMONSTRATION SATELLITE DATA · NOT FOR OFFICIAL REGULATORY ENFORCEMENT
          </div>
        </div>
      </div>

      {/* Bottom GIS Layer Toggles & Legend Bar */}
      <div className="bg-slate-950 text-slate-300 px-4 py-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Layer Toggles */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">Layers:</span>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={activeLayerChange}
              onChange={e => setActiveLayerChange(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-red-600 focus:ring-0"
            />
            <span>Change Footprint (12.4 km²)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={activeLayerGrounding}
              onChange={e => setActiveLayerGrounding(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-600 focus:ring-0"
            />
            <span>GeoChat Grounding</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={activeLayerSar}
              onChange={e => setActiveLayerSar(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span>SAR C-SAR Backscatter</span>
          </label>
        </div>

        {/* Map Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-red-600/70 border border-red-400 inline-block" />
            <span>Built-up Growth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-800/80 border border-emerald-600 inline-block" />
            <span>Vegetation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-blue-700/80 border border-blue-500 inline-block" />
            <span>Water Reservoir</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-400 inline-block" />
            <span>Transport Spine</span>
          </div>
        </div>
      </div>
    </div>
  );
};

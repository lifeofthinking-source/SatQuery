/**
 * NewAnalysisPage.tsx
 *
 * Satellite Analysis Console — SatQuery AI
 *
 * UX contract:
 *   USER:    provides an image + asks a question → clicks Analyze
 *   SATQUERY: handles everything else inside a floating overlay
 *
 * No workflow stepper. No stage labels. No page navigation on submit.
 * The AnalysisOverlay is the entire post-submit experience.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Satellite,
  UploadCloud,
  Database,
  Radio,
  Layers,
  Plus,
  RefreshCw,
  Info,
  Calendar,
  Crosshair,
  Map,
  CheckCircle2,
  AlertTriangle,
  Send,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import { AnalysisOverlay, OverlayView } from '../newanalysis/AnalysisOverlay';
import {
  ImageMetadata,
  FinalResult,
  DEMO_PRIMARY_IMAGE,
  DEMO_COMPARISON_IMAGE,
  DEMO_SAR_IMAGE,
  DEMO_IMAGE_URLS,
  ORCHESTRATION_STEPS,
  classifyQuery,
  runAnalysis,
} from '../../services/analysisService';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_QUERY =
  'Has the built-up area increased between these two dates, where did the change occur, and does the available SAR evidence support it?';

const EXAMPLE_QUERIES = [
  { short: 'What changed here?',               full: 'What land use and land cover changes occurred across this region between the two acquisition dates?' },
  { short: 'Where did urban growth occur?',    full: 'Has the built-up area increased between these two dates, where did the change occur, and does the available SAR evidence support it?' },
  { short: 'Has vegetation decreased?',        full: 'Has dense canopy vegetation decreased in the observed area, and is crown degradation detected?' },
  { short: 'Where has new construction appeared?', full: 'Has new construction appeared in this area, where did it occur, and what is the spatial extent of the change?' },
  { short: 'Does SAR support the detected change?', full: 'Does Sentinel-1 C-SAR backscatter increase corroborate the optical built-up candidate polygons or indicate bare soil clearing?' },
];

// ─── Small reusable pieces ────────────────────────────────────────────────────

const MetaRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 py-1 border-b border-slate-100 last:border-0">
    <span className="text-slate-400 shrink-0">{icon}</span>
    <span className="text-[11px] text-slate-500 w-20 shrink-0">{label}</span>
    <span className="text-[11px] text-slate-800 font-medium truncate">{value}</span>
  </div>
);

// ─── Upload zone ──────────────────────────────────────────────────────────────

interface UploadZoneProps {
  onFile: (f: File) => void;
  onDemo: () => void;
  compact?: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFile, onDemo, compact }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload satellite image — drag and drop or click"
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded cursor-pointer transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700
          ${compact ? 'py-6' : 'py-10'}
          ${dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/30'}`}
      >
        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <Satellite className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-700">Upload satellite imagery</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Drag & drop or select a file</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {['GeoTIFF', 'PNG', 'JPG'].map(f => (
              <span key={f} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-500 font-mono">{f}</span>
            ))}
          </div>
        </div>
      </div>

      <input ref={inputRef} type="file" accept=".tif,.tiff,.png,.jpg,.jpeg" className="hidden" aria-hidden="true"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />

      <div className="flex gap-2">
        <button type="button" onClick={() => inputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700">
          <UploadCloud className="w-3.5 h-3.5" />Upload Image
        </button>
        <button type="button" onClick={onDemo}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-blue-800 bg-blue-900 hover:bg-blue-800 text-white text-[11px] font-semibold rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700">
          <Database className="w-3.5 h-3.5" />Use Demo Dataset
        </button>
      </div>
    </div>
  );
};

// ─── Image preview card ───────────────────────────────────────────────────────

interface ImageCardProps {
  meta: ImageMetadata;
  url: string;
  variant: 'primary' | 'comparison' | 'sar';
  onReplace: () => void;
  onRemove?: () => void;
}

const VARIANT_STYLES = {
  primary:    { badge: 'bg-blue-900 text-white',    border: 'border-blue-200' },
  comparison: { badge: 'bg-amber-700 text-white',   border: 'border-amber-200' },
  sar:        { badge: 'bg-slate-700 text-white',   border: 'border-slate-300' },
};

const VARIANT_LABELS = { primary: 'Primary', comparison: 'Comparison', sar: 'SAR' };

const ImageCard: React.FC<ImageCardProps> = ({ meta, url, variant, onReplace, onRemove }) => {
  const [loaded, setLoaded] = useState(false);
  const s = VARIANT_STYLES[variant];

  return (
    <div className={`rounded border ${s.border} bg-white overflow-hidden`}>
      {meta.isDemoData && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border-b border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="text-[10px] text-amber-800 font-semibold uppercase tracking-wide">Demonstration Data</span>
        </div>
      )}

      {/* Image */}
      <div className="relative bg-slate-900 aspect-video overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <img src={url} alt={`${meta.satellite} satellite image`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)} />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${s.badge}`}>
            {VARIANT_LABELS[variant]}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-emerald-900/90 text-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
          <CheckCircle2 className="w-3 h-3" />Ready
        </div>
      </div>

      {/* Metadata */}
      <div className="px-3 py-2">
        <MetaRow icon={<Satellite className="w-3 h-3" />}  label="Sensor"      value={meta.satellite} />
        <MetaRow icon={<Calendar className="w-3 h-3" />}   label="Acquired"    value={meta.acquisitionDate} />
        <MetaRow icon={<Crosshair className="w-3 h-3" />}  label="Resolution"  value={meta.resolution} />
        <MetaRow icon={<Map className="w-3 h-3" />}        label="Coverage"    value={meta.coverage} />
        {meta.polarization && (
          <MetaRow icon={<Layers className="w-3 h-3" />} label="Polarization" value={meta.polarization} />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 px-3 py-2 border-t border-slate-100">
        <button type="button" onClick={onReplace}
          className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700">
          <RefreshCw className="w-3 h-3" />Replace
        </button>
        <button type="button"
          className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700">
          <Maximize2 className="w-3 h-3" />View
        </button>
        {onRemove && (
          <button type="button" onClick={onRemove}
            className="ml-auto flex items-center gap-1 px-2 py-1 text-[11px] text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Add-more strip (dashed button) ──────────────────────────────────────────

const AddStrip: React.FC<{ label: string; hint: string; icon: React.ReactNode; onClick: () => void }> = ({ label, hint, icon, onClick }) => (
  <button type="button" onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 rounded transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700">
    <div className="w-7 h-7 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <p className="text-[11px] text-slate-400">{hint}</p>
    </div>
    <Plus className="w-4 h-4 text-slate-400 shrink-0" />
  </button>
);

// ─── Main page ────────────────────────────────────────────────────────────────

export const NewAnalysisPage: React.FC = () => {
  const { query, setQuery, showNotification } = useApp();

  // ── Image state ──────────────────────────────────────────────────────────
  const [primaryImage,      setPrimaryImage]      = useState<ImageMetadata | null>(null);
  const [primaryUrl,        setPrimaryUrl]        = useState('');
  const [comparisonImage,   setComparisonImage]   = useState<ImageMetadata | null>(null);
  const [comparisonUrl,     setComparisonUrl]     = useState('');
  const [sarImage,          setSarImage]          = useState<ImageMetadata | null>(null);
  const [sarUrl,            setSarUrl]            = useState('');
  const [showComparison,    setShowComparison]    = useState(false);
  const [showSar,           setShowSar]           = useState(false);

  // ── Overlay / analysis state ─────────────────────────────────────────────
  const [overlayOpen,       setOverlayOpen]       = useState(false);
  const [overlayView,       setOverlayView]       = useState<OverlayView>('progress');
  const [completedSteps,    setCompletedSteps]    = useState(0);
  const [finalResult,       setFinalResult]       = useState<FinalResult | null>(null);
  const [mapTab,            setMapTab]            = useState<'before' | 'after' | 'change'>('after');
  const [analyzing,         setAnalyzing]         = useState(false);

  // ─── Demo loaders ────────────────────────────────────────────────────────
  const loadDemoPrimary = useCallback(() => {
    setPrimaryImage(DEMO_PRIMARY_IMAGE);
    setPrimaryUrl(DEMO_IMAGE_URLS.primary);
    showNotification('Loaded demonstration dataset: Sentinel-2 2026 Urban Scene');
  }, [showNotification]);

  const loadDemoComparison = useCallback(() => {
    setComparisonImage(DEMO_COMPARISON_IMAGE);
    setComparisonUrl(DEMO_IMAGE_URLS.comparison);
    setShowComparison(true);
    showNotification('Loaded demonstration dataset: Sentinel-2 2022 Urban Scene (baseline)');
  }, [showNotification]);

  const loadDemoSar = useCallback(() => {
    setSarImage(DEMO_SAR_IMAGE);
    setSarUrl(DEMO_IMAGE_URLS.sar);
    setShowSar(true);
    showNotification('Loaded demonstration dataset: Sentinel-1 C-SAR 2026');
  }, [showNotification]);

  // Full demo load — primary + comparison + SAR + default query
  const loadFullDemo = useCallback(() => {
    loadDemoPrimary();
    loadDemoComparison();
    loadDemoSar();
    setQuery(DEFAULT_QUERY);
    showNotification('Demonstration dataset loaded — ready to analyze');
  }, [loadDemoPrimary, loadDemoComparison, loadDemoSar, setQuery, showNotification]);

  // ─── File upload ─────────────────────────────────────────────────────────
  const buildMetaFromFile = (file: File, isSar = false): ImageMetadata => ({
    sensor:          isSar ? 'Uploaded SAR' : 'Uploaded Optical',
    satellite:       isSar ? 'User-provided SAR' : 'User-provided Optical',
    acquisitionDate: 'Unknown',
    resolution:      'Unknown',
    crs:             'Unknown',
    coverage:        'User-provided AOI',
    fileName:        file.name,
    isDemoData:      false,
  });

  const handlePrimaryFile = (f: File) => {
    setPrimaryImage(buildMetaFromFile(f));
    setPrimaryUrl(URL.createObjectURL(f));
    showNotification(`Image loaded: ${f.name}`);
  };

  const handleComparisonFile = (f: File) => {
    setComparisonImage(buildMetaFromFile(f));
    setComparisonUrl(URL.createObjectURL(f));
    showNotification(`Comparison image loaded: ${f.name}`);
  };

  const handleSarFile = (f: File) => {
    setSarImage(buildMetaFromFile(f, true));
    setSarUrl(URL.createObjectURL(f));
    showNotification(`SAR image loaded: ${f.name}`);
  };

  // ─── Clear all ───────────────────────────────────────────────────────────
  const handleClear = () => {
    setPrimaryImage(null); setPrimaryUrl('');
    setComparisonImage(null); setComparisonUrl('');
    setSarImage(null); setSarUrl('');
    setShowComparison(false); setShowSar(false);
    setQuery('');
    setOverlayOpen(false);
    setFinalResult(null);
    setCompletedSteps(0);
  };

  // ─── Run analysis ─────────────────────────────────────────────────────────
  const handleAnalyze = useCallback(async () => {
    if (!primaryImage || !query.trim()) return;

    setAnalyzing(true);
    setOverlayOpen(true);
    setOverlayView('progress');
    setCompletedSteps(0);
    setFinalResult(null);
    setMapTab('after');

    try {
      const result = await runAnalysis(
        { query, primaryImage, comparisonImage, sarImage },
        (completedIdx) => {
          setCompletedSteps(completedIdx + 1);

          // Advance overlay sub-view as steps land
          const totalSteps = ORCHESTRATION_STEPS.length;
          if (completedIdx === totalSteps - 3) setOverlayView('fusion');      // step 6 done
          if (completedIdx === totalSteps - 2) setOverlayView('challenge');   // step 7 done
        },
      );

      // Small pause on "challenge" state so it's readable
      await new Promise(r => setTimeout(r, 600));

      setFinalResult(result);
      const isInsufficient = 'title' in result;
      setOverlayView(isInsufficient ? 'insufficient' : 'result');
    } finally {
      setAnalyzing(false);
    }
  }, [primaryImage, comparisonImage, sarImage, query]);

  // ─── Close overlay → reset for new analysis ──────────────────────────────
  const handleCloseOverlay = () => {
    setOverlayOpen(false);
    setFinalResult(null);
    setCompletedSteps(0);
    setOverlayView('progress');
  };

  // ─── Derived ─────────────────────────────────────────────────────────────
  const canAnalyze = !!primaryImage && query.trim().length > 5 && !analyzing;
  const classification = query.trim() ? classifyQuery(query) : null;
  const needsComparison = classification?.temporal && !comparisonImage;
  const imageUrls = {
    primary:    primaryUrl    || DEMO_IMAGE_URLS.primary,
    comparison: comparisonUrl || DEMO_IMAGE_URLS.comparison,
    change:     DEMO_IMAGE_URLS.change,
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Analysis overlay (floating, always on top) ─────────────────── */}
      {overlayOpen && (
        <AnalysisOverlay
          view={overlayView}
          completedSteps={completedSteps}
          result={finalResult}
          onClose={handleCloseOverlay}
          mapTab={mapTab}
          onMapTabChange={setMapTab}
          imageUrls={imageUrls}
        />
      )}

      {/* ── Page content ───────────────────────────────────────────────── */}
      <div className={`overflow-y-auto h-full transition-opacity duration-200 ${overlayOpen ? 'opacity-40 pointer-events-none select-none' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-16">

          {/* Page heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Satellite Analysis</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Ask a question about your satellite imagery. SatQuery will determine the required
              analysis and evidence automatically.
            </p>
          </div>

          {/* ── Two-column workspace ──────────────────────────────────────── */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

            {/* Column header bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 bg-slate-50 border-b border-slate-200">
              <div className="px-5 py-3 flex items-center gap-2">
                <Satellite className="w-4 h-4 text-blue-800" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Satellite Imagery</span>
              </div>
              <div className="px-5 py-3 flex items-center gap-2">
                <span className="w-4 h-4 flex items-center justify-center text-blue-800 font-bold text-base leading-none">?</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Ask Your Question</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">

              {/* ─── LEFT — imagery ──────────────────────────────────────── */}
              <div className="p-5 space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Satellite Imagery</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Provide the imagery you want to analyze.</p>
                </div>

                {/* Primary image */}
                {!primaryImage ? (
                  <UploadZone onFile={handlePrimaryFile} onDemo={loadDemoPrimary} />
                ) : (
                  <ImageCard
                    meta={primaryImage} url={primaryUrl} variant="primary"
                    onReplace={() => { setPrimaryImage(null); setPrimaryUrl(''); }}
                  />
                )}

                {/* Temporal pair badge */}
                {primaryImage && comparisonImage && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Temporal pair — {comparisonImage.acquisitionDate} ↔ {primaryImage.acquisitionDate}
                  </div>
                )}

                {/* Comparison image */}
                {!showComparison ? (
                  <AddStrip
                    label="Add Comparison Image"
                    hint="Required for questions involving change over time."
                    icon={<Layers className="w-4 h-4" />}
                    onClick={() => setShowComparison(true)}
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Comparison Imagery</p>
                      {!comparisonImage && (
                        <button type="button" onClick={() => setShowComparison(false)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 focus-visible:outline-none">
                          Collapse
                        </button>
                      )}
                    </div>
                    {!comparisonImage ? (
                      <div className="space-y-2">
                        <UploadZone onFile={handleComparisonFile} onDemo={loadDemoComparison} compact />
                        <div className="flex gap-2">
                          <button type="button" onClick={loadDemoComparison}
                            className="flex-1 px-3 py-1.5 text-[11px] font-medium border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 rounded text-slate-600 transition-colors">
                            Demo 2022 Sentinel-2
                          </button>
                          <button type="button" onClick={loadDemoPrimary}
                            className="flex-1 px-3 py-1.5 text-[11px] font-medium border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 rounded text-slate-600 transition-colors">
                            Demo 2026 Sentinel-2
                          </button>
                        </div>
                      </div>
                    ) : (
                      <ImageCard
                        meta={comparisonImage} url={comparisonUrl} variant="comparison"
                        onReplace={() => { setComparisonImage(null); setComparisonUrl(''); }}
                        onRemove={() => { setComparisonImage(null); setComparisonUrl(''); setShowComparison(false); }}
                      />
                    )}
                  </div>
                )}

                {/* SAR image */}
                {!showSar ? (
                  <AddStrip
                    label="Add SAR Evidence"
                    hint="Provide SAR imagery for structural or cross-modal verification."
                    icon={<Radio className="w-4 h-4" />}
                    onClick={() => setShowSar(true)}
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">SAR Evidence</p>
                      {!sarImage && (
                        <button type="button" onClick={() => setShowSar(false)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 focus-visible:outline-none">
                          Collapse
                        </button>
                      )}
                    </div>
                    {!sarImage ? (
                      <div className="space-y-2">
                        <UploadZone onFile={handleSarFile} onDemo={loadDemoSar} compact />
                        <button type="button" onClick={loadDemoSar}
                          className="w-full px-3 py-1.5 text-[11px] font-medium border border-slate-200 bg-white hover:bg-slate-100 rounded text-slate-600 transition-colors">
                          Demo Sentinel-1 C-SAR (2026)
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageCard
                          meta={sarImage} url={sarUrl} variant="sar"
                          onReplace={() => { setSarImage(null); setSarUrl(''); }}
                          onRemove={() => { setSarImage(null); setSarUrl(''); setShowSar(false); }}
                        />
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          SAR evidence available — {sarImage.satellite}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ─── RIGHT — query + send ─────────────────────────────────── */}
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Ask your question</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Describe what you want to know in natural language.</p>
                </div>

                {/* Message box with embedded Send */}
                <div className={`relative border rounded-lg overflow-hidden transition-colors ${
                  !primaryImage ? 'border-slate-200 opacity-70' : 'border-slate-300 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600'
                }`}>
                  <textarea
                    rows={7}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    disabled={!primaryImage}
                    placeholder="Ask a question about this satellite imagery…"
                    aria-label="Analysis question"
                    className="w-full px-4 pt-3 pb-12 text-sm text-slate-900 placeholder-slate-400 bg-white resize-none focus:outline-none disabled:cursor-not-allowed"
                  />

                  {/* Send button inside box */}
                  <div className="absolute bottom-3 right-3">
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      disabled={!canAnalyze}
                      aria-label="Analyze"
                      className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-700
                        ${canAnalyze
                          ? 'bg-blue-900 hover:bg-blue-800 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      Analyze →
                    </button>
                  </div>

                  {/* Char count */}
                  <div className="absolute bottom-3.5 left-4 text-[10px] text-slate-300 font-mono select-none">
                    {query.length} chars
                  </div>
                </div>

                {/* Missing image notice */}
                {!primaryImage && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Load or upload a satellite image first.
                  </div>
                )}

                {/* Needs comparison warning */}
                {needsComparison && primaryImage && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Your query requires a comparison image.{' '}
                    <button type="button" onClick={() => { setShowComparison(true); }}
                      className="font-semibold underline hover:no-underline focus-visible:outline-none">
                      Add one
                    </button>
                  </div>
                )}

                {/* Example queries */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Example queries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLE_QUERIES.map(q => (
                      <button
                        key={q.short}
                        type="button"
                        onClick={() => setQuery(q.full)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded border text-[11px] font-medium transition-colors
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700
                          ${query === q.full
                            ? 'bg-blue-900 text-white border-blue-900'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-900 hover:bg-blue-50'
                          }`}
                      >
                        <ChevronRight className="w-3 h-3 opacity-60" />{q.short}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Responsibility note */}
                <div className="flex items-start gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded mt-auto">
                  <Info className="w-3.5 h-3.5 text-blue-700 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Model and tool selection is handled automatically.</strong>{' '}
                    SatQuery determines the required evidence, selects specialist analysis tools, and verifies the result — all without manual configuration.
                  </p>
                </div>

                {/* Quick demo loader */}
                <button
                  type="button"
                  onClick={loadFullDemo}
                  className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-[11px] font-semibold text-slate-600 border border-dashed border-slate-300 rounded hover:bg-slate-50 hover:border-blue-400 hover:text-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                >
                  <Database className="w-3.5 h-3.5" />
                  Load full demonstration dataset (images + default query)
                </button>
              </div>
            </div>
          </div>

          {/* Bottom statement */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              Users describe what they want to know.{' '}
              <span className="font-semibold text-slate-600">SatQuery determines how to analyze it.</span>
            </p>
            <p className="text-[10px] text-slate-300 mt-1 font-mono uppercase tracking-widest">
              SIH 2026 Prototype · Demonstration Environment · Not an official government product
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

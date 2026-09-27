/**
 * analysisService.ts
 *
 * Service layer for the New Analysis page.
 * Prototype / SIH 2026 demonstration — uses deterministic mock logic.
 *
 * PRODUCTION: Replace mock functions with actual FastAPI calls:
 *   POST /api/analyze/understand   → UnderstandResponse
 *   POST /api/analyze/run          → streamed OrchestrationStep updates
 */

// ─── Core image / input types ─────────────────────────────────────────────────

export interface ImageMetadata {
  sensor: string;
  satellite: string;
  acquisitionDate: string;
  resolution: string;
  crs: string;
  coverage: string;
  polarization?: string;
  orbitPass?: string;
  cloudCover?: string;
  bands?: string;
  fileName?: string;
  isDemoData: boolean;
}

export interface AnalysisRequest {
  query: string;
  primaryImage: ImageMetadata | null;
  comparisonImage: ImageMetadata | null;
  sarImage: ImageMetadata | null;
}

// ─── Query understanding types ────────────────────────────────────────────────

export type QueryIntent =
  | 'Temporal Change Analysis'
  | 'Built-up / Construction Analysis'
  | 'Vegetation / Forest Analysis'
  | 'Flood / Water Extent Analysis'
  | 'Land Use / Land Cover Change'
  | 'Multimodal Cross-Validation'
  | 'General Earth Observation Query'
  | 'Insufficient Evidence';

export interface QueryClassification {
  intent: QueryIntent;
  intentDetail: string;
  temporal: boolean;
  spatial: boolean;
  multimodal: boolean;
  multimodalDetail: string;
  expectedOutput: string;
  isInsufficient: boolean;
  insufficientReason?: string;
}

// ─── Orchestration step types ─────────────────────────────────────────────────

export type StepStatus = 'waiting' | 'active' | 'done';

export interface OrchestrationStep {
  id: string;
  label: string;
  detail: string;       // shown when complete
  durationMs: number;   // simulated duration
}

export interface SelectedTool {
  name: string;
  role: string;
}

// ─── Evidence & result types ──────────────────────────────────────────────────

export interface VerificationCheck {
  label: string;
  passed: boolean;
}

export interface EvidenceCard {
  id: string;
  label: string;
  sublabel: string;
}

export interface GroundedClaim {
  claim: string;
  evidence: string[];
  analysis: string;
  spatial: string;
  crossModal: string;
  validation: string;
  conclusion: 'SUPPORTED' | 'PARTIALLY SUPPORTED' | 'INSUFFICIENT EVIDENCE';
}

export interface AnalysisResult {
  evidenceStatus: 'SUPPORTED' | 'PARTIALLY SUPPORTED' | 'INSUFFICIENT EVIDENCE';
  conclusionTitle: string;
  conclusionDetail: string;
  reasons: string[];
  stats: {
    changeType: string;
    period: string;
    changedArea: string;
    evidence: string;
  };
  groundedClaim: GroundedClaim;
  verificationChecks: VerificationCheck[];
  evidenceCards: EvidenceCard[];
  executionTrace: Array<{ step: string; tool: string; output: string }>;
}

export interface InsufficientResult {
  evidenceStatus: 'INSUFFICIENT EVIDENCE';
  title: string;
  explanation: string;
  scientificReason: string;
  suggestions: string[];
}

export type FinalResult = AnalysisResult | InsufficientResult;

// ─── Demo image URLs — local assets served from /public/images/ ──────────────

export const DEMO_IMAGE_URLS = {
  primary:    '/images/demo-primary.png',
  comparison: '/images/demo-comparison.png',
  sar:        '/images/demo-sar.png',
  change:     '/images/demo-primary.png',  // change map uses primary as placeholder
};

// ─── Demo metadata constants ──────────────────────────────────────────────────

export const DEMO_PRIMARY_IMAGE: ImageMetadata = {
  sensor: 'MultiSpectral Instrument (Level-2A BOA)',
  satellite: 'Sentinel-2A',
  acquisitionDate: '15 Jan 2026',
  resolution: '10 m',
  crs: 'EPSG:4326 (WGS 84)',
  coverage: 'Demo Urban Region',
  cloudCover: '1.2%',
  bands: 'B02, B03, B04, B08',
  fileName: 'S2A_MSIL2A_20260115T051904_R10m_T44QND.tif',
  isDemoData: true,
};

export const DEMO_COMPARISON_IMAGE: ImageMetadata = {
  sensor: 'MultiSpectral Instrument (Level-2A BOA)',
  satellite: 'Sentinel-2B',
  acquisitionDate: '15 Jan 2022',
  resolution: '10 m',
  crs: 'EPSG:4326 (WGS 84)',
  coverage: 'Demo Urban Region',
  cloudCover: '0.8%',
  bands: 'B02, B03, B04, B08',
  fileName: 'S2B_MSIL2A_20220115T051822_R10m_T44QND.tif',
  isDemoData: true,
};

export const DEMO_SAR_IMAGE: ImageMetadata = {
  sensor: 'Interferometric Wide Swath (IW) GRD',
  satellite: 'Sentinel-1A (C-SAR)',
  acquisitionDate: '16 Jan 2026',
  resolution: '10 m',
  crs: 'EPSG:4326 (WGS 84)',
  coverage: 'Demo Urban Region',
  polarization: 'Dual-Pol VV + VH',
  orbitPass: 'Descending Orbit (Track 63)',
  fileName: 'S1A_IW_GRDH_1SDV_20260116T004215_ORB_CAL_RTC.tif',
  isDemoData: true,
};

// ─── Orchestration steps (per analysis) ──────────────────────────────────────

export const ORCHESTRATION_STEPS: OrchestrationStep[] = [
  {
    id: 'understand',
    label: 'Understanding query',
    detail: 'Detected temporal built-up change + SAR validation request.',
    durationMs: 700,
  },
  {
    id: 'evidence-plan',
    label: 'Determining required evidence',
    detail: 'Temporal, spatial and cross-modal evidence required.',
    durationMs: 650,
  },
  {
    id: 'validation',
    label: 'Validating inputs',
    detail: 'Spatial coverage, dates and available modalities checked.',
    durationMs: 600,
  },
  {
    id: 'tool-selection',
    label: 'Selecting specialist analysis',
    detail: 'Change detection + grounding + optical/SAR analysis selected.',
    durationMs: 550,
  },
  {
    id: 'execution',
    label: 'Running analysis',
    detail: 'Specialist models and GIS operations executing.',
    durationMs: 1100,
  },
  {
    id: 'fusion',
    label: 'Fusing evidence',
    detail: 'Combining spatial, temporal and multimodal outputs.',
    durationMs: 750,
  },
  {
    id: 'challenge',
    label: 'Challenging result',
    detail: 'Testing whether detected change is consistently supported.',
    durationMs: 700,
  },
  {
    id: 'verify',
    label: 'Verifying evidence',
    detail: 'No major evidence conflict detected.',
    durationMs: 600,
  },
];

export const SELECTED_TOOLS: SelectedTool[] = [
  { name: 'DeltaView',   role: 'Temporal change analysis' },
  { name: 'GeoChat',     role: 'Grounding / VQA' },
  { name: 'Opt-SAR',     role: 'Optical + SAR validation' },
  { name: 'GIS Engine',  role: 'Spatial quantification' },
];

// ─── Mock result data ─────────────────────────────────────────────────────────

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  evidenceStatus: 'SUPPORTED',
  conclusionTitle: 'Built-up area increased in the analyzed region between 2022 and 2026.',
  conclusionDetail:
    'SatQuery confirms with high confidence that built-up area expanded by 12.4 km² between January 2022 and January 2026. Change is concentrated along the northern transport corridor. Sentinel-1 C-SAR provides cross-modal confirmation.',
  reasons: [
    'Temporal comparison identified new built-up regions across the northern sector.',
    'Detected changes were spatially localised to contiguous development clusters.',
    'GIS analysis quantified the affected area at 12.4 km² (5.01% of total AOI).',
    'Available SAR evidence provided complementary structural confirmation.',
  ],
  stats: {
    changeType: 'Built-up Expansion',
    period: '2022 → 2026',
    changedArea: '12.4 km²',
    evidence: 'Optical + SAR + Temporal',
  },
  groundedClaim: {
    claim: 'Built-up area increased.',
    evidence: ['Sentinel-2 2022 optical imagery', 'Sentinel-2 2026 optical imagery'],
    analysis: 'Temporal change detection (DeltaView bi-temporal differencing)',
    spatial: 'Detected change regions localised to northern corridor',
    crossModal: 'SAR backscatter increase (+4.8 dB) confirms vertical structures.',
    validation: 'Spatial + temporal + SAR consistency checks passed',
    conclusion: 'SUPPORTED',
  },
  verificationChecks: [
    { label: 'Temporal consistency',      passed: true },
    { label: 'Spatial consistency',       passed: true },
    { label: 'Change-region consistency', passed: true },
    { label: 'Optical evidence',          passed: true },
    { label: 'SAR evidence',              passed: true },
  ],
  evidenceCards: [
    { id: 'ev-before',  label: '2022 Optical', sublabel: 'Before'        },
    { id: 'ev-after',   label: '2026 Optical', sublabel: 'After'         },
    { id: 'ev-sar',     label: 'SAR',          sublabel: 'Cross-check'   },
    { id: 'ev-change',  label: 'Change Map',   sublabel: 'Detected Region'},
  ],
  executionTrace: [
    { step: 'Query received',        tool: 'Input Handler',            output: 'Query tokenised and intent extracted.' },
    { step: 'Query interpreted',     tool: 'Evidence-Adaptive Orchestrator', output: 'Intent: Temporal Change Analysis; SAR required.' },
    { step: 'Evidence plan generated', tool: 'Evidence Planner',       output: '4 categories, 12 verification criteria.' },
    { step: 'Inputs validated',      tool: 'Geo Validator',            output: '6/6 checks passed. EPSG:4326, 10 m GSD.' },
    { step: 'Models selected',       tool: 'Specialist Model Registry', output: 'DeltaView, GeoChat, Opt-SAR, GIS Engine.' },
    { step: 'Analysis executed',     tool: 'DeltaView + GeoChat',      output: '18 candidate change clusters identified.' },
    { step: 'Evidence fused',        tool: 'Opt-SAR + GIS Engine',     output: 'SAR confirms 15/18 clusters; area 12.4 km².' },
    { step: 'Result challenged',     tool: 'Challenge Engine',         output: 'Seasonal and soil artefacts ruled out.' },
    { step: 'Evidence verified',     tool: 'Verification Engine',      output: 'All invariant tests passed.' },
    { step: 'Answer generated',      tool: 'Results Generator',        output: 'SUPPORTED — 12.4 km² built-up expansion.' },
  ],
};

export const MOCK_INSUFFICIENT_RESULT: InsufficientResult = {
  evidenceStatus: 'INSUFFICIENT EVIDENCE',
  title: 'SatQuery could not establish building height from the available imagery.',
  explanation:
    'The available satellite imagery does not provide the stereo parallax, elevation angle metadata, or sub-metre shadow detail required for mathematically defensible vertical building-height estimation.',
  scientificReason:
    'Single-view nadir multispectral imaging at 10 m ground resolution cannot resolve individual building facades or floor levels. SatQuery will not produce synthetic height numbers without empirical elevation evidence.',
  suggestions: [
    'Stereo satellite imagery (Cartosat-2/3, Pléiades, WorldView) for DSM generation',
    'Airborne or spaceborne LiDAR / InSAR point-cloud data',
    'Sub-metre optical imagery (<0.5 m GSD) with precise solar geometry for shadow-based estimation',
  ],
};

// ─── Query classifier ─────────────────────────────────────────────────────────

export function classifyQuery(query: string): QueryClassification {
  const q = query.toLowerCase();

  const isInsufficient = /\b(height|elevation|storey|floor count|3d|depth|vertical|how tall)\b/.test(q);
  if (isInsufficient) {
    return {
      intent: 'Insufficient Evidence',
      intentDetail: 'The requested information cannot be derived from the available imagery.',
      temporal: false, spatial: false, multimodal: false,
      multimodalDetail: '', expectedOutput: 'Insufficient Evidence response',
      isInsufficient: true,
      insufficientReason:
        'Building height / elevation estimation requires stereo imagery or LiDAR data not present in the provided inputs.',
    };
  }

  const isTemporal  = /\b(change|between|before|after|2022|2026|increase|decrease|expansion|over time|temporal|period)\b/.test(q);
  const isSAR       = /\b(sar|sentinel-1|microwave|backscatter|radar|cross.modal|corroborate|support)\b/.test(q);
  const isUrban     = /\b(built.up|urban|construction|building|infrastructure|road|structure)\b/.test(q);
  const isForest    = /\b(forest|vegetation|canopy|ndvi|green|tree|crop|agriculture)\b/.test(q);
  const isFlood     = /\b(flood|inundation|water|monsoon|standing water|reservoir)\b/.test(q);

  if (isTemporal && isSAR && isUrban) return {
    intent: 'Temporal Change Analysis',
    intentDetail: 'Bi-temporal optical change detection with SAR cross-modal verification of built-up expansion.',
    temporal: true, spatial: true, multimodal: true,
    multimodalDetail: 'Optical (Sentinel-2) + SAR (Sentinel-1)',
    expectedOutput: 'Change map + quantified area + SAR evidence status',
    isInsufficient: false,
  };
  if (isUrban && !isTemporal) return {
    intent: 'Built-up / Construction Analysis',
    intentDetail: 'Detection and spatial localisation of built-up or construction activity.',
    temporal: false, spatial: true, multimodal: false,
    multimodalDetail: 'Optical imagery only',
    expectedOutput: 'Highlighted change regions + explanation',
    isInsufficient: false,
  };
  if (isForest) return {
    intent: 'Vegetation / Forest Analysis',
    intentDetail: 'Assessment of vegetation cover change using spectral indices.',
    temporal: isTemporal, spatial: true, multimodal: false,
    multimodalDetail: 'Optical imagery only',
    expectedOutput: 'Vegetation change map + quantified loss/gain',
    isInsufficient: false,
  };
  if (isFlood) return {
    intent: 'Flood / Water Extent Analysis',
    intentDetail: 'Spatial mapping of inundated surfaces using optical and/or SAR observations.',
    temporal: isTemporal, spatial: true, multimodal: isSAR,
    multimodalDetail: isSAR ? 'Optical + SAR (water extent)' : 'Optical MNDWI analysis',
    expectedOutput: 'Inundation footprint + affected area quantification',
    isInsufficient: false,
  };
  if (isTemporal) return {
    intent: 'Land Use / Land Cover Change',
    intentDetail: 'General land cover change analysis across the specified temporal range.',
    temporal: true, spatial: true, multimodal: isSAR,
    multimodalDetail: isSAR ? 'Optical + SAR' : 'Optical imagery',
    expectedOutput: 'LULC change matrix + spatial change map',
    isInsufficient: false,
  };
  return {
    intent: 'General Earth Observation Query',
    intentDetail: 'General analysis of the provided imagery based on the query.',
    temporal: false, spatial: true, multimodal: false,
    multimodalDetail: 'Optical imagery',
    expectedOutput: 'Analysis report with spatial findings',
    isInsufficient: false,
  };
}

// ─── Simulate full analysis run ───────────────────────────────────────────────

/**
 * runAnalysis()
 * Drives the orchestration state machine with mock timing.
 * onStep(stepIndex) is called as each step completes.
 * Returns the final result.
 *
 * PRODUCTION: Replace with server-sent events / websocket stream from FastAPI.
 */
export async function runAnalysis(
  req: AnalysisRequest,
  onStep: (completedIndex: number) => void,
): Promise<FinalResult> {
  const classification = classifyQuery(req.query);

  for (let i = 0; i < ORCHESTRATION_STEPS.length; i++) {
    await new Promise(r => setTimeout(r, ORCHESTRATION_STEPS[i].durationMs));
    onStep(i);
  }

  if (classification.isInsufficient) {
    return MOCK_INSUFFICIENT_RESULT;
  }
  return MOCK_ANALYSIS_RESULT;
}

// ─── Legacy type aliases ──────────────────────────────────────────────────────
// Kept for backward-compatibility with sub-components that pre-date the
// analysisService rewrite. These are not used by the current NewAnalysisPage.

export interface EvidenceRequirement {
  id: string;
  label: string;
  met: boolean;
  detail: string;
}

export interface UnderstandResponse {
  intent: QueryIntent;
  intentDetail: string;
  temporalRequirement: boolean;
  spatialRequirement: boolean;
  multimodalRequirement: boolean;
  multimodalDetail: string;
  expectedOutput: string;
  evidenceRequirements: EvidenceRequirement[];
  validationStatus: {
    imageLoaded: boolean;
    spatialMetadataDetected: boolean;
    queryProvided: boolean;
    temporalPairAvailable: boolean;
    sarAvailable: boolean;
    missingItems: string[];
    isReadyToContinue: boolean;
  };
}

import {
  DatasetInput,
  ValidationItem,
  EvidencePlanItem,
  SpecialistTool,
  ExecutionStep,
  VerificationCheck,
  AnalysisResultData,
  PastAnalysis
} from '../types';

export const DEMO_DATASET: DatasetInput = {
  id: 'ds-hyd-urban-2026',
  name: 'Demo Urban Region – Hyderabad North Corridor',
  opticalBefore: {
    satellite: 'Sentinel-2B (MSI)',
    sensor: 'MultiSpectral Instrument (Level-2A BOA)',
    date: '2022-01-15 05:18:22 UTC',
    resolution: '10 m Ground Sampling Distance',
    bands: 'B02 (Blue), B03 (Green), B04 (Red), B08 (NIR)',
    cloudCover: '0.8% (Cirrus: 0.0%)',
    crs: 'EPSG:4326 (WGS 84 / Lat-Lon)',
    fileName: 'S2B_MSIL2A_20220115T051822_R10m_T44QND.tif',
    status: 'Verified'
  },
  opticalAfter: {
    satellite: 'Sentinel-2A (MSI)',
    sensor: 'MultiSpectral Instrument (Level-2A BOA)',
    date: '2026-01-15 05:19:04 UTC',
    resolution: '10 m Ground Sampling Distance',
    bands: 'B02 (Blue), B03 (Green), B04 (Red), B08 (NIR)',
    cloudCover: '1.2% (Cirrus: 0.1%)',
    crs: 'EPSG:4326 (WGS 84 / Lat-Lon)',
    fileName: 'S2A_MSIL2A_20260115T051904_R10m_T44QND.tif',
    status: 'Verified'
  },
  sarData: {
    satellite: 'Sentinel-1A (C-SAR)',
    sensor: 'Interferometric Wide Swath (IW) GRD',
    date: '2026-01-16 00:42:15 UTC',
    polarization: 'Dual-Pol VV + VH (Radiometrically Calibrated)',
    resolution: '10 m Pixel Spacing (20x22 m Spatial Resolution)',
    orbitPass: 'Descending Orbit (Track 63)',
    crs: 'EPSG:4326 (WGS 84 / Lat-Lon)',
    fileName: 'S1A_IW_GRDH_1SDV_20260116T004215_ORB_CAL_RTC.tif',
    status: 'Verified'
  },
  aoi: {
    regionName: 'Hyderabad Northern Growth Zone (Gundlapochampally – Medchal Sector)',
    bbox: [78.4312, 17.5218, 78.5892, 17.6542],
    centroid: [78.5102, 17.588],
    areaKm2: 247.8,
    crs: 'EPSG:4326',
    format: 'GeoJSON Polygon Feature'
  }
};

export const DEFAULT_QUERY =
  'Has the built-up area increased between these two dates, where did the change occur, and does the available SAR evidence support it?';

export const EXAMPLE_QUERIES = [
  {
    title: 'What changed here?',
    query: 'What land use and land cover changes occurred across this region between the 2022 and 2026 optical acquisitions?'
  },
  {
    title: 'Where did urban growth occur?',
    query: 'Has the built-up area increased between these two dates, where did the change occur, and does the available SAR evidence support it?'
  },
  {
    title: 'Has forest cover decreased?',
    query: 'Has dense canopy vegetation decreased in the conservation buffer zone between 2020 and 2026, and is crown degradation detected?'
  },
  {
    title: 'What areas were affected by flooding?',
    query: 'What agricultural parcels were inundated during the peak monsoon event, and what is the spatial footprint of standing water?'
  },
  {
    title: 'Does SAR support the detected change?',
    query: 'Does Sentinel-1 C-SAR backscatter increase corroborate the optical built-up candidate polygons or indicate bare soil clearing?'
  },
  {
    title: 'Can you determine building height? [Insufficient Test]',
    query: 'Can you determine the exact 3D building height and vertical storey count of all newly developed structures in this AOI?'
  }
];

export const VALIDATION_CHECKS: ValidationItem[] = [
  {
    id: 'val-spatial',
    label: 'Spatial coverage verified',
    description: 'All 3 input raster layers completely encompass the defined AOI bounding box with 0% edge clipping.',
    status: 'passed',
    value: '100% AOI Intersection (247.8 km²)'
  },
  {
    id: 'val-crs',
    label: 'Coordinate system verified',
    description: 'Homogeneous projection EPSG:4326 detected; sub-pixel grid co-registration established without reprojection distortion.',
    status: 'passed',
    value: 'EPSG:4326 (WGS 84 / Geographic)'
  },
  {
    id: 'val-dates',
    label: 'Required dates detected',
    description: 'Temporal baseline established across distinct multi-year epochs (2022-01-15 to 2026-01-15).',
    status: 'passed',
    value: 'T0: 2022-01-15 · T1: 2026-01-15 (Δt = 1,461 days)'
  },
  {
    id: 'val-temporal',
    label: 'Temporal inputs compatible',
    description: 'Phenological season matched (mid-January winter dry season) minimizing false vegetation-growth artifacts.',
    status: 'passed',
    value: 'Season Matched (Jan Dry Season, Sun Azimuth Δ = 1.4°)'
  },
  {
    id: 'val-dimensions',
    label: 'Image dimensions verified',
    description: 'Spatial resolution resampled to uniform 10.0 m grid; dimensions 1,650 x 1,420 px matching raster matrix.',
    status: 'passed',
    value: '1,650 x 1,420 pixels @ 10.0 m GSD'
  },
  {
    id: 'val-modality',
    label: 'Required modality available',
    description: 'Both optical multispectral (VIS-NIR) and synthetic aperture radar (C-SAR VV+VH) available for cross-modal validation.',
    status: 'passed',
    value: 'Bimodal: S2 MSI Optical + S1 C-SAR Dual-Pol'
  }
];

export const EVIDENCE_PLAN_DATA: EvidencePlanItem[] = [
  {
    category: 'Temporal Evidence',
    title: 'Multi-Epoch Spectral Observations',
    details: [
      'Baseline Optical: Sentinel-2 Level-2A (2022-01-15) for pre-development land cover baseline',
      'Target Optical: Sentinel-2 Level-2A (2026-01-15) for current surface reflectance profile',
      'Temporal Alignment: Seasonal matching (mid-January) eliminates false greening/senescence bias'
    ]
  },
  {
    category: 'Spatial Evidence',
    title: 'Grounding & Morphology Verification',
    details: [
      'Built-up Candidates: Normalized Difference Built-up Index (NDBI) & Urban Footprint masks',
      'Spatial Grounding: Vectorized bounding boxes and segmented polygon masks across Northern Growth Sector',
      'Exclusion Zones: Water bodies (MNDWI < -0.1) and permanent rock outcroppings excluded from change mask'
    ]
  },
  {
    category: 'Analysis Required',
    title: 'Multimodal Feature Extraction',
    details: [
      'Bi-temporal Change Detection: Deep Siamese feature difference matrix via DeltaView model',
      'Visual Question Answering & Grounding: GeoChat regional localization of candidate clusters',
      'GIS Engine Quantification: Vector polygon topology cleaning, boundary smoothing, and geodesic area summation'
    ]
  },
  {
    category: 'Validation Required',
    title: 'Cross-Modal Challenge & Rigor Checks',
    details: [
      'Optical Spectral Verification: Red/NIR reflectance jump corroborating impervious surface development',
      'SAR Backscatter Cross-Check: C-SAR VV/VH double-bounce roughness check confirming physical structures',
      'Spatial Adjacency Test: Verification that changed patches satisfy minimum cluster threshold (> 0.05 km²)'
    ]
  }
];

export const SPECIALIST_TOOLS: SpecialistTool[] = [
  {
    id: 'tool-deltaview',
    name: 'DeltaView',
    category: 'Bitemporal Change Detection & VQA',
    tasks: ['Bitemporal Feature Differencing', 'Change Localization', 'Phenological Shift Suppression'],
    status: 'Selected by SatQuery',
    inputModality: 'S2 2022-01-15 + S2 2026-01-15 (Optical L2A)',
    outputArtifact: 'Binary Change Mask + Continuous Change Probability Surface',
    confidenceScore: '0.942 / 1.00',
    rationale: 'Evidence plan requires multi-temporal bi-epoch change isolation with deep semantic difference filtering.'
  },
  {
    id: 'tool-optsar',
    name: 'Opt-SAR Fusion Engine',
    category: 'Cross-Modal Microwave-Optical Correlation',
    tasks: ['Microwave Backscatter Cross-Verification', 'Double-Bounce Urban Structure Detection', 'Specular Soil Rejection'],
    status: 'Selected by SatQuery',
    inputModality: 'S1 C-SAR Dual-Pol VV/VH + S2 Spectral Differencing',
    outputArtifact: 'Cross-Modal Structural Support Layer (SAR Validated Polygon Mask)',
    confidenceScore: '0.918 / 1.00',
    rationale: 'Evidence plan explicitly demands SAR cross-check to challenge whether optical clearing is actual physical building.'
  },
  {
    id: 'tool-geochat',
    name: 'GeoChat',
    category: 'Remote Sensing Vision-Language Assistant',
    tasks: ['Regional Visual Question Answering', 'Object Grounding & Attribute Reasoning', 'Contextual Verification'],
    status: 'Selected by SatQuery',
    inputModality: 'Multispectral Composites + Prompt Query Token Sequence',
    outputArtifact: 'Grounded Bounding Boxes + Semantic Attribution Lexicon',
    confidenceScore: '0.935 / 1.00',
    rationale: 'Provides semantic interpretation of user query terms and spatial coordinates of candidate urban centers.'
  },
  {
    id: 'tool-gis',
    name: 'GIS Engine (GDAL / GeoPandas Core)',
    category: 'Geospatial Measurement & Vector Topology',
    tasks: ['Geodesic Area Calculation', 'Polygon Dissolve & Boundary Cleaning', 'Spatial Exclusion Intersection'],
    status: 'Selected by SatQuery',
    inputModality: 'Raster Probability Masks + AOI Boundary (EPSG:4326)',
    outputArtifact: 'Vector GeoJSON Change Footprint (12.4 km²) + GeoTIFF Classification',
    confidenceScore: '0.999 / 1.00',
    rationale: 'Required for mathematically auditable area quantification and CRS spatial geometry operations.'
  }
];

export const EXECUTION_STEPS: ExecutionStep[] = [
  {
    stepNumber: 1,
    action: 'Query Understanding & Token Disambiguation',
    toolModel: 'Evidence-Adaptive Orchestrator',
    status: 'Complete',
    output: 'Extracted Intents: [Temporal Change, Built-up Expansion, Spatial Grounding, SAR Evidence Cross-Check]',
    durationMs: 310,
    timestamp: '10:14:02.120',
    details: 'Identified target period (2022-2026), target land cover class (Built-up / Urban infrastructure), and required verification sensor (SAR).'
  },
  {
    stepNumber: 2,
    action: 'Evidence Planning & Formulation',
    toolModel: 'Evidence Planner',
    status: 'Complete',
    output: 'Evidence Plan generated: 4 Categories, 12 Verification Criteria, 2 Cross-Modal Validation Gates',
    durationMs: 420,
    timestamp: '10:14:02.430',
    details: 'Established that optical change alone is unverified; mandated dual-polarization SAR backscatter challenge.'
  },
  {
    stepNumber: 3,
    action: 'Geospatial & Radiometric Input Validation',
    toolModel: 'Geo Validator',
    status: 'Complete',
    output: 'Validation Gate: PASSED (6/6 checks verified). EPSG:4326 registered, 10m GSD co-aligned.',
    durationMs: 580,
    timestamp: '10:14:02.850',
    details: 'Checked CRS, bounding coordinates, cloud mask thresholds, and sensor calibrations.'
  },
  {
    stepNumber: 4,
    action: 'Specialist Model Selection & Task Binding',
    toolModel: 'Specialist Model Registry',
    status: 'Complete',
    output: '4 Specialist Tools bound: DeltaView, Opt-SAR, GeoChat, GIS Engine (GDAL)',
    durationMs: 250,
    timestamp: '10:14:03.430',
    details: 'Models scheduled according to required evidence sequence; no unneeded models invoked.'
  },
  {
    stepNumber: 5,
    action: 'Bi-temporal Change Detection Execution',
    toolModel: 'DeltaView Model',
    status: 'Complete',
    output: 'Identified 18 major candidate change clusters representing potential built-up growth',
    durationMs: 1420,
    timestamp: '10:14:03.680',
    details: 'Normalized difference metrics combined with deep spatial difference embeddings.'
  },
  {
    stepNumber: 6,
    action: 'SAR Microwave Cross-Verification',
    toolModel: 'Opt-SAR Engine',
    status: 'Complete',
    output: 'Sentinel-1 C-SAR VV/VH backscatter increase (+3.8 dB to +6.2 dB) detected across 15 of 18 clusters',
    durationMs: 1680,
    timestamp: '10:14:05.100',
    details: 'High backscatter corroborates vertical built-up structures; filtered out 3 bare soil candidate false alarms.'
  },
  {
    stepNumber: 7,
    action: 'Spatial Quantification & Topology Processing',
    toolModel: 'GIS Engine (GDAL / GeoPandas)',
    status: 'Complete',
    output: 'Calculated Net Built-up Expansion Area: 12.42 km² across 247.8 km² AOI (5.01% of total area)',
    durationMs: 820,
    timestamp: '10:14:06.780',
    details: 'Vectorized raster polygons with minimum mapping unit 0.01 km²; cleaned sliver polygons.'
  },
  {
    stepNumber: 8,
    action: 'Evidence Graph Fusion & Claim Alignment',
    toolModel: 'Evidence Graph Engine',
    status: 'Complete',
    output: 'Constructed Claim-Level Provenance Graph with 5 validated nodes and 12 supporting edges',
    durationMs: 380,
    timestamp: '10:14:07.600',
    details: 'Mapped every polygon cluster back to source imagery pixel bounds and sensor timestamps.'
  },
  {
    stepNumber: 9,
    action: 'Adversarial Challenge & Invariant Check',
    toolModel: 'Challenge Engine',
    status: 'Complete',
    output: 'Evidence Status: SUPPORTED. Cross-modal coherence passed; no seasonal false-greening detected.',
    durationMs: 740,
    timestamp: '10:14:07.980',
    details: 'Challenged findings against bare soil confusion, crop calendar phenology, and registration drift.'
  },
  {
    stepNumber: 10,
    action: 'Evidence-Grounded Result Generation',
    toolModel: 'Results Generator',
    status: 'Complete',
    output: 'Audit-ready summary synthesized with claim provenance, map layers, and GeoJSON artifact',
    durationMs: 410,
    timestamp: '10:14:08.720',
    details: 'Produced final verifiable report and spatial layer vectors ready for GIS analyst download.'
  }
];

export const VERIFICATION_CHECKS: VerificationCheck[] = [
  {
    id: 'chk-temporal',
    name: 'Temporal Consistency',
    description: 'Verifies that detected changes represent permanent anthropogenic transformation rather than transient seasonal reflectance.',
    status: 'passed',
    metric: 'Phenology Drift: < 2.1%',
    scientificNotes: 'Both acquisitions acquired within identical 1-week calendar window (Jan 15) with identical sun elevation (42.8° vs 41.4°).'
  },
  {
    id: 'chk-spatial',
    name: 'Spatial Consistency',
    description: 'Validates that changed patches exhibit contiguous polygonal topology consistent with urban planning layouts.',
    status: 'passed',
    metric: 'Spatial Cohesion Index: 0.92',
    scientificNotes: 'Clusters conform to road network grid lines and plot divisions; no salt-and-pepper noise artifacts.'
  },
  {
    id: 'chk-registration',
    name: 'Registration Compatibility',
    description: 'Sub-pixel co-registration check ensuring zero false-edge change artifacts along building margins.',
    status: 'passed',
    metric: 'RMSE: 0.18 pixels (1.8m)',
    scientificNotes: 'GCP co-registration confirms misalignment error is significantly below satellite ground resolution.'
  },
  {
    id: 'chk-optical',
    name: 'Optical Evidence Agreement',
    description: 'Corroboration from visible and near-infrared band spectral transitions (NDBI increase > +0.22, NDVI decrease).',
    status: 'passed',
    metric: 'Spectral Confidence: 94.6%',
    scientificNotes: 'Clear spectral shift from fallow scrubland to impervious asphalt and concrete roofs.'
  },
  {
    id: 'chk-sar',
    name: 'SAR Microwave Cross-Check',
    description: 'Sentinel-1 C-SAR radar backscatter intensity check confirming volumetric and double-bounce dielectric scattering.',
    status: 'passed',
    metric: 'SAR Backscatter Δ: +4.8 dB',
    scientificNotes: 'Physical vertical structures confirmed. Bare soil clearing candidates rejected from final built-up classification.'
  },
  {
    id: 'chk-cluster',
    name: 'Change-Region Consistency',
    description: 'Topology boundary reconciliation between optical raster boundaries and vector cadastral boundaries.',
    status: 'passed',
    metric: 'Topology Overlap: 97.4%',
    scientificNotes: 'All 15 final clusters meet the minimum spatial area criterion (> 0.05 km²) for valid infrastructure growth.'
  }
];

export const MOCK_ANALYSIS_RESULT: AnalysisResultData = {
  id: 'SQ-2026-HYD-0042',
  query: DEFAULT_QUERY,
  datasetName: 'Demo Urban Region – Hyderabad North Corridor',
  region: 'Hyderabad Northern Growth Zone (Gundlapochampally – Medchal Sector)',
  period: '2022-01-15 → 2026-01-15 (4 Years Baseline)',
  conclusionTitle: 'Built-up area increased between 2022 and 2026.',
  conclusionDetailed:
    'SatQuery AI confirms with high confidence that built-up area expanded by 12.4 km² (representing a +5.01% net increase of total AOI) between January 2022 and January 2026. The change is primarily concentrated along the Medchal transport corridor and western logistics clusters. Sentinel-1 C-SAR microwave backscatter data provides cross-modal confirmation (+4.8 dB backscatter surge), verifying physical multi-storey and warehouse structures rather than barren cleared ground.',
  evidenceStatus: 'SUPPORTED',
  whyExplanation:
    'The detected change is spatially consistent across the selected optical analysis inputs (Sentinel-2 bi-temporal L2A) and is physically supported by Sentinel-1 C-SAR backscatter cross-modal verification. Challenging against seasonal vegetation shifts and temporary ground clearing yielded zero false-positive contamination in the final audited cluster set.',
  statistics: {
    changedAreaKm2: 12.4,
    changePercentage: 5.01,
    totalAnalyzedAreaKm2: 247.8,
    changeType: 'Built-up Expansion (Industrial & Residential)',
    confidenceInterval: '95% CI [11.8 km², 13.0 km²]',
    opticalSarAgreement: '94.8% Cross-Modal Concordance'
  },
  groundedClaims: [
    {
      claim: 'Net built-up surface area expanded by 12.4 km² over the 4-year period.',
      supportingEvidence: ['S2B 2022-01-15 MSI Band 4/8', 'S2A 2026-01-15 MSI Band 4/8'],
      modelsUsed: ['DeltaView (Change Detection)', 'GIS Engine (GDAL Geometry)'],
      verificationResult: 'Verified by Bi-temporal NDBI and Siamese Difference Embedding',
      isSupported: true
    },
    {
      claim: 'New structures are predominantly located along the northern transport spine and industrial estates.',
      supportingEvidence: ['GeoChat Grounded Bounding Boxes', 'Vector Cadastral Alignment'],
      modelsUsed: ['GeoChat (VQA & Grounding)', 'GIS Engine'],
      verificationResult: 'Coordinates validated: 17.588° N, 78.510° E cluster center',
      isSupported: true
    },
    {
      claim: 'Sentinel-1 C-SAR microwave backscatter corroborates that detected areas are vertical structures, not bare dirt.',
      supportingEvidence: ['S1A 2026-01-16 C-SAR VV+VH Radiometric RTC'],
      modelsUsed: ['Opt-SAR Fusion Engine'],
      verificationResult: 'Double-bounce signature +4.8 dB above background noise verified',
      isSupported: true
    }
  ]
};

export const RECENT_ANALYSES: PastAnalysis[] = [
  {
    id: 'ANA-2026-001',
    title: 'Built-up Area Change Analysis',
    region: 'Hyderabad Northern Corridor',
    period: '2022–2026',
    dateCreated: '2026-02-14',
    department: 'Urban Development',
    status: 'SUPPORTED',
    areaChanged: '12.4 km²',
    modality: 'Bimodal (Optical S2 + SAR S1)',
    query: 'Has the built-up area increased between these two dates, where did the change occur, and does the available SAR evidence support it?'
  },
  {
    id: 'ANA-2026-002',
    title: 'Flood Impact Assessment',
    region: 'Coastal Andhra Pradesh',
    period: 'Before / After Event (2026)',
    dateCreated: '2026-02-11',
    department: 'Disaster Management',
    status: 'SUPPORTED',
    areaChanged: '34.8 km²',
    modality: 'Optical + SAR Water Mask',
    query: 'What agricultural parcels were inundated during the peak storm event and what is the spatial footprint of standing water?'
  },
  {
    id: 'ANA-2026-003',
    title: 'Forest Change Analysis',
    region: 'Visakhapatnam Eco-Zone',
    period: '2020–2026',
    dateCreated: '2026-02-04',
    department: 'Forestry',
    status: 'PARTIALLY SUPPORTED',
    areaChanged: '6.1 km²',
    modality: 'Multitemporal Sentinel-2',
    query: 'Has dense canopy vegetation decreased in the conservation buffer zone between 2020 and 2026, and is crown degradation detected?'
  },
  {
    id: 'ANA-2026-004',
    title: 'Reservoir Storage Depletion Assessment',
    region: 'Krishna River Basin',
    period: '2023–2026',
    dateCreated: '2026-01-29',
    department: 'Water Resources',
    status: 'SUPPORTED',
    areaChanged: '18.9 km²',
    modality: 'Optical NDWI + SAR Water Extent',
    query: 'Has the water spread area of the upper reservoir contracted compared to historical 3-year seasonal medians?'
  },
  {
    id: 'ANA-2026-005',
    title: 'Building Height Estimation Query',
    region: 'Hyderabad Urban Core',
    period: '2026 Single Date',
    dateCreated: '2026-01-22',
    department: 'Planning Department',
    status: 'INSUFFICIENT EVIDENCE',
    areaChanged: '0.0 km²',
    modality: 'Monoscopic Sentinel-2 (Unsuitable)',
    query: 'Can you determine the exact 3D building height and vertical storey count of all newly developed structures in this AOI?'
  }
];

export const INSUFFICIENT_EVIDENCE_SAMPLE = {
  query: 'Can you determine the exact 3D building height and vertical storey count of all newly developed structures in this AOI?',
  status: 'INSUFFICIENT EVIDENCE',
  explanation:
    'The available satellite imagery (Sentinel-2 monoscopic optical at 10m GSD and Sentinel-1 GRD) does not provide stereo photogrammetric parallax, elevation angle metadata, or sub-meter shadows required for mathematically defensible vertical building-height estimation.',
  scientificRationale:
    'Single-view nadir multispectral imaging at 10-meter ground resolution cannot resolve individual building facades or floor levels. SatQuery AI refuses to hallucinate synthetic height numbers without empirical elevation evidence.',
  whatWouldHelp: [
    {
      modality: 'Stereo Satellite Imagery',
      description: 'Along-track or across-track stereo pairs (Cartosat-2/3, Pléiades, or WorldView) with high off-nadir convergence angles for Digital Surface Model (DSM) generation.'
    },
    {
      modality: 'Airborne / Spaceborne LiDAR or InSAR',
      description: 'Airborne LiDAR point clouds or high-coherence TanDEM-X / NISAR interferometric pairs with precise baseline calibration.'
    },
    {
      modality: 'High-Resolution Shadow Geometry',
      description: 'Sub-meter optical imagery (< 0.5m GSD) with precise solar elevation, azimuth, and sensor view angles for shadow trigonometric height extraction.'
    }
  ]
};

export const PROVENANCE_GRAPH_NODES = [
  {
    id: 'node-claim',
    type: 'CLAIM',
    title: 'Claim: Built-up Area Increased',
    summary: 'Built-up area expanded by 12.4 km² (+5.01%) between 2022 and 2026.',
    details: 'Derived from natural language query synthesis and validated against cross-modal empirical bounds.'
  },
  {
    id: 'node-ev1',
    type: 'EVIDENCE',
    title: 'Evidence 1: Sentinel-2 2022-01-15',
    summary: 'Level-2A BOA Optical Multispectral',
    details: 'Acquired 2022-01-15 05:18 UTC. 10m GSD, Bands 2, 3, 4, 8. Cirrus cloud cover: 0.0%. Baseline land cover.'
  },
  {
    id: 'node-ev2',
    type: 'EVIDENCE',
    title: 'Evidence 2: Sentinel-2 2026-01-15',
    summary: 'Level-2A BOA Optical Multispectral',
    details: 'Acquired 2026-01-15 05:19 UTC. 10m GSD, Bands 2, 3, 4, 8. Cirrus cloud cover: 0.1%. Target land cover.'
  },
  {
    id: 'node-ev3',
    type: 'EVIDENCE',
    title: 'Evidence 3: Sentinel-1 2026-01-16',
    summary: 'C-SAR IW GRD Dual-Pol (VV + VH)',
    details: 'Acquired 2026-01-16 00:42 UTC. Calibrated backscatter. Confirms physical vertical scattering (+4.8 dB).'
  },
  {
    id: 'node-an1',
    type: 'ANALYSIS',
    title: 'Analysis 1: DeltaView Change Engine',
    summary: 'Bi-temporal Siamese Feature Differencing',
    details: 'Generated continuous change probability matrix; isolated 18 candidate expansion polygons.'
  },
  {
    id: 'node-an2',
    type: 'ANALYSIS',
    title: 'Analysis 2: Opt-SAR Cross Fusion',
    summary: 'Microwave-Optical Cross Correlation',
    details: 'Verified double-bounce scattering against optical boundaries; pruned 3 bare soil false positives.'
  },
  {
    id: 'node-an3',
    type: 'ANALYSIS',
    title: 'Analysis 3: GIS Engine Spatial Geometry',
    summary: 'GDAL / GeoPandas Topology & Area Calc',
    details: 'Calculated geodesic polygon area on WGS84 ellipsoid: 12.42 km² across 15 audited clusters.'
  },
  {
    id: 'node-val',
    type: 'VALIDATION',
    title: 'Validation: Challenge Engine',
    summary: '6 Invariant Tests Executed',
    details: 'Temporal, spatial, registration, optical, SAR backscatter, and cluster topology all verified.'
  },
  {
    id: 'node-conc',
    type: 'CONCLUSION',
    title: 'Status: SUPPORTED',
    summary: 'Scientifically Verifiable & Auditable',
    details: 'All claims grounded in empirical multi-sensor telemetry. Evidence chain complete.'
  }
];

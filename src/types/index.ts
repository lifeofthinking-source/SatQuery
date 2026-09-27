export type AppRoute =
  | 'map-workspace'
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'new-analysis'
  | 'data-validation'
  | 'evidence-planning'
  | 'tool-selection'
  | 'live-analysis'
  | 'verification'
  | 'results'
  | 'evidence-explorer'
  | 'execution-trace'
  | 'previous-analyses'
  | 'reports'
  | 'profile-settings'
  | 'insufficient-evidence';

export type UserRole =
  | 'Administrator'
  | 'Government Officer'
  | 'GIS Analyst'
  | 'Researcher'
  | 'Decision Maker';

export type GovernmentDepartment =
  | 'Disaster Management'
  | 'Urban Development'
  | 'Agriculture'
  | 'Forestry'
  | 'Water Resources'
  | 'Research / Academia'
  | 'Planning Department';

export interface UserProfile {
  name: string;
  email: string;
  department: GovernmentDepartment;
  role: UserRole;
  employeeId: string;
  station: string;
  clearanceLevel: string;
  isLoggedIn: boolean;
}

export type EvidenceStatus =
  | 'SUPPORTED'
  | 'PARTIALLY SUPPORTED'
  | 'INSUFFICIENT EVIDENCE'
  | 'UNDER CHALLENGE';

export interface DatasetInput {
  id: string;
  name: string;
  opticalBefore: {
    satellite: string;
    sensor: string;
    date: string;
    resolution: string;
    bands: string;
    cloudCover: string;
    crs: string;
    fileName: string;
    status: 'Verified' | 'Pending';
  };
  opticalAfter: {
    satellite: string;
    sensor: string;
    date: string;
    resolution: string;
    bands: string;
    cloudCover: string;
    crs: string;
    fileName: string;
    status: 'Verified' | 'Pending';
  };
  sarData: {
    satellite: string;
    sensor: string;
    date: string;
    polarization: string;
    resolution: string;
    orbitPass: string;
    crs: string;
    fileName: string;
    status: 'Verified' | 'Pending';
  };
  aoi: {
    regionName: string;
    bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
    centroid: [number, number];
    areaKm2: number;
    crs: string;
    format: string;
  };
}

export interface ValidationItem {
  id: string;
  label: string;
  description: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  value: string;
}

export interface EvidencePlanItem {
  category: 'Temporal Evidence' | 'Spatial Evidence' | 'Analysis Required' | 'Validation Required';
  title: string;
  details: string[];
}

export interface SpecialistTool {
  id: string;
  name: string;
  category: string;
  tasks: string[];
  status: 'Selected by SatQuery' | 'Standby' | 'Executing' | 'Completed';
  inputModality: string;
  outputArtifact: string;
  confidenceScore: string;
  rationale: string;
}

export interface ExecutionStep {
  stepNumber: number;
  action: string;
  toolModel: string;
  status: 'Complete' | 'In Progress' | 'Pending' | 'Flagged';
  output: string;
  durationMs: number;
  timestamp: string;
  details?: string;
}

export interface VerificationCheck {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'partial' | 'failed';
  metric: string;
  scientificNotes: string;
}

export interface AnalysisResultData {
  id: string;
  query: string;
  datasetName: string;
  region: string;
  period: string;
  conclusionTitle: string;
  conclusionDetailed: string;
  evidenceStatus: EvidenceStatus;
  whyExplanation: string;
  statistics: {
    changedAreaKm2: number;
    changePercentage: number;
    totalAnalyzedAreaKm2: number;
    changeType: string;
    confidenceInterval: string;
    opticalSarAgreement: string;
  };
  groundedClaims: Array<{
    claim: string;
    supportingEvidence: string[];
    modelsUsed: string[];
    verificationResult: string;
    isSupported: boolean;
  }>;
}

export interface PastAnalysis {
  id: string;
  title: string;
  region: string;
  period: string;
  dateCreated: string;
  department: string;
  status: EvidenceStatus;
  areaChanged: string;
  modality: string;
  query: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  status?: EvidenceStatus;
  pipelineStage?: string;
  evidenceSummary?: {
    areaKm2?: number;
    changeType?: string;
    sarCorroborated?: boolean;
    modelsUsed?: string[];
    clusterCount?: number;
    whyExplanation?: string;
  };
  actions?: Array<{
    label: string;
    route?: AppRoute;
    actionKey?: string;
  }>;
}

export interface DrawnPolygonData {
  coordinates: Array<{ lat: number; lng: number }>;
  areaKm2: number;
  perimeterKm: number;
  center: { lat: number; lng: number };
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}


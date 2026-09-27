import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AppRoute,
  UserProfile,
  GovernmentDepartment,
  UserRole,
  DatasetInput,
  ValidationItem,
  EvidencePlanItem,
  SpecialistTool,
  ExecutionStep,
  VerificationCheck,
  AnalysisResultData,
  DrawnPolygonData
} from '../types';
import {
  DEMO_DATASET,
  DEFAULT_QUERY,
  VALIDATION_CHECKS,
  EVIDENCE_PLAN_DATA,
  SPECIALIST_TOOLS,
  EXECUTION_STEPS,
  VERIFICATION_CHECKS,
  MOCK_ANALYSIS_RESULT
} from '../data/mockData';

interface AppContextType {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  user: UserProfile;
  login: (email: string, department: GovernmentDepartment, role: UserRole) => void;
  logout: () => void;
  query: string;
  setQuery: (query: string) => void;
  dataset: DatasetInput;
  loadDemoDataset: () => void;
  drawnPolygon: DrawnPolygonData | null;
  setDrawnPolygon: (poly: DrawnPolygonData | null) => void;
  validationChecks: ValidationItem[];
  evidencePlan: EvidencePlanItem[];
  specialistTools: SpecialistTool[];
  executionSteps: ExecutionStep[];
  currentExecutionIndex: number;
  verificationChecks: VerificationCheck[];
  resultData: AnalysisResultData;
  isSimulating: boolean;
  isInsufficientFlow: boolean;
  setIsInsufficientFlow: (val: boolean) => void;
  startAnalysisWorkflow: (selectedQuery?: string) => void;
  runLiveSimulation: () => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  fontSize: 'normal' | 'large' | 'larger';
  setFontSize: (size: 'normal' | 'large' | 'larger') => void;
  showArchitectureModal: boolean;
  setShowArchitectureModal: (show: boolean) => void;
  showHelpModal: boolean;
  setShowHelpModal: (show: boolean) => void;
  activeNotification: string | null;
  showNotification: (msg: string) => void;
  closeNotification: () => void;
}

const defaultUser: UserProfile = {
  name: 'Dr. Rajeshwar Rao',
  email: 'r.rao@nrsc.gov.in',
  department: 'Urban Development',
  role: 'GIS Analyst',
  employeeId: 'GOI-EO-88412',
  station: 'NRSC / ISRO Earth Observation Data Centre',
  clearanceLevel: 'Level-3 Analyst (National Spatial Data Infrastructure)',
  isLoggedIn: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('map-workspace');
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [query, setQuery] = useState<string>(DEFAULT_QUERY);
  const [dataset, setDataset] = useState<DatasetInput>(DEMO_DATASET);
  const [drawnPolygon, setDrawnPolygon] = useState<DrawnPolygonData | null>(null);
  const [validationChecks] = useState<ValidationItem[]>(VALIDATION_CHECKS);
  const [evidencePlan] = useState<EvidencePlanItem[]>(EVIDENCE_PLAN_DATA);
  const [specialistTools] = useState<SpecialistTool[]>(SPECIALIST_TOOLS);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>(EXECUTION_STEPS);
  const [currentExecutionIndex, setCurrentExecutionIndex] = useState<number>(EXECUTION_STEPS.length - 1);
  const [verificationChecks] = useState<VerificationCheck[]>(VERIFICATION_CHECKS);
  const [resultData, setResultData] = useState<AnalysisResultData>(MOCK_ANALYSIS_RESULT);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isInsufficientFlow, setIsInsufficientFlow] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [showArchitectureModal, setShowArchitectureModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification(null);
    }, 4000);
  };

  const closeNotification = () => setActiveNotification(null);

  const login = (email: string, department: GovernmentDepartment, role: UserRole) => {
    setUser({
      ...user,
      email: email || 'officer.geoi@nic.in',
      department,
      role,
      name: role === 'Administrator' ? 'Director S. K. Sharma' : role === 'GIS Analyst' ? 'Dr. Rajeshwar Rao' : 'A. K. Verma',
      isLoggedIn: true
    });
    setCurrentRoute('dashboard');
    showNotification(`Authenticated securely as ${role} (${department})`);
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setCurrentRoute('login');
    showNotification('Signed out of Government Earth Observation Intelligence session.');
  };

  const loadDemoDataset = () => {
    setDataset(DEMO_DATASET);
    showNotification('Loaded standard Demonstration Dataset: Hyderabad Urban Growth (Sentinel-2 & Sentinel-1)');
  };

  const startAnalysisWorkflow = (selectedQuery?: string) => {
    const q = selectedQuery || query;
    setQuery(q);

    // Detect if this is the insufficient evidence query
    if (q.toLowerCase().includes('height') || q.toLowerCase().includes('elevation')) {
      setIsInsufficientFlow(true);
      setCurrentRoute('insufficient-evidence');
      return;
    }

    setIsInsufficientFlow(false);
    setCurrentRoute('data-validation');
  };

  const runLiveSimulation = () => {
    setIsSimulating(true);
    setCurrentExecutionIndex(0);
    setCurrentRoute('live-analysis');

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < EXECUTION_STEPS.length) {
        setCurrentExecutionIndex(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        showNotification('Analysis pipeline complete. Proceeding to Verification.');
        setTimeout(() => {
          setCurrentRoute('verification');
        }, 1200);
      }
    }, 900);
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        user,
        login,
        logout,
        query,
        setQuery,
        dataset,
        loadDemoDataset,
        drawnPolygon,
        setDrawnPolygon,
        validationChecks,
        evidencePlan,
        specialistTools,
        executionSteps,
        currentExecutionIndex,
        verificationChecks,
        resultData,
        isSimulating,
        isInsufficientFlow,
        setIsInsufficientFlow,
        startAnalysisWorkflow,
        runLiveSimulation,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        showArchitectureModal,
        setShowArchitectureModal,
        showHelpModal,
        setShowHelpModal,
        activeNotification,
        showNotification,
        closeNotification
      }}
    >
      <div
        className={`min-h-screen text-slate-900 bg-white font-sans antialiased ${
          fontSize === 'large' ? 'text-[17px]' : fontSize === 'larger' ? 'text-[18px]' : 'text-[15px]'
        }`}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

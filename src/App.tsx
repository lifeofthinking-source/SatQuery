import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { GovernmentHeader } from './components/common/GovernmentHeader';
import { SubNav } from './components/common/SubNav';
import { GovernmentFooter } from './components/common/GovernmentFooter';
import { SystemArchitectureModal } from './components/common/SystemArchitectureModal';
import { HelpModal } from './components/common/HelpModal';

import { RealTimeMapWorkspacePage } from './components/pages/RealTimeMapWorkspacePage';
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { NewAnalysisPage } from './components/pages/NewAnalysisPage';
import { DataValidationPage } from './components/pages/DataValidationPage';
import { EvidencePlanningPage } from './components/pages/EvidencePlanningPage';
import { ToolSelectionPage } from './components/pages/ToolSelectionPage';
import { LiveAnalysisPage } from './components/pages/LiveAnalysisPage';
import { VerificationPage } from './components/pages/VerificationPage';
import { ResultsPage } from './components/pages/ResultsPage';
import { EvidenceExplorerPage } from './components/pages/EvidenceExplorerPage';
import { ExecutionTracePage } from './components/pages/ExecutionTracePage';
import { PreviousAnalysesPage } from './components/pages/PreviousAnalysesPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { ProfileSettingsPage } from './components/pages/ProfileSettingsPage';
import { InsufficientEvidenceView } from './components/pages/InsufficientEvidenceView';

import { CheckCircle2, X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentRoute, activeNotification, closeNotification } = useApp();

  const renderActiveRoute = () => {
    switch (currentRoute) {
      case 'map-workspace':
        return <RealTimeMapWorkspacePage />;
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'new-analysis':
        return <NewAnalysisPage />;
      case 'data-validation':
        return <DataValidationPage />;
      case 'evidence-planning':
        return <EvidencePlanningPage />;
      case 'tool-selection':
        return <ToolSelectionPage />;
      case 'live-analysis':
        return <LiveAnalysisPage />;
      case 'verification':
        return <VerificationPage />;
      case 'results':
        return <ResultsPage />;
      case 'evidence-explorer':
        return <EvidenceExplorerPage />;
      case 'execution-trace':
        return <ExecutionTracePage />;
      case 'previous-analyses':
        return <PreviousAnalysesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'profile-settings':
        return <ProfileSettingsPage />;
      case 'insufficient-evidence':
        return <InsufficientEvidenceView />;
      default:
        return <RealTimeMapWorkspacePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Government Portal Top Header */}
      <GovernmentHeader />

      {/* Portal Horizontal SubNav */}
      <SubNav />

      {/* Floating System Notification Toast */}
      {activeNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-900 text-white border border-slate-700 rounded-lg p-3.5 shadow-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{activeNotification}</span>
          </div>
          <button
            onClick={closeNotification}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Content Viewport */}
      <main className="flex-1 w-full">{renderActiveRoute()}</main>

      {/* Government Footer */}
      <GovernmentFooter />

      {/* System Architecture Drawer / Modal */}
      <SystemArchitectureModal />

      {/* Methodology & Operational Guide Modal */}
      <HelpModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

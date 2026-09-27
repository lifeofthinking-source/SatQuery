import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppRoute } from '../../types';
import {
  LayoutDashboard,
  Search,
  CheckCircle,
  Compass,
  Cpu,
  Activity,
  ShieldCheck,
  FileCheck2,
  FolderGit2,
  FileText,
  HelpCircle,
  Layers,
  MapPin,
  Globe
} from 'lucide-react';

export const SubNav: React.FC = () => {
  const { currentRoute, setCurrentRoute, user, isInsufficientFlow } = useApp();

  // If on landing or login, we show a clean minimal bar or landing bar
  if (currentRoute === 'landing' || currentRoute === 'login') {
    return null;
  }

  const primaryNavItems: Array<{ route: AppRoute; label: string; icon: React.ReactNode }> = [
    { route: 'map-workspace', label: 'Live Satellite Map', icon: <Globe className="w-3.5 h-3.5" /> },
    { route: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { route: 'new-analysis', label: 'New Analysis', icon: <Search className="w-3.5 h-3.5" /> },
    { route: 'previous-analyses', label: 'My Analyses', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
    { route: 'evidence-explorer', label: 'Evidence Explorer', icon: <Compass className="w-3.5 h-3.5" /> },
    { route: 'execution-trace', label: 'Execution Trace', icon: <Activity className="w-3.5 h-3.5" /> },
    { route: 'reports', label: 'Reports & Exports', icon: <FileText className="w-3.5 h-3.5" /> }
  ];

  // Pipeline step quick indicators if user is in an active analysis workflow
  const workflowRoutes: AppRoute[] = [
    'new-analysis',
    'data-validation',
    'evidence-planning',
    'tool-selection',
    'live-analysis',
    'verification',
    'results',
    'insufficient-evidence'
  ];

  const isInWorkflow = workflowRoutes.includes(currentRoute);

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between overflow-x-auto py-1 scrollbar-none">
          {/* Main Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {primaryNavItems.map(item => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => setCurrentRoute(item.route)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-blue-900 shadow-sm border border-slate-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={isActive ? 'text-blue-700' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Workflow Stage Breadcrumb / Quick Switch if in workflow */}
          {isInWorkflow && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 pl-4 border-l border-slate-200">
              <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">Workflow:</span>
              <button
                onClick={() => setCurrentRoute('new-analysis')}
                className={`hover:text-blue-800 ${currentRoute === 'new-analysis' ? 'font-semibold text-blue-900' : ''}`}
              >
                1. Query
              </button>
              <span>›</span>
              <button
                onClick={() => setCurrentRoute('data-validation')}
                className={`hover:text-blue-800 ${currentRoute === 'data-validation' ? 'font-semibold text-blue-900' : ''}`}
              >
                2. Validation
              </button>
              <span>›</span>
              <button
                onClick={() => setCurrentRoute('evidence-planning')}
                className={`hover:text-blue-800 ${currentRoute === 'evidence-planning' ? 'font-semibold text-blue-900' : ''}`}
              >
                3. Evidence Plan
              </button>
              <span>›</span>
              <button
                onClick={() => setCurrentRoute('tool-selection')}
                className={`hover:text-blue-800 ${currentRoute === 'tool-selection' ? 'font-semibold text-blue-900' : ''}`}
              >
                4. Tool Selection
              </button>
              <span>›</span>
              <button
                onClick={() => setCurrentRoute('live-analysis')}
                className={`hover:text-blue-800 ${currentRoute === 'live-analysis' ? 'font-semibold text-blue-900' : ''}`}
              >
                5. Live Run
              </button>
              <span>›</span>
              <button
                onClick={() => setCurrentRoute('verification')}
                className={`hover:text-blue-800 ${currentRoute === 'verification' ? 'font-semibold text-blue-900' : ''}`}
              >
                6. Challenge
              </button>
              <span>›</span>
              <button
                onClick={() => setCurrentRoute(isInsufficientFlow ? 'insufficient-evidence' : 'results')}
                className={`hover:text-blue-800 ${
                  currentRoute === 'results' || currentRoute === 'insufficient-evidence'
                    ? 'font-bold text-blue-900 underline'
                    : ''
                }`}
              >
                7. Results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

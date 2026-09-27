import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Eye, HelpCircle, Layers, User, LogOut, ChevronDown } from 'lucide-react';

export const GovernmentHeader: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    user,
    logout,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    setShowArchitectureModal,
    setShowHelpModal
  } = useApp();

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sticky top-0 z-40">
      {/* Top National Identity Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="font-medium tracking-wide">
              {language === 'hi'
                ? 'भारत सरकार – प्रौद्योगिकी प्रदर्शन'
                : 'Government of India – Technology Demonstration'}
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">
              Smart India Hackathon 2026 · PS 26167
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Accessibility: Font Size Controls */}
            <div className="flex items-center gap-1 border-r border-slate-700 pr-3">
              <span className="text-slate-400 mr-1 text-[11px]">Text Size:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  fontSize === 'normal' ? 'bg-slate-700 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="Default Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  fontSize === 'large' ? 'bg-slate-700 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="Large Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('larger')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  fontSize === 'larger' ? 'bg-slate-700 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="Extra Large Font Size"
              >
                A+
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 border-r border-slate-700 pr-3">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  language === 'en' ? 'bg-blue-900 text-blue-100 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <span className="text-slate-500">/</span>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  language === 'hi' ? 'bg-blue-900 text-blue-100 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Architecture Drawer Trigger */}
            <button
              onClick={() => setShowArchitectureModal(true)}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>System Architecture</span>
            </button>

            {/* Help modal */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Government Portal Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Emblem Placeholder & Title */}
        <div
          onClick={() => setCurrentRoute('map-workspace')}
          className="flex items-center gap-3.5 cursor-pointer group"
          title="Return to Real-Time Satellite Map Workspace"
        >
          {/* Neutral Government-style Emblem Icon */}
          <div className="w-11 h-11 border-2 border-slate-800 rounded bg-slate-50 flex items-center justify-center p-1.5 shadow-sm group-hover:border-blue-900 transition-colors">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-slate-900"
              aria-label="Government Emblem Symbol"
            >
              <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M24 5v38M5 24h38M10 10l28 28M10 38L38 10" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
              <circle cx="24" cy="24" r="5" fill="#1e3a8a" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>Government Earth Observation Intelligence Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
                SatQuery AI
              </span>
              <span className="text-[10px] font-mono font-medium uppercase px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                National EO Assistant
              </span>
            </div>
          </div>
        </div>

        {/* Right: Auth Profile / Login Button */}
        <div className="flex items-center gap-3">
          {user.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-slate-900 leading-tight">
                  {user.name}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {user.role} · {user.department}
                </div>
              </div>

              <button
                onClick={() => setCurrentRoute('profile-settings')}
                className="w-9 h-9 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 transition-colors"
                title="View Official Profile & Settings"
              >
                <User className="w-4 h-4" />
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-300 hover:border-red-300 rounded transition-colors"
                title="Sign out of government session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentRoute('landing')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  currentRoute === 'landing'
                    ? 'text-blue-900 font-semibold underline'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Portal Overview
              </button>

              <button
                onClick={() => setCurrentRoute('login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 border border-blue-900 rounded shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Government Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

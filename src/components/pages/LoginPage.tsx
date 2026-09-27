import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GovernmentDepartment, UserRole } from '../../types';
import { Shield, KeyRound, Mail, UserCheck, Lock, Building, CheckCircle2, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentRoute } = useApp();
  const [activeTab, setActiveTab] = useState<'demo' | 'email' | 'sso'>('demo');

  // Form state
  const [email, setEmail] = useState<string>('r.rao@nrsc.gov.in');
  const [department, setDepartment] = useState<GovernmentDepartment>('Urban Development');
  const [role, setRole] = useState<UserRole>('GIS Analyst');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [ssoToken, setSsoToken] = useState<string>('PARICHAY-GOI-SECURE-9921');

  const departmentsList: GovernmentDepartment[] = [
    'Disaster Management',
    'Urban Development',
    'Agriculture',
    'Forestry',
    'Water Resources',
    'Research / Academia',
    'Planning Department'
  ];

  const rolesList: UserRole[] = [
    'Administrator',
    'Government Officer',
    'GIS Analyst',
    'Researcher',
    'Decision Maker'
  ];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, department, role);
  };

  return (
    <div className="w-full min-h-[calc(100vh-180px)] bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {/* Top Header Card */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 text-center relative">
          <div className="w-12 h-12 rounded-full bg-blue-900/60 border border-blue-400 mx-auto mb-3 flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-200" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans">
            Government User Login
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Authorized access to Earth Observation Intelligence Services
          </p>
          <div className="mt-2 text-[10px] font-mono uppercase tracking-wider text-blue-400">
            Smart India Hackathon 2026 · PS 26167
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'demo'
                ? 'bg-white border-blue-900 text-blue-900 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Demo Government Login</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'email'
                ? 'bg-white border-blue-900 text-blue-900 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>Official Email</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sso')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'sso'
                ? 'bg-white border-blue-900 text-blue-900 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Government SSO</span>
          </button>
        </div>

        {/* Login Form Container */}
        <form onSubmit={handleSignIn} className="p-6 space-y-4">
          {activeTab === 'demo' && (
            <>
              <div className="bg-blue-50/70 border border-blue-200 p-3 rounded text-xs text-blue-900">
                <div className="font-semibold mb-0.5">Quick Evaluation Credentials</div>
                <div className="text-[11px] text-blue-800">
                  Select your desired department and role to experience role-adapted analysis workflows.
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:border-blue-900 focus:outline-none font-mono"
                    placeholder="officer@nic.in / user@nrsc.gov.in"
                  />
                </div>
              </div>

              {/* Department Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value as GovernmentDepartment)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:border-blue-900 focus:outline-none bg-white"
                  >
                    {departmentsList.map(dep => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:border-blue-900 focus:outline-none bg-white"
                  >
                    {rolesList.map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'email' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email (NIC / Government Domain)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-blue-900 focus:outline-none font-mono"
                  placeholder="name.dept@nic.in"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:border-blue-900 focus:outline-none font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500">
                Requires 2FA verification code sent to registered government mobile.
              </div>
            </>
          )}

          {activeTab === 'sso' && (
            <>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-900" />
                  <span>National Single Sign-On (Parichay / Jan Parichay)</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Direct federation with Government of India Identity Gateway.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SSO Certificate / Identity Token
                </label>
                <input
                  type="text"
                  value={ssoToken}
                  onChange={e => setSsoToken(e.target.value)}
                  readOnly
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-slate-100 font-mono text-slate-700"
                />
              </div>
            </>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In Securely</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Disclaimer Note */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-500">
              Prototype environment – no real government authentication is performed.
            </p>
          </div>
        </form>

        {/* Quick Back to Landing */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-xs">
          <button
            type="button"
            onClick={() => setCurrentRoute('landing')}
            className="text-slate-600 hover:text-slate-900 underline"
          >
            ← Return to Portal Overview
          </button>
        </div>
      </div>
    </div>
  );
};

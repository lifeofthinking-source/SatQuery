import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Shield, Building, Key, HardDrive, CheckCircle2, Server, ExternalLink } from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user, showNotification } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
          Government Officer Credentials & Node Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Profile & System Settings
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Authenticated identity and geospatial coordinate standards for authorized Earth Observation analysis sessions.
        </p>
      </div>

      {/* User Identity Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg font-mono">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
            <div className="text-xs text-slate-500 font-medium">
              {user.role} · {user.department}
            </div>
            <div className="text-[11px] font-mono text-blue-900 mt-0.5">
              Employee ID: {user.employeeId}
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="text-slate-400 font-mono text-[11px] uppercase block">
              Official Email
            </span>
            <span className="font-semibold text-slate-900 font-mono">{user.email}</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="text-slate-400 font-mono text-[11px] uppercase block">
              Clearance Level
            </span>
            <span className="font-semibold text-emerald-800 font-mono">{user.clearanceLevel}</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="text-slate-400 font-mono text-[11px] uppercase block">
              Operating Station
            </span>
            <span className="font-semibold text-slate-900">{user.station}</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="text-slate-400 font-mono text-[11px] uppercase block">
              Session Auth Token
            </span>
            <span className="font-semibold text-slate-700 font-mono">GOI-SAT-2026-X992 (Active)</span>
          </div>
        </div>
      </div>

      {/* Backend & GIS Preferences */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-900" />
          <span>Geospatial Engine Standards & FastApi Gateway</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded gap-2">
            <div>
              <div className="font-semibold text-slate-900">Default CRS Projection</div>
              <div className="text-[11px] text-slate-500">Universal EPSG:4326 (WGS 84 Lat/Lon Geographic)</div>
            </div>
            <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-300">
              EPSG:4326
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded gap-2">
            <div>
              <div className="font-semibold text-slate-900">Backend API Gateway</div>
              <div className="text-[11px] text-slate-500">FastAPI Orchestration Microservice Endpoints</div>
            </div>
            <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-300">
              Ready for REST /api/v1/orchestrate
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded gap-2">
            <div>
              <div className="font-semibold text-slate-900">Adversarial Challenge Invariant Suite</div>
              <div className="text-[11px] text-slate-500">Enforce 6-factor rigor check prior to conclusion delivery</div>
            </div>
            <span className="font-mono text-xs font-semibold text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-300">
              STRICT_VERIFICATION_ENABLED
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => showNotification('Updated Government Geospatial Profile Settings.')}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold"
          >
            Save Profile Configurations
          </button>
        </div>
      </div>
    </div>
  );
};

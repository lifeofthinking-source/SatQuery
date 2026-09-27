import React from 'react';
import { EvidenceStatus } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: EvidenceStatus | 'Complete' | 'In Progress' | 'Verified' | 'Pending' | 'passed' | 'failed' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-300';
  let icon = <Clock className="w-3.5 h-3.5" />;
  let label: string = status;

  if (normalized === 'SUPPORTED' || normalized === 'PASSED' || normalized === 'VERIFIED' || normalized === 'COMPLETE') {
    bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />;
    label = normalized === 'SUPPORTED' ? 'EVIDENCE SUPPORTED' : normalized;
  } else if (normalized === 'PARTIALLY SUPPORTED' || normalized === 'WARNING') {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-300';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />;
    label = 'PARTIALLY SUPPORTED';
  } else if (normalized === 'INSUFFICIENT EVIDENCE' || normalized === 'FAILED') {
    bgClass = 'bg-rose-50 text-rose-800 border-rose-300';
    icon = <XCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />;
    label = 'INSUFFICIENT EVIDENCE';
  } else if (normalized === 'UNDER CHALLENGE' || normalized === 'IN PROGRESS') {
    bgClass = 'bg-blue-50 text-blue-800 border-blue-300';
    icon = <ShieldAlert className="w-3.5 h-3.5 text-blue-700 shrink-0" />;
    label = 'UNDER CHALLENGE';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded ${bgClass} ${sizeClasses[size]} tracking-tight`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};

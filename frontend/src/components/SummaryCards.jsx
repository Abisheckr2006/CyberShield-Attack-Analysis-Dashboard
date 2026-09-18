import React from 'react';
import { Server, DoorOpen, ShieldAlert, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import TooltipHelper from './TooltipHelper';

export default function SummaryCards({ summary }) {
  const metrics = [
    {
      id: 'total_hosts',
      label: 'TOTAL HOSTS',
      value: summary?.total_hosts ?? 0,
      icon: Server,
      color: 'text-slate-200',
      border: 'border-slate-700/80',
      bg: 'bg-slate-900/60',
      term: 'host'
    },
    {
      id: 'open_ports',
      label: 'OPEN PORTS',
      value: summary?.open_ports ?? 0,
      icon: DoorOpen,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/40',
      term: 'port'
    },
    {
      id: 'high_risk',
      label: 'HIGH RISK',
      value: summary?.high_risk ?? 0,
      icon: ShieldAlert,
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/40',
      term: 'risk'
    },
    {
      id: 'medium_risk',
      label: 'MEDIUM RISK',
      value: summary?.medium_risk ?? 0,
      icon: AlertTriangle,
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/40',
      term: 'risk'
    },
    {
      id: 'low_risk',
      label: 'LOW RISK',
      value: summary?.low_risk ?? 0,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/40',
      term: 'risk'
    },
    {
      id: 'services_detected',
      label: 'SERVICES DETECTED',
      value: summary?.services_detected ?? 0,
      icon: Cpu,
      color: 'text-blue-400',
      border: 'border-blue-500/40',
      bg: 'bg-blue-950/40',
      term: 'service'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            className={`soc-card p-3.5 ${m.bg} border ${m.border} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 flex items-center">
                {m.label}
                <TooltipHelper term={m.term} />
              </span>
              <Icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <div className={`text-2xl font-extrabold font-mono ${m.color}`}>
              {m.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

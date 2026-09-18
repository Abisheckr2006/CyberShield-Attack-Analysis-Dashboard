import React from 'react';
import { Activity, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SummaryCardsLevel2({ summaryMetrics }) {
  const metrics = summaryMetrics || {
    events: 6,
    mitre: 4,
    alerts: 1,
    status: 'CONTAINED'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* EVENTS: 6 */}
      <div className="soc-card p-5 border-l-4 border-l-sky-500 bg-slate-900/90 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            EVENTS
          </span>
          <Activity className="w-5 h-5 text-sky-400" />
        </div>
        <div className="text-3xl font-black text-white font-mono">{metrics.events}</div>
        <div className="text-[11px] text-slate-400 font-mono">Scenario Event Steps</div>
      </div>

      {/* MITRE: 4 */}
      <div className="soc-card p-5 border-l-4 border-l-amber-500 bg-slate-900/90 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            MITRE
          </span>
          <ShieldAlert className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-3xl font-black text-amber-300 font-mono">{metrics.mitre}</div>
        <div className="text-[11px] text-slate-400 font-mono">Mapped Techniques</div>
      </div>

      {/* ALERTS: 1 */}
      <div className="soc-card p-5 border-l-4 border-l-rose-500 bg-slate-900/90 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            ALERTS
          </span>
          <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
        </div>
        <div className="text-3xl font-black text-rose-300 font-mono">{metrics.alerts}</div>
        <div className="text-[11px] text-slate-400 font-mono">Detection Point (13:15)</div>
      </div>

      {/* STATUS: CONTAINED */}
      <div className="soc-card p-5 border-l-4 border-l-emerald-500 bg-slate-900/90 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            STATUS
          </span>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="text-2xl font-black text-emerald-400 font-mono uppercase tracking-tight">
          {metrics.status}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">Access Revoked / Isolated</div>
      </div>
    </div>
  );
}

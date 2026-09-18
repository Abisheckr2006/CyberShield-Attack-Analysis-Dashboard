import React from 'react';
import { ShieldAlert, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

export default function Header({ activeView, scanStatus, scanTimestamp, isDemo }) {
  const isLevel2 = activeView === 'level2';

  const getStatusBadge = () => {
    if (isLevel2) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/80 text-amber-300 border border-amber-500/50 rounded-full text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Defensive Training Scenario
        </span>
      );
    }

    switch (scanStatus?.toLowerCase()) {
      case 'scanning':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 rounded-full text-xs font-semibold animate-pulse-glow">
            <Activity className="w-3.5 h-3.5 animate-spin" /> Scanning Active
          </span>
        );
      case 'completed':
      case 'completed (no open ports detected)':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Assessment Completed
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-950/80 text-rose-300 border border-rose-500/50 rounded-full text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Assessment Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Scanner Ready
          </span>
        );
    }
  };

  return (
    <header className="soc-header-glass sticky top-0 z-30 px-6 py-4">
      {/* Top Banner Notice */}
      <div className="mb-3 bg-amber-950/40 border border-amber-500/40 text-amber-200 px-3.5 py-1.5 rounded-md text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold text-amber-300">AUTHORIZATION & SAFETY NOTICE:</strong> Authorized defensive security analysis only. Problem 11 is a fictional defensive training scenario.
          </span>
        </div>
        {(isDemo || isLevel2) && (
          <span className="bg-amber-900/90 text-amber-200 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-400/50 tracking-wider">
            SYNTHETIC DEMO SCENARIO
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shadow-lg ${
              isLevel2
                ? 'bg-gradient-to-br from-amber-600 to-rose-700 shadow-amber-500/20'
                : 'bg-gradient-to-br from-cyan-600 to-blue-700 shadow-cyan-500/20'
            }`}>
              {isLevel2 ? (
                <ShieldAlert className="w-6 h-6 text-white" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {isLevel2 ? (
                  <>
                    Cybersecurity Attack Analysis Center
                    <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full font-mono font-bold">
                      LEVEL 2
                    </span>
                  </>
                ) : (
                  <>
                    Network Security Exposure Center
                    <span className="text-xs bg-slate-800 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-mono">
                      LEVEL 1
                    </span>
                  </>
                )}
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                {isLevel2
                  ? "Level 2 — Problem 11: The Fake Invoice at the Regional Credit Union"
                  : "Level 1 — Network Exposure Assessment & Attack Surface Management"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {getStatusBadge()}
          {!isLevel2 && scanTimestamp && (
            <div className="text-right hidden sm:block font-mono text-xs text-slate-400">
              <div>Scan Time</div>
              <div className="text-slate-200 font-medium">{new Date(scanTimestamp).toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

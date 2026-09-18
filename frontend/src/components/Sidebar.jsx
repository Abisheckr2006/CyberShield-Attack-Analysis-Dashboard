import React from 'react';
import {
  LayoutDashboard,
  Network,
  ListOrdered,
  ShieldAlert,
  MapPin,
  History,
  FileText,
  Settings,
  Shield,
  Activity
} from 'lucide-react';

const LEVEL1_ITEMS = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'exposure', label: 'Network Exposure', icon: Network },
  { id: 'ports', label: 'Open Ports', icon: ListOrdered },
  { id: 'findings', label: 'Security Findings', icon: ShieldAlert },
  { id: 'network-map', label: 'Network Topology Map', icon: MapPin },
  { id: 'history', label: 'Scan History', icon: History },
  { id: 'reports', label: 'Level 1 Reports', icon: FileText },
];

const LEVEL2_ITEMS = [
  {
    id: 'level2',
    label: 'Level 2: Attack Analysis',
    subtitle: 'How The Attack Happened',
    icon: ShieldAlert,
    isLevel2: true,
    badge: 'PROBLEM 11'
  },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand / Logo Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-sm text-slate-100 tracking-wide">SOC DEFENDER</div>
          <div className="text-[10px] text-cyan-400 font-mono">NET & ATTACK SUITE v2.0</div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* LEVEL 1 SECTION */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Level 1 — Network Security
          </div>
          <div className="space-y-1">
            {LEVEL1_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* LEVEL 2 SECTION */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="px-3 pb-2 text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Level 2 — Cybersecurity</span>
            <span className="bg-amber-950 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded text-[9px]">NEW</span>
          </div>
          <div className="space-y-1">
            {LEVEL2_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-amber-950/90 text-amber-300 border border-amber-500/60 shadow-md shadow-amber-950 ring-1 ring-amber-500/30'
                      : 'text-slate-300 bg-slate-800/40 hover:text-amber-200 hover:bg-slate-800/90 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-amber-400/80'}`} />
                    <div>
                      <div className="leading-tight font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SYSTEM SETTINGS SECTION */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeView === 'settings'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Diagnostics</span>
          </button>
        </div>
      </nav>

      {/* Scope Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-300 mb-1">Active Modules</div>
        <div className="text-cyan-400 font-mono text-[10px]">Level 1 — Network Exposure</div>
        <div className="text-amber-400 font-mono text-[10px] font-bold">Level 2 — Attack Analysis</div>
        <p className="mt-1.5 text-[10px] text-slate-400 leading-normal">
          Defensive analysis based on Problem 11: Fake Invoice scenario.
        </p>
      </div>
    </aside>
  );
}

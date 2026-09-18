import React from 'react';
import { Target, Globe, Server, CheckCircle2, Clock, Zap, Network } from 'lucide-react';

export default function TargetInfoCard({ scanData }) {
  if (!scanData) return null;

  const target = scanData.target || {};
  const status = scanData.status || 'Ready';
  const startedAt = scanData.started_at ? new Date(scanData.started_at).toLocaleString() : 'N/A';
  const responseTime = scanData.response_time_ms ? `${scanData.response_time_ms} ms` : 'N/A';

  return (
    <div className="soc-card p-5 mb-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <Target className="w-5 h-5 text-cyan-400" />
        <h3 className="font-bold text-sm text-slate-100 tracking-wide uppercase">Target Assessment Profile</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Target Input */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" /> Target Query
          </div>
          <div className="text-xs font-mono font-bold text-slate-200 truncate">
            {target.raw_input || 'N/A'}
          </div>
        </div>

        {/* IP Address */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-400" /> IP Address
          </div>
          <div className="text-xs font-mono font-bold text-cyan-400">
            {target.ip || 'N/A'}
          </div>
        </div>

        {/* Hostname / Domain */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" /> Hostname / Domain
          </div>
          <div className="text-xs font-mono font-semibold text-slate-300 truncate">
            {target.hostname || target.domain || 'Unresolved'}
          </div>
        </div>

        {/* Status */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Host Status
          </div>
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> UP
          </div>
        </div>

        {/* Scan Timestamp */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Scan Time
          </div>
          <div className="text-xs font-mono font-medium text-slate-300">
            {startedAt}
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Latency / Response
          </div>
          <div className="text-xs font-mono font-semibold text-amber-300">
            {responseTime}
          </div>
        </div>

        {/* Network Segment */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 col-span-2">
          <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-purple-400" /> Network / Segment Context
          </div>
          <div className="text-xs font-mono font-semibold text-purple-300">
            {scanData.is_demo ? 'Authorized Cybersecurity Lab Subnet (192.168.1.0/24)' : 'Authorized Assessment Network'}
          </div>
        </div>
      </div>
    </div>
  );
}

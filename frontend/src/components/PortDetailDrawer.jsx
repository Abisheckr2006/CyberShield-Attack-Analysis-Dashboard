import React from 'react';
import { X, ShieldAlert, AlertTriangle, ShieldCheck, AlertCircle, Lightbulb, FileText, CheckCircle } from 'lucide-react';

export default function PortDetailDrawer({ port, onClose }) {
  if (!port) return null;

  const getRiskBadge = (level) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return <span className="badge-critical">CRITICAL RISK</span>;
      case 'HIGH':
        return <span className="badge-high">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="badge-medium">MEDIUM RISK</span>;
      case 'LOW':
        return <span className="badge-low">LOW RISK</span>;
      default:
        return <span className="badge-info">INFO</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-cyan-950 border border-cyan-500/50 rounded-lg text-cyan-300 font-mono font-bold text-lg">
              Port {port.port_number} / {port.protocol}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">{port.service_name}</h3>
              <p className="text-xs text-slate-400 font-mono">State: <span className="text-emerald-400 font-semibold">{port.state}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Risk & Exposure Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-medium mb-1">Risk Assessment</div>
              <div>{getRiskBadge(port.risk_level)}</div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-medium mb-1">Exposure Category</div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                {port.exposure_category} Subnet
              </div>
            </div>
          </div>

          {/* Service & Version */}
          <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" /> Detected Version String
            </div>
            <div className="text-xs font-mono text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800 break-all">
              {port.detected_version || 'No detailed version header captured'}
            </div>
          </div>

          {/* Why It Matters */}
          <div className="bg-slate-950/80 p-4 rounded-lg border border-amber-900/40">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1.5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Why It Matters
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {port.why_it_matters || 'Administrative and active application services exposed on network interfaces expand the target surface for unauthorized access.'}
            </p>
          </div>

          {/* Security Weakness */}
          <div className="bg-slate-950/80 p-4 rounded-lg border border-rose-900/40">
            <div className="text-xs font-bold text-rose-300 uppercase tracking-wide mb-1.5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" /> Security Weakness Context
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {port.weakness || 'Service reachability beyond required network boundaries increases authentication testing opportunities.'}
            </p>
          </div>

          {/* Recommended Mitigation */}
          <div className="bg-slate-950/80 p-4 rounded-lg border border-emerald-900/40">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wide mb-1.5 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" /> Recommended Mitigation
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {port.recommendation || 'Restrict network access via host/network firewall rules and enforce strong multi-factor authentication.'}
            </p>
          </div>

          {/* Safety Notice */}
          <div className="bg-slate-900 p-3 rounded-lg text-[11px] text-slate-400 border border-slate-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Non-destructive exposure assessment notice: No exploitation or intrusive attacks were executed.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

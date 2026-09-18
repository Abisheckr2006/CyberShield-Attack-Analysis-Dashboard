import React from 'react';
import { Clock, ShieldAlert, FileText, AlertTriangle, Eye, CheckCircle2, X } from 'lucide-react';

export default function TimelineEventAnalysisModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="soc-card bg-slate-900 border-amber-500/50 max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-500/40">
              TIME: {event.time}
            </span>
            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded">
              STAGE: {event.stage}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1 rounded hover:bg-slate-800 text-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl font-bold text-white">{event.event}</h3>
          <div className="text-xs text-amber-400 font-mono mt-0.5">{event.stage_title}</div>
        </div>

        {/* Analysis Fields Grid */}
        <div className="space-y-4 text-xs font-sans">
          {/* WHAT HAPPENED */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
              WHAT HAPPENED
            </div>
            <p className="text-slate-200 leading-relaxed font-sans">
              {event.what_happened}
            </p>
          </div>

          {/* EVIDENCE (Clearly Labeled DEMO DATA) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-cyan-400 uppercase font-mono tracking-wider">
                EVIDENCE
              </div>
              <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded text-[10px] font-mono font-bold">
                SYNTHETIC / DEMO DATA
              </span>
            </div>
            <p className="text-slate-300 font-mono text-xs">
              {event.evidence}
            </p>

            {/* Evidence details */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-800 text-slate-400">
              <div>Evidence Type: <strong className="text-slate-200">{event.evidence_type || 'Synthetic Scenario Event'}</strong></div>
              <div>Source: <strong className="text-slate-200">{event.source || 'Endpoint Telemetry'}</strong></div>
              <div>Timestamp: <strong className="text-slate-200">{event.time}</strong></div>
              <div>Confidence: <strong className="text-emerald-400">Scenario-defined</strong></div>
            </div>
          </div>

          {/* MITRE TECHNIQUE */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-amber-400 uppercase font-mono tracking-wider">
              MITRE TECHNIQUE
            </div>
            <div className="text-sm font-bold font-mono text-amber-300">
              {event.technique}
            </div>
          </div>

          {/* SECURITY ANALYSIS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-purple-400 uppercase font-mono tracking-wider">
              SECURITY ANALYSIS
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              {event.security_analysis}
            </p>
          </div>

          {/* DEFENSIVE OBSERVATION */}
          <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/40 space-y-1">
            <div className="text-[11px] font-bold text-amber-300 uppercase font-mono tracking-wider">
              DEFENSIVE OBSERVATION
            </div>
            <p className="text-amber-100 leading-relaxed font-sans font-medium">
              {event.defensive_observation}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Analysis Panel
          </button>
        </div>
      </div>
    </div>
  );
}

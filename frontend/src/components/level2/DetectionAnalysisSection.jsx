import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, FileSearch, Link } from 'lucide-react';

export default function DetectionAnalysisSection({ detectionData }) {
  const data = detectionData || {
    title: '🚨 ANOMALOUS EVENT DETECTED',
    time: '13:15',
    event: 'Anomalous login / transfer / configuration / endpoint event',
    status: 'DETECTED',
    evidence: 'Synthetic scenario event',
    why_suspicious: 'Multi-vector correlation flagged off-hours authentication and file share activity following suspicious endpoint process execution.',
    related_events: [
      { time: '08:24', stage: 'Initial Access', description: 'Weaponized Invoice Opened' },
      { time: '09:05', stage: 'Account Discovery', description: 'Identity Enumeration' },
      { time: '10:40', stage: 'Collection / Limited Movement', description: 'Financial Share Staging' }
    ],
    recommended_investigation: [
      'Review authentication logs',
      'Review endpoint telemetry',
      'Review relevant network telemetry',
      'Review proxy/DNS/application logs',
      'Determine whether the events are related'
    ]
  };

  return (
    <div className="soc-card p-6 space-y-6 bg-slate-900/90 border-rose-500/40">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
          <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">
            DETECTION ANALYSIS
          </h3>
        </div>
        <span className="px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-500/50 rounded font-mono font-bold text-xs">
          PRIMARY SOC TRIGGER (13:15)
        </span>
      </div>

      {/* Main Alert Card */}
      <div className="bg-slate-950 p-6 rounded-xl border border-rose-500/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-mono font-bold text-rose-400">
              TIME: {data.time}
            </div>
            <h4 className="text-lg font-bold text-white mt-0.5">{data.title}</h4>
            <p className="text-xs text-slate-300 mt-1">{data.event}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-950 text-rose-300 border border-rose-500/50 rounded-full font-mono text-xs font-bold">
              STATUS: {data.status}
            </span>
          </div>
        </div>

        {/* Evidence Notice */}
        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">EVIDENCE:</span>
          <span className="text-cyan-300 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            {data.evidence} (DEMO DATA)
          </span>
        </div>

        {/* Key Analysis Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Related Events Chain */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center gap-1.5">
              <Link className="w-4 h-4 text-amber-400" /> Which Previous Events Are Related?
            </div>
            <div className="space-y-1.5 font-mono text-xs pt-1">
              {data.related_events?.map((rel, idx) => (
                <div key={idx} className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-amber-400 font-bold">{rel.time}</span>
                  <span className="text-slate-300">{rel.stage}</span>
                  <span className="text-slate-400 text-[11px] font-sans truncate">{rel.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Investigation Checklist */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 font-mono uppercase flex items-center gap-1.5">
              <FileSearch className="w-4 h-4 text-emerald-400" /> Recommended Defensive Investigation
            </div>
            <ul className="space-y-1.5 font-sans text-xs text-slate-200 pt-1">
              {data.recommended_investigation?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

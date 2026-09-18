import React from 'react';
import { Eye, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function EvidencePanel({ timeline = [] }) {
  const evidenceList = timeline.length > 0 ? timeline : [
    { time: '08:10', event: 'External Service Mapping', source: 'Network Telemetry', evidence: 'Synthetic scenario event.', evidence_type: 'Synthetic Scenario Event' },
    { time: '08:24', event: 'Weaponized Invoice Opened', source: 'Email / Endpoint Telemetry', evidence: 'Synthetic scenario event.', evidence_type: 'Synthetic Scenario Event' },
    { time: '09:05', event: 'Account Discovery', source: 'Identity Telemetry', evidence: 'Synthetic scenario event.', evidence_type: 'Synthetic Scenario Event' },
    { time: '10:40', event: 'Collection / Limited Movement', source: 'Network / Endpoint Telemetry', evidence: 'Synthetic scenario event.', evidence_type: 'Synthetic Scenario Event' },
    { time: '13:15', event: 'Anomalous Event Detected', source: 'Authentication / Endpoint Telemetry', evidence: 'Synthetic scenario event.', evidence_type: 'Synthetic Scenario Event' },
    { time: '15:00', event: 'Access Revoked / Containment', source: 'Identity / Endpoint Telemetry', evidence: 'Synthetic scenario event.', evidence_type: 'Synthetic Scenario Event' }
  ];

  return (
    <div className="soc-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            EVIDENCE PANEL
          </h3>
        </div>
        <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded text-xs font-mono font-bold">
          SYNTHETIC / DEMO DATA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidenceList.map((item) => (
          <div key={item.time} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 font-mono">TIMESTAMP: {item.time}</span>
              <span className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800 font-mono font-bold">
                SYNTHETIC DATA
              </span>
            </div>

            <div className="text-xs font-bold text-slate-100">{item.event}</div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800">
              <div><strong className="text-slate-400">Evidence Type:</strong> {item.evidence_type || 'Synthetic Scenario Event'}</div>
              <div><strong className="text-slate-400">Source:</strong> {item.source || 'Endpoint Telemetry'}</div>
              <div><strong className="text-slate-400">Confidence:</strong> <span className="text-emerald-400 font-bold">Scenario-defined</span></div>
              <div><strong className="text-slate-400">Scenario Tag:</strong> Problem 11</div>
            </div>

            <p className="text-xs text-slate-400 font-sans italic">
              Description: {item.evidence || 'Not provided in scenario'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

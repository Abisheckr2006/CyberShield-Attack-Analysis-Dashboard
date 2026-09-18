import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function DefensiveInsightsSection() {
  const insights = [
    { time: '08:10', stage: 'Reconnaissance', insight: 'Maintain accurate inventory of externally visible services.' },
    { time: '08:24', stage: 'Initial Access', insight: 'Monitor suspicious document activity using appropriate email and endpoint security controls.' },
    { time: '09:05', stage: 'Discovery', insight: 'Monitor unusual account and identity activity.' },
    { time: '10:40', stage: 'Collection', insight: 'Inspect unusual outbound volume and destinations.' },
    { time: '13:15', stage: 'Detection', insight: 'Investigate anomalous authentication, transfer, configuration, or endpoint events.' },
    { time: '15:00', stage: 'Containment', insight: 'Revoke access, contain affected systems, preserve evidence, and begin recovery/review.' }
  ];

  return (
    <div className="soc-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            DEFENSIVE INSIGHTS
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Analyst Guidance per Stage</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((item) => (
          <div key={item.time} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-amber-400">{item.time}</span>
              <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                {item.stage}
              </span>
            </div>
            <div className="flex items-start gap-2 pt-1 text-xs text-slate-200 font-sans leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item.insight}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

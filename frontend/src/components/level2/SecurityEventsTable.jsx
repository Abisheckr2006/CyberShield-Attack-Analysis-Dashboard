import React from 'react';
import { Terminal, ShieldAlert } from 'lucide-react';

export default function SecurityEventsTable({ events = [] }) {
  const rows = events.length > 0 ? events : [
    { time: '08:10', event: 'External service mapping', source: 'Network telemetry', stage: 'Reconnaissance', technique: 'N/A', severity: 'Medium', status: 'Observed' },
    { time: '08:24', event: 'Weaponized invoice opened', source: 'Email / Endpoint', stage: 'Initial Access', technique: 'T1566.001', severity: 'High', status: 'Simulated' },
    { time: '09:05', event: 'Account discovery', source: 'Identity telemetry', stage: 'Discovery', technique: 'T1087', severity: 'High', status: 'Simulated' },
    { time: '10:40', event: 'Collection / limited movement', source: 'Network / Endpoint', stage: 'Collection', technique: 'T1041', severity: 'High', status: 'Simulated' },
    { time: '13:15', event: 'Anomalous event', source: 'Authentication / Endpoint', stage: 'Detection', technique: 'N/A', severity: 'High', status: 'Detected' },
    { time: '15:00', event: 'Access revoked', source: 'Identity / Endpoint', stage: 'Containment', technique: 'N/A', severity: 'High', status: 'Contained' }
  ];

  return (
    <div className="soc-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            SECURITY EVENTS
          </h3>
        </div>
        <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded text-xs font-mono font-bold">
          DEMO / SYNTHETIC DATA
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-[11px] font-mono font-bold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <th className="p-3">TIME</th>
              <th className="p-3">EVENT</th>
              <th className="p-3">SOURCE</th>
              <th className="p-3">ATTACK STAGE</th>
              <th className="p-3">TECHNIQUE</th>
              <th className="p-3">SEVERITY</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">DATA TAG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs font-mono">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3 text-amber-400 font-bold">{row.time}</td>
                <td className="p-3 text-slate-100 font-sans font-semibold">{row.event}</td>
                <td className="p-3 text-slate-300">{row.source}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded text-[10px]">
                    {row.stage}
                  </span>
                </td>
                <td className="p-3">
                  {row.technique !== 'N/A' ? (
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-900 rounded text-[10px]">
                      {row.technique}
                    </span>
                  ) : (
                    <span className="text-slate-500">N/A</span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    row.severity === 'High' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  }`}>
                    {row.severity}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    row.status === 'Detected' ? 'bg-rose-950 text-rose-300 border border-rose-500/50' :
                    row.status === 'Contained' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="p-3 text-[10px] text-cyan-400 font-bold">
                  DEMO DATA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Network, ArrowRight, ShieldAlert, Link } from 'lucide-react';

export default function ScenarioEventCorrelation({ timeline = [] }) {
  const chainEvents = [
    { time: '08:24', stage: 'Initial Access', event: 'Weaponized Invoice Opened', id: 'evt-2', related: ['evt-3', 'evt-4', 'evt-5'] },
    { time: '09:05', stage: 'Account Discovery', event: 'Identity Enumeration', id: 'evt-3', related: ['evt-2', 'evt-4', 'evt-5'] },
    { time: '10:40', stage: 'Collection / Limited Movement', event: 'Financial Share Staging', id: 'evt-4', related: ['evt-2', 'evt-3', 'evt-5'] },
    { time: '13:15', stage: 'Anomalous Event', event: 'SIEM Correlation Alert', id: 'evt-5', related: ['evt-2', 'evt-3', 'evt-4', 'evt-6'] },
    { time: '15:00', stage: 'Containment', event: 'Access Revoked', id: 'evt-6', related: ['evt-5'] }
  ];

  const [activeChainId, setActiveChainId] = useState('evt-5');

  const activeEvent = chainEvents.find((e) => e.id === activeChainId) || chainEvents[3];

  return (
    <div className="soc-card p-6 space-y-6 bg-slate-900/90">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Scenario Event Correlation
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Click any event to highlight related chain nodes</span>
      </div>

      {/* Horizontal Visual Chain */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 overflow-x-auto p-2">
        {chainEvents.map((item, idx) => {
          const isSelected = activeChainId === item.id;
          const isRelated = activeEvent.related.includes(item.id);

          return (
            <React.Fragment key={item.id}>
              <button
                onClick={() => setActiveChainId(item.id)}
                className={`p-4 rounded-xl border text-left transition-all shrink-0 cursor-pointer min-w-44 ${
                  isSelected
                    ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-lg shadow-amber-950 ring-2 ring-amber-500/50 scale-105'
                    : isRelated
                    ? 'bg-slate-900 border-cyan-500/80 text-cyan-200 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold mb-1">
                  <span className="text-amber-400">{item.time}</span>
                  {isSelected && <span className="text-[9px] bg-amber-950 px-1.5 py-0.5 rounded text-amber-300 border border-amber-500/40">SELECTED</span>}
                  {!isSelected && isRelated && <span className="text-[9px] bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/40">RELATED</span>}
                </div>
                <div className="text-xs font-bold text-slate-100 truncate">{item.stage}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.event}</div>
              </button>

              {idx < chainEvents.length - 1 && (
                <ArrowRight className="w-5 h-5 text-slate-600 shrink-0 hidden lg:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Correlation Insight Box */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
        <div className="text-cyan-400 font-bold uppercase flex items-center gap-1.5">
          <Link className="w-4 h-4 text-cyan-400" /> Correlated Events for {activeEvent.time} ({activeEvent.stage})
        </div>
        <p className="text-slate-300 font-sans leading-relaxed">
          Selecting event <strong className="text-amber-400">{activeEvent.time} — {activeEvent.event}</strong> highlights its preceding attack vectors and subsequent containment steps across the Problem 11 correlation path.
        </p>
      </div>
    </div>
  );
}

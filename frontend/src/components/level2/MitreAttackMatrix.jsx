import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, Terminal, CheckCircle2, ChevronRight, Code } from 'lucide-react';

export default function MitreAttackMatrix({ mitreData = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTactic, setSelectedTactic] = useState('ALL');
  const [activeTechnique, setActiveTechnique] = useState(null);

  const tactics = ['ALL', 'Reconnaissance', 'Initial Access', 'Execution', 'Discovery', 'Collection', 'Lateral Movement', 'Defense Evasion'];

  const filteredData = mitreData.filter((item) => {
    const tacticText = (item.tactic || '').toLowerCase();
    const matchesTactic = selectedTactic === 'ALL' || tacticText === selectedTactic.toLowerCase();
    const searchLower = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (item.technique_name || '').toLowerCase().includes(searchLower) ||
      (item.technique_id || '').toLowerCase().includes(searchLower) ||
      tacticText.includes(searchLower);
    return matchesTactic && matchesSearch;
  });

  const getSeverityBadge = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL': return 'bg-purple-950 text-purple-300 border-purple-500/50';
      case 'HIGH': return 'bg-rose-950 text-rose-300 border-rose-500/50';
      case 'MEDIUM': return 'bg-amber-950 text-amber-300 border-amber-500/50';
      default: return 'bg-sky-950 text-sky-300 border-sky-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="soc-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                MITRE ATT&CK® Framework Mapping Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Defensive mapping of techniques leveraged during the Problem 11 Credit Union attack scenario.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search technique ID or name..."
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 w-56"
              />
            </div>
          </div>
        </div>

        {/* Tactic Pill Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Tactic Filter:
          </span>
          {tactics.map((tactic) => (
            <button
              key={tactic}
              onClick={() => setSelectedTactic(tactic)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedTactic === tactic
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/60 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tactic}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of MITRE ATT&CK Technique Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <div
            key={item.technique_id}
            onClick={() => setActiveTechnique(item)}
            className="soc-card p-4 space-y-3 cursor-pointer hover:border-amber-500/60 transition-all hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-slate-950 text-amber-400 border border-amber-500/40 rounded text-xs font-mono font-bold">
                {item.technique_id}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${getSeverityBadge(item.severity)}`}>
                {item.severity}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                {item.tactic}
              </div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                {item.technique_name}
              </h4>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800 font-mono">
              <span>Attack Stage: <strong className="text-amber-400">{item.stage}</strong></span>
              <span className="flex items-center gap-1 text-cyan-400 font-sans group-hover:underline">
                Rules & Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal / Panel for Active Technique */}
      {activeTechnique && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="soc-card bg-slate-900 border-amber-500/50 max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-500/50 rounded font-mono font-bold text-xs">
                  {activeTechnique.technique_id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeTechnique.tactic}
                </span>
              </div>
              <button
                onClick={() => setActiveTechnique(null)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded hover:bg-slate-800 text-sm"
              >
                ✕ CLOSE
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{activeTechnique.technique_name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Utilized during Problem 11 attack timeline stage <strong className="text-amber-400 font-mono">{activeTechnique.stage}</strong>.
              </p>
            </div>

            {/* SIEM / Detection Query */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase font-mono">
                <Code className="w-4 h-4" /> Detection / SIEM Correlation Rule
              </div>
              <div className="font-mono text-xs text-cyan-200 bg-slate-900 p-3 rounded border border-cyan-950 leading-relaxed overflow-x-auto">
                {activeTechnique.siem_rule}
              </div>
            </div>

            {/* Recommended Countermeasure */}
            <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/40 space-y-2">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Recommended Defensive Mitigation
              </div>
              <p className="text-xs text-amber-100 leading-relaxed">
                {activeTechnique.countermeasure}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTechnique(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Return to Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

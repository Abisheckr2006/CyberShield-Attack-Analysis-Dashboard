import React from 'react';
import { ShieldAlert, RefreshCw, Search, RotateCcw, Eye, Shield } from 'lucide-react';

export default function Level2HeaderBanner({
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  stageFilter,
  setStageFilter,
  techniqueFilter,
  setTechniqueFilter,
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter,
  timeFilter,
  setTimeFilter,
  onResetFilters,
  onLoadScenario
}) {
  return (
    <div className="space-y-4">
      {/* Top Banner Header */}
      <div className="soc-card p-6 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-amber-500/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-950 text-amber-300 border border-amber-500/50 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> LEVEL 2 — ATTACK ANALYSIS
              </span>
              <span className="bg-rose-950 text-rose-300 border border-rose-500/50 px-2.5 py-0.5 rounded text-xs font-mono font-bold">
                FICTIONAL TRAINING SCENARIO
              </span>
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded text-xs font-mono font-bold">
                DEMO DATA
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Level 2 — Attack Analysis
            </h2>
            <div className="text-sm font-semibold text-amber-300 font-mono">
              "How the Attack Happened?"
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Scenario: <strong className="text-white">Problem 11 — The Fake Invoice at the Regional Credit Union</strong>
            </div>

            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed pt-1">
              Defensive security analysis dashboard designed to analyze the progression of Problem 11.
              All security events, logs, and telemetry are synthetic training data.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 justify-center">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-center">
              <button
                onClick={() => setViewMode('ATTACK')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'ATTACK'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/60 shadow-md shadow-amber-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> ATTACK VIEW
              </button>
              <button
                onClick={() => setViewMode('DEFENDER')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'DEFENDER'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> DEFENDER VIEW
              </button>
            </div>

            {/* Load Scenario Button */}
            <button
              onClick={onLoadScenario}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-amber-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              LOAD PROBLEM 11 SCENARIO
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="soc-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search event, stage, technique..."
              className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 w-full"
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono w-full md:w-auto justify-end">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Stage: All</option>
            <option value="Reconnaissance">Reconnaissance</option>
            <option value="Initial Access">Initial Access</option>
            <option value="Discovery">Discovery</option>
            <option value="Collection">Collection</option>
            <option value="Detection">Detection</option>
            <option value="Containment">Containment</option>
          </select>

          <select
            value={techniqueFilter}
            onChange={(e) => setTechniqueFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Technique: All</option>
            <option value="T1566.001">T1566.001</option>
            <option value="T1087">T1087</option>
            <option value="T1041">T1041</option>
            <option value="T1071.001">T1071.001</option>
            <option value="N/A">N/A</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Severity: All</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Status: All</option>
            <option value="Observed">Observed</option>
            <option value="Simulated">Simulated</option>
            <option value="Detected">Detected</option>
            <option value="Contained">Contained</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Time: All</option>
            <option value="08:10">08:10</option>
            <option value="08:24">08:24</option>
            <option value="09:05">09:05</option>
            <option value="10:40">10:40</option>
            <option value="13:15">13:15</option>
            <option value="15:00">15:00</option>
          </select>

          <button
            onClick={onResetFilters}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" /> RESET FILTERS
          </button>
        </div>
      </div>
    </div>
  );
}

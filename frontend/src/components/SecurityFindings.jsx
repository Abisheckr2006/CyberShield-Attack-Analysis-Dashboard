import React, { useState } from 'react';
import { ShieldAlert, AlertCircle, FileText, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import TooltipHelper from './TooltipHelper';

export default function SecurityFindings({ findings = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredFindings = findings.filter((f) => {
    if (severityFilter === 'ALL') return true;
    return f.severity === severityFilter;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSeverityBadge = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return <span className="badge-critical">CRITICAL</span>;
      case 'HIGH':
        return <span className="badge-high">HIGH</span>;
      case 'MEDIUM':
        return <span className="badge-medium">MEDIUM</span>;
      case 'LOW':
        return <span className="badge-low">LOW</span>;
      default:
        return <span className="badge-info">INFO</span>;
    }
  };

  return (
    <div className="soc-card p-5 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide flex items-center">
            Security Findings & Weaknesses
            <TooltipHelper term="finding" />
          </h3>
          <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full font-mono">
            {filteredFindings.length} Items
          </span>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Filter Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md px-2.5 py-1 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">ALL SEVERITIES</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      {filteredFindings.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No confirmed security weaknesses identified from the available scan evidence.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFindings.map((f) => {
            const isExpanded = expandedId === f.id || expandedId === f.finding_code;
            return (
              <div
                key={f.id || f.finding_code}
                className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden transition-all duration-150"
              >
                {/* Summary Row */}
                <div
                  onClick={() => toggleExpand(f.id || f.finding_code)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-cyan-400">
                      {f.finding_code}
                    </span>
                    {getSeverityBadge(f.severity)}
                    <div>
                      <h4 className="font-bold text-xs text-slate-100">{f.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Affected Service: Port {f.affected_port} ({f.service_name})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono uppercase hidden sm:block">
                      Confidence: {f.confidence || 'HIGH'}
                    </span>
                    <button className="text-slate-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 bg-slate-950 border-t border-slate-800/80 space-y-3 text-xs">
                    {/* Description */}
                    <div>
                      <span className="font-semibold text-slate-300 block mb-1">Description</span>
                      <p className="text-slate-400 leading-relaxed">{f.description}</p>
                    </div>

                    {/* Evidence */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="font-semibold text-cyan-400 block mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Empirical Scan Evidence
                        <TooltipHelper term="evidence" />
                      </span>
                      <p className="font-mono text-slate-300 text-[11px] leading-relaxed">{f.evidence}</p>
                    </div>

                    {/* Impact */}
                    <div>
                      <span className="font-semibold text-amber-400 block mb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Security Exposure & Impact
                      </span>
                      <p className="text-slate-300 leading-relaxed">{f.impact}</p>
                    </div>

                    {/* Recommendation */}
                    <div>
                      <span className="font-semibold text-emerald-400 block mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Mitigation
                      </span>
                      <p className="text-slate-300 leading-relaxed">{f.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

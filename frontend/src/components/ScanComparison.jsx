import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, ShieldAlert, DoorOpen, CheckCircle, AlertTriangle } from 'lucide-react';
import { compareScans } from '../services/api';

export default function ScanComparison({ prevScanId, currScanId, onClose }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadComparison() {
      try {
        setLoading(true);
        const data = await compareScans(prevScanId, currScanId);
        setComparison(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to compare scans.');
      } finally {
        setLoading(false);
      }
    }
    if (prevScanId && currScanId) {
      loadComparison();
    }
  }, [prevScanId, currScanId]);

  if (loading) {
    return (
      <div className="soc-card p-6 mb-6 text-center text-xs text-cyan-400 font-mono">
        Comparing historical scan metrics...
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="soc-card p-6 mb-6 text-center text-xs text-rose-400 font-mono">
        {error || 'Unable to compare selected scans.'}
      </div>
    );
  }

  return (
    <div className="soc-card p-5 mb-6 border-cyan-500/40">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide">
            Scan Comparison Delta Analysis
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 rounded border border-slate-700"
        >
          Close Comparison
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
        {/* Newly Opened Ports */}
        <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <DoorOpen className="w-4 h-4 text-rose-400" /> Newly Opened Ports
          </div>
          <div className="text-lg font-mono font-bold text-rose-400">
            {comparison.newly_opened_ports.length > 0 ? comparison.newly_opened_ports.join(', ') : 'None'}
          </div>
        </div>

        {/* Closed Ports */}
        <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Closed Ports
          </div>
          <div className="text-lg font-mono font-bold text-emerald-400">
            {comparison.closed_ports.length > 0 ? comparison.closed_ports.join(', ') : 'None'}
          </div>
        </div>

        {/* High Risk Delta */}
        <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> High Risk Delta
          </div>
          <div className="text-lg font-mono font-bold text-amber-300">
            {comparison.changed_risk_summary.delta > 0 ? `+${comparison.changed_risk_summary.delta}` : comparison.changed_risk_summary.delta}
          </div>
        </div>

        {/* Changed Services */}
        <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-cyan-400" /> Service Changes
          </div>
          <div className="text-lg font-mono font-bold text-cyan-400">
            {comparison.changed_services.length}
          </div>
        </div>
      </div>

      {/* Details Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* New Findings */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <h4 className="font-bold text-rose-400 mb-2 font-sans">New Findings Detected</h4>
          {comparison.new_findings.length === 0 ? (
            <p className="text-slate-500 font-sans text-xs">No new findings created.</p>
          ) : (
            <ul className="space-y-1 text-slate-300">
              {comparison.new_findings.map((f, i) => (
                <li key={i}>• [{f.code}] {f.title}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Resolved Findings */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <h4 className="font-bold text-emerald-400 mb-2 font-sans">Resolved Findings</h4>
          {comparison.resolved_findings.length === 0 ? (
            <p className="text-slate-500 font-sans text-xs">No findings resolved.</p>
          ) : (
            <ul className="space-y-1 text-slate-300">
              {comparison.resolved_findings.map((f, i) => (
                <li key={i}>• [{f.code}] {f.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

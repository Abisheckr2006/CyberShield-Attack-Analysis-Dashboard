import React, { useState } from 'react';
import { History, ArrowRightLeft, ExternalLink, Calendar } from 'lucide-react';
import ScanComparison from './ScanComparison';

export default function ScanHistory({ scans = [], onLoadScan }) {
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const handleCheckboxChange = (scanId) => {
    if (selectedForCompare.includes(scanId)) {
      setSelectedForCompare(selectedForCompare.filter((id) => id !== scanId));
    } else {
      if (selectedForCompare.length < 2) {
        setSelectedForCompare([...selectedForCompare, scanId]);
      } else {
        setSelectedForCompare([selectedForCompare[1], scanId]);
      }
    }
  };

  return (
    <div className="soc-card p-5 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide">
            Historical Assessment Logs & Continuous Monitoring
          </h3>
          <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full font-mono">
            {scans.length} Scans
          </span>
        </div>

        {/* Compare Trigger */}
        <button
          onClick={() => setShowCompareModal(true)}
          disabled={selectedForCompare.length !== 2}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 disabled:opacity-40 text-cyan-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Compare Selected ({selectedForCompare.length}/2)</span>
        </button>
      </div>

      {/* Comparison Drawer/Panel if Active */}
      {showCompareModal && selectedForCompare.length === 2 && (
        <ScanComparison
          prevScanId={selectedForCompare[0]}
          currScanId={selectedForCompare[1]}
          onClose={() => setShowCompareModal(false)}
        />
      )}

      {/* History Table */}
      {scans.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No historical scan records saved in local SQLite repository.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px] tracking-wider bg-slate-900/50">
                <th className="py-3 px-3 text-center">Compare</th>
                <th className="py-3 px-3">Date / Timestamp</th>
                <th className="py-3 px-3">Target Query</th>
                <th className="py-3 px-3">IP Address</th>
                <th className="py-3 px-3">Open Ports</th>
                <th className="py-3 px-3">High Risk</th>
                <th className="py-3 px-3">Medium Risk</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {scans.map((s) => {
                const openCount = s.ports ? s.ports.filter(p => p.state === 'OPEN').length : 0;
                const highCount = s.ports ? s.ports.filter(p => p.risk_level === 'HIGH').length : 0;
                const medCount = s.ports ? s.ports.filter(p => p.risk_level === 'MEDIUM').length : 0;
                const isSelected = selectedForCompare.includes(s.id);

                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(s.id)}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(s.started_at).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-100 font-bold">{s.target?.raw_input || 'N/A'}</td>
                    <td className="py-3 px-3 text-cyan-400">{s.target?.ip || 'N/A'}</td>
                    <td className="py-3 px-3 text-slate-200 font-bold">{openCount}</td>
                    <td className="py-3 px-3">
                      <span className={highCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                        {highCount}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={medCount > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                        {medCount}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-400 font-semibold">{s.status}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onLoadScan(s)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

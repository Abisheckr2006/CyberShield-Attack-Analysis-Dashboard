import React, { useState } from 'react';
import { ListOrdered, ChevronRight, Filter } from 'lucide-react';
import PortDetailDrawer from './PortDetailDrawer';
import TooltipHelper from './TooltipHelper';

export default function OpenPortsTable({ ports = [] }) {
  const [selectedPort, setSelectedPort] = useState(null);
  const [filterRisk, setFilterRisk] = useState('ALL');

  const filteredPorts = ports.filter((p) => {
    if (filterRisk === 'ALL') return true;
    return p.risk_level === filterRisk;
  });

  const getRiskBadge = (level) => {
    switch (level?.toUpperCase()) {
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
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide flex items-center">
            Open Ports & Services Inventory
            <TooltipHelper term="port" />
          </h3>
          <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full font-mono">
            {filteredPorts.length} Entries
          </span>
        </div>

        {/* Risk Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Filter Risk:</span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md px-2.5 py-1 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">ALL RISKS</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredPorts.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No open ports found matching current scan parameters or filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px] tracking-wider bg-slate-900/50">
                <th className="py-3 px-3">Port</th>
                <th className="py-3 px-3">Protocol</th>
                <th className="py-3 px-3">State</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Risk</th>
                <th className="py-3 px-3">Exposure</th>
                <th className="py-3 px-3">Finding Summary</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredPorts.map((p) => (
                <tr
                  key={p.id || p.port_number}
                  onClick={() => setSelectedPort(p)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-bold text-cyan-400">
                    {p.port_number}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{p.protocol}</td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-400 font-semibold">{p.state}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-100">{p.service_name}</td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs truncate" title={p.detected_version}>
                    {p.detected_version || 'Detected Version'}
                  </td>
                  <td className="py-3 px-3">{getRiskBadge(p.risk_level)}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                      {p.exposure_category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans max-w-sm truncate" title={p.finding_summary}>
                    {p.finding_summary || 'Service active on target'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="text-slate-500 group-hover:text-cyan-400 p-1">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Drawer */}
      <PortDetailDrawer
        port={selectedPort}
        onClose={() => setSelectedPort(null)}
      />
    </div>
  );
}

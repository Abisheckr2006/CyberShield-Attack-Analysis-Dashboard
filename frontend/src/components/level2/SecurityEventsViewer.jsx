import React, { useState } from 'react';
import {
  Terminal,
  Search,
  Filter,
  ShieldAlert,
  Server,
  ChevronDown,
  ChevronRight,
  Network,
  Lock,
  AlertTriangle,
  Mail,
  FileCode
} from 'lucide-react';

export default function SecurityEventsViewer({ eventLogs = [], selectedStageFilter = 'ALL', onClearStageFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('ALL');
  const [expandedLogId, setExpandedLogId] = useState(null);

  const logTypes = ['ALL', 'FIREWALL', 'MAIL_GATEWAY', 'ENDPOINT', 'ACTIVE_DIRECTORY', 'FILE_SHARE', 'SIEM_ALERT', 'CONTAINMENT'];

  const filteredLogs = eventLogs.filter((log) => {
    const matchesStage = selectedStageFilter === 'ALL' || log.stage === selectedStageFilter;
    const matchesType = logTypeFilter === 'ALL' || log.log_type === logTypeFilter;
    const searchLower = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (log.message || '').toLowerCase().includes(searchLower) ||
      (log.host || '').toLowerCase().includes(searchLower) ||
      (log.ip_src || '').toLowerCase().includes(searchLower) ||
      (log.event_code || '').toLowerCase().includes(searchLower);
    return matchesStage && matchesType && matchesSearch;
  });

  const getSeverityBadge = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL': return 'bg-purple-950 text-purple-300 border-purple-500/50';
      case 'HIGH': return 'bg-rose-950 text-rose-300 border-rose-500/50';
      case 'MEDIUM': return 'bg-amber-950 text-amber-300 border-amber-500/50';
      default: return 'bg-sky-950 text-sky-300 border-sky-500/50';
    }
  };

  const getLogTypeIcon = (type) => {
    switch (type) {
      case 'FIREWALL': return Network;
      case 'MAIL_GATEWAY': return Mail;
      case 'ENDPOINT': return Terminal;
      case 'ACTIVE_DIRECTORY': return Server;
      case 'FILE_SHARE': return FileCode;
      case 'SIEM_ALERT': return ShieldAlert;
      case 'CONTAINMENT': return Lock;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Attack Pathway Topology Diagram */}
      <div className="soc-card p-6 space-y-4 bg-slate-900/90 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Problem 11 Security Event Propagation & Network Topology Flow
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">Target Domain: finance.example.org</span>
        </div>

        {/* Pathway Topology Nodes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-center">
            <div className="text-[10px] text-rose-400 font-mono font-bold">1. ATTACKER IP</div>
            <div className="text-xs font-bold text-slate-100 font-mono">198.51.100.42</div>
            <div className="text-[10px] text-slate-400">External C2 Host</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-center">
            <div className="text-[10px] text-amber-400 font-mono font-bold">2. MAIL GATEWAY</div>
            <div className="text-xs font-bold text-slate-100 font-mono">mail.example.org</div>
            <div className="text-[10px] text-slate-400">Spearphishing Delivery</div>
          </div>

          <div className="p-3 bg-slate-950 border border-amber-500/50 rounded-xl space-y-1 text-center bg-amber-950/20">
            <div className="text-[10px] text-amber-400 font-mono font-bold">3. AP WORKSTATION</div>
            <div className="text-xs font-bold text-slate-100 font-mono">AP-FIN-04</div>
            <div className="text-[10px] text-slate-400">Macro Payload Run</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-center">
            <div className="text-[10px] text-purple-400 font-mono font-bold">4. DOMAIN CTRLR</div>
            <div className="text-xs font-bold text-slate-100 font-mono">DC-01 (192.168.10.2)</div>
            <div className="text-[10px] text-slate-400">LDAP Discovery</div>
          </div>

          <div className="p-3 bg-slate-950 border border-rose-500/40 rounded-xl space-y-1 text-center">
            <div className="text-[10px] text-rose-400 font-mono font-bold">5. PAYMENT SERVER</div>
            <div className="text-xs font-bold text-slate-100 font-mono">FIN-DATA-01</div>
            <div className="text-[10px] text-slate-400">SMB Share Access</div>
          </div>

          <div className="p-3 bg-slate-950 border border-emerald-500/50 rounded-xl space-y-1 text-center bg-emerald-950/20">
            <div className="text-[10px] text-emerald-400 font-mono font-bold">6. SOC SIEM</div>
            <div className="text-xs font-bold text-slate-100 font-mono">Splunk SIEM</div>
            <div className="text-[10px] text-slate-400">Alert #ALT-8841 Trigger</div>
          </div>
        </div>
      </div>

      {/* Log Controls Card */}
      <div className="soc-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                Security Event Logs & Telemetry Viewer
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Synthetic audit event logs collected from firewalls, mail gateways, endpoints, AD, and SIEM.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedStageFilter !== 'ALL' && (
              <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-500/50 rounded-lg text-xs font-mono flex items-center gap-2">
                Stage Filter: {selectedStageFilter}
                <button onClick={onClearStageFilter} className="hover:text-white font-bold cursor-pointer">✕</button>
              </span>
            )}

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search log messages, IP, host..."
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 w-60"
              />
            </div>
          </div>
        </div>

        {/* Log Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Component Filter:
          </span>
          {logTypes.map((type) => (
            <button
              key={type}
              onClick={() => setLogTypeFilter(type)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                logTypeFilter === type
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/60 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Synthetic Log Events Table */}
      <div className="soc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-[11px] font-mono font-bold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                <th className="p-3 w-8"></th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Log Type</th>
                <th className="p-3">Host / Source</th>
                <th className="p-3">Event Code</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Message Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                    No security log entries found matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  const TypeIcon = getLogTypeIcon(log.log_type);

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-slate-900/90 border-l-2 border-l-amber-500' : ''
                        }`}
                      >
                        <td className="p-3 text-slate-500">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-amber-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                          )}
                        </td>
                        <td className="p-3 text-slate-300 font-semibold">{log.timestamp}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-slate-900 text-amber-400 border border-amber-900/60 rounded text-[10px]">
                            {log.stage}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <TypeIcon className="w-3.5 h-3.5 text-cyan-400" />
                            {log.log_type}
                          </span>
                        </td>
                        <td className="p-3 text-cyan-300 font-bold">{log.host}</td>
                        <td className="p-3 text-slate-300">{log.event_code}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(log.severity)}`}>
                            {log.severity}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 font-sans truncate max-w-xs">{log.message}</td>
                      </tr>

                      {/* Expanded Raw Telemetry Details */}
                      {isExpanded && (
                        <tr className="bg-slate-950/90">
                          <td colSpan={8} className="p-4 border-t border-b border-amber-500/20">
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <span className="text-xs font-bold text-amber-400 uppercase font-mono">
                                  RAW SECURITY TELEMETRY — {log.id}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">Source: {log.source}</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div>
                                  <div className="text-[11px] text-slate-400 uppercase font-bold">Source IP</div>
                                  <div className="text-cyan-400 font-bold mt-0.5">{log.ip_src}</div>
                                </div>
                                <div>
                                  <div className="text-[11px] text-slate-400 uppercase font-bold">Destination IP / Target</div>
                                  <div className="text-rose-400 font-bold mt-0.5">{log.ip_dst}</div>
                                </div>
                                <div>
                                  <div className="text-[11px] text-slate-400 uppercase font-bold">Detection System</div>
                                  <div className="text-slate-200 mt-0.5">{log.source}</div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="text-[11px] text-slate-400 uppercase font-bold">Full Log Message</div>
                                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed">
                                  {log.message}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

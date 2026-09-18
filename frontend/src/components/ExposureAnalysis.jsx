import React from 'react';
import { Network, Globe, Lock, Server, HelpCircle, ShieldAlert } from 'lucide-react';
import TooltipHelper from './TooltipHelper';

export default function ExposureAnalysis({ ports = [] }) {
  // Group ports into exposure categories
  const categories = {
    Public: ports.filter((p) => p.exposure_category === 'Public'),
    Management: ports.filter((p) => p.exposure_category === 'Management'),
    Internal: ports.filter((p) => p.exposure_category === 'Internal'),
    Unknown: ports.filter(
      (p) => !['Public', 'Management', 'Internal'].includes(p.exposure_category)
    )
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Public':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'Management':
        return <Lock className="w-4 h-4 text-rose-400" />;
      case 'Internal':
        return <Server className="w-4 h-4 text-purple-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'Public':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';
      case 'Management':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
      case 'Internal':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="soc-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide flex items-center">
            Network Exposure Analysis
            <TooltipHelper term="exposure" />
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Exposure Boundary Classification
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {['Public', 'Management', 'Internal'].map((catKey) => {
          const catPorts = categories[catKey];
          return (
            <div
              key={catKey}
              className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase text-slate-200">
                    {getCategoryIcon(catKey)}
                    <span>{catKey} Exposure Zone</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getCategoryBadgeClass(catKey)}`}>
                    {catPorts.length} {catPorts.length === 1 ? 'Service' : 'Services'}
                  </span>
                </div>

                {/* Ports List in Category */}
                {catPorts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No services detected in {catKey.toLowerCase()} zone.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {catPorts.map((p) => (
                      <div
                        key={p.id || p.port_number}
                        className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-cyan-400">
                            {p.service_name} : {p.port_number}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono uppercase">{p.protocol}</span>
                        </div>

                        {/* 3 Reachability Questions */}
                        <div className="space-y-1.5 text-[11px] pt-1">
                          <div className="text-slate-300">
                            <strong className="text-cyan-400">Why reachable?</strong>{' '}
                            <span>{p.finding_summary || 'Service port accepted TCP connection.'}</span>
                          </div>
                          <div className="text-slate-300">
                            <strong className="text-purple-400">Who should reach it?</strong>{' '}
                            <span>{p.why_it_matters || 'Authorized personnel/clients.'}</span>
                          </div>
                          <div className="text-slate-300">
                            <strong className="text-emerald-400">Recommended Boundary:</strong>{' '}
                            <span>{p.recommendation || 'Enforce network firewall rules.'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                Boundary Policy: {catKey === 'Management' ? 'Restrict to Admin Subnet' : catKey === 'Internal' ? 'Restrict to Private VLAN' : 'Public App Gateway'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

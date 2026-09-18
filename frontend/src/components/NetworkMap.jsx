import React from 'react';
import { MapPin, Shield, Globe, Lock, Server, ArrowDown } from 'lucide-react';
import TooltipHelper from './TooltipHelper';

export default function NetworkMap({ ports = [] }) {
  const publicPorts = ports.filter((p) => p.exposure_category === 'Public');
  const mgmtPorts = ports.filter((p) => p.exposure_category === 'Management');
  const internalPorts = ports.filter((p) => p.exposure_category === 'Internal');

  return (
    <div className="soc-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide flex items-center">
            Conceptual Visual Network Exposure Map
            <TooltipHelper text="Conceptual visualization of service reachability across network boundaries." />
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Logical Exposure Diagram
        </span>
      </div>

      {/* Network Map Diagram Container */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs flex flex-col items-center">
        {/* Internet Node */}
        <div className="flex flex-col items-center">
          <div className="px-5 py-2 bg-cyan-950 border border-cyan-500/60 rounded-lg text-cyan-300 font-bold flex items-center gap-2 shadow-lg shadow-cyan-950">
            <Globe className="w-4 h-4 text-cyan-400" /> INTERNET / EXTERNAL PROBES
          </div>
          <ArrowDown className="w-5 h-5 text-slate-500 my-2 animate-bounce" />
        </div>

        {/* Firewall Boundary Node */}
        <div className="flex flex-col items-center w-full max-w-lg">
          <div className="w-full px-6 py-2.5 bg-amber-950/80 border border-amber-500/60 rounded-xl text-amber-200 font-bold text-center flex items-center justify-center gap-2 shadow-md">
            <Shield className="w-4 h-4 text-amber-400" /> AUTHORIZED FIREWALL & ROUTER BOUNDARY
          </div>
          
          {/* Split Paths */}
          <div className="grid grid-cols-2 gap-8 w-full mt-4 relative">
            {/* Public Zone */}
            <div className="flex flex-col items-center bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-cyan-400 font-bold mb-2 uppercase text-[11px] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Public Zone
              </div>
              <div className="w-full space-y-2">
                {publicPorts.length === 0 ? (
                  <div className="text-[10px] text-slate-500 text-center py-2">No public ports</div>
                ) : (
                  publicPorts.map((p) => (
                    <div key={p.id || p.port_number} className="bg-slate-950 p-2 rounded border border-cyan-800 text-center text-xs">
                      <div className="text-slate-100 font-bold">{p.service_name}</div>
                      <div className="text-cyan-400 text-[11px] font-mono">Port :{p.port_number} ({p.protocol})</div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 text-[10px] text-slate-500 text-center">Web & Application Layer</div>
            </div>

            {/* Management Zone */}
            <div className="flex flex-col items-center bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-rose-400 font-bold mb-2 uppercase text-[11px] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Management Zone
              </div>
              <div className="w-full space-y-2">
                {mgmtPorts.length === 0 ? (
                  <div className="text-[10px] text-slate-500 text-center py-2">No mgmt ports</div>
                ) : (
                  mgmtPorts.map((p) => (
                    <div key={p.id || p.port_number} className="bg-slate-950 p-2 rounded border border-rose-800/80 text-center text-xs">
                      <div className="text-slate-100 font-bold">{p.service_name}</div>
                      <div className="text-rose-400 text-[11px] font-mono">Port :{p.port_number} ({p.protocol})</div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 text-[10px] text-slate-500 text-center font-bold text-rose-300">Requires Admin VPN</div>
            </div>
          </div>
        </div>

        {/* Internal Zone Node */}
        <div className="mt-8 flex flex-col items-center w-full max-w-sm">
          <div className="w-full bg-slate-900/90 p-4 rounded-xl border border-purple-800/60 text-center">
            <div className="text-purple-400 font-bold mb-2 uppercase text-[11px] flex items-center justify-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Internal Private Network Zone
            </div>
            <div className="space-y-2">
              {internalPorts.length === 0 ? (
                <div className="text-[10px] text-slate-500 py-1">No internal services detected</div>
              ) : (
                internalPorts.map((p) => (
                  <div key={p.id || p.port_number} className="bg-slate-950 p-2 rounded border border-purple-800 text-center text-xs">
                    <div className="text-slate-100 font-bold">{p.service_name}</div>
                    <div className="text-purple-300 text-[11px] font-mono">Port :{p.port_number} ({p.protocol})</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-[10px] text-slate-500 text-center max-w-md">
          * Note: Conceptual visual exposure mapping derived from observed service ports and assigned risk categories.
        </div>
      </div>
    </div>
  );
}

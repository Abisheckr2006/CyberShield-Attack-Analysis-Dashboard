import React from 'react';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function MitreAttackAnalysisTable({ mitreMatrix = [] }) {
  const techniques = mitreMatrix.length > 0 ? mitreMatrix : [
    {
      technique_id: 'T1566.001',
      technique_name: 'Spearphishing Attachment',
      stage: 'Initial Access',
      scenario_mapping: 'Weaponized invoice',
      defensive_observation: 'Monitor suspicious attachments and endpoint activity'
    },
    {
      technique_id: 'T1087',
      technique_name: 'Account Discovery',
      stage: 'Discovery',
      scenario_mapping: 'Available identities/roles discovered',
      defensive_observation: 'Monitor unusual identity activity'
    },
    {
      technique_id: 'T1041',
      technique_name: 'Exfiltration Over C2 Channel',
      stage: 'Collection / Transfer',
      scenario_mapping: 'Controlled transfer attempt',
      defensive_observation: 'Monitor unusual outbound volume and destinations'
    },
    {
      technique_id: 'T1071.001',
      technique_name: 'Web Protocols',
      stage: 'Communication Layer',
      scenario_mapping: 'Web traffic used as communication layer',
      defensive_observation: 'Monitor proxy, DNS and endpoint telemetry'
    }
  ];

  return (
    <div className="soc-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            MITRE ATT&CK ANALYSIS
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Exact 4 Scenario Techniques</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-[11px] font-mono font-bold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <th className="p-3">TECHNIQUE</th>
              <th className="p-3">NAME</th>
              <th className="p-3">STAGE</th>
              <th className="p-3">SCENARIO MAPPING</th>
              <th className="p-3">DEFENSIVE OBSERVATION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs font-mono">
            {techniques.map((item) => (
              <tr key={item.technique_id} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3">
                  <span className="px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-500/50 rounded font-bold">
                    {item.technique_id}
                  </span>
                </td>
                <td className="p-3 text-slate-100 font-bold font-sans">{item.technique_name}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-700 rounded text-[10px]">
                    {item.stage}
                  </span>
                </td>
                <td className="p-3 text-amber-300 font-sans">{item.scenario_mapping}</td>
                <td className="p-3 text-slate-300 font-sans">{item.defensive_observation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

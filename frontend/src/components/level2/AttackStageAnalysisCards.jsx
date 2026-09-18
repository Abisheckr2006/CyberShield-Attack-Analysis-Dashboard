import React from 'react';
import { Layers, ShieldAlert, Eye } from 'lucide-react';

export default function AttackStageAnalysisCards({ timeline = [] }) {
  const cards = [
    {
      num: '01',
      time: '08:10',
      title: 'EXTERNAL SERVICE MAPPING',
      description: 'The attacker identifies finance.example.org and maps the organization\'s externally visible services.',
      technique: 'N/A',
      status: 'Observed',
      observation: 'Maintain accurate inventory of externally visible services.'
    },
    {
      num: '02',
      time: '08:24',
      title: 'INITIAL ACCESS',
      description: 'An accounts-payable employee opens a weaponized invoice document, representing the initial access or access path.',
      technique: 'T1566.001',
      status: 'Simulated',
      observation: 'Monitor suspicious document activity using appropriate email and endpoint security controls.'
    },
    {
      num: '03',
      time: '09:05',
      title: 'ACCOUNT DISCOVERY',
      description: 'The attacker validates access, discovers member accounts and payment operations, and avoids controls that would immediately trigger an alert.',
      technique: 'T1087',
      status: 'Simulated',
      observation: 'Monitor unusual account and identity activity.'
    },
    {
      num: '04',
      time: '10:40',
      title: 'COLLECTION / LIMITED MOVEMENT',
      description: 'The attacker attempts collection and limited movement toward systems supporting member accounts and payment operations.',
      technique: 'T1041',
      status: 'Simulated',
      observation: 'Inspect unusual outbound volume and destinations.'
    },
    {
      num: '05',
      time: '13:15',
      title: 'DETECTION',
      description: 'A defender notices an anomalous login, transfer, configuration change, or endpoint event and begins triage.',
      technique: 'T1071.001',
      status: 'Detected',
      observation: 'Investigate anomalous authentication, transfer, configuration, or endpoint events.'
    },
    {
      num: '06',
      time: '15:00',
      title: 'CONTAINMENT',
      description: 'Access is revoked, affected credentials or hosts are contained, and evidence is preserved for recovery and review.',
      technique: 'N/A',
      status: 'Contained',
      observation: 'Revoke access, contain affected systems, preserve evidence, and begin recovery/review.'
    }
  ];

  return (
    <div className="soc-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            ATTACK STAGE ANALYSIS
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Six Core Stage Breakdown</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.num} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between font-mono">
              <span className="text-2xl font-black text-slate-700">{card.num}</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-900">
                TIME: {card.time}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-100">{card.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{card.description}</p>

            <div className="pt-2 border-t border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Related Technique:</span>
                <span className="text-amber-300 font-bold">{card.technique}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Status:</span>
                <span className="text-cyan-300 font-bold">{card.status}</span>
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300 font-sans leading-snug">
              <strong className="text-amber-400 font-mono">Defensive Obs:</strong> {card.observation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

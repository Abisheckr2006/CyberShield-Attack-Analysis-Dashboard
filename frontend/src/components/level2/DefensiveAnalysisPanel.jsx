import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Lock, FileText, Download, ShieldCheck, Server } from 'lucide-react';

export default function DefensiveAnalysisPanel({ recommendations = [] }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadBrief = () => {
    const briefText = `
============================================================
DEFENSIVE SECURITY BRIEF & INCIDENT ANALYSIS
PROBLEM 11: THE FAKE INVOICE AT THE REGIONAL CREDIT UNION
============================================================

TARGET ORGANIZATION: Regional Credit Union (finance.example.org)
INCIDENT SEVERITY:   HIGH / CRITICAL DEFENSIVE SCENARIO
INCIDENT STATUS:     CONTAINED & ANALYZED

ATTACK TIMELINE SUMMARY:
- 08:10 | Reconnaissance: Attacker mapped public HTTPS and DNS MX records for finance.example.org.
- 08:24 | Initial Access: Spearphishing email delivered weaponized macro document Invoice_Oct2026.docm to Accounts Payable.
- 09:05 | Account Discovery: Evasive LDAP query enumerated payment service accounts (svc_ach_transfer).
- 10:40 | Collection/Movement: SMB connection staged ACH batch exports from \\FIN-DATA-01\\MemberOperations.
- 13:15 | Anomalous Event Detected: SIEM Rule #ALT-8841 triggered off-hours share access alert.
- 15:00 | Containment: Domain accounts revoked, host AP-FIN-04 network-isolated via 802.1X NAC.

KEY DEFENSIVE MITIGATIONS:
1. Block Office VBA Macros via Active Directory Group Policy (GPO).
2. Deploy Attack Surface Reduction (ASR) rule blocking Office child process creation.
3. Micro-segment financial storage servers (FIN-DATA-01) away from general AP workstations.
4. Enforce mandatory Multi-Factor Authentication (MFA) and time-bound access on sensitive SMB shares.

Report Generated: ${new Date().toISOString()}
============================================================
`;
    const element = document.createElement("a");
    const file = new Blob([briefText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Problem11_Defensive_Analysis_Brief.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div className="soc-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                Problem 11 Defensive Assessment & Root Cause Analysis
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Defensive evaluation of security control effectiveness, incident containment, and hardening recommendations.
            </p>
          </div>

          <button
            onClick={handleDownloadBrief}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-amber-950 flex items-center gap-2 transition-all cursor-pointer self-start"
          >
            <Download className="w-4 h-4" />
            {downloadSuccess ? 'DEFENSIVE BRIEF DOWNLOADED!' : 'EXPORT DEFENSIVE BRIEF'}
          </button>
        </div>

        {/* 3 Column Root Cause Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-rose-400 uppercase font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Primary Initial Vector
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Human vector via spearphishing attachment (<strong className="text-white">Invoice_Oct2026.docm</strong>). Reliance on user execution allowed VBA macro code execution.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase font-mono flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" /> Evasion Strategy
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Low-velocity LDAP enumeration commands spaced apart by several minutes evaded basic volumetric SIEM alert thresholds.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Detection Trigger
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Multi-source correlation rule (<strong className="text-white">SIEM #ALT-8841</strong>) combining parent-child shell spawn telemetry with off-hours SMB share access.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Security Controls Grid */}
      <div className="soc-card p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Hardening Action Items & Security Controls
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                  {rec.category}
                </span>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                  rec.priority === 'CRITICAL' ? 'bg-purple-950 text-purple-300 border border-purple-500/50' : 'bg-rose-950 text-rose-300 border border-rose-500/50'
                }`}>
                  PRIORITY: {rec.priority}
                </span>
              </div>
              <h5 className="font-bold text-sm text-slate-100">{rec.title}</h5>
              <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

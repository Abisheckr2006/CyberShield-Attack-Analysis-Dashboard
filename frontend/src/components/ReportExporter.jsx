import React from 'react';
import { Download, FileCode, FileSpreadsheet, FileText, X, ShieldCheck } from 'lucide-react';
import { getReportDownloadUrl } from '../services/api';

export default function ReportExporter({ scanId, onClose }) {
  if (!scanId) return null;

  const handleDownload = (format) => {
    const url = getReportDownloadUrl(scanId, format);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide">
              Export Security Assessment Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Select export format to generate a formal defensive network exposure assessment report for Scan ID <span className="font-mono text-cyan-400">#{scanId}</span>.
        </p>

        <div className="space-y-3">
          {/* PDF */}
          <button
            onClick={() => handleDownload('pdf')}
            className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-950 text-rose-400 rounded-lg border border-rose-800">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-slate-100 group-hover:text-cyan-300">PDF Report Document</div>
                <div className="text-[11px] text-slate-400">Formatted executive summary, findings, evidence, and mitigations.</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
          </button>

          {/* CSV */}
          <button
            onClick={() => handleDownload('csv')}
            className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-slate-100 group-hover:text-emerald-300">CSV Data Export</div>
                <div className="text-[11px] text-slate-400">Raw ports inventory and findings data formatted for spreadsheets.</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
          </button>

          {/* JSON */}
          <button
            onClick={() => handleDownload('json')}
            className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-950 text-purple-400 rounded-lg border border-purple-800">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-slate-100 group-hover:text-purple-300">JSON API Payload</div>
                <div className="text-[11px] text-slate-400">Structured JSON representation for integration into SIEM / SOAR.</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
          </button>
        </div>

        <div className="pt-2 text-[10px] text-slate-500 flex items-center gap-1.5 justify-center border-t border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Footer Notice: Authorized defensive assessment only.</span>
        </div>
      </div>
    </div>
  );
}

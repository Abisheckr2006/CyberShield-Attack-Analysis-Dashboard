import React, { useState } from 'react';
import { Play, RotateCcw, Download, Sparkles, Search } from 'lucide-react';

export default function TargetInputBar({
  onStartScan,
  onClear,
  onLoadDemo,
  onExportReport,
  isScanning
}) {
  const [targetInput, setTargetInput] = useState('192.168.1.20');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetInput.strip?.() !== '' && !isScanning) {
      onStartScan(targetInput, false);
    }
  };

  const handleClearClick = () => {
    setTargetInput('');
    onClear();
  };

  return (
    <div className="soc-card p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Input Field */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            placeholder="Enter IP address, Hostname, or Domain/URL (e.g. 192.168.1.20 or scanme.nmap.org)"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-colors"
            disabled={isScanning}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Start Scan */}
          <button
            type="submit"
            disabled={isScanning || !targetInput.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-md shadow-cyan-950 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'SCANNING...' : 'START SCAN'}</span>
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={handleClearClick}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-medium text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>CLEAR</span>
          </button>

          {/* Load Demo Scenario */}
          <button
            type="button"
            onClick={() => {
              setTargetInput('192.168.1.20');
              onLoadDemo('192.168.1.20');
            }}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
            title="Populate dashboard with representative Level 1 scenario (SSH, DNS, HTTPS, RDP)"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>LOAD DEMO SCENARIO</span>
          </button>

          {/* Export Report */}
          <button
            type="button"
            onClick={onExportReport}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>EXPORT REPORT</span>
          </button>
        </div>
      </form>
    </div>
  );
}

import React from 'react';
import TargetInputBar from '../components/TargetInputBar';
import SummaryCards from '../components/SummaryCards';
import TargetInfoCard from '../components/TargetInfoCard';
import OpenPortsTable from '../components/OpenPortsTable';
import ExposureAnalysis from '../components/ExposureAnalysis';
import SecurityFindings from '../components/SecurityFindings';
import VisualCharts from '../components/VisualCharts';
import NetworkMap from '../components/NetworkMap';
import ScanHistory from '../components/ScanHistory';

export default function DashboardPage({
  activeView,
  scanData,
  summary,
  scansList,
  isScanning,
  onStartScan,
  onClear,
  onLoadDemo,
  onExportReport,
  onLoadScanFromHistory
}) {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Target Input Control Bar */}
      <TargetInputBar
        onStartScan={onStartScan}
        onClear={onClear}
        onLoadDemo={onLoadDemo}
        onExportReport={onExportReport}
        isScanning={isScanning}
      />

      {/* View Switching */}
      {activeView === 'dashboard' && (
        <>
          <SummaryCards summary={summary} />
          {scanData && <TargetInfoCard scanData={scanData} />}
          <VisualCharts ports={scanData?.ports || []} findings={scanData?.findings || []} />
          <OpenPortsTable ports={scanData?.ports || []} />
          <ExposureAnalysis ports={scanData?.ports || []} />
          <SecurityFindings findings={scanData?.findings || []} />
          <NetworkMap ports={scanData?.ports || []} />
        </>
      )}

      {activeView === 'exposure' && (
        <>
          <ExposureAnalysis ports={scanData?.ports || []} />
          <NetworkMap ports={scanData?.ports || []} />
        </>
      )}

      {activeView === 'ports' && (
        <OpenPortsTable ports={scanData?.ports || []} />
      )}

      {activeView === 'findings' && (
        <SecurityFindings findings={scanData?.findings || []} />
      )}

      {activeView === 'network-map' && (
        <NetworkMap ports={scanData?.ports || []} />
      )}

      {activeView === 'history' && (
        <ScanHistory scans={scansList} onLoadScan={onLoadScanFromHistory} />
      )}

      {activeView === 'reports' && (
        <div className="soc-card p-6 text-center space-y-4">
          <h3 className="font-bold text-slate-100">Report Export & Compliance Center</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Generate and export complete defensive security assessment reports in PDF, CSV, or JSON format.
          </p>
          <button
            onClick={onExportReport}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-cyan-950 transition-colors cursor-pointer"
          >
            OPEN REPORT EXPORTER MODAL
          </button>
        </div>
      )}

      {activeView === 'settings' && (
        <div className="soc-card p-6 space-y-6">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide">Scanner & Engine Settings</h3>
            <p className="text-xs text-slate-400">System configuration and safety engine diagnostic parameters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-bold font-sans">Network Scan Engine</div>
              <div className="text-slate-300">Mode: Nmap Binary / Python Socket Fallback</div>
              <div className="text-slate-400 text-[11px]">Command Injection Defense: Active (subprocess list execution, shell=False)</div>
              <div className="text-slate-400 text-[11px]">Default Probe Timeout: 45.0s</div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="text-purple-400 font-bold font-sans">Database Repository</div>
              <div className="text-slate-300">Database Engine: SQLite 3</div>
              <div className="text-slate-400 text-[11px]">Path: data/network_security.db</div>
              <div className="text-slate-400 text-[11px]">PostgreSQL Migration Prepared: Yes (SQLAlchemy ORM decoupled)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

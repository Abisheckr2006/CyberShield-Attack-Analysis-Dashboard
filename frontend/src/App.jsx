import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import Level2CybersecurityPage from './pages/Level2CybersecurityPage';
import ReportExporter from './components/ReportExporter';
import { triggerScan, getAllScans, getScanSummary } from './services/api';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [scanData, setScanData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [scansList, setScansList] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load demo scenario on initial mount
  useEffect(() => {
    handleLoadDemo('192.168.1.20');
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const historyData = await getAllScans();
      setScansList(historyData);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleStartScan = async (target, isDemo = false) => {
    setIsScanning(true);
    setErrorMessage(null);
    try {
      const data = await triggerScan(target, isDemo);
      setScanData(data);
      const summaryData = await getScanSummary(data.id);
      setSummary(summaryData);
      await fetchHistory();
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Scan execution failed. Please verify target address.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleLoadDemo = async (target = '192.168.1.20') => {
    await handleStartScan(target, true);
  };

  const handleClear = () => {
    setScanData(null);
    setSummary(null);
    setErrorMessage(null);
  };

  const handleLoadScanFromHistory = (historicalScan) => {
    setScanData(historicalScan);
    getScanSummary(historicalScan.id).then(setSummary).catch(console.error);
    setActiveView('dashboard');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeView={activeView}
          scanStatus={isScanning ? 'Scanning' : (scanData?.status || 'Ready')}
          scanTimestamp={scanData?.started_at}
          isDemo={Boolean(scanData?.is_demo)}
        />

        {/* Error Toast / Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs rounded-lg flex items-center justify-between">
            <span><strong>SCAN ERROR:</strong> {errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-white font-bold ml-4 cursor-pointer">✕</button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {activeView === 'level2' ? (
            <Level2CybersecurityPage />
          ) : (
            <DashboardPage
              activeView={activeView}
              scanData={scanData}
              summary={summary}
              scansList={scansList}
              isScanning={isScanning}
              onStartScan={handleStartScan}
              onClear={handleClear}
              onLoadDemo={handleLoadDemo}
              onExportReport={() => setShowReportModal(true)}
              onLoadScanFromHistory={handleLoadScanFromHistory}
            />
          )}
        </main>
      </div>

      {/* Report Exporter Modal */}
      {showReportModal && (
        <ReportExporter
          scanId={scanData?.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}

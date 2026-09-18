import React, { useState, useEffect } from 'react';
import Level2HeaderBanner from '../components/level2/Level2HeaderBanner';
import SummaryCardsLevel2 from '../components/level2/SummaryCardsLevel2';
import StoryModeWalkthrough from '../components/level2/StoryModeWalkthrough';
import InteractiveTimeline from '../components/level2/InteractiveTimeline';
import TimelineEventAnalysisModal from '../components/level2/TimelineEventAnalysisModal';
import MitreAttackAnalysisTable from '../components/level2/MitreAttackAnalysisTable';
import SecurityEventsTable from '../components/level2/SecurityEventsTable';
import DetectionAnalysisSection from '../components/level2/DetectionAnalysisSection';
import ScenarioEventCorrelation from '../components/level2/ScenarioEventCorrelation';
import DefensiveInsightsSection from '../components/level2/DefensiveInsightsSection';
import AttackStageAnalysisCards from '../components/level2/AttackStageAnalysisCards';
import EvidencePanel from '../components/level2/EvidencePanel';
import AttackAnalysisCharts from '../components/level2/AttackAnalysisCharts';
import DefensiveAnalysisPanel from '../components/level2/DefensiveAnalysisPanel';
import { getLevel2Scenario } from '../services/api';

export default function Level2CybersecurityPage() {
  const [scenarioData, setScenarioData] = useState(null);
  const [viewMode, setViewMode] = useState('ATTACK'); // 'ATTACK' | 'DEFENDER'
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [isPlayingStory, setIsPlayingStory] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [techniqueFilter, setTechniqueFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('ALL');

  useEffect(() => {
    loadScenario();
  }, []);

  const loadScenario = async () => {
    setIsLoading(true);
    try {
      const data = await getLevel2Scenario();
      setScenarioData(data);
    } catch (err) {
      console.error('Failed to load Level 2 scenario:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStageFilter('ALL');
    setTechniqueFilter('ALL');
    setSeverityFilter('ALL');
    setStatusFilter('ALL');
    setTimeFilter('ALL');
  };

  // Filtered Events
  const filteredTimeline = (scenarioData?.timeline || []).filter((item) => {
    const eventText = (item.event || '').toLowerCase();
    const whatText = (item.what_happened || item.short_summary || '').toLowerCase();
    const stageText = (item.stage || item.stage_title || '').toLowerCase();
    const techText = (item.technique || '').toLowerCase();
    const searchLower = (searchTerm || '').toLowerCase();

    const matchesSearch =
      eventText.includes(searchLower) ||
      whatText.includes(searchLower) ||
      stageText.includes(searchLower) ||
      techText.includes(searchLower);

    const matchesStage = stageFilter === 'ALL' || stageText.includes(stageFilter.toLowerCase());
    const matchesTech = techniqueFilter === 'ALL' || techText.includes(techniqueFilter.toLowerCase());
    const matchesSev = severityFilter === 'ALL' || (item.severity || '').toLowerCase() === severityFilter.toLowerCase();
    const matchesStat = statusFilter === 'ALL' || (item.status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchesTime = timeFilter === 'ALL' || item.time === timeFilter;

    return matchesSearch && matchesStage && matchesTech && matchesSev && matchesStat && matchesTime;
  });

  if (isLoading) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="text-xs text-amber-400 font-mono">LOADING LEVEL 2 ATTACK ANALYSIS DATA...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Level 2 Header Banner & View Toggle */}
      <Level2HeaderBanner
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        stageFilter={stageFilter}
        setStageFilter={setStageFilter}
        techniqueFilter={techniqueFilter}
        setTechniqueFilter={setTechniqueFilter}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        onResetFilters={handleResetFilters}
        onLoadScenario={loadScenario}
      />

      {/* Top 4 Summary Cards */}
      <SummaryCardsLevel2 summaryMetrics={scenarioData?.summary_metrics} />

      {/* Story Mode Walkthrough */}
      <StoryModeWalkthrough
        timeline={filteredTimeline}
        activeStep={activeStoryStep}
        setActiveStep={setActiveStoryStep}
        isPlaying={isPlayingStory}
        setIsPlaying={setIsPlayingStory}
      />

      {/* ATTACK VIEW MODE */}
      {viewMode === 'ATTACK' && (
        <div className="space-y-6">
          {/* Main Interactive Timeline */}
          <InteractiveTimeline
            timeline={filteredTimeline}
            selectedEvent={selectedEventModal}
            onSelectEvent={(evt) => setSelectedEventModal(evt)}
            activeStep={activeStoryStep}
          />

          {/* Six Attack Stage Cards */}
          <AttackStageAnalysisCards timeline={filteredTimeline} />

          {/* MITRE ATT&CK Analysis Table */}
          <MitreAttackAnalysisTable mitreMatrix={scenarioData?.mitre_matrix} />

          {/* Security Events Table */}
          <SecurityEventsTable events={filteredTimeline} />

          {/* Scenario Event Correlation View */}
          <ScenarioEventCorrelation timeline={filteredTimeline} />

          {/* Attack Analysis Visual Charts */}
          <AttackAnalysisCharts />
        </div>
      )}

      {/* DEFENDER VIEW MODE */}
      {viewMode === 'DEFENDER' && (
        <div className="space-y-6">
          {/* Main Detection Analysis Section */}
          <DetectionAnalysisSection detectionData={scenarioData?.detection_analysis} />

          {/* Evidence Panel */}
          <EvidencePanel timeline={filteredTimeline} />

          {/* Defensive Insights (Per Stage) */}
          <DefensiveInsightsSection />

          {/* Hardening Action Items & Download Brief */}
          <DefensiveAnalysisPanel recommendations={scenarioData?.defensive_recommendations} />
        </div>
      )}

      {/* Timeline Event Detail Modal */}
      {selectedEventModal && (
        <TimelineEventAnalysisModal
          event={selectedEventModal}
          onClose={() => setSelectedEventModal(null)}
        />
      )}
    </div>
  );
}

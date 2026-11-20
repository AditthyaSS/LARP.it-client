import React, { useState, useEffect, useMemo } from 'react';
import { pc1Service } from './services/pc1Service';
import { NavTab, Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { Toolbar, ViewMode } from './components/Toolbar';
import { PipelineBoard } from './components/PipelineBoard';
import { ListView } from './components/ListView';
import { EventDetailDrawer } from './components/EventDetailDrawer';
import { SourcesView } from './components/SourcesView';
import { CollectorView } from './components/CollectorView';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { OutboundQueueView } from './components/OutboundQueueView';
import { EgressProofView } from './components/EgressProofView';
import { ActivityView } from './components/ActivityView';
import { SettingsView } from './components/SettingsView';
import { PipelineItem } from './types/pc1';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [selectedItem, setSelectedItem] = useState<PipelineItem | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Loading & State
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSendingBatch, setIsSendingBatch] = useState<boolean>(false);
  const [serviceVersion, setServiceVersion] = useState<number>(0);

  // Subscribe to service state changes
  useEffect(() => {
    const unsubscribe = pc1Service.subscribe(() => {
      setServiceVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  const summary = pc1Service.getDashboardSummary();
  const sources = pc1Service.getSources();
  const collectorStats = pc1Service.getCollectorStatus();
  const currentPolicy = pc1Service.getCurrentPolicy();
  const queue = pc1Service.getQueue();
  const proofs = pc1Service.getEgressProofs();
  const activities = pc1Service.getActivity();
  const settings = pc1Service.getSettings();
  const isSenderActive = pc1Service.isSenderActive();
  const allPipelineEvents = pc1Service.getPipelineEvents();

  // Filtered and sorted pipeline events
  const filteredItems = useMemo(() => {
    let result = [...allPipelineEvents];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.eventId.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.service.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.policyRule.toLowerCase().includes(q)
      );
    }

    if (selectedSource !== 'all') {
      result = result.filter((item) => item.source === selectedSource);
    }

    if (selectedSeverity !== 'all') {
      result = result.filter((item) => item.severity === selectedSeverity);
    }

    if (selectedOutcome !== 'all') {
      result = result.filter((item) => item.privacyOutcome === selectedOutcome);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      if (sortBy === 'size') {
        return b.payloadSize - a.payloadSize;
      }
      if (sortBy === 'severity') {
        const order: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
        return (order[b.severity] || 0) - (order[a.severity] || 0);
      }
      return 0;
    });

    return result;
  }, [allPipelineEvents, searchQuery, selectedSource, selectedSeverity, selectedOutcome, sortBy, serviceVersion]);

  // Actions
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setServiceVersion((v) => v + 1);
    }, 500);
  };

  const handleSendBatch = async () => {
    setIsSendingBatch(true);
    try {
      await pc1Service.sendApprovedBatch();
    } finally {
      setIsSendingBatch(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9F8F5] text-[#22201D]">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        sourcesCount={sources.length}
        queueCount={queue.filter((q) => q.queueStatus === 'pending' || q.queueStatus === 'approved').length}
        egressCount={proofs.length}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          isCollectorRunning={collectorStats.status === 'running'}
          pc2EndpointStatus={settings.endpointStatus}
          pc2BaseUrl={settings.pc2ApiBaseUrl}
          gatewayId={settings.gatewayId}
          latestReceiptId={summary.lastAcknowledgement.receiptId}
          lastTransmissionTime={summary.connectionStatus.lastTransmission}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <div key={currentTab} className="animate-tab-enter">
            {/* TAB 1: OVERVIEW */}
            {currentTab === 'overview' && (
              <div className="space-y-6">
                {/* Top KPI Cards (6 pastel cards inspired by Clarity reference) */}
                <KpiCards summary={summary} />

                {/* View Switcher, Search, Filters Toolbar */}
                <Toolbar
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedSource={selectedSource}
                  onSourceChange={setSelectedSource}
                  selectedSeverity={selectedSeverity}
                  onSeverityChange={setSelectedSeverity}
                  selectedOutcome={selectedOutcome}
                  onOutcomeChange={setSelectedOutcome}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  onSendBatch={handleSendBatch}
                  isSendingBatch={isSendingBatch}
                  totalFilteredCount={filteredItems.length}
                />

                {/* Board View or List View */}
                {viewMode === 'board' ? (
                  <PipelineBoard items={filteredItems} onSelectItem={setSelectedItem} />
                ) : (
                  <ListView items={filteredItems} onSelectItem={setSelectedItem} />
                )}
              </div>
            )}

            {/* TAB 2: SOURCES */}
            {currentTab === 'sources' && <SourcesView sources={sources} />}

            {/* TAB 3: COLLECTOR */}
            {currentTab === 'collector' && (
              <CollectorView
                stats={collectorStats}
                onStart={() => pc1Service.startCollector()}
                onStop={() => pc1Service.stopCollector()}
                onRestart={() => pc1Service.restartCollector()}
              />
            )}

            {/* TAB 4: PRIVACY & POLICY */}
            {currentTab === 'privacy' && <PrivacyPolicyView policy={currentPolicy} />}

            {/* TAB 5: OUTBOUND QUEUE */}
            {currentTab === 'queue' && (
              <OutboundQueueView
                queue={queue}
                isSenderPaused={!isSenderActive}
                onPauseResumeSender={() => {
                  if (isSenderActive) pc1Service.pauseSender();
                  else pc1Service.resumeSender();
                }}
                onRetryPayload={(id) => pc1Service.retryPayload(id)}
                onSendBatch={() => pc1Service.sendApprovedBatch()}
                onSendSelected={(ids) => pc1Service.sendSelectedPayloads(ids)}
              />
            )}

            {/* TAB 6: EGRESS PROOF */}
            {currentTab === 'egress' && <EgressProofView proofs={proofs} />}

            {/* TAB 7: ACTIVITY */}
            {currentTab === 'activity' && <ActivityView activities={activities} />}

            {/* TAB 8: SETTINGS */}
            {currentTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={(newSettings) => pc1Service.updateSettings(newSettings)}
                onTestConnection={() => pc1Service.testPC2Connection()}
              />
            )}
          </div>
        </main>
      </div>

      {/* Slide-over Inspection Drawer */}
      <EventDetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

import React, { useState } from 'react';
import { TelemetrySource, SourceStatus } from '../types/pc1';
import { Server, Activity, Cpu, ShieldCheck, Clock, Search, SlidersHorizontal, Info, Play, AlertTriangle } from './Icons';

interface SourcesViewProps {
  sources: TelemetrySource[];
}

export const SourcesView: React.FC<SourcesViewProps> = ({ sources }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<TelemetrySource | null>(null);

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.host.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: SourceStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'degraded':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'offline':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'paused':
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Server size={20} className="text-indigo-600" />
            <span>Monitored Customer Sources (Enterprise Production)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Local applications and server instances producing raw telemetry within the customer network perimeter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-300 font-semibold px-2.5 py-1 rounded-lg">
            Simulated Infrastructure Stream
          </span>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="bg-white rounded-2xl p-3 border border-[#E8E5DF] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search source by name, host, or description..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F9F8F5] border border-[#E8E5DF] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F9F8F5] border border-[#E8E5DF] text-stone-700 text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (5)</option>
            <option value="degraded">Degraded (1)</option>
            <option value="offline">Offline (0)</option>
            <option value="paused">Paused (0)</option>
          </select>
        </div>
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            onClick={() => setSelectedSource(source)}
            className="card-interactive group bg-white rounded-2xl p-4 border border-[#E8E5DF] shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              {/* Top row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
                    <Server size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 tracking-tight">{source.name}</h3>
                    <span className="text-[10px] text-stone-400 font-mono block">{source.host}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase ${getStatusBadge(source.status)}`}>
                  {source.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 line-clamp-2 my-2">
                {source.description}
              </p>

              {/* Adapter & Category */}
              <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-2">
                <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-medium capitalize">
                  {source.category}
                </span>
                <span className="font-mono text-[10px] text-stone-400">
                  {source.version}
                </span>
              </div>

              {/* Recent Events Snippet */}
              {source.recentEvents && source.recentEvents.length > 0 && (
                <div className="p-2 bg-[#FBF9F5] rounded-xl border border-stone-200/70 text-[11px] space-y-1 mb-2">
                  <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider block">Recent Telemetry Event</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-stone-800">{source.recentEvents[0].eventId}</span>
                    <span className="text-[10px] font-bold text-emerald-700">{source.recentEvents[0].privacyDecision}</span>
                  </div>
                  <p className="text-stone-500 text-[10px] truncate">{source.recentEvents[0].message}</p>
                </div>
              )}
            </div>

            {/* Metrics Footer */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                <div className="bg-[#F9F8F5] p-1.5 rounded-lg border border-stone-200/50">
                  <span className="text-[9px] text-stone-400 block uppercase">CPU</span>
                  <span className={`font-bold ${source.metrics.cpuPercent > 80 ? 'text-rose-600' : 'text-stone-800'}`}>
                    {source.metrics.cpuPercent}%
                  </span>
                </div>

                <div className="bg-[#F9F8F5] p-1.5 rounded-lg border border-stone-200/50">
                  <span className="text-[9px] text-stone-400 block uppercase">MEM</span>
                  <span className={`font-bold ${source.metrics.memoryPercent > 80 ? 'text-amber-600' : 'text-stone-800'}`}>
                    {source.metrics.memoryPercent}%
                  </span>
                </div>

                <div className="bg-[#F9F8F5] p-1.5 rounded-lg border border-stone-200/50">
                  <span className="text-[9px] text-stone-400 block uppercase">LAT</span>
                  <span className="font-bold text-stone-800">{source.metrics.latencyMs}ms</span>
                </div>

                <div className="bg-[#F9F8F5] p-1.5 rounded-lg border border-stone-200/50">
                  <span className="text-[9px] text-stone-400 block uppercase">ERR</span>
                  <span className="font-bold text-stone-800">{source.metrics.errorRate}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>Rate: <strong className="text-stone-700">{source.collectionRatePerSec} eps</strong></span>
                <span>Collected: <strong className="text-stone-700">{source.eventsCollected.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Source Detail Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E8E5DF] shadow-modal overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-[#E8E5DF] bg-[#F9F8F5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Server size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">{selectedSource.name}</h3>
                  <span className="text-xs text-stone-500 font-mono">{selectedSource.host} ({selectedSource.ip})</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSource(null)}
                className="w-8 h-8 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
                  Adapter Specification
                </span>
                <p className="text-stone-700">
                  {selectedSource.description}
                </p>
                <div className="text-[11px] text-stone-500 pt-1">
                  Adapter: <strong className="text-stone-800">{selectedSource.adapterType}</strong> | Version: <strong className="text-stone-800">{selectedSource.version}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                  Real-Time Resource Metrics (psutil simulated)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">CPU UTILIZATION</span>
                    <span className="text-lg font-bold text-stone-900">{selectedSource.metrics.cpuPercent}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">MEMORY UTILIZATION</span>
                    <span className="text-lg font-bold text-stone-900">{selectedSource.metrics.memoryPercent}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">ERROR RATE</span>
                    <span className="text-lg font-bold text-stone-900">{selectedSource.metrics.errorRate}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">AVERAGE LATENCY</span>
                    <span className="text-lg font-bold text-stone-900">{selectedSource.metrics.latencyMs} ms</span>
                  </div>
                </div>
              </div>

              {/* Recent Events List */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                  Recent Collected Events
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedSource.recentEvents.map((evt, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#FBF9F5] border border-stone-200 flex justify-between items-center text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-stone-800">{evt.eventId}</span>
                          <span className="text-[10px] uppercase font-semibold text-stone-500">[{evt.eventType}]</span>
                        </div>
                        <p className="text-stone-600 text-[11px] mt-0.5">{evt.message}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {evt.privacyDecision}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-[#E8E5DF] flex justify-end">
              <button
                onClick={() => setSelectedSource(null)}
                className="px-4 py-1.5 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-900"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

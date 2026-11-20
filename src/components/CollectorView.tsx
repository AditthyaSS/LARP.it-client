import React, { useState } from 'react';
import { CollectorStats } from '../types/pc1';
import { Cpu, Play, Square, RotateCcw, Shield, ShieldCheck, Server, AlertTriangle, ArrowRight, Activity, Zap } from './Icons';

interface CollectorViewProps {
  stats: CollectorStats;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
}

export const CollectorView: React.FC<CollectorViewProps> = ({ stats, onStart, onStop, onRestart }) => {
  const [confirmAction, setConfirmAction] = useState<'stop' | 'restart' | null>(null);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleConfirm = () => {
    if (confirmAction === 'stop') onStop();
    if (confirmAction === 'restart') onRestart();
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Operational Controls */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                stats.status === 'running'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {stats.status.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-stone-400">Version: {stats.version}</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              SIMULATED COLLECTOR
            </span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Local Telemetry Collection Engine
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Collects raw metrics and syslog frames from local host sources into an isolated disk volume.
          </p>
        </div>

        {/* Operational Controls */}
        <div className="flex items-center gap-2">
          {stats.status === 'stopped' ? (
            <button
              onClick={onStart}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Play size={14} />
              <span>Start Collector</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setConfirmAction('stop')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 rounded-xl text-xs font-bold transition-colors border border-stone-200"
              >
                <Square size={13} />
                <span>Stop Collector</span>
              </button>

              <button
                onClick={() => setConfirmAction('restart')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-indigo-50 hover:text-indigo-700 text-stone-700 rounded-xl text-xs font-bold transition-colors border border-stone-200"
              >
                <RotateCcw size={13} />
                <span>Restart</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Visual Pipeline Flow Diagram */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E5DF] shadow-xs">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
          Data Pipeline Architecture: Source → Collection → Normalization → Privacy Processing
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Step 1: Sources */}
          <div className="card-interactive flex-1 w-full bg-[#FBF9F5] p-3.5 rounded-xl border border-stone-200 hover:border-indigo-200 text-center transition-all duration-200">
            <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-110">
              <Server size={16} />
            </div>
            <span className="font-bold text-xs text-stone-800 block">1. Customer Sources</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">6 Services Monitored</span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold block mt-1">549.6 eps</span>
          </div>

          <ArrowRight size={18} className={`hidden md:block flex-shrink-0 transition-colors duration-300 ${stats.status === 'running' ? 'text-indigo-500 animate-pulse' : 'text-stone-300'}`} />

          {/* Step 2: Collector Engine */}
          <div className={`card-interactive flex-1 w-full bg-[#FBF9F5] p-3.5 rounded-xl border text-center transition-all duration-200 ${stats.status === 'running' ? 'border-indigo-300 bg-indigo-50/30 shadow-xs' : 'border-stone-200'}`}>
            <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-2">
              <Cpu size={16} className={stats.status === 'running' ? 'animate-pulse' : ''} />
            </div>
            <span className="font-bold text-xs text-stone-800 block">2. Local Collection</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Isolated Disk Volume</span>
            <span className="text-[10px] font-mono text-indigo-700 font-semibold block mt-1">0.85ms Latency</span>
          </div>

          <ArrowRight size={18} className={`hidden md:block flex-shrink-0 transition-colors duration-300 ${stats.status === 'running' ? 'text-indigo-500 animate-pulse' : 'text-stone-300'}`} />

          {/* Step 3: Normalizer */}
          <div className="card-interactive flex-1 w-full bg-[#FBF9F5] p-3.5 rounded-xl border border-stone-200 hover:border-purple-200 text-center transition-all duration-200">
            <div className="w-8 h-8 mx-auto rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <Activity size={16} />
            </div>
            <span className="font-bold text-xs text-stone-800 block">3. Normalization</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">OpenTelemetry / ECS</span>
            <span className="text-[10px] font-mono text-purple-700 font-semibold block mt-1">Strict Types</span>
          </div>

          <ArrowRight size={18} className={`hidden md:block flex-shrink-0 transition-colors duration-300 ${stats.status === 'running' ? 'text-indigo-500 animate-pulse' : 'text-stone-300'}`} />

          {/* Step 4: JEV Privacy Engine */}
          <div className="card-interactive flex-1 w-full bg-[#FBF9F5] p-3.5 rounded-xl border border-stone-200 hover:border-emerald-200 text-center transition-all duration-200">
            <div className={`w-8 h-8 mx-auto rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 ${stats.status === 'running' ? 'shield-pulse-active' : ''}`}>
              <Shield size={16} />
            </div>
            <span className="font-bold text-xs text-stone-800 block">4. JEV Privacy Guard</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Local Sanitization</span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold block mt-1">Allow-list Only</span>
          </div>
        </div>
      </div>

      {/* Collector Telemetry KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-[#E8E5DF] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Throughput Rate
          </span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {stats.throughputEventsPerSec} <span className="text-xs text-stone-500 font-semibold">eps</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block mt-1">
            +4.2% within baseline
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E5DF] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Processed
          </span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {stats.totalEventsProcessed.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-500 font-medium block mt-1">
            Uptime: {formatUptime(stats.uptimeSeconds)}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E5DF] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Collection Errors
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {stats.collectionErrors}
          </div>
          <span className="text-[10px] text-stone-400 font-medium block mt-1">
            0.0006% error rate
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E5DF] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Processing Latency
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {stats.processingLatencyMs} <span className="text-xs text-stone-500 font-semibold">ms</span>
          </div>
          <span className="text-[10px] text-stone-400 font-medium block mt-1">
            Budget &lt; 10.0ms
          </span>
        </div>
      </div>

      {/* Simulated Collection Pipeline Activity Table */}
      <div className="bg-white rounded-2xl border border-[#E8E5DF] overflow-hidden shadow-xs">
        <div className="p-4 bg-[#FBF9F5] border-b border-[#E8E5DF] flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Simulated Ingestion Pipeline Stream
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            Buffered in container volume
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F2EFE9] text-stone-600 font-bold uppercase text-[10px] tracking-wider border-b border-[#E8E5DF]">
              <tr>
                <th className="py-2.5 px-4">Source</th>
                <th className="py-2.5 px-4">Event ID</th>
                <th className="py-2.5 px-4">Collection Timestamp</th>
                <th className="py-2.5 px-4">Collection Status</th>
                <th className="py-2.5 px-4">Normalization Status</th>
                <th className="py-2.5 px-4">Privacy Processing</th>
                <th className="py-2.5 px-4">Failure Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DF]">
              {stats.pipelineEvents.map((evt, idx) => (
                <tr key={idx} className="hover:bg-stone-50">
                  <td className="py-2.5 px-4 font-semibold text-stone-800">{evt.source}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-stone-900">{evt.eventId}</td>
                  <td className="py-2.5 px-4 text-stone-500 font-mono text-[11px]">{new Date(evt.collectionTimestamp).toLocaleTimeString()}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {evt.collectionStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      evt.normalizationStatus.includes('Failed')
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    }`}>
                      {evt.normalizationStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      evt.processingStatus === 'Blocked'
                        ? 'bg-rose-100 text-rose-800'
                        : evt.processingStatus === 'Redacted'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {evt.processingStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-stone-500 text-[11px]">
                    {evt.failureReason ? (
                      <span className="text-rose-600 font-semibold">{evt.failureReason}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-stone-200 shadow-modal text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <AlertTriangle size={18} />
              <span>Confirm Collector {confirmAction === 'stop' ? 'Stop' : 'Restart'}</span>
            </div>
            <p className="text-stone-600">
              {confirmAction === 'stop'
                ? 'Halting the local collector will pause telemetry buffering. No events will be queued for egress.'
                : 'Restarting will flush transient memory buffers and re-bind collection probes.'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-3 py-1.5 rounded-lg bg-stone-900 text-white font-bold hover:bg-black"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

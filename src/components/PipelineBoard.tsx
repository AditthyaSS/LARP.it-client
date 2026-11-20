import React from 'react';
import { PipelineItem, PipelineStage, PrivacyOutcome, EventSeverity } from '../types/pc1';
import { Shield, ShieldAlert, ShieldCheck, Clock, Server, AlertTriangle, Eye, Layers } from './Icons';

interface PipelineBoardProps {
  items: PipelineItem[];
  onSelectItem: (item: PipelineItem) => void;
}

const STAGES: Array<{ id: PipelineStage; label: string; description: string; headerColor: string }> = [
  { id: 'collected', label: '1. Collected', description: 'Local volume buffer', headerColor: 'text-stone-700 bg-stone-100' },
  { id: 'normalized', label: '2. Normalized', description: 'ECS schema conformant', headerColor: 'text-indigo-700 bg-indigo-50' },
  { id: 'privacy_review', label: '3. Privacy Review', description: 'JEV decision pipeline', headerColor: 'text-purple-700 bg-purple-50' },
  { id: 'approved', label: '4. Approved', description: 'Egress authorization', headerColor: 'text-teal-700 bg-teal-50' },
  { id: 'queued', label: '5. Queued', description: 'Outbound batching', headerColor: 'text-amber-700 bg-amber-50' },
  { id: 'sending', label: '6. Sending', description: 'TLS 1.3 in-transit', headerColor: 'text-blue-700 bg-blue-50' },
  { id: 'delivered', label: '7. Delivered', description: 'Signed ACK verified', headerColor: 'text-emerald-700 bg-emerald-50' },
];

export const PipelineBoard: React.FC<PipelineBoardProps> = ({ items, onSelectItem }) => {
  const blockedItems = items.filter((i) => i.stage === 'blocked' || i.privacyOutcome === 'REJECTED');

  const getSeverityBadge = (sev: EventSeverity) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-stone-50 text-stone-600 border-stone-200';
    }
  };

  const getPrivacyBadge = (outcome: PrivacyOutcome) => {
    switch (outcome) {
      case 'ALLOWED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'REDACTED':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'PSEUDONYMIZED':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'DROPPED':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Blocked / Rejected Notification Banner if any exists */}
      {blockedItems.length > 0 && (
        <div className="quarantine-pulse bg-rose-50/80 border border-rose-300/80 rounded-2xl p-4 shadow-xs transition-all duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <h2 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-rose-600" />
                <span>Blocked Telemetry Quarantine ({blockedItems.length})</span>
              </h2>
              <span className="text-xs text-rose-700">
                — These events violated JEV privacy rules and were strictly PREVENTED from crossing the trust boundary.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {blockedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group bg-white rounded-xl p-3.5 border border-rose-200/90 shadow-xs hover:border-rose-400 hover:shadow-md cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-rose-700 tracking-tight group-hover:text-rose-900 transition-colors">{item.eventId}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                    BLOCKED
                  </span>
                </div>
                <div className="text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
                  <Server size={12} className="text-stone-400" />
                  <span>{item.source}</span>
                  <span className="text-[10px] text-stone-400 font-mono">({item.service})</span>
                </div>
                <p className="text-xs text-stone-600 line-clamp-2 mb-2">{item.description}</p>
                <div className="text-[11px] font-medium text-rose-700 bg-rose-50 p-1.5 rounded-lg border border-rose-100 flex items-center justify-between">
                  <span>Violation: {item.rejectionReason || item.policyRule}</span>
                  <span className="text-[10px] text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Inspect →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-Stage Telemetry Pipeline Columns (Clarity inspired) */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x">
        {STAGES.map((stage) => {
          const stageItems = items.filter((i) => i.stage === stage.id);

          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 bg-[#F4F1EA]/80 rounded-2xl p-3 border border-[#E8E5DF] flex flex-col max-h-[750px] shadow-2xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E8E5DF]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${stage.headerColor}`}>
                      {stage.label}
                    </span>
                    <span className="text-xs font-bold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                      {stageItems.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 pl-0.5">{stage.description}</p>
                </div>
              </div>

              {/* Column Cards */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {stageItems.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-400 rounded-xl border border-dashed border-stone-300 bg-white/40">
                    No events in this stage
                  </div>
                ) : (
                  stageItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="group bg-white rounded-xl p-3 border border-[#E8E5DF] shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 relative"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${getSeverityBadge(item.severity)}`}>
                            {item.severity}
                          </span>
                          <span className="text-[10px] font-semibold text-stone-500 uppercase px-1.5 py-0.5 bg-stone-100 rounded">
                            {item.eventType}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-stone-800 group-hover:text-indigo-600 transition-colors">
                          {item.eventId}
                        </span>
                      </div>

                      {/* Source & Service */}
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 mb-1.5">
                        <Server size={13} className="text-stone-400" />
                        <span>{item.source}</span>
                        <span className="text-[10px] text-stone-400 font-normal">/ {item.service}</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-stone-600 line-clamp-2 mb-2.5 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Privacy Outcome Tag */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase ${getPrivacyBadge(item.privacyOutcome)}`}>
                          {item.privacyOutcome}
                        </span>

                        <span className="text-[10px] text-stone-400 truncate max-w-[130px]" title={item.policyRule}>
                          {item.policyRule}
                        </span>
                      </div>

                      {/* Simulation & Size footer */}
                      <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          <span>Simulated Stream</span>
                        </span>
                        <span className="font-mono">{item.payloadSize} B</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

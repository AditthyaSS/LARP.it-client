import React, { useState } from 'react';
import { PipelineItem, PrivacyOutcome, EventSeverity } from '../types/pc1';
import { Server, Eye, Copy, Check } from './Icons';

interface ListViewProps {
  items: PipelineItem[];
  onSelectItem: (item: PipelineItem) => void;
}

export const ListView: React.FC<ListViewProps> = ({ items, onSelectItem }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
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

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'sending':
        return 'bg-blue-100 text-blue-800';
      case 'queued':
        return 'bg-amber-100 text-amber-800';
      case 'approved':
        return 'bg-teal-100 text-teal-800';
      case 'privacy_review':
        return 'bg-purple-100 text-purple-800';
      case 'normalized':
        return 'bg-indigo-100 text-indigo-800';
      case 'blocked':
        return 'bg-rose-100 text-rose-800 font-bold';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E5DF] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F2EFE9] border-b border-[#E8E5DF] text-stone-600 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Source / Service</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Pipeline Stage</th>
              <th className="py-3 px-4">Privacy Outcome</th>
              <th className="py-3 px-4">Rule Applied</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E5DF]">
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-stone-400">
                  No telemetry events match the selected filters.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                        {item.eventId}
                      </span>
                      <button
                        onClick={(e) => handleCopy(item.eventId, e)}
                        className="text-stone-400 hover:text-stone-700 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy Event ID"
                      >
                        {copiedId === item.eventId ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-stone-800">
                      <Server size={13} className="text-stone-400" />
                      <span>{item.source}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 pl-4">{item.service}</span>
                  </td>

                  <td className="py-3 px-4 uppercase text-[10px] font-semibold text-stone-600">
                    {item.eventType}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getSeverityBadge(item.severity)}`}>
                      {item.severity}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${getStageBadge(item.stage)}`}>
                      {item.stage.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getPrivacyBadge(item.privacyOutcome)}`}>
                      {item.privacyOutcome}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-stone-600 text-xs truncate max-w-[160px]" title={item.policyRule}>
                    {item.policyRule}
                  </td>

                  <td className="py-3 px-4 font-mono text-stone-500">
                    {item.payloadSize} B
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="btn-interactive px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-indigo-50 hover:text-indigo-700 font-semibold text-stone-600 text-xs transition-all duration-150 inline-flex items-center gap-1 active:scale-95"
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

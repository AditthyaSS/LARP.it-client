import React, { useState } from 'react';
import { OutboundQueueItem, QueueItemStatus } from '../types/pc1';
import { Layers, Send, RotateCcw, Play, Square, Eye, Copy, Check, AlertTriangle, Clock } from './Icons';

interface OutboundQueueViewProps {
  queue: OutboundQueueItem[];
  isSenderPaused: boolean;
  onPauseResumeSender: () => void;
  onRetryPayload: (payloadId: string) => Promise<any>;
  onSendBatch: () => Promise<any>;
  onSendSelected: (payloadIds: string[]) => Promise<any>;
}

export const OutboundQueueView: React.FC<OutboundQueueViewProps> = ({
  queue,
  isSenderPaused,
  onPauseResumeSender,
  onRetryPayload,
  onSendBatch,
  onSendSelected,
}) => {
  const [selectedPayload, setSelectedPayload] = useState<OutboundQueueItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [isBatchSending, setIsBatchSending] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === queue.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(queue.map((q) => q.payloadId));
    }
  };

  const handleSendSingle = async (payloadId: string) => {
    setSendingId(payloadId);
    setStatusMessage(null);
    try {
      const res = await onRetryPayload(payloadId);
      setStatusMessage(res.message);
    } finally {
      setSendingId(null);
    }
  };

  const handleSendSelected = async () => {
    if (selectedIds.length === 0) return;
    setIsBatchSending(true);
    setStatusMessage(null);
    try {
      const res = await onSendSelected(selectedIds);
      setStatusMessage(`Attempted ${res.attempted} payloads: ${res.succeeded} accepted by PC 2`);
      setSelectedIds([]);
    } finally {
      setIsBatchSending(false);
    }
  };

  const handleSendApprovedBatch = async () => {
    setIsBatchSending(true);
    setStatusMessage(null);
    try {
      const res = await onSendBatch();
      setStatusMessage(`Batch sent: ${res.succeeded} of ${res.sent} accepted by PC 2`);
    } finally {
      setIsBatchSending(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getStatusBadge = (status: QueueItemStatus) => {
    switch (status) {
      case 'acknowledged':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'sending':
        return 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse';
      case 'retry_pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'failed':
        return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
      case 'approved':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'privacy_processing':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'collected':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const pendingCount = queue.filter((q) => q.queueStatus === 'pending' || q.queueStatus === 'approved').length;
  const retryCount = queue.filter((q) => q.queueStatus === 'retry_pending').length;
  const failedCount = queue.filter((q) => q.queueStatus === 'failed').length;
  const ackCount = queue.filter((q) => q.queueStatus === 'acknowledged').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Sender Controls */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full ${
                !isSenderPaused ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              {isSenderPaused ? 'Sender Paused (Buffering Locally)' : 'Outbound HTTP Sender Active'}
            </span>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200/60 font-semibold">
              Real HTTP POST (POST /api/v1/ingestion/pc1/telemetry)
            </span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Sanitized Telemetry Outbound Buffer
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Approved envelopes awaiting transmission across the customer trust boundary to PC 2.
          </p>
        </div>

        {/* Operational Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSendApprovedBatch}
            disabled={isBatchSending}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
            title="Send all approved payloads in queue to PC 2"
          >
            <Send size={13} className={isBatchSending ? 'animate-pulse' : ''} />
            <span>Send Approved Batch</span>
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={handleSendSelected}
              disabled={isBatchSending}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Send size={13} />
              <span>Send Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={onPauseResumeSender}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isSenderPaused
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-stone-100 hover:bg-amber-50 hover:text-amber-800 text-stone-700 border border-stone-200'
            }`}
          >
            {isSenderPaused ? <Play size={13} /> : <Square size={13} />}
            <span>{isSenderPaused ? 'Resume Sender' : 'Pause Sender'}</span>
          </button>
        </div>
      </div>

      {/* Queue Stats 4-Card Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-[#E8E5DF] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Approved / Pending
          </span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{pendingCount}</div>
          <span className="text-[10px] text-stone-400 block mt-1">Ready for transport</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E5DF] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Retry Pending
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{retryCount}</div>
          <span className="text-[10px] text-amber-700 block mt-1">Preserved payload ID</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E5DF] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Transmission Failed
          </span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{failedCount}</div>
          <span className="text-[10px] text-stone-400 block mt-1">PC 2 backend offline</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E5DF] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Acknowledged
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{ackCount}</div>
          <span className="text-[10px] text-emerald-700 block mt-1">Confirmed signed receipt</span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 font-semibold flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-indigo-400 hover:text-indigo-700">✕</button>
        </div>
      )}

      {/* Outbound Queue Table */}
      <div className="bg-white rounded-2xl border border-[#E8E5DF] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F2EFE9] border-b border-[#E8E5DF] text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === queue.length && queue.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-stone-300 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Payload ID</th>
                <th className="py-3 px-3">Events / Event IDs</th>
                <th className="py-3 px-3">Tenant & Gateway</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Attempts</th>
                <th className="py-3 px-3">Receipt / Error Details</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DF]">
              {queue.map((item) => {
                const isItemSending = sendingId === item.payloadId;
                const isSelected = selectedIds.includes(item.payloadId);

                return (
                  <tr key={item.payloadId} className={`hover:bg-[#FBF9F5] transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.payloadId)}
                        className="rounded border-stone-300 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-stone-900">
                      {item.payloadId}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-800">{item.eventCount} event(s)</div>
                      <span className="font-mono text-[10px] text-stone-400 truncate block max-w-[120px]" title={item.eventIds?.join(', ')}>
                        {item.eventIds?.join(', ') || item.source}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-stone-600 text-[11px]">
                      <div>{item.tenant}</div>
                      <span className="font-mono text-[10px] text-stone-400">{item.gatewayId}</span>
                    </td>

                    <td className="py-3 px-3 font-mono text-stone-500">
                      {item.payloadSizeBytes} B
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getStatusBadge(item.queueStatus)}`}>
                        {item.queueStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-stone-600">
                      {item.attemptCount} / {item.maxRetries}
                    </td>

                    <td className="py-3 px-3 text-xs">
                      {item.receiptId ? (
                        <span className="font-mono text-emerald-700 font-bold">{item.receiptId}</span>
                      ) : item.errorDetails ? (
                        <span className="text-rose-600 font-medium truncate block max-w-xs" title={item.errorDetails}>
                          {item.errorDetails}
                        </span>
                      ) : (
                        <span className="text-stone-400">Ready for dispatch</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedPayload(item)}
                        className="btn-interactive px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-all duration-150 active:scale-95"
                        title="Inspect Envelope JSON"
                      >
                        <Eye size={12} className="inline mr-1" />
                        <span>Inspect</span>
                      </button>

                      {item.queueStatus !== 'acknowledged' && (
                        <button
                          onClick={() => handleSendSingle(item.payloadId)}
                          disabled={isItemSending}
                          className="btn-interactive px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs hover:shadow-md transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Execute real HTTP transmission to PC 2"
                        >
                          <Send size={11} className={`inline mr-1 ${isItemSending ? 'animate-spin' : ''}`} />
                          <span>{isItemSending ? 'Sending...' : 'Send'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Inspection Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E8E5DF] shadow-modal overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-[#E8E5DF] bg-[#F9F8F5] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-stone-900">{selectedPayload.payloadId}</span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getStatusBadge(selectedPayload.queueStatus)}`}>
                    {selectedPayload.queueStatus.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-xs text-stone-500 font-mono">
                  Destination: {selectedPayload.destinationUrl}
                </span>
              </div>

              <button
                onClick={() => setSelectedPayload(null)}
                className="w-8 h-8 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 font-semibold">
                  Sanitized Egress Envelope (Conforms to PC 1 → PC 2 Contract)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(selectedPayload.envelope, null, 2))}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy Envelope'}</span>
                </button>
              </div>

              <pre className="p-4 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono overflow-x-auto max-h-[380px] leading-relaxed">
                {JSON.stringify(selectedPayload.envelope, null, 2)}
              </pre>
            </div>

            <div className="p-4 bg-stone-100 border-t border-[#E8E5DF] flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Payload Size: <strong className="text-stone-800">{selectedPayload.payloadSizeBytes} bytes</strong>
              </span>
              <button
                onClick={() => setSelectedPayload(null)}
                className="px-4 py-1.5 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

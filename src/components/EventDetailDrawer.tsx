import React, { useState } from 'react';
import { PipelineItem, PrivacyOutcome } from '../types/pc1';
import { ShieldCheck, ShieldAlert, Copy, Check, Server, Clock, Lock, FileCode } from './Icons';

interface EventDetailDrawerProps {
  item: PipelineItem | null;
  onClose: () => void;
}

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({ item, onClose }) => {
  const [activeTab, setActiveTab] = useState<'decisions' | 'sanitized' | 'raw' | 'security'>('decisions');
  const [copied, setCopied] = useState<boolean>(false);

  if (!item) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-200">
      {/* Slide-over panel */}
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#E8E5DF] overflow-hidden animate-tab-enter">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E5DF] bg-[#F9F8F5] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-stone-900">{item.eventId}</span>
              <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold uppercase ${getPrivacyBadge(item.privacyOutcome)}`}>
                {item.privacyOutcome}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-stone-200 font-medium text-stone-700 capitalize">
                {item.stage.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1">
                <Server size={12} />
                <span className="font-semibold text-stone-700">{item.source}</span> ({item.service})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-sm transition-colors"
            title="Close Drawer"
          >
            ✕
          </button>
        </div>

        {/* Simulation Boundary Notice */}
        <div className="px-5 py-2.5 bg-amber-50/70 border-b border-amber-200/60 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>
              <strong>Local Boundary:</strong> Filtered inside customer perimeter before crossing to PC 2.
            </span>
          </div>
          <span className="font-mono text-[10px] text-amber-700 font-bold uppercase">Simulated Stream</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8E5DF] px-5 bg-white text-xs font-semibold text-stone-600 gap-6">
          <button
            onClick={() => setActiveTab('decisions')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'decisions'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Field Decisions ({item.fieldDecisions.length})
          </button>

          <button
            onClick={() => setActiveTab('sanitized')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'sanitized'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Sanitized Payload
          </button>

          <button
            onClick={() => setActiveTab('raw')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'raw'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Raw Telemetry
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Security & JEV Audit
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 overflow-y-auto">
          {/* TAB 1: FIELD DECISIONS */}
          {activeTab === 'decisions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                  Field-Level Privacy Enforcement
                </h4>
                <span className="text-xs text-stone-500">
                  Policy: <strong className="text-stone-800">Enterprise Prod v2.1.0-strict</strong>
                </span>
              </div>

              {item.fieldDecisions.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500 border border-stone-200 rounded-xl bg-stone-50">
                  Standard structured metric payload conformed to allow-list with 0 sensitive fields detected.
                </div>
              ) : (
                <div className="space-y-3">
                  {item.fieldDecisions.map((fd, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-stone-200 bg-[#FBF9F5] shadow-xs text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-stone-900">{fd.fieldName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPrivacyBadge(fd.decision)}`}>
                          {fd.decision}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-stone-400 block text-[10px]">ORIGINAL VALUE:</span>
                          <span className="font-mono text-stone-700 truncate block" title={String(fd.originalValue)}>
                            {String(fd.originalValue)}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">SANITIZED EGRESS VALUE:</span>
                          <span className="font-mono text-stone-800 font-semibold truncate block">
                            {fd.sanitizedValue !== undefined ? String(fd.sanitizedValue) : '— [DROPPED]'}
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/60 flex items-center justify-between">
                        <span>Rule: <strong>{fd.ruleApplied}</strong></span>
                        <span className="text-stone-400">{fd.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SANITIZED PAYLOAD */}
          {activeTab === 'sanitized' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-600">
                  Approved payload formatted for PC 2 SaaS Ingest
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(item.rawEvent, null, 2))}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-4 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-[460px]">
                {JSON.stringify(
                  {
                    event_id: item.eventId,
                    source: item.source,
                    service: item.service,
                    event_type: item.eventType,
                    severity: item.severity,
                    timestamp: item.timestamp,
                    metrics: item.rawEvent.metrics || {},
                    labels: item.rawEvent.labels || {},
                    sanitized_attributes: item.fieldDecisions.reduce((acc: any, fd) => {
                      if (fd.sanitizedValue !== undefined) acc[fd.fieldName] = fd.sanitizedValue;
                      return acc;
                    }, {}),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          {/* TAB 3: RAW TELEMETRY */}
          {activeTab === 'raw' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                <strong>Local Volume Isolation:</strong> Raw logs and unsanitized parameters stay inside this container's volume. They NEVER cross the trust boundary.
              </div>

              <pre className="p-4 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-[460px]">
                {JSON.stringify(item.rawEvent, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 4: SECURITY & JEV AUDIT */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
                  <ShieldCheck size={16} className="text-indigo-600" />
                  <span>JEV Privacy Gateway Verification</span>
                </div>

                <ul className="space-y-2 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Allow-list Filter:</strong> All unknown keys dropped before serialization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Secret Scrubber:</strong> High entropy API tokens & DB credentials replaced with redacted tokens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>HMAC Pseudonymizer:</strong> Identifiers hashed with tenant-specific salt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Schema Check:</strong> Conforms strictly to PC 1 → PC 2 contract schema 1.0.0</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Cryptographic Hash:</strong> SHA-256 ledger entry generated for tamper audit</span>
                  </li>
                </ul>
              </div>

              <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
                Tenant: <span className="font-semibold text-stone-800">enterprise-prod</span> | Gateway ID:{' '}
                <span className="font-semibold text-stone-800">gw-pc1-ent-us-east</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

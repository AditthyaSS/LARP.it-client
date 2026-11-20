import React, { useState } from 'react';
import { EgressProof } from '../types/pc1';
import { FileCode, ShieldCheck, Copy, Check, Lock, Key, Clock, Server, CheckCircle2, Eye, AlertTriangle } from './Icons';

interface EgressProofViewProps {
  proofs: EgressProof[];
}

export const EgressProofView: React.FC<EgressProofViewProps> = ({ proofs }) => {
  const [selectedProof, setSelectedProof] = useState<EgressProof | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Cryptographic Egress Audit Ledger
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              SHA-256 Audited
            </span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Egress Evidence & Transparency Log
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Immutable proof of what crossed the trust boundary, policy version applied, exact byte count, and Signed Acknowledgement from PC 2.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-600 bg-[#FBF9F5] p-3 rounded-xl border border-stone-200">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-bold">Transport</span>
            <strong className="text-stone-800">TLS 1.3 / AES-256</strong>
          </div>
          <div className="h-6 w-px bg-stone-300"></div>
          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-bold">Signing</span>
            <strong className="text-stone-800">HMAC-SHA256</strong>
          </div>
        </div>
      </div>

      {/* Proofs Table */}
      <div className="bg-white rounded-2xl border border-[#E8E5DF] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F2EFE9] border-b border-[#E8E5DF] text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Payload ID</th>
                <th className="py-3 px-3">Tenant & Gateway</th>
                <th className="py-3 px-3">Events</th>
                <th className="py-3 px-3">Timestamp (UTC)</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">SHA-256 Hash</th>
                <th className="py-3 px-3">HTTP</th>
                <th className="py-3 px-3">ACK Status</th>
                <th className="py-3 px-4 text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DF]">
              {proofs.map((proof) => (
                <tr
                  key={proof.payloadId}
                  onClick={() => setSelectedProof(proof)}
                  className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                    {proof.payloadId}
                  </td>

                  <td className="py-3 px-3 text-stone-600 text-[11px]">
                    <div>{proof.tenant}</div>
                    <span className="font-mono text-[10px] text-stone-400">{proof.gatewayId}</span>
                  </td>

                  <td className="py-3 px-3 font-semibold text-stone-800">
                    {proof.eventCount}
                  </td>

                  <td className="py-3 px-3 text-stone-600">
                    {new Date(proof.timestamp).toLocaleTimeString()}
                  </td>

                  <td className="py-3 px-3 font-mono text-stone-700">
                    {proof.payloadSizeBytes} B
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-600">
                      <span>{proof.sha256Hash.slice(0, 14)}...</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(proof.sha256Hash, `hash-${proof.payloadId}`);
                        }}
                        className="text-stone-400 hover:text-stone-700 p-0.5 rounded"
                        title="Copy Full SHA-256 Hash"
                      >
                        {copiedField === `hash-${proof.payloadId}` ? (
                          <Check size={12} className="text-emerald-600" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {proof.httpStatus || 200}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 size={11} className="text-emerald-600" />
                      <span>{proof.receiptId}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedProof(proof)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-indigo-50 hover:text-indigo-700 font-semibold text-stone-600 text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Egress Evidence Drawer / Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="w-full max-w-2xl bg-white h-full shadow-modal flex flex-col border-l border-[#E8E5DF] overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#E8E5DF] bg-[#F9F8F5] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-stone-900">{selectedProof.payloadId}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ACKNOWLEDGED (HTTP {selectedProof.httpStatus})
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Receipt: <strong className="font-mono text-stone-800">{selectedProof.receiptId}</strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedProof(null)}
                className="w-8 h-8 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* Metadata Details */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700">
                <div>Tenant: <strong className="text-stone-900">{selectedProof.tenant}</strong></div>
                <div>Gateway: <strong className="font-mono text-stone-900">{selectedProof.gatewayId}</strong></div>
                <div>Policy ID: <strong className="text-stone-900">{selectedProof.policyId}</strong></div>
                <div>Policy Version: <strong className="font-mono text-stone-900">{selectedProof.policyVersion}</strong></div>
                <div>Destination: <strong className="font-mono text-stone-900 text-[10px]">{selectedProof.destination}</strong></div>
                <div>Transmission Attempt: <strong className="text-stone-900">#{selectedProof.attemptCount}</strong></div>
              </div>

              {/* Hash & Byte Count Box */}
              <div className="p-4 rounded-xl bg-stone-900 text-stone-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Cryptographic SHA-256 Digest (Canonical Payload Bytes)
                  </span>
                  <button
                    onClick={() => handleCopy(selectedProof.sha256Hash, 'drawer-hash')}
                    className="flex items-center gap-1 text-[11px] text-indigo-300 hover:text-indigo-100 font-mono"
                  >
                    {copiedField === 'drawer-hash' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedField === 'drawer-hash' ? 'Copied Hash' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-emerald-400 break-all select-all bg-black/40 p-2.5 rounded-lg border border-stone-800">
                  {selectedProof.sha256Hash}
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <span>Exact Size: <strong>{selectedProof.payloadSizeBytes} bytes</strong></span>
                  <span>Signature: <strong>{selectedProof.signatureAlgorithm}</strong></span>
                </div>
              </div>

              {/* Field Decisions Summary */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                  Field Sanitation Breakdown
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#FBF9F5] p-2 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">APPROVED</span>
                    <strong className="text-emerald-700 text-sm">{selectedProof.fieldsApproved}</strong>
                  </div>
                  <div className="bg-[#FBF9F5] p-2 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">REMOVED</span>
                    <strong className="text-stone-700 text-sm">{selectedProof.fieldsRemoved}</strong>
                  </div>
                  <div className="bg-[#FBF9F5] p-2 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">REDACTED</span>
                    <strong className="text-amber-700 text-sm">{selectedProof.fieldsRedacted}</strong>
                  </div>
                  <div className="bg-[#FBF9F5] p-2 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">PSEUDONYMIZED</span>
                    <strong className="text-indigo-700 text-sm">{selectedProof.fieldsPseudonymized}</strong>
                  </div>
                </div>
              </div>

              {/* Transport & TLS Security Info */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-stone-700">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                  <Lock size={14} className="text-indigo-600" />
                  <span>Transport Security & Trust Boundary</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-400 block">PROTOCOL:</span>
                    <span className="font-semibold">{selectedProof.tlsInfo.protocol}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">CIPHER SUITE:</span>
                    <span className="font-semibold font-mono">{selectedProof.tlsInfo.cipherSuite}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">CERT PINNING:</span>
                    <span className="font-semibold text-emerald-700">{selectedProof.tlsInfo.certPinning}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">mTLS AUTH:</span>
                    <span className="font-semibold">{selectedProof.tlsInfo.mTLSStatus}</span>
                  </div>
                </div>
              </div>

              {/* Signed ACK Details from PC 2 */}
              {selectedProof.ackDetails && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>PC 2 SaaS Signed Acknowledgement Verification</span>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <div>Receipt ID: <strong className="font-mono">{selectedProof.ackDetails.receiptId}</strong></div>
                    <div>Acknowledged At: <strong>{selectedProof.ackDetails.receivedAt}</strong></div>
                    <div>Ingest Node: <strong>{selectedProof.ackDetails.pc2Node}</strong></div>
                    <div>Round-trip Latency: <strong>{selectedProof.ackDetails.latencyMs} ms</strong></div>
                  </div>
                </div>
              )}

              {/* Sanitized Payload Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span>Sanitized Payload Transmitted</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(selectedProof.sanitizedPayloadSample, null, 2), 'payload-json')}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800"
                  >
                    {copiedField === 'payload-json' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    <span>{copiedField === 'payload-json' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono overflow-x-auto max-h-[220px]">
                  {JSON.stringify(selectedProof.sanitizedPayloadSample, null, 2)}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-100 border-t border-[#E8E5DF] flex justify-end">
              <button
                onClick={() => setSelectedProof(null)}
                className="px-4 py-1.5 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-900"
              >
                Close Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

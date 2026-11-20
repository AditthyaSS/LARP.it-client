import React, { useState } from 'react';
import { JevPolicy, PrivacyOutcome } from '../types/pc1';
import { evaluateJevPolicy, PolicyTestResult } from '../services/jevPolicyEngine';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Play,
  Copy,
  Check,
  Lock,
  Layers,
  FileCode,
  Info,
  CheckCircle2,
  XCircle,
  Eye,
} from './Icons';

interface PrivacyPolicyViewProps {
  policy: JevPolicy;
}

const SAMPLE_PAYLOADS = [
  {
    name: 'Sample 1: Web Ingress with Bearer Token & Email',
    description: 'Contains Bearer token and customer email to test Secret Scrubbing and PII Dropping',
    payload: {
      event_id: 'EVT-TEST-101',
      source: 'srv-web-01',
      service: 'nginx-ingress',
      event_type: 'log',
      message: 'User authentication session established',
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user_email: 'compliance_officer@enterprise.corp',
      client_ip: '198.51.100.84',
      request_duration_ms: 18.2,
      unknown_internal_telemetry_tag: 'x-cluster-zone-4a',
    },
  },
  {
    name: 'Sample 2: DB Saturation with Database Password',
    description: 'Contains plaintext database connection password in error payload',
    payload: {
      event_id: 'EVT-TEST-102',
      source: 'srv-db-01',
      service: 'postgresql-16.2',
      event_type: 'error',
      severity: 'critical',
      message: 'Connection pool exhausted while authenticating ledger',
      db_password: 'SuperSecretDatabasePassword2026!',
      active_connections: 100,
      max_connections: 100,
      pool_wait_queue: 34,
    },
  },
  {
    name: 'Sample 3: Payment Event with Customer ID & IP',
    description: 'Tests HMAC Pseudonymization for user_id and client_ip with tenant salt',
    payload: {
      event_id: 'EVT-TEST-103',
      source: 'payment-service',
      service: 'pay-core',
      event_type: 'audit',
      message: 'Settlement confirmed for invoice #9921',
      user_id: 'cust_enterprise_884129',
      transaction_id: 'tx_pci_77192834',
      client_ip: '203.0.113.19',
      settlement_usd: 1420.5,
      pan_card_number: '4111-2222-3333-4444',
    },
  },
  {
    name: 'Sample 4: Forbidden Heap Stack Dump (Triggers Blocked)',
    description: 'Contains forbidden raw memory coredump; demonstrates payload rejection',
    payload: {
      event_id: 'EVT-TEST-104',
      source: 'srv-web-01',
      service: 'nginx-ingress',
      event_type: 'error',
      message: 'Segmentation fault memory dump',
      stack_dump: '0x0041fa90 [HEAP_BUFFER: api_token=live_sec_991823741294]',
      error_code: 139,
    },
  },
];

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ policy }) => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [customPayloadText, setCustomPayloadText] = useState<string>(
    JSON.stringify(SAMPLE_PAYLOADS[0].payload, null, 2)
  );
  const [testResult, setTestResult] = useState<PolicyTestResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSelectSample = (index: number) => {
    setSelectedSampleIndex(index);
    setCustomPayloadText(JSON.stringify(SAMPLE_PAYLOADS[index].payload, null, 2));
    setTestResult(null);
    setJsonError(null);
  };

  const handleRunPolicyTest = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(customPayloadText);
      const result = evaluateJevPolicy(parsed, policy);
      setTestResult(result);
    } catch (err: any) {
      setJsonError(`Invalid JSON syntax: ${err.message}`);
      setTestResult(null);
    }
  };

  const handleCopyOutput = () => {
    if (!testResult) return;
    navigator.clipboard.writeText(JSON.stringify(testResult.sanitizedOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getPrivacyBadge = (outcome: PrivacyOutcome) => {
    switch (outcome) {
      case 'Approved':
      case 'ALLOWED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Redacted':
      case 'REDACTED':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'PSEUDONYMIZED':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Blocked':
      case 'DROPPED':
      case 'REJECTED':
        return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Policy Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#E8E5DF]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Active JEV Privacy Policy
              </span>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
                {policy.policyVersion}
              </span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight mt-1">
              {policy.policyName}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Enforces local privacy and data sanitization within the customer boundary before telemetry egresses to PC 2.
            </p>
          </div>

          <div className="text-left md:text-right text-xs text-stone-500 space-y-1">
            <div>Scope: <strong className="text-stone-800">{policy.scope}</strong></div>
            <div>Tenant: <strong className="text-stone-800">enterprise-production</strong></div>
            <div>Gateway ID: <strong className="font-mono text-stone-800">{policy.gatewayId}</strong></div>
            <div>Last Updated: <strong className="text-stone-700">{new Date(policy.lastUpdated).toLocaleDateString()}</strong></div>
          </div>
        </div>

        {/* 6 Processing Stages Horizontal Grid */}
        <div className="pt-4">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-3">
            Policy Execution Lifecycle Stages
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { stage: '1. Allow-list', desc: 'Unknown keys dropped' },
              { stage: '2. Secret Detection', desc: 'Entropy & regex patterns' },
              { stage: '3. Redaction', desc: 'Passwords & tokens scrubbed' },
              { stage: '4. Pseudonymize', desc: 'HMAC tenant-salted IDs' },
              { stage: '5. Schema Check', desc: 'Strict ECS typing check' },
              { stage: '6. Egress Auth', desc: 'Signed envelope dispatch' },
            ].map((st, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#FBF9F5] border border-stone-200 text-center">
                <span className="text-xs font-bold text-stone-800 block">{st.stage}</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">{st.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Rule Categories */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
          Configured Rule Categories & Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {policy.ruleCategories.map((rule) => (
            <div key={rule.id} className="p-3.5 rounded-xl border border-stone-200 bg-[#FBF9F5] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">{rule.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPrivacyBadge(rule.action)}`}>
                  {rule.action}
                </span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                {rule.patternDescription}
              </p>
              <div className="text-[10px] text-stone-400 font-mono truncate">
                Target: {rule.targetFields.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Policy Testing Sandbox */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E5DF] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <h3 className="text-base font-bold text-stone-900 tracking-tight">
                Policy Testing Sandbox
              </h3>
              <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded">
                SAFE TEST ENVIRONMENT
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Select or modify sample telemetry to test JEV privacy decisions. Payloads tested here are processed locally in browser and NEVER egress across the trust boundary.
            </p>
          </div>

          <button
            onClick={handleRunPolicyTest}
            className="btn-interactive flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all duration-150 active:scale-95 self-start md:self-auto"
          >
            <Play size={14} />
            <span>Test Policy</span>
          </button>
        </div>

        {/* Sample Payload Selector Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {SAMPLE_PAYLOADS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(idx)}
              className={`btn-interactive px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 active:scale-95 ${
                selectedSampleIndex === idx
                  ? 'bg-stone-900 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* Test Sandbox Editor & Results Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {/* Left: Input Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Input Telemetry Payload (JSON)</span>
              <span className="text-[10px] text-stone-400 font-normal">Editable</span>
            </div>
            <textarea
              value={customPayloadText}
              onChange={(e) => setCustomPayloadText(e.target.value)}
              rows={16}
              className="w-full p-3 font-mono text-xs bg-stone-900 text-emerald-300 rounded-xl border border-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 leading-relaxed"
            />
            {jsonError && (
              <div className="text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
                {jsonError}
              </div>
            )}
          </div>

          {/* Right: Policy Evaluation Results */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Sanitization & Egress Verification</span>
              {testResult && (
                <button
                  onClick={handleCopyOutput}
                  className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy Output'}</span>
                </button>
              )}
            </div>

            {!testResult ? (
              <div className="h-[360px] flex flex-col items-center justify-center p-6 text-center border border-dashed border-stone-300 rounded-xl bg-[#FBF9F5] text-stone-400 text-xs">
                <Shield size={32} className="text-stone-300 mb-2" />
                <span className="font-semibold text-stone-600">No Evaluation Performed</span>
                <p className="max-w-xs mt-1 text-[11px]">
                  Click <strong>"Test Policy"</strong> above to simulate JEV filtering on the input payload.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Result Status Banner */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    testResult.isApproved
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border-rose-300 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {testResult.isApproved ? (
                      <CheckCircle2 size={16} className="text-emerald-600" />
                    ) : (
                      <XCircle size={16} className="text-rose-600" />
                    )}
                    <span>
                      {testResult.isApproved
                        ? 'TRANSMISSION APPROVED: Payload sanitized for egress'
                        : 'TRANSMISSION BLOCKED: Forbidden payload detected'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getPrivacyBadge(testResult.privacyOutcome)}`}>
                    {testResult.privacyOutcome}
                  </span>
                </div>

                {/* Counters Grid */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-[#FBF9F5] p-2 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">ALLOWED</span>
                    <strong className="text-emerald-700 text-sm">{testResult.summary.fieldsAllowed}</strong>
                  </div>
                  <div className="bg-[#FBF9F5] p-2 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">REDACTED</span>
                    <strong className="text-amber-700 text-sm">{testResult.summary.fieldsRedacted}</strong>
                  </div>
                  <div className="bg-[#FBF9F5] p-2 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">BLOCKED</span>
                    <strong className="text-rose-700 text-sm">{testResult.summary.fieldsDropped}</strong>
                  </div>
                  <div className="bg-[#FBF9F5] p-2 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">PSEUDONYM</span>
                    <strong className="text-indigo-700 text-sm">{testResult.summary.fieldsPseudonymized}</strong>
                  </div>
                </div>

                {/* Sanitized Output Preview */}
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono overflow-x-auto max-h-[220px] leading-relaxed">
                  {JSON.stringify(testResult.sanitizedOutput, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Field-level Decisions Detailed Table (when evaluated) */}
        {testResult && (
          <div className="pt-3 border-t border-[#E8E5DF] space-y-2">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Event-Level Privacy Decision Matrix ({testResult.fieldDecisions.length} fields evaluated)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2EFE9] text-stone-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Field Name</th>
                    <th className="p-2.5">Decision</th>
                    <th className="p-2.5">Rule Applied</th>
                    <th className="p-2.5">Sanitized Output</th>
                    <th className="p-2.5">Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {testResult.fieldDecisions.map((fd, i) => (
                    <tr key={i} className="hover:bg-stone-50">
                      <td className="p-2.5 font-mono font-bold text-stone-800">{fd.fieldName}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getPrivacyBadge(fd.decision)}`}>
                          {fd.decision}
                        </span>
                      </td>
                      <td className="p-2.5 text-stone-600">{fd.ruleApplied}</td>
                      <td className="p-2.5 font-mono text-stone-700 truncate max-w-[150px]">
                        {fd.sanitizedValue !== undefined ? String(fd.sanitizedValue) : '— [BLOCKED]'}
                      </td>
                      <td className="p-2.5 text-stone-500 text-[11px]">{fd.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

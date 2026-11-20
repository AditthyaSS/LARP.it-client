import React, { useState } from 'react';
import { GatewaySettings } from '../types/pc1';
import { Settings, ShieldCheck, Key, Lock, Network, Zap, Check, AlertTriangle } from './Icons';

interface SettingsViewProps {
  settings: GatewaySettings;
  onUpdateSettings: (newSettings: Partial<GatewaySettings>) => void;
  onTestConnection: () => Promise<any>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onTestConnection,
}) => {
  const [baseUrlInput, setBaseUrlInput] = useState<string>(settings.pc2ApiBaseUrl);
  const [gatewayIdInput, setGatewayIdInput] = useState<string>(settings.gatewayId);
  const [tenantInput, setTenantInput] = useState<string>(settings.tenantContext);
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ connected: boolean; message: string; latencyMs?: number } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveConfiguration = () => {
    onUpdateSettings({
      pc2ApiBaseUrl: baseUrlInput,
      gatewayId: gatewayIdInput,
      tenantContext: tenantInput,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestEndpoint = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await onTestConnection();
      setTestResult(res);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <Settings size={20} className="text-indigo-600" />
          <span>Gateway & Trust Boundary Configuration</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage local privacy enforcement settings, PC 2 SaaS ingestion endpoints, cryptographic credentials, and retention windows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: PC 2 Endpoint & Real HTTP Sender Config */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <Network size={16} className="text-indigo-600" />
              <span>PC 2 SaaS Ingestion Endpoint</span>
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                settings.endpointStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {settings.endpointStatus}
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Configure the PC 2 FastAPI backend base URL. The sender will issue real HTTP POST requests with TLS 1.3 encryption and HMAC-SHA256 signatures to:
            <code className="block mt-1 font-mono text-[11px] bg-stone-100 p-2 rounded-lg text-indigo-900">
              POST /api/v1/ingestion/pc1/telemetry
            </code>
          </p>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-700 uppercase">
                PC 2 Base URL (VITE_PC2_API_BASE_URL)
              </label>
              <input
                type="text"
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                placeholder="http://localhost:8000"
                className="w-full px-3 py-1.5 bg-[#F9F8F5] border border-[#E8E5DF] rounded-xl text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-700 uppercase">Gateway ID</label>
                <input
                  type="text"
                  value={gatewayIdInput}
                  onChange={(e) => setGatewayIdInput(e.target.value)}
                  placeholder="gateway-pc1-001"
                  className="w-full px-2.5 py-1.5 bg-[#F9F8F5] border border-[#E8E5DF] rounded-xl text-xs font-mono text-stone-800 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-700 uppercase">Tenant ID</label>
                <input
                  type="text"
                  value={tenantInput}
                  onChange={(e) => setTenantInput(e.target.value)}
                  placeholder="enterprise-production"
                  className="w-full px-2.5 py-1.5 bg-[#F9F8F5] border border-[#E8E5DF] rounded-xl text-xs font-mono text-stone-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSaveConfiguration}
                className="btn-interactive px-4 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-all duration-150 active:scale-95"
              >
                {savedSuccess ? 'Configuration Saved!' : 'Save Configuration'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <button
              onClick={handleTestEndpoint}
              disabled={testingConnection}
              className="btn-interactive flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={14} className={testingConnection ? 'animate-spin' : ''} />
              <span>{testingConnection ? 'Probing GET /api/v1/health...' : 'Test Connection (GET /api/v1/health)'}</span>
            </button>

            <span className="text-[11px] text-stone-400">
              Last probe: {new Date(settings.lastConnectivityCheck).toLocaleTimeString()}
            </span>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs ${
                testResult.connected
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}
            >
              <strong>{testResult.connected ? 'Connection Succeeded: ' : 'Connection Note: '}</strong>
              <span>{testResult.message}</span>
              {testResult.latencyMs && (
                <span className="block text-[10px] text-stone-500 mt-0.5">Round-trip latency: {testResult.latencyMs}ms</span>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Gateway Identity & Credentials */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-600" />
              <span>Gateway Identity & Credentials</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">ID: {settings.gatewayId}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#FBF9F5] rounded-xl border border-stone-200 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Tenant Context</div>
              <div className="font-bold text-stone-800">{settings.environment}</div>
              <div className="text-[11px] text-stone-500">Tenant identifier: <code className="font-mono">{settings.tenantContext}</code></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#FBF9F5] rounded-xl border border-stone-200 space-y-1">
                <div className="text-[10px] text-stone-400 uppercase font-bold flex items-center gap-1">
                  <Key size={12} />
                  <span>API Key</span>
                </div>
                <div className="font-mono text-emerald-700 font-bold">Configured</div>
                <div className="text-[10px] text-stone-400 font-mono">pc1_ent_prod_***[MASKED]</div>
              </div>

              <div className="p-3 bg-[#FBF9F5] rounded-xl border border-stone-200 space-y-1">
                <div className="text-[10px] text-stone-400 uppercase font-bold flex items-center gap-1">
                  <Lock size={12} />
                  <span>HMAC Signing</span>
                </div>
                <div className="font-mono text-emerald-700 font-bold">Active</div>
                <div className="text-[10px] text-stone-400">HMAC-SHA256 (Salted)</div>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-800 block">Certificate Status:</span>
                <span className="text-[11px] text-stone-500">Pinned CA Certificate</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {settings.certificateStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Retention Policy */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider pb-3 border-b border-stone-200">
            Local Retention Windows (Customer Disk Isolation)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#FBF9F5] rounded-xl border border-stone-200">
              <div>
                <span className="font-bold text-stone-800 block">Raw Local Event Retention</span>
                <span className="text-[11px] text-stone-500">Purges raw unsanitized logs from container volume</span>
              </div>
              <span className="font-bold font-mono text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                {settings.retention.localEventRetentionHours} Hours
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FBF9F5] rounded-xl border border-stone-200">
              <div>
                <span className="font-bold text-stone-800 block">Outbound Queue Retention</span>
                <span className="text-[11px] text-stone-500">Retention window for acknowledged egress envelopes</span>
              </div>
              <span className="font-bold font-mono text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                {settings.retention.queueRetentionHours} Hours
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FBF9F5] rounded-xl border border-stone-200">
              <div>
                <span className="font-bold text-stone-800 block">Egress Audit Proof Ledger</span>
                <span className="text-[11px] text-stone-500">Immutable SHA-256 hash receipts for compliance</span>
              </div>
              <span className="font-bold font-mono text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                {settings.retention.proofLedgerRetentionDays} Days
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Simulation Controls */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Simulation & Demonstration Mode
            </h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              ACTIVE
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            The frontend simulates local host telemetry collection, eBPF probes, and JEV privacy sanitization.
            All mock data models conform to the production CICADA specification for seamless backend migration.
          </p>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <strong>Production Boundary Guarantee:</strong>
            <p className="text-[11px] leading-relaxed">
              No real enterprise servers, raw database passwords, or unredacted tokens are ever transmitted from this dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

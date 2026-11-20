import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, AlertTriangle, Zap, Server, Network } from './Icons';
import { LARP_IT_LOGO } from '../assets/logoBase64';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  isCollectorRunning: boolean;
  pc2EndpointStatus: 'connected' | 'disconnected' | 'testing';
  pc2BaseUrl: string;
  gatewayId: string;
  latestReceiptId?: string;
  lastTransmissionTime?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isRefreshing,
  isCollectorRunning,
  pc2EndpointStatus,
  pc2BaseUrl,
  gatewayId,
  latestReceiptId,
  lastTransmissionTime,
}) => {
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => {
        const next = prev + 1;
        if (next < 5) return next;
        setLastUpdated(`${next}s ago`);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setSecondsAgo(0);
    setLastUpdated('Just now');
    onRefresh();
  };

  return (
    <header className="sticky top-0 z-20 bg-[#F9F8F5]/90 backdrop-blur-md border-b border-[#E8E5DF] px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Environment & Page Identity with Official Brand Logo */}
        <div className="flex items-start md:items-center gap-3.5">
          <div className="flex items-center gap-3">
            <img
              src={LARP_IT_LOGO}
              alt="LARP.it Logo"
              className="h-8 md:h-9 w-auto object-contain transition-transform duration-200 hover:scale-105"
            />
            <div className="h-7 w-px bg-stone-300 hidden sm:block"></div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold tracking-wider text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                PC 1 · Gateway
              </span>
              <span className="text-xs font-semibold text-stone-600 bg-stone-200/70 px-2 py-0.5 rounded-md">
                Enterprise Production
              </span>
              <span className="text-xs font-mono font-bold text-stone-500 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                {gatewayId}
              </span>
              {/* Distinct Demo / Simulation Indicator */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 shadow-xs cursor-help"
                title="DEMO SIMULATION: All infrastructure telemetry and privacy decisions are simulated locally in the browser."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="tracking-wide uppercase text-[11px] font-bold">SIMULATION MODE</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-xl font-bold text-[#22201D] tracking-tight">
                PC 1 · Customer Environment
              </h1>
              <span className="text-xs text-stone-500 font-normal hidden sm:inline">
                | Local Telemetry Gateway & Privacy Control
              </span>
            </div>
          </div>
        </div>

        {/* Right Status Actions & Network Indicators */}
        <div className="flex items-center gap-3 self-end md:self-center flex-wrap">
          {/* PC 2 Endpoint Connection Status */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs shadow-xs ${
              pc2EndpointStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-stone-50 text-stone-700 border-stone-200'
            }`}
            title={`PC 2 SaaS Backend: ${pc2BaseUrl}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                pc2EndpointStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">PC 2 Ingestion</span>
              <span className="text-xs font-bold font-mono">
                {pc2EndpointStatus === 'connected' ? 'Connected' : 'Offline / Standby'}
              </span>
            </div>
          </div>

          {/* Gateway Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E8E5DF] shadow-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isCollectorRunning ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'
              }`}
            />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-stone-700 leading-tight">
                {isCollectorRunning ? 'Trust Boundary Active' : 'Collector Paused'}
              </span>
              <span className="text-[10px] text-stone-500 leading-tight">
                Strict JEV Isolation
              </span>
            </div>
          </div>

          {/* Last Updated Timestamp & Refresh */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E8E5DF] shadow-xs text-xs text-stone-600">
            <span className="text-[11px] text-stone-500">Updated:</span>
            <span className="font-semibold text-stone-700">{lastUpdated}</span>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="btn-interactive p-1 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-all duration-150 active:scale-90 disabled:opacity-50"
              title="Refresh Telemetry Pipeline"
              aria-label="Refresh"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-indigo-600' : ''} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

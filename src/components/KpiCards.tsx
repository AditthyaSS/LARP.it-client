import React from 'react';
import { DashboardSummary } from '../types/pc1';
import { Server, Activity, Shield, Layers, CheckCircle2, Clock } from './Icons';

interface KpiCardsProps {
  summary: DashboardSummary;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-6">
      {/* Card 1: SOURCES MONITORED (Pastel Lavender - Simulated) */}
      <div className="group bg-[#E9E1FF] rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md border border-indigo-100/50 hover:border-indigo-300/60 cursor-default">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-[#4A2F8A] uppercase">
            Sources Monitored
          </span>
          <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center text-[#5E3FA2] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-2xs">
            <Server size={14} />
          </div>
        </div>

        <div className="my-2">
          <div className="text-3xl font-extrabold text-[#2F1D59] tracking-tight">
            {summary.sourcesMonitored.total}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#D6C4F7]/60">
          <span className="font-semibold text-emerald-800">
            {summary.sourcesMonitored.active} Active
          </span>
          <span className="text-[#6C559E] font-medium">
            {summary.sourcesMonitored.offlineOrDegraded} Degraded
          </span>
        </div>
      </div>

      {/* Card 2: EVENTS COLLECTED (Pastel Peach - Simulated Buffer) */}
      <div className="group bg-[#FFE2D5] rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md border border-orange-100/50 hover:border-orange-300/60 cursor-default">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-[#8A3714] uppercase">
            Events Collected
          </span>
          <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center text-[#A84C23] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-3 shadow-2xs">
            <Activity size={14} />
          </div>
        </div>

        <div className="my-2">
          <div className="text-3xl font-extrabold text-[#5A2007] tracking-tight">
            549.6 <span className="text-sm font-semibold text-[#8A3714]/80">eps</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F5C7B3]/60">
          <span className="font-semibold text-[#8A3714]">
            {summary.eventsCollected.totalCount} in queue
          </span>
          <span className="text-[#A15839] font-medium">Simulated: 15m</span>
        </div>
      </div>

      {/* Card 3: PRIVACY PROCESSED (Pastel Light Blue - Simulated JEV) */}
      <div className="group bg-[#D9EEFF] rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md border border-sky-100/50 hover:border-sky-300/60 cursor-default">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-[#145388] uppercase">
            Privacy Processed
          </span>
          <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center text-[#2065A8] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-2xs">
            <Shield size={14} />
          </div>
        </div>

        <div className="my-2">
          <div className="text-3xl font-extrabold text-[#0D385D] tracking-tight">
            100% <span className="text-xs font-semibold text-[#145388]/80">JEV Strict</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#BEDDF7]/60">
          <span className="font-semibold text-emerald-800">
            {summary.privacyProcessed.redacted} Redacted
          </span>
          <span className="text-rose-700 font-semibold">
            {summary.privacyProcessed.blocked} Blocked
          </span>
        </div>
      </div>

      {/* Card 4: OUTBOUND QUEUE (Pastel Mint - Real Buffer) */}
      <div className="group bg-[#DCF5E7] rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md border border-emerald-100/50 hover:border-emerald-300/60 cursor-default">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-[#165A36] uppercase">
            Outbound Queue
          </span>
          <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center text-[#1E6F43] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-3 shadow-2xs">
            <Layers size={14} />
          </div>
        </div>

        <div className="my-2">
          <div className="text-3xl font-extrabold text-[#0E3E24] tracking-tight">
            {summary.outboundQueue.pending} <span className="text-sm font-semibold text-[#165A36]/80">buffered</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#BFE6CF]/60">
          <span className="font-semibold text-amber-800">
            {summary.outboundQueue.retryCount} Retries
          </span>
          <span className="text-[#32704E] font-medium">
            {summary.outboundQueue.failed} Failed
          </span>
        </div>
      </div>

      {/* Card 5: DELIVERY SUCCESS (Pastel Amber - Actual Network Delivery) */}
      <div className="group bg-[#FEF3D6] rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md border border-amber-100/50 hover:border-amber-300/60 cursor-default">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-[#7A560E] uppercase">
            Delivery Success
          </span>
          <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center text-[#8F6612] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-2xs">
            <CheckCircle2 size={14} />
          </div>
        </div>

        <div className="my-2">
          <div className="text-3xl font-extrabold text-[#523A06] tracking-tight">
            {summary.deliverySuccess.acknowledgedCount > 0
              ? `${summary.deliverySuccess.acknowledgedCount} ACK`
              : '0 / 0'}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F5E2B0]/60">
          <span
            className={`font-semibold ${
              summary.connectionStatus.pc2EndpointStatus === 'connected' ? 'text-emerald-800' : 'text-stone-500'
            }`}
          >
            {summary.connectionStatus.pc2EndpointStatus === 'connected' ? 'PC 2 Online' : 'PC 2 Standby'}
          </span>
          <span className="text-[#7A560E]/80 font-medium">Real POST</span>
        </div>
      </div>

      {/* Card 6: LAST ACK (Pastel Rose - Cryptographic Evidence) */}
      <div className="group bg-[#FDE2E4] rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md border border-rose-100/50 hover:border-rose-300/60 cursor-default">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-[#8A1F3D] uppercase">
            Last ACK
          </span>
          <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center text-[#A6274D] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-3 shadow-2xs">
            <Clock size={14} />
          </div>
        </div>

        <div className="my-2">
          <div className="text-sm font-bold font-mono text-[#541224] truncate">
            {summary.lastAcknowledgement.receiptId || 'None'}
          </div>
          <div className="text-[11px] text-[#8A1F3D]/80 font-medium mt-0.5 truncate">
            {summary.lastAcknowledgement.timestamp
              ? new Date(summary.lastAcknowledgement.timestamp).toLocaleTimeString()
              : 'Awaiting receipt'}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F5C4CB]/60">
          <span className="font-semibold text-[#8A1F3D]">
            {summary.lastAcknowledgement.receiptId ? 'Verified' : 'No ACK'}
          </span>
          <span className="text-[#8A1F3D]/70 font-mono text-[10px]">SHA-256</span>
        </div>
      </div>
    </div>
  );
};

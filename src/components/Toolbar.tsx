import React from 'react';
import { Columns, Table, Search, SlidersHorizontal, Send, RefreshCw } from './Icons';
import { PrivacyOutcome, EventSeverity } from '../types/pc1';

export type ViewMode = 'board' | 'list';

interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
  selectedSeverity: string;
  onSeverityChange: (sev: string) => void;
  selectedOutcome: string;
  onOutcomeChange: (outcome: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onSendBatch: () => void;
  isSendingBatch: boolean;
  totalFilteredCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  selectedSource,
  onSourceChange,
  selectedSeverity,
  onSeverityChange,
  selectedOutcome,
  onOutcomeChange,
  sortBy,
  onSortByChange,
  onSendBatch,
  isSendingBatch,
  totalFilteredCount,
}) => {
  return (
    <div className="bg-white rounded-2xl p-3 mb-5 border border-[#E8E5DF] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Left side: View switcher & Search */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Board / List View Switcher Pills */}
        <div className="flex items-center bg-[#F2EFE9] p-1 rounded-xl border border-[#E8E5DF]/70">
          <button
            onClick={() => onViewModeChange('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'board'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#EAE6DF]'
            }`}
          >
            <Columns size={14} />
            <span>Board</span>
          </button>

          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#EAE6DF]'
            }`}
          >
            <Table size={14} />
            <span>List</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events, payloads, sources..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F9F8F5] border border-[#E8E5DF] rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Counter Pill */}
        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          Showing <span className="font-bold text-stone-800">{totalFilteredCount}</span> items
        </span>
      </div>

      {/* Right side: Filters & Sort */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Source Filter */}
        <select
          value={selectedSource}
          onChange={(e) => onSourceChange(e.target.value)}
          className="bg-[#F9F8F5] border border-[#E8E5DF] text-stone-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
        >
          <option value="all">All Sources (6)</option>
          <option value="srv-web-01">srv-web-01 (Web)</option>
          <option value="srv-app-01">srv-app-01 (App)</option>
          <option value="srv-db-01">srv-db-01 (DB)</option>
          <option value="auth-service">auth-service (SSO)</option>
          <option value="payment-service">payment-service (PCI)</option>
          <option value="network-gateway">network-gateway (BPF)</option>
        </select>

        {/* Privacy Outcome Filter */}
        <select
          value={selectedOutcome}
          onChange={(e) => onOutcomeChange(e.target.value)}
          className="bg-[#F9F8F5] border border-[#E8E5DF] text-stone-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
        >
          <option value="all">All Privacy Outcomes</option>
          <option value="ALLOWED">ALLOWED (Clean)</option>
          <option value="REDACTED">REDACTED (Scrubbed)</option>
          <option value="PSEUDONYMIZED">PSEUDONYMIZED (HMAC)</option>
          <option value="DROPPED">DROPPED (PII Removed)</option>
          <option value="REJECTED">REJECTED (Blocked)</option>
        </select>

        {/* Severity Filter */}
        <select
          value={selectedSeverity}
          onChange={(e) => onSeverityChange(e.target.value)}
          className="bg-[#F9F8F5] border border-[#E8E5DF] text-stone-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
        >
          <option value="all">All Severities</option>
          <option value="info">Info</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        {/* Sort Filter */}
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="bg-[#F9F8F5] border border-[#E8E5DF] text-stone-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="severity">Severity (High to Low)</option>
          <option value="size">Payload Size</option>
        </select>

        {/* Batch Send Action */}
        <button
          onClick={onSendBatch}
          disabled={isSendingBatch}
          className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send all approved payloads in queue to PC 2"
        >
          <Send size={13} className={isSendingBatch ? 'animate-spin' : 'transition-transform duration-150 group-hover:translate-x-0.5'} />
          <span>{isSendingBatch ? 'Transmitting to PC 2...' : 'Send Approved Batch'}</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ShieldCheck,
  Server,
  Cpu,
  Shield,
  Layers,
  FileCode,
  Activity,
  Settings,
  ChevronRight,
  Network,
  Zap,
} from './Icons';

export type NavTab =
  | 'overview'
  | 'sources'
  | 'collector'
  | 'privacy'
  | 'queue'
  | 'egress'
  | 'activity'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  sourcesCount: number;
  queueCount: number;
  egressCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  sourcesCount,
  queueCount,
  egressCount,
}) => {
  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: <ShieldCheck size={18} /> },
    { id: 'sources', label: 'Sources', icon: <Server size={18} />, badge: sourcesCount },
    { id: 'collector', label: 'Collector', icon: <Cpu size={18} /> },
    { id: 'privacy', label: 'Privacy & Policy', icon: <Shield size={18} />, badge: 'JEV' },
    {
      id: 'queue',
      label: 'Outbound Queue',
      icon: <Layers size={18} />,
      badge: queueCount,
      badgeColor: queueCount > 0 ? 'bg-amber-100 text-amber-800' : undefined,
    },
    { id: 'egress', label: 'Egress Proof', icon: <FileCode size={18} />, badge: egressCount },
    { id: 'activity', label: 'Activity', icon: <Activity size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between bg-[#F2EFE9] border-r border-[#E8E5DF] transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      } min-h-screen`}
    >
      {/* Top Header / Brand */}
      <div>
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#E8E5DF]/70">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs tracking-wider">
                L
              </div>
              <div>
                <span className="font-extrabold text-base text-[#22201D] tracking-tight">LARP.it</span>
                <span className="text-[10px] block text-stone-500 font-medium -mt-1 uppercase tracking-wider">
                  Privacy Gateway
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              L
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-[#E8E5DF] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* Section Label */}
        {!isCollapsed && (
          <div className="px-4 pt-4 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Customer Boundary (PC 1)
            </span>
          </div>
        )}

        {/* Navigation List */}
        <nav className="px-2 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-180 ease-out ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-[#EAE6DF]'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={`transition-transform duration-200 ease-out group-hover:translate-x-0.5 ${isActive ? 'text-indigo-600' : 'text-stone-500'}`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-transform duration-150 group-hover:scale-105 ${
                      item.badgeColor || 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Gateway Status & Latency Ruler */}
      <div className="p-3 border-t border-[#E8E5DF] bg-[#ECE9E2]/60">
        {!isCollapsed ? (
          <div className="space-y-2.5">
            {/* Tenant Identity */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-[#E8E5DF]/60 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Active Tenant
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </div>
              <div className="text-xs font-bold text-stone-800 mt-0.5 truncate">
                Enterprise Production
              </div>
              <div className="text-[10px] text-stone-500 truncate">
                Tenant ID: enterprise-prod
              </div>
            </div>

            {/* Gateway Status & Latency Budget */}
            <div className="flex items-center justify-between text-xs text-stone-600 px-1">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Zap size={13} className="text-indigo-600" />
                <span>Latency Budget</span>
              </span>
              <span className="font-semibold text-emerald-700 text-[11px]">0.85ms &lt; 10s</span>
            </div>

            {/* Ingestion Trust Mode */}
            <div className="text-[10px] text-stone-400 px-1 flex items-center justify-between">
              <span>Trust Mode:</span>
              <span className="font-semibold text-stone-600">Strict JEV</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <span
              className="w-2.5 h-2.5 rounded-full bg-emerald-500"
              title="Enterprise Production Gateway Active"
            />
          </div>
        )}
      </div>
    </aside>
  );
};

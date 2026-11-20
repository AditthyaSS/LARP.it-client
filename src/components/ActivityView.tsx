import React, { useState } from 'react';
import { ActivityItem } from '../types/pc1';
import { Activity, Clock, Search, Filter, ShieldCheck, ShieldAlert, Send, Server, Cpu, Layers } from './Icons';

interface ActivityViewProps {
  activities: ActivityItem[];
}

export const ActivityView: React.FC<ActivityViewProps> = ({ activities }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filtered = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.entityId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || act.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getActivityIcon = (type: ActivityItem['type'], severity: ActivityItem['severity']) => {
    switch (type) {
      case 'collector_started':
      case 'collector_stopped':
        return <Cpu size={14} className="text-indigo-600" />;
      case 'source_connected':
      case 'source_disconnected':
        return <Server size={14} className="text-stone-600" />;
      case 'payload_blocked':
        return <ShieldAlert size={14} className="text-rose-600" />;
      case 'payload_approved':
      case 'privacy_policy_executed':
        return <ShieldCheck size={14} className="text-emerald-600" />;
      case 'transmission_attempted':
      case 'payload_acknowledged':
        return <Send size={14} className="text-blue-600" />;
      default:
        return <Activity size={14} className="text-stone-500" />;
    }
  };

  const getSeverityBadge = (sev: ActivityItem['severity']) => {
    switch (sev) {
      case 'success':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'error':
        return 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Activity size={20} className="text-indigo-600" />
            <span>Customer Gateway Activity Feed</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time audit log of local telemetry events, JEV privacy policy enforcement, and egress transmissions.
          </p>
        </div>

        <span className="text-xs text-stone-500 font-medium bg-[#FBF9F5] px-3 py-1.5 rounded-xl border border-stone-200 self-start md:self-auto">
          {activities.length} Recorded Events
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-3 border border-[#E8E5DF] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity by title, entity, or keyword..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F9F8F5] border border-[#E8E5DF] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#F9F8F5] border border-[#E8E5DF] text-stone-700 text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error / Blocked</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E5DF] shadow-xs">
        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          {filtered.length === 0 ? (
            <div className="text-xs text-stone-400 py-6 text-center">
              No activity logs match the search query.
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[27px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center group-hover:border-indigo-600 transition-colors shadow-2xs">
                  {getActivityIcon(item.type, item.severity)}
                </div>

                {/* Event Card */}
                <div className="bg-[#FBF9F5] p-3.5 rounded-xl border border-stone-200/80 hover:border-indigo-200 transition-colors space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadge(item.severity)}`}>
                        {item.severity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-stone-400 font-medium">
                      <Clock size={12} />
                      <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-200/50">
                    <span className="font-mono text-[10px]">Entity: <strong className="text-stone-700">{item.entityId}</strong></span>
                    <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-500 font-mono">
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

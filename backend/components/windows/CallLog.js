"use client";

import { Wrench, Shield, FirstAidKit, HelpCircle, AlertTriangle } from "lucide-react";

const CATEGORY_ICON = {
  MAINTENANCE: Wrench,
  SAFETY: Shield,
  MEDICAL: FirstAidKit,
  OTHER: HelpCircle,
};

const PRIORITY_COLOR = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

function CallLogItem({ incident, selected, onSelect }) {
  const Icon = CATEGORY_ICON[incident.category] || HelpCircle;
  const priClass = PRIORITY_COLOR[incident.priority] || "text-yellow-400";

  return (
    <button
      onClick={() => onSelect(incident.id)}
      className={`w-full flex items-start gap-2 py-2 px-3 rounded text-left text-xs hover:bg-slate-900/70 transition-colors ${
        selected ? "bg-slate-900/80" : ""
      }`}
    >
      <Icon className="w-4 h-4 mt-[2px] text-slate-300 shrink-0" strokeWidth={1} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="uppercase tracking-wide text-[0.65rem] text-slate-400">
            {incident.category.toLowerCase()}
          </p>
          <span className={`flex items-center gap-1 ${priClass}`}>
            <AlertTriangle className="w-3 h-3" strokeWidth={1} />
            <span className="uppercase text-[0.6rem]">{incident.priority}</span>
          </span>
        </div>
        <p className="mt-1 text-[0.7rem] text-slate-100 line-clamp-1">
          {incident.title}
        </p>
        <p className="mt-0.5 text-[0.6rem] text-slate-500">
          {incident.timeAgo} • {incident.location}
        </p>
        <p className="mt-0.5 text-[0.6rem] text-slate-500">
          Status: <span className="uppercase">{incident.status}</span>
        </p>
      </div>
    </button>
  );
}

function CallLog({ incidents, selectedId, onSelectIncident }) {
  return (
    <div className="flex flex-col h-full border-r border-slate-800 bg-slate-950/70">
      <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between uppercase text-[0.7rem] tracking-wide">
        <p className="text-slate-300">Call Log</p>
        <p className="text-slate-500">{incidents.length} open</p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {incidents.map((incident) => (
          <CallLogItem
            key={incident.id}
            incident={incident}
            selected={incident.id === selectedId}
            onSelect={onSelectIncident}
          />
        ))}
      </div>
    </div>
  );
}

CallLog.defaultProps = {
  incidents: [],
  selectedId: null,
  onSelectIncident: () => {},
};

export default CallLog;

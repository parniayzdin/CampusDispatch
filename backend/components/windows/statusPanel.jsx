"use client";

import {
  AlertTriangle,
  Clock,
  User,
  Activity,
  RadioTower,
  CheckCircle2,
  CircleDot,
} from "lucide-react";

function StatusPanel({ incident, events, assignedUnit }) {
  const hasIncident = !!incident;
  const timeline = events || [];

  const statusColor =
    incident?.status === "RESOLVED" || incident?.status === "CLOSED"
      ? "text-emerald-300"
      : incident?.status === "ASSIGNED" || incident?.status === "EN_ROUTE"
      ? "text-yellow-300"
      : "text-slate-300";

  const severityLabel =
    incident?.severity === 0
      ? "Info"
      : incident?.severity === 1
      ? "Low"
      : incident?.severity === 2
      ? "Medium"
      : incident?.severity === 3
      ? "High"
      : incident?.severity === 4
      ? "Critical"
      : "Unknown";

  return (
    <div className="flex flex-col h-full bg-slate-950/80 border-l border-slate-800">
      <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between uppercase text-[0.7rem] tracking-wide">
        <p className="text-slate-300 flex items-center gap-2">
          <Activity className="w-3 h-3" strokeWidth={1} />
          Status & Timeline
        </p>
        <span className="flex items-center gap-1 text-[0.65rem] text-slate-500">
          <RadioTower className="w-3 h-3" strokeWidth={1} />
          Live
        </span>
      </div>

      <div className="flex-1 flex flex-col text-[0.7rem]">
        <div className="px-4 py-3 border-b border-slate-800 space-y-2">
          {hasIncident ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="uppercase text-[0.65rem] text-slate-400">
                    Active Incident
                  </p>
                  <p className="text-slate-100 text-[0.75rem] line-clamp-2 max-w-[220px]">
                    {incident.title}
                  </p>
                  <p className="text-slate-500 text-[0.65rem]">
                    {incident.location || "Unknown location"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`uppercase text-[0.6rem] ${statusColor}`}>
                    {incident.status || "OPEN"}
                  </span>
                  <span className="flex items-center gap-1 text-[0.6rem] text-slate-400">
                    <AlertTriangle className="w-3 h-3" strokeWidth={1} />
                    {severityLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 text-[0.65rem]">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3 h-3" strokeWidth={1} />
                  <span>
                    Opened{" "}
                    {incident.timeAgo || "just now"}
                  </span>
                </div>
                {assignedUnit && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <User className="w-3 h-3" strokeWidth={1} />
                    <span>{assignedUnit.label}</span>
                  </div>
                )}
              </div>
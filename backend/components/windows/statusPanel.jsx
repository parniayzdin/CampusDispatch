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

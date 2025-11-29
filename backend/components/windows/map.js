"use client";

import { MapPin, Crosshair, Navigation2, RadioTower } from "lucide-react";

function MapPanel({ incidents, units, selectedIncidentId }) {
  const selectedIncident =
    incidents.find((i) => i.id === selectedIncidentId) || null;

  const selectedCoords = selectedIncident?.coords || null;
  const selectedZone = selectedIncident?.zone || "Campus Core";

  const activeUnits = units || [];

  return (
    <div className="flex flex-col h-full border-x border-slate-800 bg-slate-950/60">
      <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between uppercase text-[0.7rem] tracking-wide">
        <p className="text-slate-300 flex items-center gap-2">
          <MapPin className="w-3 h-3" strokeWidth={1} />
          Campus Map
        </p>
        <div className="flex items-center gap-3 text-slate-500">
          <span className="flex items-center gap-1">
            <Crosshair className="w-3 h-3" strokeWidth={1} />
            Auto-center
          </span>
          <span className="flex items-center gap-1">
            <Navigation2 className="w-3 h-3" strokeWidth={1} />
            Live
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[3fr,2fr]">
        <div className="relative border-r border-slate-800 bg-slate-900/70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(148,163,184,0.12),_transparent_55%)] pointer-events-none" />
          <div className="absolute inset-4 border border-dashed border-slate-700/60 rounded-md" />

          <div className="absolute top-3 left-3 text-[0.6rem] text-slate-400 uppercase">
            {selectedZone}
          </div>

          <div className="absolute bottom-3 left-3 text-[0.6rem] text-slate-400 flex flex-col gap-1">
            <span>
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
              Lat:{" "}
              {selectedCoords
                ? selectedCoords.lat.toFixed(5)
                : "43.26xx"}
            </span>
            <span>
              Lon:{" "}
              {selectedCoords
                ? selectedCoords.lon.toFixed(5)
                : "-79.92xx"}
            </span>
            <span>Zoom: 16.2</span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[0.6rem] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              Unit
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
              Incident
            </span>
          </div>

          {selectedIncident && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full border border-sky-400/70 bg-sky-400/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-sky-200" strokeWidth={1} />
              </div>
              <p className="mt-1 text-[0.6rem] text-slate-200 text-center max-w-[140px] line-clamp-2">
                {selectedIncident.title}
              </p>
            </div>
          )}

          {activeUnits.slice(0, 3).map((u, idx) => (
            <div
              key={u.id}
              className={`absolute px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/50 text-[0.6rem] text-emerald-100 flex items-center gap-1 ${
                idx === 0
                  ? "top-10 right-10"
                  : idx === 1
                  ? "bottom-16 left-16"
                  : "top-20 left-12"
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span>{u.label}</span>
            </div>
          ))}
        </div>
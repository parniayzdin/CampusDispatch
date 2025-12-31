"use client";

import React, { useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import Map from "react-map-gl";
import maplibregl from "maplibre-gl";

export default function IncidentHeatmap({ incidents = [] }) {
  const layers = useMemo(() => {
    return [
      new HeatmapLayer({
        id: "heatmap",
        data: incidents,
        getPosition: (d) => [d.lng, d.lat],
        getWeight: (d) => {
          const minutesOld = (Date.now() - new Date(d.updatedAt).getTime()) / 60000;
          const recency = Math.max(0, 1 - minutesOld / 60); // fades to 0 after 60 min
          const priority = d.priority ?? 1;
          return priority * recency;
        },
        radiusPixels: 50,
      }),
    ];
  }, [incidents]);

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <DeckGL
        initialViewState={{
          longitude: -79.3832,
          latitude: 43.6532,
          zoom: 11,
        }}
        controller={true}
        layers={layers}
      >
        <Map
          mapLib={maplibregl}
          mapStyle="https://demotiles.maplibre.org/style.json"
        />
      </DeckGL>
    </div>
  );
}

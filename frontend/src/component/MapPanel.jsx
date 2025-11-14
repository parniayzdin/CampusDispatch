import React from 'react'

/* placeholder “map”. you’ll swap in Leaflet/Mapbox later */
export default function MapPanel({ markerTitle, markerBody, markerTime }) {
  return (
    <div className="map-wrap">
      <div className="fake-tiles" />
      <div className="marker" />
      <div className="bubble">
        <div className="bubble-title">{markerTitle}<span className="badge active">ACTIVE</span></div>
        <div className="bubble-body">{markerBody}</div>
        <div className="bubble-time">{markerTime}</div>
      </div>
    </div>
  )
}

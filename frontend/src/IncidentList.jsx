import React from 'react'

export default function IncidentList({ incidents }) {
  if (!incidents.length) return <p>No active incidents (yet)</p>

  return (
    <ul>
      {incidents.map((i) => (
        <li key={i.id}>
          <b>{i.title}</b> — {i.status} @ {i.location_text}
        </li>
      ))}
    </ul>
  )
}

// NOTE: maybe add severity colors later? red/yellow/green ??

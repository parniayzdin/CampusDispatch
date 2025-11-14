import React from 'react'

export default function CallLogPanel({ calls = [] }) {
  return (
    <ul className="calllog-list">
      {calls.map(c => (
        <li key={c.id} className="calllog-item">
          <div className="icon small">{/* todo: icon per type */}</div>
          <div className="meta">
            <div className="row">
              <span className="type">{c.type}</span>
              <span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span>
            </div>
            <div className="row row--sub">
              <span className="muted">#{c.id}</span>
              <span className="muted">{c.time}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

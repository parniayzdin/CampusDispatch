import React from 'react'
//Not done yet, need to add more features for the status table
export default function StatusTable({ rows = [] }) {
  return (
    <div className="table">
      <div className="thead">
        <span>ID</span><span>PRIO</span><span>TYPE</span><span>TIME</span><span>ADDRESS</span><span>RESPONSE TYPE</span><span>RESPONSE STATUS</span><span>STATUS</span>
      </div>
      {rows.map(r => (
        <div className="trow" key={r.id}>
          <span className="muted">#{r.id}</span>
          <span><span className="chip chip--high">{r.prio}</span></span>
          <span>{r.type}</span>
          <span>{r.time}</span>
          <span className="ellipsis">{r.address}</span>
          <span>{r.resp}</span>
          <span>{r.respStatus}</span>
          <span><span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span></span>
        </div>
      ))}
    </div>
  )
}

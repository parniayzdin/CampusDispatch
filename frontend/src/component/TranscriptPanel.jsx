import React from 'react'

export default function TranscriptPanel({ lines = [] }) {
  return (
    <div className="transcript-wrap">
      {lines.map((l, i) => (
        <div key={i} className="line">
          <div className="who">{l.who}</div>
          <div className="text">{l.text}</div>
          <div className="ts">[{l.ts}]</div>
        </div>
      ))}
    </div>
  )
}

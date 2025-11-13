import React from 'react'
import './styles.css'
import CallLogPanel from './components/CallLogPanel'
import MapPanel from './components/MapPanel'
import TranscriptPanel from './components/TranscriptPanel'
import CallInfoPanel from './components/CallInfoPanel'
import StatusTable from './components/StatusTable'

export default function App() {
  // super quick sample payloads; replace with real data later
  const calls = [
    { id: 161, type: 'Police', status: 'ACTIVE', time: '11:35:36' },
    { id: 153, type: 'Violence', status: 'ACTIVE', time: '11:23:14' },
    { id: 150, type: 'Fire', status: 'ACTIVE', time: '11:17:24' },
    { id: 149, type: 'Medical', status: 'ACTIVE', time: '11:12:49' },
  ]

  const transcript = [
    { who: 'CALLER', text: 'Hello', ts: '11:35:39' },
    { who: 'CALLER', text: 'hi my name is David', ts: '11:35:41' },
    { who: 'CALLER', text: 'witnessed a robbery at Park Ave & E. 42nd', ts: '11:35:44' },
    { who: 'CALLER', text: 'saw five guys', ts: '11:35:49' },
  ]

  const statusRows = [
    { id: 161, prio: 'High', type: 'Police', time: '11:35:36', address: 'Park Ave & E. 42nd St.', resp: 'Police', respStatus: 'Dispatched', status: 'ACTIVE' },
    { id: 154, prio: 'High', type: 'Police', time: '11:23:14', address: 'Times Square, New York', resp: 'Police', respStatus: 'Dispatched', status: 'ACTIVE' },
    { id: 152, prio: 'Med',  type: 'Medical', time: '11:12:58', address: 'HWY 403, Mississauga', resp: 'Medical', respStatus: 'Dispatched', status: 'ACTIVE' },
  ]

  return (
    <div className="shell">
      {/* top content row */}
      <div className="top-grid">
        <aside className="panel calllog">
          <div className="panel-header">
            <span>CALL LOG</span>
            <span className="dot dot--ok" />
          </div>
          <CallLogPanel calls={calls} />
        </aside>

        <main className="panel map">
          <MapPanel
            markerTitle="#161 · Police"
            markerBody="Five individuals exited a van, entered a store, stole five laptops, returned to van. No injuries reported."
            markerTime="2025-12-05 11:35:36"
          />
        </main>

        <section className="right-col">
          <div className="panel transcript">
            <div className="panel-header">
              <span>TRANSCRIPT</span>
              <span className="dot dot--ok" />
            </div>
            <TranscriptPanel lines={transcript} />
          </div>

          <div className="panel callinfo">
            <div className="panel-header">
              <span>BRAVO — #161</span>
              <span className="dot dot--ok" />
            </div>
            <CallInfoPanel />
          </div>
        </section>
      </div>

      {/* bottom status table */}
      <div className="panel statusbar">
        <StatusTable rows={statusRows} />
      </div>
    </div>
  )
}

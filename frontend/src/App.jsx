import React, { useEffect, useState } from 'react'
import IncidentList from './components/IncidentList'
import { getOpenIncidents } from './api'

function App() {
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    getOpenIncidents()
      .then(setIncidents)
      .catch((err) => console.error('API fetch failed:', err))
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Campus Dispatch Dashboard</h1>
      <p>// TODO: Add filters and unit info later</p>
      <IncidentList incidents={incidents} />
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import './App.css'

interface Trial {
  id: number
  name: string
  location: string
}

//https://clinicaltrials.gov/api/v2/studies

async function getClinicalTrials(): Promise<Trial[]> {
  //url for api endpoint
  const url =  "https://clinicaltrials.gov/api/v2/studies?fields=NCTId,BriefTitle,OverallStatus,Condition&format=json&pageSize=100"
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    // Get first 5 studies and map to Trial format
    const trials: Trial[] = data.studies.slice(0, 5).map((study: any) => ({
      id: study.protocolSection?.identificationModule?.nctId || '',
      name: study.protocolSection?.identificationModule?.briefTitle || 'Unknown Trial',
      location: study.protocolSection?.contactsLocationsModule?.locations?.[0]?.city || 'Location TBD',
    }))
    
    return trials
  } catch (error) {
    console.error('Error fetching trials:', error)
    return []
  }
}

function TrialsList() {
  const [trials, setTrials] = useState<Trial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClinicalTrials().then((data) => {
      setTrials(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="trials-list-container"><p>Loading trials...</p></div>
  }

  return (
    <div className="trials-list-container">
      <h2>Available Clinical Trials</h2>
      <ul className="trials-list">
        {trials.map((trial) => (
          <li key={trial.id} className="trial-item">
            <p className="trial-name">{trial.name}</p>
            <p className="trial-location">{trial.location}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  const [showTrials, setShowTrials] = useState(false)

  return (
    <div className="search-container">
      <h1>Testicular Cancer Trial Search</h1>
      <p className="sort-sentence">Find clinical trials focused on testicular cancer care and research.</p>
      <button className="submit-button" onClick={() => setShowTrials(!showTrials)}>
        Find Trials Near Me
      </button>
      {showTrials && <TrialsList />}
    </div>
  )
}

export default App
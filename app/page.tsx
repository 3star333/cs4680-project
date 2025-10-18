/**
How to run:
1) npm i
2) npm run dev
3) set OPENAI_API_KEY to enable real calls (optional)

This page is the single-page app for the StadiumOW Optimizer MVP.
*/

import React from 'react'
import CompsPicker from '../components/CompsPicker'
import CurrentBuysEditor from '../components/CurrentBuysEditor'
import Select from '../components/ui/Select'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Results from '../components/Results'
import type { Plan } from '../lib/schema'

export default function Page() {
  const [mapPhase, setMapPhase] = React.useState('King\'s Row A Defense')
  const [allies, setAllies] = React.useState<string[]>(['Cassidy', 'Sojourn', 'Kiriko', 'Reinhardt', 'Zarya'])
  const [enemies, setEnemies] = React.useState<string[]>(['Genji', 'Winston', 'Roadhog', 'Brigitte', 'Baptiste'])
  const [budget, setBudget] = React.useState<number>(400)
  const [currentBuys, setCurrentBuys] = React.useState<Record<string, string[]>>({})
  const [goal, setGoal] = React.useState('burst')

  const [plan, setPlan] = React.useState<Plan | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function generate() {
    setError(null)
    setLoading(true)
    setPlan(null)
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapPhase, allies, enemies, budget, currentBuys, goal }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(JSON.stringify(data))
      } else {
        setPlan(data)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = allies.length === 5 && enemies.length === 5

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <aside className="md:col-span-1 space-y-4">
        <div className="hl">
          <label className="block text-sm">Map / Phase</label>
          <Select value={mapPhase} onChange={e => setMapPhase(e.currentTarget.value)}>
            <option>King's Row A Defense</option>
            <option>Gibraltar A Defense</option>
          </Select>
        </div>

        <div className="hl">
          <CompsPicker label="Allies" value={allies} onChange={setAllies} />
        </div>

        <div className="hl">
          <CompsPicker label="Enemies" value={enemies} onChange={setEnemies} />
        </div>

        <div className="hl">
          <label className="block text-sm">Budget</label>
          <Input type="number" value={String(budget)} onChange={e => setBudget(Number(e.target.value))} />
        </div>

        <div className="hl">
          <label className="block text-sm">Goal</label>
          <Select value={goal} onChange={e => setGoal(e.currentTarget.value)}>
            <option value="burst">burst</option>
            <option value="sustain">sustain</option>
            <option value="anti-dive">anti-dive</option>
            <option value="poke">poke</option>
          </Select>
        </div>

        <div className="hl">
          <CurrentBuysEditor allies={allies} value={currentBuys} onChange={setCurrentBuys} />
        </div>

        <div className="hl">
          <Button onClick={generate} disabled={!canGenerate || loading}>{loading ? 'Generating...' : 'Generate Plan'}</Button>
          {!canGenerate && <div className="text-xs text-red-500 mt-2">Allies and Enemies must be 5 each.</div>}
        </div>
      </aside>

      <section className="md:col-span-2">
        {loading && <div className="hl mb-4">Loading plan…</div>}
        {error && <div className="hl mb-4 text-red-600">Error: {error}</div>}
        <Results plan={plan} />
      </section>
    </div>
  )
}

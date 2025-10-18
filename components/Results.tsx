import React from 'react'
import Card from './ui/Card'
import { planToMarkdown } from '../lib/markdown'
import type { Plan } from '../lib/schema'

export default function Results({ plan }: { plan: Plan | null }) {
  const [copied, setCopied] = React.useState(false)
  if (!plan) return <div className="text-gray-600">No plan yet. Generate to see recommendations.</div>

  const md = planToMarkdown(plan)

  function copy() {
    navigator.clipboard.writeText(md).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  function download() {
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plan.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">{plan.team_plan.theme}</h2>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
              {plan.team_plan.notes.map((n: string, i: number) => <li key={i}>{n}</li>)}
            </ul>
          </div>
          <div className="space-x-2">
            <button onClick={copy} className="px-3 py-1 bg-gray-200 rounded">{copied ? 'Copied' : 'Copy as Markdown'}</button>
            <button onClick={download} className="px-3 py-1 bg-gray-200 rounded">Download .md</button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plan.heroes.map((h: { hero: string; buy_order: string[]; sell?: string[]; why: string[]; next_round?: string[] }) => (
          <React.Fragment key={h.hero}>
            <Card>
            <div className="font-semibold">{h.hero}</div>
            <div className="text-sm mt-2"><strong>Buy:</strong> {h.buy_order.join(', ')}</div>
            {h.sell && h.sell.length ? <div className="text-sm mt-1"><strong>Sell:</strong> {h.sell.join(', ')}</div> : null}
            <div className="text-sm mt-2"><strong>Why:</strong>
              <ul className="list-disc list-inside">{h.why.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul>
            </div>
            {h.next_round && h.next_round.length ? <div className="text-sm mt-2"><strong>Next:</strong> {h.next_round.join(', ')}</div> : null}
            </Card>
          </React.Fragment>
        ))}
      </div>

      {plan.swap_suggestions && plan.swap_suggestions.length ? (
        <Card>
          <h3 className="font-semibold">Swap Suggestions</h3>
          <ul className="list-disc list-inside mt-2 text-sm">{plan.swap_suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </Card>
      ) : null}

      {plan.top_focus && plan.top_focus.length ? (
        <Card>
          <h3 className="font-semibold">Top Focus</h3>
          <ol className="list-decimal list-inside mt-2 text-sm">{plan.top_focus.map((t, i) => <li key={i}>{t}</li>)}</ol>
        </Card>
      ) : null}
    </div>
  )
}

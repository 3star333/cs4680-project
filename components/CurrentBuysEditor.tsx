import React from 'react'
import Input from './ui/Input'

export default function CurrentBuysEditor({ allies, value, onChange }: { allies: string[]; value: Record<string, string[]>; onChange: (v: Record<string, string[]>) => void }) {
  function add(ally: string, item: string) {
    const t = item.trim()
    if (!t) return
    const cur = value[ally] || []
    onChange({ ...value, [ally]: [...cur, t] })
  }

  return (
    <div>
      <label className="block text-sm text-gray-700">Current Buys</label>
      <div className="mt-2 space-y-3">
        {allies.map(a => (
          <div key={a} className="bg-white p-2 rounded shadow-sm">
            <div className="text-sm font-medium">{a}</div>
            <div className="flex gap-2 mt-2">
              <Input placeholder="Add buy (e.g., Nano-Injector)" className="flex-1" onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') { add(a, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = '' }
              }} />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {(value[a] || []).map((it, idx) => (
                <button key={idx} onClick={() => onChange({ ...value, [a]: (value[a] || []).filter((_, i) => i !== idx) })} className="mr-2 px-2 py-0.5 bg-gray-100 rounded">{it}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

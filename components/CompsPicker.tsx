import React from 'react'
import Input from './ui/Input'
import Chip from './ui/Chip'

export default function CompsPicker({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = React.useState<string>('')

  function add() {
    const t = text.trim()
    if (!t) return
    if (value.length >= 5) return
    onChange([...value, t])
    setText('')
  }

  return (
    <div>
      <label className="block text-sm text-gray-700">{label}</label>
      <div className="flex flex-wrap mt-2">
        {value.map((v, i) => (
          <Chip key={i} onClick={() => onChange(value.filter((_, idx) => idx !== i))}>{v}</Chip>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
  <Input value={text} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)} placeholder="Type hero and press Add" />
        <button type="button" onClick={add} className="px-3 py-1 bg-gray-800 text-white rounded">Add</button>
      </div>
    </div>
  )
}

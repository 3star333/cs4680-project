"use client"
import React from 'react'
import { useStadiumStore } from '../../store/stadium'
import StadiumImage from './StadiumImage'

function SlotView({ team, index, slot }: any) {
  const setFocused = useStadiumStore((s: any) => s.setFocused)
  const setHero = useStadiumStore((s: any) => s.setHero)
  const swap = useStadiumStore((s: any) => s.swapWithinTeam)
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ team, index }))
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    try {
      const payload = JSON.parse(e.dataTransfer.getData('application/json'))
      if (payload && payload.team === team && typeof payload.index === 'number') {
        const from = payload.index as number
        const to = index
        if (from !== to) swap(team, from, to)
      }
    } catch (err) {
      // ignore
    }
  }

  const slotDragId = `slot:${team}:${index}`
  return (
    <div id={slotDragId} draggable onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} className="p-2 bg-gradient-to-br from-gray-800/60 to-gray-900/50 rounded-md border border-gray-700 flex items-center space-x-3 hover:shadow-lg">
      <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-md overflow-hidden">
        {slot.hero ? <StadiumImage filename={`${slot.hero}_Stadium.png`} alt={slot.hero} className="w-12 h-12 object-cover" placeholderClassName="w-12 h-12 bg-gray-700" /> : <div className="w-10 h-10 bg-gray-600 rounded" />}
      </div>
      <div className="flex-1 text-sm">
        <div className="font-medium text-white">{slot.hero || '—'}</div>
        <div className="text-xs text-gray-300">{(slot.powers||[]).slice(0,3).join(', ')}</div>
      </div>
      <div className="flex flex-col space-y-2">
        <button onClick={() => setFocused(team, index)} className="text-xs px-2 py-1 bg-indigo-600 text-white rounded">Edit</button>
        <div className="flex space-x-1">
          <button onClick={() => swap(team, Math.max(0, index-1), index)} className="text-xs px-2 py-1 bg-gray-700 text-white rounded">↑</button>
          <button onClick={() => swap(team, index, Math.min(4, index+1))} className="text-xs px-2 py-1 bg-gray-700 text-white rounded">↓</button>
        </div>
      </div>
    </div>
  )
}

export default function TeamPanel() {
  const allies = useStadiumStore((s: any) => s.team.allies)
  const enemies = useStadiumStore((s: any) => s.team.enemies)

  return (
    <div className="p-2 grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold text-white">Allies</h4>
        <div className="space-y-3 mt-3">
          {allies.map((slot:any, i:number) => <SlotView key={i} team="allies" index={i} slot={slot} />)}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-white">Enemies</h4>
        <div className="space-y-3 mt-3">
          {enemies.map((slot:any, i:number) => <SlotView key={i} team="enemies" index={i} slot={slot} />)}
        </div>
      </div>
    </div>
  )
}

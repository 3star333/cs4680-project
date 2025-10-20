"use client"
import React from 'react'
import { useStadiumStore } from '../../store/stadium'
import { getStadiumHeroes } from '../../lib/stadium'
import type { StadiumHero } from '../../types/stadium'

export default function PowersSelect() {
  const focusedTeam = useStadiumStore((s: any) => s.focusedTeam)
  const focusedIndex = useStadiumStore((s: any) => s.focusedIndex)
  const setPowers = useStadiumStore((s: any) => s.setPowers)
  const team = useStadiumStore((s: any) => s.team)

  if (focusedIndex == null) return <div className="p-2 text-sm text-gray-500">Select a slot to edit powers.</div>
  const slot = team[focusedTeam][focusedIndex]
  const heroes: StadiumHero[] = getStadiumHeroes()
  const heroDef = heroes.find((h:StadiumHero) => h.slug === slot.hero)
  if (!heroDef) return <div className="p-2 text-sm text-gray-500">Assign a hero to the focused slot to edit powers.</div>

  const toggle = (name: string) => {
    const current = slot.powers || []
    if (current.includes(name)) setPowers(focusedTeam, focusedIndex, current.filter((x:string)=>x!==name))
    else setPowers(focusedTeam, focusedIndex, [...current, name])
  }

  return (
    <div className="p-2 bg-gray-900/40 rounded-md border border-gray-700">
      <h4 className="font-medium text-white">Powers — {heroDef.name}</h4>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {(heroDef.powers||[]).map((p:any) => (
          <button key={`${heroDef.slug}:${p.name}`} onClick={() => toggle(p.name)} className={`p-2 rounded text-sm ${slot.powers?.includes(p.name) ? 'bg-amber-600 text-white shadow' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}>
            {p.name}
          </button>
        ))}
      </div>
    </div>
  )
}

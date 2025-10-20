"use client"
import React from 'react'
import { getStadiumHeroes } from '../../lib/stadium'
import type { StadiumHero } from '../../types/stadium'
import HeroCard from './HeroCard'
import { useStadiumStore } from '../../store/stadium'

// helper to produce drag id for hero
const heroDragId = (slug: string) => `hero:${slug}`

export default function HeroGrid() {
  const setHero = useStadiumStore((s: any) => s.setHero)
  const focusedTeam = useStadiumStore((s: any) => s.focusedTeam)
  const focusedIndex = useStadiumStore((s: any) => s.focusedIndex)
  const team = useStadiumStore((s: any) => s.team)
  const heroes: StadiumHero[] = getStadiumHeroes()

  return (
    <div className="p-2">
      <h3 className="font-semibold text-white mb-3">Heroes</h3>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {heroes.map((h: StadiumHero) => {
          const equipped = (focusedIndex != null && team[focusedTeam] && team[focusedTeam][focusedIndex]) ? team[focusedTeam][focusedIndex].powers || [] : []
          return (
            <div key={h.slug}>
              <div draggable id={heroDragId(h.slug)}>
                <button type="button" onClick={() => { if (focusedIndex != null) setHero(focusedTeam, focusedIndex, h.slug) }} className="w-full">
                  <HeroCard hero={h} equipped={equipped} showPowers={false} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

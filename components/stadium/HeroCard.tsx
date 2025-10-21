 'use client'
import React, { useState } from 'react'
import type { StadiumHero, StadiumHeroPower } from '../../types/stadium'
import StadiumImage from './StadiumImage'

export default function HeroCard({ hero, onPowerSelect, equipped, showPowers = false }: { hero: StadiumHero, onPowerSelect?: (p: string)=>void, equipped?: string[] , showPowers?: boolean}) {
  const [selectedPower, setSelectedPower] = useState<string | null>(null)
  const portraitFilename = `${hero.name.replace(/\s+/g, '_')}_Stadium.png`
  if (!showPowers) {
    return (
      <div className="flex-shrink-0 w-full rounded-2xl bg-white/5 border border-white/10 p-2 hover:bg-white/10 transition">
        <StadiumImage filename={hero.imageFilenames?.[0] || portraitFilename} alt={hero.name} className="w-full h-24 object-cover rounded-xl" placeholderClassName="w-full h-24 bg-gray-700 rounded-xl" />
        <div className="mt-1 text-center text-xs md:text-sm font-semibold tracking-wide">{hero.name}</div>
      </div>
    )
  }
  return (
  <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg shadow-md border border-gray-700 hover:scale-[1.01] transition-transform w-full">
      <div className="flex items-center space-x-3">
        <StadiumImage filename={hero.imageFilenames?.[0] || portraitFilename} alt={hero.name} className="w-14 h-14 object-cover rounded-md ring-1 ring-black/40" placeholderClassName="w-14 h-14 bg-gray-700 rounded-md" />
        <div>
          <div className="font-semibold text-lg">{hero.name}</div>
        </div>
      </div>
      {showPowers && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {((hero.powers || []).filter((p: StadiumHeroPower)=> !equipped || equipped.includes(p.name))).map((p: StadiumHeroPower) => {
            const handleSelect = () => { setSelectedPower(p.name); onPowerSelect?.(p.name) }
            const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSelect()
              }
            }
            return (
              <div
                key={p.name}
                role="button"
                tabIndex={0}
                onClick={handleSelect}
                onKeyDown={onKeyDown}
                aria-pressed={selectedPower===p.name}
                className={`p-2 rounded bg-gray-800 border border-gray-700 cursor-pointer flex flex-col items-center justify-center transition-shadow ${selectedPower===p.name ? 'ring-2 ring-amber-400 bg-amber-900/20' : 'hover:bg-gray-700'}`}
              >
                <StadiumImage filename={p.image} alt={p.name} className="w-12 h-12 object-cover mx-auto rounded" placeholderClassName="w-12 h-12 bg-gray-700 mx-auto rounded" />
                <div className="text-xs text-center mt-1">{p.name}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

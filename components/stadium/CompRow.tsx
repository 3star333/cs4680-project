"use client"
import React from 'react'
import { useStadiumStore } from '../../store/stadium'
import { getAllItems, getHeroPortrait, getStadiumHeroes } from '../../lib/stadium'
import StadiumImage from './StadiumImage'

export default function CompRow({ type, slots = 6 }: { type: 'ally' | 'enemy', slots?: number }){
  const team = useStadiumStore((s:any)=>s.team)
  const row = team[type]
  const cells = Array.from({ length: slots }).map((_, i) => row[i] || { hero: undefined, powers: [], items: [] })
  const heroes = getStadiumHeroes()
  const items = getAllItems()

  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {cells.map((slot:any, i:number) => {
        const hero = heroes.find(h => h.slug === slot.hero)
        // Prefer first selected item icon
        let node: React.ReactNode = null
        let title = slot.hero || ''
        const firstItemSlug = slot.items?.[0]
        if (firstItemSlug) {
          const it = items.find(x => x.slug === firstItemSlug)
          const src = it?.imageFilenames?.[0]
          if (src) { node = <img src={src} alt={it?.name || 'item'} className="h-6 w-6 object-cover rounded" />; title = it?.name || title }
        }
        // Else try first selected power icon from hero dataset
        if (!node && slot.powers?.[0] && hero) {
          const powName = slot.powers[0]
          const p = (hero.powers||[]).find(x => x.name === powName)
          const filename = p?.image
          if (filename) { node = <StadiumImage filename={filename} basePath="/stadium/" alt={powName} className="h-6 w-6 object-cover rounded" placeholderClassName="h-6 w-6 bg-white/10 rounded" />; title = p?.name || title }
        }
        // Else show hero portrait if available
        if (!node && hero) {
          const portrait = hero.imageFilenames?.[0] || getHeroPortrait(hero.slug)
          if (portrait) {
            if (portrait.startsWith('/assets/')) node = <img src={portrait} alt={hero.name} className="h-6 w-6 object-cover rounded" />
            else node = <StadiumImage filename={portrait} alt={hero.name} className="h-6 w-6 object-cover rounded" />
          }
        }
        if (!node) node = <div className="h-3 w-3 bg-white/10 rounded" />
        return (
          <div key={i} className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-white/5 border border-white/10 shadow-inner flex items-center justify-center" title={title}>
            {node}
          </div>
        )
      })}
    </div>
  )
}

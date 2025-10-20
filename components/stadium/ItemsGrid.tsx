"use client"
import React from 'react'
import { getAllItems } from '../../lib/stadium'
import type { StadiumItem } from '../../types/stadium'
import { useStadiumStore } from '../../store/stadium'
import StadiumImage from './StadiumImage'

export default function ItemsGrid() {
  const focusedTeam = useStadiumStore((s: any) => s.focusedTeam)
  const focusedIndex = useStadiumStore((s: any) => s.focusedIndex)
  const setItems = useStadiumStore((s: any) => s.setItems)
  const team = useStadiumStore((s: any) => s.team)

  if (focusedIndex == null) return <div className="p-2 text-sm text-gray-500">Select a slot to edit items.</div>
  const slot = team[focusedTeam][focusedIndex]

  const allItems: StadiumItem[] = getAllItems()
  // Show global items (no heroSlug) plus hero-specific items for the selected hero
  const valid = allItems.filter((it: StadiumItem) => !slot.hero ? !it.heroSlug : (!it.heroSlug || it.heroSlug === slot.hero))

  const toggle = (slug: string) => {
    const current = slot.items || []
    if (current.includes(slug)) setItems(focusedTeam, focusedIndex, current.filter((x:string)=>x!==slug))
    else setItems(focusedTeam, focusedIndex, [...current, slug])
  }

  return (
    <div className="p-2 bg-gray-900/30 rounded-md border border-gray-700">
      <h4 className="font-medium text-white">Items</h4>
      <div className="grid grid-cols-3 gap-2 mt-3 max-h-[40vh] overflow-auto">
        {valid.map((it: StadiumItem) => {
          const selected = slot.items?.includes(it.slug)
          const filename = it.imageFilenames?.[0]
          return (
            <button key={it.slug} onClick={() => toggle(it.slug)} className={`p-2 rounded text-sm text-left ${selected ? 'bg-green-600 text-white shadow' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}>
              <div className="flex items-center gap-2">
                {filename ? (
                  filename.startsWith('/assets/') ? (
                    <img src={filename} alt={it.name} className="h-6 w-6 object-cover rounded" />
                  ) : (
                    <StadiumImage filename={filename} alt={it.name} className="h-6 w-6 object-cover rounded" />
                  )
                ) : (
                  <div className="h-6 w-6 bg-white/10 rounded" />
                )}
                <div className="font-semibold truncate" title={it.name}>{it.name}</div>
              </div>
              {it.description ? <div className="text-xs text-gray-300 mt-1 line-clamp-2">{it.description}</div> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

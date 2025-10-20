"use client"
import React from 'react'
import MapCombobox from '../../../components/stadium/MapCombobox'
import TeamPanel from '../../../components/stadium/TeamPanel'
import HeroGrid from '../../../components/stadium/HeroGrid'
import PowersSelect from '../../../components/stadium/PowersSelect'
import ItemsGrid from '../../../components/stadium/ItemsGrid'
import UrlSync from '../../../components/stadium/UrlSync'
import { DndContext } from '@dnd-kit/core'
import { useStadiumStore } from '../../../store/stadium'
import PrimaryButton from '../../../components/ui/PrimaryButton'

function EditorDndWrapper({ children }: { children: React.ReactNode }) {
  const setHero = useStadiumStore((s:any)=>s.setHero)
  const swap = useStadiumStore((s:any)=>s.swapWithinTeam)

  const onDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return
    const aid: string = active.id
    const oid: string = over.id

    // hero -> slot (assign hero)
    if (aid.startsWith('hero:') && oid.startsWith('slot:')) {
      const slug = aid.replace('hero:', '')
      const [, team, idx] = oid.split(':')
      const index = parseInt(idx, 10)
      setHero(team, index, slug)
      return
    }

    // slot -> slot (within-team reorder)
    if (aid.startsWith('slot:') && oid.startsWith('slot:')) {
      const [, teamA, idxA] = aid.split(':')
      const [, teamB, idxB] = oid.split(':')
      const from = parseInt(idxA, 10)
      const to = parseInt(idxB, 10)
      if (teamA === teamB && from !== to) {
        swap(teamA, from, to)
      }
    }
  }

  return <DndContext onDragEnd={onDragEnd}>{children}</DndContext>
}

export default function Page() {
  const team = useStadiumStore((s:any)=>s.team)
  const onGenerate = () => {
    const payload = { allies: team.allies, enemies: team.enemies }
    if ((globalThis as any).generateBuild) {
      ;(globalThis as any).generateBuild(payload)
    } else {
      console.log('generate payload', payload)
      alert('Generate called — payload logged to console')
    }
  }
  return (
    <div className="p-6 bg-gradient-to-b from-gray-900/40 to-gray-900 min-h-screen">
      <UrlSync />
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-white">Stadium Comp Builder</h1>
        <PrimaryButton id="generateBtn" onClick={onGenerate}>Generate</PrimaryButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="col-span-1">
          <div className="sticky top-4">
            <MapCombobox />
            <div className="mt-4 bg-white p-3 border rounded">
              <h3 className="font-semibold">Composer</h3>
              <p className="text-sm text-gray-600">Select a slot in the team panel to edit powers and items.</p>
            </div>
            <div className="mt-4">
      <HeroGrid />
            </div>
          </div>
        </aside>

        <main className="col-span-1">
          <TeamPanel />
        </main>

        <aside className="col-span-1">
          <PowersSelect />
          <div className="mt-4">
            <ItemsGrid />
          </div>
        </aside>
      </div>
    </div>
  )
}

import create from 'zustand'
import { persist } from 'zustand/middleware'
import type { HeroDef } from '../types/stadium'

type Role = 'allies' | 'enemies'

export type Slot = { hero?: string; powers: string[]; items: string[] }
export type Team = { allies: Slot[]; enemies: Slot[] }

export type StadiumState = {
  map?: string
  context: string
  focusedTeam: 'allies' | 'enemies'
  focusedIndex: number | null
  team: Team
  setMap: (s?: string) => void
  setContext: (t: string) => void
  setFocused: (team: 'allies' | 'enemies', index: number | null) => void
  setHero: (team: 'allies' | 'enemies', index: number, hero?: string) => void
  setPowers: (team: 'allies' | 'enemies', index: number, powers: string[]) => void
  setItems: (team: 'allies' | 'enemies', index: number, items: string[]) => void
  swapWithinTeam: (team: 'allies' | 'enemies', from: number, to: number) => void
}

const emptySlot = (): Slot => ({ hero: undefined, powers: [], items: [] })

export const useStadiumStore = create<StadiumState>(persist((set: any, get: any) => ({
  map: undefined,
  context: '',
  focusedTeam: 'allies',
  focusedIndex: null,
  team: { allies: [emptySlot(), emptySlot(), emptySlot(), emptySlot(), emptySlot()], enemies: [emptySlot(), emptySlot(), emptySlot(), emptySlot(), emptySlot()] },
  setMap: (m?: string) => set({ map: m }),
  setContext: (t: string) => set({ context: t }),
  setFocused: (team: 'allies' | 'enemies', index: number | null) => set({ focusedTeam: team, focusedIndex: index }),
  setHero: (team: 'allies' | 'enemies', index: number, hero?: string) => set((state: StadiumState) => { const s = { ...state }; s.team[team][index] = { ...(s.team[team][index] || emptySlot()), hero, powers: [], items: [] }; return s }),
  setPowers: (team: 'allies' | 'enemies', index: number, powers: string[]) => set((state: StadiumState) => { const s = { ...state }; s.team[team][index] = { ...(s.team[team][index]||emptySlot()), powers }; return s }),
  setItems: (team: 'allies' | 'enemies', index: number, items: string[]) => set((state: StadiumState) => { const s = { ...state }; s.team[team][index] = { ...(s.team[team][index]||emptySlot()), items }; return s }),
  swapWithinTeam: (team: 'allies' | 'enemies', from: number, to: number) => set((state: StadiumState) => {
    const arr = [...state.team[team]]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    return { ...state, team: { ...state.team, [team]: arr } }
  })
}), { name: 'stadium-storage' }))

// Serialization helpers used by URL-syncing UI
export function serializeStateForUrl(state: StadiumState) {
  // compact shape: map, context, allies heroes, enemies heroes, allies powers/items as indexes
  const compact: any = {
    m: state.map || '',
    c: state.context || '',
    a: state.team.allies.map(s => ({ h: s.hero || '', p: s.powers || [], i: s.items || [] })),
    e: state.team.enemies.map(s => ({ h: s.hero || '', p: s.powers || [], i: s.items || [] })),
  }
  try {
    return encodeURIComponent(Buffer.from(JSON.stringify(compact)).toString('base64'))
  } catch (e) {
    // fallback: simple encoded JSON
    return encodeURIComponent(JSON.stringify(compact))
  }
}

export function deserializeStateFromUrl(token: string | null): Partial<StadiumState> | null {
  if (!token) return null
  try {
    const decoded = decodeURIComponent(token)
    let raw = decoded
    // try base64 decode first
    try { raw = Buffer.from(decoded, 'base64').toString('utf8') } catch (err) { /* not base64 */ }
    const compact = JSON.parse(raw)
    const toSlot = (x: any): Slot => ({ hero: x?.h || undefined, powers: x?.p || [], items: x?.i || [] })
    return {
      map: compact.m || undefined,
      context: compact.c || '',
      team: { allies: (compact.a || []).map(toSlot), enemies: (compact.e || []).map(toSlot) }
    }
  } catch (e) {
    return null
  }
}

"use client"
import { useEffect } from 'react'
import { useStadiumStore, serializeStateForUrl, deserializeStateFromUrl } from '../../store/stadium'
import { readStateTokenFromLocation, pushStateTokenToLocation } from '../../lib/urlSync'

export default function UrlSync() {
  const setMap = useStadiumStore((s: any) => s.setMap)
  const setContext = useStadiumStore((s: any) => s.setContext)
  const setHero = useStadiumStore((s: any) => s.setHero)
  const setPowers = useStadiumStore((s: any) => s.setPowers)
  const setItems = useStadiumStore((s: any) => s.setItems)
  const setFocused = useStadiumStore((s: any) => s.setFocused)
  const team = useStadiumStore((s: any) => s.team)
  const map = useStadiumStore((s: any) => s.map)
  const context = useStadiumStore((s: any) => s.context)

  // hydrate from URL on mount
  useEffect(() => {
    const token = readStateTokenFromLocation()
    const parsed = deserializeStateFromUrl(token)
    if (parsed) {
      if (parsed.map) setMap(parsed.map)
      if (typeof parsed.context === 'string') setContext(parsed.context)
      if (parsed.team?.allies) parsed.team.allies.forEach((slot, i) => setHero('allies', i, slot.hero))
      if (parsed.team?.enemies) parsed.team.enemies.forEach((slot, i) => setHero('enemies', i, slot.hero))
      if (parsed.team?.allies) parsed.team.allies.forEach((slot, i) => setPowers('allies', i, slot.powers || []))
      if (parsed.team?.enemies) parsed.team.enemies.forEach((slot, i) => setPowers('enemies', i, slot.powers || []))
      if (parsed.team?.allies) parsed.team.allies.forEach((slot, i) => setItems('allies', i, slot.items || []))
      if (parsed.team?.enemies) parsed.team.enemies.forEach((slot, i) => setItems('enemies', i, slot.items || []))
      setFocused('allies', 0)
    }
  }, [setMap, setContext, setHero, setPowers, setItems, setFocused])

  // push to URL when team/map/context changes
  useEffect(() => {
  const unsubscribe = useStadiumStore.subscribe((state: any) => {
      try {
        const token = serializeStateForUrl(state as any)
        pushStateTokenToLocation(token)
      } catch (e) {
        // ignore
      }
    })
    return () => unsubscribe()
  }, [team, map, context])

  return null
}

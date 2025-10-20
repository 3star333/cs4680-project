"use client"
import React from 'react'
import maps from '../../data/stadium/maps.json'
import { useStadiumStore } from '../../store/stadium'

export default function MapCombobox() {
  const map = useStadiumStore((s: any) => s.map)
  const setMap = useStadiumStore((s: any) => s.setMap)

  return (
    <div className="p-2 bg-gray-900/30 rounded-md border border-gray-700">
      <label className="block text-sm font-medium text-white">Map</label>
      <select value={map||''} onChange={e=>setMap(e.target.value||undefined)} className="mt-1 block w-full rounded bg-gray-800 text-white border border-gray-700 p-2">
        <option value="">— Select map —</option>
        {maps.map((m:any) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
      </select>
    </div>
  )
}

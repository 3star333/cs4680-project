"use client"
import React from 'react'
import CompBar from '../../components/stadium/CompBar'
import HeroGrid from '../../components/stadium/HeroGrid'
import PrimaryButton from '../../components/ui/PrimaryButton'
import { useStadiumStore } from '../../store/stadium'

export default function Page(){
  const team = useStadiumStore((s:any)=>s.team)
  const onGenerate = () => {
    const payload = { allies: team.allies, enemies: team.enemies }
    if ((globalThis as any).generateBuild) {
      ;(globalThis as any).generateBuild(payload)
    } else {
      console.log('generate payload', payload)
      // simple toast using alert for now
      alert('Generate called — payload logged to console')
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f10] text-white">
      <CompBar />
      <div className="max-w-screen-xl mx-auto p-4">
        <div className="mt-4">
          <HeroGrid />
        </div>
        <div className="mt-6">
          <PrimaryButton id="generateBtn" onClick={onGenerate}>Generate</PrimaryButton>
        </div>
      </div>
    </div>
  )
}

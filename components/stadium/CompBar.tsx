"use client"
import React from 'react'
import CompRow from './CompRow'

export default function CompBar(){
  return (
    <div className="sticky top-0 z-40 bg-[#0e1113]/80 backdrop-blur border-b border-white/10 p-2">
      <div className="max-w-screen-xl mx-auto">
        <CompRow type="ally" />
        <CompRow type="enemy" />
      </div>
    </div>
  )
}

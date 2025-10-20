"use client"
import React from 'react'

export default function PrimaryButton({ id, children, onClick }: { id?: string, children: React.ReactNode, onClick?: ()=>void }){
  return (
  <button id={id} onClick={onClick} className="px-5 py-2.5 bg-amber-500/90 text-black font-bold rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.3)] hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition">
      {children}
    </button>
  )
}

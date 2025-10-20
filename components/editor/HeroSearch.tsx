"use client"
import React, { useState, useMemo } from 'react'
import type { Hero } from '../../types/editor'
import StadiumImage from '../stadium/StadiumImage'

interface HeroSearchProps {
  heroes: Hero[]
  onSelect: (hero: Hero) => void
  onClose: () => void
}

export default function HeroSearch({ heroes, onSelect, onClose }: HeroSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredHeroes = useMemo(() => {
    if (!searchQuery.trim()) return heroes
    const q = searchQuery.toLowerCase()
    return heroes.filter(h => h.name.toLowerCase().includes(q))
  }, [heroes, searchQuery])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-[#111315] rounded-2xl p-6 max-w-4xl w-full border border-white/10 shadow-xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Select Hero</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition text-2xl leading-none px-2"
          >
            ×
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search heroes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
        />

        {/* Hero Grid */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredHeroes.map((hero) => (
              <button
                key={hero.id}
                onClick={() => onSelect(hero)}
                className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:scale-105 hover:border-amber-500/50 transition-all group"
              >
                <StadiumImage
                  filename={hero.portrait}
                  alt={hero.name}
                  basePath="/assets/heroes/"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-xs font-semibold text-white text-center truncate">{hero.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {filteredHeroes.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No heroes found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

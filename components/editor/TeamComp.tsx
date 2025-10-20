"use client"
import React from 'react'
import type { Hero, HeroBuild, TeamType } from '../../types/editor'
import StadiumImage from '../stadium/StadiumImage'

interface TeamCompProps {
  team: HeroBuild[]
  type: TeamType
  onEdit: (index: number) => void
  onAddHero: () => void
  onRemoveHero?: (index: number) => void
  onMarkAsYourself?: (index: number) => void
  calculateBuildCost?: (build: HeroBuild) => number
}

export default function TeamComp({ team, type, onEdit, onAddHero, onRemoveHero, onMarkAsYourself, calculateBuildCost }: TeamCompProps) {
  const isAlly = type === 'ally'
  const label = isAlly ? 'Allies' : 'Enemies'
  const accentColor = isAlly ? 'amber' : 'blue'
  
  // Check if team is full (5 heroes selected)
  const teamFull = team.filter(build => build.hero).length === 5
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-white">{label}</h2>
        {!teamFull && (
          <button
            onClick={onAddHero}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              isAlly 
                ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            + Add {isAlly ? 'Ally' : 'Enemy'}
          </button>
        )}
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2">
        {team.map((build, index) => (
          <div
            key={index}
            className={`relative flex-shrink-0 w-28 rounded-xl overflow-hidden border transition-all ${
              build.hero 
                ? `bg-white/5 border-white/20 hover:border-${accentColor}-500/50` 
                : 'bg-white/5 border-white/10 border-dashed'
            }`}
          >
            {build.hero ? (
              <>
                {/* Hero Portrait */}
                <div className="relative w-full aspect-square">
                  <StadiumImage
                    filename={build.hero.portrait}
                    alt={build.hero.name}
                    basePath="/assets/heroes/"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Remove button */}
                  {onRemoveHero && (
                    <button
                      onClick={() => onRemoveHero(index)}
                      className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-600/80 hover:bg-red-500 text-white text-xs rounded-full transition"
                      title="Remove hero"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                {/* Hero Info */}
                <div className="p-2 bg-black/40">
                  <p className="text-xs font-semibold text-white truncate mb-1">{build.hero.name}</p>
                  
                  {/* Power & Items indicator */}
                  <div className="flex gap-1 text-[10px] text-gray-300 mb-1">
                    {(build.powers && build.powers.length > 0) && (
                      <span className="px-1 py-0.5 bg-purple-600/30 rounded">{build.powers.length}P</span>
                    )}
                    {build.items.length > 0 && (
                      <span className="px-1 py-0.5 bg-green-600/30 rounded">{build.items.length}I</span>
                    )}
                  </div>
                  
                  {/* Cost indicator (for allies with items) */}
                  {isAlly && build.items.length > 0 && calculateBuildCost && (
                    <div className="text-[10px] text-yellow-400 mb-1 font-semibold">
                      💰 {calculateBuildCost(build).toLocaleString()}
                    </div>
                  )}
                  
                  {/* "Yourself" badge */}
                  {build.isYourself && (
                    <div className="text-[10px] bg-yellow-500 text-black font-bold px-1 py-0.5 rounded mb-1">
                      YOU
                    </div>
                  )}
                  
                  {/* Edit Button */}
                  <button
                    onClick={() => onEdit(index)}
                    className={`w-full text-xs py-1 rounded transition ${
                      isAlly
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    Edit
                  </button>
                  
                  {/* Mark as Yourself button (only for allies) */}
                  {isAlly && onMarkAsYourself && !build.isYourself && (
                    <button
                      onClick={() => onMarkAsYourself(index)}
                      className="w-full text-[10px] py-0.5 rounded transition bg-yellow-600/50 hover:bg-yellow-600 text-white mt-1"
                      title="Mark this hero as yourself to enable budget tracking"
                    >
                      Mark as You
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full aspect-square flex items-center justify-center">
                <button
                  onClick={onAddHero}
                  className="text-white/40 hover:text-white/60 text-3xl font-thin transition"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

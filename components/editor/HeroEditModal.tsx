"use client"
import React, { useState, useEffect } from 'react'
import type { Hero, HeroBuild, Power, Item } from '../../types/editor'
import StadiumImage from '../stadium/StadiumImage'

interface HeroEditModalProps {
  build: HeroBuild
  availablePowers: Power[]
  availableItems: Item[]
  onSave: (updatedBuild: HeroBuild) => void
  onClose: () => void
}

export default function HeroEditModal({ 
  build, 
  availablePowers, 
  availableItems, 
  onSave, 
  onClose 
}: HeroEditModalProps) {
  // Initialize with powers array (max 4) or migrate from old power field
  const initialPowers = build.powers || (build.power ? [build.power] : [])
  const [selectedPowers, setSelectedPowers] = useState<Power[]>(initialPowers)
  const [selectedItems, setSelectedItems] = useState<Item[]>(build.items)

  // Constants
  const MAX_POWERS = 4
  const MAX_ITEMS = 6

  // Filter powers and items relevant to this hero
  const heroPowers = availablePowers
  const heroItems = availableItems.filter(
    item => !item.heroSlug || item.heroSlug === build.hero.slug
  )

  const togglePower = (power: Power) => {
    const exists = selectedPowers.find(p => p.id === power.id)
    if (exists) {
      setSelectedPowers(selectedPowers.filter(p => p.id !== power.id))
    } else if (selectedPowers.length < MAX_POWERS) {
      setSelectedPowers([...selectedPowers, power])
    }
  }

  const toggleItem = (item: Item) => {
    const exists = selectedItems.find(i => i.id === item.id)
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id))
    } else if (selectedItems.length < MAX_ITEMS) {
      setSelectedItems([...selectedItems, item])
    }
  }

  const handleSave = () => {
    onSave({
      ...build,
      powers: selectedPowers,
      power: selectedPowers[0], // Keep for backwards compatibility
      items: selectedItems
    })
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#111315] rounded-2xl p-6 max-w-2xl w-full border border-white/10 shadow-xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20">
              <StadiumImage
                filename={build.hero.portrait}
                alt={build.hero.name}
                basePath="/assets/heroes/"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{build.hero.name}</h2>
              <p className="text-sm text-gray-400">Customize Build</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition text-2xl leading-none px-2"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Powers Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-purple-500 rounded"></span>
              Power Selection ({selectedPowers.length}/{MAX_POWERS})
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {heroPowers.map((power) => {
                const isSelected = selectedPowers.some(p => p.id === power.id)
                const canSelect = !isSelected && selectedPowers.length < MAX_POWERS
                const isDisabled = !isSelected && selectedPowers.length >= MAX_POWERS
                return (
                  <button
                    key={power.id}
                    onClick={() => togglePower(power)}
                    disabled={isDisabled}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected 
                        ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105' 
                        : isDisabled
                        ? 'border-white/5 opacity-40 cursor-not-allowed'
                        : 'border-white/10 hover:border-purple-400/50 cursor-pointer'
                    }`}
                    title={power.name}
                  >
                    <StadiumImage
                      filename={power.icon}
                      alt={power.name}
                      basePath="/assets/powers/"
                      className="w-full h-full object-cover"
                      placeholderClassName="w-full h-full bg-purple-900/20"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {selectedPowers.findIndex(p => p.id === power.id) + 1}
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {heroPowers.length === 0 && (
              <p className="text-sm text-gray-400">No powers available for this hero.</p>
            )}
            {selectedPowers.length >= MAX_POWERS && (
              <p className="text-xs text-purple-400 mt-2">Maximum powers selected. Deselect a power to choose another.</p>
            )}
          </div>

          {/* Items Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-green-500 rounded"></span>
              Item Selection ({selectedItems.length}/{MAX_ITEMS})
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {heroItems.map((item) => {
                const isSelected = selectedItems.some(i => i.id === item.id)
                const isDisabled = !isSelected && selectedItems.length >= MAX_ITEMS
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    disabled={isDisabled}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected 
                        ? 'border-green-500 ring-2 ring-green-500/50 scale-105' 
                        : isDisabled
                        ? 'border-white/5 opacity-40 cursor-not-allowed'
                        : 'border-white/10 hover:border-green-400/50 cursor-pointer'
                    }`}
                    title={item.name}
                  >
                    <StadiumImage
                      filename={item.icon}
                      alt={item.name}
                      basePath="/assets/items/"
                      className="w-full h-full object-cover"
                      placeholderClassName="w-full h-full bg-green-900/20"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                          ✓
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {heroItems.length === 0 && (
              <p className="text-sm text-gray-400">No items available for this hero.</p>
            )}
            {selectedItems.length >= MAX_ITEMS && (
              <p className="text-xs text-green-400 mt-2">Maximum items selected. Deselect an item to choose another.</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg font-semibold border-2 border-white/20 text-white hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-lg font-semibold bg-amber-600 hover:bg-amber-500 text-white transition"
          >
            Save Build
          </button>
        </div>
      </div>
    </div>
  )
}

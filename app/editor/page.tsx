"use client"
import React, { useState, useEffect, useMemo } from 'react'
import type { Hero, HeroBuild, Power, Item } from '../../types/editor'
import HeroSearch from '../../components/editor/HeroSearch'
import TeamComp from '../../components/editor/TeamComp'
import HeroEditModal from '../../components/editor/HeroEditModal'
import AIOutputPanel from '../../components/editor/AIOutputPanel'
import { getHeroes, getPowers, getAllItems, getHeroPowers, getHeroSpecificItems } from '../../lib/stadium'

type TeamType = 'ally' | 'enemy'

export default function EditorPage() {
  // Data
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [powers, setPowers] = useState<Power[]>([])
  const [items, setItems] = useState<Item[]>([])
  
  // State
  const [allies, setAllies] = useState<HeroBuild[]>(Array(5).fill(null).map(() => ({ hero: null as any, items: [] })))
  const [enemies, setEnemies] = useState<HeroBuild[]>(Array(5).fill(null).map(() => ({ hero: null as any, items: [] })))
  
  // Budget State
  const [creditBudget, setCreditBudget] = useState<number>(10000) // Default budget
  const [showBudgetInput, setShowBudgetInput] = useState(false)
  
  // UI State
  const [showHeroSearch, setShowHeroSearch] = useState(false)
  const [searchTeamType, setSearchTeamType] = useState<TeamType>('ally')
  const [editingBuild, setEditingBuild] = useState<{ team: TeamType; index: number; build: HeroBuild } | null>(null)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [isSuggestingBuild, setIsSuggestingBuild] = useState(false)
  
  // AI Output State
  const [aiOutput, setAiOutput] = useState<string>('')
  const [aiOutputType, setAiOutputType] = useState<'strategy' | 'build' | null>(null)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const [heroData, powerData, itemData] = await Promise.all([
        getHeroes(),
        getPowers(),
        Promise.resolve(getAllItems())
      ])
      
      setHeroes(heroData.map((h: any) => ({
        id: h.slug,
        slug: h.slug,
        name: h.name,
        portrait: h.portrait
      })))
      
      setPowers(powerData.map((p: any) => ({
        id: p.slug,
        slug: p.slug,
        name: p.name,
        icon: p.icon
      })))
      
      setItems(itemData.map((i: any) => ({
        id: i.slug,
        slug: i.slug,
        name: i.name,
        icon: i.imageFilenames?.[0] || '',
        heroSlug: i.heroSlug,
        cost: i.cost || 0
      })))
    }
    
    loadData()
  }, [])

  // Handlers
  const handleAddHero = (team: TeamType) => {
    setSearchTeamType(team)
    setShowHeroSearch(true)
  }

  const handleSelectHero = (hero: Hero) => {
    const team = searchTeamType === 'ally' ? allies : enemies
    const setTeam = searchTeamType === 'ally' ? setAllies : setEnemies
    
    // Find first empty slot
    const emptyIndex = team.findIndex(build => !build.hero)
    if (emptyIndex !== -1) {
      const newTeam = [...team]
      newTeam[emptyIndex] = { hero, items: [] }
      setTeam(newTeam)
    }
    
    setShowHeroSearch(false)
  }

  const handleEditHero = (team: TeamType, index: number) => {
    const build = team === 'ally' ? allies[index] : enemies[index]
    if (build.hero) {
      setEditingBuild({ team, index, build })
    }
  }

  const handleSaveBuild = (updatedBuild: HeroBuild) => {
    if (!editingBuild) return
    
    const { team, index } = editingBuild
    if (team === 'ally') {
      const newAllies = [...allies]
      newAllies[index] = updatedBuild
      setAllies(newAllies)
    } else {
      const newEnemies = [...enemies]
      newEnemies[index] = updatedBuild
      setEnemies(newEnemies)
    }
    
    setEditingBuild(null)
  }

  const handleMarkAsYourself = (index: number) => {
    const newAllies = allies.map((ally, i) => ({
      ...ally,
      isYourself: i === index
    }))
    setAllies(newAllies)
  }

  const calculateBuildCost = (build: HeroBuild): number => {
    if (!build.hero) return 0
    return build.items.reduce((total, item) => total + (item.cost || 0), 0)
  }

  const yourBuildIndex = useMemo(() => {
    return allies.findIndex(ally => ally.isYourself)
  }, [allies])

  const budgetInfo = useMemo(() => {
    if (yourBuildIndex === -1) {
      return { totalBudget: creditBudget, currentSpent: 0, remaining: creditBudget }
    }
    const currentSpent = calculateBuildCost(allies[yourBuildIndex])
    return {
      totalBudget: creditBudget,
      currentSpent,
      remaining: creditBudget - currentSpent
    }
  }, [allies, yourBuildIndex, creditBudget])

  // Get hero-specific powers and items for the currently editing hero
  const heroPowers = useMemo(() => {
    if (!editingBuild?.build?.hero) return powers
    return getHeroPowers(editingBuild.build.hero.slug).map((p: any) => ({
      id: p.slug,
      slug: p.slug,
      name: p.name,
      icon: p.icon
    }))
  }, [editingBuild, powers])

  const heroItems = useMemo(() => {
    if (!editingBuild?.build?.hero) return items
    
    // Get hero-specific items from heroes.json
    const specificItems = getHeroSpecificItems(editingBuild.build.hero.slug).map((item: any) => ({
      id: item.slug,
      slug: item.slug,
      name: item.name,
      icon: item.imageFilenames?.[0] || '',
      heroSlug: editingBuild.build.hero.slug
    }))
    
    // Combine with general items (items without heroSlug)
    const generalItems = items.filter(i => !i.heroSlug)
    
    return [...specificItems, ...generalItems]
  }, [editingBuild, items])

  const handleGenerateStrategyPlan = async () => {
    setIsGeneratingPlan(true)
    
    try {
      // Prepare the composition data
      const composition = {
        allies: allies.filter(build => build.hero).map(build => ({
          hero: build.hero.name,
          power: build.power?.name || 'None',
          items: build.items.map(item => item.name)
        })),
        enemies: enemies.filter(build => build.hero).map(build => ({
          hero: build.hero.name,
          power: build.power?.name || 'None',
          items: build.items.map(item => item.name)
        }))
      }

      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ composition })
      })

      if (!response.ok) {
        throw new Error('Failed to generate strategy plan')
      }

      const data = await response.json()
      
      // Display the strategy plan in the AI output panel
      setAiOutput(data.plan || JSON.stringify(data, null, 2))
      setAiOutputType('strategy')
    } catch (error) {
      console.error('Error generating strategy plan:', error)
      setAiOutput('❌ Failed to generate strategy plan. Please check the console for details.')
      setAiOutputType('strategy')
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const handleRemoveHero = (team: TeamType, index: number) => {
    if (team === 'ally') {
      const newAllies = [...allies]
      newAllies[index] = { hero: null as any, items: [] }
      setAllies(newAllies)
    } else {
      const newEnemies = [...enemies]
      newEnemies[index] = { hero: null as any, items: [] }
      setEnemies(newEnemies)
    }
  }

  const handleSuggestBuild = async () => {
    if (yourBuildIndex === -1) {
      alert('Please mark one of your allies as "yourself" first!')
      return
    }

    const yourBuild = allies[yourBuildIndex]
    if (!yourBuild.hero) {
      alert('Please select a hero for yourself first!')
      return
    }

    setIsSuggestingBuild(true)
    try {
      const response = await fetch('/api/suggest-build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heroSlug: yourBuild.hero.slug,
          heroName: yourBuild.hero.name,
          budget: creditBudget,
          currentItems: yourBuild.items.map(item => ({ name: item.name, cost: item.cost })),
          allies: allies.filter((a, i) => a.hero && i !== yourBuildIndex).map(a => a.hero.name),
          enemies: enemies.filter(e => e.hero).map(e => e.hero.name)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get build suggestions')
      }

      const data = await response.json()
      
      // Display build suggestions in the AI output panel
      const output = `Build Suggestions for ${yourBuild.hero.name}\n\nBudget: ${creditBudget.toLocaleString()} credits\n\n${data.suggestions || JSON.stringify(data, null, 2)}`
      setAiOutput(output)
      setAiOutputType('build')
    } catch (error) {
      console.error('Error getting build suggestions:', error)
      setAiOutput('❌ Failed to get build suggestions. Please check the console for details.')
      setAiOutputType('build')
    } finally {
      setIsSuggestingBuild(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a3439] via-[#1f2629] to-[#14181a]">
      <div className="max-w-[1920px] mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Composition Builder
          </h1>
          <p className="text-gray-400">
            Build your perfect team composition with custom powers and items
          </p>
        </div>

        {/* Main Layout: Editor (Left) + AI Output (Right) */}
        <div className="flex gap-6">
          {/* Left Side: Editor */}
          <div className="flex-1 min-w-0">

        {/* Budget Section (only show if someone is marked as "yourself") */}
        {yourBuildIndex !== -1 && (
          <div className="mb-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                💰 Your Build Budget
              </h3>
              <button
                onClick={() => setShowBudgetInput(!showBudgetInput)}
                className="text-xs text-yellow-400 hover:text-yellow-300 underline"
              >
                {showBudgetInput ? 'Close' : 'Change Budget'}
              </button>
            </div>
            
            {showBudgetInput && (
              <div className="mb-3 flex gap-2">
                <input
                  type="number"
                  value={creditBudget}
                  onChange={(e) => setCreditBudget(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 px-3 py-2 bg-black/40 border border-yellow-500/30 rounded-lg text-white"
                  placeholder="Enter budget..."
                  min="0"
                  step="500"
                />
                <button
                  onClick={() => setShowBudgetInput(false)}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-semibold"
                >
                  Set
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Total Budget</div>
                <div className="text-lg font-bold text-white">{budgetInfo.totalBudget.toLocaleString()}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Spent</div>
                <div className="text-lg font-bold text-orange-400">{budgetInfo.currentSpent.toLocaleString()}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Remaining</div>
                <div className={`text-lg font-bold ${budgetInfo.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {budgetInfo.remaining.toLocaleString()}
                </div>
              </div>
            </div>
            
            {budgetInfo.remaining < 0 && (
              <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-400">
                ⚠️ You're over budget! Remove some items or increase your budget.
              </div>
            )}
          </div>
        )}

        {/* Team Compositions */}
        <div className="space-y-6">
          <TeamComp
            team={allies}
            type="ally"
            onEdit={(index: number) => handleEditHero('ally', index)}
            onAddHero={() => handleAddHero('ally')}
            onRemoveHero={(index: number) => handleRemoveHero('ally', index)}
            onMarkAsYourself={handleMarkAsYourself}
            calculateBuildCost={calculateBuildCost}
          />
          
          <TeamComp
            team={enemies}
            type="enemy"
            onEdit={(index: number) => handleEditHero('enemy', index)}
            onAddHero={() => handleAddHero('enemy')}
            onRemoveHero={(index: number) => handleRemoveHero('enemy', index)}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 flex-wrap">
          <button
            onClick={handleGenerateStrategyPlan}
            disabled={isGeneratingPlan || (allies.filter(b => b.hero).length === 0 && enemies.filter(b => b.hero).length === 0)}
            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPlan ? '🤖 Generating...' : '🎯 Generate Strategy Plan'}
          </button>
          
          <button
            onClick={handleSuggestBuild}
            disabled={isSuggestingBuild || yourBuildIndex === -1}
            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg shadow-yellow-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title={yourBuildIndex === -1 ? "Mark one ally as 'yourself' to use this feature" : ""}
          >
            {isSuggestingBuild ? '🔨 Generating Build...' : '🔨 Generate Build (Budget)'}
          </button>
          
          <button
            onClick={() => {
              setAllies(Array(5).fill(null).map(() => ({ hero: null as any, items: [] })))
              setEnemies(Array(5).fill(null).map(() => ({ hero: null as any, items: [] })))
            }}
            className="px-6 py-3 rounded-xl font-semibold border-2 border-white/20 text-white hover:bg-white/5 transition"
          >
            Reset All
          </button>
        </div>
          </div>
          {/* End Left Side */}

          {/* Right Side: AI Output Panel */}
          <AIOutputPanel
            aiOutput={aiOutput}
            aiOutputType={aiOutputType}
            isGenerating={isGeneratingPlan || isSuggestingBuild}
            isGeneratingPlan={isGeneratingPlan}
            isSuggestingBuild={isSuggestingBuild}
            onClear={() => {
              setAiOutput('')
              setAiOutputType(null)
            }}
          />
          {/* End Right Side */}
        </div>
        {/* End Main Layout */}
      </div>

      {/* Modals */}
      {showHeroSearch && (
        <HeroSearch
          heroes={heroes}
          onSelect={handleSelectHero}
          onClose={() => setShowHeroSearch(false)}
        />
      )}
      
      {editingBuild && (
        <HeroEditModal
          build={editingBuild.build}
          availablePowers={heroPowers}
          availableItems={heroItems}
          onSave={handleSaveBuild}
          onClose={() => setEditingBuild(null)}
        />
      )}
    </div>
  )
}

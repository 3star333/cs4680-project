import itemsData from '../data/stadium/items.json'
import powersData from '../data/stadium/powers.json'
import type { Hero, StadiumItem, Power } from '../types/stadium'
import stadiumHeroesData from '../data/stadium/heroes.json'
import type { StadiumHero } from '../types/stadium'

let heroesCache: Hero[] | null = null
let itemsCache: StadiumItem[] | null = null
let powersCache: Power[] | null = null

export async function getHeroes(): Promise<Hero[]> {
  if (!heroesCache) {
    // Extract hero list from heroes.json
    const stadiumHeroes = stadiumHeroesData as unknown as StadiumHero[]
    heroesCache = stadiumHeroes.map(h => {
      // Extract hero name from title (e.g., "Ana/Stadium" -> "ana")
      const heroName = h.name.split('/')[0].toLowerCase().replace(/\s+/g, '-')
      const displayName = h.name.split('/')[0] // "Ana/Stadium" -> "Ana"
      
      // Special case for Soldier: 76 -> S76
      let imageFilename = displayName.replace(/\s+/g, '_')
      if (displayName === 'Soldier: 76') {
        imageFilename = 'S76'
      }
      
      return {
        slug: heroName,
        name: displayName,
        portrait: `${imageFilename}_Stadium.png`
      }
    })
  }
  return heroesCache
}

export function getHeroPortrait(heroSlug: string): string {
  // Generate portrait filename from slug
  // Special case for soldier-76
  if (heroSlug === 'soldier-76' || heroSlug === 'soldier:-76') {
    return 'S76_Stadium.png'
  }
  
  // Convert slug like "ana" or "d-va" to "Ana_Stadium.png" or "D.Va_Stadium.png"
  const heroName = heroSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('.')
  return `${heroName}_Stadium.png`
}

export async function getHeroItems(heroSlug: string): Promise<StadiumItem[]> {
  if (!itemsCache) itemsCache = (itemsData as unknown as StadiumItem[]) || []
  return itemsCache.filter(i => !i.heroSlug || i.heroSlug === heroSlug)
}

export async function getPowers(): Promise<Power[]> {
  if (!powersCache) powersCache = (powersData as unknown as Power[]) || []
  return powersCache
}

export function getAllItems(): StadiumItem[] {
  if (!itemsCache) itemsCache = (itemsData as unknown as StadiumItem[]) || []
  return itemsCache
}

export function getItemBySlug(slug: string): StadiumItem | null {
  const all = getAllItems()
  return all.find(i => i.slug === slug) || null
}

export function getStadiumHeroes(): StadiumHero[] {
  return (stadiumHeroesData as unknown as StadiumHero[]) || []
}

// Get hero-specific powers and items by hero slug
export function getHeroPowers(heroSlug: string): Power[] {
  const stadiumHeroes = stadiumHeroesData as unknown as StadiumHero[]
  const hero = stadiumHeroes.find(h => {
    const slug = h.name.split('/')[0].toLowerCase().replace(/\s+/g, '-')
    return slug === heroSlug || slug === heroSlug.replace(/^soldier-76$/, 'soldier:-76')
  })
  
  if (!hero || !hero.powers) return []
  
  return hero.powers.map((p: any) => ({
    id: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name: p.name,
    icon: p.image,
    affectedAbility: p.affectedAbility,
    description: p.description
  }))
}

export function getHeroSpecificItems(heroSlug: string): StadiumItem[] {
  const stadiumHeroes = stadiumHeroesData as unknown as StadiumHero[]
  const hero = stadiumHeroes.find(h => {
    const slug = h.name.split('/')[0].toLowerCase().replace(/\s+/g, '-')
    return slug === heroSlug || slug === heroSlug.replace(/^soldier-76$/, 'soldier:-76')
  })
  
  if (!hero || !hero.items) return []
  
  // Normalize imageFilenames to match actual files (spaces -> underscores)
  return hero.items.map((item: any) => ({
    ...item,
    imageFilenames: item.imageFilenames?.map((filename: string) => 
      filename.replace(/\s+/g, '_')
    ) || []
  })) as unknown as StadiumItem[]
}

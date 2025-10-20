// Types for the composition editor UI

export interface Hero {
  id: string
  slug: string
  name: string
  portrait: string
  role?: string
}

export interface Power {
  id: string
  slug: string
  name: string
  icon: string
}

export interface Item {
  id: string
  slug: string
  name: string
  icon: string
  heroSlug?: string
  cost?: number  // Item cost in credits
}

export interface HeroBuild {
  hero: Hero
  power?: Power  // Deprecated - use powers array instead
  powers?: Power[]  // New: support up to 4 powers
  items: Item[]  // Max 6 items
  isYourself?: boolean  // Flag to mark this hero as "yourself"
}

export type TeamType = 'ally' | 'enemy'

export interface BudgetInfo {
  totalBudget: number
  currentSpent: number
  remaining: number
}

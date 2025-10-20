export interface Hero { slug: string; name: string; portrait: string }
export interface Power { slug: string; name: string; icon: string }
export type Role = 'damage' | 'tank' | 'support'

export interface HeroPower {
  slug: string
  name: string
}

export interface HeroDef {
  slug: string
  name: string
  role: Role
  powers: HeroPower[]
}

export interface ItemDef {
  slug: string
  name: string
  roles: Role[]
  desc?: string
}

export interface MapDef { slug: string; name: string; type: string }
export interface StadiumItemBuff {
  key: string
  value: string
}

export interface StadiumItem {
  slug: string
  name: string
  heroSlug?: string
  description: string
  cost?: number
  rarity?: 'Common'|'Rare'|'Epic'|'Uncommon'|'Legendary'
  tags: string[]
  ability_type?: string
  buffs: StadiumItemBuff[]
  sourceTitle: string
  imageFilenames: string[]
}

export interface StadiumHeroPower {
  name: string
  image?: string
  affectedAbility?: string
  description?: string
  type?: string
}

export interface StadiumHero {
  slug: string
  name: string
  role?: string
  description?: string
  items: StadiumItem[]
  powers: StadiumHeroPower[]
  sourceTitle: string
  imageFilenames: string[]
}

export interface StadiumMeta {
  generatedAt: string
  counts: {
    items: number
    heroes: number
  }
}

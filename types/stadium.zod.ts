import { z } from 'zod'

export const StadiumItemBuffSchema = z.object({ key: z.string(), value: z.string() })

export const StadiumItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  cost: z.number().optional(),
  rarity: z.enum(['Common','Uncommon','Rare','Epic','Legendary']).optional(),
  tags: z.array(z.string()).default([]),
  ability_type: z.string().optional(),
  buffs: z.array(StadiumItemBuffSchema).default([]),
  sourceTitle: z.string(),
  imageFilenames: z.array(z.string()).default([]),
})

export const StadiumHeroPowerSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  affectedAbility: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
})

export const StadiumHeroSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string().optional(),
  description: z.string().optional(),
  items: z.array(StadiumItemSchema).default([]),
  powers: z.array(StadiumHeroPowerSchema).default([]),
  sourceTitle: z.string(),
  imageFilenames: z.array(z.string()).default([]),
})

export const StadiumMetaSchema = z.object({
  generatedAt: z.string(),
  counts: z.object({ items: z.number(), heroes: z.number() }),
})

export function validateDataset(items: unknown[], heroes: unknown[]) {
  const validItems = items.map((it, i) => {
    const res = StadiumItemSchema.safeParse(it)
    if (!res.success) console.warn('Item validation failed', i, res.error.errors[0])
    return res.success ? res.data : null
  }).filter(Boolean)

  const validHeroes = heroes.map((h, i) => {
    const res = StadiumHeroSchema.safeParse(h)
    if (!res.success) console.warn('Hero validation failed', i, res.error.errors[0])
    return res.success ? res.data : null
  }).filter(Boolean)

  return { items: validItems, heroes: validHeroes }
}

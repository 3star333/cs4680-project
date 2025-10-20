import fs from 'fs'
import path from 'path'
import { StadiumItem } from '../types/stadium'

export function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }

export function parseAbilityDetails(templateSrc: string) {
  const out: any = {}
  const re = /\|\s*([^=\s]+)\s*=\s*([^\n}]+)/g
  let m
  while ((m = re.exec(templateSrc)) !== null) out[m[1].trim()] = m[2].trim()
  return out
}

function normalizeImageToken(token?: string): string | undefined {
  if (!token) return undefined
  let t = token.trim()
  // Strip wiki link/file syntax like [[File:Name.png|...]] or File:Name.png
  t = t.replace(/^\[\[/, '').replace(/\]\]$/, '')
  t = t.replace(/^File:/i, '')
  // Split on pipe and take first segment
  if (t.includes('|')) t = t.split('|')[0]
  // Remove any directory, keep basename
  t = t.replace(/.*\//, '')
  // Basic filename validation
  if (/\.(png|svg|jpg|jpeg|webp)$/i.test(t)) return t
  return undefined
}

function findAnyImageInTemplate(tpl: string): string | undefined {
  // Look for [[File:...]] first
  const fileMatch = tpl.match(/\[\[\s*File:([^\]|]+)(?:\|[^\]]*)?\]\]/i)
  if (fileMatch) {
    const name = normalizeImageToken(fileMatch[1])
    if (name) return name
  }
  // Fallback: any standalone filename pattern
  const nameMatch = tpl.match(/([A-Za-z0-9._-]+\.(?:png|svg|jpg|jpeg|webp))/i)
  if (nameMatch) return nameMatch[1]
  return undefined
}

export function parseItemFromTemplate(tpl: string, sourceTitle: string): StadiumItem | null {
  const parsed = parseAbilityDetails(tpl)
  if (!parsed['ability_name']) return null
  const name = parsed['ability_name']
  const slug = slugify(name)
  const cost = parsed['stadium_cost'] ? Number(parsed['stadium_cost'].replace(/[^0-9]/g, '')) : undefined
  const rarity = parsed['stadium_rarity'] ? parsed['stadium_rarity'].trim() : undefined
  const buffsRaw = parsed['stadium_buffs'] || ''
  const buffs = String(buffsRaw).split('::').filter(Boolean).map(b => {
    const [k, v] = b.split(';;')
    return { key: (k||'').trim(), value: (v||'').trim() }
  })
  // Try multiple image fields and patterns
  const imageCandidates: Array<string | undefined> = [
    parsed['ability_image'],
    parsed['power_image'],
    parsed['image'],
    parsed['icon'],
    parsed['image1'],
    parsed['image_name'],
  ]
  let imageName: string | undefined
  for (const cand of imageCandidates) {
    const norm = normalizeImageToken(typeof cand === 'string' ? cand : undefined)
    if (norm) { imageName = norm; break }
  }
  if (!imageName) imageName = findAnyImageInTemplate(tpl)
  const image = imageName ? [imageName] : []
  const ability_type = parsed['ability_type']
  const description = parsed['official_description'] || ''

  return {
    slug,
    name,
    description: String(description).trim(),
    cost,
    rarity: rarity as any,
    tags: [],
    ability_type,
    buffs,
    sourceTitle,
    imageFilenames: image,
  }
}

export function findAbilityTemplates(src: string) {
  const re = /\{\{Ability details([\s\S]*?)\}\}/g
  const res = []
  let m
  while ((m = re.exec(src)) !== null) res.push(m[0])
  return res
}

export interface ParsedHero {
  slug: string
  name: string
  role?: string
  description?: string
  items: ReturnType<typeof parseItemFromTemplate>[]
  powers: Array<{ name: string, image?: string, affectedAbility?: string, description?: string, type?: string }>
  sourceTitle: string
}

export function parseHeroFromWikitext(src: string, sourceTitle: string): ParsedHero | null {
  // derive a readable name from sourceTitle
  let name = sourceTitle.replace(/_Stadium$/i, '').replace(/_/g, ' ')
  name = name.replace(/\s+Stadium$/i, '').trim()

  const templates = findAbilityTemplates(src)
  const items = [] as ReturnType<typeof parseItemFromTemplate>[]
  const powers: ParsedHero['powers'] = []

  for (const tpl of templates) {
    const parsed = parseItemFromTemplate(tpl, sourceTitle)
    if (parsed) {
      // classify as power vs item by ability_type or stadium_rarity
      const rawType = (tpl.match(/\|\s*ability_type\s*=\s*([^\n}]+)/i) || [])[1] || ''
      if (/Stadium Power/i.test(rawType) || /Power/i.test(rawType) || /Stadium Power/i.test(parsed.ability_type || '')) {
        // extract affected_ability and other details
        const mAff = tpl.match(/\|\s*affected_ability\s*=\s*([^\n}]+)/i)
        powers.push({ name: parsed.name, image: parsed.imageFilenames[0], affectedAbility: mAff ? mAff[1].trim() : undefined, description: parsed.description, type: 'Stadium Power' })
      } else if (parsed.ability_type && /Hero Item|Hero Item/i.test(parsed.ability_type)) {
        items.push(parsed)
      } else if (parsed.ability_type && /Item|Weapon|Ability|Survival/i.test(parsed.ability_type)) {
        // hero item variant
        items.push(parsed)
      } else {
        // unknown type: keep as item if it has a cost or rarity
        if (parsed.cost || parsed.rarity) items.push(parsed)
      }
    }
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return { slug, name, items, powers, sourceTitle }
}

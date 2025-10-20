#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'
import { parseHeroFromWikitext } from './parser'

function loadJSON<T=any>(p: string, fallback: any = []): T {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')) as T } catch { return fallback as T }
}

function ensureDir(p: string){ if (!fs.existsSync(p)) fs.mkdirSync(p,{recursive:true}) }

function slugify(s: string){
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
}

async function main(){
  const args = process.argv.slice(2)
  const wikiDir = args[0] || path.resolve(__dirname, '../lib/scrape-data-2/stadium_heroes_dump/wikitext')
  const heroesJsonPath = path.resolve(__dirname, '../data/stadium/heroes.json')

  if (!fs.existsSync(wikiDir) || !fs.statSync(wikiDir).isDirectory()){
    console.error(`Wiki dumps directory not found: ${wikiDir}`)
    process.exit(1)
  }

  const existingHeroes = loadJSON<any[]>(heroesJsonPath, [])
  const bySlug: Map<string, any> = new Map(existingHeroes.map(h => [h.slug, h]))

  const files = fs.readdirSync(wikiDir).filter(f => f.toLowerCase().endsWith('.txt'))
  let parsedCount = 0, updatedCount = 0, addedCount = 0, powerTotal = 0

  for (const file of files){
    const full = path.join(wikiDir, file)
    const src = fs.readFileSync(full, 'utf8')
    const sourceTitle = file.replace(/\.[^.]+$/,'').replace(/_/g,' ')
    const parsed = parseHeroFromWikitext(src, sourceTitle)
    if (!parsed) continue
    parsedCount++
    const slug = parsed.slug
    powerTotal += parsed.powers.length

    const existing = bySlug.get(slug)
    if (existing){
      // Merge powers (replace to keep canonical from wiki)
      existing.powers = parsed.powers
      updatedCount++
    } else {
      // Add new hero entry with just powers
      const heroEntry = {
        slug,
        name: parsed.name,
        role: parsed.role,
        description: parsed.description,
        items: [],
        powers: parsed.powers,
        sourceTitle: parsed.sourceTitle,
        imageFilenames: []
      }
      existingHeroes.push(heroEntry)
      bySlug.set(slug, heroEntry)
      addedCount++
    }
  }

  // Sort heroes by slug for stability
  existingHeroes.sort((a,b)=> String(a.slug).localeCompare(String(b.slug)))

  ensureDir(path.dirname(heroesJsonPath))
  fs.writeFileSync(heroesJsonPath, JSON.stringify(existingHeroes, null, 2), 'utf8')
  console.log(`Parsed files=${parsedCount} heroes updated=${updatedCount} added=${addedCount} totalPowers=${powerTotal}`)
}

main().catch(err=>{ console.error(err); process.exit(1) })

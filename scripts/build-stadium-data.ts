#!/usr/bin/env zx
import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { parseItemFromTemplate, findAbilityTemplates } from './parser'
import { parseHeroFromWikitext } from './parser'
import { StadiumItem } from '../types/stadium'
import { StadiumItemSchema } from '../types/stadium.zod' // (optional: see note below)

async function build({ dump, dumpItems, dumpHeroes, out, dryRun }: { dump?: string; dumpItems?: string; dumpHeroes?: string; out: string; dryRun: boolean }) {
  const items: StadiumItem[] = []
  const heroes: any[] = []

  // Helper: load index.json if present, else return null
  const readIndex = async (root?: string) => {
    if (!root) return null
    const p = path.join(root, 'index.json')
    if (!fs.existsSync(p)) return null
    return JSON.parse(await fs.promises.readFile(p, 'utf-8'))
  }

  // Helper: given a base (dump root or parent of wikitext), resolve a wikitext file path
  const resolveWikitextPath = (baseDir: string, wfile: string) => {
    const base = /stadium_/i.test(wfile) ? path.dirname(baseDir) : baseDir
    return path.resolve(base, wfile)
  }

  // Determine dumps using provided flags, fallback to legacy --dump if given
  const itemsRoot = dumpItems || dump
  const heroesRoot = dumpHeroes || dump

  // ITEMS: Prefer index.json, else scan wikitext dir if user provided it directly
  if (itemsRoot) {
    const idx = await readIndex(itemsRoot)
    if (idx) {
      const itemsEntry = idx.find((e: any) => /Stadium\/?Items/i.test(e.title) || /Items/i.test(e.title))
      if (itemsEntry) {
        const wfile = itemsEntry.wikitext_file || itemsEntry.wikitext || 'wikitext/Stadium_Items.txt'
        const wpath = resolveWikitextPath(itemsRoot, wfile)
        if (fs.existsSync(wpath)) {
          const src = await fs.promises.readFile(wpath, 'utf-8')
          const tpls = findAbilityTemplates(src)
          for (const tpl of tpls) {
            const it = parseItemFromTemplate(tpl, itemsEntry.title)
            if (it) items.push(it)
          }
        } else {
          console.warn('Items wikitext not found at', wpath)
        }
      }
    } else {
      // Fallback: itemsRoot may be a wikitext directory
      const wkDir = itemsRoot
      if (fs.existsSync(wkDir) && (await fs.promises.stat(wkDir)).isDirectory()) {
        const files = (await fs.promises.readdir(wkDir)).filter(f => f.endsWith('.txt'))
        for (const f of files) {
          const p = path.join(wkDir, f)
          const src = await fs.promises.readFile(p, 'utf-8')
          const tpls = findAbilityTemplates(src)
          for (const tpl of tpls) {
            const it = parseItemFromTemplate(tpl, f)
            if (it) items.push(it)
          }
        }
      }
    }
  }

  // HEROES: Prefer index.json, else scan wikitext directory
  if (heroesRoot) {
    const idx = await readIndex(heroesRoot)
    if (idx) {
      for (const entry of idx) {
        if (!/Stadium/i.test(entry.title)) continue
        const wfile = entry.wikitext_file || entry.wikitext || `wikitext/${entry.title}.txt`
        const wpath = resolveWikitextPath(heroesRoot, wfile)
        if (!fs.existsSync(wpath)) continue
        const src = await fs.promises.readFile(wpath, 'utf-8')
        const hero = parseHeroFromWikitext(src, entry.title)
        if (hero) heroes.push(hero)
      }
    } else {
      // Fallback: heroesRoot may be a wikitext directory
      const wkDir = heroesRoot
      if (fs.existsSync(wkDir) && (await fs.promises.stat(wkDir)).isDirectory()) {
        const files = (await fs.promises.readdir(wkDir)).filter(f => f.endsWith('.txt'))
        for (const f of files) {
          const p = path.join(wkDir, f)
          const src = await fs.promises.readFile(p, 'utf-8')
          const hero = parseHeroFromWikitext(src, f.replace(/_Stadium\.txt$/i, ''))
          if (hero) heroes.push(hero)
        }
      }
    }
  }

  // dedupe by slug
  const map = new Map(items.map(i => [i.slug, i]))
  const finalItems = Array.from(map.values())

  // (optional) validate with zod
  // for (const it of finalItems) StadiumItemSchema.parse(it)

  const outDir = path.resolve(out)
  if (!dryRun) {
    await fs.promises.mkdir(outDir, { recursive: true })

    // Attempt to locate images directory (from items/heroes roots)
    const imageCandidates: string[] = []
    const pushCandidates = (root?: string) => {
      if (!root) return
      imageCandidates.push(
        path.join(root, 'images'),
        path.join(path.dirname(root), 'images')
      )
      // Known subfolder names
      imageCandidates.push(
        path.join(path.dirname(root), 'stadium_items_dump', 'images'),
        path.join(path.dirname(root), 'stadium_heroes_dump', 'images')
      )
      // If root is a wikitext dir, include sibling images
      if (path.basename(root) === 'wikitext') {
        imageCandidates.push(path.join(path.dirname(root), 'images'))
      }
    }
    pushCandidates(itemsRoot)
    pushCandidates(heroesRoot)
    const uniq = Array.from(new Set(imageCandidates))
    const existing = uniq.filter(p => fs.existsSync(p))
  // Collect image filenames (we'll copy after writing JSON)
    const availableImages: string[] = []
    for (const dir of existing) {
      const imgs = await fs.promises.readdir(dir)
      for (const f of imgs) {
        availableImages.push(f)
      }
    }

    // Build a normalization map to resolve parsed names to actual files
    const normKey = (s: string) => s
      .toLowerCase()
      .replace(/[\s]+/g, '_')
      .replace(/["'`]/g, '_')
      .replace(/[^a-z0-9._-]/g, '_')

    const imageMap = new Map<string, string>()
    for (const f of availableImages) {
      imageMap.set(normKey(f), f)
    }

    const remapName = (name?: string) => {
      if (!name) return name
      const direct = imageMap.get(normKey(name))
      if (direct) return direct
      // Try common alternates
      const alt1 = name.replace(/\s+/g, '_')
      const alt2 = alt1.replace(/["'`]/g, '_')
      const alt3 = alt2.replace(/[^a-z0-9._-]/gi, '_')
      return imageMap.get(normKey(alt3)) || imageMap.get(normKey(alt2)) || imageMap.get(normKey(alt1)) || name
    }

    // Remap items images using available filenames
    for (const it of items) {
      if (Array.isArray(it.imageFilenames)) {
        it.imageFilenames = it.imageFilenames.map(n => remapName(n) || n)
      }
    }

    // Remap heroes powers images
    for (const h of heroes) {
      if (Array.isArray(h.powers)) {
        h.powers = h.powers.map((p: any) => ({ ...p, image: remapName(p.image) || p.image }))
      }
    }

    // Now write JSON after remapping
    await fs.promises.writeFile(path.join(outDir, 'items.json'), JSON.stringify(finalItems, null, 2), 'utf-8')
    await fs.promises.writeFile(path.join(outDir, 'heroes.json'), JSON.stringify(heroes, null, 2), 'utf-8')

    // Copy images into public directory
    const publicDir = path.join(process.cwd(), 'public', 'stadium')
    await fs.promises.mkdir(publicDir, { recursive: true })
    for (const dir of existing) {
      const imgs = await fs.promises.readdir(dir)
      for (const f of imgs) {
        const src = path.join(dir, f)
        const dst = path.join(publicDir, f)
        try { await fs.promises.copyFile(src, dst) } catch { /* ignore */ }
      }
    }

    // Write meta last
    const meta = { generatedAt: new Date().toISOString(), counts: { items: finalItems.length, heroes: heroes.length } }
    await fs.promises.writeFile(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf-8')

    console.log('Wrote', finalItems.length, 'items to', outDir)
  } else {
    console.log('Dry-run: would parse', finalItems.length, 'items')
    console.log(JSON.stringify(finalItems.slice(0, 3), null, 2))
  }
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('dump', { type: 'string', describe: 'Legacy: single dump folder (will be used for both items and heroes)' })
    .option('dumpItems', { type: 'string', describe: 'Path to items dump ROOT or items wikitext folder' })
    .option('dumpHeroes', { type: 'string', describe: 'Path to heroes dump ROOT or heroes wikitext folder' })
    .option('out', { type: 'string', default: './data/stadium', describe: 'Output directory' })
    .option('dry-run', { type: 'boolean', default: false, describe: 'Do not write files' })
    .strict()
    .help()
    .parseSync();

  const { dump, dumpItems, dumpHeroes, out, dryRun } = argv as any
  await build({ dump, dumpItems, dumpHeroes, out, dryRun })
}

main().catch(err => { console.error(err); process.exit(1) })

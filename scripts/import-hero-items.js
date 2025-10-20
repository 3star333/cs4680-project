#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/™/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function slugifyHeroName(name) {
  const base = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/--+/g, '-')
  const overrides = {
    'l-cio': 'lucio',
    'd-va': 'dva',
    'torbj-rn': 'torbjorn',
    'soldier--76': 'soldier-76'
  }
  return overrides[base] || base
}

function readCSV(csvPath) {
  const raw = fs.readFileSync(csvPath, 'utf8')
  const lines = raw.split(/\r?\n/).filter(Boolean)
  const header = lines.shift().split(',')
  return lines.map(l => {
    // simple CSV split: there are no quoted commas in this dataset
    const parts = l.split(',')
    const obj = {}
    for (let i = 0; i < header.length; i++) obj[header[i]] = parts[i]
    return obj
  })
}

function ensureDirExists(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

async function main() {
  const csvArg = process.argv[2]
  const imagesRootArg = process.argv[3] // optional: base dir containing manifest's saved_path files
  if (!csvArg) {
    console.error('Usage: import-hero-items.js <path-to-hero_items_manifest.csv>')
    process.exit(2)
  }
  const csvPath = path.resolve(csvArg)
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath)
    process.exit(2)
  }

  const rows = readCSV(csvPath)
  const imagesRoot = imagesRootArg ? path.resolve(imagesRootArg) : null

  const itemsJsonPath = path.resolve(__dirname, '../data/stadium/items.json')
  let items = []
  if (fs.existsSync(itemsJsonPath)) {
    try { items = JSON.parse(fs.readFileSync(itemsJsonPath, 'utf8')) } catch(e) { items = [] }
  }

  const bySlug = new Map(items.map(it => [it.slug, it]))

  let added = 0, updated = 0
  const publicItemsRoot = path.resolve(__dirname, '../public/assets/items')
  for (const r of rows) {
    const hero = (r.hero || r.hero).trim()
    const pageTitle = (r.page_title || r['page_title'] || '').trim()
    const itemName = (r.item_name || r['item_name'] || '').trim()
    const savedPath = (r.saved_path || r['saved_path'] || '').trim()
    if (!itemName) continue

    const slug = slugify(itemName.replace(/\.png$|\.svg$|\.jpg$|\.jpeg$/i, ''))
    const filename = path.basename(savedPath)
    const heroSlug = slugifyHeroName(hero)
    // map to public /assets/items/<hero>/<filename>
    const assetPath = `/assets/items/${heroSlug}/${filename}`

    let it = bySlug.get(slug)
    if (!it) {
      it = {
        slug,
        name: itemName,
        heroSlug,
        description: '',
        tags: [],
        buffs: [],
        sourceTitle: pageTitle || '',
        imageFilenames: [assetPath]
      }
      items.push(it)
      bySlug.set(slug, it)
      added++
    } else {
      // ensure heroSlug
      if (!it.heroSlug) it.heroSlug = heroSlug
      it.sourceTitle = it.sourceTitle || pageTitle || it.sourceTitle
      it.imageFilenames = it.imageFilenames || []
      if (!it.imageFilenames.includes(assetPath)) {
        it.imageFilenames.push(assetPath)
        updated++
      }
    }

    // Optional: copy asset to public if imagesRoot provided and file exists
    if (imagesRoot && savedPath) {
      const src = path.resolve(imagesRoot, savedPath)
      const destDir = path.join(publicItemsRoot, heroSlug)
      const dest = path.join(destDir, filename)
      try {
        if (fs.existsSync(src)) {
          ensureDirExists(destDir)
          // only copy if not exists or size differs
          let doCopy = true
          if (fs.existsSync(dest)) {
            try {
              const s1 = fs.statSync(src), s2 = fs.statSync(dest)
              if (s1.size === s2.size) doCopy = false
            } catch {}
          }
          if (doCopy) fs.copyFileSync(src, dest)
        }
      } catch (e) {
        // ignore copy errors, continue
      }
    }
  }

  // sort by slug
  items.sort((a,b)=> (a.slug||'').localeCompare(b.slug||''))

  // Cleanup pass: normalize heroSlug and image paths
  const replaceMap = [
    ['/assets/items/l-cio/', '/assets/items/lucio/'],
    ['/assets/items/d-va/', '/assets/items/dva/'],
    ['/assets/items/torbj-rn/', '/assets/items/torbjorn/'],
    ['/assets/items/soldier--76/', '/assets/items/soldier-76/']
  ]
  for (const it of items) {
    if (it.heroSlug) it.heroSlug = slugifyHeroName(it.heroSlug)
    if (Array.isArray(it.imageFilenames)) {
      const cleaned = []
      const seen = new Set()
      for (let p of it.imageFilenames) {
        for (const [from,to] of replaceMap) {
          if (p.includes(from)) p = p.replace(from,to)
        }
        if (!seen.has(p)) { seen.add(p); cleaned.push(p) }
      }
      it.imageFilenames = cleaned
    }
  }

  ensureDirExists(path.dirname(itemsJsonPath))
  fs.writeFileSync(itemsJsonPath, JSON.stringify(items, null, 2), 'utf8')

  console.log(`Imported manifest: rows=${rows.length} added=${added} updated=${updated} outfile=${itemsJsonPath}`)
}

main().catch(e=>{ console.error(e); process.exit(1) })

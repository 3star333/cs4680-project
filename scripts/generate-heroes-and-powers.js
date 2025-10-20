#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function slugify(s){
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
}

function titleCaseSlug(slug){
  return slug.split('-').map(w=> w ? (w[0].toUpperCase()+w.slice(1)) : w).join(' ')
}

function normalizeHeroSlugLike(s){
  const base = slugify(s).replace(/--+/g,'-')
  const overrides = {
    'l-cio': 'lucio',
    'lcio': 'lucio',
    'd-va': 'dva',
    'torbj-rn': 'torbjorn',
    'torbjrn': 'torbjorn',
  }
  return overrides[base] || base
}

function loadJSON(p){
  try { return JSON.parse(fs.readFileSync(p,'utf8')) } catch { return [] }
}

function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p,{recursive:true}) }

async function main(){
  const itemsPath = path.resolve(__dirname,'../data/stadium/items.json')
  const outHeroesPath = path.resolve(__dirname,'../data/stadium/heroes.json')
  const outPowersPath = path.resolve(__dirname,'../data/stadium/powers.json')
  const items = loadJSON(itemsPath)
  const imagesRootArg = process.argv[2] || ''

  // Derive heroes from items: collect heroSlug and infer name from sourceTitle or slug
  const heroesMap = new Map()
  for (const it of items){
    const heroSlug = it.heroSlug && normalizeHeroSlugLike(String(it.heroSlug))
    if (!heroSlug) continue
    if (!heroesMap.has(heroSlug)){
      let name = titleCaseSlug(heroSlug)
      if (it.sourceTitle && it.sourceTitle.includes('/')){
        name = it.sourceTitle.split('/')[0].replace(/\s+/g,' ').trim()
      }
      heroesMap.set(heroSlug, {
        slug: heroSlug,
        name,
        role: undefined,
        description: undefined,
        items: [],
        powers: [],
        sourceTitle: it.sourceTitle || '',
        imageFilenames: []
      })
    }
  }

  // Group items per hero
  for (const it of items){
    const heroSlug = it.heroSlug && normalizeHeroSlugLike(String(it.heroSlug))
    if (!heroSlug) continue
    const h = heroesMap.get(heroSlug)
    if (h) h.items.push(it)
  }

  // Augment heroes from images root if provided
  if (imagesRootArg){
    const tryDirs = [
      path.resolve(imagesRootArg, 'hero_item_assets_v2/images'),
      path.resolve(imagesRootArg, 'images'),
      path.resolve(imagesRootArg)
    ]
    let imagesDir = ''
    for (const d of tryDirs) if (fs.existsSync(d) && fs.statSync(d).isDirectory()) { imagesDir = d; break }
    if (imagesDir){
      const entries = fs.readdirSync(imagesDir, { withFileTypes: true })
      for (const ent of entries){
        if (!ent.isDirectory()) continue
        const raw = ent.name
        const heroSlug = normalizeHeroSlugLike(raw)
        if (!heroSlug) continue
        if (!heroesMap.has(heroSlug)){
          heroesMap.set(heroSlug, {
            slug: heroSlug,
            name: titleCaseSlug(heroSlug),
            role: undefined,
            description: undefined,
            items: [],
            powers: [],
            sourceTitle: '',
            imageFilenames: []
          })
        }
      }
    }
  }

  // Derive "powers" from items that look like global power icons (svg, generic names)
  // Simple heuristic: if item name ends with .svg and is one of a known set, treat as power
  const canonicalPowerNames = ['AbilityPower','AbilityLifesteal','AttackSpeed','CooldownReduction','MaxAmmo','MoveSpeed','MeleeDamage','WeaponPower','WeaponLifesteal','StadiumCash','StadiumArmor','StadiumStar','StadiumShields']
  const powerNameSet = new Set(canonicalPowerNames.map(n=>n.replace(/\s+/g,'')))
  const powersMap = new Map()
  for (const it of items){
    const base = it.name.replace(/\.(svg|png|jpg|jpeg)$/i,'')
    const simple = base.replace(/\s+/g,'')
    if (powerNameSet.has(simple)){
      const slug = slugify(simple)
      const icon = (it.imageFilenames && it.imageFilenames[0]) || ''
      if(!powersMap.has(slug)) powersMap.set(slug, { slug, name: base, icon })
    }
  }

  const heroes = Array.from(heroesMap.values()).sort((a,b)=> a.slug.localeCompare(b.slug))
  const powers = Array.from(powersMap.values()).sort((a,b)=> a.slug.localeCompare(b.slug))

  ensureDir(path.dirname(outHeroesPath))
  fs.writeFileSync(outHeroesPath, JSON.stringify(heroes,null,2),'utf8')
  fs.writeFileSync(outPowersPath, JSON.stringify(powers,null,2),'utf8')
  console.log(`Wrote heroes=${heroes.length} powers=${powers.length}`)
}

main().catch(e=>{ console.error(e); process.exit(1) })

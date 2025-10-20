import fs from 'fs'
import path from 'path'

const dataDir = path.resolve(process.cwd(), 'data', 'stadium')
const publicAssets = path.resolve(process.cwd(), 'public', 'assets')

function ensure(dir:string){ if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) }

function copyIfExists(src:string, dest:string){ if(fs.existsSync(src)){ fs.copyFileSync(src, dest); return true } return false }

async function main(){
  ensure(publicAssets)
  ensure(path.join(publicAssets,'heroes'))
  ensure(path.join(publicAssets,'items'))
  ensure(path.join(publicAssets,'powers'))

  // This script expects some raw manifests: data/stadium/raw_heroes.json etc.
  const rawHeroes = path.join(dataDir, 'raw_heroes.json')
  const rawItems = path.join(dataDir, 'raw_items.json')
  const rawPowers = path.join(dataDir, 'raw_powers.json')

  const heroesOut:any[] = []
  const itemsOut:any[] = []
  const powersOut:any[] = []

  // Read raw heroes
  if(fs.existsSync(rawHeroes)){
    const arr = JSON.parse(fs.readFileSync(rawHeroes,'utf8'))
    for(const h of arr){
      const slug = h.slug || h.name.toLowerCase().replace(/\s+/g,'-')
      const src = h.portraitPath || h.portrait || ''
      const destFile = `${slug}.png`
      const dest = path.join(publicAssets, 'heroes', destFile)
      if(copyIfExists(path.resolve(process.cwd(), src), dest)){
        heroesOut.push({ slug, name: h.name, portrait: `/assets/heroes/${destFile}` })
      } else {
        console.warn('missing hero image', src)
        heroesOut.push({ slug, name: h.name, portrait: `/assets/heroes/${destFile}` })
      }
    }
  }

  // Raw items
  if(fs.existsSync(rawItems)){
    const arr = JSON.parse(fs.readFileSync(rawItems,'utf8'))
    for(const it of arr){
      const slug = it.slug || it.name.toLowerCase().replace(/\s+/g,'-')
      const hero = it.heroSlug || 'common'
      const subdir = path.join(publicAssets,'items', hero)
      ensure(subdir)
      const src = it.imagePath || it.image || ''
      const destFile = `${slug}.png`
      const dest = path.join(subdir, destFile)
      if(copyIfExists(path.resolve(process.cwd(), src), dest)){
        itemsOut.push({ slug, name: it.name, heroSlug: it.heroSlug, image: `/assets/items/${hero}/${destFile}` })
      } else {
        console.warn('missing item image', src)
        itemsOut.push({ slug, name: it.name, heroSlug: it.heroSlug, image: `/assets/items/${hero}/${destFile}` })
      }
    }
  }

  // Raw powers
  if(fs.existsSync(rawPowers)){
    const arr = JSON.parse(fs.readFileSync(rawPowers,'utf8'))
    for(const p of arr){
      const slug = p.slug || p.name.toLowerCase().replace(/\s+/g,'-')
      const src = p.iconPath || p.icon || ''
      const destFile = `${slug}.png`
      const dest = path.join(publicAssets, 'powers', destFile)
      if(copyIfExists(path.resolve(process.cwd(), src), dest)){
        powersOut.push({ slug, name: p.name, icon: `/assets/powers/${destFile}` })
      } else {
        console.warn('missing power image', src)
        powersOut.push({ slug, name: p.name, icon: `/assets/powers/${destFile}` })
      }
    }
  }

  // write outputs
  ensure(dataDir)
  fs.writeFileSync(path.join(dataDir,'heroes.json'), JSON.stringify(heroesOut, null, 2))
  fs.writeFileSync(path.join(dataDir,'items.json'), JSON.stringify(itemsOut, null, 2))
  fs.writeFileSync(path.join(dataDir,'powers.json'), JSON.stringify(powersOut, null, 2))

  console.log('refactor-assets: wrote', heroesOut.length, 'heroes,', itemsOut.length, 'items,', powersOut.length, 'powers')
}

main().catch(err=>{ console.error(err); process.exit(1) })

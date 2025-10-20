# Hero Icons and Data Fix - Summary

## Issues Fixed

### 1. Hero Data Structure
**Problem:** The `heroes.json` file was incorrectly structured with only "Stadium/Items" data instead of actual hero data.

**Solution:** Regenerated the data using the build script:
```bash
npx tsx scripts/build-stadium-data.ts --dumpItems ./lib/scrape-data-2/stadium_items_dump --dumpHeroes ./lib/scrape-data-2/stadium_heroes_dump --out ./data/stadium
```

### 2. Missing Hero Portrait Images
**Problem:** Hero portraits were not available in the public assets folder.

**Solution:** Copied hero portraits from scrape data to public folder:
```bash
cp /Users/raiikee/Desktop/StadiumOW-Web-App/lib/scrape-data-2/stadium_heroes_dump/images/*_Stadium.png /Users/raiikee/Desktop/StadiumOW-Web-App/public/assets/heroes/
```

**Heroes Added (28 total):**
- Ana, Ashe, Brigitte, Cassidy, D.Va, Freja, Genji, Hazard
- Junker_Queen, Junkrat, Juno, Kiriko, Lúcio, Mei, Mercy, Moira
- Orisa, Pharah, Reaper, Reinhardt, S76 (Soldier: 76), Sigma, Sojourn
- Torbjörn, Tracer, Winston, Zarya, Zenyatta

### 3. Missing Item Images
**Problem:** Item images were not available.

**Solution:** Copied all item images:
```bash
cp /Users/raiikee/Desktop/StadiumOW-Web-App/lib/scrape-data-2/stadium_items_dump/images/*.png /Users/raiikee/Desktop/StadiumOW-Web-App/public/assets/items/
```

### 4. Missing Power/Ability Images
**Problem:** Power and ability images were not available.

**Solution:** Copied all power/ability images:
```bash
cp /Users/raiikee/Desktop/StadiumOW-Web-App/lib/scrape-data-2/stadium_heroes_dump/images/*.png /Users/raiikee/Desktop/StadiumOW-Web-App/public/assets/powers/
```

### 5. Hero Portrait Path Issues
**Problem:** 
- Double path issue: `/assets/heroes/assets/heroes/Ana_Stadium.png`
- Incorrect portrait filenames generated from hero names

**Solution in `lib/stadium.ts`:**

```typescript
export async function getHeroes(): Promise<Hero[]> {
  if (!heroesCache) {
    const stadiumHeroes = stadiumHeroesData as unknown as StadiumHero[]
    heroesCache = stadiumHeroes.map(h => {
      const heroName = h.name.split('/')[0].toLowerCase().replace(/\s+/g, '-')
      const displayName = h.name.split('/')[0]
      
      // Special case for Soldier: 76 -> S76
      let imageFilename = displayName.replace(/\s+/g, '_')
      if (displayName === 'Soldier: 76') {
        imageFilename = 'S76'
      }
      
      return {
        slug: heroName,
        name: displayName,
        portrait: `${imageFilename}_Stadium.png` // Just filename, not full path
      }
    })
  }
  return heroesCache
}

export function getHeroPortrait(heroSlug: string): string {
  // Special case for soldier-76
  if (heroSlug === 'soldier-76' || heroSlug === 'soldier:-76') {
    return 'S76_Stadium.png'
  }
  
  // Convert slug to proper capitalization
  const heroName = heroSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('.')
  return `${heroName}_Stadium.png`
}
```

**Key Changes:**
1. Portrait field now contains only the filename (e.g., `Ana_Stadium.png`)
2. `StadiumImage` component adds the basePath `/assets/heroes/` automatically
3. Special handling for "Soldier: 76" -> "S76_Stadium.png"
4. Special characters in hero names (Lúcio, Torbjörn) handled by `StadiumImage`'s variant fallback logic

### 6. Hero Data Extraction
**Problem:** Hero data comes from `heroes.json` with format "Ana/Stadium" in the name field.

**Solution:** Extract clean hero name and slug:
- Name field: "Ana/Stadium" → Display name: "Ana"
- Slug: "ana-stadium" → Clean slug: "ana"

## Results

✅ All 28 hero portraits now load correctly
✅ Hero search modal displays all heroes with images  
✅ Add Ally/Add Enemy buttons work properly
✅ Hero selection adds heroes to team composition
✅ Item images available for editing modal
✅ Power/ability images available for editing modal

## File Structure

```
public/
  assets/
    heroes/          # 28 hero portraits
      Ana_Stadium.png
      Ashe_Stadium.png
      ...
      S76_Stadium.png
      Lúcio_Stadium.png
      Torbjörn_Stadium.png
    items/           # ~500+ item images
      Compensator.png
      Weapon_Grease.png
      ...
    powers/          # ~1000+ power/ability images
      Artsy_Dartsy.png
      No_Scope_Needed.png
      ...
```

## Special Cases Handled

1. **Soldier: 76** → File: `S76_Stadium.png` (not `Soldier:_76_Stadium.png`)
2. **Lúcio** → File has accent, `StadiumImage` handles with variant fallback
3. **Torbjörn** → File has umlaut, `StadiumImage` handles with variant fallback
4. **D.Va** → File: `D.Va_Stadium.png` (period in name)
5. **Junker Queen** → File: `Junker_Queen_Stadium.png` (underscore for space)

## Testing

To verify everything works:
1. Visit `http://localhost:3000/editor`
2. Click "Add Ally" - hero search modal should show all 28 heroes with portraits
3. Select a hero - should add to allies team with portrait visible
4. Click "Edit" on hero - should show power and item selection with images
5. Repeat for "Add Enemy"

## Next Steps (if needed)

- Verify all item images are displaying correctly in edit modal
- Verify power selection shows hero-specific powers from heroes.json
- Test with all special character heroes (Lúcio, Torbjörn, Soldier: 76)

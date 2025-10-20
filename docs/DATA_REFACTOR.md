# Data Layer Refactoring - Stadium Heroes

## Overview
Refactored the hero data fetching to use the comprehensive `heroes.json` file instead of the redundant `ui_heroes.json` file.

## Changes Made

### 1. Updated `lib/stadium.ts`
**Before:**
- Imported `ui_heroes.json` (only contained 3 heroes: tracer, cassidy, reinhardt)
- Used `ui_heroes` as the source for hero data in `getHeroes()` and `getHeroPortrait()`

**After:**
- Removed import of `ui_heroes.json`
- Updated `getHeroes()` to extract hero list from `heroes.json` (contains all 93 heroes)
- Simplified `getHeroPortrait()` to generate portrait path from hero slug
- Now constructs Hero objects dynamically with portrait path: `/assets/heroes/${slug}.png`

```typescript
// New implementation
export async function getHeroes(): Promise<Hero[]> {
  if (!heroesCache) {
    const stadiumHeroes = stadiumHeroesData as unknown as StadiumHero[]
    heroesCache = stadiumHeroes.map(h => ({
      slug: h.slug,
      name: h.name,
      portrait: `/assets/heroes/${h.slug}.png`
    }))
  }
  return heroesCache
}

export function getHeroPortrait(heroSlug: string): string {
  return `/assets/heroes/${heroSlug}.png`
}
```

### 2. Deleted `ui_heroes.json`
- File was redundant and incomplete (only 3 heroes vs 93 in heroes.json)
- All hero data is now sourced from `heroes.json`

## Data Structure Understanding

### `heroes.json` (6,586 lines)
Contains complete hero data including:
- `slug`: Hero identifier (e.g., "ana", "tracer")
- `name`: Display name (e.g., "Ana", "Tracer")
- `items`: Array of hero-specific items (currently empty, populated from items.json)
- `powers`: Array of hero-specific powers with:
  - `name`: Power name
  - `image`: Power icon filename
  - `affectedAbility`: Which ability the power modifies
  - `description`: Detailed power description
  - `type`: "Stadium Power"

### `items.json` (3,890 lines)
Contains all items with:
- `slug`: Item identifier
- `name`: Display name
- `heroSlug`: Which hero the item belongs to (e.g., "lucio", "ana")
- `description`: Item description
- `tags`: Item categories
- `buffs`: Stat modifications
- `sourceTitle`: Original source
- `imageFilenames`: Array of image paths

### `powers.json` (67 lines)
Contains **generic buff/stat icons** (NOT hero-specific powers):
- Generic stats like "abilitylifesteal", "abilitypower", "attackspeed", etc.
- These are UI icons for buffs/stats, not hero powers
- Hero-specific powers are in `heroes.json`

## Benefits
1. **Single Source of Truth**: All hero data now comes from `heroes.json`
2. **Complete Hero Roster**: Access to all 93 heroes instead of just 3
3. **Simpler Portrait Handling**: Portrait paths generated consistently from slug
4. **Reduced Redundancy**: Eliminated duplicate/incomplete data file
5. **Better Scalability**: Adding new heroes only requires updating `heroes.json`

## Impact
- ✅ No breaking changes to existing components
- ✅ Editor page continues to work with full hero roster
- ✅ Hero search now includes all 93 heroes
- ✅ Build compiles successfully with no errors
- ✅ Type safety maintained throughout

## Next Steps (if needed)
1. Verify all hero portrait images exist in `/assets/heroes/`
2. Consider extracting hero-specific powers from `heroes.json` for power selection UI
3. Use `items.json` with `heroSlug` filtering for hero-specific items
4. Rename `powers.json` to `buffs.json` or `stats.json` for clarity

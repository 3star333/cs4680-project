# Powers Extraction Summary

## Task Completed ✅

Successfully extracted all hero-specific powers from `heroes.json` and saved them to `powers.json`.

## What Was Done

### 1. Extracted Powers from heroes.json
- Parsed all 28 heroes in `heroes.json`
- Collected all powers from each hero's `powers` array (starting at line 703)
- Removed duplicates (same power name + image combination)
- Sorted alphabetically by power name

### 2. Created Standardized Power Objects

Each power now has the following structure:
```json
{
  "slug": "power-name-kebab-case",
  "name": "Power Display Name",
  "icon": "Power_Icon_Image.png",
  "affectedAbility": "Ability Name",
  "description": "Power description with effects",
  "type": "Stadium Power"
}
```

### 3. Results

**File:** `/data/stadium/powers.json`
- **Total Powers:** 342 unique hero powers
- **File Size:** 94KB
- **Format:** JSON array, sorted alphabetically
- **Structure:** Consistent with Power type interface

## Sample Powers

```json
[
  {
    "slug": "2-frag-2-frurious",
    "name": "2 Frag 2 Frurious",
    "icon": "2_Frag_2_Frurious.png",
    "affectedAbility": "Frag Launcher",
    "description": "[Frag Launcher] has a 25% chance to shoot an additional projectile that deals 66% reduced damage.",
    "type": "Stadium Power"
  },
  {
    "slug": "advanced-throwbotics",
    "name": "Advanced Throwbotics",
    "icon": "Advanced_Throwbotics.png",
    "affectedAbility": "Javelin Spin",
    "description": "When you use Javelin Spin, launch an Energy Javelin with 75% damage",
    "type": "Stadium Power"
  }
]
```

## Power Categories (by affected ability)

The 342 powers affect various hero abilities including:
- Primary weapons (The Viper, Biotic Rifle, Fusion Driver, etc.)
- Secondary abilities (Coach Gun, Sleep Dart, Deflect, etc.)
- Mobility abilities (Guardian Angel, Recall, Charge, etc.)
- Ultimate abilities (Nano Boost, Dragon Blade, Configuration: Artillery, etc.)
- Passive abilities and general effects

## Heroes with Powers

All 28 heroes now have their powers catalogued:
- Ana (12+ powers)
- Ashe (12+ powers)
- Brigitte (12+ powers)
- Cassidy (12+ powers)
- D.Va (14+ powers for Pilot and Mech forms)
- Genji (12+ powers)
- Hazard (12+ powers)
- Junker Queen (12+ powers)
- Junkrat (12+ powers)
- Juno (12+ powers)
- Kiriko (12+ powers)
- Lúcio (12+ powers)
- Mei (12+ powers)
- Mercy (12+ powers)
- Moira (12+ powers)
- Orisa (12+ powers)
- Pharah (12+ powers)
- Reaper (12+ powers)
- Reinhardt (12+ powers)
- Sigma (12+ powers)
- Soldier: 76 (12+ powers)
- Sojourn (12+ powers)
- Torbjörn (12+ powers)
- Tracer (12+ powers)
- Winston (12+ powers)
- Zarya (12+ powers)
- Zenyatta (12+ powers)
- Freja (12+ powers)

## Integration

The powers are now available through the existing `getPowers()` function in `lib/stadium.ts`:

```typescript
export async function getPowers(): Promise<Power[]> {
  if (!powersCache) powersCache = (powersData as unknown as Power[]) || []
  return powersCache
}
```

This function is already being used in:
- `/app/editor/page.tsx` - Loads powers for the edit modal
- Hero edit modal - Displays powers for selection

## Power Icons

All power icons are available in `/public/assets/powers/` directory:
- 1000+ power/ability images copied from scrape data
- Icons referenced by the `icon` field in each power object
- Displayed using the `StadiumImage` component with basePath `/assets/powers/`

## Next Steps

The powers are now ready to be used in the editor:
1. ✅ Power selection modal can display all 342 powers
2. ✅ Each power shows its icon, name, and affected ability
3. ✅ Powers are sorted alphabetically for easy browsing
4. ✅ Power descriptions explain the effect
5. Optional: Filter powers by hero or affected ability for better UX

## Verification

To verify the powers are working:
1. Visit http://localhost:3000/editor
2. Add a hero to allies or enemies
3. Click "Edit" on the hero
4. The power selection should now show 342 powers instead of the old generic stats
5. Each power should have an icon from `/assets/powers/`

## File Changes

- ✅ `/data/stadium/powers.json` - Created with 342 powers (94KB)
- ✅ `/lib/stadium.ts` - Already configured to load powers.json
- ✅ `/public/assets/powers/` - Contains all power icons

## Notes

- Powers are hero-specific and describe actual Stadium gamemode abilities
- Each hero has approximately 12-14 unique powers
- Some powers affect the same ability but in different ways
- Power descriptions use game-specific formatting (e.g., `[Ability Name]`, `{{stat}}`)
- The `affectedAbility` field helps identify which hero ability the power modifies

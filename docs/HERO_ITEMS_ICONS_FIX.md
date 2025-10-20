# Hero-Specific Item Icons Fix

## Issue
Hero-specific item images from `heroes.json` were returning 404 errors because they weren't copied to the `/public/assets/items/` folder.

## Root Cause
When we initially copied item images, we only copied from `stadium_items_dump/images/` to `/public/assets/items/`. However, hero-specific items have their images stored in `stadium_heroes_dump/images/` (the same location as powers and ability icons).

## Error Examples
```
GET /assets/items/Mid-air_Mobilizer.png 404
GET /assets/items/Celestial_Clip.png 404
GET /assets/items/Caduceus_EX.png 404
GET /assets/items/Resurrection_Rangefinder.png 404
GET /assets/items/Long_Distance_Wings.png 404
GET /assets/items/Angelic_Acrobatics.png 404
```

## Solution
Copied all images from `stadium_heroes_dump/images/` to `/public/assets/items/` so hero-specific item icons are available alongside general items.

```bash
cp /lib/scrape-data-2/stadium_heroes_dump/images/*.png /public/assets/items/
```

## Result
- ✅ 914 additional images copied to `/public/assets/items/`
- ✅ Hero-specific items now display correctly in the edit modal
- ✅ All hero item images accessible from `/assets/items/` path
- ✅ No more 404 errors for hero-specific item icons

## Image Distribution

### Before Fix:
- `/public/assets/heroes/` - 28 hero portraits ✅
- `/public/assets/items/` - ~100 general item images ✅
- `/public/assets/powers/` - ~1000 power/ability icons ✅
- Hero-specific item images: Missing ❌

### After Fix:
- `/public/assets/heroes/` - 28 hero portraits ✅
- `/public/assets/items/` - ~1000 images (general + hero-specific) ✅
- `/public/assets/powers/` - ~1000 power/ability icons ✅
- Hero-specific item images: Available ✅

## Why This Happened

The image organization in the scrape data is:
- `stadium_items_dump/images/` - General items only
- `stadium_heroes_dump/images/` - Hero portraits, powers, AND hero-specific items

Since hero-specific items are part of each hero's data structure in `heroes.json`, their images are stored with the hero data, not in the general items dump.

## Verification

Hero-specific items that now work:
- **Mercy items:** Mid-air_Mobilizer.png, Celestial_Clip.png, Caduceus_EX.png, Resurrection_Rangefinder.png, Long_Distance_Wings.png, Blessed_Boosters.png, Angeleisure_Wear.png, Aerodynamic_Feathers.png, Angelic_Acrobatics.png, Chain_Evoker.png, Glass_Extra_Full.png

- **Other hero items:** Monarch_s_Decree.png, Tinker_Tracksuit.png, Shred_and_Lead.png, Bigger_Magnet.png, Bloodhound_Mask.png, Gutpunch_Gauntlet.png, Booming_Voice.png, Slicing_Spree.png, Scav_Scraps.png, Rebellious_Spirit.png, Dez_s_Damage_Dampeners.png, Undying_Loyalty.png, Thick_Skull.png

## Testing
1. Visit http://localhost:3000/editor
2. Add any hero (e.g., Mercy, Ana, Genji)
3. Click "Edit" on the hero
4. Scroll through items
5. ✅ All hero-specific item icons now display correctly
6. ✅ No 404 errors in console

## Technical Notes

### Image Path Resolution
The `StadiumImage` component with `basePath="/assets/items/"` now correctly finds:
1. General items (from `stadium_items_dump`)
2. Hero-specific items (from `stadium_heroes_dump`)
3. All images accessible from single path

### Duplicate Prevention
Some images may exist in both dumps (e.g., ability icons used as item icons). The copy command overwrites duplicates, ensuring the most recent version is used.

## Complete Asset Inventory

```
/public/assets/
├── heroes/          # 28 files  (~2MB)
│   ├── Ana_Stadium.png
│   ├── Mercy_Stadium.png
│   └── ...
├── items/           # ~1014 files (~15MB) 
│   ├── Compensator.png          (general)
│   ├── Mid-air_Mobilizer.png    (hero-specific)
│   ├── Caduceus_EX.png          (hero-specific)
│   └── ...
└── powers/          # ~1000 files (~20MB)
    ├── Artsy_Dartsy.png
    ├── No_Scope_Needed.png
    └── ...
```

## Future Considerations

If hero-specific items continue to be added:
1. Re-run the copy command to update item images
2. Or modify the build script to automatically copy from both sources
3. Consider organizing items into subdirectories (general/, hero-specific/)

## Related Documentation
- `/docs/ICONS_FIX.md` - Initial icon setup
- `/docs/HERO_FILTERING_AND_STRATEGY.md` - Hero-specific filtering implementation

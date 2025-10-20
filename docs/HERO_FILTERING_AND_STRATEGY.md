# Hero-Specific Powers & Items + Strategy Plan Button

## Features Implemented ✅

### 1. Hero-Specific Powers Filter
When you click "Edit" on a hero, the power selection modal now shows **only** that hero's specific powers instead of all 342 powers.

**Implementation:**
- Added `getHeroPowers(heroSlug)` function in `lib/stadium.ts`
- Extracts powers from the hero's `powers` array in `heroes.json`
- Each hero has approximately 12-14 unique powers
- Powers are filtered based on the currently selected hero's slug

**Benefits:**
- ✅ Faster power selection (12 powers vs 342)
- ✅ Only relevant powers shown
- ✅ Better UX - no scrolling through irrelevant powers
- ✅ Accurate to Stadium gamemode mechanics

### 2. Hero-Specific Items Integration
Item selection now includes **hero-specific items** from `heroes.json` combined with general items.

**Implementation:**
- Added `getHeroSpecificItems(heroSlug)` function in `lib/stadium.ts`
- Extracts items from the hero's `items` array in `heroes.json`
- Combines hero-specific items with general items (those without `heroSlug`)
- Items are displayed together in the edit modal

**How it works:**
1. When editing a hero (e.g., Ana):
   - Gets Ana's specific items from `heroes.json` (e.g., "Target Tracker", "Quick Scope")
   - Gets all general items from `items.json` (e.g., "Compensator", "Weapon Grease")
   - Combines both lists for selection

**Benefits:**
- ✅ Hero-specific items appear first
- ✅ Still access to general items
- ✅ More authentic to Stadium gamemode
- ✅ Better item organization

### 3. Generate Strategy Plan Button
New button to generate AI-powered strategy recommendations based on your team composition.

**Features:**
- 🎯 Purple gradient button with robot emoji
- 📊 Analyzes both ally and enemy teams
- 🤖 Uses AI (GPT-4o-mini) to generate strategy
- 📝 Provides comprehensive tactical advice
- ⏳ Shows "Generating..." state while processing
- 🚫 Disabled when no heroes are selected

**Strategy Includes:**
1. Team composition analysis (strengths/weaknesses)
2. Recommended playstyle and positioning
3. Key synergies between heroes, powers, and items
4. Counter-strategies against enemy team
5. Win conditions and objectives
6. Potential risks and mitigation

## Code Changes

### `/lib/stadium.ts`
Added two new functions:

```typescript
// Get hero-specific powers by hero slug
export function getHeroPowers(heroSlug: string): Power[]

// Get hero-specific items by hero slug  
export function getHeroSpecificItems(heroSlug: string): StadiumItem[]
```

Both functions:
- Search `heroes.json` for the matching hero
- Handle special cases (Soldier: 76)
- Return properly formatted data structures
- Return empty array if hero not found

### `/app/editor/page.tsx`
Major updates:

1. **New imports:**
   - `useMemo` from React
   - `getHeroPowers` and `getHeroSpecificItems` from lib/stadium

2. **New state:**
   - `isGeneratingPlan` - tracks strategy generation status

3. **New computed values:**
   - `heroPowers` - filtered powers for currently editing hero
   - `heroItems` - hero-specific + general items for editing hero

4. **New function:**
   - `handleGenerateStrategyPlan()` - calls API to generate strategy

5. **Updated modal:**
   - `HeroEditModal` now receives `heroPowers` and `heroItems`
   - Automatically filters based on selected hero

6. **New UI:**
   - "Generate Strategy Plan" button
   - Loading state with emoji
   - Disabled state when no heroes selected

### `/app/api/plan/route.ts`
Enhanced API to handle new composition format:

1. **Updated schema:**
   - Made legacy fields optional
   - Added new `composition` object type
   - Supports both old and new formats

2. **New handler:**
   - Detects `composition` format
   - Builds custom strategy prompt
   - Calls LLM with proper message structure
   - Returns formatted strategy plan

3. **Prompt structure:**
   - System: Expert strategist persona
   - User: Detailed composition breakdown
   - Includes heroes, powers, and items for both teams
   - Requests specific strategy categories

## Usage

### Hero-Specific Powers & Items:
1. Visit http://localhost:3000/editor
2. Add a hero (e.g., Ana) to allies
3. Click "Edit" on Ana
4. **Powers tab:** See only Ana's 12 powers (not all 342)
5. **Items section:** See Ana's specific items + general items

### Generate Strategy Plan:
1. Add heroes to allies and/or enemies
2. Optionally select powers and items for each hero
3. Click **"🎯 Generate Strategy Plan"**
4. Wait for AI analysis (button shows "🤖 Generating...")
5. Strategy appears in alert dialog
6. Read and apply tactical recommendations

## Example Strategy Output

```
TEAM COMPOSITION ANALYSIS:

Allies Strengths:
- Ana provides strong healing with Biotic Rifle
- Target Tracker power enhances grenade effectiveness
- Quick Scope enables better anti-air defense

Recommended Playstyle:
- Position Ana on high ground for scope advantage
- Use grenade to enable team pushes
- Coordinate sleep darts with team callouts

Key Synergies:
- Ana's healing power + Target Tracker = sustained frontline
- Quick Scope + aerial threats = anti-Pharah capability

Counter-Strategies:
- Against enemy dive: keep sleep dart for flankers
- Against barriers: use grenade's healing amp through shields

Win Conditions:
1. Maintain high ground control
2. Land key sleep darts on enemy carry
3. Maximize grenade value with grouped allies

Risk Mitigation:
- Risk: Ana vulnerable to flankers
  Solution: Position near cover and team support
```

## Data Structure

### Hero Object in heroes.json:
```json
{
  "slug": "ana-stadium",
  "name": "Ana/Stadium",
  "items": [
    {
      "slug": "target-tracker",
      "name": "Target Tracker",
      "description": "...",
      "imageFilenames": ["Target Tracker.png"]
    }
  ],
  "powers": [
    {
      "name": "Artsy Dartsy",
      "image": "Artsy_Dartsy.png",
      "affectedAbility": "Biotic Rifle",
      "description": "...",
      "type": "Stadium Power"
    }
  ]
}
```

## Performance Benefits

### Before:
- Power selection: 342 options to scroll through
- Item selection: Only general items
- No strategy guidance

### After:
- Power selection: ~12 hero-specific options ✅
- Item selection: Hero items + general items ✅
- AI-powered strategy guidance ✅

## Technical Notes

### Hero Slug Matching
The functions handle various slug formats:
- Standard: "ana" matches "Ana/Stadium"
- With spaces: "soldier-76" matches "Soldier: 76/Stadium"
- Case insensitive matching
- Dash vs space normalization

### Memoization
Uses `useMemo` to prevent unnecessary recalculations:
- Only recalculates when `editingBuild` changes
- Improves performance during modal interactions
- Reduces memory usage

### API Error Handling
The strategy generation includes:
- Try-catch error handling
- Loading state management
- User-friendly error messages
- Console logging for debugging

## Future Enhancements

Possible improvements:
1. Display strategy in a modal instead of alert
2. Export strategy as PDF/text file
3. Save strategies for later reference
4. Compare multiple strategies
5. Add strategy templates
6. Cache common compositions
7. Show strategy confidence score
8. Include video/image examples

## Testing Checklist

✅ Hero-specific powers show only for selected hero
✅ Hero-specific items combined with general items
✅ Generate button disabled when no heroes
✅ Generate button shows loading state
✅ Strategy generation calls API correctly
✅ Error handling works for API failures
✅ All hero slugs matched correctly (including Soldier: 76)
✅ Special characters handled (Lúcio, Torbjörn)
✅ Modal updates when switching between heroes
✅ Items and powers persist after save

## Dependencies

- OpenAI API (for strategy generation)
- Environment variable: `OPENAI_API_KEY`
- Fallback: Stub response if no API key

## Browser Support

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

All features work across modern browsers with ES6+ support.

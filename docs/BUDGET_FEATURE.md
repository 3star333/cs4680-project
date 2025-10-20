# Budget & Build Suggestion Feature

## Overview
Added a personal budget tracking system that allows you to mark one ally as "yourself" and get AI-powered build suggestions based on your credit budget.

## Features

### 1. Mark as Yourself
- Any ally hero can be marked as "yourself" using the **"Mark as You"** button
- Only one ally can be marked at a time
- Marked hero displays a **"YOU"** badge in yellow
- This enables budget tracking and AI suggestions specifically for your hero

### 2. Budget Tracking
**Visual Budget Display:**
- Shows when any ally is marked as "yourself"
- Real-time tracking of:
  - **Total Budget**: Your available credits (default: 10,000)
  - **Spent**: Total cost of currently selected items
  - **Remaining**: Budget left for more items

**Budget Management:**
- Click "Change Budget" to adjust your total credits
- Budget input accepts any positive number
- Real-time updates as you add/remove items
- Warning indicator if you go over budget

### 3. Cost Display
- Each ally hero shows their total item cost: 💰 X,XXX
- Helps compare build investments across team
- Only shows for heroes with items selected

### 4. AI Build Suggestions
**"Suggest Build (Budget)" Button:**
- Only appears when you've marked yourself
- Analyzes your current build and budget
- Considers team composition (allies & enemies)
- Provides specific recommendations

**AI Analysis Includes:**
1. Current build efficiency assessment
2. Specific item recommendations within remaining budget
3. Priority items that synergize with your hero
4. Alternative budget allocations
5. Strategy tips based on team comp

## Implementation Details

### Type System Updates
**`/types/editor.ts`:**
```typescript
export interface Item {
  cost?: number  // NEW: Item cost in credits
}

export interface HeroBuild {
  isYourself?: boolean  // NEW: Flag for "yourself"
}

export interface BudgetInfo {
  totalBudget: number
  currentSpent: number
  remaining: number
}
```

### State Management
**`/app/editor/page.tsx`:**
```typescript
// Budget state
const [creditBudget, setCreditBudget] = useState<number>(10000)
const [showBudgetInput, setShowBudgetInput] = useState(false)
const [isSuggestingBuild, setIsSuggestingBuild] = useState(false)

// Derived state
const yourBuildIndex = useMemo(() => 
  allies.findIndex(ally => ally.isYourself)
, [allies])

const budgetInfo = useMemo(() => {
  if (yourBuildIndex === -1) return { totalBudget: creditBudget, currentSpent: 0, remaining: creditBudget }
  const currentSpent = calculateBuildCost(allies[yourBuildIndex])
  return { totalBudget: creditBudget, currentSpent, remaining: creditBudget - currentSpent }
}, [allies, yourBuildIndex, creditBudget])
```

### Key Functions

#### `handleMarkAsYourself(index: number)`
- Marks selected ally as "yourself"
- Automatically un-marks previous "yourself" if any
- Updates all allies' `isYourself` flags

#### `calculateBuildCost(build: HeroBuild): number`
- Sums up all item costs in a build
- Returns 0 for empty builds
- Used for real-time budget calculations

#### `handleSuggestBuild()`
- Validates that a hero is marked as "yourself"
- Sends build data to AI API
- Includes:
  - Hero name and slug
  - Budget information
  - Current items with costs
  - Team composition (allies & enemies)
- Displays AI suggestions in alert

### API Endpoint
**`/app/api/suggest-build/route.ts`:**
- POST endpoint accepting build data
- Uses OpenAI GPT-4o-mini model
- Generates contextual recommendations
- Returns:
  - Detailed suggestions text
  - Budget breakdown (total, spent, remaining)

**Prompt Engineering:**
- Analyzes hero, budget, and team comp
- Provides 5 key recommendation areas
- Focuses on practical, budget-conscious advice
- Considers hero synergies and counters

### UI Components

#### Budget Display Panel
**Location:** Above team compositions
**Visibility:** Only when hero marked as "yourself"

**Features:**
- Collapsible budget input
- Three-column stats display:
  - Total Budget (white text)
  - Spent (orange text)
  - Remaining (green if positive, red if negative)
- Over-budget warning message

#### Team Comp Updates
**`/components/editor/TeamComp.tsx`:**

**New Props:**
- `onMarkAsYourself?: (index: number) => void`
- `calculateBuildCost?: (build: HeroBuild) => number`

**New Elements:**
1. Cost indicator: 💰 X,XXX (for allies with items)
2. "YOU" badge (yellow, for marked hero)
3. "Mark as You" button (small button below Edit)

## User Flow

### Setting Up Budget Tracking
1. Select an ally hero from the team
2. Click **"Mark as You"** button
3. Budget panel appears above team
4. (Optional) Click "Change Budget" to adjust total credits
5. Build your hero with powers and items

### Using Build Suggestions
1. Ensure a hero is marked as "yourself"
2. Add some initial items (or start fresh)
3. Click **"💡 Suggest Build (Budget)"** button
4. AI analyzes your situation and provides suggestions
5. Review recommendations and adjust build accordingly

### Budget Management Tips
- Start with default 10,000 credits or set custom amount
- Watch "Remaining" counter as you add items
- Red remaining value = over budget
- Each item shows cost during selection
- Remove items if you exceed budget

## Data Flow

```
User marks hero as "yourself"
    ↓
Budget panel activates
    ↓
User selects items (with costs)
    ↓
Real-time cost calculation
    ↓
Budget display updates (spent/remaining)
    ↓
User clicks "Suggest Build"
    ↓
API receives: hero, budget, items, team comp
    ↓
OpenAI generates suggestions
    ↓
User sees recommendations
    ↓
User adjusts build based on suggestions
```

## Cost Data
- Item costs loaded from `/data/stadium/items.json`
- Each item has `cost` field (in credits)
- Cost range: 1000 - 4000+ credits
- Costs added to Item type during data loading

## Integration Points

### With Existing Features
1. **Hero Selection**: Works with existing hero search
2. **Item Selection**: Cost displayed during item picking
3. **Power Selection**: Powers don't have costs (focus on items)
4. **Strategy Plan**: Independent feature (can use both)

### With Stadium Data
- Reads item costs from `items.json`
- Preserves all existing item data
- No changes to powers or heroes data

## Technical Notes

### Performance
- Budget calculations use `useMemo` for efficiency
- Only recalculates when allies or budget changes
- Cost totaling is O(n) where n = number of items

### State Management
- Budget state stored at editor page level
- "Yourself" flag stored in HeroBuild objects
- Only one hero can be marked at a time

### Error Handling
- Validates hero selection before suggesting
- API errors caught and displayed to user
- Budget input sanitized (no negative values)

### Accessibility
- Budget input supports keyboard navigation
- Buttons disabled when invalid state
- Clear visual feedback for all actions

## Future Enhancements

### Possible Additions
1. **Preset Budgets**: Quick-select common budgets (5k, 10k, 20k)
2. **Budget History**: Track spending over time
3. **Item Comparison**: Side-by-side cost/benefit analysis
4. **Budget Templates**: Save and load budget strategies
5. **Cost Optimization**: AI auto-adjusts to hit exact budget
6. **Multi-Build Compare**: Compare costs across different builds
7. **Budget Sharing**: Share budget builds with friends
8. **Cost Alerts**: Warn before buying expensive items

### API Improvements
1. **Caching**: Cache suggestions for same hero/budget
2. **Streaming**: Stream AI response for faster feedback
3. **Refinement**: Allow follow-up questions on suggestions
4. **Learning**: Learn from user selections over time

## Testing Checklist
- [x] Can mark ally as "yourself"
- [x] Only one ally marked at a time
- [x] Budget panel appears when marked
- [x] Budget input accepts and validates numbers
- [x] Cost calculation updates in real-time
- [x] Over-budget warning displays correctly
- [x] "Suggest Build" button only shows when marked
- [x] API successfully generates suggestions
- [x] Cost displays on ally hero cards
- [x] "YOU" badge visible on marked hero
- [x] "Mark as You" button hidden on marked hero
- [x] No compilation errors

## Files Modified
1. `/types/editor.ts` - Added cost, isYourself, BudgetInfo
2. `/app/editor/page.tsx` - Budget state, handlers, UI
3. `/components/editor/TeamComp.tsx` - Mark button, cost display, badges
4. `/app/api/suggest-build/route.ts` - NEW: AI suggestion endpoint

## Dependencies
- OpenAI API (GPT-4o-mini model)
- Existing Stadium data (items.json with costs)
- React hooks (useState, useMemo, useEffect)

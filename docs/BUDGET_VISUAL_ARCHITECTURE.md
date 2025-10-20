# Budget Feature - Visual Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     EDITOR PAGE                              │
│  /app/editor/page.tsx                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STATE:                                                      │
│  • allies: HeroBuild[] (5 slots)                            │
│  • enemies: HeroBuild[] (5 slots)                           │
│  • creditBudget: number (10,000)                            │
│  • showBudgetInput: boolean                                 │
│                                                              │
│  COMPUTED:                                                   │
│  • yourBuildIndex: number (finds isYourself)                │
│  • budgetInfo: { total, spent, remaining }                  │
│                                                              │
│  HANDLERS:                                                   │
│  • handleMarkAsYourself(index)                              │
│  • calculateBuildCost(build)                                │
│  • handleSuggestBuild()                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌────────────────┐  ┌─────────────────┐  ┌──────────────────┐
│ BUDGET PANEL   │  │  TEAM COMP      │  │  AI API          │
│ (Conditional)  │  │  (Ally/Enemy)   │  │  /api/suggest-   │
│                │  │                 │  │      build       │
├────────────────┤  ├─────────────────┤  ├──────────────────┤
│ Shows when:    │  │ Hero Cards:     │  │ POST Endpoint    │
│ yourBuildIndex │  │ • Portrait      │  │                  │
│ !== -1         │  │ • Name          │  │ Input:           │
│                │  │ • Powers/Items  │  │ • heroSlug       │
│ Display:       │  │ • 💰 Cost NEW   │  │ • budget         │
│ • Total Budget │  │ • YOU Badge NEW │  │ • currentItems   │
│ • Spent        │  │ • Edit Button   │  │ • allies/enemies │
│ • Remaining    │  │ • Mark as You   │  │                  │
│ • Warning      │  │   Button NEW    │  │ Output:          │
│                │  │                 │  │ • AI suggestions │
└────────────────┘  └─────────────────┘  │ • budgetInfo     │
                                         └──────────────────┘
                                                  │
                                                  ▼
                                         ┌──────────────────┐
                                         │  OPENAI API      │
                                         │  GPT-4o-mini     │
                                         └──────────────────┘
```

---

## 🔄 State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    INITIAL STATE                             │
│  allies = [5 empty slots]                                    │
│  creditBudget = 10000                                        │
│  yourBuildIndex = -1 (none marked)                           │
│  budgetInfo = { total: 10000, spent: 0, remaining: 10000 }  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ User adds hero to ally[0]
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  allies[0] = { hero: Mercy, items: [], isYourself: false }  │
│  Budget panel: HIDDEN (no one marked)                       │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ User clicks "Mark as You" on ally[0]
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  allies[0].isYourself = true                                 │
│  yourBuildIndex = 0                                          │
│  Budget panel: VISIBLE                                       │
│  Suggest button: VISIBLE                                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ User adds item (cost: 1500)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  allies[0].items = [{ name: "Item1", cost: 1500 }]          │
│  budgetInfo.spent = 1500                                     │
│  budgetInfo.remaining = 8500                                 │
│  Card shows: 💰 1,500                                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ User adds 3 more items (cost: 6000)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  allies[0].items = [4 items]                                 │
│  budgetInfo.spent = 7500                                     │
│  budgetInfo.remaining = 2500                                 │
│  Card shows: 💰 7,500                                        │
│  Panel shows: Remaining 2,500 (green)                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ User clicks "Suggest Build"
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  API called with:                                            │
│  • hero: "Mercy"                                             │
│  • budget: 10000                                             │
│  • currentItems: [4 items, 7500 total]                       │
│  • remaining: 2500                                           │
│                                                              │
│  AI response:                                                │
│  "With 2,500 remaining, consider:                            │
│   - Healing Boost Module (1,500)                             │
│   - Cooldown Reduction (1,000)                               │
│   Total: Perfect budget fit!"                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
EditorPage
├── Header
│   ├── Title: "Composition Builder"
│   └── Description
│
├── BudgetPanel (conditional: yourBuildIndex !== -1)
│   ├── Header
│   │   ├── Title: "💰 Your Build Budget"
│   │   └── Button: "Change Budget"
│   │
│   ├── BudgetInput (conditional: showBudgetInput)
│   │   ├── Input: number
│   │   └── Button: "Set"
│   │
│   ├── StatsGrid
│   │   ├── Stat: Total Budget
│   │   ├── Stat: Spent (orange)
│   │   └── Stat: Remaining (green/red)
│   │
│   └── OverBudgetWarning (conditional: remaining < 0)
│
├── TeamCompositions
│   ├── TeamComp (Allies)
│   │   ├── Header: "Allies" + "Add Ally" Button
│   │   └── HeroCards[5]
│   │       ├── Portrait
│   │       ├── RemoveButton
│   │       ├── HeroName
│   │       ├── PowersItemsBadges (3P 5I)
│   │       ├── CostDisplay (💰 X,XXX) ← NEW
│   │       ├── YourselfBadge ("YOU") ← NEW
│   │       ├── EditButton
│   │       └── MarkAsYouButton ← NEW
│   │
│   └── TeamComp (Enemies)
│       ├── Header: "Enemies" + "Add Enemy" Button
│       └── HeroCards[5]
│           └── (same structure, no budget features)
│
├── ActionButtons
│   ├── Button: "🎯 Generate Strategy Plan"
│   ├── Button: "💡 Suggest Build (Budget)" ← NEW (conditional)
│   └── Button: "Generate Build"
│
└── Modals
    ├── HeroSearch (conditional: showHeroSearch)
    └── HeroEditModal (conditional: editingBuild)
```

---

## 💾 Data Structure

```typescript
// Single HeroBuild object
{
  hero: {
    id: "mercy",
    slug: "mercy",
    name: "Mercy",
    portrait: "Mercy.png",
    role: "Support"
  },
  powers: [
    { id: "power1", slug: "power1", name: "Power 1", icon: "icon1.png" },
    { id: "power2", slug: "power2", name: "Power 2", icon: "icon2.png" }
  ],
  items: [
    { id: "item1", slug: "item1", name: "Item 1", icon: "icon1.png", cost: 1500 },
    { id: "item2", slug: "item2", name: "Item 2", icon: "icon2.png", cost: 2000 },
    { id: "item3", slug: "item3", name: "Item 3", icon: "icon3.png", cost: 1500 }
  ],
  isYourself: true  // ← NEW FLAG
}

// Calculated from above:
// cost = 1500 + 2000 + 1500 = 5000

// BudgetInfo derived state:
{
  totalBudget: 10000,      // from creditBudget state
  currentSpent: 5000,      // calculated from items
  remaining: 5000          // totalBudget - currentSpent
}
```

---

## 🔀 User Interaction Flows

### Flow 1: Marking Yourself
```
User sees ally hero card
         ↓
Click "Mark as You" button
         ↓
handleMarkAsYourself(index) called
         ↓
Loop through allies, set all isYourself = false
         ↓
Set allies[index].isYourself = true
         ↓
State update triggers re-render
         ↓
yourBuildIndex useMemo recalculates
         ↓
Budget panel becomes visible
         ↓
"YOU" badge appears on card
         ↓
"Mark as You" button hides on that card
         ↓
"Suggest Build" button appears
```

### Flow 2: Budget Calculation
```
User adds/removes item in HeroEditModal
         ↓
Item added to build.items array
         ↓
Modal saves → handleSaveBuild()
         ↓
allies[index] updated with new items
         ↓
State change triggers budgetInfo useMemo
         ↓
budgetInfo.spent recalculated:
  • calculateBuildCost(allies[yourBuildIndex])
  • Sums all item.cost values
         ↓
budgetInfo.remaining = total - spent
         ↓
UI updates:
  • Budget panel numbers change
  • Color changes (green/red)
  • Hero card cost updates (💰 X,XXX)
  • Over-budget warning appears if negative
```

### Flow 3: AI Suggestion
```
User clicks "💡 Suggest Build (Budget)"
         ↓
handleSuggestBuild() called
         ↓
Validation checks:
  • yourBuildIndex !== -1 ✓
  • allies[yourBuildIndex].hero exists ✓
         ↓
Build request payload:
  • heroSlug, heroName
  • budget, currentItems
  • allies, enemies
         ↓
POST /api/suggest-build
         ↓
API handler processes:
  • Calculate remaining budget
  • Build AI prompt with context
  • Call OpenAI GPT-4o-mini
         ↓
AI analyzes and generates:
  • Build efficiency assessment
  • Item recommendations (with costs)
  • Priority items for hero
  • Alternative budgets
  • Strategy tips
         ↓
Response sent back to client
         ↓
Alert shows suggestions to user
         ↓
User reads and applies recommendations
```

---

## 🎯 Visual States

### State A: No Hero Marked
```
┌─────────────────────────────────┐
│          ALLIES                 │
├─────────────────────────────────┤
│ ┌─────┐  ┌─────┐  ┌─────┐      │
│ │Mercy│  │ Ana │  │     │  ... │
│ │ Edit│  │ Edit│  │  +  │      │
│ │Mark │  │Mark │  │     │      │
│ └─────┘  └─────┘  └─────┘      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  [🎯 Generate Strategy Plan]    │
│  [Generate Build]                │
└─────────────────────────────────┘

• No budget panel visible
• All allies show "Mark as You" button
• No suggest button visible
```

### State B: Hero Marked (Under Budget)
```
┌──────────────────────────────────┐
│   💰 YOUR BUILD BUDGET  [Change] │
├──────────────────────────────────┤
│  10,000  │  3,500  │   6,500     │
│  Total   │  Spent  │ Remaining ✓ │
└──────────────────────────────────┘

┌─────────────────────────────────┐
│          ALLIES                 │
├─────────────────────────────────┤
│ ┌─────┐  ┌─────┐  ┌─────┐      │
│ │Mercy│  │ Ana │  │     │  ... │
│ │3P 4I│  │ Edit│  │  +  │      │
│ │💰3.5k│  │Mark │  │     │      │
│ │[YOU]│  │     │  │     │      │
│ │ Edit│  │     │  │     │      │
│ └─────┘  └─────┘  └─────┘      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  [🎯 Generate Strategy Plan]    │
│  [💡 Suggest Build (Budget)]    │ ← NEW
│  [Generate Build]                │
└─────────────────────────────────┘

• Budget panel visible and green
• Mercy shows "YOU" badge
• Mercy cost displayed
• Suggest button available
```

### State C: Over Budget
```
┌──────────────────────────────────┐
│   💰 YOUR BUILD BUDGET  [Change] │
├──────────────────────────────────┤
│  10,000  │  12,500 │  -2,500     │
│  Total   │  Spent  │ Remaining ✗ │
├──────────────────────────────────┤
│ ⚠️ You're over budget!           │
│    Remove items or increase...   │
└──────────────────────────────────┘

• Remaining shown in RED
• Warning message appears
• Suggest button still works (AI can help optimize)
```

---

## 📱 Responsive Behavior

### Desktop (Wide Screen)
```
[Header                                    ]
[Budget Panel - Full Width                 ]
[Allies: 5 cards in row                    ]
[Enemies: 5 cards in row                   ]
[Buttons in row                            ]
```

### Mobile (Narrow Screen)
```
[Header        ]
[Budget Panel  ]
  [Stats Grid  ]
  [3 columns   ]
  
[Allies        ]
  [Scroll →    ]
  [Card][Card] 
  
[Enemies       ]
  [Scroll →    ]
  
[Buttons       ]
  [Stack       ]
  [Vertical    ]
```

---

## 🔌 API Integration Points

### Existing APIs
1. **Strategy Plan**: `/api/plan`
   - Generates team strategy
   - Independent of budget

### New API
2. **Build Suggestion**: `/api/suggest-build`
   - Budget-aware recommendations
   - Hero-specific optimization

### Data Sources
- Heroes: `getHeroes()` → `data/stadium/heroes.json`
- Powers: `getPowers()` → `data/stadium/powers.json`
- Items: `getAllItems()` → `data/stadium/items.json`
  - **Includes cost field** ← Critical for feature

---

## 🎓 Developer Notes

### Performance Optimizations
```typescript
// ✅ GOOD: Memoized calculations
const budgetInfo = useMemo(() => {
  // Only recalculates when deps change
}, [allies, yourBuildIndex, creditBudget])

// ✅ GOOD: Efficient cost calculation
const cost = items.reduce((sum, item) => sum + (item.cost || 0), 0)

// ❌ BAD: Would recalculate every render
const budgetInfo = {
  spent: calculateBuildCost(allies[yourBuildIndex])
}
```

### Type Safety
```typescript
// ✅ All new fields properly typed
interface HeroBuild {
  isYourself?: boolean  // Optional, defaults undefined
}

interface Item {
  cost?: number  // Optional, existing items may lack it
}

// ✅ Props explicitly typed
interface TeamCompProps {
  onMarkAsYourself?: (index: number) => void
  calculateBuildCost?: (build: HeroBuild) => number
}
```

### Error Handling
```typescript
// ✅ Validation before API calls
if (yourBuildIndex === -1) {
  alert('Please mark a hero first!')
  return
}

// ✅ Try-catch for async operations
try {
  const response = await fetch('/api/suggest-build', {...})
  // ...
} catch (error) {
  console.error('Error:', error)
  alert('Failed to get suggestions')
}
```

---

This visual architecture document provides a comprehensive overview of how the budget feature integrates with the existing system! 🎨

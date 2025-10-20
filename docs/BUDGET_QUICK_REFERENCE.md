# Budget Feature - Quick Reference

## 🎯 What We Built

### Core Feature: Personal Budget Tracker
Mark one of your allies as "yourself" to enable:
- ✅ Credit budget tracking (default: 10,000 credits)
- ✅ Real-time cost calculation as you add items
- ✅ Over-budget warnings
- ✅ AI-powered build suggestions based on budget

## 🎮 How to Use

### Step 1: Mark Your Hero
```
1. Add an ally hero to your team
2. Click "Mark as You" button (yellow button below Edit)
3. Hero gets "YOU" badge
4. Budget panel appears above team
```

### Step 2: Set Your Budget (Optional)
```
1. Click "Change Budget" in budget panel
2. Enter your credit amount (e.g., 10000)
3. Click "Set"
```

### Step 3: Build Your Hero
```
1. Click "Edit" on your hero
2. Select powers (up to 4)
3. Select items (up to 6) - each shows cost
4. Items costs automatically calculated
5. Budget updates in real-time
```

### Step 4: Get AI Suggestions
```
1. Click "💡 Suggest Build (Budget)" button
2. AI analyzes:
   - Your hero and current build
   - Remaining budget
   - Team composition
   - Enemy heroes
3. Receive specific item recommendations
4. Apply suggestions to optimize build
```

## 📊 Visual Elements

### Budget Panel (when hero marked)
```
┌─────────────────────────────────────┐
│ 💰 Your Build Budget    [Change]   │
├─────────────────────────────────────┤
│  Total Budget │   Spent   │Remaining│
│    10,000     │   3,500   │  6,500  │
└─────────────────────────────────────┘
```

### Hero Card Updates
```
┌───────────┐
│  [Image]  │
│   Mercy   │ 
│ 3P  5I    │ ← Powers & Items count
│ 💰 3,500  │ ← Total item cost
│ [  YOU  ] │ ← "Yourself" badge
│ [  Edit ] │
│[Mark You] │ ← Only shows if not marked
└───────────┘
```

## 💡 AI Suggestions Example

**Input:**
- Hero: Ana
- Budget: 10,000 credits
- Spent: 2,500 credits (2 items)
- Remaining: 7,500 credits
- Allies: Reinhardt, Mercy
- Enemies: Genji, Tracer

**Output:**
```
1. BUILD ANALYSIS
   Current items provide good base stats
   Room for 4 more items within budget

2. RECOMMENDED ITEMS (7,500 credits)
   - Biotic Enhancer (1,500) - Boost healing
   - Precision Scope (2,000) - Counter mobility
   - Armor Plating (1,500) - Survivability
   - Ability Haste Module (1,500) - More Sleep Darts
   
3. PRIORITY ITEMS
   Focus on healing boost to support tanks
   Anti-mobility tools for Genji/Tracer

4. BUDGET ALLOCATION
   Option A: Max utility (6k spent, 1.5k reserve)
   Option B: Balanced (5k spent, 2.5k reserve)

5. STRATEGY TIPS
   Position behind Reinhardt shield
   Save Sleep Dart for flankers
   Prioritize Mercy healing for ult charge
```

## 🔧 Technical Features

### Data Integration
- ✅ Item costs from `items.json`
- ✅ Cost range: 1,000 - 4,000+ credits
- ✅ All 915 items have cost data

### Real-time Calculations
- ✅ Budget updates as items added/removed
- ✅ Efficient useMemo optimization
- ✅ Instant visual feedback

### AI Integration
- ✅ GPT-4o-mini model
- ✅ Context-aware suggestions
- ✅ Team comp consideration
- ✅ Budget-conscious recommendations

## 🎨 Color Coding

| Element | Color | Meaning |
|---------|-------|---------|
| Budget Panel | Yellow/Orange | Budget feature active |
| "YOU" Badge | Yellow on Black | Your hero marker |
| Remaining (Green) | Green | Under budget ✓ |
| Remaining (Red) | Red | Over budget ⚠️ |
| Cost Display | Yellow | Credit amount |
| Suggest Button | Yellow/Orange | Budget-related action |

## 🚀 Workflow Example

**Scenario: Building Ana with 10k budget**

```
1. [Add Ana to allies]
2. [Click "Mark as You"]
   → Budget panel appears
   → Total: 10,000 | Spent: 0 | Remaining: 10,000

3. [Click "Edit" on Ana]
4. [Select 3 powers] (no cost)
5. [Select Item: Biotic Enhancer - 1,500]
   → Budget updates: Spent: 1,500 | Remaining: 8,500
   
6. [Select Item: Precision Scope - 2,000]
   → Budget updates: Spent: 3,500 | Remaining: 6,500
   
7. [Click "Save"]
   → Ana card shows: 💰 3,500
   → Budget: 3,500 spent, 6,500 remaining

8. [Click "💡 Suggest Build (Budget)"]
   → AI: "With 6,500 remaining, consider..."
   → Get 4 specific item recommendations
   
9. [Return to Edit]
10. [Add suggested items]
    → Watch budget count down
    → Stop before going over
```

## ⚠️ Important Notes

### Limitations
- Only **1 ally** can be marked as "yourself" at a time
- Only **items** have costs (powers are free)
- Maximum **6 items** per hero (budget permitting)
- AI suggestions require OpenAI API key

### Budget Best Practices
- Start with 10k default or adjust based on game mode
- Leave 1-2k buffer for flexibility
- Expensive items (3k+) need careful consideration
- Balance offense/defense/utility items

### When to Use Suggestions
- ✅ Starting a new build (many options)
- ✅ Stuck with budget remaining (optimize)
- ✅ Unsure what counters enemies (strategy)
- ❌ No budget left (nothing to suggest)
- ❌ No hero selected (invalid state)

## 📁 Key Files

```
/types/editor.ts
  - Item.cost field
  - HeroBuild.isYourself flag
  - BudgetInfo interface

/app/editor/page.tsx
  - Budget state management
  - Mark as yourself logic
  - Cost calculations
  - Suggest build handler

/components/editor/TeamComp.tsx
  - "Mark as You" button
  - Cost display: 💰 X,XXX
  - "YOU" badge

/app/api/suggest-build/route.ts
  - AI suggestion endpoint
  - Budget-aware prompts
```

## 🎯 Success Metrics

Feature is working correctly if:
1. ✅ Can mark ally as "yourself"
2. ✅ Budget panel appears/disappears correctly
3. ✅ Costs calculate in real-time
4. ✅ Over-budget shows red warning
5. ✅ AI generates relevant suggestions
6. ✅ Only one hero marked at a time
7. ✅ Cost displays on hero cards

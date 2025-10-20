# Selection Limits Implementation

## Overview
Added limits to power and item selection per hero:
- **Maximum 4 powers** per hero
- **Maximum 6 items** per hero

## Changes Made

### 1. Type System Updates
**File: `/types/editor.ts`**
- Added `powers?: Power[]` field to `HeroBuild` interface
- Kept `power?: Power` for backward compatibility (stores first power)

### 2. Hero Edit Modal Updates
**File: `/components/editor/HeroEditModal.tsx`**

#### State Management
```typescript
const [selectedPowers, setSelectedPowers] = useState<Power[]>(initialPowers)
const [selectedItems, setSelectedItems] = useState<Item[]>(build.items)
const MAX_POWERS = 4
const MAX_ITEMS = 6
```

#### Toggle Functions with Limits
```typescript
const togglePower = (power: Power) => {
  const exists = selectedPowers.find(p => p.id === power.id)
  if (exists) {
    setSelectedPowers(selectedPowers.filter(p => p.id !== power.id))
  } else if (selectedPowers.length < MAX_POWERS) {
    setSelectedPowers([...selectedPowers, power])
  }
}

const toggleItem = (item: Item) => {
  const exists = selectedItems.some(i => i.id === item.id)
  if (exists) {
    setSelectedItems(selectedItems.filter(i => i.id !== item.id))
  } else if (selectedItems.length < MAX_ITEMS) {
    setSelectedItems([...selectedItems, item])
  }
}
```

#### UI Features
1. **Count Display in Headers**
   - Powers: "Power Selection (X/4)"
   - Items: "Item Selection (X/6)"

2. **Visual Feedback**
   - Selected powers show numbered badges (1, 2, 3, 4) instead of checkmarks
   - Disabled state when limit reached (opacity reduced, cursor disabled)
   - Warning message appears when maximum reached

3. **Disabled State Styling**
   ```typescript
   const isDisabled = !isSelected && selectedPowers.length >= MAX_POWERS
   className={`... ${
     isSelected 
       ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105' 
       : isDisabled
       ? 'border-white/5 opacity-40 cursor-not-allowed'
       : 'border-white/10 hover:border-purple-400/50 cursor-pointer'
   }`}
   ```

4. **Warning Messages**
   - "Maximum powers selected. Deselect a power to choose another."
   - "Maximum items selected. Deselect an item to choose another."

### 3. Team Comp Display Updates
**File: `/components/editor/TeamComp.tsx`**
- Updated power indicator to show count: `{build.powers.length}P`
- Shows multiple powers instead of single "P" badge
- Example: "3P 5I" = 3 powers, 5 items

### 4. Save Handler
```typescript
const handleSave = () => {
  onSave({
    ...build,
    powers: selectedPowers,
    power: selectedPowers[0], // Backward compatibility
    items: selectedItems
  })
}
```

## User Experience Flow

### Selecting Powers
1. User clicks on a power icon
2. If under 4 powers → Power is added with numbered badge
3. If at 4 powers → Other powers become disabled (grayed out)
4. Warning message appears: "Maximum powers selected..."
5. User can deselect any power to choose another

### Selecting Items
1. User clicks on an item icon
2. If under 6 items → Item is added with checkmark
3. If at 6 items → Other items become disabled (grayed out)
4. Warning message appears: "Maximum items selected..."
5. User can deselect any item to choose another

## Technical Details

### Power Numbering
- Powers display their selection order (1-4)
- Implemented via: `selectedPowers.findIndex(p => p.id === power.id) + 1`
- Helps users track which powers they selected first

### Disabled State
- Uses `disabled` attribute on buttons
- CSS cursor changes to `not-allowed`
- Opacity reduced to 40%
- Border color dimmed to `border-white/5`

### Backward Compatibility
- `power` field still populated with first power
- Existing code reading `build.power` will work
- New code should use `build.powers` array

## Testing Checklist
- [x] Can select up to 4 powers
- [x] Cannot select 5th power (disabled)
- [x] Can deselect and reselect different powers
- [x] Powers show numbered badges (1-4)
- [x] Can select up to 6 items
- [x] Cannot select 7th item (disabled)
- [x] Warning messages appear at limits
- [x] Team display shows correct power count (XP)
- [x] Save preserves all selected powers
- [x] No compilation errors

## Files Modified
1. `/types/editor.ts` - Added powers array field
2. `/components/editor/HeroEditModal.tsx` - Implemented limits and UI
3. `/components/editor/TeamComp.tsx` - Updated power count display

## Next Steps (Optional Enhancements)
1. Add keyboard shortcuts for selection (1-4 for powers)
2. Drag-to-reorder powers to change priority
3. Add tooltips showing power descriptions on hover
4. Persist selection state in localStorage
5. Add undo/redo functionality

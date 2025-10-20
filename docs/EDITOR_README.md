# Stadium OW Composition Editor - New UI

## Overview
This is a redesigned hero composition editor with a search-based interface for selecting heroes, inspired by Overwatch 2's visual style.

## Features

### 1. **Hero Search Interface**
- Search bar with real-time filtering
- Grid of hero portraits
- Click to add hero to team composition
- No full hero grid shown by default

### 2. **Team Composition Editor**
- Separate sections for Allies and Enemies
- Visual hero cards with portraits
- Edit button on each hero card
- Add/Remove heroes easily
- Horizontal scrollable layout

### 3. **Hero Edit Modal**
- Select one power per hero
- Select multiple items per hero
- Visual feedback for selected items
- Save/Cancel actions

### 4. **Responsive Design**
- Works on desktop and mobile
- Horizontal scroll on narrow screens
- Vertical stacking on mobile
- Touch-friendly controls

## Component Architecture

### Core Components

#### `/components/editor/HeroSearch.tsx`
- **Props:**
  - `heroes: Hero[]` - Array of available heroes
  - `onSelect: (hero: Hero) => void` - Callback when hero is selected
  - `onClose: () => void` - Callback to close modal
- **Features:**
  - Real-time search filtering
  - Responsive grid layout
  - Hero portrait with hover effects

#### `/components/editor/TeamComp.tsx`
- **Props:**
  - `team: HeroBuild[]` - Array of 5 hero builds
  - `type: 'ally' | 'enemy'` - Team type for styling
  - `onEdit: (index: number) => void` - Edit hero callback
  - `onAddHero: () => void` - Add hero callback
  - `onRemoveHero?: (index: number) => void` - Remove hero callback
- **Features:**
  - Displays team composition
  - Shows power and item indicators
  - Color-coded for allies (amber) vs enemies (blue)
  - Edit button always visible when hero is selected

#### `/components/editor/HeroEditModal.tsx`
- **Props:**
  - `build: HeroBuild` - Current hero build
  - `availablePowers: Power[]` - All available powers
  - `availableItems: Item[]` - All available items
  - `onSave: (updatedBuild: HeroBuild) => void` - Save callback
  - `onClose: () => void` - Close callback
- **Features:**
  - Power selection (single choice)
  - Item selection (multiple choice)
  - Visual checkmarks for selected items
  - Hero-specific filtering

### Page Components

#### `/app/editor/page.tsx`
- Main editor page
- Manages state for allies and enemies
- Handles modal visibility
- Loads hero/power/item data
- Provides Generate and Reset actions

## Type Definitions

### `/types/editor.ts`
```typescript
export interface Hero {
  id: string
  slug: string
  name: string
  portrait: string
  role?: string
}

export interface Power {
  id: string
  slug: string
  name: string
  icon: string
}

export interface Item {
  id: string
  slug: string
  name: string
  icon: string
  heroSlug?: string
}

export interface HeroBuild {
  hero: Hero
  power?: Power
  items: Item[]
}

export type TeamType = 'ally' | 'enemy'
```

## State Management

The editor uses React state for composition management:

```typescript
// Team state - 5 slots per team
const [allies, setAllies] = useState<HeroBuild[]>(...)
const [enemies, setEnemies] = useState<HeroBuild[]>(...)

// UI state
const [showHeroSearch, setShowHeroSearch] = useState(false)
const [searchTeamType, setSearchTeamType] = useState<TeamType>('ally')
const [editingBuild, setEditingBuild] = useState<...>(null)
```

## User Flow

1. **Add Hero:**
   - Click "Add Ally" or "Add Enemy"
   - Hero search modal opens
   - Search and click hero portrait
   - Hero added to first empty slot

2. **Edit Hero:**
   - Click "Edit" button on hero card
   - Edit modal opens with power/item grids
   - Select power (single)
   - Select items (multiple)
   - Click "Save Build"

3. **Remove Hero:**
   - Click "×" button on hero card
   - Slot becomes empty

4. **Generate Build:**
   - Click "Generate Build" button
   - Composition payload logged to console

## Styling

### Theme Colors
- **Background:** Dark gray gradient (#111315 → black)
- **Allies Accent:** Amber/Orange (#f59e0b, #ea580c)
- **Enemies Accent:** Blue (#3b82f6)
- **Power Indicator:** Purple (#a855f7)
- **Item Indicator:** Green (#22c55e)

### Layout
- Rounded corners: `rounded-xl`
- Borders: `border-white/10`
- Shadows: `shadow-xl`, `shadow-lg`
- Transitions: All interactive elements

## Accessibility
- Focus states on all interactive elements
- Keyboard navigation support
- Alt text on all images
- Clear visual feedback for selections

## Mobile Responsive
- Grid layouts adjust column count
- Horizontal scroll for team compositions
- Touch-friendly button sizes (min 44px)
- Modal sizing adapts to viewport

## Next Steps / Enhancements
- [ ] Drag and drop for reordering
- [ ] Save/load compositions
- [ ] Share compositions via URL
- [ ] Advanced filtering (by role, etc.)
- [ ] Item/power tooltips with descriptions
- [ ] Animation on state changes
- [ ] Undo/redo functionality
- [ ] Composition validation/suggestions

## Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npx tsc --noEmit
```

## File Structure
```
app/
  editor/
    page.tsx          # New search-based editor
  stadium/
    editor/
      page.tsx        # Classic grid-based editor
components/
  editor/
    HeroSearch.tsx    # Hero search modal
    TeamComp.tsx      # Team composition display
    HeroEditModal.tsx # Power/item selection modal
  stadium/
    StadiumImage.tsx  # Image component with fallbacks
types/
  editor.ts           # Type definitions for editor
  stadium.ts          # Type definitions for stadium data
lib/
  stadium.ts          # Data access functions
```

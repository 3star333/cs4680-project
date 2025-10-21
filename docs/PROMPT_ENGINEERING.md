# Prompt Engineering Techniques

## Overview

This application uses multiple prompt engineering patterns to optimize AI-generated strategy advice and build suggestions for Overwatch 2 Stadium game mode. We leverage GPT-4o-mini via the OpenAI API with carefully crafted prompts to ensure actionable, relevant, and user-friendly outputs.

---

## Prompt Engineering Patterns Used

### 1. **Persona Pattern** 🎭

**Pattern Description:**
The Persona Pattern assigns a specific role or expertise to the AI, establishing domain knowledge and appropriate tone for responses.

**Implementation:**
```typescript
// Location: app/api/plan/route.ts
const strategyPrompt = {
  system: 'You are an expert Overwatch 2 Stadium gamemode strategist. Provide clear, actionable strategy advice based on team compositions.',
  user: `Analyze this team composition...`
}

// Location: app/api/suggest-build/route.ts
{
  role: 'system',
  content: 'You are an Overwatch 2 Stadium strategist. Provide CONCISE, bullet-point build suggestions. Use clear formatting with sections in ALL CAPS and bullet points. Keep responses brief and scannable.'
}
```

**Benefits:**
- Establishes AI as a domain expert in Overwatch 2 strategy
- Sets appropriate tone (professional, concise, actionable)
- Improves relevance of suggestions
- Users trust advice from a "strategist" vs. generic AI

**Before/After Example:**

*Without Persona:*
```
The team has some good heroes. Maybe try to work together.
```

*With Persona:*
```
KEY STRENGTHS:
- Strong dive potential with Winston + Genji
- Excellent peel with Brigitte's shield bash
- High burst damage from Cassidy

RECOMMENDED STRATEGY:
- Execute coordinated dives on enemy backline
- Use Brigitte to protect your supports
- Cassidy should focus high-value targets
```

---

### 2. **Structured Output Pattern** 📋

**Pattern Description:**
Explicitly defines the format, sections, and structure of the AI's response to ensure consistency and scannability.

**Implementation:**
```typescript
// Location: app/api/plan/route.ts
user: `Provide a CONCISE, SCANNABLE strategy with:

KEY STRENGTHS:
- List 2-3 main team strengths

KEY WEAKNESSES:
- List 2-3 vulnerabilities

RECOMMENDED STRATEGY:
- 3-4 bullet points on how to play

COUNTER ENEMY TEAM:
- 2-3 specific counters to enemy heroes

WIN CONDITIONS:
- 2-3 key objectives to focus on

Keep it brief and action-oriented. Use bullet points. Bold key terms.`
```

**Benefits:**
- Consistent output format across all generations
- Easy to scan and read quickly (important in-game)
- Users know exactly where to find specific information
- Improves UI formatting and display

**Before/After Example:**

*Without Structure:*
```
Your team is pretty good. You should probably focus on the enemy supports and try to win team fights. Also watch out for their ultimate abilities. Make sure to use your abilities effectively and coordinate with your team.
```

*With Structure:*
```
KEY STRENGTHS:
- High mobility with Lucio speed boost
- Strong area denial from Mei walls
- Burst healing from Ana nano-boost

RECOMMENDED STRATEGY:
- Use speed boost to engage quickly
- Wall off priority targets with Mei
- Save nano for critical team fights

WIN CONDITIONS:
- Eliminate enemy supports first
- Control high ground positions
```

---

### 3. **Context Inclusion Pattern** 🎯

**Pattern Description:**
Allows users to provide additional context that the AI incorporates into its analysis, making responses more personalized and relevant.

**Implementation:**
```typescript
// Location: app/editor/page.tsx - User Input
<textarea
  value={contextNotes}
  onChange={(e) => setContextNotes(e.target.value)}
  placeholder="Add context for better AI suggestions... e.g., 'Cassidy has good aim', 'Our healers are not healing very well', 'Enemy team is very aggressive'"
/>

// Location: app/api/plan/route.ts - Prompt Construction
${context ? `\n**Additional Context:**\n${context}\n` : ''}

// Later in prompt:
${context ? '\nConsider the additional context provided when forming your strategy.' : ''}
```

**Benefits:**
- Personalized advice based on player skill levels
- Adapts to specific match situations
- Addresses real pain points users are experiencing
- Makes AI feel more intelligent and aware

**Example With Context:**

*User Context:*
```
"Cassidy has good aim but our healers struggle to keep us alive"
```

*AI Response:*
```
RECOMMENDED STRATEGY:
- Leverage Cassidy's aim advantage - position aggressively for picks
- Keep Cassidy near health packs to reduce healer dependency
- Consider self-sustain items like Lifesteal or Armor

PRIORITY FOCUS:
- Cassidy should play independently, not rely on peel
- Choose items that provide survivability (Armor Vest, Health Kits)
- Healers should focus on tanks, Cassidy plays self-sufficient
```

---

### 4. **Constraint-Based Pattern** 💰

**Pattern Description:**
Provides explicit constraints (like budget limits) that the AI must respect in its recommendations.

**Implementation:**
```typescript
// Location: app/api/suggest-build/route.ts
const prompt = `
Hero: ${heroName}
Budget: ${budget.toLocaleString()} credits | Spent: ${currentSpent.toLocaleString()} | Remaining: ${remainingBudget.toLocaleString()}
Current Items: ${currentItems.length > 0 ? currentItems.map((i: any) => `${i.name} (${i.cost})`).join(', ') : 'None'}

RECOMMENDED ITEMS (within ${remainingBudget.toLocaleString()} credits):
- Item 1: Name (Cost) - Why it fits
- Item 2: Name (Cost) - Why it fits
- Item 3: Name (Cost) - Why it fits
`
```

**Benefits:**
- AI respects budget constraints (won't suggest items you can't afford)
- Provides realistic, actionable recommendations
- Helps with resource optimization
- Demonstrates understanding of game economics

**Example:**

*Input:*
```
Budget: 10,000 credits
Spent: 7,500 credits
Remaining: 2,500 credits
Hero: Genji
```

*AI Output:*
```
RECOMMENDED ITEMS (within 2,500 credits):
- Swift Blade (1,200) - Increases dash damage, core for dive
- Ninja Soles (800) - Improves mobility, harder to hit
- Reflex Coating (400) - Reduces damage, helps survivability

Total suggested: 2,400 credits (100 under budget)
```

---

### 5. **Brevity/Conciseness Pattern** ⚡

**Pattern Description:**
Explicitly instructs the AI to keep responses short, scannable, and action-oriented for quick in-game reference.

**Implementation:**
```typescript
// Multiple instances across prompts:
"Provide CONCISE, SCANNABLE strategy"
"Keep it brief and action-oriented"
"Use bullet points"
"Keep responses brief and scannable"
"BRIEF response"
"SHORT and ACTIONABLE"
```

**Benefits:**
- Faster to read during gameplay
- Higher information density
- Better user experience
- Reduces token usage (cost optimization)

**Before/After Example:**

*Without Brevity Pattern:*
```
Your team composition has a lot of potential for success, particularly because you have selected heroes that work well together in various situations. Winston is an excellent choice for diving into the enemy backline, and when combined with Genji, you can create a lot of pressure on the enemy supports. Additionally, your Brigitte provides strong defensive capabilities...
```

*With Brevity Pattern:*
```
KEY STRENGTHS:
- Strong dive: Winston + Genji
- Defensive peel: Brigitte
- High burst damage

STRATEGY:
- Dive enemy backline together
- Brigitte protects supports
- Focus high-value targets
```

---

## Prompt Engineering Flow

### Strategy Plan Generation Flow:
```
1. User builds team composition (5 allies, 5 enemies)
2. User adds context notes (optional)
   ↓
3. System constructs prompt with:
   - Persona: "Expert strategist"
   - Structure: Defined sections (Strengths, Weaknesses, etc.)
   - Context: User's notes included
   - Constraints: Keep it concise and scannable
   ↓
4. GPT-4o-mini processes prompt
   ↓
5. Output formatted and displayed in AI panel
```

### Build Suggestion Flow:
```
1. User marks hero as "yourself"
2. User sets credit budget
3. User adds items to build
   ↓
4. System constructs prompt with:
   - Persona: "Overwatch 2 Stadium strategist"
   - Constraints: Remaining budget limit
   - Structure: Sections for assessment and recommendations
   - Brevity: "BRIEF" and "SHORT" emphasized
   ↓
5. GPT-4o-mini suggests items within budget
   ↓
6. Output displays with cost information
```

---

## Temperature and Token Settings

### Strategy Plan:
- **Model:** `gpt-4o-mini`
- **Temperature:** Default (implicit ~0.7) - Balanced creativity/consistency
- **Max Tokens:** Unrestricted - Allows comprehensive strategy
- **Rationale:** Strategy needs some creativity for varied tactics

### Build Suggestions:
- **Model:** `gpt-4o-mini`
- **Temperature:** `0.7` - Moderate creativity
- **Max Tokens:** `1000` - Keeps responses concise
- **Rationale:** Build suggestions need variety but must stay brief

---

## Performance Optimization Techniques

### 1. Frontend Formatting
- AI output parsed and formatted client-side
- Bold headers detected automatically
- Bullet points styled with purple bullets
- Improves readability without complex prompts

```typescript
// Location: components/editor/AIOutputPanel.tsx
function formatAIOutput(text: string) {
  // Detect headers (ALL CAPS, colons, numbered)
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
    return <bold header>
  }
  
  // Detect bullet points (-, •, *)
  if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
    return <styled bullet point>
  }
}
```

### 2. Input Validation
- Zod schemas validate API requests
- Prevents malformed prompts
- Ensures consistent AI input quality

### 3. Error Handling
- Graceful fallbacks for API failures
- User-friendly error messages
- Console logging for debugging

---

## Future Improvements

### Potential Additional Patterns:

1. **Few-Shot Learning**
   - Include 1-2 example strategy outputs in prompt
   - Would improve consistency further
   - Implementation: Add examples to system message

2. **Iterative Refinement**
   - Allow users to request "more detail" or "simpler"
   - Chain prompts based on user feedback
   - Implementation: Add refinement buttons to AI panel

3. **Chain-of-Thought**
   - Ask AI to explain reasoning before conclusion
   - Would improve strategy depth
   - Implementation: Add "Show reasoning" toggle

---

## Conclusion

This application demonstrates **5 distinct prompt engineering patterns** working together:

1. ✅ **Persona Pattern** - Expert strategist role
2. ✅ **Structured Output Pattern** - Consistent formatting
3. ✅ **Context Inclusion Pattern** - User-provided notes
4. ✅ **Constraint-Based Pattern** - Budget limits
5. ✅ **Brevity Pattern** - Concise, actionable advice

Each pattern serves a specific purpose and collectively creates an AI experience that is:
- **Relevant:** Domain expertise from persona
- **Consistent:** Structured output format
- **Personalized:** Context inclusion
- **Practical:** Constraint-based suggestions
- **Efficient:** Concise responses

The combination results in high-quality, actionable strategy advice that enhances the user experience and demonstrates advanced prompt engineering techniques.

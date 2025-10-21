import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getAllItems, getItemBySlug } from '../../../lib/stadium'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { heroSlug, heroName, budget, currentItems, allies, enemies } = body

    // Calculate current spending
    const currentSpent = currentItems.reduce((sum: number, item: any) => sum + (item.cost || 0), 0)
    const remainingBudget = budget - currentSpent

    // Build canonical item list string (slug | name | cost)
    const allItems = getAllItems()
    const itemsListString = allItems.map(i => `${i.slug} | ${i.name} | ${i.cost}`).join('\n')

    // Create a stricter prompt that MUST use only items from the canonical list and return JSON
    const prompt = `You are an expert Overwatch 2 Stadium analyst. Suggest items ONLY from the canonical list provided below.

Canonical Item List (slug | name | cost):
${itemsListString}

Hero: ${heroName}
Budget: ${budget.toLocaleString()} credits | Spent: ${currentSpent.toLocaleString()} | Remaining: ${remainingBudget.toLocaleString()}
Current Items: ${currentItems.length > 0 ? currentItems.map((i: any) => `${i.name} (${i.cost})`).join(', ') : 'None'}
Allies: ${allies.length > 0 ? allies.join(', ') : 'None'}
Enemies: ${enemies.length > 0 ? enemies.join(', ') : 'None'}

INSTRUCTIONS (READ CAREFULLY):
- Only recommend items that appear in the Canonical Item List above. Do NOT invent or hallucinate items.
- Use the item's SLUG when referring to items. If referencing the name, it must match the Name column exactly.
- MAXIMIZE budget usage: Recommend enough items to use most/all of the remaining ${remainingBudget.toLocaleString()} credits.
- Suggest a mix of item costs (cheap, medium, and expensive items) to optimize the build.
- Prioritize high-value items that synergize with ${heroName}'s abilities and the team composition.
- You can suggest 3-6 items to fill remaining slots (max 6 items total per hero).
- Output MUST be valid JSON only (no extra prose) with the following exact schema:
  {
    "currentBuildAssessment": "one-line assessment",
    "recommendedItems": [
      { "slug": "compensator", "name": "Compensator", "cost": 1000, "reason": "Why it fits" }
    ],
    "priorityFocus": ["two short strings"]
  }
- If you cannot recommend any items within budget, return an empty array for recommendedItems.
  `

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an Overwatch 2 Stadium strategist. Be precise and conservative. Only use items from the provided canonical list. Output JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      // Low temperature to reduce hallucination but allow some variety in item selection
      temperature: 0.3,
      max_tokens: 1500,
    })

    const raw = completion.choices[0]?.message?.content || ''

    // Try to parse JSON output first
    let parsed: any = null
    try {
      parsed = JSON.parse(raw)
    } catch (e) {
      // Fallback: try to extract item lines with a simple regex and map to canonical slugs
      const lines = raw.split(/\r?\n/)
      const itemLines = lines.filter(l => /\b\w[\w\s'\-:.()]+\(\d+\)/.test(l) || /-/g.test(l))
      const recommendedItems: any[] = []
      for (const line of itemLines) {
        // crude extraction of name and cost
        const m = line.match(/([A-Za-z0-9'\-:.,! ]{2,60})\s*\(?([0-9,]{3,6})\)?/) || line.match(/-\s*([^:]+):?/) || null
        if (!m) continue
        const maybeName = (m[1] || '').trim()
        const maybeCost = Number((m[2] || '').toString().replace(/,/g, '')) || undefined
        // normalize to slug and try exact lookup
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        const slugGuess = normalize(maybeName)
        const found = getItemBySlug(slugGuess)
        if (found) {
          recommendedItems.push({ slug: found.slug, name: found.name, cost: found.cost, reason: 'Auto-mapped from model output' })
        }
      }

      return NextResponse.json({
        suggestionsRaw: raw,
        suggestionsFallback: recommendedItems,
        budgetInfo: {
          total: budget,
          spent: currentSpent,
          remaining: remainingBudget
        }
      })
    }

    // Validate parsed output against canonical list
    const validatedItems = Array.isArray(parsed?.recommendedItems) ? parsed.recommendedItems.map((it: any) => {
      const found = getItemBySlug(it.slug)
      if (found) return { slug: found.slug, name: found.name, cost: found.cost, reason: it.reason || '' }
      return null
    }).filter(Boolean) : []

    // If any item wasn't validated, return error with raw output for debugging
    const invalid = Array.isArray(parsed?.recommendedItems) && parsed.recommendedItems.length !== validatedItems.length
    if (invalid) {
      return NextResponse.json({ error: 'Model returned items not present in canonical list', raw: raw, validated: validatedItems }, { status: 422 })
    }

    return NextResponse.json({
      suggestions: parsed,
      budgetInfo: {
        total: budget,
        spent: currentSpent,
        remaining: remainingBudget
      }
    })
  } catch (error) {
    console.error('Error generating build suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to generate build suggestions' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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

    // Create a prompt for AI to suggest items
    const prompt = `You are an expert Overwatch 2 Stadium analyst. Provide CONCISE, SCANNABLE build suggestions.

Hero: ${heroName}
Budget: ${budget.toLocaleString()} credits | Spent: ${currentSpent.toLocaleString()} | Remaining: ${remainingBudget.toLocaleString()}
Current Items: ${currentItems.length > 0 ? currentItems.map((i: any) => `${i.name} (${i.cost})`).join(', ') : 'None'}
Allies: ${allies.length > 0 ? allies.join(', ') : 'None'}
Enemies: ${enemies.length > 0 ? enemies.join(', ') : 'None'}

Provide a BRIEF response with:

CURRENT BUILD:
- Quick 1-line assessment

RECOMMENDED ITEMS (within ${remainingBudget.toLocaleString()} credits):
- Item 1: Name (Cost) - Why it fits
- Item 2: Name (Cost) - Why it fits
- Item 3: Name (Cost) - Why it fits

PRIORITY FOCUS:
- 2-3 key synergies or counters

Use bullet points. Keep it SHORT and ACTIONABLE. Bold key terms.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an Overwatch 2 Stadium strategist. Provide CONCISE, bullet-point build suggestions. Use clear formatting with sections in ALL CAPS and bullet points. Keep responses brief and scannable.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const suggestions = completion.choices[0]?.message?.content || 'No suggestions available'

    return NextResponse.json({
      suggestions,
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

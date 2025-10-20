import { NextResponse } from 'next/server'
import { z } from 'zod'
import { PlanSchema } from '../../../lib/schema'
import { buildPrompt } from '../../../lib/prompt'
import { callLLM } from '../../../lib/llm'

const BodySchema = z.object({
  mapPhase: z.string().optional(),
  allies: z.array(z.string()).length(5).optional(),
  enemies: z.array(z.string()).length(5).optional(),
  budget: z.number().min(0).optional(),
  currentBuys: z.record(z.array(z.string())).optional(),
  goal: z.string().optional(),
  selectedPowers: z.record(z.string()).optional(),
  selectedItems: z.array(z.string()).optional(),
  composition: z.object({
    allies: z.array(z.object({
      hero: z.string(),
      power: z.string(),
      items: z.array(z.string())
    })),
    enemies: z.array(z.object({
      hero: z.string(),
      power: z.string(),
      items: z.array(z.string())
    }))
  }).optional()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = BodySchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid body', details: parsed.error.format() }, { status: 400 })

    // Handle new composition format
    if (parsed.data.composition) {
      const { allies, enemies } = parsed.data.composition
      
      // Build a strategy prompt based on the composition
      const strategyPrompt = {
        system: 'You are an expert Overwatch 2 Stadium gamemode strategist. Provide clear, actionable strategy advice based on team compositions.',
        user: `Analyze this team composition and provide a detailed strategy plan.

**Allies Team:**
${allies.map((a, i) => `${i + 1}. ${a.hero} - Power: ${a.power} - Items: ${a.items.join(', ') || 'None'}`).join('\n')}

**Enemy Team:**
${enemies.map((e, i) => `${i + 1}. ${e.hero} - Power: ${e.power} - Items: ${e.items.join(', ') || 'None'}`).join('\n')}

Provide a CONCISE, SCANNABLE strategy with:

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
      }
      
      const out = await callLLM(strategyPrompt)
      return NextResponse.json({ plan: out, success: true })
    }

    // Handle legacy format - only if all required fields are present
    if (!parsed.data.mapPhase || !parsed.data.allies || !parsed.data.enemies || 
        parsed.data.budget === undefined || !parsed.data.currentBuys || !parsed.data.goal) {
      return NextResponse.json({ error: 'Missing required fields for legacy format' }, { status: 400 })
    }

    const prompt = buildPrompt({
      mapPhase: parsed.data.mapPhase,
      allies: parsed.data.allies,
      enemies: parsed.data.enemies,
      budget: parsed.data.budget,
      currentBuys: parsed.data.currentBuys,
      goal: parsed.data.goal,
      selectedPowers: parsed.data.selectedPowers,
      selectedItems: parsed.data.selectedItems
    })
    const out = await callLLM(prompt)

    // Attempt to parse and validate
    let parsedPlan
    try {
      parsedPlan = JSON.parse(out)
    } catch (err) {
      return NextResponse.json({ error: 'Model output not valid JSON', raw: out }, { status: 400 })
    }

    const validated = PlanSchema.safeParse(parsedPlan)
    if (!validated.success) {
      return NextResponse.json({ error: 'Model output failed schema', details: validated.error.format(), raw: parsedPlan }, { status: 400 })
    }

    return NextResponse.json(validated.data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

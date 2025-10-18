import { NextResponse } from 'next/server'
import { z } from 'zod'
import { PlanSchema } from '../../../lib/schema'
import { loadFacts } from '../../../lib/facts'
import { buildPrompt } from '../../../lib/prompt'
import { callLLM } from '../../../lib/llm'

const BodySchema = z.object({
  mapPhase: z.string(),
  allies: z.array(z.string()).length(5),
  enemies: z.array(z.string()).length(5),
  budget: z.number().min(0),
  currentBuys: z.record(z.array(z.string())),
  goal: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = BodySchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid body', details: parsed.error.format() }, { status: 400 })

    const factsYaml = await loadFacts()
    const prompt = buildPrompt({ ...parsed.data, factsYaml })
    const out = await callLLM(prompt)

    // Attempt to parse and validate
    let parsedPlan
    try {
      parsedPlan = JSON.parse(out)
    } catch (e) {
      return NextResponse.json({ error: 'Model output not valid JSON', raw: out }, { status: 400 })
    }

    const validated = PlanSchema.safeParse(parsedPlan)
    if (!validated.success) {
      return NextResponse.json({ error: 'Model output failed schema', details: validated.error.format(), raw: parsedPlan }, { status: 400 })
    }

    return NextResponse.json(validated.data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

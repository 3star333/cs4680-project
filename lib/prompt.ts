export function buildPrompt(input: {
  mapPhase: string
  allies: string[]
  enemies: string[]
  budget: number
  currentBuys: Record<string, string[]>
  goal: string
  factsYaml: string
}) {
  const sys = `You are a high-level Overwatch 2 Stadium coach. Respect Stadium rules: powers persist, items are resellable, one gadget slot. Be concise. Return STRICT JSON only that matches the schema.`

  const user = `MAP_PHASE: ${input.mapPhase}\nALLIES: ${input.allies.join(', ')}\nENEMIES: ${input.enemies.join(', ')}\nBUDGET: ${input.budget}\nCURRENT_BUYS: ${JSON.stringify(input.currentBuys)}\nGOAL: ${input.goal}\nFACTS:\n${input.factsYaml}`

  return { system: sys, user }
}

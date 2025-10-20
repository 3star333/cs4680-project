export function buildPrompt(input: {
  mapPhase: string
  allies: string[]
  enemies: string[]
  budget: number
  currentBuys: Record<string, string[]>
  goal: string
  selectedPowers?: Record<string,string>
  selectedItems?: string[]
}) {
  const sys = `You are a high-level Overwatch 2 Stadium coach. Respect Stadium rules: powers persist, items are resellable, one gadget slot. Be concise. Return STRICT JSON only that matches the schema.`

  const extra = [] as string[]
  if (input.selectedPowers) extra.push('SELECTED_POWERS: ' + Object.entries(input.selectedPowers).map(([h,p])=>`${h}:${p}`).join(', '))
  if (input.selectedItems) extra.push('SELECTED_ITEMS: ' + input.selectedItems.join(', '))

  const user = `MAP_PHASE: ${input.mapPhase}\nALLIES: ${input.allies.join(', ')}\nENEMIES: ${input.enemies.join(', ')}\nBUDGET: ${input.budget}\nCURRENT_BUYS: ${JSON.stringify(input.currentBuys)}\nGOAL: ${input.goal}\n${extra.join('\n')}`

  return { system: sys, user }
}

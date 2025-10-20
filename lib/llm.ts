import type { Plan } from './schema'

export async function callLLM(promptText: { system: string; user: string }, apiKey?: string): Promise<string> {
  const key = apiKey || process.env.OPENAI_API_KEY
  if (key) {
    // Minimal OpenAI call using fetch to avoid pulling SDK here.
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: promptText.system },
          { role: 'user', content: promptText.user },
        ],
        max_tokens: 800,
      }),
    })

    const data = await res.json()
    // Try to extract content
    const msg = data?.choices?.[0]?.message?.content
    if (!msg) throw new Error('No message from OpenAI')
    return msg
  }

  // deterministic stub for offline/demo use
  const stub: Plan = {
    team_plan: { theme: 'Economy-first: buy sustain and armor', notes: ['Protect ranged carries', 'Prioritize armor and gadget for anchor'] },
    heroes: [
      { hero: 'Cassidy', buy_order: ['Armor-Plating', 'Nano-Injector'], sell: [], why: ['Needs armor against railgun'], next_round: ['Buy Grapple-Gun if budget'] },
      { hero: 'Sojourn', buy_order: ['Nano-Injector'], why: ['High sightline pressure'], next_round: [] },
      { hero: 'Kiriko', buy_order: ['Armor-Plating'], why: ['Sustain and protection'], next_round: [] },
      { hero: 'Reinhardt', buy_order: ['Armor-Plating'], why: ['Anchor the choke'], next_round: [] },
      { hero: 'Zarya', buy_order: ['Grapple-Gun'], why: ['Bubble to enable Sojourn'], next_round: [] },
    ],
    swap_suggestions: ['Consider swapping Zarya for Winston vs heavy dive'],
    top_focus: ['Protect Sojourn', 'Buy Armor early', 'Reserve Nano for clutch'],
  }

  return JSON.stringify(stub)
}

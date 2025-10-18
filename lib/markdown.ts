import { Plan } from './schema'

export function planToMarkdown(plan: Plan) {
  const lines: string[] = []
  lines.push(`# Team Plan: ${plan.team_plan.theme}`)
  lines.push('')
  plan.team_plan.notes.forEach((n: string) => lines.push(`- ${n}`))
  lines.push('\n## Per-hero Buys')
  plan.heroes.forEach((h: { hero: string; buy_order: string[]; sell?: string[]; why: string[]; next_round?: string[] }) => {
    lines.push(`\n### ${h.hero}`)
    lines.push(`**Buy order:** ${h.buy_order.join(', ')}`)
    if (h.sell && h.sell.length) lines.push(`**Sell:** ${h.sell.join(', ')}`)
    lines.push(`**Why:**`)
    h.why.forEach((w: string) => lines.push(`- ${w}`))
    if (h.next_round && h.next_round.length) {
      lines.push(`**Next round:** ${h.next_round.join(', ')}`)
    }
  })

  if (plan.swap_suggestions && plan.swap_suggestions.length) {
    lines.push('\n## Swap Suggestions')
    plan.swap_suggestions.forEach((s: string) => lines.push(`- ${s}`))
  }

  if (plan.top_focus && plan.top_focus.length) {
    lines.push('\n## Top Focus')
    plan.top_focus.forEach((t: string) => lines.push(`- ${t}`))
  }

  return lines.join('\n')
}

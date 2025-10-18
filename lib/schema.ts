import { z } from 'zod'

export const HeroPlan = z.object({
  hero: z.string(),
  buy_order: z.array(z.string()),
  sell: z.array(z.string()).optional(),
  why: z.array(z.string()),
  next_round: z.array(z.string()).optional(),
})

export const PlanSchema = z.object({
  team_plan: z.object({
    theme: z.string(),
    notes: z.array(z.string()),
  }),
  heroes: z.array(HeroPlan),
  swap_suggestions: z.array(z.string()).optional(),
  top_focus: z.array(z.string()).optional(),
})

export type Plan = z.infer<typeof PlanSchema>

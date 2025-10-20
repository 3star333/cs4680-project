import { parseHeroFromWikitext } from '../scripts/parser'

const sampleHero = `{{HeroTabs}}
'''Cassidy''' is a playable hero.

== Hero Items ==
{{Ability details
| ability_name = Quickload Chamber
| ability_image = Quickload_Chamber.png
| ability_type = Hero Item (Weapon)
| official_description = Reloading within 6m of an enemy adds 20% of Max Ammo as extra ammo.
| stadium_rarity = Rare
| stadium_cost = 4000
| stadium_buffs = Reload Speed;;20%
}}

== Powers ==
{{Ability details
| ability_name = Bullseye
| ability_image = Bullseye.png
| ability_type = Stadium Power
| affected_ability = Peacekeeper
| official_description = Critical hit reduces [Combat Roll]'s cooldown by 2s.
}}
`

test('parseHeroFromWikitext extracts items and powers', () => {
  const h = parseHeroFromWikitext(sampleHero, 'Cassidy_Stadium')
  expect(h).not.toBeNull()
  expect(h!.items.length).toBeGreaterThanOrEqual(1)
  expect(h!.powers.length).toBeGreaterThanOrEqual(1)
  expect(h!.powers[0].name).toBe('Bullseye')
})

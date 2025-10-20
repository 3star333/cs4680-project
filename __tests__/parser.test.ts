import { parseAbilityDetails, parseItemFromTemplate, findAbilityTemplates } from '../scripts/parser'
// jest globals are available via @types/jest

const sampleTpl = `{{Ability details
| ability_name = Test Item
| ability_image = Test.png
| ability_type = General Item (Weapon)
| stadium_buffs = Weapon Power;;5%::Attack Speed;;10%
| stadium_rarity = Rare
| stadium_cost = 4000
| official_description = Test description
}}`

test('parseAbilityDetails extracts fields', () => {
  const d = parseAbilityDetails(sampleTpl)
  expect(d.ability_name).toBe('Test Item')
  expect(d.stadium_cost).toBe('4000')
})

test('parseItemFromTemplate returns StadiumItem', () => {
  const it = parseItemFromTemplate(sampleTpl, 'Stadium Items')
  expect(it).not.toBeNull()
  expect(it!.name).toBe('Test Item')
  expect(it!.imageFilenames).toContain('Test.png')
})

test('findAbilityTemplates finds templates', () => {
  const src = sampleTpl + '\n' + sampleTpl
  const found = findAbilityTemplates(src)
  expect(found.length).toBe(2)
})

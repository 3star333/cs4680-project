# Stadium data pipeline

This project includes a pipeline to parse a MediaWiki dump (wikitext) into structured JSON for use in the app.

Quick usage

1. Install required dev tooling: tsx (recommended) and optionally yargs if you run the parser with flags.

```bash
npm install -D tsx
# optional: npm install -D yargs
```

2. Run the parser (example):

```bash
npm run build:stadium
# or directly:
# npx tsx scripts/build-stadium-data.ts --dump ./lib/scrape-data-2/stadium_items_dump --out ./data/stadium
```

Outputs

- `data/stadium/items.json` — parsed items
- `data/stadium/heroes.json` — parsed heroes (if implemented)
- `data/stadium/meta.json` — generation metadata

Schema summary

- StadiumItem: { slug, name, description, cost?, rarity?, tags[], ability_type?, buffs[], sourceTitle, imageFilenames[] }
- StadiumHero: { slug, name, role?, description?, items[], powers[], sourceTitle, imageFilenames[] }

Notes

- Parser is resilient to template drift but relies on `{{Ability details ... }}` templates present in wikitext.
- If wikitext is badly malformed, HTML fallbacks can be added (not implemented yet).

*** End README

import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

export async function loadFacts(): Promise<string> {
  const p = path.join(process.cwd(), 'lib', 'facts.yaml')
  const raw = await fs.promises.readFile(p, 'utf-8')
  // return raw YAML string; caller may inject directly into prompt
  return raw
}

export async function parseFacts() {
  const raw = await loadFacts()
  return YAML.parse(raw)
}

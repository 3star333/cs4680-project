import { NextResponse } from 'next/server'
import { getAllItems, getHeroes } from '../../../lib/stadium'

export async function GET() {
  try {
    const items = getAllItems()
    const heroes = getHeroes()
    return NextResponse.json({ items, heroes })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

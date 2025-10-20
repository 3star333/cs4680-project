import { serializeStateForUrl, deserializeStateFromUrl } from '../store/stadium'

const PARAM = 's'

export function readStateTokenFromLocation(): string | null {
  if (typeof window === 'undefined') return null
  const p = new URLSearchParams(window.location.search)
  return p.get(PARAM)
}

export function pushStateTokenToLocation(token: string | null) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const params = url.searchParams
  if (token) params.set(PARAM, token)
  else params.delete(PARAM)
  // use replaceState to avoid history spam
  window.history.replaceState({}, '', url.pathname + '?' + params.toString())
}

export function encodeState(state: any) {
  return serializeStateForUrl(state)
}

export function decodeState(token: string | null) {
  return deserializeStateFromUrl(token)
}

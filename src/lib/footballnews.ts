// ─── Football News API ────────────────────────────────────────────────────────
// Configure via .env.local:
//   VITE_FNEWS_URL   = base URL of the API (e.g. https://football-news-aggregator-live.p.rapidapi.com)
//   VITE_FNEWS_KEY   = API key / RapidAPI key
//   VITE_FNEWS_HOST  = X-RapidAPI-Host header (optional, required if using RapidAPI)
//
// Endpoint used: GET {VITE_FNEWS_URL}/news
// Query params tried for Copa 2026:
//   ?tags=World+Cup+2026   →  specific tag
//   ?competition=world-cup → by competition
//   ?leagues=world-cup-2026
// Falls back to fetching recent news if no WC26 endpoint works.

export interface FootballNewsItem {
  title: string
  url: string
  image: string
  source: string
  tags: string[]
  publishedAt: string
}

const BASE_URL  = import.meta.env.VITE_FNEWS_URL  as string | undefined
const API_KEY   = import.meta.env.VITE_FNEWS_KEY  as string | undefined
const API_HOST  = import.meta.env.VITE_FNEWS_HOST as string | undefined

const WC26_KEYWORDS = [
  'world cup 2026', 'copa do mundo 2026', 'copa 2026', 'mundial 2026',
  'fifa 2026', 'world cup', 'copa do mundo', 'mundial',
]

function isWC26Related(item: FootballNewsItem): boolean {
  const haystack = `${item.title} ${item.tags.join(' ')}`.toLowerCase()
  return WC26_KEYWORDS.some(kw => haystack.includes(kw))
}

function buildHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (API_KEY)  h['X-RapidAPI-Key']  = API_KEY
  if (API_HOST) h['X-RapidAPI-Host'] = API_HOST
  return h
}

async function fetchFromApi(params: Record<string, string>): Promise<FootballNewsItem[]> {
  if (!BASE_URL) return []
  const qs = new URLSearchParams(params).toString()
  const url = `${BASE_URL}/news${qs ? `?${qs}` : ''}`
  try {
    const res = await fetch(url, { headers: buildHeaders() })
    if (!res.ok) return []
    const json = await res.json() as { success?: boolean; data?: unknown[] }
    if (!json.success || !Array.isArray(json.data)) return []
    return json.data as FootballNewsItem[]
  } catch {
    return []
  }
}

// ─── Cache ─────────────────────────────────────────────────────────────────────

let _cache: FootballNewsItem[] | null = null
let _fetchedAt = 0
const TTL = 15 * 60 * 1000 // 15 min

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns World Cup 2026 related news.
 * Tries dedicated WC26 endpoints first, then filters general news client-side.
 */
export async function fetchWC26News(limit = 10): Promise<FootballNewsItem[]> {
  if (_cache && Date.now() - _fetchedAt < TTL) {
    return _cache.slice(0, limit)
  }

  if (!BASE_URL) return []

  // 1. Try WC26-specific tags/competition params
  const wc26Queries = [
    { tags: 'World Cup 2026' },
    { competition: 'world-cup-2026' },
    { leagues: 'world-cup-2026' },
    { tags: 'World Cup' },
    { tag: 'World Cup 2026' },
  ]

  for (const params of wc26Queries) {
    const items = await fetchFromApi(params)
    if (items.length > 0) {
      _cache = items
      _fetchedAt = Date.now()
      return items.slice(0, limit)
    }
  }

  // 2. Fallback: fetch general news and filter client-side
  const general = await fetchFromApi({ count: '50' })
  const filtered = general.filter(isWC26Related)
  const result = filtered.length >= 3 ? filtered : general

  _cache = result
  _fetchedAt = Date.now()
  return result.slice(0, limit)
}

export function isConfigured(): boolean {
  return !!BASE_URL
}

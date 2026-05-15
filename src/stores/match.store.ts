import { create } from 'zustand'
import type { MatchStatusOverride } from '@/types'
import { supabase, isMockMode } from '@/lib/supabase'

// ─── DB row ───────────────────────────────────────────────────────────────────

interface MatchRow {
  match_code: string
  status: string
  home_score: number | null
  away_score: number | null
  live_minute: string | null
  winner: string | null
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface MatchStoreState {
  // map: matchCode → override
  overrides: Record<string, MatchStatusOverride>
  isLoaded: boolean
  _channel: ReturnType<typeof supabase.channel> | null

  init: () => Promise<void>
  destroy: () => void
  getOverride: (matchCode: string) => MatchStatusOverride | undefined

  // Used by admin to optimistically apply a change before DB confirms
  applyOverride: (override: MatchStatusOverride) => void
}

export const useMatchStore = create<MatchStoreState>()((set, get) => ({
  overrides: {},
  isLoaded: false,
  _channel: null,

  init: async () => {
    if (get().isLoaded) return
    if (isMockMode) { set({ isLoaded: true }); return }

    const { data } = await supabase
      .from('matches')
      .select('match_code, status, home_score, away_score, live_minute, winner')
      .not('match_code', 'is', null)

    if (data) {
      const overrides: Record<string, MatchStatusOverride> = {}
      for (const row of data as MatchRow[]) {
        if (!row.match_code) continue
        overrides[row.match_code] = {
          matchCode:   row.match_code,
          status:      row.status as MatchStatusOverride['status'],
          homeScore:   row.home_score ?? null,
          awayScore:   row.away_score ?? null,
          liveMinute:  row.live_minute ?? null,
          winner:      row.winner ?? null,
        }
      }
      set({ overrides, isLoaded: true })
    } else {
      set({ isLoaded: true })
    }

    // Realtime: admin altera status → clientes recebem em tempo real
    const channel = supabase
      .channel('matches_status_v1')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches' },
        (payload) => {
          const row = payload.new as MatchRow
          if (!row.match_code) return
          const override: MatchStatusOverride = {
            matchCode:  row.match_code,
            status:     row.status as MatchStatusOverride['status'],
            homeScore:  row.home_score ?? null,
            awayScore:  row.away_score ?? null,
            liveMinute: row.live_minute ?? null,
            winner:     row.winner ?? null,
          }
          set(s => ({ overrides: { ...s.overrides, [row.match_code]: override } }))
        })
      .subscribe()

    set({ _channel: channel })
  },

  destroy: () => {
    const { _channel } = get()
    if (_channel) supabase.removeChannel(_channel)
    set({ _channel: null, overrides: {}, isLoaded: false })
  },

  getOverride: (matchCode) => get().overrides[matchCode],

  applyOverride: (override) =>
    set(s => ({ overrides: { ...s.overrides, [override.matchCode]: override } })),
}))

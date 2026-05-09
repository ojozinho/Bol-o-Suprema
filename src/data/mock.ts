import type { RankingEntry, BracketSlot, AppUser } from '@/types'
import { TEAMS } from './teams'
import { WC2026_MATCHES } from './wc2026'

// ─── Current User (mock login) ────────────────────────────────────────────────
// Replaced on real auth — used only in mock/dev mode

export const MOCK_ME: AppUser = {
  id: 'user-1',
  email: 'joao.silva@suprema.group',
  firstName: 'João',
  lastName: 'Silva',
  dept: 'Design',
  initials: 'JS',
  color: '#00A651',
  since: '2026',
  isAdmin: true,
  createdAt: '2026-05-09',
}

// ─── Matches ──────────────────────────────────────────────────────────────────
// All sourced from real WC2026 schedule — no fake scores

export const MOCK_LIVE     = undefined              // no live matches yet
export const MOCK_UPCOMING = WC2026_MATCHES.slice(0, 8)
export const MOCK_PAST: typeof WC2026_MATCHES = []  // no finished matches yet

// ─── Ranking ──────────────────────────────────────────────────────────────────
// Empty — nobody has scored points yet (tournament starts June 11)

export const MOCK_RANKING: RankingEntry[] = []

// ─── Bracket ─────────────────────────────────────────────────────────────────
// R16 slots labelled by group advancement (TBD until groups complete)

export const MOCK_BRACKET_SLOTS: BracketSlot[] = [
  { slotId: 'r16_1',   round: 'r16',   position: 1,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_2',   round: 'r16',   position: 2,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_3',   round: 'r16',   position: 3,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_4',   round: 'r16',   position: 4,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_5',   round: 'r16',   position: 5,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_6',   round: 'r16',   position: 6,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_7',   round: 'r16',   position: 7,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_8',   round: 'r16',   position: 8,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_1',    round: 'qf',    position: 1,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_2',    round: 'qf',    position: 2,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_3',    round: 'qf',    position: 3,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_4',    round: 'qf',    position: 4,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'sf_1',    round: 'sf',    position: 1,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'sf_2',    round: 'sf',    position: 2,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'final_1', round: 'final', position: 1,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
]

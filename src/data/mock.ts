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
export const MOCK_UPCOMING = WC2026_MATCHES          // all 72 group stage matches
export const MOCK_PAST: typeof WC2026_MATCHES = []  // no finished matches yet

// ─── Ranking ──────────────────────────────────────────────────────────────────
// Empty until tournament starts (June 11)

export const MOCK_RANKING: RankingEntry[] = []

// ─── Bracket ─────────────────────────────────────────────────────────────────
// R16 slots labelled by group advancement (TBD until groups complete)

// WC2026: 12 groups → 32 qualifiers → 16 R16 → 8 QF → 4 SF → 1 Third place + 1 Final
export const MOCK_BRACKET_SLOTS: BracketSlot[] = [
  // ── Oitavas de Final (16 jogos) ──────────────────────────────────────────────
  { slotId: 'r16_1',   round: 'r16',   position: 1,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_2',   round: 'r16',   position: 2,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_3',   round: 'r16',   position: 3,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_4',   round: 'r16',   position: 4,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_5',   round: 'r16',   position: 5,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_6',   round: 'r16',   position: 6,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_7',   round: 'r16',   position: 7,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_8',   round: 'r16',   position: 8,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_9',   round: 'r16',   position: 9,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_10',  round: 'r16',   position: 10, matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_11',  round: 'r16',   position: 11, matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_12',  round: 'r16',   position: 12, matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_13',  round: 'r16',   position: 13, matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_14',  round: 'r16',   position: 14, matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_15',  round: 'r16',   position: 15, matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'r16_16',  round: 'r16',   position: 16, matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  // ── Quartas de Final (8 jogos) ───────────────────────────────────────────────
  { slotId: 'qf_1',    round: 'qf',    position: 1,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_2',    round: 'qf',    position: 2,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_3',    round: 'qf',    position: 3,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_4',    round: 'qf',    position: 4,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_5',    round: 'qf',    position: 5,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_6',    round: 'qf',    position: 6,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_7',    round: 'qf',    position: 7,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'qf_8',    round: 'qf',    position: 8,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  // ── Semifinais (4 jogos) ─────────────────────────────────────────────────────
  { slotId: 'sf_1',    round: 'sf',    position: 1,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'sf_2',    round: 'sf',    position: 2,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'sf_3',    round: 'sf',    position: 3,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  { slotId: 'sf_4',    round: 'sf',    position: 4,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  // ── 3° Lugar (sf_3 winner vs sf_4 winner) ────────────────────────────────────
  { slotId: 'third_1', round: 'third', position: 1,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
  // ── Final (sf_1 winner vs sf_2 winner) ───────────────────────────────────────
  { slotId: 'final_1', round: 'final', position: 1,  matchId: null, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, status: 'wait', winner: null },
]

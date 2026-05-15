import type { MatchStage } from '@/types'

// ─── Regras de pontuação — única fonte de verdade do projeto ─────────────────
//
// Fase de grupos:
//   Placar exato                              → 10 pts
//   Resultado + gols de 1 time correto        →  7 pts  (ex: 3×0 vs 3×1)
//   Resultado correto (V/E/D)                 →  5 pts
//   Gols de uma equipe correto                →  1 pt
//
// Mata-mata (tempo regulamentar):
//   Placar exato                              → 12 pts
//   Resultado + gols de 1 time               →  8 pts
//   Resultado correto (quem avança na regul.) →  5 pts
//   Classificado correto (incl. pens/prorrog) →  2 pts
//
// Apostas gerais (calculadas separadamente na tabela users):
//   Campeão                                   → 25 pts
//   Vice-campeão                              → 15 pts
//   Artilheiro                                → 10 pts

export interface MatchResult {
  homeScore: number
  awayScore: number
}

export interface PredictionInput {
  homeScore: number
  awayScore: number
}

function outcome(home: number, away: number): 'home' | 'draw' | 'away' {
  if (home > away) return 'home'
  if (away > home) return 'away'
  return 'draw'
}

export function calculatePoints(
  prediction: PredictionInput,
  result: MatchResult,
  stage: MatchStage
): number {
  const p = prediction
  const r = result

  const isGroup = stage === 'group'
  const exactMatch = p.homeScore === r.homeScore && p.awayScore === r.awayScore
  const correctOutcome = outcome(p.homeScore, p.awayScore) === outcome(r.homeScore, r.awayScore)
  const oneTeamCorrect = p.homeScore === r.homeScore || p.awayScore === r.awayScore

  if (isGroup) {
    if (exactMatch) return 10
    if (correctOutcome && oneTeamCorrect) return 7
    if (correctOutcome) return 5
    if (oneTeamCorrect) return 1
    return 0
  }

  // Mata-mata
  if (exactMatch) return 12
  if (correctOutcome && oneTeamCorrect) return 8
  if (correctOutcome) return 5
  // Para mata-mata, 2 pts se acertou o classificado (mesmo lógica do resultado)
  // Isso é verificado na camada acima com o winner real
  return 0
}

/**
 * Versão mata-mata com suporte ao classificado via penaltis.
 * `realWinner` = vencedor real da partida (pode ter sido decidida nos pênaltis).
 * `predictedOutcome` = quem o usuário acha que vai passar (home/away).
 */
export function calculateKoPoints(
  prediction: PredictionInput,
  result: MatchResult,
  predictedAdvancer: 'home' | 'away' | null,
  realAdvancer: 'home' | 'away' | null
): number {
  const exactMatch = prediction.homeScore === result.homeScore && prediction.awayScore === result.awayScore
  const correctRegTime = outcome(prediction.homeScore, prediction.awayScore) === outcome(result.homeScore, result.awayScore)
  const oneTeamCorrect = prediction.homeScore === result.homeScore || prediction.awayScore === result.awayScore
  const advancerCorrect = predictedAdvancer !== null && predictedAdvancer === realAdvancer

  if (exactMatch) return 12
  if (correctRegTime && oneTeamCorrect) return 8
  if (correctRegTime) return 5
  if (advancerCorrect) return 2
  return 0
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Prediction } from '@/types'

interface PredictionState {
  predictions: Record<string, Prediction> // matchId → Prediction
  drafts: Record<string, { home: number; away: number }> // matchId → draft

  // apostas gerais (antes do início do torneio)
  championPick: string | null  // campeão — 25 pts
  vicePick: string | null      // vice-campeão — 15 pts
  scorerPick: string | null    // artilheiro (nome do jogador) — 10 pts + desempate

  setDraft: (matchId: string, home: number, away: number) => void
  clearDraft: (matchId: string) => void
  confirmPrediction: (prediction: Prediction) => void
  getPrediction: (matchId: string) => Prediction | undefined
  getDraft: (matchId: string) => { home: number; away: number } | undefined
  setChampionPick: (teamCode: string) => void
  setVicePick: (teamCode: string) => void
  setScorerPick: (playerName: string) => void
}

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set, get) => ({
      predictions: {},
      drafts: {},
      championPick: null,
      vicePick: null,
      scorerPick: null,

      setDraft: (matchId, home, away) =>
        set((s) => ({ drafts: { ...s.drafts, [matchId]: { home, away } } })),

      clearDraft: (matchId) =>
        set((s) => {
          const drafts = { ...s.drafts }
          delete drafts[matchId]
          return { drafts }
        }),

      confirmPrediction: (prediction) =>
        set((s) => {
          const predictions = { ...s.predictions, [prediction.matchId]: prediction }
          const drafts = { ...s.drafts }
          delete drafts[prediction.matchId]
          return { predictions, drafts }
        }),

      getPrediction: (matchId) => get().predictions[matchId],
      getDraft: (matchId) => get().drafts[matchId],
      setChampionPick: (teamCode) => set({ championPick: teamCode }),
      setVicePick: (teamCode) => set({ vicePick: teamCode }),
      setScorerPick: (playerName) => set({ scorerPick: playerName }),
    }),
    { name: 'bolao-predictions' }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Boletim } from '@/types'

interface BoletimState {
  bulletins: Boletim[]
  addBoletim: (b: Boletim) => void
  togglePin: (id: string) => void
  deleteBoletim: (id: string) => void
}

export const useBoletimStore = create<BoletimState>()(
  persist(
    (set) => ({
      bulletins: [],

      addBoletim: (b) => set((s) => ({ bulletins: [b, ...s.bulletins] })),

      togglePin: (id) =>
        set((s) => ({
          bulletins: s.bulletins.map((b) =>
            b.id === id ? { ...b, isPinned: !b.isPinned } : b
          ),
        })),

      deleteBoletim: (id) =>
        set((s) => ({ bulletins: s.bulletins.filter((b) => b.id !== id) })),
    }),
    { name: 'bolao-boletins' }
  )
)

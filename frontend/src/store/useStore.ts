import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {  Match, MatchEvent, MatchStats, WhatIfChange  } from '../types'

interface Store {
  setDemoMode?: any
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void

  selectedMatch: Match | null
  setSelectedMatch: (match: Match) => void

  selectedDate: string
  setSelectedDate: (date: string) => void

  activeCompetition: string
  setActiveCompetition: (comp: string) => void

  liveMatchId: string | null
  setLiveMatchId: (id: string | null) => void

  finishedMatchId: string | null
  setFinishedMatchId: (id: string | null) => void

  fullTimeMatch: Match | null
  fullTimeEvents: MatchEvent[]
  fullTimeStats: MatchStats | null
  setFullTimeData: (match: Match, events: MatchEvent[], stats: MatchStats) => void

  whatIfChanges: WhatIfChange[]
  addWhatIfChange: (change: WhatIfChange) => void
  removeWhatIfChange: (id: string) => void
  clearWhatIfChanges: () => void

  matchPreviews: Record<string, any>
  setMatchPreview: (matchId: string, preview: any) => void
  generatedLineups: Record<string, any[]>
  setGeneratedLineup: (teamTLA: string, lineup: any[]) => void
  getGeneratedLineup: (teamTLA: string) => any[] | undefined
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      selectedMatch: null,
      setSelectedMatch: (match) => set({ selectedMatch: match }),

      selectedDate: new Date().toISOString().split('T')[0],
      setSelectedDate: (date) => set({ selectedDate: date }),

      activeCompetition: 'WC',
      setActiveCompetition: (comp) => set({ activeCompetition: comp }),

      liveMatchId: null,
      setLiveMatchId: (id) => set({ liveMatchId: id }),

      finishedMatchId: null,
      setFinishedMatchId: (id) => set({ finishedMatchId: id }),

      fullTimeMatch: null,
      fullTimeEvents: [],
      fullTimeStats: null,
      setFullTimeData: (match, events, stats) => set({ fullTimeMatch: match, fullTimeEvents: events, fullTimeStats: stats }),

      whatIfChanges: [],
      addWhatIfChange: (change) => set((state) => ({ whatIfChanges: [...state.whatIfChanges, change] })),
      removeWhatIfChange: (id) => set((state) => ({ whatIfChanges: state.whatIfChanges.filter(c => c.id !== id) })),
      clearWhatIfChanges: () => set({ whatIfChanges: [] }),

      matchPreviews: {},
      setMatchPreview: (matchId, preview) => set((state) => ({
        matchPreviews: {
          ...state.matchPreviews,
          [matchId]: preview
        }
      })),
      generatedLineups: {},
      setGeneratedLineup: (teamTLA, lineup) => set((state) => ({ generatedLineups: { ...state.generatedLineups, [teamTLA]: lineup } })),
      getGeneratedLineup: (teamTLA) => get().generatedLineups[teamTLA]
    }),
    {
      name: 'pitchside-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

import { useState, useEffect, Component } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, subDays } from 'date-fns'
import { useStore } from '../store/useStore'
import { useRecentMatches } from '../hooks/useRecentMatches'
import { useFullTimeMatch } from '../hooks/useFullTimeMatch'
import { ResultHero } from '../components/fulltime/ResultHero'
import { EventTimeline } from '../components/fulltime/EventTimeline'
import { StatsBreakdown } from '../components/fulltime/StatsBreakdown'
import { NarrativePanel } from '../components/fulltime/NarrativePanel'
import { StandingsPanel } from '../components/fulltime/StandingsPanel'
import { WhatIfSimulator } from '../components/fulltime/WhatIfSimulator'
import { PlayerPanel } from '../components/fulltime/PlayerPanel'
import { Skeleton } from '../components/shared/Skeleton'
import type { Match, MatchEvent, MatchStats } from '../types'
import { computeMatchInsights } from '../utils/matchInsights'

class PlayerErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: any, info: any) { console.error("PlayerPanel error:", error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-accent-red text-sm mb-2">Failed to load player stats</span>
          <span className="text-text-secondary text-xs">There was a problem rendering the player data</span>
        </div>
      )
    }
    return this.props.children
  }
}

const FullTimeSidebar = () => {
  const { data: recentMatches } = useRecentMatches()
  const { finishedMatchId, setFinishedMatchId, selectedDate, setSelectedDate } = useStore()
  
  // 5 days strip
  const today = new Date()
  const dates = [
    subDays(today, 2),
    subDays(today, 1),
    today,
    addDays(today, 1),
    addDays(today, 2)
  ]

  // Auto-select first finished match if none selected
  useEffect(() => {
    if (recentMatches && recentMatches.length > 0 && !finishedMatchId) {
      setFinishedMatchId(recentMatches[0].id)
    } else if (recentMatches && recentMatches.length === 0 && !finishedMatchId) {
      setFinishedMatchId('demo')
    }
  }, [recentMatches, finishedMatchId, setFinishedMatchId])

  return (
    <aside className="w-[220px] bg-bg-sidebar border-r border-border-default flex flex-col shrink-0 overflow-hidden" style={{ backgroundColor: '#0A1120' }}>
      <div className="pt-3 pb-2 px-4">
        <span className="text-text-secondary text-xs font-mono tracking-widest uppercase">Full Time</span>
      </div>

      <div className="p-3 border-b border-border-default flex justify-between">
        {dates.map((d, i) => {
          const dateStr = format(d, 'yyyy-MM-dd')
          const isSelected = dateStr === selectedDate
          const isToday = format(d, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
          
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex flex-col items-center justify-center w-8 h-10 rounded font-mono text-xs ${
                isSelected ? 'bg-accent-green/20 border border-accent-green text-accent-green' : 
                isToday ? 'text-white font-bold' : 'text-text-secondary hover:text-white'
              }`}
            >
                <span className="text-[10px] uppercase">{format(d, 'EEE')}</span>
                <span className="text-[10px]">{format(d, 'd')}</span>
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 hide-scrollbar">
        {!recentMatches || recentMatches.length === 0 ? (
          <div className="p-3 text-center text-[12px] text-text-secondary">No completed matches.</div>
        ) : (
          recentMatches.map(m => {
            const isSelected = finishedMatchId === m.id
            const homeScore = (m as any).score?.fullTime?.home ?? m.score?.home ?? 0
            const awayScore = (m as any).score?.fullTime?.away ?? m.score?.away ?? 0

            return (
              <button
                key={m.id}
                onClick={() => setFinishedMatchId(m.id)}
                className={`w-full text-left flex flex-col p-2.5 rounded transition-colors ${
                  isSelected 
                    ? 'bg-[#101C30] border-l-2 border-accent-green' 
                    : 'text-text-secondary hover:bg-bg-hover border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'text-accent-green bg-accent-green/10' : 'text-accent-green bg-accent-green/10'}`}>FT</span>
                  <span className={`text-[13px] font-medium font-mono ${isSelected ? 'text-[#FFFFFF]' : 'text-inherit'}`}>
                    {m.homeTeam.tla} <span className="mx-1 font-bold">{homeScore} - {awayScore}</span> {m.awayTeam.tla}
                  </span>
                </div>
                <div className={`text-[11px] truncate ${isSelected ? 'text-text-secondary' : 'text-inherit opacity-70'}`}>
                  {m.competition.name}
                </div>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}

export const FullTime = () => {
  const finishedMatchId = useStore((state) => state.finishedMatchId)
  const { data: recentMatches } = useRecentMatches()
  
  const matchDataFromStore = recentMatches?.find(m => m.id === finishedMatchId)
  // Assuming 'lvUBR5F8' is the world cup code. We should use matchDataFromStore.competition.code if available.
  const compId = matchDataFromStore?.competition?.code || 'lvUBR5F8'
  const { data: fullTimeData, isLoading } = useFullTimeMatch(finishedMatchId, compId)
  
  const [activeTab, setActiveTab] = useState('match')

  if (!finishedMatchId || !matchDataFromStore) {
    return (
      <div className="flex w-full h-full overflow-hidden">
        <FullTimeSidebar />
        <div className="flex-1 flex items-center justify-center text-center p-6 bg-bg-primary">
          <p className="text-text-secondary">Select a completed match to view full-time analysis.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex w-full h-full overflow-hidden">
        <FullTimeSidebar />
        <div className="flex-1 flex flex-col bg-bg-primary">
          <div className="bg-bg-hero border-b border-border-default p-4 h-32 flex flex-col justify-between shrink-0">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="p-5 space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const matchData: Match = matchDataFromStore
  const details = fullTimeData?.details
  const events: MatchEvent[] = details?.events || []
  const stats: MatchStats | null = fullTimeData?.stats || null
  const playerStats = fullTimeData?.playerStats || []
  
  // Compute match insights
  const insights = computeMatchInsights(events, { home: matchData.score.home || 0, away: matchData.score.away || 0 }, stats)

  const tabs = [
    { id: 'match', label: 'The match' },
    { id: 'stats', label: 'Stats' },
    { id: 'players', label: 'Players' },
    { id: 'implications', label: 'Implications' },
    { id: 'whatif', label: 'What if?' }
  ]

  const PatternChip = ({ label, colorClass }: { label: string, colorClass: string }) => (
    <div className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${colorClass}`}>
      {label}
    </div>
  )

  return (
    <div className="flex w-full h-full overflow-hidden">
      <FullTimeSidebar />
      
      <div className="flex-1 flex flex-col bg-bg-primary min-w-0">
        <div className="shrink-0 max-h-[160px] overflow-hidden">
          <ResultHero match={matchData} details={details} />
        </div>
        
        {/* Match Insights Chips */}
        <div className="px-5 py-3 border-b border-border-default flex gap-2 flex-wrap items-center bg-bg-card">
          {insights.chips.possessionLoss && <PatternChip label="Dominant possession, no reward" colorClass="bg-accent-gold/10 border-accent-gold/30 text-accent-gold" />}
          {insights.chips.comeback && <PatternChip label="Comeback victory" colorClass="bg-accent-green/10 border-accent-green/30 text-accent-green" />}
          {insights.chips.cleanSheet && <PatternChip label="Clean sheet" colorClass="bg-accent-ai/10 border-accent-ai/30 text-accent-ai" />}
          {insights.chips.lateWinner && <PatternChip label="Late drama" colorClass="bg-accent-red/10 border-accent-red/30 text-accent-red" />}
          {insights.chips.redCardImpact && <PatternChip label="Red card changed this match" colorClass="bg-accent-red/10 border-accent-red/30 text-accent-red" />}
          {insights.chips.manyGoals && <PatternChip label="High-scoring affair" colorClass="bg-accent-gold/10 border-accent-gold/30 text-accent-gold" />}
          {Object.keys(insights.chips).length === 0 && <span className="text-[11px] text-text-secondary">Standard affair</span>}
        </div>

        <div className="flex border-b border-border-default px-5 overflow-x-auto hide-scrollbar shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'text-text-primary border-accent-green' 
                  : 'text-text-secondary border-transparent hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === 'match' && (
                <div className="flex flex-col gap-6">
                  <NarrativePanel match={matchData} events={events} insights={insights} playerStats={playerStats} />
                  <EventTimeline events={events} match={matchData} />
                </div>
              )}
              {activeTab === 'stats' && stats && <StatsBreakdown stats={stats} />}
              {activeTab === 'players' && <PlayerErrorBoundary><PlayerPanel homeTeam={matchData.homeTeam} awayTeam={matchData.awayTeam} playerStats={playerStats} /></PlayerErrorBoundary>}
              {activeTab === 'implications' && <StandingsPanel match={matchData} standings={fullTimeData?.standings} />}
              {activeTab === 'whatif' && <WhatIfSimulator match={matchData} events={events} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

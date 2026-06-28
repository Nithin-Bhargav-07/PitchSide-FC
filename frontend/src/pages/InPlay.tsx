import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { useLiveMatch } from '../hooks/useLiveMatch'
import { useMatches } from '../hooks/useMatches'
import { ScoreHero } from '../components/inplay/ScoreHero'
import { MomentumBar } from '../components/inplay/MomentumBar'
import { EventFeed } from '../components/inplay/EventFeed'
import { LiveStatsPanel } from '../components/inplay/LiveStatsPanel'
import { LiveTacticsPanel } from '../components/inplay/LiveTacticsPanel'
import { Skeleton } from '../components/shared/Skeleton'
import { TeamLogo } from '../components/shared/TeamLogo'
import type {  Match  } from '../types'

const LiveMatchSelector = () => {
  const { data: matches } = useMatches()
  const { liveMatchId, setLiveMatchId } = useStore()
  
  // Auto-select first live match if none selected
  useEffect(() => {
    const liveMatches = (matches || []).filter(m => ['LIVE', 'IN_PLAY', 'PAUSED'].includes(m.status))
    if (liveMatches.length > 0 && !liveMatchId) {
      setLiveMatchId(liveMatches[0].id)
    }
  }, [matches, liveMatchId, setLiveMatchId])

  const liveMatches = (matches || []).filter(m => ['LIVE', 'IN_PLAY', 'PAUSED'].includes(m.status))

  if (liveMatches.length === 0) return null

  return (
    <div className="bg-bg-sidebar border-b border-border-default px-4 py-3 flex gap-3 overflow-x-auto hide-scrollbar flex-shrink-0">
      {liveMatches.map(m => (
        <button
          key={m.id}
          onClick={() => setLiveMatchId(m.id)}
          className={`flex flex-col min-w-[140px] p-2 rounded-lg border transition-colors ${
            liveMatchId === m.id 
              ? 'border-accent-green bg-accent-green/10' 
              : 'border-border-default bg-bg-card hover:border-text-secondary'
          }`}
        >
          <div className="flex justify-between items-center w-full mb-1">
            <span className="text-accent-green font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></span>
              {m.minute || 'LIVE'}
            </span>
            <span className="font-mono text-[10px]">{m.score?.home ?? 0} - {m.score?.away ?? 0}</span>
          </div>
          <div className="flex justify-between w-full text-[12px] font-medium truncate gap-2 px-2 mt-2">
            <div className="flex items-center gap-1.5">
              <TeamLogo src={m.homeTeam.crest} alt={m.homeTeam.tla} tla={m.homeTeam.tla} className="w-3.5 h-3.5 object-contain" fallbackClassName="text-[8px] px-1 py-0.5" />
              <span className="truncate">{m.homeTeam.tla}</span>
            </div>
            <div className="flex items-center gap-1.5 text-right">
              <span className="truncate">{m.awayTeam.tla}</span>
              <TeamLogo src={m.awayTeam.crest} alt={m.awayTeam.tla} tla={m.awayTeam.tla} className="w-3.5 h-3.5 object-contain" fallbackClassName="text-[8px] px-1 py-0.5" />
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export const InPlay = () => {
  const liveMatchId = useStore((state) => state.liveMatchId)
  const { data: matches } = useMatches()
  const { data: liveData, isLoading, error } = useLiveMatch(liveMatchId)
  
  const [activeTab, setActiveTab] = useState('feed')

  if (!liveMatchId) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 bg-bg-primary text-center">
        <h2 className="font-display text-2xl font-bold mb-3 text-text-primary">No live match right now</h2>
        <p className="text-text-secondary mb-8 max-w-sm">
          There are no matches currently in play. Try exploring the Dugout or check out our demo modes.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => useStore.getState().setLiveMatchId('demo')}
            className="px-6 py-2.5 bg-accent-green text-black font-medium rounded hover:bg-accent-green/90 transition-colors"
          >
            Start Demo 1
          </button>
          <button 
            onClick={() => useStore.getState().setLiveMatchId('demo2')}
            className="px-6 py-2.5 border border-border-strong text-text-primary font-medium rounded hover:border-text-secondary transition-colors"
          >
            Start Demo 2
          </button>
        </div>
      </div>
    )
  }

  if (isLoading && !liveData) {
    return (
      <div className="flex flex-col h-full">
        <LiveMatchSelector />
        <div className="bg-bg-hero border-b border-border-default p-4 h-32 flex flex-col justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="p-5 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (error || (!liveData && !isLoading)) {
    return (
      <div className="flex flex-col h-full">
        <LiveMatchSelector />
        <div className="p-6 text-center text-text-secondary">
          <p>Unable to load live match data.</p>
        </div>
      </div>
    )
  }

  // Use live data if available, fallback to selectedMatch structure if needed
  const displayMatch: Match = liveData?.match || matches?.find(m => m.id === liveMatchId)

  if (!displayMatch) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-6 text-text-secondary">
        <p>Loading match data...</p>
      </div>
    )
  }

  // Construct a displayable match object combining base match info with live updates
  const currentMatchState: Match = {
    ...displayMatch,
    score: liveData.score,
    minute: liveData.minute,
    status: liveData.status,
  }

  const tabs = [
    { id: 'feed', label: 'Live feed' },
    { id: 'stats', label: 'Stats' },
    { id: 'tactics', label: 'Tactics' }
  ]

  return (
    <div className="flex flex-col h-full">
      <LiveMatchSelector />
      
      {liveData?.source === 'synthetic' && (
        <div className="h-1 w-full bg-border-default">
          <motion.div 
            className="h-full bg-accent-green"
            initial={{ width: '0%' }}
            animate={{ width: `${(liveData.minute / 90) * 100}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      )}
      
      <ScoreHero match={currentMatchState} />
      
      {liveData.stats?.possession && (
        <MomentumBar 
          homeTla={currentMatchState.homeTeam.tla} 
          awayTla={currentMatchState.awayTeam.tla} 
          homePossession={liveData.stats.possession.home} 
        />
      )}

      <div className="flex border-b border-border-default px-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 px-3 text-xs font-medium transition-colors border-b-2 ${
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
          >
            {activeTab === 'feed' && <EventFeed events={liveData.events} match={currentMatchState} />}
            {activeTab === 'stats' && <LiveStatsPanel stats={liveData.stats} />}
            {activeTab === 'tactics' && <LiveTacticsPanel match={currentMatchState} events={liveData.events} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

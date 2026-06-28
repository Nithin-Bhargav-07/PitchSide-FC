import { useState, Component, ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { fetchMatchPreview } from '../api/granite'
import { getDemoLineup } from '../data/demoLineups'
import { useStore } from '../store/useStore'
import { MatchHero } from '../components/matchday/MatchHero'
import { LineupPanel } from '../components/matchday/LineupPanel'
import { StoryPanel } from '../components/matchday/StoryPanel'
import { BattlesPanel } from '../components/matchday/BattlesPanel'
import { TacticsPanel } from '../components/matchday/TacticsPanel'
import { BuildUpPanel } from '../components/matchday/BuildUpPanel'

class LineupErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-text-secondary text-sm text-center p-8">
          Lineup data unavailable for this match
        </div>
      )
    }
    return this.props.children
  }
}

export const Matchday = () => {
  const selectedMatch = useStore((state) => state.selectedMatch)
  const { matchPreviews, setMatchPreview } = useStore()
  const [activeTab, setActiveTab] = useState('story')

  useEffect(() => {
    if (!selectedMatch) return
    const matchId = selectedMatch.id
    if (!matchPreviews[matchId]) {
      const getPreview = async () => {
        try {
          const homeDemo = getDemoLineup(selectedMatch.homeTeam.tla)
          const awayDemo = getDemoLineup(selectedMatch.awayTeam.tla)
          const homeKeyPlayers = homeDemo ? homeDemo.lineup.filter(p => p.isKey).map(p => p.name).join(', ') : ''
          const awayKeyPlayers = awayDemo ? awayDemo.lineup.filter(p => p.isKey).map(p => p.name).join(', ') : ''

          console.log(`Calling match_preview for: ${selectedMatch.homeTeam.name} vs ${selectedMatch.awayTeam.name}, matchId: ${selectedMatch.id}`)
          const preview = await fetchMatchPreview({
            homeTeam: selectedMatch.homeTeam.name,
            awayTeam: selectedMatch.awayTeam.name,
            homeTLA: selectedMatch.homeTeam.tla,
            awayTLA: selectedMatch.awayTeam.tla,
            competition: selectedMatch.competition.name,
            standingGroup: selectedMatch.group || 'N/A',
            startDateTimeUtc: selectedMatch.utcDate,
            homeFormation: homeDemo ? homeDemo.formation : '4-3-3',
            awayFormation: awayDemo ? awayDemo.formation : '4-2-3-1',
            eventId: selectedMatch.id,
            homeKeyPlayers,
            awayKeyPlayers
          })
          setMatchPreview(matchId, preview)
        } catch (e) {
          setMatchPreview(matchId, {
            tagline: "A crucial encounter with no margin for error.",
            story: "Both teams arrive knowing that any mistake could be fatal. The stakes have never been higher.",
            tactics_home: `${selectedMatch.homeTeam.name} will look to control the tempo.`,
            tactics_away: `${selectedMatch.awayTeam.name} will try to strike on the break.`,
            buildup: "The atmosphere is electric as the fans await kickoff.",
            key_battle: "The midfield battle will be decisive.",
            key_battles: []
          })
        }
      }
      getPreview()
    }
  }, [selectedMatch, matchPreviews, setMatchPreview])

  if (!selectedMatch) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="font-display text-2xl font-medium">
          <span className="text-text-primary">Pitch</span>
          <span className="text-accent-green">Side</span>
        </div>
        <div className="font-serif italic text-text-secondary text-lg mt-2">
          Your companion for the World Cup 2026.
        </div>
        <div className="text-text-secondary text-sm mt-4 mb-6">
          Select a match from the sidebar to begin.
        </div>
        <div className="flex gap-3">
          <span className="bg-bg-card border border-border-default rounded-full px-4 py-2 text-xs text-text-secondary shadow-sm">🔍 Pre-match stories</span>
          <span className="bg-bg-card border border-border-default rounded-full px-4 py-2 text-xs text-text-secondary shadow-sm">⚡ Live explanations</span>
          <span className="bg-bg-card border border-border-default rounded-full px-4 py-2 text-xs text-text-secondary shadow-sm">🔄 What-if simulator</span>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'lineups', label: 'Lineups' },
    { id: 'story', label: 'The story' },
    { id: 'battles', label: 'Key battles' },
    { id: 'tactics', label: 'Tactics' },
    { id: 'buildup', label: 'Build-up' }
  ]

  return (
    <div className="flex flex-col h-full">
      <MatchHero match={selectedMatch} />
      
      <div className="flex border-b border-border-default px-5 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 px-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'text-text-primary border-accent-green' 
                : 'text-text-dim border-transparent hover:text-text-primary'
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
            {activeTab === 'lineups' && <LineupErrorBoundary><LineupPanel match={selectedMatch} /></LineupErrorBoundary>}
            {activeTab === 'story' && <StoryPanel match={selectedMatch} />}
            {activeTab === 'battles' && <BattlesPanel matchId={selectedMatch.id} />}
            {activeTab === 'tactics' && <TacticsPanel match={selectedMatch} />}
            {activeTab === 'buildup' && <BuildUpPanel match={selectedMatch} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

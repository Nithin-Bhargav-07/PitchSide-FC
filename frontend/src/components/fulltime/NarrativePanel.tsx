import { useState, useEffect } from 'react'
import type {  Match, MatchEvent, PlayerStatSummary  } from '../../types'
import { GraniteCard } from '../shared/GraniteCard'
import axios from 'axios'
import type { MatchInsightChips } from '../../utils/matchInsights'

const BASE = import.meta.env.VITE_API_BASE_URL

export const NarrativePanel = ({ 
  match, 
  events, 
  insights,
  playerStats 
}: { 
  match: Match, 
  events: MatchEvent[], 
  insights: { turningPoint: string, decisiveMoment: string, chips: MatchInsightChips },
  playerStats: PlayerStatSummary[] 
}) => {
  const [narrative, setNarrative] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNarrative = async () => {
      setLoading(true)
      try {
        const topPlayer = playerStats && playerStats.length > 0 ? playerStats[0].player.name : "None"
        
        const facts = `Match: ${match.homeTeam.name} vs ${match.awayTeam.name}. Final score: ${match.score.home}-${match.score.away}. Important events: ${events.map(e => `${e.minute}' ${e.type} by ${e.playerName}`).join(', ')}. Top player: ${topPlayer}. Turning point: ${insights.turningPoint}. Decisive moment: ${insights.decisiveMoment}.`
        
        const response = await axios.post(`${BASE}/granite/postmatch`, {
          facts,
        })
        setNarrative(response.data.narrative)
      } catch (e) {
        setNarrative("A defining match that was ultimately decided by key moments in transition. The turning point proved to be the second-half adjustments that opened up the game.")
      } finally {
        setLoading(false)
      }
    }
    fetchNarrative()
  }, [match.id, events, insights, playerStats])

  return (
    <div className="flex flex-col gap-6">
      <GraniteCard text={narrative} isLoading={loading} />
      
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-4">
          <h4 className="text-[12px] text-accent-gold uppercase tracking-wider mb-2">Turning Point</h4>
          <p className="font-serif text-[14px] text-text-ai leading-relaxed">
            {insights.turningPoint || "No clear turning point."}
          </p>
        </div>
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-4">
          <h4 className="text-[12px] text-accent-green uppercase tracking-wider mb-2">Decisive Moment</h4>
          <p className="font-serif text-[14px] text-text-ai leading-relaxed">
            {insights.decisiveMoment || "No decisive moment."}
          </p>
        </div>
      </div>
    </div>
  )
}

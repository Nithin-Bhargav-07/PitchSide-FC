import { useState } from 'react'
import type {  MatchEvent, Match  } from '../../types'
import { GraniteCard } from '../shared/GraniteCard'
import { TeamLogo } from '../shared/TeamLogo'
import { explainEvent } from '../../api/granite'
import { motion } from 'framer-motion'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL

export const EventCard = ({ event, match }: { event: MatchEvent, match: Match }) => {
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [ruleBadge, setRuleBadge] = useState<string | null>(null)

  const handleExplain = async () => {
    if (explanation || loading) return
    setLoading(true)
    try {
      // Fetch rule from RAG service
      const ruleRes = await axios.get(`${BASE}/ifab/rule/${event.type}`)
      const ruleText = ruleRes.data.rule_text
      
      // Update badge based on rule
      if (ruleText && ruleText.includes('Law 12')) setRuleBadge('Law 12')
      else if (ruleText && ruleText.includes('Law 11')) setRuleBadge('Law 11')
      else if (ruleText && ruleText.includes('Law 3')) setRuleBadge('Law 3')
      else if (ruleText && ruleText.includes('Law 1')) setRuleBadge('Law 1')

      // Fetch explanation from Granite
      const text = await explainEvent({
        event_type: event.type,
        event_detail: event.detail || '',
        rule_text: ruleText,
        match_context: `Explain this match event:
Event type: ${event.type}
Minute: ${event.minute}
Player: ${event.playerName || 'Unknown'} (use this exact name — do not substitute any other player name)
Team: ${event.team} (${match?.homeTeam?.name} is home, ${match?.awayTeam?.name} is away)
Detail: ${event.detail}
Score at time of event: ${event.score?.home ?? 0}-${event.score?.away ?? 0}
Current match score: ${match.score?.home ?? 0}-${match.score?.away ?? 0}
Match: ${match?.homeTeam?.name} vs ${match?.awayTeam?.name}, ${match?.competition?.name}

IMPORTANT: Only refer to the player named above. Do not invent or substitute any other player name.
When describing what this means for the match, use the CURRENT score, not the score at the time of the event.`
      })
      
      setExplanation(text)
    } catch (e) {
      setExplanation("Unable to generate explanation at this time.")
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = () => {
    switch(event.type) {
      case 'GOAL': return { border: 'border-l-accent-gold', text: 'text-accent-gold', label: 'GOAL' }
      case 'RED_CARD': return { border: 'border-l-accent-red', text: 'text-accent-red', label: 'RED CARD' }
      case 'YELLOW_CARD': return { border: 'border-l-accent-yellow', text: 'text-accent-yellow', label: 'YELLOW CARD' }
      case 'VAR': return { border: 'border-l-accent-ai', text: 'text-accent-ai', label: 'VAR REVIEW' }
      case 'SUBSTITUTION': return { border: 'border-l-accent-green', text: 'text-accent-green', label: 'SUBSTITUTION' }
      default: return { border: 'border-l-text-dim', text: 'text-text-secondary', label: event.type }
    }
  }

  const colors = getTypeColor()

  const team = event.team === 'home' ? match.homeTeam : match.awayTeam

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col bg-bg-card border border-border-default border-l-4 rounded-r-lg mb-2 p-3 ${colors.border}`}
    >
      <div className="flex items-start gap-3">
        <div className="font-mono text-[13px] text-text-secondary w-8 pt-0.5">{event.minute}'</div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[13px] font-medium tracking-wider ${colors.text}`}>
                {colors.label} {event.playerName ? `• ${event.playerName}` : ''}
              </span>
              <div className="flex items-center gap-1 bg-bg-primary border border-border-default px-1.5 py-0.5 rounded opacity-80">
                <TeamLogo src={team.crest} alt={team.tla} tla={team.tla} className="w-4 h-4 object-contain" fallbackClassName="text-[13px] px-1 py-0.5" />
                <span className="text-[13px] font-medium text-text-secondary">{team.tla}</span>
              </div>
            </div>
            {event.score && (
              <span className="font-mono text-[13px] bg-bg-primary px-1.5 py-0.5 rounded border border-border-default">
                {event.score.home}-{event.score.away}
              </span>
            )}
          </div>
          
          <p className="text-[14px] text-text-ai leading-relaxed mb-2">
            {event.detail} {event.assistName ? `(Assist: ${event.assistName})` : ''} {event.playerOff ? `(Off: ${event.playerOff})` : ''}
          </p>
          
          <button 
            onClick={handleExplain}
            disabled={loading || !!explanation}
            className="text-[13px] border border-border-default rounded-full px-3 py-1 mt-1 text-text-secondary hover:border-accent-ai hover:text-accent-ai transition-colors disabled:opacity-50"
          >
            {explanation ? 'Explained' : loading ? 'Analyzing...' : 'Explain this'}
          </button>
        </div>
      </div>

      {(loading || explanation) && (
        <div className="mt-3 ml-11">
          <GraniteCard text={explanation} isLoading={loading} lawBadge={ruleBadge} />
        </div>
      )}
    </motion.div>
  )
}

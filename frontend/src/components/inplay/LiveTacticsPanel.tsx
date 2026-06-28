import { useState, useEffect } from 'react'
import type {  Match, MatchEvent  } from '../../types'
import { GraniteCard } from '../shared/GraniteCard'
import { generateNarrative } from '../../api/granite'

export const LiveTacticsPanel = ({ match, events }: { match: Match, events: MatchEvent[] }) => {
  const [narrative, setNarrative] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNarrative = async () => {
      setLoading(true)
      try {
        const text = await generateNarrative({
          match_context: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
          events: events.slice(0, 3).map(e => `${e.minute}': ${e.type} - ${e.detail}`).join(', ')
        }, 'tactics')
        setNarrative(text)
      } catch (e) {
        setNarrative("The match has settled into a rhythmic pattern, with the home side looking to exploit the flanks while the visitors maintain a compact defensive block.")
      } finally {
        setLoading(false)
      }
    }
    fetchNarrative()
  }, [match.id, events.length])

  return (
    <div className="flex flex-col gap-4">
      <GraniteCard text={narrative} isLoading={loading} />
      
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-3">
          <h4 className="text-[12px] text-text-secondary uppercase tracking-wider mb-2">Midfield Duel</h4>
          <p className="text-[14px] text-text-ai leading-relaxed">The central battle has intensified, with more tackles being contested as both teams fight for possession dominance.</p>
        </div>
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-3">
          <h4 className="text-[12px] text-text-secondary uppercase tracking-wider mb-2">Attacking Width</h4>
          <p className="text-[14px] text-text-ai leading-relaxed">Full-backs are pushing higher up the pitch, leaving potential space for counter-attacks in behind.</p>
        </div>
      </div>
    </div>
  )
}

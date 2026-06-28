import type { MatchEvent, Match } from '../../types'
import { TeamLogo } from '../shared/TeamLogo'

export const EventTimeline = ({ events, match }: { events: MatchEvent[], match: Match }) => {
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'GOAL': return 'bg-accent-gold border-accent-gold'
      case 'RED_CARD': return 'bg-accent-red border-accent-red'
      case 'YELLOW_CARD': return 'bg-accent-yellow border-accent-yellow'
      case 'VAR': return 'bg-accent-ai border-accent-ai'
      case 'SUBSTITUTION': return 'bg-accent-green border-accent-green'
      default: return 'bg-border-strong border-border-default'
    }
  }

  // Ensure chronological order for timeline
  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute)

  return (
    <div className="flex flex-col relative py-2">
      <div className="absolute left-[29px] top-4 bottom-4 w-0.5 bg-border-default"></div>
      
      {sortedEvents.map((event) => {
        const team = event.team === 'home' ? match.homeTeam : match.awayTeam;
        return (
          <div key={event.id} className="flex items-start gap-4 mb-4 relative z-10">
            <div className="font-mono text-[12px] text-text-secondary w-4 pt-1 text-right">
              {event.minute}'
            </div>
            
            <div className={`w-3 h-3 rounded-full border-2 mt-1 flex-shrink-0 ${getTypeColor(event.type)}`} />
            
            <div className={`flex-1 bg-bg-card border border-border-default border-l-4 rounded-xl shadow-sm p-3 ${
              event.team === 'home' ? 'border-l-accent-gold' : 'border-l-accent-green'
            }`}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[12px] font-medium tracking-wider text-text-primary`}>
                    {event.type.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 bg-bg-primary border border-border-default px-1.5 py-0.5 rounded opacity-80">
                    <TeamLogo src={team.crest} alt={team.tla} tla={team.tla} className="w-3 h-3 object-contain" fallbackClassName="text-[8px] px-1 py-0.5" />
                    <span className="text-[9px] font-medium text-text-secondary">{team.tla}</span>
                  </div>
                </div>
                {event.score && (
                  <span className="font-mono text-[12px] text-text-secondary bg-bg-primary px-1.5 py-0.5 rounded border border-border-default">
                    {event.score.home}-{event.score.away}
                  </span>
                )}
              </div>
              <p className="text-[14px] text-text-ai leading-relaxed">
                {event.detail} {event.playerName ? `(${event.playerName})` : ''}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

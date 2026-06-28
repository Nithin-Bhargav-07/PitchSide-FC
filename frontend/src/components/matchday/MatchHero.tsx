import type { Match } from '../../types'
import { format } from 'date-fns'
import { MapPin } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { getVenueForMatch } from '../../data/wcVenues'

export const MatchHero = ({ match }: { match: Match }) => {
  const { matchPreviews } = useStore()
  const tagline = matchPreviews[match.id]?.tagline

  const getBadgeColor = (tla: string) => {
    switch(tla) {
      case 'BRA': return 'bg-green-900 text-yellow-300'
      case 'ARG': return 'bg-sky-900 text-sky-200'
      case 'ESP': return 'bg-red-900 text-yellow-300'
      case 'USA': return 'bg-blue-900 text-white'
      case 'MEX': return 'bg-green-800 text-white'
      case 'GER': return 'bg-gray-900 text-white'
      default: return 'bg-border-strong text-text-secondary'
    }
  }

  return (
    <div className="bg-bg-hero border-b border-border-default py-3 px-4 flex flex-col items-center">
      <div className="text-[13px] text-text-secondary tracking-widest uppercase mb-2">
        {match.competition.name}
      </div>
      
      <div className="flex items-center justify-center w-full gap-2 md:gap-4 mb-2">
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className={`font-mono text-[13px] px-2 py-0.5 rounded ${getBadgeColor(match.homeTeam.tla)}`}>
            {match.homeTeam.tla}
          </span>
          <span className="font-display text-lg md:text-2xl font-semibold text-right">{match.homeTeam.name}</span>
        </div>
        
        <div className="font-mono text-2xl md:text-4xl font-medium tracking-tighter">
          {format(new Date(match.utcDate), 'HH:mm')}
        </div>
        
        <div className="flex items-center gap-3 flex-1 justify-start">
          <span className="font-display text-lg md:text-2xl font-semibold">{match.awayTeam.name}</span>
          <span className={`font-mono text-[13px] px-2 py-0.5 rounded ${getBadgeColor(match.awayTeam.tla)}`}>
            {match.awayTeam.tla}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1 text-xs text-text-secondary mt-1">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <MapPin className="w-3 h-3" />
          <span>{match.venue && match.venue !== 'TBD Venue' ? match.venue : getVenueForMatch((match as any).standingGroup)}</span>
        </div>
        <div className="text-text-secondary">{format(new Date(match.utcDate), 'EEEE, MMMM d, yyyy')}</div>
        {tagline && (
          <div className="italic font-serif text-text-secondary text-[14px] md:text-sm text-center max-w-lg mx-auto mt-2 leading-relaxed">
            {tagline}
          </div>
        )}
      </div>
    </div>
  )
}

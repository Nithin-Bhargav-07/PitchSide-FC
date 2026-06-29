import { format, addDays, subDays } from 'date-fns'
import { useStore } from '../../store/useStore'
import { useMatches } from '../../hooks/useMatches'
import type { Match } from '../../types'
import { TeamLogo } from '../shared/TeamLogo'

const COMPETITIONS = [
  { code: 'WC', name: 'World Cup' },
  { code: 'PL', name: 'EPL' },
  { code: 'CL', name: 'UCL' },
  { code: 'PD', name: 'La Liga' },
]

export const Sidebar = () => {
  const { 
    selectedDate, setSelectedDate, 
    activeCompetition, setActiveCompetition,
    selectedMatch, setSelectedMatch
  } = useStore()
  
  const { data: matches, isLoading } = useMatches()

  // 5 days strip
  const today = new Date()
  const dates = [
    subDays(today, 2),
    subDays(today, 1),
    today,
    addDays(today, 1),
    addDays(today, 2)
  ]

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match)
  }

  return (
    <aside className="hidden md:flex flex-col w-[320px] h-screen bg-bg-sidebar border-r border-border-dark-default overflow-hidden flex-shrink-0">
      <div className="p-3 border-b border-border-dark-default overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-2">
        {COMPETITIONS.map(comp => (
          <button
            key={comp.code}
            onClick={() => setActiveCompetition(comp.code)}
            className={`text-[13px] px-3 py-1 rounded-full transition-colors ${
              activeCompetition === comp.code 
                ? 'bg-accent-green text-black font-medium' 
                : 'border border-border-dark-default text-text-dark-secondary hover:text-white'
            }`}
          >
            {comp.name}
          </button>
        ))}
      </div>

      <div className="p-3 border-b border-border-dark-default flex justify-between">
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
                isToday ? 'text-white font-bold' : 'text-text-dark-secondary'
              }`}
            >
                <span className="text-[12px] uppercase">{format(d, 'EEE')}</span>
                <span className="text-[12px]">{format(d, 'd')}</span>
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="p-3 text-center text-[14px] text-text-dark-secondary">Loading matches...</div>
        ) : ['PL', 'CL', 'PD'].includes(activeCompetition) ? (
          <div className="text-text-dim text-xs text-center p-4">
            Competition data coming soon — try World Cup
          </div>
        ) : !matches || matches.length === 0 ? (
          <div className="p-3 text-center text-[14px] text-text-dark-secondary">No matches found.</div>
        ) : (
          matches.filter(m => m.competition.code === activeCompetition || activeCompetition === 'WC').map(match => {
            const isSelected = selectedMatch?.id === match.id
            const isLive = ['LIVE', 'IN_PLAY', 'PAUSED'].includes(match.status)

            return (
              <button
                key={match.id}
                onClick={() => handleMatchClick(match)}
                className={`w-full text-left p-2.5 rounded transition-colors ${
                  isSelected ? 'bg-bg-dark-hover border-l-2 border-accent-green' : 'hover:bg-bg-dark-hover border-l-2 border-transparent'
                }`}
              >
                <div className="text-[12px] text-text-dark-secondary mb-1">
                  {match?.competition?.name} • {format(new Date(match.utcDate), 'MMM d')}
                </div>
                
                <div className="flex justify-between items-center mb-1 px-1">
                    <div className="flex items-center gap-1.5 w-[35%]">
                    <TeamLogo src={match?.homeTeam?.crest} alt={match?.homeTeam?.name} tla={match?.homeTeam?.tla} />
                    <span className="text-[14px] font-medium text-white truncate">{match?.homeTeam?.tla}</span>
                  </div>
                  <div className="flex-1 flex justify-center">
                    {isLive ? (
                      <span className="text-accent-green font-bold text-[12px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></span>
                        {match.minute || 'LIVE'}
                      </span>
                    ) : (
                      <span className="font-mono text-[12px] text-white">
                        {['LIVE', 'IN_PLAY', 'PAUSED', 'FINISHED'].includes(match.status) &&
                         match.score?.home != null
                          ? `${match.score?.home} - ${match.score?.away}`
                          : format(new Date(match.utcDate), 'HH:mm')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 w-[35%]">
                    <span className="text-[14px] font-medium text-white truncate">{match?.awayTeam?.tla}</span>
                    <TeamLogo src={match?.awayTeam?.crest} alt={match?.awayTeam?.name} tla={match?.awayTeam?.tla} />
                  </div>
                </div>

                <div className="text-[12px] text-text-dark-secondary truncate">
                  {match.venue || 'TBD Venue'}
                </div>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}

import type {  Match  } from '../../types'

export const ScoreHero = ({ match, isFullTime = false }: { match: Match, isFullTime?: boolean }) => {
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
    <div className="bg-bg-hero border-b border-border-default py-3 px-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="text-[12px] text-accent-gold tracking-widest uppercase">
          {match?.competition?.name}
        </div>
        {isFullTime ? (
          <div className="text-[12px] font-medium bg-border-strong text-text-primary border border-border-default rounded-full px-2 py-0.5">
            FULL TIME
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-accent-green/10 border border-accent-green/30 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-[pulse_1.2s_ease-in-out_infinite] opacity-100"></span>
            <span className="text-accent-green text-[12px] font-medium tracking-wide">LIVE</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center w-full max-w-lg mx-auto mb-2">
        <div className="flex flex-col items-center gap-1.5 w-1/3">
          <span className={`font-mono text-[12px] px-2 py-0.5 rounded ${getBadgeColor(match.homeTeam.tla)}`}>
            {match.homeTeam.tla}
          </span>
          <span className="font-display text-base md:text-xl font-semibold text-center leading-tight">{match?.homeTeam?.name}</span>
        </div>
        
        <div className="font-mono text-4xl font-medium tracking-tighter w-1/3 text-center">
          {match.score.home ?? 0} - {match.score.away ?? 0}
        </div>
        
        <div className="flex flex-col items-center gap-1.5 w-1/3">
          <span className={`font-mono text-[12px] px-2 py-0.5 rounded ${getBadgeColor(match.awayTeam.tla)}`}>
            {match.awayTeam.tla}
          </span>
          <span className="font-display text-base md:text-xl font-semibold text-center leading-tight">{match?.awayTeam?.name}</span>
        </div>
      </div>
      
      {!isFullTime && (
        <div className="text-center font-mono text-[13px] text-text-secondary">
          {match.minute}'
        </div>
      )}
    </div>
  )
}

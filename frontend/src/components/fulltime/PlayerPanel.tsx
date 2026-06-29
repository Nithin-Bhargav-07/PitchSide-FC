import { Star } from 'lucide-react'
import type { PlayerStatSummary, Team } from '../../types'

export const PlayerPanel = ({ 
  homeTeam, 
  awayTeam, 
  playerStats 
}: { 
  homeTeam: Team, 
  awayTeam: Team, 
  playerStats: PlayerStatSummary[] 
}) => {
  const allStatsZero = !playerStats || !Array.isArray(playerStats) || playerStats.length === 0 || playerStats.every(p => 
    !p.stats || p.stats.length === 0 || p.stats.every(s => s.numericValue === 0)
  )

  if (allStatsZero) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-text-secondary text-sm">
          Detailed player stats aren't available for this match.
        </span>
        <span className="text-text-dim text-xs mt-1">
          Try a higher-scoring match for full stats
        </span>
      </div>
    )
  }

  const sortByRating = (arr: any[]) => [...arr].sort((a, b) => {
    const rA = parseFloat(String(a?.player?.rating ?? '0')) || 0
    const rB = parseFloat(String(b?.player?.rating ?? '0')) || 0
    return rB - rA
  })
  
  const sortedStats = sortByRating(playerStats || [])
  
  const homePlayers = (sortedStats || [])
    .filter(p => p != null && p !== undefined && p.player != null && p.player.teamSide === '1')
    .slice(0, 5)

  const awayPlayers = (sortedStats || [])
    .filter(p => p != null && p !== undefined && p.player != null && p.player.teamSide === '2')
    .slice(0, 5)

  const PlayerCard = ({ data }: { data: PlayerStatSummary }) => {
    const isStar = data.player.rating > 8.0
    // Show up to 3 interesting stats
    const topStats = data.stats
      .filter(s => s.numericValue > 0)
      .slice(0, 3)

    return (
      <div className="flex items-center gap-3 p-3 bg-bg-card border border-border-default rounded-xl">
        <div className="w-10 h-10 shrink-0 bg-accent-gold/10 rounded flex items-center justify-center relative border border-accent-gold/20">
          <span className="text-[13px] font-mono text-accent-gold font-bold">
            {data.player.rating.toFixed(1)}
          </span>
          {isStar && (
            <div className="absolute -top-1.5 -right-1.5">
              <Star className="w-3.5 h-3.5 text-accent-gold fill-accent-gold" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-text-primary truncate">
              {data?.player?.name}
            </span>
            <span className="text-[10px] font-mono text-text-secondary px-1.5 py-0.5 bg-bg-hover rounded border border-border-default">
              {data.player.position}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {topStats.length > 0 ? (
              topStats.map((stat, i) => (
                <span key={i} className="text-[10px] text-text-secondary px-2 py-0.5 rounded-full bg-bg-primary border border-border-default whitespace-nowrap">
                  <span className="text-text-primary font-medium">{stat.displayValue}</span> {stat.statsKey.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-text-dim italic">No key stats</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-border-default pb-2">
            {homeTeam.crest && <img src={homeTeam.crest} alt="" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
            <h3 className="font-serif text-lg text-text-primary">{homeTeam?.name} Top Performers</h3>
          </div>
          <div className="space-y-2">
            {homePlayers.map(p => <PlayerCard key={p.player.id} data={p} />)}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-border-default pb-2">
            {awayTeam.crest && <img src={awayTeam.crest} alt="" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
            <h3 className="font-serif text-lg text-text-primary">{awayTeam?.name} Top Performers</h3>
          </div>
          <div className="space-y-2">
            {awayPlayers.map(p => <PlayerCard key={p.player.id} data={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

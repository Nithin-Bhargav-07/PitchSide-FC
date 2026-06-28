import type {  MatchStats  } from '../../types'
import { StatBar } from '../shared/StatBar'

export const LiveStatsPanel = ({ stats }: { stats: MatchStats }) => {
  if (!stats) return <div className="text-center text-text-secondary text-sm mt-10">Stats not available yet.</div>

  return (
    <div className="flex flex-col">
      <StatBar homeValue={stats.shots.home} awayValue={stats.shots.away} label="Shots" />
      <StatBar homeValue={stats.shotsOnTarget.home} awayValue={stats.shotsOnTarget.away} label="Shots on Target" />
      <StatBar homeValue={stats.corners.home} awayValue={stats.corners.away} label="Corners" />
      <StatBar homeValue={stats.fouls.home} awayValue={stats.fouls.away} label="Fouls" />
      <StatBar homeValue={stats.passes.home} awayValue={stats.passes.away} label="Passes" />
      <StatBar homeValue={stats.passAccuracy.home} awayValue={stats.passAccuracy.away} label="Pass Accuracy %" />
      <StatBar homeValue={stats.saves.home} awayValue={stats.saves.away} label="Saves" />
      <StatBar homeValue={stats.offsides.home} awayValue={stats.offsides.away} label="Offsides" />
    </div>
  )
}

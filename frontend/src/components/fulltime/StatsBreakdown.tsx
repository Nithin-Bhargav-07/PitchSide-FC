import type {  MatchStats  } from '../../types'
import { StatBar } from '../shared/StatBar'

import { Skeleton } from '../shared/Skeleton'

export const StatsBreakdown = ({ stats }: { stats: MatchStats }) => {
  console.log("Stats Breakdown received:", stats)

  if (!stats) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    )
  }

  if (!stats.possession || (!stats.possession.home && !stats.possession.away)) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center h-32 text-text-secondary text-sm">
          Match stats unavailable
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex justify-between items-center mb-1 text-[12px] text-text-secondary uppercase tracking-wider px-2">
          <span>Possession</span>
        </div>
        <div className="w-full h-3 bg-border-default rounded-full flex overflow-hidden mb-2">
          <div className="bg-accent-green h-full" style={{ width: `${stats.possession.home}%` }} />
          <div className="bg-accent-ai h-full" style={{ width: `${stats.possession.away}%` }} />
        </div>
        <div className="flex justify-between text-xs font-mono">
          <span className="text-accent-green">{stats.possession.home}%</span>
          <span className="text-accent-ai">{stats.possession.away}%</span>
        </div>
      </div>

      <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-4">
        <StatBar homeValue={stats.shots.home} awayValue={stats.shots.away} label="Total Shots" />
        <StatBar homeValue={stats.shotsOnTarget.home} awayValue={stats.shotsOnTarget.away} label="On Target" />
        <StatBar homeValue={stats.corners.home} awayValue={stats.corners.away} label="Corners" />
        <StatBar homeValue={stats.fouls.home} awayValue={stats.fouls.away} label="Fouls" />
        <StatBar homeValue={stats.passes.home} awayValue={stats.passes.away} label="Total Passes" />
        <StatBar homeValue={stats.accuratePassesPercentage.home} awayValue={stats.accuratePassesPercentage.away} label="Pass Acc %" />
      </div>
    </div>
  )
}

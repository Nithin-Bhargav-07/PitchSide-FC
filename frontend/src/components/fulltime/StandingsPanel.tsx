import { useQuery } from '@tanstack/react-query'
import { fetchStandings } from '../../api/football'
import type {  Match  } from '../../types'
import { Skeleton } from '../shared/Skeleton'
import { GraniteCard } from '../shared/GraniteCard'

export const StandingsPanel = ({ match, standings }: { match: Match, standings?: any }) => {
  // Simulated static standings for visual purposes if no API data exists
  const mockStandings = [
    { position: 1, team: { name: 'United States', tla: 'USA' }, playedGames: 3, won: 2, draw: 1, lost: 0, goalDifference: 4, points: 7 },
    { position: 2, team: { name: 'England', tla: 'ENG' }, playedGames: 3, won: 1, draw: 2, lost: 0, goalDifference: 2, points: 5 },
    { position: 3, team: { name: 'Mexico', tla: 'MEX' }, playedGames: 3, won: 1, draw: 1, lost: 1, goalDifference: -1, points: 4 },
    { position: 4, team: { name: 'Iran', tla: 'IRN' }, playedGames: 3, won: 0, draw: 0, lost: 3, goalDifference: -5, points: 0 },
  ]

  const displayStandings = standings?.standings?.[0]?.table || mockStandings

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-bg-card border border-border-default rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-primary border-b border-border-default">
            <tr>
              <th className="p-3 font-medium text-text-secondary w-10 text-center">#</th>
              <th className="p-3 font-medium text-text-secondary">Team</th>
              <th className="p-3 font-medium text-text-secondary text-center w-8">P</th>
              <th className="p-3 font-medium text-text-secondary text-center w-8">W</th>
              <th className="p-3 font-medium text-text-secondary text-center w-8">D</th>
              <th className="p-3 font-medium text-text-secondary text-center w-8">L</th>
              <th className="p-3 font-medium text-text-secondary text-center w-8">GD</th>
              <th className="p-3 font-medium text-text-secondary text-center w-10">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {(!displayStandings || displayStandings.length === 0) ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={8} className="p-3"><Skeleton className="h-4 w-full" /></td>
                </tr>
              ))
            ) : (
              displayStandings.map((row: any) => {
                const isMatchTeam = row.team.name === match.homeTeam.name || row.team.name === match.awayTeam.name
                return (
                  <tr key={row.position} className={isMatchTeam ? 'bg-accent-green/5' : ''}>
                    <td className="p-3 font-mono text-center text-text-secondary">{row.position}</td>
                    <td className={`p-3 font-medium ${isMatchTeam ? 'text-accent-green' : 'text-text-primary'}`}>
                      {row.team.name}
                    </td>
                    <td className="p-3 font-mono text-center text-text-secondary">{row.playedGames}</td>
                    <td className="p-3 font-mono text-center text-text-secondary">{row.won}</td>
                    <td className="p-3 font-mono text-center text-text-secondary">{row.draw}</td>
                    <td className="p-3 font-mono text-center text-text-secondary">{row.lost}</td>
                    <td className="p-3 font-mono text-center text-text-secondary">{row.goalDifference}</td>
                    <td className="p-3 font-mono text-center font-bold text-text-primary">{row.points}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <GraniteCard 
        text="This result significantly alters the qualification picture. The winners secure top spot in the group, ensuring a potentially favorable draw in the knockout stages, while leaving the losers relying on other results."
        isLoading={false}
      />
    </div>
  )
}

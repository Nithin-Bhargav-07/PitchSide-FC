import { useQuery } from '@tanstack/react-query'
import { fetchMatchDetails, fetchMatchStats, fetchMatchPlayerStats, fetchStandings } from '../api/football'

export const useFullTimeMatch = (matchId: string | null, competitionId: string | undefined) => {
  return useQuery({
    queryKey: ['fullTimeMatch', matchId],
    queryFn: async () => {
      if (!matchId) throw new Error('No match ID')
      
      const [details, stats, playerStats, standings] = await Promise.all([
        fetchMatchDetails(matchId).catch(() => null),
        fetchMatchStats(matchId).catch(() => null),
        fetchMatchPlayerStats(matchId).catch(() => null),
        competitionId ? fetchStandings(competitionId).catch(() => null) : Promise.resolve(null)
      ])

      return {
        details,
        stats,
        playerStats,
        standings
      }
    },
    enabled: !!matchId,
    staleTime: Infinity, // Cache permanently once fetched
  })
}

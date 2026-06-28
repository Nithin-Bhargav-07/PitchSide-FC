import { useQuery } from '@tanstack/react-query'
import { fetchLiveMatch } from '../api/football'

export const useLiveMatch = (matchId: string | null) => {
  return useQuery({
    queryKey: ['liveMatch', matchId],
    queryFn: async () => {
      return matchId ? fetchLiveMatch(matchId) : null
    },
    enabled: !!matchId,
    refetchInterval: 10000 // Poll every 10 seconds for live updates
  })
}

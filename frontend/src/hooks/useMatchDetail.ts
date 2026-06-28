import { useQuery } from '@tanstack/react-query'
import { fetchLineup } from '../api/football'

export const useMatchDetail = (matchId: string | null, options?: any) => {
  return useQuery({
    queryKey: ['matchDetail', matchId],
    queryFn: () => matchId ? fetchLineup(matchId) : null,
    enabled: !!matchId && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    ...options
  })
}

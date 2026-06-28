import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '../api/football'
import { format, subDays } from 'date-fns'
import type { Match } from '../types'

export const useRecentMatches = () => {
  return useQuery({
    queryKey: ['recentMatches'],
    queryFn: async () => {
      const today = new Date()
      const dates = [
        format(today, 'yyyy-MM-dd'),
        format(subDays(today, 1), 'yyyy-MM-dd'),
        format(subDays(today, 2), 'yyyy-MM-dd'),
        format(subDays(today, 3), 'yyyy-MM-dd'),
      ]

      const responses = await Promise.all(dates.map(date => fetchMatches(date)))
      
      // Combine all arrays
      const allMatches = responses.reduce((acc, curr) => acc.concat(curr), [])
      
      // Filter for only finished matches
      const finishedMatches = allMatches.filter(m => m.status === 'FINISHED')
      
      // Deduplicate by ID just in case
      const uniqueMatches = Array.from(new Map(finishedMatches.map(m => [m.id, m])).values())
      
      // Sort by latest first
      uniqueMatches.sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())

      return uniqueMatches
    },
    staleTime: 60 * 1000,
  })
}

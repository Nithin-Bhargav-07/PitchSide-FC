import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '../api/football'
import { useStore } from '../store/useStore'

export const useMatches = () => {
  const selectedDate = useStore((state) => state.selectedDate)
  
  return useQuery({
    queryKey: ['matches', selectedDate],
    queryFn: () => fetchMatches(selectedDate),
    staleTime: 60 * 1000,
  })
}

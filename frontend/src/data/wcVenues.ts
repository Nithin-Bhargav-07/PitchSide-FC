export const WC_VENUES: Record<string, string> = {
  'A': 'SoFi Stadium, Los Angeles',
  'B': 'MetLife Stadium, New Jersey', 
  'C': 'AT&T Stadium, Dallas',
  'D': 'Mercedes-Benz Stadium, Atlanta',
  'E': 'Levi\'s Stadium, San Jose',
  'F': 'Rose Bowl, Pasadena',
  'G': 'Arrowhead Stadium, Kansas City',
  'H': 'NRG Stadium, Houston',
  'I': 'Lincoln Financial Field, Philadelphia',
  'J': 'Estadio Azteca, Mexico City',
  'K': 'Gillette Stadium, Boston',
  'L': 'BC Place, Vancouver',
}

export const getVenueForMatch = (standingGroup: string): string => {
  if (!standingGroup) return 'FIFA World Cup 2026 Venue'
  const group = standingGroup.replace('Group ', '').trim()
  return WC_VENUES[group] || 'FIFA World Cup 2026 Venue'
}

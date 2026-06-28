import { useState, useEffect } from 'react'
import type {  Match  } from '../../types'
import { ScoreHero } from '../inplay/ScoreHero'
import { generateTagline } from '../../api/granite'
import { getVenueForMatch } from '../../data/wcVenues'

export const ResultHero = ({ match, details }: { match: Match, details?: any }) => {
  const [tagline, setTagline] = useState<string | null>(null)

  useEffect(() => {
    const fetchTagline = async () => {
      try {
        const text = await generateTagline(`Result: ${match?.homeTeam?.name} vs ${match?.awayTeam?.name} in the ${match?.competition?.name}`)
        setTagline(text)
      } catch (e) {
        setTagline("A favourite with no margin for error against a side that has nothing to lose.")
      }
    }
    fetchTagline()
  }, [match.id])
  return (
    <div>
      <ScoreHero match={match} isFullTime={true} />
      <div className="bg-bg-primary px-4 py-2 border-b border-border-default flex items-center justify-center gap-4 text-[11px] text-text-secondary whitespace-nowrap overflow-x-auto hide-scrollbar">
        {details && (
          <>
            {((details.venue && details.venue !== 'TBD Venue') || details.venueCity || match) && (
              <span>{(details.venue && details.venue !== 'TBD Venue') ? `${details.venue}${details.venueCity ? ', ' + details.venueCity : ''}` : getVenueForMatch((match as any).standingGroup)}</span>
            )}
            {details.referee && (
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-border-strong mx-1" />
                Ref: {details.referee}
              </span>
            )}
            {details.attendance && (
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-border-strong mx-1" />
                {details.attendance.toLocaleString()} fans
              </span>
            )}
          </>
        )}
      </div>
      {tagline && (
        <div className="bg-bg-primary px-4 py-3 border-b border-border-default flex justify-center">
          <div className="italic font-serif text-text-secondary text-[14px] md:text-sm text-center max-w-lg mx-auto leading-relaxed">
            {tagline}
          </div>
        </div>
      )}
    </div>
  )
}

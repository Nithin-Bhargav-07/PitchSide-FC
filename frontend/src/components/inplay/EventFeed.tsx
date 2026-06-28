import type {  MatchEvent, Match  } from '../../types'
import { EventCard } from './EventCard'
import { MatchChat } from './MatchChat'

export const EventFeed = ({ events, match }: { events: MatchEvent[], match: Match }) => {
  if (!events || events.length === 0) {
    return <div className="text-center text-text-secondary text-sm mt-10">Waiting for match events...</div>
  }

  return (
    <div className="flex flex-col">
      {events.map((event) => (
        <EventCard key={event.id} event={event} match={match} />
      ))}
      <MatchChat match={match} />
    </div>
  )
}

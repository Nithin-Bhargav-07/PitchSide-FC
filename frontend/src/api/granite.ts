import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL

export const explainEvent = (payload: {
  event_type: string
  event_detail: string
  rule_text?: string
  match_context: string
}) => axios.post(`${BASE}/granite/explain`, { ...payload, endpoint_type: 'explain' }).then(r => r.data.text)

export const generateNarrative = (payload: object, endpoint_type: string) =>
  axios.post(`${BASE}/granite/explain`, { ...payload, endpoint_type }).then(r => r.data.text)

export const matchChat = (payload: { match_id: string, user_query: string }) =>
  axios.post(`${BASE}/granite/match_chat`, payload).then(r => r.data.text)

export const fetchMatchPreview = (payload: {
  homeTeam: string
  awayTeam: string
  homeTLA: string
  awayTLA: string
  competition: string
  standingGroup: string
  startDateTimeUtc: string
  homeFormation: string
  awayFormation: string
  eventId: string
  homeKeyPlayers?: string
  awayKeyPlayers?: string
}) => axios.post(`${BASE}/granite/match_preview`, payload).then(r => r.data)

export const simulateWhatIf = (payload: object) =>
  axios.post(`${BASE}/granite/whatif`, payload).then(r => r.data.narrative)

export const generateLineup = (teamName: string, formation: string) =>
  axios.post(`${BASE}/granite/explain`, { match_context: `Team: ${teamName}\nFormation: ${formation}`, endpoint_type: 'lineup_gen' }).then(r => r.data.text)

export const generateTagline = (match_context: string) =>
  axios.post(`${BASE}/granite/explain`, { match_context, endpoint_type: 'tagline' }).then(r => r.data.text)

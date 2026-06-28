import axios from 'axios'
import type {  Match, Lineup  } from '../types'

import { USA_MEXICO_MATCH, GERMANY_BRAZIL_MATCH, REAL_MADRID_DORTMUND_MATCH, MAN_CITY_WEST_HAM_MATCH } from '../data/demoMatches'

const BASE = import.meta.env.VITE_API_BASE_URL

export const fetchMatches = (date: string): Promise<Match[]> =>
  axios.get(`${BASE}/matches?date=${date}`).then(r => {
    const arr = Array.isArray(r.data) ? r.data : (r.data.matches || [])
    if (arr.length === 0) {
      return [USA_MEXICO_MATCH, GERMANY_BRAZIL_MATCH, REAL_MADRID_DORTMUND_MATCH, MAN_CITY_WEST_HAM_MATCH]
    }
    return arr
  })

export const fetchLineup = (matchId: string): Promise<Lineup> =>
  axios.get(`${BASE}/matches/${matchId}/lineup`).then(r => r.data)

export const fetchLiveMatch = (matchId: string) =>
  axios.get(`${BASE}/matches/${matchId}/live`).then(r => r.data)

export const fetchStandings = (competition: string) =>
  axios.get(`${BASE}/standings?competition=${competition}`).then(r => r.data)

export const fetchMatchDetails = (id: string) =>
  axios.get(`${BASE}/matches/${id}/details`).then(r => r.data)

export const fetchMatchStats = (id: string) =>
  axios.get(`${BASE}/matches/${id}/stats`).then(r => r.data)

export const fetchMatchPlayerStats = (id: string) =>
  axios.get(`${BASE}/matches/${id}/playerstats`).then(r => r.data)

import type {  MatchEvent, Match  } from '../types'

export const USA_MEXICO_EVENTS: MatchEvent[] = [
  { id: '1', type: 'KICKOFF', minute: 0, team: 'home', detail: 'USA 4-3-3 vs Mexico 4-2-3-1' },
  { id: '2', type: 'YELLOW_CARD', minute: 22, team: 'away', playerName: 'H. Moreno', detail: 'Tactical foul on Pulisic' },
  { id: '3', type: 'GOAL', minute: 38, team: 'away', playerName: 'H. Lozano', assistName: 'A. Guardado', detail: 'Counter-attack finish', score: { home: 0, away: 1 } },
  { id: '4', type: 'VAR', minute: 45, team: 'home', detail: 'Penalty awarded to USA — handball in box, VAR review confirmed', score: { home: 0, away: 1 } },
  { id: '5', type: 'GOAL', minute: 46, team: 'home', playerName: 'C. Pulisic', detail: 'Penalty conversion', score: { home: 1, away: 1 } },
  { id: '6', type: 'SUBSTITUTION', minute: 62, team: 'away', playerName: 'J. Corona', playerOff: 'A. Guardado', detail: 'Tactical change' },
  { id: '7', type: 'RED_CARD', minute: 67, team: 'away', playerName: 'C. Salcedo', detail: 'Violent conduct — lunge on Weah from behind' },
  { id: '8', type: 'SUBSTITUTION', minute: 70, team: 'home', playerName: 'F. Aaronson', playerOff: 'T. Adams', detail: 'Fresh legs in midfield' },
  { id: '9', type: 'GOAL', minute: 89, team: 'home', playerName: 'R. Weah', assistName: 'C. Pulisic', detail: 'Late winner — header from corner', score: { home: 2, away: 1 } },
  { id: '10', type: 'FULLTIME', minute: 90, team: 'home', detail: 'USA 2-1 Mexico' },
]

export const USA_MEXICO_MATCH = {
  id: '999999',
  homeTeam: { id: '1', name: 'United States', shortName: 'USA', tla: 'USA' },
  awayTeam: { id: '2', name: 'Mexico', shortName: 'MEX', tla: 'MEX' },
  score: { home: 2, away: 1 },
  competition: { name: 'FIFA World Cup 2026 — Round of 16', code: 'WC' },
  venue: 'SoFi Stadium, Los Angeles',
  status: 'FINISHED',
  utcDate: new Date().toISOString()
} as Match

export const GERMANY_BRAZIL_EVENTS: MatchEvent[] = [
  { id: '1', type: 'KICKOFF', minute: 0, team: 'home', detail: 'Germany vs Brazil — 2014 Semi-Final' },
  { id: '2', type: 'GOAL', minute: 11, team: 'home', playerName: 'T. Müller', assistName: 'T. Kroos', detail: 'Near-post finish', score: { home: 1, away: 0 } },
  { id: '3', type: 'GOAL', minute: 23, team: 'home', playerName: 'M. Klose', detail: 'Bundled in from close range', score: { home: 2, away: 0 } },
  { id: '4', type: 'GOAL', minute: 24, team: 'home', playerName: 'T. Kroos', detail: 'Thunderous left-foot finish', score: { home: 3, away: 0 } },
  { id: '5', type: 'GOAL', minute: 26, team: 'home', playerName: 'T. Kroos', detail: 'Second in three minutes', score: { home: 4, away: 0 } },
  { id: '6', type: 'GOAL', minute: 29, team: 'home', playerName: 'S. Khedira', detail: 'Chaos in the box', score: { home: 5, away: 0 } },
  { id: '7', type: 'GOAL', minute: 69, team: 'home', playerName: 'A. Schürrle', detail: 'Left-foot strike', score: { home: 6, away: 0 } },
  { id: '8', type: 'GOAL', minute: 79, team: 'home', playerName: 'A. Schürrle', detail: 'Bending effort', score: { home: 7, away: 0 } },
  { id: '9', type: 'GOAL', minute: 90, team: 'away', playerName: 'O. Oscar', detail: 'Consolation for Brazil', score: { home: 7, away: 1 } },
  { id: '10', type: 'FULLTIME', minute: 90, team: 'home', detail: 'Germany 7-1 Brazil' },
]

export const GERMANY_BRAZIL_MATCH = {
  id: '999998',
  homeTeam: { id: '3', name: 'Germany', shortName: 'GER', tla: 'GER' },
  awayTeam: { id: '4', name: 'Brazil', shortName: 'BRA', tla: 'BRA' },
  score: { home: 7, away: 1 },
  competition: { name: 'FIFA World Cup 2014 — Semi-Final', code: 'WC' },
  venue: 'Mineirão, Belo Horizonte',
  status: 'FINISHED',
  utcDate: new Date().toISOString()
} as Match

export const REAL_MADRID_DORTMUND_MATCH = {
  id: '999997',
  homeTeam: { id: '5', name: 'B. Dortmund', shortName: 'BVB', tla: 'BVB' },
  awayTeam: { id: '6', name: 'Real Madrid', shortName: 'RMA', tla: 'RMA' },
  score: { home: 0, away: 2 },
  competition: { name: 'UEFA Champions League 23/24 — Final', code: 'CL' },
  venue: 'Wembley Stadium, London',
  status: 'FINISHED',
  utcDate: '2024-06-01T19:00:00Z'
} as Match

export const MAN_CITY_WEST_HAM_MATCH = {
  id: '999996',
  homeTeam: { id: '7', name: 'Man City', shortName: 'MCI', tla: 'MCI' },
  awayTeam: { id: '8', name: 'West Ham', shortName: 'WHU', tla: 'WHU' },
  score: { home: 3, away: 1 },
  competition: { name: 'Premier League 23/24 — Matchday 38', code: 'PL' },
  venue: 'Etihad Stadium, Manchester',
  status: 'FINISHED',
  utcDate: '2024-05-19T15:00:00Z'
} as Match


export interface Team {
  id: string
  name: string
  shortName: string
  tla: string // three-letter abbreviation e.g. BRA
  crest?: string
}

export interface Match {
  id: string
  group?: string
  events?: any[]
  competition: { name: string; code: string }
  utcDate: string
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'TIMED'
  minute?: number
  homeTeam: Team
  awayTeam: Team
  score: {
    home: number | null
    away: number | null
  }
  venue?: string
  _raw_lineps?: string
}

export interface Player {
  id?: number
  name: string
  number: number
  position: string
  isKey?: boolean
  isDoubtful?: boolean
}

export interface Lineup {
  homeTeam?: any
  awayTeam?: any
  homeFormation: string
  awayFormation: string
  homeStartingXI: Player[]
  awayStartingXI: Player[]
}

export interface MatchEvent {
  id: string
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'VAR' | 'KICKOFF' | 'HALFTIME' | 'FULLTIME'
  minute: number
  team: 'home' | 'away'
  playerName?: string
  assistName?: string
  playerOff?: string
  detail?: string
  score?: { home: number; away: number }
}

export interface MatchStats {
  passAccuracy: { home: number; away: number }
  possession: { home: number; away: number }
  shots: { home: number; away: number }
  shotsOnTarget: { home: number; away: number }
  shotsOffTarget: { home: number; away: number }
  blockedShots: { home: number; away: number }
  corners: { home: number; away: number }
  offsides: { home: number; away: number }
  fouls: { home: number; away: number }
  yellowCards: { home: number; away: number }
  redCards: { home: number; away: number }
  saves: { home: number; away: number }
  passes: { home: number; away: number }
  passesAccurate: { home: number; away: number }
  accuratePassesPercentage: { home: number; away: number }
  expectedGoals: { home: number; away: number }
}

export interface PlayerStatRaw {
  statsKey: string
  displayValue: string
  numericValue: number
  playerId: string
}

export interface PlayerRaw {
  id: string
  name: string
  shortName: string
  position: string
  rating: number
  teamSide: string
  teamId: string
  inBaseLineup: boolean
}

export interface PlayerStatSummary {
  player: PlayerRaw
  stats: PlayerStatRaw[]
}

export interface Standing {
  position: number
  team: Team
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalDifference: number
}

export interface WhatIfChange {
  id: string
  type: 'REMOVE_EVENT' | 'CHANGE_FORMATION_HOME' | 'CHANGE_FORMATION_AWAY'
  eventId?: string
  formation?: string
  description: string
}

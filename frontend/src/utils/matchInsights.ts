import type { MatchEvent, MatchStats } from '../types'

export interface MatchInsightChips {
  possessionLoss?: boolean
  comeback?: boolean
  cleanSheet?: boolean
  lateWinner?: boolean
  redCardImpact?: boolean
  manyGoals?: boolean
}

export function computeMatchInsights(events: MatchEvent[], score: {home: number, away: number}, stats?: MatchStats | null) {
  let turningPoint = ''
  let decisiveMoment = ''
  const chips: MatchInsightChips = {}

  // Helpers
  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute)
  const isDraw = score.home === score.away
  const winningTeam = isDraw ? null : (score.home > score.away ? 'home' : 'away')
  const losingTeam = isDraw ? null : (score.home < score.away ? 'home' : 'away')

  // Find red cards
  const redCards = sortedEvents.filter(e => e.type === 'RED_CARD')
  
  // Find goals
  const goals = sortedEvents.filter(e => e.type === 'GOAL')

  // TURNING POINT
  if (redCards.length > 0) {
    const rc = redCards[0]
    turningPoint = `${rc.playerName} reduced to 10 men at ${rc.minute}' — the match changed from this moment.`
  } else if (!isDraw && winningTeam) {
    // Find the goal that put the winning team permanently ahead
    let currentHome = 0
    let currentAway = 0
    let permanentLeadGoal = null

    for (const g of goals) {
      if (g.team === 'home') currentHome++
      else currentAway++

      if (winningTeam === 'home' && currentHome > currentAway) {
        // Check if away ever equalized after this
        const awayGoalsAfter = goals.filter(x => x.minute > g.minute && x.team === 'away').length
        if (currentHome - awayGoalsAfter > currentAway) {
          if (!permanentLeadGoal) permanentLeadGoal = g
        }
      } else if (winningTeam === 'away' && currentAway > currentHome) {
        const homeGoalsAfter = goals.filter(x => x.minute > g.minute && x.team === 'home').length
        if (currentAway - homeGoalsAfter > currentHome) {
          if (!permanentLeadGoal) permanentLeadGoal = g
        }
      }
    }
    
    if (permanentLeadGoal) {
      const teamName = permanentLeadGoal.team === 'home' ? 'the home side' : 'the visitors'
      turningPoint = `${permanentLeadGoal.playerName}'s goal at ${permanentLeadGoal.minute}' gave ${teamName} a lead they would not surrender.`
    } else if (goals.length > 0) {
       turningPoint = `${goals[0].playerName}'s goal at ${goals[0].minute}' proved crucial.`
    }
  } else if (isDraw && goals.length > 0) {
    turningPoint = `The match stayed level throughout — ${goals[0].playerName} opened the scoring at ${goals[0].minute}' but neither side could find a winner.`
  }

  // DECISIVE MOMENT
  if (!isDraw && goals.length > 0) {
    // Final goal that sealed the result
    const winningGoals = goals.filter(g => g.team === winningTeam)
    if (winningGoals.length > 0) {
      const lastGoal = winningGoals[winningGoals.length - 1]
      decisiveMoment = `${lastGoal.playerName} sealed it at ${lastGoal.minute}' — ${score.home}-${score.away} and the match was beyond doubt.`
    }
  } else if (isDraw) {
    if (goals.length === 0) {
      decisiveMoment = "Neither side could find the breakthrough across 90 minutes."
    } else {
      const lastGoal = goals[goals.length - 1]
      decisiveMoment = `${lastGoal.playerName}'s equalizer at ${lastGoal.minute}' forced the draw.`
    }
  }

  // CHIPS
  if (stats && losingTeam) {
    const losingPossession = losingTeam === 'home' ? stats.possession?.home : stats.possession?.away
    if (losingPossession && losingPossession > 55) {
      chips.possessionLoss = true
    }
  }

  if (winningTeam) {
    // Check for comeback (winning team was losing at some point)
    let homeScore = 0
    let awayScore = 0
    let wasBehind = false
    for (const g of goals) {
      if (g.team === 'home') homeScore++
      else awayScore++
      
      if (winningTeam === 'home' && awayScore > homeScore) wasBehind = true
      if (winningTeam === 'away' && homeScore > awayScore) wasBehind = true
    }
    if (wasBehind) chips.comeback = true
    
    // Check for clean sheet
    if ((winningTeam === 'home' && score.away === 0) || (winningTeam === 'away' && score.home === 0)) {
      chips.cleanSheet = true
    }
    
    // Check for late winner
    const winningGoals = goals.filter(g => g.team === winningTeam)
    if (winningGoals.length > 0 && winningGoals[winningGoals.length - 1].minute >= 80) {
      // Was it a draw before this goal?
      const lw = winningGoals[winningGoals.length - 1]
      const hG = goals.filter(g => g.minute < lw.minute && g.team === 'home').length
      const aG = goals.filter(g => g.minute < lw.minute && g.team === 'away').length
      if (hG === aG) {
        chips.lateWinner = true
      }
    }
  }

  if (redCards.length > 0) {
    for (const rc of redCards) {
      // did the team with the red card concede after?
      const conceded = goals.some(g => g.minute > rc.minute && g.team !== rc.team)
      if (conceded) {
        chips.redCardImpact = true
      }
    }
  }

  if (score.home + score.away >= 4) {
    chips.manyGoals = true
  }

  return {
    turningPoint,
    decisiveMoment,
    chips
  }
}

import type {  Match  } from '../../types'
import { GraniteCard } from '../shared/GraniteCard'
import { useStore } from '../../store/useStore'
import { useMatchDetail } from '../../hooks/useMatchDetail'
import { Zap, ArrowLeftRight, Lock, Activity, Target, Shield, Crosshair } from 'lucide-react'
import { getTeamTactics } from '../../data/teamTactics'
import { getDemoLineup } from '../../data/demoLineups'

const IconMap: Record<string, React.ElementType> = {
  Zap, ArrowLeftRight, Lock, Activity, Target, Shield, Crosshair
}

export const TacticsPanel = ({ match }: { match: Match }) => {
  const { matchPreviews } = useStore()
  
  const { data: lineupData } = useMatchDetail(match.id)
  const lineup: any = lineupData
  
  const homeDemo = getDemoLineup(match.homeTeam.tla)
  const awayDemo = getDemoLineup(match.awayTeam.tla)
  const isDemo = match._raw_lineps === '0' && (homeDemo || awayDemo)

  const homeFormation = isDemo ? (homeDemo?.formation || 'TBD') : (lineup?.homeTeam?.formation || lineup?.homeFormation || 'TBD')
  const awayFormation = isDemo ? (awayDemo?.formation || 'TBD') : (lineup?.awayTeam?.formation || lineup?.awayFormation || 'TBD')

  const homeTactics = getTeamTactics(match.homeTeam.tla)
  const awayTactics = getTeamTactics(match.awayTeam.tla)
  
  const preview = matchPreviews[match.id]
  const loading = !preview
  
  const narrativeHome = preview?.tactics_home || null
  const narrativeAway = preview?.tactics_away || null

  const renderTeamTactics = (team: any, formation: string, tactics: any, isHome: boolean, narrative: string | null) => {
    const defaultColor = isHome ? 'text-accent-green' : 'text-accent-ai'
    
    if (tactics) {
      return (
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-3 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{team.shortName}</span>
            <span className="font-mono text-[12px] text-accent-green bg-bg-primary border border-border-default rounded px-1.5 py-0.5">{formation}</span>
          </div>
          
          <p className="text-[12px] italic font-serif text-text-secondary mb-3 pb-2 border-b border-border-default">
            {tactics.style}
          </p>

          <ul className="space-y-2.5 mb-3 flex-1">
            {tactics.keyPoints.map((kp: any, i: number) => {
              const Icon = IconMap[kp.icon] || Zap
              return (
                <li key={i} className="flex gap-2 items-start">
                  <Icon className={`w-3.5 h-3.5 ${defaultColor} mt-0.5 flex-shrink-0`} />
                  <span className="text-[12px] text-text-ai leading-snug">{kp.text}</span>
                </li>
              )
            })}
          </ul>
          
          {narrative && (
            <div className="pt-3 mt-3 border-t border-border-default flex-shrink-0">
              <span className="text-[12px] font-medium text-text-primary block mb-1">Granite Analysis:</span>
              <span className="text-[12px] text-text-secondary leading-relaxed block font-serif">
                {narrative}
              </span>
            </div>
          )}
        </div>
      )
    }

    // Generic fallback for teams without hardcoded tactics
    return (
      <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-3 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">{team.shortName}</span>
          <span className="font-mono text-[12px] text-accent-green bg-bg-primary border border-border-default rounded px-1.5 py-0.5">{formation}</span>
        </div>
        <ul className="space-y-3 flex-1">
          <li className="flex gap-2 items-start">
            {isHome ? <Zap className={`w-3.5 h-3.5 ${defaultColor} mt-0.5 flex-shrink-0`} /> : <Lock className={`w-3.5 h-3.5 ${defaultColor} mt-0.5 flex-shrink-0`} />}
            <span className="text-[12px] text-text-ai leading-snug">
              {isHome ? 'High pressing to disrupt build-up play.' : 'Double pivot to protect the back four.'}
            </span>
          </li>
          <li className="flex gap-2 items-start">
            <ArrowLeftRight className={`w-3.5 h-3.5 ${defaultColor} mt-0.5 flex-shrink-0`} />
            <span className="text-[12px] text-text-ai leading-snug">
              {isHome ? 'Quick transitions using pace on the wings.' : 'Relying on the #10 to unlock the defense.'}
            </span>
          </li>
        </ul>
        {narrative && (
          <div className="pt-3 mt-3 border-t border-border-default flex-shrink-0">
            <span className="text-[12px] font-medium text-text-primary block mb-1">Granite Analysis:</span>
            <span className="text-[12px] text-text-secondary leading-relaxed block font-serif">
              {narrative}
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 h-full">
        {renderTeamTactics(match.homeTeam, homeFormation, homeTactics, true, narrativeHome)}
        {renderTeamTactics(match.awayTeam, awayFormation, awayTactics, false, narrativeAway)}
      </div>
      
      {loading && <GraniteCard text={null} isLoading={true} />}
    </div>
  )
}

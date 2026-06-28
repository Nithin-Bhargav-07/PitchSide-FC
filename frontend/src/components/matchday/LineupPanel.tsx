import { useMatchDetail } from '../../hooks/useMatchDetail'
import { useState, useEffect } from 'react'
import { Skeleton } from '../shared/Skeleton'
import type {  Match  } from '../../types'
import { Clock, Info } from 'lucide-react'
import { getDemoLineup } from '../../data/demoLineups'
import { useStore } from '../../store/useStore'
import { getTeamTactics } from '../../data/teamTactics'
import { generateLineup } from '../../api/granite'

const DEV_GENERIC_LINEUP = [
  { number: 1, name: 'GK Placeholder', position: 'GK', isKey: false },
  { number: 2, name: 'RB Placeholder', position: 'RB', isKey: false },
  { number: 3, name: 'CB1', position: 'CB', isKey: false },
  { number: 4, name: 'CB2', position: 'CB', isKey: false },
  { number: 5, name: 'CB3', position: 'CB', isKey: false },
  { number: 6, name: 'LB Placeholder', position: 'LB', isKey: false },
  { number: 7, name: 'CM1', position: 'CM', isKey: false },
  { number: 8, name: 'CM2', position: 'CM', isKey: false },
  { number: 9, name: 'RW Placeholder', position: 'RW', isKey: false },
  { number: 10, name: 'ST Placeholder', position: 'ST', isKey: true },
  { number: 11, name: 'LW Placeholder', position: 'LW', isKey: false }
]

export const LineupPanel = ({ match }: { match: Match }) => {
  const { data: lineupData, isLoading, error } = useMatchDetail(match.id, { enabled: match._raw_lineps !== '0' })
  const lineup: any = lineupData

  const homeDemo = getDemoLineup(match.homeTeam.tla)
  const awayDemo = getDemoLineup(match.awayTeam.tla)
  const isDemo = match._raw_lineps === '0' && (homeDemo || awayDemo)

  const store = useStore()
  const homeGenerated = store.getGeneratedLineup(match.homeTeam.tla)
  const awayGenerated = store.getGeneratedLineup(match.awayTeam.tla)
  
  const isGenerated = match._raw_lineps === '0' && !isDemo && (homeGenerated || awayGenerated)
  const isLineupAvailable = match._raw_lineps !== '0' || isDemo || isGenerated

  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const fetchGenerated = async () => {
      if (match._raw_lineps === '0' && !homeDemo && !awayDemo) {
        const homeTLA = match.homeTeam.tla
        const awayTLA = match.awayTeam.tla
        
        const needHome = !homeDemo && !store.getGeneratedLineup(homeTLA)
        const needAway = !awayDemo && !store.getGeneratedLineup(awayTLA)

        if (!needHome && !needAway) return

        setGenerating(true)
        try {
          if (import.meta.env.DEV) {
            if (needHome) store.setGeneratedLineup(homeTLA, DEV_GENERIC_LINEUP)
            if (needAway) store.setGeneratedLineup(awayTLA, DEV_GENERIC_LINEUP)
          } else {
            if (needHome) {
              const formation = getTeamTactics(homeTLA)?.style ? '4-3-3' : '4-3-3' // Hardcoded to 4-3-3 for generic
              try {
                const res = await generateLineup(match.homeTeam.name, formation)
                const parsed = JSON.parse(res)
                if (Array.isArray(parsed)) store.setGeneratedLineup(homeTLA, parsed)
              } catch (e) {
                // Ignore parse error
              }
            }
            if (needAway) {
              const formation = getTeamTactics(awayTLA)?.style ? '4-3-3' : '4-3-3'
              try {
                const res2 = await generateLineup(match.awayTeam.name, formation)
                const parsed2 = JSON.parse(res2)
                if (Array.isArray(parsed2)) store.setGeneratedLineup(awayTLA, parsed2)
              } catch (e) {
                // Ignore
              }
            }
          }
        } finally {
          setGenerating(false)
        }
      }
    }
    fetchGenerated()
  }, [match.id, match._raw_lineps, homeDemo, awayDemo, store, match.homeTeam, match.awayTeam])

  const getArray = (arr: any) => Array.isArray(arr) ? arr : []
  
  try {
    if (isLoading && !isLineupAvailable && !generating) return (
      <div className="grid grid-cols-2 gap-4">
        <div><Skeleton className="h-6 w-1/3 mb-4" /><Skeleton className="h-64 w-full" /></div>
        <div><Skeleton className="h-6 w-1/3 mb-4" /><Skeleton className="h-64 w-full" /></div>
      </div>
    )
    
    if (generating) return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <Clock className="w-8 h-8 mb-3 opacity-50 animate-pulse" />
        <p className="text-[14px]">Generating lineup predictions...</p>
      </div>
    )

    if (error || (!lineup && !isLineupAvailable)) return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <Info className="w-8 h-8 mb-3 opacity-50" />
        <p className="text-[14px]">Lineups announced closer to kickoff</p>
      </div>
    )

    const homeLineupRaw = isDemo ? homeDemo?.lineup : (store.getGeneratedLineup(match.homeTeam.tla) || lineup?.homeTeam?.lineup || lineup?.homeStartingXI)
    const awayLineupRaw = isDemo ? awayDemo?.lineup : (store.getGeneratedLineup(match.awayTeam.tla) || lineup?.awayTeam?.lineup || lineup?.awayStartingXI)
    
    const homeLineup = getArray(homeLineupRaw)
    const awayLineup = getArray(awayLineupRaw)
    
    const homeFormation = isDemo ? (homeDemo?.formation || 'TBD') : (store.getGeneratedLineup(match.homeTeam.tla) ? '4-3-3' : (lineup?.homeTeam?.formation || lineup?.homeFormation || 'TBD'))
    const awayFormation = isDemo ? (awayDemo?.formation || 'TBD') : (store.getGeneratedLineup(match.awayTeam.tla) ? '4-3-3' : (lineup?.awayTeam?.formation || lineup?.awayFormation || 'TBD'))

    if (homeLineup.length === 0 && awayLineup.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
          <Info className="w-8 h-8 mb-3 opacity-50" />
          <p className="text-[14px]">Lineup data unavailable</p>
        </div>
      )
    }

    const mapPlayer = (p: any) => {
      if (!p) return null;
      return {
        number: p.shirtNumber || p.number || '-',
        name: p.name || 'Unknown Player',
        position: p.position && typeof p.position === 'string' ? p.position.substring(0, 4).toUpperCase() : 'UNK',
        isKey: !!p.isKey,
        isDoubtful: !!p.isDoubtful
      }
    }

    const renderTeam = (name: string, formation: string, players: any[]) => {
      if (!Array.isArray(players) || players.length === 0) return null;
      return (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-default">
            <h3 className="font-medium text-[15px] text-text-primary">{name}</h3>
            <span className="font-mono text-[12px] text-accent-green bg-bg-card border border-border-default rounded px-2 py-0.5">
              {formation}
            </span>
          </div>
          <div className="space-y-0">
            {players.map((p, i) => {
              const mapped = mapPlayer(p)
              if (!mapped) return null;
              return (
                <div key={i} className="flex items-center hover:bg-bg-hover rounded transition-colors py-2.5 px-1">
                  <span className="font-mono text-[13px] text-text-secondary w-8">{mapped.number}</span>
                  <span className="text-[15px] text-text-primary flex-1 truncate pr-2">{mapped.name}</span>
                  <span className="font-mono text-[12px] text-text-secondary w-16 text-right">{mapped.position}</span>
                  {mapped.isKey && <span className="ml-2 bg-accent-green/10 text-accent-green text-[12px] font-medium px-2 rounded">KEY</span>}
                  {mapped.isDoubtful && <span className="ml-2 bg-accent-gold/10 text-accent-gold text-[12px] font-medium px-2 rounded">DOUBT</span>}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col">
        {(isDemo || isGenerated) && (
          <div className="text-accent-ai text-[12px] text-center mb-3">
            📋 Sample lineup — official lineup confirmed closer to kickoff
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          {renderTeam(match.homeTeam.name, homeFormation, homeLineup)}
          {renderTeam(match.awayTeam.name, awayFormation, awayLineup)}
        </div>
      </div>
    )
  } catch (err) {
    return (
      <div className="text-text-secondary text-sm text-center p-8">
        Lineup data unavailable for this match
      </div>
    )
  }
}

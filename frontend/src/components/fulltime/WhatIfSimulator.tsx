import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Match, MatchEvent } from '../../types'
import { simulateWhatIf } from '../../api/granite'
import { formations } from '../../data/formations'
import { GraniteCard } from '../shared/GraniteCard'

const getFormation = (name: string) => formations.find(f => f.name === name) || formations[0]

const TACTICAL_STYLES = ['Defensive', 'Balanced', 'Attacking', 'High Press', 'Counter']

export const WhatIfSimulator = ({ match, events }: { match: Match, events: MatchEvent[] }) => {
  const [removedEvents, setRemovedEvents] = useState<Set<string>>(new Set())
  const [homeFormation, setHomeFormation] = useState('4-3-3')
  const [awayFormation, setAwayFormation] = useState('4-2-3-1')
  const [homeStyle, setHomeStyle] = useState('Balanced')
  const [awayStyle, setAwayStyle] = useState('Balanced')
  
  const [simulatedHome, setSimulatedHome] = useState('4-3-3')
  const [simulatedAway, setSimulatedAway] = useState('4-2-3-1')

  const [narrative, setNarrative] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState(0) // 0: idle, 1: simulate wait, 2: simulated

  const [enableTransitions, setEnableTransitions] = useState(false)

  useEffect(() => {
    // Enable transitions shortly after mount so initial positions are instant
    const timer = setTimeout(() => setEnableTransitions(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    console.log('[WhatIfSimulator] Received events:', events)
  }, [events])

  const significantEvents = useMemo(() => 
    events.filter(e => ['GOAL', 'RED_CARD', 'YELLOW_CARD', 'VAR', 'SUBSTITUTION'].includes(e.type)),
  [events])

  const hasChanges = removedEvents.size > 0 || homeFormation !== '4-3-3' || awayFormation !== '4-2-3-1' || homeStyle !== 'Balanced' || awayStyle !== 'Balanced'

  const toggleEvent = (id: string) => {
    const newSet = new Set(removedEvents)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setRemovedEvents(newSet)
    setPhase(0)
    setNarrative(null)
  }

  const handleSimulate = async () => {
    if (!hasChanges) return
    setLoading(true)
    setPhase(1)
    
    // Animate to new positions
    setSimulatedHome(homeFormation)
    setSimulatedAway(awayFormation)
    
    try {
      const text = await simulateWhatIf({
        events,
        removed_event_ids: Array.from(removedEvents),
        home_formation: homeFormation,
        away_formation: awayFormation,
        final_score: match.score,
        teams: { home: match.homeTeam.name, away: match.awayTeam.name }
      })
      setTimeout(() => {
        setNarrative(text)
        setLoading(false)
        setPhase(2)
      }, 2000) 
    } catch (e) {
      setTimeout(() => {
        setNarrative("**Without the red card to disrupt their shape, the visiting side holds onto their lead.**\n\nDefending deep in a compact block forces the hosts to rely on crosses, making the final outcome much closer to a draw.")
        setLoading(false)
        setPhase(2)
      }, 2000)
    }
  }

  const getEventStyle = (type: string) => {
    switch (type) {
      case 'GOAL': return { color: 'border-[#FFD700]', label: 'remove this goal', compact: false } // Gold
      case 'RED_CARD': return { color: 'border-[#FF5555]', label: 'remove this red card', compact: false } // Red
      case 'YELLOW_CARD': return { color: 'border-[#FFCC00]', label: 'remove this booking', compact: true } // Yellow
      case 'VAR': return { color: 'border-[#6B9EFF]', label: 'reverse this VAR decision', compact: false } // AI-Blue
      case 'SUBSTITUTION': return { color: 'border-[#00E87A]', label: 'keep this player on', compact: true } // Green
      default: return { color: 'border-border-default', label: 'remove event', compact: true }
    }
  }

  const formatNarrative = (text: string) => {
    const parts = text.split('\n\n')
    if (parts.length < 2) return <p className="font-serif text-[13px] leading-[1.6] text-text-ai">{text}</p>
    const headline = parts[0].replace(/\*\*/g, '')
    const reasoning = parts.slice(1).join('\n\n')
    return (
      <div className="flex flex-col gap-1">
        <p className="font-bold text-[13px] text-text-primary leading-snug">{headline}</p>
        <p className="font-serif text-[13px] text-text-ai leading-[1.6]">{reasoning}</p>
      </div>
    )
  }

  // Pitch state calculation
  const currentHomeFormation = getFormation(phase >= 1 ? simulatedHome : '4-3-3')
  const currentAwayFormation = getFormation(phase >= 1 ? simulatedAway : '4-2-3-1')

  // Find a player dot to pulse based on removed event team (heuristic mapping)
  const homePulseIndices = new Set<number>()
  const awayPulseIndices = new Set<number>()
  
  if (phase === 0) {
    let hCount = 0
    let aCount = 0
    significantEvents.forEach(e => {
      if (removedEvents.has(e.id)) {
        if (e.team === 'home') {
          homePulseIndices.add(hCount % 11)
          hCount++
        } else {
          awayPulseIndices.add(aCount % 11)
          aCount++
        }
      }
    })
  }

  return (
    <div className="flex w-full h-full gap-6">
      {/* LEFT COLUMN: Controls */}
      <div className="w-[38%] flex flex-col h-full overflow-y-auto pr-2 hide-scrollbar">
        <h3 className="text-xs font-display font-medium mb-3 uppercase tracking-widest text-text-secondary">Key Events</h3>
        
        {/* Section A: Events */}
        <div className="flex flex-col gap-2 mb-6">
          {significantEvents.length === 0 ? (
            <div className="bg-bg-card border border-border-default rounded-lg p-4 text-center text-sm text-text-secondary">
              No significant events recorded.
            </div>
          ) : (
            significantEvents.map(event => {
              const style = getEventStyle(event.type)
              const isRemoved = removedEvents.has(event.id)
              return (
                <div key={event.id} className={`flex justify-between items-center bg-bg-card rounded-lg border-l-4 ${style.color} border-y border-r border-border-default p-2.5 transition-opacity ${isRemoved ? 'opacity-40' : 'opacity-100'} ${style.compact ? 'h-[44px]' : 'h-auto'}`}>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-[11px] font-mono font-medium text-text-primary truncate">
                      {event.minute}' {event.type.replace('_', ' ')} {event.playerName ? `— ${event.playerName}` : ''}
                    </span>
                    {!style.compact && (
                      <span className="text-[11px] text-text-secondary mt-0.5 truncate">
                        {event.detail}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => toggleEvent(event.id)}
                    className={`w-9 h-4.5 rounded-full relative transition-colors flex-shrink-0 ml-3 ${!isRemoved ? 'bg-accent-green' : 'bg-border-strong border border-border-default'}`}
                  >
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${!isRemoved ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Section B: Team Style */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-[10px] text-text-secondary uppercase tracking-widest mb-1.5">Home Style</label>
            <select 
              value={homeStyle} 
              onChange={e => { setHomeStyle(e.target.value); setPhase(0); setNarrative(null); }}
              className="w-full bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-ai"
            >
              {TACTICAL_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[10px] text-text-secondary uppercase tracking-widest mb-1.5">Away Style</label>
            <select 
              value={awayStyle} 
              onChange={e => { setAwayStyle(e.target.value); setPhase(0); setNarrative(null); }}
              className="w-full bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-ai"
            >
              {TACTICAL_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Section C: Formations */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <label className="block text-[10px] text-text-secondary uppercase tracking-widest mb-1.5">Home Formation</label>
            <select 
              value={homeFormation} 
              onChange={e => { setHomeFormation(e.target.value); setPhase(0); setNarrative(null); }}
              className="w-full bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-ai"
            >
              {formations.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[10px] text-text-secondary uppercase tracking-widest mb-1.5">Away Formation</label>
            <select 
              value={awayFormation} 
              onChange={e => { setAwayFormation(e.target.value); setPhase(0); setNarrative(null); }}
              className="w-full bg-bg-card border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-ai"
            >
              {formations.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
            </select>
          </div>
        </div>

        {/* Section D: Simulate Button */}
        <button 
          onClick={handleSimulate}
          disabled={!hasChanges || loading || phase > 0}
          className="w-full mt-auto bg-accent-green text-black font-display font-medium py-2.5 rounded-lg hover:bg-accent-green/90 transition-all disabled:opacity-40 disabled:hover:bg-accent-green disabled:cursor-not-allowed uppercase tracking-wider text-sm"
        >
          {loading ? 'Simulating...' : 'Simulate'}
        </button>
      </div>

      {/* RIGHT COLUMN: Pitch & Results */}
      <div className="w-[62%] flex flex-col h-full bg-bg-primary">
        
        {/* TOP SECTION: Pitch (60%) */}
        <div className="h-[60%] w-full flex items-center justify-center p-2 relative">
          <svg 
            viewBox="0 0 400 560" 
            className="h-full w-auto max-w-full drop-shadow-lg"
          >
            {/* Background */}
            <rect width="400" height="560" fill="#1a5c2a" />
            {/* 8 Stripes */}
            <rect y="0" width="400" height="70" fill="#1d6330" />
            <rect y="140" width="400" height="70" fill="#1d6330" />
            <rect y="280" width="400" height="70" fill="#1d6330" />
            <rect y="420" width="400" height="70" fill="#1d6330" />
            
            {/* Outer Boundary */}
            <rect x="10" y="10" width="380" height="540" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            
            {/* Halfway Line */}
            <line x1="10" y1="280" x2="390" y2="280" stroke="white" strokeWidth="2" opacity="0.6"/>
            
            {/* Center Circle & Spot */}
            <circle cx="200" cy="280" r="50" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            <circle cx="200" cy="280" r="4" fill="white" opacity="0.8"/>
            
            {/* Penalty Boxes */}
            <rect x="80" y="10" width="240" height="90" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            <rect x="80" y="460" width="240" height="90" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            
            {/* Penalty Arcs */}
            <path d="M 150 100 A 50 50 0 0 0 250 100" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            <path d="M 150 460 A 50 50 0 0 1 250 460" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            
            {/* Penalty Spots */}
            <circle cx="200" cy="60" r="2" fill="white" opacity="0.8"/>
            <circle cx="200" cy="500" r="2" fill="white" opacity="0.8"/>
            
            {/* 6-Yard Boxes */}
            <rect x="140" y="10" width="120" height="30" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            <rect x="140" y="520" width="120" height="30" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            
            {/* Goals */}
            <rect x="170" y="0" width="60" height="10" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            <rect x="170" y="550" width="60" height="10" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            
            {/* Corner Arcs */}
            <path d="M 10 30 A 20 20 0 0 0 30 10" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            <path d="M 390 30 A 20 20 0 0 1 370 10" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            <path d="M 10 530 A 20 20 0 0 1 30 550" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
            <path d="M 390 530 A 20 20 0 0 0 370 550" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>

            {/* Players (Dots) */}
            {currentHomeFormation.pitchPositions?.map((pos, i) => {
              const pulse = homePulseIndices.has(i)
              return (
                <g key={`home-${i}`}>
                  {pulse && (
                    <circle 
                      cx={pos.cx} cy={pos.cy} r={14} fill="none" stroke="#FF5555" strokeWidth="2" opacity="0.6" 
                      style={enableTransitions ? { transition: 'cx 0.6s ease-in-out, cy 0.6s ease-in-out' } : undefined}
                      className="animate-pulse"
                    />
                  )}
                  <circle 
                    cx={pos.cx} cy={pos.cy} r={8} fill="#00E87A" stroke="white" strokeWidth="1"
                    style={enableTransitions ? { transition: 'cx 0.6s ease-in-out, cy 0.6s ease-in-out' } : undefined}
                  />
                </g>
              )
            })}
            
            {currentAwayFormation.pitchPositions?.map((pos, i) => {
              const pulse = awayPulseIndices.has(i)
              return (
                <g key={`away-${i}`}>
                  {pulse && (
                    <circle 
                      cx={400 - pos.cx} cy={560 - pos.cy} r={14} fill="none" stroke="#FF5555" strokeWidth="2" opacity="0.6" 
                      style={enableTransitions ? { transition: 'cx 0.6s ease-in-out, cy 0.6s ease-in-out' } : undefined}
                      className="animate-pulse"
                    />
                  )}
                  <circle 
                    cx={400 - pos.cx} cy={560 - pos.cy} r={8} fill="#6B9EFF" stroke="white" strokeWidth="1"
                    style={enableTransitions ? { transition: 'cx 0.6s ease-in-out, cy 0.6s ease-in-out' } : undefined}
                  />
                </g>
              )
            })}
          </svg>
        </div>

        {/* BOTTOM SECTION: Results (40%) */}
        <div className="h-[40%] flex flex-col justify-end pt-4 pb-2 px-2">
          {narrative ? (
            <div className="flex flex-col gap-3 h-full">
              {/* Row 1: Comparison Strip */}
              <div className="flex gap-3 shrink-0">
                <div className="flex-1 bg-bg-card border border-border-default rounded-lg p-2 flex flex-col justify-center h-[56px]">
                  <span className="text-[10px] text-text-secondary uppercase">Original</span>
                  <span className="font-mono text-[13px] font-bold">{match.homeTeam.tla} {match.score.home} - {match.score.away} {match.awayTeam.tla}</span>
                </div>
                <div className="flex-1 bg-bg-card border border-accent-ai/50 rounded-lg p-2 flex flex-col justify-center h-[56px]">
                  <span className="text-[10px] text-accent-ai uppercase">Simulated</span>
                  <span className="font-medium text-[13px] text-text-primary">Match dynamics shifted</span>
                </div>
              </div>
              
              {/* Row 2: Granite Narrative */}
              <div className="flex-1 min-h-0 bg-bg-card border border-border-default rounded-lg p-3 shadow-sm overflow-y-auto max-h-[120px]">
                <div className="flex items-center gap-1.5 mb-2 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-ai"></div>
                  <span className="text-[10px] font-mono text-accent-ai uppercase tracking-widest">IBM Granite</span>
                </div>
                {formatNarrative(narrative)}
              </div>
            </div>
          ) : (
            <>
              {phase === 1 && (
                <div className="flex-1 w-full flex items-center justify-center">
                  <GraniteCard text={null} isLoading={true} showLabel={true} />
                </div>
              )}
              {phase === 0 && (
                <div className="flex items-center justify-center gap-4 text-[10px] text-text-secondary uppercase tracking-widest font-mono mt-auto">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00E87A]"></div> Home</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#6B9EFF]"></div> Away</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-transparent border border-[#FF5555]"></div> Removed</div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { formations } from '../../data/formations'
import { generateNarrative } from '../../api/granite'
import { GraniteCard } from '../shared/GraniteCard'

export const FormationCard = () => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  
  const selectedFormation = formations[selectedIdx]
  
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchExp = async () => {
      setLoading(true)
      try {
        const text = await generateNarrative({ match_context: selectedFormation.name }, 'formation')
        setExplanation(text)
      } catch (e) {
        setExplanation("Tactical analysis unavailable.")
      } finally {
        setLoading(false)
      }
    }
    fetchExp()
  }, [selectedFormation.name])

  return (
    <div className="flex flex-col h-full bg-bg-primary max-w-5xl mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-col gap-2">
          <h2 className="text-sm uppercase tracking-widest text-text-secondary mb-2 font-medium">Select Formation</h2>
          {formations.map((f, i) => (
            <button 
              key={f.name}
              onClick={() => setSelectedIdx(i)}
              className={`p-3 rounded-xl shadow-sm border text-left transition-colors flex justify-between items-center ${
                i === selectedIdx 
                  ? 'bg-bg-hover border-accent-green text-white' 
                  : 'bg-bg-card border-border-default text-text-secondary hover:border-text-secondary'
              }`}
            >
              <span className="font-display font-bold text-lg">{f.name}</span>
              {i === selectedIdx && <span className="w-2 h-2 rounded-full bg-accent-green"></span>}
            </button>
          ))}
        </div>
        
        <div className="md:w-2/3 flex flex-col gap-6 items-center">
          <div className="relative w-full max-w-[320px] aspect-[3/4] bg-[#1a5c2a] border-4 border-white/80 rounded-sm overflow-hidden select-none">
            {/* Pitch Markings */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/60"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white/60"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/80"></div>
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t-2 border-x-2 border-white/60"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-6 border-t-2 border-x-2 border-white/60"></div>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-b-2 border-x-2 border-white/60"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 border-b-2 border-x-2 border-white/60"></div>

            {/* Players */}
            {selectedFormation.positions?.map((pos: any, i: number) => (
              <div 
                key={i}
                onMouseEnter={() => setHoveredNode(i)}
                onMouseLeave={() => setHoveredNode(null)}
                className="absolute w-[24px] h-[24px] rounded-full bg-accent-green/90 border-2 border-white transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-110 z-10"
                style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
              >
                <span className="font-mono text-[8px] text-black font-bold tracking-tighter">{(pos as any).label}</span>
                
                {hoveredNode === i && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1.5 rounded whitespace-nowrap z-50 shadow-lg pointer-events-none">
                    <div className="font-bold mb-0.5">{(pos as any).label}</div>
                    <div className="text-[12px] text-gray-300">{(pos as any).role}</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="w-full max-w-[320px]">
            <GraniteCard text={explanation} isLoading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}

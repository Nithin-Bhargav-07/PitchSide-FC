import type {  Match  } from '../../types'
import { GraniteCard } from '../shared/GraniteCard'
import { useStore } from '../../store/useStore'

export const BuildUpPanel = ({ match }: { match: Match }) => {
  const { matchPreviews } = useStore()
  const narrative = matchPreviews[match.id]?.buildup
  const loading = !narrative

  return (
    <div className="flex flex-col gap-6">
      <GraniteCard text={narrative} isLoading={loading} />
      <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-3">
        <h4 className="text-xs font-medium text-text-primary mb-3 uppercase tracking-wider">Venue Facts</h4>
        <div className="flex justify-between py-2 border-b border-border-default text-[12px]">
          <span className="text-text-secondary">Stadium</span>
          <span className="text-text-primary">{match.venue || 'TBD'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border-default text-[12px]">
          <span className="text-text-secondary">Capacity</span>
          <span className="text-text-primary">80,000</span>
        </div>
        <div className="flex justify-between py-2 text-[12px]">
          <span className="text-text-secondary">Pitch Size</span>
          <span className="text-text-primary">105m x 68m</span>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-text-primary mb-3 uppercase tracking-wider">Recent Form</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-text-secondary">{match?.homeTeam?.name}</span>
            <div className="flex gap-1.5">
              {['W', 'W', 'D', 'W', 'L'].map((f, i) => (
                <div key={i} className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[12px] font-medium ${
                  f === 'W' ? 'bg-accent-green/15 text-accent-green' : 
                  f === 'L' ? 'bg-accent-red/15 text-accent-red' : 
                  'bg-border-strong text-text-secondary'
                }`}>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-text-secondary">{match?.awayTeam?.name}</span>
            <div className="flex gap-1.5">
              {['W', 'L', 'W', 'D', 'W'].map((f, i) => (
                <div key={i} className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[12px] font-medium ${
                  f === 'W' ? 'bg-accent-green/15 text-accent-green' : 
                  f === 'L' ? 'bg-accent-red/15 text-accent-red' : 
                  'bg-border-strong text-text-secondary'
                }`}>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

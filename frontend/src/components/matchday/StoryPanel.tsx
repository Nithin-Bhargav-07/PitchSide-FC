import { GraniteCard } from '../shared/GraniteCard'
import type {  Match  } from '../../types'
import { useStore } from '../../store/useStore'

export const StoryPanel = ({ match }: { match: Match }) => {
  const { matchPreviews } = useStore()
  const narrative = matchPreviews[match.id]?.story
  const loading = !narrative

  return (
    <div className="flex flex-col gap-6">
      <GraniteCard text={narrative} isLoading={loading} />
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-3 text-center">
          <div className="font-mono text-2xl text-accent-gold">4</div>
          <div className="text-[12px] text-text-secondary uppercase tracking-wider mt-1">Previous Meetings</div>
        </div>
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-3 text-center">
          <div className="font-mono text-2xl text-accent-gold">12</div>
          <div className="text-[12px] text-text-secondary uppercase tracking-wider mt-1">Goals Scored</div>
        </div>
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-3 text-center">
          <div className="font-mono text-2xl text-accent-gold">2</div>
          <div className="text-[12px] text-text-secondary uppercase tracking-wider mt-1">Clean Sheets</div>
        </div>
      </div>
      
      <div className="bg-bg-card border border-border-default rounded-xl shadow-sm p-4">
        <h4 className="text-xs font-medium text-text-primary mb-3 uppercase tracking-wider">What's at stake</h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span>
            <span className="text-[14px] text-text-ai">Winner advances to the next round of the tournament.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span>
            <span className="text-[14px] text-text-ai">Crucial momentum heading into the winter break.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

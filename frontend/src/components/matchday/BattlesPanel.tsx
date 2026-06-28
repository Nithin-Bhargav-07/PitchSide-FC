import { useStore } from '../../store/useStore'

export const BattlesPanel = ({ matchId }: { matchId: string }) => {
  const matchPreviews = useStore((state) => state.matchPreviews)
  const preview = matchPreviews[matchId]

  const defaultBattles = [
    { homePlayer: 'Player TBD', awayPlayer: 'Player TBD', homeInitials: 'P1', awayInitials: 'P2', insight: 'Awaiting tactical analysis for this key duel.' },
    { homePlayer: 'Player TBD', awayPlayer: 'Player TBD', homeInitials: 'P1', awayInitials: 'P2', insight: 'Awaiting tactical analysis for this key duel.' },
    { homePlayer: 'Player TBD', awayPlayer: 'Player TBD', homeInitials: 'P1', awayInitials: 'P2', insight: 'Awaiting tactical analysis for this key duel.' }
  ]

  const battles = preview?.key_battles && preview.key_battles.length > 0 ? preview.key_battles : defaultBattles

  return (
    <div className="flex flex-col gap-3">
      {battles.map((battle: any, i: number) => (
        <div key={i} className="bg-bg-card border border-border-default rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center font-display font-medium text-sm">
                {battle.homeInitials || 'P1'}
              </div>
              <span className="text-[12px] font-medium text-text-primary">{battle.homePlayer}</span>
            </div>
            
            <div className="font-mono text-lg text-accent-gold italic">VS</div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent-ai/20 text-accent-ai flex items-center justify-center font-display font-medium text-sm">
                {battle.awayInitials || 'P2'}
              </div>
              <span className="text-[12px] font-medium text-text-primary">{battle.awayPlayer}</span>
            </div>
          </div>
          <div className="border-t border-border-default pt-3 mt-1">
            <p className="text-[14px] text-text-ai leading-relaxed">{battle.insight}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

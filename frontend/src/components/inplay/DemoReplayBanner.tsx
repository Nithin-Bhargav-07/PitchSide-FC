import { useStore } from '../../store/useStore'
import { Play } from 'lucide-react'

export const DemoReplayBanner = () => {
  const { setDemoMode } = useStore()

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-bg-card border border-border-strong flex items-center justify-center mb-6">
        <Play className="w-6 h-6 text-text-secondary ml-1" />
      </div>
      <h2 className="font-display text-xl font-semibold mb-2">No live match right now</h2>
      <p className="text-text-secondary text-sm mb-8 max-w-sm">
        Select a historic match below to watch the PitchSide experience in action. Events will play out dynamically.
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={() => setDemoMode(true, 'usa_mexico')}
          className="flex-1 bg-bg-card border border-border-default hover:border-accent-green hover:bg-bg-hover transition-colors rounded-xl shadow-sm p-4 flex flex-col items-center gap-2 group"
        >
          <span className="text-[12px] text-accent-gold uppercase tracking-wider">Round of 16</span>
          <span className="font-display font-medium group-hover:text-accent-green transition-colors">USA 2-1 Mexico</span>
        </button>
        
        <button 
          onClick={() => setDemoMode(true, 'germany_brazil')}
          className="flex-1 bg-bg-card border border-border-default hover:border-accent-green hover:bg-bg-hover transition-colors rounded-xl shadow-sm p-4 flex flex-col items-center gap-2 group"
        >
          <span className="text-[12px] text-accent-gold uppercase tracking-wider">Semi-Final</span>
          <span className="font-display font-medium group-hover:text-accent-green transition-colors">Germany 7-1 Brazil</span>
        </button>
      </div>
    </div>
  )
}

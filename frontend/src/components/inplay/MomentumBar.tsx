interface Props {
  homeTla: string
  awayTla: string
  homePossession: number
}

export const MomentumBar = ({ homeTla, awayTla, homePossession }: Props) => {
  const awayPossession = 100 - homePossession
  
  const getHint = () => {
    if (homePossession > 60) return `${homeTla} dominating possession`
    if (homePossession < 40) return `${awayTla} controlling the game`
    return 'Evenly contested in midfield'
  }

  return (
    <div className="px-5 py-3 border-b border-border-default bg-bg-primary">
      <div className="flex justify-between items-center mb-1 text-[12px] text-text-secondary uppercase tracking-wider">
        <span>{homeTla}</span>
        <span>Possession</span>
        <span>{awayTla}</span>
      </div>
      
      <div className="w-full h-1.5 bg-border-default rounded-full flex overflow-hidden">
        <div 
          className="bg-accent-green h-full transition-all duration-500" 
          style={{ width: `${homePossession}%` }} 
        />
        <div 
          className="bg-accent-ai h-full transition-all duration-500" 
          style={{ width: `${awayPossession}%` }} 
        />
      </div>
      
      <div className="text-[12px] text-text-secondary text-center mt-1.5">
        {getHint()}
      </div>
    </div>
  )
}

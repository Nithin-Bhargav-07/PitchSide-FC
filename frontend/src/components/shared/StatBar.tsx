interface Props {
  homeValue: number
  awayValue: number
  label: string
  homeColor?: string
  awayColor?: string
}

export const StatBar = ({ 
  homeValue, 
  awayValue, 
  label, 
  homeColor = 'bg-accent-green', 
  awayColor = 'bg-accent-ai' 
}: Props) => {
  const total = homeValue + awayValue
  const homePercent = total === 0 ? 50 : (homeValue / total) * 100
  const awayPercent = total === 0 ? 50 : (awayValue / total) * 100

  return (
    <div className="flex items-center text-[13px] mb-3">
      <div className="w-10 text-right font-mono text-text-primary mr-3">{homeValue}</div>
      <div className="flex-1 relative flex items-center h-1 bg-border-default rounded-full">
        {/* Home bar anchors right of the center point */}
        <div 
          className={`absolute right-1/2 h-full ${homeColor} rounded-l-full`} 
          style={{ width: `${homePercent / 2}%` }}
        />
        {/* Away bar anchors left of the center point */}
        <div 
          className={`absolute left-1/2 h-full ${awayColor} rounded-r-full`} 
          style={{ width: `${awayPercent / 2}%` }}
        />
        {/* Label absolute centered below */}
        <div className="absolute top-3 w-full text-center text-[12px] text-text-secondary">
          {label}
        </div>
      </div>
      <div className="w-10 text-left font-mono text-text-primary ml-3">{awayValue}</div>
    </div>
  )
}

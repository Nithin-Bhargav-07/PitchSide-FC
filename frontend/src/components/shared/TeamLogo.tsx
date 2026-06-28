import { useState } from 'react'

export const getBadgeColor = (tla: string) => {
  switch(tla) {
    case 'BRA': return 'bg-green-900 text-yellow-300'
    case 'ARG': return 'bg-sky-900 text-sky-200'
    case 'ESP': return 'bg-red-900 text-yellow-300'
    case 'USA': return 'bg-blue-900 text-white'
    case 'MEX': return 'bg-green-800 text-white'
    case 'GER': return 'bg-gray-900 text-white'
    default: return 'bg-border-strong text-text-secondary'
  }
}

interface TeamLogoProps {
  src?: string
  alt: string
  tla: string
  className?: string
  fallbackClassName?: string
}

export const TeamLogo = ({ src, alt, tla, className = "w-4 h-4 object-contain", fallbackClassName = "text-[9px] px-1 py-0.5" }: TeamLogoProps) => {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <span className={`font-mono rounded ${getBadgeColor(tla)} ${fallbackClassName}`}>
        {tla}
      </span>
    )
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  )
}

import { useEffect, useState } from 'react'

interface Props {
  text: string
  speed?: number
}

export const TypewriterText = ({ text, speed = 18 }: Props) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    let currentIndex = 0
    
    if (!text) return

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(intervalId)
      }
    }, speed)

    return () => clearInterval(intervalId)
  }, [text, speed])

  return (
    <div className="text-[14px] text-text-ai leading-[1.75] whitespace-pre-wrap space-y-3">
      {displayedText}
    </div>
  )
}

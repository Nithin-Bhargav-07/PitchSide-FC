import { BrainCircuit } from 'lucide-react'
import { TypewriterText } from './TypewriterText'
import { Skeleton } from './Skeleton'

interface Props {
  text: string | null
  isLoading: boolean
  showLabel?: boolean
  lawBadge?: string | null
}

export const GraniteCard = ({ text, isLoading, showLabel = true, lawBadge = null }: Props) => {
  const formatText = (input: string) => {
    if (input.split(' ').length <= 50) return input;
    
    // Find sentences
    const sentences = input.match(/[^.!?]+[.!?]+/g);
    if (!sentences || sentences.length < 2) return input;
    
    // Split near the middle
    const midPoint = Math.ceil(sentences.length / 2);
    const p1 = sentences.slice(0, midPoint).join('').trim();
    const p2 = sentences.slice(midPoint).join('').trim();
    
    return `${p1}\n\n${p2}`;
  };

  return (
    <div className="bg-[rgba(107,158,255,0.08)] border border-[rgba(107,158,255,0.25)] border-l-4 border-l-accent-ai rounded-r-lg p-4">
      {showLabel && (
        <div className="flex items-center gap-1.5 mb-2">
          <BrainCircuit className="w-3.5 h-3.5 text-[color:var(--text-granite-label)]" />
          <span className="text-[9px] font-mono text-[color:var(--text-granite-label)] tracking-[0.8px] uppercase">
            IBM Granite
          </span>
        </div>
      )}
      
      {isLoading ? (
        <div className="space-y-3 mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      ) : text ? (
        <div className="font-serif text-[15px] leading-relaxed text-[color:var(--text-granite)]">
          <TypewriterText text={formatText(text)} />
        </div>
      ) : null}

      {lawBadge && (
        <div className="mt-3 inline-block font-mono text-[9px] text-[color:var(--text-granite-label)] bg-bg-card border border-accent-ai/30 rounded px-1.5 py-0.5">
          {lawBadge}
        </div>
      )}
    </div>
  )
}

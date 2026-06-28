import { useState } from 'react'
import { ifabLaws } from '../../data/ifabLaws'
import { generateNarrative } from '../../api/granite'
import { GraniteCard } from '../shared/GraniteCard'
import { 
  ChevronDown, ChevronUp, AlertTriangle, Eye, Target, 
  Clock, Users, User, Goal, MonitorPlay, Book, X 
} from 'lucide-react'

const varLaw = {
  number: 'VAR' as any,
  title: 'VAR Protocol',
  summary: 'Video Assistant Referees are only used for "clear and obvious errors" or "serious missed incidents" in four categories: Goals, Penalty decisions, Direct red card incidents, and Mistaken identity. The referee makes the final decision.'
}

const getLaw = (num: number) => ifabLaws.find(l => l.number === num)

const cat1 = [
  { ...getLaw(11), icon: Eye, highlight: true },
  { ...getLaw(12), icon: AlertTriangle, highlight: true },
  { ...getLaw(14), icon: Target, highlight: true },
  { ...varLaw, icon: MonitorPlay, highlight: false }
]

const cat2 = [
  { ...getLaw(3), icon: Users, highlight: false },
  { ...getLaw(5), icon: User, highlight: false },
  { ...getLaw(7), icon: Clock, highlight: false },
  { ...getLaw(10), icon: Goal, highlight: false }
]

const Modal = ({ law, onClose }: { law: any, onClose: () => void }) => {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchInsight = async () => {
    setLoading(true)
    try {
      const text = await generateNarrative({
        match_context: `Explain ${law.title}: ${law.summary}`
      }, 'academy')
      setInsight(text)
    } catch (e) {
      setInsight("The rules are enforced to ensure fair play, safety, and consistency across all levels of the game.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-bg-primary border border-border-strong rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="p-6 border-b border-border-default flex justify-between items-start sticky top-0 bg-bg-primary z-10">
          <div>
            <div className="font-mono text-xs text-accent-ai mb-1 bg-accent-ai/10 inline-block px-2 py-0.5 rounded">
              Law {law.number}
            </div>
            <h2 className="font-display text-2xl font-bold text-text-primary">{law.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-hover rounded-full transition-colors text-text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Official Summary</h3>
            <p className="text-[15px] text-text-primary leading-relaxed">{law.summary}</p>
          </div>
          
          <div className="bg-bg-card border border-border-default rounded-xl p-5">
            {!insight && !loading ? (
              <div className="flex flex-col items-center text-center">
                <Book className="w-8 h-8 text-text-secondary mb-3" />
                <h4 className="font-medium text-text-primary mb-2">Need more clarity?</h4>
                <p className="text-sm text-text-secondary mb-4 max-w-xs">Ask IBM Granite to break this down with a real-world football example.</p>
                <button 
                  onClick={fetchInsight}
                  className="bg-accent-ai text-bg-primary font-medium px-6 py-2 rounded hover:bg-accent-ai/90 transition-colors"
                >
                  Get More Detail
                </button>
              </div>
            ) : (
              <GraniteCard text={insight} isLoading={loading} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const LawCard = ({ item, onClick }: { item: any, onClick: () => void }) => {
  const Icon = item.icon
  return (
    <button 
      onClick={onClick}
      className={`text-left bg-bg-card border rounded-xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg ${
        item.highlight ? 'border-accent-ai/40 hover:border-accent-ai shadow-accent-ai/10 shadow-sm' : 'border-border-default hover:border-text-secondary'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl shadow-sm ${item.highlight ? 'bg-accent-ai/10 text-accent-ai' : 'bg-bg-hover text-text-secondary'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-mono text-[12px] text-text-secondary">LAW {item.number}</span>
      </div>
      <h3 className="font-medium text-text-primary mb-2">{item.title}</h3>
      <p className="text-[14px] text-text-secondary line-clamp-2 leading-relaxed">{item.summary}</p>
    </button>
  )
}

export const LawsAccordion = () => {
  const [selectedLaw, setSelectedLaw] = useState<any>(null)
  const [openLawIdx, setOpenLawIdx] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-10 pb-12 max-w-5xl mx-auto">
      {selectedLaw && <Modal law={selectedLaw} onClose={() => setSelectedLaw(null)} />}

      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-xl font-bold text-text-primary">The Big Decisions</h2>
          <span className="text-xs text-text-secondary bg-bg-card border border-border-default px-2 py-0.5 rounded-full">Most debated</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cat1.map((item, i) => <LawCard key={i} item={item} onClick={() => setSelectedLaw(item)} />)}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-xl font-bold text-text-primary">How the Game Works</h2>
          <span className="text-xs text-text-secondary bg-bg-card border border-border-default px-2 py-0.5 rounded-full">Core mechanics</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cat2.map((item, i) => <LawCard key={i} item={item} onClick={() => setSelectedLaw(item)} />)}
        </div>
      </section>

      <section className="bg-bg-card border border-border-default rounded-xl p-6">
        <h2 className="font-display text-xl font-bold text-text-primary mb-2">The Full Rulebook</h2>
        <p className="text-sm text-text-secondary mb-6">Browse all 17 IFAB Laws of the Game for complete reference.</p>
        
        <div className="flex flex-col gap-2">
          {ifabLaws.map((law) => (
            <div key={law.number} className="bg-bg-primary border border-border-default rounded-xl shadow-sm overflow-hidden">
              <button 
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none hover:bg-bg-hover transition-colors"
                onClick={() => setOpenLawIdx(openLawIdx === law.number ? null : law.number)}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-accent-ai bg-accent-ai/10 px-2 py-1 rounded text-xs font-medium w-16 text-center">
                    Law {law.number}
                  </span>
                  <span className="font-medium text-text-primary">{law.title}</span>
                </div>
                {openLawIdx === law.number ? (
                  <ChevronUp className="w-4 h-4 text-text-secondary" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                )}
              </button>
              
              {openLawIdx === law.number && (
                <div className="px-4 pb-4 pt-0 text-[14px] text-text-secondary border-t border-border-default/50 mt-1 pt-4 leading-relaxed">
                  {law.summary}
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => setSelectedLaw(law)}
                      className="text-xs text-accent-ai hover:underline flex items-center gap-1"
                    >
                      <Book className="w-3 h-3" /> Get AI explanation
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

import { useState, useRef, useEffect, RefObject } from 'react'
import { generateNarrative } from '../../api/granite'
import { Send, ChevronDown, ChevronUp } from 'lucide-react'
import { Skeleton } from '../shared/Skeleton'

const useTypewriter = (text: string, speed = 20) => {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    let i = 0;
    setDisplayed('')
    if (!text) return;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i))
      i++
      if (i > text.length) clearInterval(timer)
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])
  return displayed
}

const TypewriterText = ({ text }: { text: string }) => {
  const displayed = useTypewriter(text, 15)
  return <div className="font-serif text-[14px] leading-relaxed text-text-primary">{displayed}</div>
}

const HistoryItem = ({ q, a }: { q: string, a: string }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-bg-primary border border-border-default rounded-xl shadow-sm p-3 mb-3">
      <div className="text-[14px] font-medium text-white mb-1">Q: {q}</div>
      <div className={`font-serif text-[14px] text-text-ai leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
        A: {a}
      </div>
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="text-[12px] uppercase tracking-wider text-accent-ai mt-2 flex items-center gap-1 hover:underline"
      >
        {expanded ? <><ChevronUp className="w-3 h-3"/> Show less</> : <><ChevronDown className="w-3 h-3"/> Read more</>}
      </button>
    </div>
  )
}

const row1 = ["What is offside?", "When is a red card given?", "How does VAR work?", "What is a penalty?"]
const row2 = ["What counts as a foul?", "Can a goalkeeper score?", "How many subs are allowed?", "What is the advantage rule?"]

interface InputSectionProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: (queryOverride?: string) => void;
  loading: boolean;
  inputRef: RefObject<HTMLTextAreaElement>;
}

const InputSection = ({ input, setInput, handleSend, loading, inputRef }: InputSectionProps) => (
  <div className="w-full">
    <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto mb-4">
      {[...row1, ...row2].map(q => (
        <button 
          key={q} 
          onClick={() => handleSend(q)}
          className="whitespace-nowrap bg-bg-card hover:bg-bg-hover border border-border-default rounded-full px-3 py-1.5 text-[12px] text-text-secondary transition-colors"
        >
          {q}
        </button>
      ))}
    </div>
    
    <div className="relative w-full max-w-2xl mx-auto">
      <textarea 
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
        placeholder="Ask anything about football rules or tactics..."
        className="w-full bg-bg-card border border-border-default rounded-xl p-4 pr-14 text-[14px] text-text-primary resize-none outline-none focus:border-accent-ai transition-colors min-h-[80px]"
        disabled={loading}
      />
      <button 
        onClick={() => handleSend()}
        disabled={!input.trim() || loading}
        className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-accent-green text-black flex items-center justify-center disabled:opacity-50 transition-colors"
      >
        <Send className="w-4 h-4 ml-0.5" />
      </button>
    </div>
  </div>
)

export const AskAnything = () => {
  const [history, setHistory] = useState<{ q: string, a: string }[]>([])
  const [currentResponse, setCurrentResponse] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentResponse, history, loading])

  const handleSend = async (queryOverride?: string) => {
    const userMsg = queryOverride || input.trim()
    if (!userMsg || loading) return
    
    if (currentResponse) {
      setHistory(prev => {
        const newHistory = [...prev, { q: prev.length === 0 && !input ? "Previous query" : "What did I ask?", a: currentResponse }]
        // We will just patch the last question properly in a real scenario, but to keep it simple, we store it correctly below.
        return newHistory
      })
    }

    setInput('')
    setCurrentResponse(null)
    setLoading(true)
    
    try {
      console.log("Asking Granite:", userMsg)
      const text = await generateNarrative({
        match_context: 'General Football Knowledge Base',
        user_query: userMsg
      }, 'academy')
      
      setCurrentResponse(text)
      // Save to history proper
      setHistory(prev => {
        const h = [...prev, { q: userMsg, a: text }]
        if (h.length > 3) return h.slice(h.length - 3)
        return h
      })
    } catch (e) {
      const errorText = "I'm having trouble connecting to my knowledge base right now."
      setCurrentResponse(errorText)
      setHistory(prev => {
        const h = [...prev, { q: userMsg, a: errorText }]
        if (h.length > 3) return h.slice(h.length - 3)
        return h
      })
    } finally {
      setLoading(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }

  const isHistoryEmpty = history.length === 0 && !loading

  return (
    <div className="flex flex-col h-full bg-bg-primary max-w-4xl mx-auto relative">
      {isHistoryEmpty ? (
        <div className="flex flex-col justify-center items-center flex-1 min-h-[60vh] max-w-2xl mx-auto w-full px-4">
          <h2 className="font-display text-xl text-text-primary text-center mb-6">What do you want to know about football?</h2>
          <InputSection input={input} setInput={setInput} handleSend={handleSend} loading={loading} inputRef={inputRef} />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
            {history.slice(0, -1).map((item, idx) => (
              <HistoryItem key={idx} q={item.q} a={item.a} />
            ))}

            {history.length > 0 && currentResponse && (
              <div className="mt-6 mb-4">
                <div className="text-[13px] text-text-secondary font-medium mb-3 pl-2">
                  {history[history.length - 1].q}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 pl-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-ai"></div>
                    <span className="text-[12px] font-mono text-accent-ai uppercase tracking-widest">IBM Granite</span>
                  </div>
                  <div className="bg-bg-card border-l-4 border-accent-ai rounded-r-xl p-4 shadow-sm">
                    <TypewriterText text={currentResponse} />
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-6 mb-4">
                <div className="text-[13px] text-text-secondary font-medium mb-3 pl-2">Analyzing...</div>
                <div className="bg-bg-card border-l-4 border-accent-ai rounded-r-xl p-4 shadow-sm space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            )}
            
            <div ref={bottomRef} className="h-4" />
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 md:static p-4 bg-bg-primary border-t border-border-default z-10">
            <InputSection input={input} setInput={setInput} handleSend={handleSend} loading={loading} inputRef={inputRef} />
          </div>
        </>
      )}
    </div>
  )
}

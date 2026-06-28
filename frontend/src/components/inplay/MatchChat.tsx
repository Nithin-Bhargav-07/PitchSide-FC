import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import axios from 'axios'
import type { Match } from '../../types'

const BASE = import.meta.env.VITE_API_BASE_URL

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
  return <span>{displayed}</span>
}

export const MatchChat = ({ match }: { match: Match }) => {
  const [expanded, setExpanded] = useState(false)
  const [history, setHistory] = useState<{ role: 'user'|'ai', text: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (expanded) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [history, loading, expanded])

  const handleSend = async (queryOverride?: string) => {
    const userMsg = queryOverride || input.trim()
    if (!userMsg || loading) return

    setInput('')
    setLoading(true)
    
    setHistory(prev => {
      const h = [...prev, { role: 'user' as const, text: userMsg }]
      return h.slice(Math.max(0, h.length - 10))
    })

    const eventsStr = match.events?.map((e: any) => `${e.minute}' ${e.type} — ${e.playerName} (${e.team}, ${e.detail})`).join("; ") || "No events yet";
    const match_context = `Live match: ${match.homeTeam?.name} ${match.score?.home ?? 0}-${match.score?.away ?? 0} ${match.awayTeam?.name}\nMinute: ${match.minute}\nEvents so far: ${eventsStr}`;

    console.log("MatchChat payload:", {
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      events: match.events,
      match_context,
      user_query: userMsg,
      endpoint_type: 'match_chat'
    });

    try {
      const { data } = await axios.post(`${BASE}/granite/explain`, {
        match_context,
        user_query: userMsg,
        endpoint_type: 'match_chat'
      })
      
      setHistory(prev => {
        const h = [...prev, { role: 'ai' as const, text: data.text }]
        return h.slice(Math.max(0, h.length - 10))
      })
    } catch (e) {
      setHistory(prev => {
        const h = [...prev, { role: 'ai' as const, text: "I'm having trouble connecting right now. Please try again." }]
        return h.slice(Math.max(0, h.length - 10))
      })
    } finally {
      setLoading(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }

  const getLosingTeam = () => {
    const home = match.score?.home ?? 0
    const away = match.score?.away ?? 0
    if (home > away) return match.awayTeam?.shortName || match.awayTeam?.name || "the away team"
    if (away > home) return match.homeTeam?.shortName || match.homeTeam?.name || "the home team"
    return match.awayTeam?.shortName || match.awayTeam?.name || "them"
  }

  const losingTeam = getLosingTeam()

  const suggestions = [
    `Why is ${losingTeam} behind?`,
    "Best player so far?",
    `What does ${losingTeam} need?`
  ]

  return (
    <>
      <AnimatePresence>
        {!expanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={() => setExpanded(true)}
            className="fixed bottom-6 right-6 w-12 h-12 bg-accent-green rounded-full shadow-lg flex items-center justify-center cursor-pointer z-50 transition-transform"
          >
            <MessageCircle className="w-[22px] h-[22px] text-black" />
            {match.events && match.events.length > 0 && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0D1526] animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-20 right-6 w-[320px] h-[380px] bg-[#0D1526] border border-[#2A3F60] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border-default flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
                <span className="text-sm font-medium text-text-primary">Match chat</span>
              </div>
              <button onClick={() => setExpanded(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col bg-transparent">
              {history.length === 0 && (
                <div className="flex flex-col gap-2 mt-auto mb-2">
                  {suggestions.map((s, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="bg-bg-hover border border-border-default rounded-full px-3 py-1.5 text-xs text-text-secondary cursor-pointer hover:border-accent-ai hover:text-text-primary transition-colors text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {history.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} mb-2`}>
                  {msg.role === 'ai' && (
                    <span className="text-[9px] text-accent-ai font-mono tracking-widest block mb-1 uppercase ml-1">IBM Granite</span>
                  )}
                  <div 
                    className={`${
                      msg.role === 'user' 
                        ? 'bg-[#1A2840] border-none rounded-2xl rounded-br-sm text-text-primary ml-auto' 
                        : 'bg-[#101C30] border-none rounded-2xl rounded-bl-sm text-text-ai'
                    } px-3 py-2 text-sm max-w-[75%]`}
                    style={{ maxWidth: msg.role === 'user' ? '75%' : '80%' }}
                  >
                    {msg.role === 'ai' && idx === history.length - 1 ? (
                      <TypewriterText text={msg.text} />
                    ) : (
                      <span>{msg.text}</span>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex flex-col items-start mb-2">
                  <span className="text-[9px] text-accent-ai font-mono tracking-widest block mb-1 uppercase ml-1">IBM Granite</span>
                  <div className="bg-[#101C30] border-none rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%] flex items-center gap-1.5 h-9">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-text-dim rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-text-dim rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-text-dim rounded-full" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} className="h-1" />
            </div>

            <div className="px-3 py-2 border-t border-border-default flex items-center">
              <input 
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask about this match..."
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-dim outline-none border-none"
                disabled={loading}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="bg-accent-green text-black rounded-full w-8 h-8 flex items-center justify-center ml-2 disabled:opacity-40 transition-opacity"
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

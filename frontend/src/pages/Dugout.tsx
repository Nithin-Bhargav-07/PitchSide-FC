import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AskAnything } from '../components/dugout/AskAnything'
import { LawsAccordion } from '../components/dugout/LawsAccordion'
import { FormationCard } from '../components/dugout/FormationCard'

export const Dugout = () => {
  const [activeTab, setActiveTab] = useState('ask')

  const tabs = [
    { id: 'ask', label: 'Ask Granite' },
    { id: 'laws', label: 'IFAB Laws' },
    { id: 'formations', label: 'Formations' }
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="bg-bg-hero border-b border-border-default p-6 pb-0 flex flex-col justify-end">
        <h1 className="font-display text-3xl font-bold mb-2">The Dugout</h1>
        <p className="text-text-secondary text-base mb-6 max-w-lg">
          Learn the game. Ask anything.
        </p>

        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 transition-colors border-b-2 flex flex-col items-center gap-0.5 ${
                activeTab === tab.id 
                  ? 'text-text-primary border-accent-ai' 
                  : 'text-text-secondary border-transparent hover:text-text-primary'
              }`}
            >
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.id === 'ask' && <span className="text-[10px] text-accent-ai font-normal">(ask anything)</span>}
              {tab.id === 'laws' && <span className="text-[10px] text-text-dim font-normal">(17 rules explained)</span>}
              {tab.id === 'formations' && <span className="text-[10px] text-text-dim font-normal">(8 systems visualised)</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-bg-primary">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`h-full ${activeTab !== 'ask' ? 'overflow-y-auto p-5' : ''}`}
          >
            {activeTab === 'ask' && <AskAnything />}
            {activeTab === 'laws' && <div className="max-w-3xl mx-auto"><LawsAccordion /></div>}
            {activeTab === 'formations' && <div className="max-w-4xl mx-auto"><FormationCard /></div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

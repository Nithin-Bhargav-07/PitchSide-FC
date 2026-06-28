# PitchSide — Master Technical Specification

## What This App Is
PitchSide is an AI-powered football companion web app for the FIFA World Cup 2026.
It explains football to casual fans — before, during, and after matches — using IBM Granite
as its reasoning engine. It does not predict scores. It explains what happened and why it matters.

---

## Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS (custom design system below)
- Framer Motion (animations)
- Zustand (global state)
- TanStack Query / React Query (data fetching + caching)
- Recharts (stats charts)
- Lucide React (icons)
- React Router DOM v6
- Axios

### Backend
- Python FastAPI
- Uvicorn
- HTTPX (async HTTP calls)
- Python-dotenv
- Docling (IFAB PDF parsing — one-time script)

### External Services
- IBM Granite on watsonx.ai (AI reasoning)
- football-data.org API (fixtures, lineups, standings, results)
- API-Football via RapidAPI (live events, live stats)
- Vercel (frontend deployment)
- Render (backend deployment)

---

## Environment Variables

### backend/.env
```
FOOTBALL_DATA_API_KEY=
API_FOOTBALL_KEY=
WATSONX_API_KEY=
WATSONX_PROJECT_ID=
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### frontend/.env
```
VITE_API_BASE_URL=http://localhost:8000
```

---

## Design System

### Colors (use these exact hex values everywhere)
```
Background layers:
  body / page bg:       #070B14
  card bg:              #0D1526
  card hover:           #101C30
  hero sections:        #0A1525
  sidebar:              #0A1120

Borders:
  default:              #1A2840
  strong:               #2A3F60

Accent colors:
  green (live/active):  #00E87A
  gold (goals):         #F5A623
  ai blue (Granite):    #6B9EFF
  red card:             #FF5555
  yellow card:          #FFCC00

Text:
  primary:              #FFFFFF
  secondary:            #8899BB
  dim:                  #3A4E6E
  ai content:           #C0D0E8
```

### Typography
- Headings / labels: Space Grotesk
- Body text: Inter
- Numbers / stats / badges / times: JetBrains Mono
- Minimum font size in any UI element: 13px
- Body text: 14px
- Sub-headings: 15–16px
- Match scores: 32–36px

### Key UI Rules
- All cards: bg #0D1526, border 1px #1A2840, border-radius 8px
- AI content cards: bg rgba(107,158,255,0.05), border 1px rgba(107,158,255,0.18), left border 3px #6B9EFF, border-radius 0 8px 8px 0
- Every AI card shows a label: "IBM Granite" in #6B9EFF, 9px, JetBrains Mono, letter-spacing 0.8px, with a brain/cpu icon
- All Granite text renders with typewriter animation: one character at a time, 18ms interval
- Loading states: pulsing skeleton blocks matching the height of content they replace (bg #0D1526, animate-pulse)
- Never show a blank screen — always show a skeleton or empty state message

---

## Tailwind Config (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#070B14',
          card: '#0D1526',
          hover: '#101C30',
          hero: '#0A1525',
          sidebar: '#0A1120',
        },
        border: {
          default: '#1A2840',
          strong: '#2A3F60',
        },
        accent: {
          green: '#00E87A',
          gold: '#F5A623',
          ai: '#6B9EFF',
          red: '#FF5555',
          yellow: '#FFCC00',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8899BB',
          dim: '#3A4E6E',
          ai: '#C0D0E8',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
```

---

## TypeScript Types (src/types/index.ts)

```typescript
export interface Team {
  id: number
  name: string
  shortName: string
  tla: string // three-letter abbreviation e.g. BRA
  crest?: string
}

export interface Match {
  id: number
  competition: { name: string; code: string }
  utcDate: string
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'TIMED'
  minute?: number
  homeTeam: Team
  awayTeam: Team
  score: {
    home: number | null
    away: number | null
  }
  venue?: string
}

export interface Player {
  id?: number
  name: string
  number: number
  position: string
  isKey?: boolean
  isDoubtful?: boolean
}

export interface Lineup {
  homeFormation: string
  awayFormation: string
  homeStartingXI: Player[]
  awayStartingXI: Player[]
}

export interface MatchEvent {
  id: string
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'VAR' | 'KICKOFF' | 'HALFTIME' | 'FULLTIME'
  minute: number
  team: 'home' | 'away'
  playerName?: string
  assistName?: string
  playerOff?: string
  detail?: string
  score?: { home: number; away: number }
}

export interface MatchStats {
  possession: { home: number; away: number }
  shots: { home: number; away: number }
  shotsOnTarget: { home: number; away: number }
  corners: { home: number; away: number }
  fouls: { home: number; away: number }
  saves: { home: number; away: number }
  passes: { home: number; away: number }
  passAccuracy: { home: number; away: number }
  offsides: { home: number; away: number }
}

export interface Standing {
  position: number
  team: Team
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalDifference: number
}

export interface WhatIfChange {
  id: string
  type: 'REMOVE_EVENT' | 'CHANGE_FORMATION_HOME' | 'CHANGE_FORMATION_AWAY'
  eventId?: string
  formation?: string
  description: string
}
```

---

## Zustand Store (src/store/useStore.ts)

```typescript
import { create } from 'zustand'
import { Match, WhatIfChange } from '../types'

interface Store {
  selectedMatch: Match | null
  setSelectedMatch: (match: Match) => void

  selectedDate: string
  setSelectedDate: (date: string) => void

  activeCompetition: string
  setActiveCompetition: (comp: string) => void

  liveMatchId: number | null
  setLiveMatchId: (id: number | null) => void

  isDemoMode: boolean
  demoMatchKey: 'usa_mexico' | 'germany_brazil' | null
  setDemoMode: (active: boolean, key?: 'usa_mexico' | 'germany_brazil') => void

  fullTimeMatch: Match | null
  fullTimeEvents: MatchEvent[]
  fullTimeStats: MatchStats | null
  setFullTimeData: (match: Match, events: MatchEvent[], stats: MatchStats) => void

  whatIfChanges: WhatIfChange[]
  addWhatIfChange: (change: WhatIfChange) => void
  removeWhatIfChange: (id: string) => void
  clearWhatIfChanges: () => void
}

// implement with create() from zustand
// default selectedDate = new Date().toISOString().split('T')[0]
// default activeCompetition = 'WC'
```

---

## File Structure

```
pitchside/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   ├── .env
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── types/index.ts
│       ├── store/useStore.ts
│       ├── api/
│       │   ├── football.ts
│       │   └── granite.ts
│       ├── hooks/
│       │   ├── useMatches.ts
│       │   ├── useLiveMatch.ts
│       │   └── useMatchDetail.ts
│       ├── data/
│       │   ├── demoMatches.ts      ← bundled replay data
│       │   ├── ifabLaws.ts         ← 17 laws as static object
│       │   └── formations.ts       ← 8 formation descriptions
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   └── BottomNav.tsx
│       │   ├── shared/
│       │   │   ├── GraniteCard.tsx     ← reusable AI content card
│       │   │   ├── TypewriterText.tsx  ← typewriter animation
│       │   │   ├── Skeleton.tsx
│       │   │   └── StatBar.tsx
│       │   ├── matchday/
│       │   │   ├── MatchHero.tsx
│       │   │   ├── LineupPanel.tsx
│       │   │   ├── StoryPanel.tsx
│       │   │   ├── BattlesPanel.tsx
│       │   │   ├── TacticsPanel.tsx
│       │   │   └── BuildUpPanel.tsx
│       │   ├── inplay/
│       │   │   ├── ScoreHero.tsx
│       │   │   ├── MomentumBar.tsx
│       │   │   ├── EventCard.tsx
│       │   │   ├── EventFeed.tsx
│       │   │   ├── LiveStatsPanel.tsx
│       │   │   ├── LiveTacticsPanel.tsx
│       │   │   └── DemoReplayBanner.tsx
│       │   ├── fulltime/
│       │   │   ├── ResultHero.tsx
│       │   │   ├── EventTimeline.tsx
│       │   │   ├── StatsBreakdown.tsx
│       │   │   ├── NarrativePanel.tsx
│       │   │   ├── StandingsPanel.tsx
│       │   │   └── WhatIfSimulator.tsx
│       │   └── dugout/
│       │       ├── AskAnything.tsx
│       │       ├── LawsAccordion.tsx
│       │       └── FormationCard.tsx
│       └── pages/
│           ├── Matchday.tsx
│           ├── InPlay.tsx
│           ├── FullTime.tsx
│           └── Dugout.tsx
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   ├── parse_ifab.py       ← one-time script
│   ├── data/
│   │   └── ifab_rules.json
│   ├── routes/
│   │   ├── matches.py
│   │   ├── granite.py
│   │   └── ifab.py
│   └── services/
│       ├── football_service.py
│       ├── granite_service.py
│       └── rag_service.py
└── PITCHSIDE.md
```

---

## Backend Specification

### main.py
FastAPI app with CORS middleware allowing all origins.
Loads .env with dotenv.
Registers three routers: matches, granite, ifab.
Runs on port 8000.

### routes/matches.py
```
GET /matches?date=YYYY-MM-DD
  Calls football-data.org: https://api.football-data.org/v4/matches?date={date}
  Header: X-Auth-Token from env
  Returns: list of Match objects

GET /matches/{id}/lineup
  Calls football-data.org: https://api.football-data.org/v4/matches/{id}
  Returns: lineup data (homeTeam lineups, awayTeam lineups, formations)

GET /matches/{id}/live
  Calls API-Football: https://api-football-v1.p.rapidapi.com/v3/fixtures?id={id}&live=all
  Header: X-RapidAPI-Key from env, X-RapidAPI-Host: api-football-v1.p.rapidapi.com
  Returns: live events + statistics

GET /standings?competition=WC2026
  Calls football-data.org standings endpoint
  Returns: standings array
```

### routes/granite.py
```
POST /granite/explain
  Body: { event_type, event_detail, rule_text, match_context, endpoint_type }
  endpoint_type options: explain | prematch | tactics | postmatch | whatif | academy | formation
  Calls IBM Granite with correct system prompt + endpoint instruction
  Returns: { text: string }

POST /granite/whatif
  Body: { events, removed_event_ids, home_formation, away_formation, final_score, teams }
  Calls Granite with what-if prompt
  Returns: { narrative: string }
```

### services/granite_service.py
IBM Granite API call using watsonx.ai.
URL: {WATSONX_URL}/ml/v1/text/chat?version=2023-05-29
Model: ibm/granite-4-h-small
Auth: Bearer token from WATSONX_API_KEY
Request body:
```json
{
  "model_id": "ibm/granite-4-h-small",
  "messages": [
    { "role": "system", "content": "<system prompt>" },
    { "role": "user", "content": "<user message>" }
  ],
  "max_tokens": 200,
  "temperature": 0.7,
  "project_id": "WATSONX_PROJECT_ID"
}
```

### services/rag_service.py
Loads ifab_rules.json on startup.
Function get_rule_for_event(event_type) returns relevant law text:
  RED_CARD → Law 12 (Fouls and Misconduct)
  YELLOW_CARD → Law 12
  VAR → Law 12 + VAR protocol section
  PENALTY → Law 12 (penalty kick section)
  OFFSIDE → Law 11
  SUBSTITUTION → Law 3
  GOALKEEPER → Law 1

---

## Granite System Prompt (used in every API call)

```
You are PitchSide — a football companion that explains the game as if standing at the side of the pitch. Close to the action. Knowledgeable. Calm.

Always follow these rules:
- Answer only what was asked. Nothing more.
- Plain English only. If a technical term is unavoidable, explain it in the same sentence.
- Prose only. No bullet points, no headers, no emojis, no lists.
- Be accurate. Never invent rules or statistics. If rule text is provided, cite only that.
- Be compact. Every sentence must earn its place. Cut anything that does not add meaning.
- Write for someone who loves watching football but does not know its technical details.
- Do not pad. Do not repeat yourself. Do not summarise what you just said.
- No sign-off phrases. No "I hope that helps." Just the answer.
```

## Granite Per-Endpoint Instructions

### explain (live event)
```
Explain this event in under 75 words. What happened, why it was given, 
and what it means for the match right now. If a rule applies, use only 
the law text provided. Do not speculate about what happens next.
```

### prematch
```
Write a pre-match narrative in under 110 words. What makes this match matter. 
The key storylines. The tension. No win predictions. No percentages. 
Make the reader feel why this game is worth watching.
```

### tactics
```
In under 90 words, explain what each team is trying to do and where the 
key tactical battle will be fought. Be specific to the formations and 
players provided. No outcome predictions.
```

### postmatch
```
In under 130 words, explain why this result happened. Name the turning point. 
Name who was decisive and why. Ground everything in the match events provided. 
Do not speculate beyond what the data shows.
```

### whatif
```
In under 130 words, reason through what would have changed if the removed 
events did not happen and the formation changes were in place. How would 
each team have adapted. What does the match look like now. Be specific and 
logical. No exact scores. No percentages. A narrative, not a prediction.
```

### academy
```
Answer in under 90 words. Direct answer first, then one concrete example 
from football if it helps. Use only the law text provided where relevant. 
Do not go beyond the question asked.
```

### formation
```
In under 70 words, explain what this formation does, its strengths, and 
where it is vulnerable. Plain language. One formation only.
```

---

## Page Specifications

### SIDEBAR (appears on all pages, left side, 220px wide)

Structure top to bottom:
1. Logo: "PitchSide" — "Pitch" white, "Side" #00E87A, font-display text-lg font-medium, p-3 border-b
2. Competition chips: World Cup | EPL | UCL | La Liga — horizontal scroll, selected=bg-accent-green text-black, unselected=border border-border-default text-text-secondary, text-xs px-3 py-1 rounded-full
3. Date strip: 5 date chips (today ±2 days), today chip highlighted with accent-green bg/border, click sets selectedDate in store, font-mono text-xs
4. Match list: scrollable, each card has competition+date label (text-[10px] text-text-dim), team names row (home | time-in-mono | away), venue text-[10px] text-text-dim. Selected card has border-l-2 border-accent-green bg-bg-hover. Live matches show minute in text-accent-green font-bold with pulsing dot.

On mobile: sidebar collapses, bottom nav shows with icons for 4 pages.

### MATCHDAY PAGE

Left: Sidebar. Right: match detail panel.

If no match selected: centered "Select a match to begin" text-text-secondary.

When match selected, right panel shows:

**MatchHero** (bg-bg-hero, border-b border-border-default, p-4):
- Competition name + round (text-[10px] text-accent-gold, letter-spacing)
- Teams row: [country badge] [team name font-display text-lg] — [time font-mono text-2xl] — [team name] [country badge]
- Country badges: 3-letter TLA, font-mono text-[11px], colored bg per nation (BRA=bg-green-900 text-yellow-300, ARG=bg-sky-900 text-sky-200, ESP=bg-red-900 text-yellow-300, etc, others=bg-border-strong text-text-secondary)
- Date + venue below center (text-xs text-text-secondary and text-text-dim with map-pin icon)

**Tab bar** (border-b border-border-default, px-5, flex):
Tabs: Lineups | The story | Key battles | Tactics | Build-up
Active: text-text-primary border-b-2 border-accent-green
Inactive: text-text-secondary
Each: py-2.5 px-3 text-xs font-medium

**Tab panels** (flex-1 overflow-y-auto p-5):

LINEUPS TAB:
Two-column grid. Each column: team name + formation badge (font-mono text-[10px] text-accent-green bg-bg-card border border-border-default rounded px-1.5 py-0.5). Player rows: number (font-mono text-[10px] text-text-dim w-4) | name (text-[13px] text-text-ai flex-1) | position (font-mono text-[10px] text-text-secondary) | optional badge (KEY=bg-accent-green/10 text-accent-green, DOUBT=bg-accent-gold/10 text-accent-gold, text-[9px] font-medium px-1.5 rounded).
Data comes from /matches/{id}/lineup endpoint.

THE STORY TAB:
1. GraniteCard with prematch narrative (auto-loads on tab open, typewriter animation)
2. H2H stats: 3 boxes in grid-cols-3 (bg-bg-card border rounded-lg p-3 text-center, number in font-mono text-2xl text-accent-gold, label text-[10px] text-text-secondary)
3. Stakes list: bg-bg-card border rounded-lg p-3, each item = green dot + text-[12px] text-text-ai

KEY BATTLES TAB:
3 battle cards (bg-bg-card border rounded-lg p-4 mb-3).
Each: two player columns with avatar circle (initials, colored bg per team), VS in center, insight text below (text-[12px] text-text-ai leading-relaxed, border-t border-border-default pt-3).
Data: hardcoded per match based on team TLAs, or Granite-generated.

TACTICS TAB:
Two-column (grid-cols-2 gap-3). Each col: bg-bg-card border rounded-lg p-3.
Team name + formation badge as header.
3 tactical points: each has a lucide icon (Zap, ArrowsLeftRight, Lock, etc) in accent color + text-[11px] text-text-ai.
Below: GraniteCard with tactics endpoint narrative.

BUILD-UP TAB:
GraniteCard with prematch atmosphere narrative.
Venue facts table (bg-bg-card border rounded-lg p-3): rows of label|value in text-[11px], border-b between rows.
Recent form: two columns, each shows team name + 5 form dots (W=bg-accent-green/15 text-accent-green, D=bg-border-strong text-text-secondary, L=bg-accent-red/15 text-accent-red, each 24x24px rounded-md font-mono text-[10px] font-medium).

### IN PLAY PAGE

Left: Sidebar (same). Right: live match panel.

**ScoreHero** (bg-bg-hero border-b border-border-default p-4):
Top row: competition label (text-[10px] text-accent-gold) left, LIVE badge right (pulsing green dot + "LIVE" text-accent-green text-[10px] font-medium bg-accent-green/10 border border-accent-green/30 rounded-full px-2 py-0.5).
Teams row: [badge] [name font-display text-base] — [score font-mono text-4xl font-medium] — [score] [name] [badge]
Card indicators below each team name: yellow cards as 8×12px bg-accent-yellow rounded-sm, red cards as 8×12px bg-accent-red rounded-sm.
Match clock below center: font-mono text-[13px] text-text-secondary.

**MomentumBar** (px-5 py-2 border-b border-border-default):
Label row: "BRA" text-[10px] text-text-secondary left, "Possession" center, "ARG" right.
Bar: full width, h-1.5, bg-border-default rounded-full, split div where left portion = possession home % in bg-accent-green, right = away in bg-accent-ai.
Hint: "Brazil controlling" or "Evenly contested" in text-[10px] text-text-dim text-center mt-1.

**Tab bar**: Live feed | Stats | Tactics

**LIVE FEED TAB**:
Events in reverse chronological order (newest first).
Each EventCard:
- Container: flex flex-col bg-bg-card border border-border-default border-l-4 rounded-r-lg mb-2 p-3
- Border-left color by type: GOAL=#F5A623, RED_CARD=#FF5555, YELLOW_CARD=#FFCC00, VAR=#6B9EFF, SUBSTITUTION=#00E87A, KICKOFF/HALFTIME=#3A4E6E
- Header row: time (font-mono text-[11px] text-text-dim) | type label (text-[10px] font-medium) | description (text-[12px] text-text-ai flex-1) | "Explain this" button (text-[10px] border border-border-default rounded-full px-2 py-0.5 text-text-secondary hover:border-accent-ai hover:text-accent-ai)
- Type label colors: GOAL=text-accent-gold, RED CARD=text-accent-red, YELLOW=text-accent-yellow, VAR=text-accent-ai, SUB=text-accent-green
- On "Explain this" click: expand card, call /granite/explain with event data + rule text from RAG, show GraniteCard with typewriter + IFAB Law badge (font-mono text-[9px] text-accent-ai bg-bg-card border border-accent-ai/30 rounded px-1.5 py-0.5)
- New events slide in from right: Framer Motion initial={{x:20, opacity:0}} animate={{x:0, opacity:1}}

When no live match: DemoReplayBanner component.
DemoReplayBanner: centered panel, "No live match right now" heading, two buttons: "USA 2-1 Mexico" and "Germany 7-1 Brazil".
On click: load bundled demo data from src/data/demoMatches.ts, set isDemoMode=true in store, auto-advance events every 120 seconds.
Show thin progress bar at top during demo playback.

**STATS TAB**:
Possession split bar (h-2 rounded-full, green left + ai-blue right, percentages on each side in font-mono text-[12px]).
Below: stat rows for shots, shots on target, corners, fouls, passes, pass accuracy, saves.
Each row: value (font-mono text-[13px] text-text-primary w-10 text-right) | bar (flex-1 h-1 relative: home bar anchors right, away bar anchors left, meeting in middle) | value.
Home bars: bg-accent-green. Away bars: bg-accent-ai.

**TACTICS TAB**:
GraniteCard with live tactical update (generated from current match events + formations).
Two mini battle update cards below showing how key duels have evolved.

### FULL TIME PAGE

Left: Sidebar. Right: post-match panel with tabs.

**ResultHero** (bg-bg-hero border-b p-4):
Same structure as ScoreHero but static. Shows "FULL TIME" badge instead of LIVE.
Man of the match strip below (if available from API): small avatar circle + name + team badge.

**Tabs**: The match | Stats | Implications | What if?

**THE MATCH TAB**:
NarrativePanel: GraniteCard with postmatch endpoint narrative (auto-generated).
EventTimeline: chronological list of all events. Each item: dot (colored by type) | time (font-mono) | description. Connected by a vertical line (border-l-2 border-border-default ml-2).
Key moment cards: 3 cards (bg-bg-card border rounded-lg p-4) for turning point, best chance, decisive moment — Granite-generated labels and descriptions.

**STATS TAB**:
Possession split bar (larger, h-3).
All stats as comparison rows (same pattern as live stats but full match).
Below stats: stat comparison bars using Recharts BarChart for visual comparison.

**IMPLICATIONS TAB**:
Updated standings table: team | P | W | D | L | GD | Pts. Highlight both teams in the match.
Next fixtures for both teams: two cards side by side.
Match impact text: GraniteCard explaining what the result means for qualification/standings.

**WHAT IF? TAB** (WhatIfSimulator):
Two-column layout.

Left panel (changes):
Title "Change the match" text-sm font-display font-medium.
All significant events listed as rows: time | type | description | toggle switch (on=event happened, off=remove it).
Toggle switch: custom styled, green when on, border-default when off.
Formation dropdowns: "Home formation" and "Away formation" selects with options: 4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-3-2, 3-4-3.
"Simulate" button: w-full mt-4 bg-accent-green text-black font-display font-medium py-2.5 rounded-lg hover:bg-accent-green/90.

Right panel (result):
Before simulate: centered placeholder "Toggle events and click Simulate to explore alternate outcomes" text-text-dim text-sm.
After simulate: GraniteCard with what-if narrative (typewriter animation).
Below narrative: comparison strip. Two boxes side by side: "Original" (bg-bg-card border rounded-lg p-3 text-center) showing real score, "Simulated" showing "Match dynamics shifted" or narrative outcome summary.
Loading: skeleton pulse animation on right panel while waiting for Granite.

### DUGOUT PAGE

Three tabs: Ask anything | Laws of the game | Formations

**ASK ANYTHING TAB**:
Input area at top: textarea (bg-bg-card border border-border-default rounded-lg p-3 text-text-primary text-sm placeholder-text-dim resize-none, focus:border-accent-ai outline-none) + "Ask" button (bg-accent-green text-black font-medium px-4 py-2 rounded-lg).
Below: answer appears in GraniteCard with typewriter animation.
Suggested questions: "What is the offside rule?", "When is a penalty given?", "What does VAR check?" — as chips below input, click to fill input.

**LAWS OF THE GAME TAB**:
Accordion list of all 17 IFAB laws. Each: law number + title as header (click to expand), law summary text below (from src/data/ifabLaws.ts static data). Border-b between items. Expanded item shows bg-bg-card border-l-2 border-accent-ai.

**FORMATIONS TAB**:
8 formation cards in grid-cols-2 gap-3: 4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-3-2, 3-4-3, 4-1-4-1, 4-2-2-2.
Each card: bg-bg-card border rounded-lg p-4 cursor-pointer hover:border-accent-ai.
Formation name in font-mono text-accent-green text-lg. Brief descriptor in text-[12px] text-text-secondary.
On click: expand card or open modal with Granite explanation of that formation.

---

## Shared Components

### GraniteCard.tsx
Props: text (string | null), isLoading (boolean), showLabel (boolean, default true), lawBadge (string | null)
When isLoading: shows 3 pulsing skeleton lines.
When text: renders TypewriterText component.
Always shows "IBM Granite" label at top if showLabel.
If lawBadge: shows badge below label.
Container: bg rgba(107,158,255,0.05) border border-accent-ai/20 border-l-4 border-l-accent-ai rounded-r-lg p-4.

### TypewriterText.tsx
Props: text (string), speed (number, default 18)
Uses useEffect + setInterval to reveal characters one at a time.
Renders as a paragraph, text-[13px] text-text-ai leading-relaxed.

### StatBar.tsx
Props: homeValue, awayValue, label, homeColor (default accent-green), awayColor (default accent-ai)
Renders the comparison row pattern used in stats panels.

---

## Demo Match Data (src/data/demoMatches.ts)

```typescript
export const USA_MEXICO_EVENTS: MatchEvent[] = [
  { id: '1', type: 'KICKOFF', minute: 0, team: 'home', detail: 'USA 4-3-3 vs Mexico 4-2-3-1' },
  { id: '2', type: 'YELLOW_CARD', minute: 22, team: 'away', playerName: 'H. Moreno', detail: 'Tactical foul on Pulisic' },
  { id: '3', type: 'GOAL', minute: 38, team: 'away', playerName: 'H. Lozano', assistName: 'A. Guardado', detail: 'Counter-attack finish', score: { home: 0, away: 1 } },
  { id: '4', type: 'VAR', minute: 45, team: 'home', detail: 'Penalty awarded to USA — handball in box, VAR review confirmed', score: { home: 0, away: 1 } },
  { id: '5', type: 'GOAL', minute: 46, team: 'home', playerName: 'C. Pulisic', detail: 'Penalty conversion', score: { home: 1, away: 1 } },
  { id: '6', type: 'SUBSTITUTION', minute: 62, team: 'away', playerName: 'J. Corona', playerOff: 'A. Guardado', detail: 'Tactical change' },
  { id: '7', type: 'RED_CARD', minute: 67, team: 'away', playerName: 'C. Salcedo', detail: 'Violent conduct — lunge on Weah from behind' },
  { id: '8', type: 'SUBSTITUTION', minute: 70, team: 'home', playerName: 'F. Aaronson', playerOff: 'T. Adams', detail: 'Fresh legs in midfield' },
  { id: '9', type: 'GOAL', minute: 89, team: 'home', playerName: 'R. Weah', assistName: 'C. Pulisic', detail: 'Late winner — header from corner', score: { home: 2, away: 1 } },
  { id: '10', type: 'FULLTIME', minute: 90, team: 'home', detail: 'USA 2-1 Mexico' },
]

export const USA_MEXICO_MATCH = {
  home: { name: 'United States', tla: 'USA' },
  away: { name: 'Mexico', tla: 'MEX' },
  score: { home: 2, away: 1 },
  competition: 'FIFA World Cup 2026 — Round of 16',
  venue: 'SoFi Stadium, Los Angeles',
}

export const GERMANY_BRAZIL_EVENTS: MatchEvent[] = [
  { id: '1', type: 'KICKOFF', minute: 0, team: 'home', detail: 'Germany vs Brazil — 2014 Semi-Final' },
  { id: '2', type: 'GOAL', minute: 11, team: 'home', playerName: 'T. Müller', assistName: 'T. Kroos', detail: 'Near-post finish', score: { home: 1, away: 0 } },
  { id: '3', type: 'GOAL', minute: 23, team: 'home', playerName: 'M. Klose', detail: 'Bundled in from close range', score: { home: 2, away: 0 } },
  { id: '4', type: 'GOAL', minute: 24, team: 'home', playerName: 'T. Kroos', detail: 'Thunderous left-foot finish', score: { home: 3, away: 0 } },
  { id: '5', type: 'GOAL', minute: 26, team: 'home', playerName: 'T. Kroos', detail: 'Second in three minutes', score: { home: 4, away: 0 } },
  { id: '6', type: 'GOAL', minute: 29, team: 'home', playerName: 'S. Khedira', detail: 'Chaos in the box', score: { home: 5, away: 0 } },
  { id: '7', type: 'GOAL', minute: 69, team: 'home', playerName: 'A. Schürrle', detail: 'Left-foot strike', score: { home: 6, away: 0 } },
  { id: '8', type: 'GOAL', minute: 79, team: 'home', playerName: 'A. Schürrle', detail: 'Bending effort', score: { home: 7, away: 0 } },
  { id: '9', type: 'GOAL', minute: 90, team: 'away', playerName: 'O. Oscar', detail: 'Consolation for Brazil', score: { home: 7, away: 1 } },
  { id: '10', type: 'FULLTIME', minute: 90, team: 'home', detail: 'Germany 7-1 Brazil' },
]
```

---

## Formations Data (src/data/formations.ts)

Static descriptions for 8 formations used by Granite formation explainer:
4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-3-2, 3-4-3, 4-1-4-1, 4-2-2-2.
Each: name, shape description, strengths, weaknesses (short strings, 20 words max each).

---

## IFAB Laws Static Data (src/data/ifabLaws.ts)

Static object with all 17 laws. Each:
```typescript
{
  number: 1,
  title: "The Field of Play",
  summary: "Brief 2-sentence plain English summary of this law."
}
```
Laws 1–17. Used by LawsAccordion on the Dugout page.
For Law 12 (Fouls and Misconduct) include expanded detail on red card offences and yellow card offences since this powers the live explanation RAG fallback.

---

## API Utility (src/api/football.ts)

```typescript
const BASE = import.meta.env.VITE_API_BASE_URL

export const fetchMatches = (date: string) =>
  axios.get(`${BASE}/matches?date=${date}`).then(r => r.data)

export const fetchLineup = (matchId: number) =>
  axios.get(`${BASE}/matches/${matchId}/lineup`).then(r => r.data)

export const fetchLiveMatch = (matchId: number) =>
  axios.get(`${BASE}/matches/${matchId}/live`).then(r => r.data)

export const fetchStandings = (competition: string) =>
  axios.get(`${BASE}/standings?competition=${competition}`).then(r => r.data)
```

## Granite Utility (src/api/granite.ts)

```typescript
const BASE = import.meta.env.VITE_API_BASE_URL

export const explainEvent = (payload: {
  event_type: string
  event_detail: string
  rule_text?: string
  match_context: string
}) => axios.post(`${BASE}/granite/explain`, { ...payload, endpoint_type: 'explain' }).then(r => r.data.text)

export const generateNarrative = (payload: object, endpoint_type: string) =>
  axios.post(`${BASE}/granite/explain`, { ...payload, endpoint_type }).then(r => r.data.text)

export const simulateWhatIf = (payload: object) =>
  axios.post(`${BASE}/granite/whatif`, payload).then(r => r.data.narrative)
```

---

## Animations

All Granite text: TypewriterText component, 18ms per character.
New live events: Framer Motion slide-in from right (initial={{x:20,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:0.2}}).
Tab panel change: fade in (initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.15}}).
LIVE badge pulsing dot: CSS animation, opacity 1→0.3→1, 1.2s infinite.
Loading skeletons: Tailwind animate-pulse on bg-bg-card rounded blocks.

---

## Deployment

### Frontend (Vercel)
Build command: npm run build
Output dir: dist
Environment variable: VITE_API_BASE_URL = your Render backend URL

### Backend (Render)
Build command: pip install -r requirements.txt
Start command: uvicorn main:app --host 0.0.0.0 --port 10000
Add all .env variables in Render dashboard

### requirements.txt
```
fastapi
uvicorn
httpx
python-dotenv
docling
```

---

## UPDATED: Three-Layer API Architecture

This is the correct data source stack. Use all three. Never rely on just one.

### Layer 1 — football-data.org (non-live data)
Base URL: https://api.football-data.org/v4
Auth header: X-Auth-Token: {FOOTBALL_DATA_API_KEY}
Use for: fixtures list by date, lineups, standings, completed match results, head-to-head

Key endpoints:
  GET /matches?date=YYYY-MM-DD        → today's matches across all competitions
  GET /matches/{id}                   → match detail including lineups and events
  GET /competitions/{code}/standings  → league table (WC code = WC, PL = PL, etc.)

### Layer 2 — SportDB.dev (live data, PRIMARY live source)
Base URL: https://api.sportdb.dev
Auth header: X-API-Key: {SPORTDB_API_KEY}
Use for: live scores, live match events, real-time updates during In Play page
Free tier: 1000 requests — use caching aggressively, poll max every 30 seconds

Key endpoints:
  GET /api/soccer                     → all live football matches right now
  GET /api/soccer/{country}/{comp}/{season}/fixtures  → fixtures for a competition
  GET /api/soccer/{country}/{comp}/{season}/standings → standings

Registration: sportdb.dev → create account → copy API key from dashboard

### Layer 3 — API-Football via RapidAPI (fallback only)
Base URL: https://api-football-v1.p.rapidapi.com/v3
Auth headers: X-RapidAPI-Key: {API_FOOTBALL_KEY}, X-RapidAPI-Host: api-football-v1.p.rapidapi.com
Use for: fallback if SportDB.dev is down or rate-limited during demo
Free tier: 100 requests/day — do not use as primary, only fallback

Key endpoints:
  GET /fixtures?live=all              → all live fixtures right now
  GET /fixtures?id={id}               → specific match with stats and events

### Updated Environment Variables

backend/.env — add this new key:
  SPORTDB_API_KEY=your_sportdb_key_here

### Updated Backend Logic

In football_service.py, the get_live_match(match_id) function must:
1. Try SportDB.dev first — GET /api/soccer for live matches, filter by match
2. If SportDB.dev returns empty or errors → fallback to API-Football GET /fixtures?live=all
3. Cache the result for 30 seconds before making another call
4. Never fail silently — if both fail, return the last cached result

The backend route GET /matches/{id}/live calls get_live_match() and returns
a unified response shape regardless of which API provided the data:
{
  "score": { "home": 1, "away": 1 },
  "minute": 67,
  "status": "IN_PLAY",
  "events": [ ...MatchEvent array... ],
  "stats": { ...MatchStats object... }
}

This unified shape is what the frontend always receives. The frontend never
knows or cares which API provided the data.

### Updated Master Prompt 2 Addition

When building the frontend api/football.ts, the useLiveMatch hook must:
- Poll GET /matches/{id}/live every 30 seconds using TanStack Query refetchInterval
- During demo mode, skip the API call entirely and use local demoMatches.ts data
- Show the last known data if the poll fails (never clear the screen on error)

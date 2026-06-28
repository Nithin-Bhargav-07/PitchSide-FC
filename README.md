# PitchSide — AI-powered football companion 

## The Problem
Approximately 5 billion people watch the world cup. Most don't understand VAR, formations, or why decisions are made. Existing apps show stats. None explain meaning.

## The Solution
- **Matchday**: Pre-match insights, predicted lineups, and tactical breakdowns.
- **In Play**: Live event feed with AI-powered explanations for key moments and VAR decisions.
- **Full Time**: Post-match summaries, narrative recaps, and updated standings.
- **The Dugout**: Tactical playground to experiment with formations and strategies.

## Architecture Diagram
```text
[React Frontend] --> [FastAPI Backend] --> [IBM Granite (watsonx.ai)]
                                       --> [SportDB.dev]
                                       --> [IFAB RAG Pipeline]
```

## IBM Granite — 6 Use Cases
| Endpoint | Purpose | Max Tokens |
| --- | --- | --- |
| `match_preview` | Generate engaging pre-match narratives | 500 |
| `explain` | Demystify live events (e.g., VAR, fouls) | 300 |
| `whatif` | Simulate alternate history scenarios | 600 |
| `postmatch` | Summarize match outcomes and key takeaways | 800 |
| `match_chat` | Interactive fan Q&A during the match | 250 |
| `academy` | Educational tactical insights in The Dugout | 400 |

## RAG Pipeline
The IFAB Laws of the Game PDF is processed by IBM Docling into `ifab_rules.json`. When an event occurs (e.g., offside), the relevant law is retrieved and injected into the Granite prompt, ensuring grounded and accurate explanations.

```text
[IFAB PDF] -> [IBM Docling] -> [ifab_rules.json] -> [Event Match] -> [Law Retrieved] -> [Granite Prompt] -> [Grounded Explanation]
```

## What-If Simulator
Our flagship innovation. Toggle real events, change formations, see pitch animation, and get Granite-generated alternate history. No other football app does this.

## Data Sources
| Source | Purpose | Tier |
| --- | --- | --- |
| SportDB.dev | Real-time match data, lineups, events | Primary Data |
| IBM watsonx.ai | Generative insights and chat | AI Engine |
| IFAB Laws PDF | Ground truth for rules and decisions | RAG Source |

## Tech Stack
| Frontend | Backend |
| --- | --- |
| React, TypeScript, Vite | FastAPI, Python |
| Tailwind CSS, Lucide Icons | IBM watsonx.ai (Granite) |
| React Router, Zustand | httpx, python-dotenv |

## Setup

**Backend:**
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python parse_ifab.py
uvicorn main:app --reload
```

**Frontend:**
```bash
npm install
npm run dev
```

**Required `.env` keys (Frontend & Backend):**
- `VITE_API_URL`
- `WATSONX_API_KEY`
- `WATSONX_PROJECT_ID`
- `SPORTDB_API_KEY`

## Demo
The built-in USA 2-1 Mexico replay works with zero API calls. All Granite features work seamlessly on this demo data.

## IBM Technologies Used
- IBM Granite 4 (`granite-4-h-small`)
- IBM Docling
- IBM watsonx.ai

## Submission Links
- [GitHub Repository](#)
- [Live Demo](#)
- [Video Presentation](#)

## Built By
- **Nithin**, R.M.K Engineering College, Chennai
- **IBM SkillsBuild AI Builders Challenge, June 2026**

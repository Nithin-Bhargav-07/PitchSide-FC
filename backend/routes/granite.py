from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from services.granite_service import generate_granite_text, safe_parse_preview
from services.football_service import get_live_match

router = APIRouter(prefix="/granite", tags=["Granite"])

MATCH_CONTEXT_CACHE = {} # map match_id -> {"event_count": int, "context": str}

class ExplainRequest(BaseModel):
    match_context: str
    endpoint_type: str
    event_type: Optional[str] = None
    event_detail: Optional[str] = None
    rule_text: Optional[str] = None
    user_query: Optional[str] = None

class WhatIfRequest(BaseModel):
    events: List[Dict[str, Any]]
    removed_event_ids: List[str]
    home_formation: Optional[str] = None
    away_formation: Optional[str] = None
    final_score: Dict[str, int]
    teams: Dict[str, Any]

class PostmatchRequest(BaseModel):
    facts: str

class PreviewRequest(BaseModel):
    homeTeam: str
    awayTeam: str
    homeTLA: str
    awayTLA: str
    competition: str
    standingGroup: str
    startDateTimeUtc: str
    homeFormation: str
    awayFormation: str
    eventId: str
    homeKeyPlayers: Optional[str] = None
    awayKeyPlayers: Optional[str] = None

class ChatRequest(BaseModel):
    match_id: str
    user_query: str

@router.post("/explain")
async def explain_event(req: ExplainRequest):
    message = f"Match Context: {req.match_context}\n"
    if req.event_type:
        message += f"Event Type: {req.event_type}\n"
    if req.event_detail:
        message += f"Detail: {req.event_detail}\n"
    if req.rule_text:
        message += f"Relevant Rule: {req.rule_text}\n"
    if req.user_query:
        message += f"User Query: {req.user_query}\n"
        
    text = await generate_granite_text(message, req.endpoint_type)
    return {"text": text}

@router.post("/whatif")
async def simulate_whatif(req: WhatIfRequest):
    message = f"Teams: {req.teams}\nOriginal Score: {req.final_score}\nEvents: {req.events}\nRemoved Events: {req.removed_event_ids}\n"
    if req.home_formation:
        message += f"New Home Formation: {req.home_formation}\n"
    if req.away_formation:
        message += f"New Away Formation: {req.away_formation}\n"
        
    narrative = await generate_granite_text(message, "whatif")
    return {"narrative": narrative}

@router.post("/postmatch")
async def generate_postmatch(req: PostmatchRequest):
    message = f"Confirmed facts: {req.facts}"
    
    narrative = await generate_granite_text(message, "postmatch")
    return {"narrative": narrative}

@router.post("/match_chat")
async def match_chat(req: ChatRequest):
    live_match = await get_live_match(req.match_id)
    if not live_match:
        return {"text": "I can only answer questions about live matches with available data."}
        
    events = live_match.get("events", [])
    cached = MATCH_CONTEXT_CACHE.get(req.match_id)
    
    if not cached or cached["event_count"] != len(events):
        match = live_match["match"]
        home = match["homeTeam"]["name"]
        away = match["awayTeam"]["name"]
        score = live_match["score"]
        minute = live_match.get("minute", "0")
        comp = match["competition"]["name"]
        
        events_str = "; ".join([
            f"{e.get('minute', '?')}' {e.get('type', '')} — {e.get('playerName', 'Unknown')} ({e.get('team', 'Unknown')}, {e.get('detail', '')})"
            for e in events
        ])
        
        match_context = f"""
Live match: {home} {score.get('home', 0)}-{score.get('away', 0)} {away}
Minute: {minute}
Competition: {comp}
Events so far: {events_str}
Example event format: "38' GOAL — H. Lozano (Mexico, counter-attack); 45' VAR — penalty awarded to USA; 46' GOAL — C. Pulisic (USA, penalty conversion)"
"""
        MATCH_CONTEXT_CACHE[req.match_id] = {"event_count": len(events), "context": match_context}
    else:
        match_context = cached["context"]
        
    message = f"{match_context}\n\nUser Question: {req.user_query}"
    text = await generate_granite_text(message, "match_chat")
    return {"text": text}

@router.post("/match_preview")
async def get_match_preview(req: PreviewRequest):
    hkp = f"\nHome lineup key players: {req.homeKeyPlayers}" if req.homeKeyPlayers else ""
    akp = f"\nAway lineup key players: {req.awayKeyPlayers}" if req.awayKeyPlayers else ""
    message = f"""Generate a match preview for {req.homeTeam} ({req.homeTLA}) vs {req.awayTeam} ({req.awayTLA}). Competition: {req.competition}. Group: {req.standingGroup}. Kickoff: {req.startDateTimeUtc}. Home formation: {req.homeFormation}. Away formation: {req.awayFormation}. This is specifically about THIS match between THESE two teams — do not generate generic football content.{hkp}{akp}

If no specific lineup data is provided above for either team, you must still populate key_battles using 3 real, well-known current international players for each national team based on your own knowledge. Returning an empty key_battles array is never acceptable — always populate all 3 entries with real player names, even without lineup data.

Return ONLY a valid JSON object with these exact keys — no markdown, no preamble, just the JSON:

{{
  "tagline": "One italic editorial sentence capturing the stakes. Max 18 words. Example: A wounded giant against a side with nothing left to lose.",
  
  "story": "3-4 sentences. First sentence: the single most important reason this match matters — rivalry, stakes, or historical weight. Second and third: the key human storylines (a player with something to prove, a tactical battle to watch). Fourth (optional): the emotional atmosphere around this match. Max 80 words total.",
  
  "tactics_home": "Two sentences about {req.homeTeam}. First: what they will try to do and how their formation enables it. Second: their most dangerous attacking pattern and their defensive vulnerability. Max 45 words. Specific to this team, not generic.",
  
  "tactics_away": "Two sentences about {req.awayTeam}. Same pattern as tactics_home. Max 45 words.",
  
  "buildup": "Two sentences. First: the atmosphere — what makes this venue or occasion feel significant today. Second: recent form — state each team's last 3 results in plain language. Max 50 words.",
  
  "key_battle": "One sentence naming the specific 1v1 matchup that will likely decide the match. Format: '[Player A] vs [Player B] — [one clause explaining why this duel matters]. Max 25 words.",

  "key_battles": [
    {{ "homePlayer": "string", "awayPlayer": "string", "homeInitials": "string", "awayInitials": "string", "insight": "string (max 20 words)" }},
    ... exactly 3 of these
  ]
}}
Ensure key_battles is an array of exactly 3 objects covering an attacking vs defensive duel, a midfield battle, and a wide duel."""
    
    raw = await generate_granite_text(message, "match_preview", cache_id=req.eventId)
    parsed = safe_parse_preview(raw)
    
    if parsed:
        if not parsed.get("key_battles") or len(parsed.get("key_battles")) == 0:
            print(f"[GRANITE WARNING] key_battles was empty or missing for {req.homeTeam} vs {req.awayTeam}")
        return parsed
    else:
        # Fallback if parsing fails
        return {
            "tagline": "A crucial encounter with no margin for error.",
            "story": "Both teams arrive knowing that any mistake could be fatal. The stakes have never been higher.",
            "tactics_home": f"{req.homeTeam} will look to control the tempo.",
            "tactics_away": f"{req.awayTeam} will try to strike on the break.",
            "buildup": "The atmosphere is electric as the fans await kickoff.",
            "key_battle": "The midfield battle will be decisive."
        }

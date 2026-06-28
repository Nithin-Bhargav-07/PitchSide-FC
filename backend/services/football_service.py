import os
import time
import httpx
from typing import Dict, Any, Optional

SPORTDB_API_KEY = os.getenv("SPORTDB_API_KEY")

def parse_minute(time_val) -> int:
    s = str(time_val).replace("'", "").strip()
    if '+' in s:
        parts = s.split('+')
        try:
            return int(parts[0]) + int(parts[1])
        except:
            return int(parts[0])
    try:
        return int(s)
    except:
        return 0

CACHE = {}
CACHE_TTL = 30  # seconds

SYNTHETIC_STATE = {
    "active": False,
    "start_time": None
}

USA_MEXICO_MATCH = {
    "id": 999999,
    "homeTeam": {"id": 1, "name": "United States", "shortName": "USA", "tla": "USA"},
    "awayTeam": {"id": 2, "name": "Mexico", "shortName": "MEX", "tla": "MEX"},
    "competition": {"name": "FIFA World Cup 2026 — Round of 16", "code": "WC"},
    "venue": "SoFi Stadium, Los Angeles",
    "utcDate": "2026-06-21T16:00:00Z",
    "status": "IN_PLAY",
    "minute": 55,
    "score": {"home": 1, "away": 1}
}

USA_MEXICO_EVENTS = [
    {"id": '1', "type": 'KICKOFF', "minute": 0, "team": 'home', "detail": 'USA 4-3-3 vs Mexico 4-2-3-1'},
    {"id": '2', "type": 'YELLOW_CARD', "minute": 22, "team": 'away', "playerName": 'H. Moreno', "detail": 'Tactical foul on Pulisic'},
    {"id": '3', "type": 'GOAL', "minute": 38, "team": 'away', "playerName": 'H. Lozano', "assistName": 'A. Guardado', "detail": 'Counter-attack finish', "score": {"home": 0, "away": 1}},
    {"id": '4', "type": 'VAR', "minute": 45, "team": 'home', "detail": 'Penalty awarded to USA — handball in box, VAR review confirmed', "score": {"home": 0, "away": 1}},
    {"id": '5', "type": 'GOAL', "minute": 46, "team": 'home', "playerName": 'C. Pulisic', "detail": 'Penalty conversion', "score": {"home": 1, "away": 1}},
    {"id": '6', "type": 'SUBSTITUTION', "minute": 62, "team": 'away', "playerName": 'J. Corona', "playerOff": 'A. Guardado', "detail": 'Tactical change'},
    {"id": '7', "type": 'RED_CARD', "minute": 67, "team": 'away', "playerName": 'C. Salcedo', "detail": 'Violent conduct — lunge on Weah from behind'},
    {"id": '8', "type": 'SUBSTITUTION', "minute": 70, "team": 'home', "playerName": 'F. Aaronson', "playerOff": 'T. Adams', "detail": 'Fresh legs in midfield'},
    {"id": '9', "type": 'GOAL', "minute": 89, "team": 'home', "playerName": 'R. Weah', "assistName": 'C. Pulisic', "detail": 'Late winner — header from corner', "score": {"home": 2, "away": 1}},
    {"id": '10', "type": 'FULLTIME', "minute": 90, "team": 'home', "detail": 'USA 2-1 Mexico'},
]

GERMANY_BRAZIL_MATCH = {
    "id": 999998,
    "homeTeam": {"id": 3, "name": "Germany", "shortName": "GER", "tla": "GER"},
    "awayTeam": {"id": 4, "name": "Brazil", "shortName": "BRA", "tla": "BRA"},
    "competition": {"name": "FIFA World Cup 2014 — Semi Final", "code": "WC"},
    "venue": "Estádio Mineirão, Belo Horizonte",
    "utcDate": "2014-07-08T20:00:00Z",
    "status": "IN_PLAY",
    "minute": 55,
    "score": {"home": 5, "away": 0}
}

GERMANY_BRAZIL_EVENTS = [
    {"id": '1', "type": 'KICKOFF', "minute": 0, "team": 'home', "detail": 'Germany vs Brazil — 2014 Semi-Final'},
    {"id": '2', "type": 'GOAL', "minute": 11, "team": 'home', "playerName": 'T. Müller', "assistName": 'T. Kroos', "detail": 'Near-post finish', "score": {"home": 1, "away": 0}},
    {"id": '3', "type": 'GOAL', "minute": 23, "team": 'home', "playerName": 'M. Klose', "detail": 'Bundled in from close range', "score": {"home": 2, "away": 0}},
    {"id": '4', "type": 'GOAL', "minute": 24, "team": 'home', "playerName": 'T. Kroos', "detail": 'Thunderous left-foot finish', "score": {"home": 3, "away": 0}},
    {"id": '5', "type": 'GOAL', "minute": 26, "team": 'home', "playerName": 'T. Kroos', "detail": 'Second in three minutes', "score": {"home": 4, "away": 0}},
    {"id": '6', "type": 'GOAL', "minute": 29, "team": 'home', "playerName": 'S. Khedira', "detail": 'Chaos in the box', "score": {"home": 5, "away": 0}},
    {"id": '7', "type": 'GOAL', "minute": 69, "team": 'home', "playerName": 'A. Schürrle', "detail": 'Left-foot strike', "score": {"home": 6, "away": 0}},
    {"id": '8', "type": 'GOAL', "minute": 79, "team": 'home', "playerName": 'A. Schürrle', "detail": 'Bending effort', "score": {"home": 7, "away": 0}},
    {"id": '9', "type": 'GOAL', "minute": 90, "team": 'away', "playerName": 'O. Oscar', "detail": 'Consolation for Brazil', "score": {"home": 7, "away": 1}},
    {"id": '10', "type": 'FULLTIME', "minute": 90, "team": 'home', "detail": 'Germany 7-1 Brazil'}
]

SYNTHETIC_STATE_2 = {
    "active": False,
    "start_time": None
}

WC_BASE = "https://api.sportdb.dev/api/flashscore/football/world:8/world-championship:lvUBR5F8"

async def fetch_with_cache(url: str, headers: Dict[str, str], cache_key: str) -> Optional[Any]:
    now = time.time()
    if cache_key in CACHE:
        cached_data, timestamp = CACHE[cache_key]
        if now - timestamp < CACHE_TTL:
            return cached_data

    async with httpx.AsyncClient() as client:
        try:
            print(f"[FETCH] Requesting {url}")
            response = await client.get(url, headers=headers, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            CACHE[cache_key] = (data, now)
            return data
        except Exception as e:
            print(f"[ERROR] Fetch failed for {url}: {e}")
            if cache_key in CACHE:
                return CACHE[cache_key][0]
            return None

def map_match(m: dict) -> dict:
    if not m: return None
    try:
        match_id = m.get("eventId") or m.get("id")
        raw_status = str(m.get("eventStage", "")).upper()
        
        if raw_status == "SCHEDULED":
            status = "SCHEDULED"
        elif raw_status == "FINISHED":
            status = "FINISHED"
        else:
            status = "IN_PLAY" # Everything else is live
            
        home_score = m.get("homeScore") if m.get("homeScore") not in (None, "") else m.get("homeFullTimeScore")
        away_score = m.get("awayScore") if m.get("awayScore") not in (None, "") else m.get("awayFullTimeScore")
        
        tournament_name = m.get("tournamentName", "World Championship")
        group_name = m.get("standingGroup", "")
        comp_name = f"{tournament_name} — {group_name}" if group_name else tournament_name
        
        return {
            "id": match_id,
            "competition": {"name": comp_name, "code": "WC"},
            "utcDate": m.get("startDateTimeUtc"),
            "status": status,
            "minute": parse_minute(m.get("gameTime")) if m.get("gameTime") and str(m.get("gameTime")) != "-1" else None,
            "homeTeam": {
                "id": m.get("homeEventParticipantId") or m.get("homeName"),
                "name": m.get("homeName", "Home"),
                "shortName": m.get("homeFirstName", m.get("homeName", "Home")),
                "tla": m.get("home3CharName", "HOM"),
                "crest": m.get("homeLogo")
            },
            "awayTeam": {
                "id": m.get("awayEventParticipantId") or m.get("awayName"),
                "name": m.get("awayName", "Away"),
                "shortName": m.get("awayFirstName", m.get("awayName", "Away")),
                "tla": m.get("away3CharName", "AWA"),
                "crest": m.get("awayLogo")
            },
            "score": {
                "home": int(home_score) if home_score is not None else None,
                "away": int(away_score) if away_score is not None else None
            },
            "varFlag": m.get("homeGoalUnderReview") == "1" or m.get("awayGoalUnderReview") == "1",
            "_raw_links": m.get("links", {}),
            "_raw_lineps": str(m.get("lineps", "0"))
        }
    except Exception as e:
        print(f"[ERROR] Mapping failed for match {m.get('eventId')}: {e}")
        return None

def _map_sportdb_lineup(data):
    item = data[0] if isinstance(data, list) and len(data) > 0 else data
    if not item or not isinstance(item, dict):
        return {"homeFormation": "TBD", "awayFormation": "TBD", "homeStartingXI": [], "awayStartingXI": []}
    
    home_data = item.get("home", {})
    if isinstance(home_data, list):
        home_data = home_data[0] if len(home_data) > 0 else {}
    if not isinstance(home_data, dict):
        home_data = {}
        
    away_data = item.get("away", {})
    if isinstance(away_data, list):
        away_data = away_data[0] if len(away_data) > 0 else {}
    if not isinstance(away_data, dict):
        away_data = {}
    
    def map_players(players_list):
        mapped = []
        for p in players_list:
            mapped.append({
                "id": p.get("participantId"),
                "name": p.get("participantName") or p.get("participantSurname"),
                "number": int(p.get("participantNumber", 0)) if str(p.get("participantNumber", "")).isdigit() else p.get("participantNumber"),
                "position": "GK" if "(G)" in str(p.get("participantSpecialPosition", "")) else "UNK",
            })
        return mapped

    return {
        "homeFormation": home_data.get("formation", "TBD"),
        "awayFormation": away_data.get("formation", "TBD"),
        "homeStartingXI": map_players(home_data.get("players", [])),
        "awayStartingXI": map_players(away_data.get("players", []))
    }

def _map_sportdb_stats(stats_data):
    mapped = {
        "possession": {"home": 0, "away": 0},
        "shots": {"home": 0, "away": 0},
        "shotsOnTarget": {"home": 0, "away": 0},
        "corners": {"home": 0, "away": 0},
        "fouls": {"home": 0, "away": 0},
        "saves": {"home": 0, "away": 0},
        "passes": {"home": 0, "away": 0},
        "passAccuracy": {"home": 0, "away": 0}
    }
    if not stats_data: return mapped
    
    def to_int(v):
        if not v: return 0
        v_str = str(v).replace('%', '').strip()
        try: return int(v_str)
        except: return 0

    groups = stats_data.get('data', []) if isinstance(stats_data, dict) else stats_data
    if not isinstance(groups, list):
        groups = [groups]
        
    for group in groups:
        items = group.get('items', []) if isinstance(group, dict) else []
        for item in items:
            name = item.get('name', '').lower()
            h = to_int(item.get('home', 0))
            a = to_int(item.get('away', 0))
            
            if 'possession' in name: mapped['possession'] = {"home": h, "away": a}
            elif 'goal attempts' in name or name == 'shots': mapped['shots'] = {"home": h, "away": a}
            elif 'shots on goal' in name or name == 'shots on target': mapped['shotsOnTarget'] = {"home": h, "away": a}
            elif 'corner' in name: mapped['corners'] = {"home": h, "away": a}
            elif 'foul' in name: mapped['fouls'] = {"home": h, "away": a}
            elif 'saves' in name: mapped['saves'] = {"home": h, "away": a}
            elif 'total passes' in name or name == 'passes': mapped['passes'] = {"home": h, "away": a}
            elif 'passes completed' in name:
                if mapped['passes']['home'] > 0:
                    mapped['passAccuracy']['home'] = int((h / mapped['passes']['home']) * 100)
                if mapped['passes']['away'] > 0:
                    mapped['passAccuracy']['away'] = int((a / mapped['passes']['away']) * 100)
                    
    return mapped

def _map_sportdb_events(details_data):
    item = details_data[0] if isinstance(details_data, list) and len(details_data) > 0 else details_data
    if not item or not isinstance(item, dict):
        return []
        
    events = item.get("events", [])
    mapped = []
    for e in events:
        try:
            team_num = str(e.get("incidentParticipantType", "1"))
            team = "home" if team_num == "1" else "away"
            
            raw_type = str(e.get("incidentType", "")).upper()
            t = "GOAL"
            if "YELLOW" in raw_type or "CARD" in raw_type: t = "YELLOW_CARD"
            elif "RED" in raw_type: t = "RED_CARD"
            elif "SUB" in raw_type: t = "SUBSTITUTION"
            elif "VAR" in raw_type: t = "VAR"
            
            mapped.append({
                "id": str(e.get("incidentId", len(mapped))),
                "type": t,
                "minute": parse_minute(e.get("incidentTime", 0)),
                "team": team,
                "playerName": e.get("participantName", ""),
                "detail": e.get("incidentName", "")
            })
        except:
            pass
    return mapped

async def get_matches_by_date(date: str):
    headers = {"X-API-Key": SPORTDB_API_KEY or ""}
    
    f_data = await fetch_with_cache(f"{WC_BASE}/2026/fixtures?page=1", headers, "fixtures_page_1")
    r_data = await fetch_with_cache(f"{WC_BASE}/2026/results?page=1", headers, "results_page_1")
    
    matches = []
    
    if f_data:
        f_list = f_data if isinstance(f_data, list) else f_data.get("data", [])
        for m in f_list:
            mapped = map_match(m)
            if mapped and date in str(mapped.get("utcDate", "")):
                matches.append(mapped)
                
    if r_data:
        r_list = r_data if isinstance(r_data, list) else r_data.get("data", [])
        for m in r_list:
            mapped = map_match(m)
            if mapped and date in str(mapped.get("utcDate", "")):
                matches.append(mapped)
                
    return {"matches": matches}

# Need to find match object globally first to get links.lineups
# Wait, frontend passes match_id, we can find it in CACHE
async def get_match_lineups(match_id: str):
    headers = {"X-API-Key": SPORTDB_API_KEY or ""}
    
    # Let's search for this match in fixtures/results to check 'lineps'
    target_match = None
    for cache_key in ["fixtures_page_1", "results_page_1"]:
        if cache_key in CACHE:
            data = CACHE[cache_key][0]
            m_list = data if isinstance(data, list) else data.get("data", [])
            for m in m_list:
                if str(m.get("eventId") or m.get("id")) == str(match_id):
                    target_match = m
                    break
        if target_match: break
        
    if target_match:
        if str(target_match.get("lineps", "0")) == "0":
            print(f"[SKIP] Lineups not available (lineps=0) for {match_id}. Saving request.")
            return {"homeFormation": "TBD", "awayFormation": "TBD", "homeStartingXI": [], "awayStartingXI": []}
            
        links = target_match.get("links", {})
        lineup_path = links.get("lineups")
        if lineup_path:
            url = f"https://api.sportdb.dev{lineup_path}"
            data = await fetch_with_cache(url, headers, f"lineup_{match_id}")
            if data:
                return _map_sportdb_lineup(data)
            return {"homeFormation": "TBD", "awayFormation": "TBD", "homeStartingXI": [], "awayStartingXI": []}

    # Fallback if links not found
    url = f"https://api.sportdb.dev/api/flashscore/match/{match_id}/lineups"
    data = await fetch_with_cache(url, headers, f"lineup_{match_id}")
    if data:
        return _map_sportdb_lineup(data)
    return {"homeFormation": "TBD", "awayFormation": "TBD", "homeStartingXI": [], "awayStartingXI": []}

async def get_standings(competition: str):
    url = f"{WC_BASE}/2026/standings"
    headers = {"X-API-Key": SPORTDB_API_KEY or ""}
    return await fetch_with_cache(url, headers, f"standings_2026")

def _get_synthetic_match_data():
    print("[INFO] Zero live matches qualify. Falling back to synthetic Demo Mode.")
    if not SYNTHETIC_STATE["active"]:
        SYNTHETIC_STATE["active"] = True
        SYNTHETIC_STATE["start_time"] = time.time()

    elapsed_seconds = time.time() - SYNTHETIC_STATE["start_time"]
    current_time_seconds = (55 * 60) + elapsed_seconds
    current_minute = int(current_time_seconds // 60)

    current_score = {"home": 0, "away": 0}
    filtered_events = []
    
    for event in USA_MEXICO_EVENTS:
        if event["minute"] <= current_minute:
            filtered_events.append(event)
            if "score" in event:
                current_score = event["score"]

    status = "FINISHED" if current_minute >= 90 else "IN_PLAY"
    
    return {
        "source": "synthetic",
        "match": USA_MEXICO_MATCH,
        "score": current_score,
        "minute": min(current_minute, 90),
        "status": status,
        "events": filtered_events[::-1],
        "stats": {
            "possession": {"home": 58, "away": 42},
            "shots": {"home": 12, "away": 8},
            "shotsOnTarget": {"home": 5, "away": 3},
            "corners": {"home": 6, "away": 2},
            "fouls": {"home": 10, "away": 14},
            "saves": {"home": 2, "away": 3},
            "passes": {"home": 450, "away": 320},
            "passAccuracy": {"home": 88, "away": 81},
            "offsides": {"home": 1, "away": 3}
        }
    }

def _get_synthetic_match_data_2():
    print("[INFO] Zero live matches qualify. Falling back to synthetic Demo Mode 2.")
    if not SYNTHETIC_STATE_2["active"]:
        SYNTHETIC_STATE_2["active"] = True
        SYNTHETIC_STATE_2["start_time"] = time.time()

    elapsed_seconds = time.time() - SYNTHETIC_STATE_2["start_time"]
    current_time_seconds = (55 * 60) + elapsed_seconds
    current_minute = int(current_time_seconds // 60)

    current_score = {"home": 0, "away": 0}
    filtered_events = []
    
    for event in GERMANY_BRAZIL_EVENTS:
        if event["minute"] <= current_minute:
            filtered_events.append(event)
            if "score" in event:
                current_score = event["score"]

    status = "FINISHED" if current_minute >= 90 else "IN_PLAY"
    
    return {
        "source": "synthetic",
        "match": GERMANY_BRAZIL_MATCH,
        "score": current_score,
        "minute": min(current_minute, 90),
        "status": status,
        "events": filtered_events[::-1],
        "stats": {
            "possession": {"home": 63, "away": 37},
            "shots": {"home": 25, "away": 8},
            "shotsOnTarget": {"home": 14, "away": 3},
            "corners": {"home": 11, "away": 3},
            "fouls": {"home": 12, "away": 15},
            "saves": {"home": 2, "away": 10},
            "passes": {"home": 687, "away": 312},
            "passAccuracy": {"home": 91, "away": 79},
            "offsides": {"home": 2, "away": 0}
        }
    }

async def get_live_match(match_id: str):
    if str(match_id) == "demo":
        return _get_synthetic_match_data()
    if str(match_id) == "demo2":
        return _get_synthetic_match_data_2()

    url = f"{WC_BASE}/live"
    headers = {"X-API-Key": SPORTDB_API_KEY or ""}
    live_data = await fetch_with_cache(url, headers, "live_matches")
    
    match_data = None
    if live_data:
        live_list = live_data if isinstance(live_data, list) else live_data.get("data", [])
        
        # Filter for truly LIVE matches
        in_progress = [m for m in live_list if m.get("eventStage") not in ("SCHEDULED", "FINISHED")]
        
        for m in in_progress:
            m_id = str(m.get("id") or m.get("eventId"))
            if m_id == str(match_id):
                match_data = m
                break
    if not match_data:
        # Fallback to cache for finished/scheduled matches
        for cache_key in ["fixtures_page_1", "results_page_1"]:
            if cache_key in CACHE:
                data = CACHE[cache_key][0]
                m_list = data if isinstance(data, list) else data.get("data", [])
                for m in m_list:
                    if str(m.get("eventId") or m.get("id")) == str(match_id):
                        match_data = m
                        break
            if match_data: break

    if match_data:
        mapped_match = _map_sportdb_match(match_data)
        
        # We won't fetch events/stats here if it's finished, but for live we might need it.
        # To keep backwards compatibility for live matches, we'll try to fetch stats.
        stats = await fetch_with_cache(f"https://api.sportdb.dev/api/flashscore/match/{match_id}/stats", headers, f"stats_{match_id}")
        match_stats = _map_sportdb_stats(stats) if stats else None
        
        # Live matches often don't have full details in the details endpoint during play, 
        # but we can try to get events.
        details = await fetch_with_cache(f"https://api.sportdb.dev/api/flashscore/match/{match_id}/details", headers, f"details_{match_id}")
        
        events = []
        if details:
            d = details[0] if isinstance(details, list) else details
            events = _map_sportdb_events(d.get('events', []))

        unified = {
            "match": mapped_match,
            "minute": mapped_match.get("minute", "HT"),
            "score": mapped_match.get("score"),
            "stats": match_stats,
            "events": events
        }
        CACHE[f"live_{match_id}"] = (unified, time.time())
        return unified

    print(f"[DEBUG] Requested match_id {match_id} not found in live feed.")
    if f"live_{match_id}" in CACHE:
        return CACHE[f"live_{match_id}"][0]
        
    return None

async def get_match_details(match_id: str):
    headers = {"X-API-Key": SPORTDB_API_KEY or ""}
    data = await fetch_with_cache(f"https://api.sportdb.dev/api/flashscore/match/{match_id}/details", headers, f"details_{match_id}")
    if not data:
        return None
    d = data[0] if isinstance(data, list) else data
    
    venue = d.get('venue')
    venueCity = d.get('venueCity')
    referee = d.get('referee')
    attendance = d.get('attendance')
    capacity = d.get('capacity')
    
    events = _map_sportdb_events(d.get('events', []))
    
    return {
        "venue": venue,
        "venueCity": venueCity,
        "referee": referee,
        "attendance": attendance,
        "capacity": capacity,
        "events": events
    }

def _map_sportdb_events(raw_events: list) -> list:
    mapped = []
    for e in raw_events:
        types = e.get('incidentType', [])
        names = e.get('incidentTypeName', [])
        players = e.get('incidentPlayerName', [])
        
        if not types:
            continue
            
        type_str = names[0].lower() if names else ""
        mapped_type = "VAR"
        if "goal" in type_str:
            mapped_type = "GOAL"
        elif "yellow" in type_str:
            mapped_type = "YELLOW_CARD"
        elif "red" in type_str:
            mapped_type = "RED_CARD"
        elif "substitution" in type_str:
            mapped_type = "SUBSTITUTION"
        elif "missed" in type_str:
            mapped_type = "VAR"
            
        home_score = e.get('homeScore')
        away_score = e.get('awayScore')
        score = None
        if home_score is not None and away_score is not None:
            score = {"home": int(home_score), "away": int(away_score)}
            
        mapped.append({
            "id": str(e.get('eventId', str(len(mapped)))),
            "type": mapped_type,
            "minute": parse_minute(e.get('incidentTime', 0)),
            "team": "home" if str(e.get('incidentSide')) == "1" else "away",
            "playerName": players[0] if players else "Unknown Player",
            "detail": e.get('incidentCommentary', [""])[0] if isinstance(e.get('incidentCommentary'), list) else e.get('incidentCommentary', ''),
            "score": score
        })
    return mapped

async def get_match_stats(match_id: str):
    headers = {"X-API-Key": SPORTDB_API_KEY or ""}
    data = await fetch_with_cache(f"https://api.sportdb.dev/api/flashscore/match/{match_id}/stats", headers, f"stats_{match_id}")
    if not data:
        return None
        
    groups = data.get('data', []) if isinstance(data, dict) else data
    if not groups:
        return None
        
    full = next((g for g in groups if g.get('period') in ['ALL', '90', 'FULL_TIME', 'Match']), groups[0])
    items = full.get('items', [])
    
    stats_dict = {}
    for item in items:
        stats_dict[item.get('name', '').lower()] = item
        
    def _val(key: str):
        for k, v in stats_dict.items():
            if key.lower() in k:
                try:
                    h = int(str(v.get('homeValue')).replace('%',''))
                    a = int(str(v.get('awayValue')).replace('%',''))
                    return {"home": h, "away": a}
                except:
                    return {"home": 0, "away": 0}
        return {"home": 0, "away": 0}

    return {
        "possession": _val("possession"),
        "shots": _val("shots total"),
        "shotsOnTarget": _val("shots on target"),
        "shotsOffTarget": _val("shots off target"),
        "blockedShots": _val("blocked shots"),
        "corners": _val("corner kicks"),
        "offsides": _val("offsides"),
        "fouls": _val("fouls"),
        "yellowCards": _val("yellow cards"),
        "redCards": _val("red cards"),
        "saves": _val("goalkeeper saves"),
        "passes": _val("total passes"),
        "passesAccurate": _val("completed passes"),
        "accuratePassesPercentage": _val("passes accurate"),
        "expectedGoals": _val("expected goals")
    }

async def get_match_playerstats(match_id: str):
    headers = {"X-API-Key": SPORTDB_API_KEY or ""}
    data = await fetch_with_cache(f"https://api.sportdb.dev/api/flashscore/match/{match_id}/playerstats", headers, f"playerstats_{match_id}")
    if not data:
        return None
        
    d = data[0] if isinstance(data, list) else data
    return d.get('players', []) if isinstance(d, dict) else []


import os
import httpx
import time
import hashlib
import json

IAM_TOKEN = None
TOKEN_EXPIRES = 0

async def get_iam_token(api_key: str):
    global IAM_TOKEN, TOKEN_EXPIRES
    if IAM_TOKEN and time.time() < TOKEN_EXPIRES:
        return IAM_TOKEN
        
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": api_key
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, data=data)
        response.raise_for_status()
        res_data = response.json()
        IAM_TOKEN = res_data["access_token"]
        TOKEN_EXPIRES = time.time() + 3000
        return IAM_TOKEN

SYSTEM_PROMPT = """You are PitchSide — a football companion who has watched the game their whole life and explains it like talking to a friend who loves the drama but doesn't know every rule.

RULE 1 — ANSWER FIRST: Your first sentence must be the direct answer to what was asked. Not context, not background, not setup. The answer. Everything after supports it.

RULE 2 — EARN EVERY SENTENCE: Each sentence must carry new information. Never restate what the previous sentence said. Never summarise what you just explained.

RULE 3 — SPEAK, DON'T WRITE: Write the way a knowledgeable friend talks, not the way a textbook explains. Short clauses. Active verbs. Named players, not 'the player'. Specific moments, not vague descriptions.

RULE 4 — ACCURACY: Never invent a rule or statistic. If you don't know the exact law number, just explain the rule conceptually. Do not hallucinate scorelines or player names that were not provided to you. Never invent player names. If a player name is provided in the event data, use it exactly as given. If no name is provided, refer to 'the player' without naming them.

RULE 5 — NO FILLER: Never use these phrases: 'It is worth noting', 'In the context of', 'This is significant because', 'Under the Laws of the Game', 'Football is governed by'. They delay the answer and add nothing.

RULE 6 — NO SIGN-OFF: Never end with 'I hope that helps', 'Feel free to ask', or any closing phrase. End when the answer is complete."""

ENDPOINT_INSTRUCTIONS = {
    "match_preview": "", # System prompt handles persona, JSON structure provided in user message
    "explain": "3-4 sentences.\nSentence 1: What happened and who did it — specific, named.\nSentence 2: Why the referee gave it — cite the rule text provided if available, in plain language.\nSentence 3: What this means for the match right now — scoreline, momentum, numerical advantage or disadvantage.\nSentence 4 (only if VAR): What VAR checked and why the original call was confirmed or overturned.\nNever start with 'The referee' or 'Under Law'. Start with the player's name or the action itself.",
    "whatif": "4 sentences maximum.\nSentence 1 (bold lead): The headline outcome — what concretely changes if these events are removed or altered. Be specific, be definitive, don't hedge.\nSentence 2: Which team benefits and how their shape changes.\nSentence 3: The tactical consequence — what the opposing team must now do differently.\nSentence 4: The likely result shift — not a score prediction, but a direction (stays level, home side gains control, becomes more open etc).\nStart with the most dramatic consequence, not the setup.",
    "postmatch": "Write 3-4 sentences explaining why this result happened. Use only the confirmed facts provided in the prompt. Start with who won and the decisive factor. Do not invent any players, events, or statistics not provided.",
    "academy": "Answer any question about football — rules, tactics, history, players, competitions, or match situations. Answer the specific question asked. 3-4 sentences: direct answer first, rule or reason second, one concrete real example third. Do not cite specific real-world match incidents, named referees, or specific historical events as examples unless you are completely certain they are accurate. Prefer generic illustrative examples instead — e.g. 'a reckless tackle using excessive force' rather than naming a specific real match. If asked about a specific historical incident directly, you may answer, but do not invent supporting examples for general rule explanations. If the question is not about football, respond: 'PitchSide covers football only — ask me anything about the game.'",
    "match_chat": "Answer in exactly 2 sentences. Sentence 1: direct answer naming the specific reason using the match events provided. Sentence 2: one consequence or what to watch for next. Never use more than 2 sentences. Use player names from the events list. Do not start with 'Mexico' or any team name repeated twice in one answer.",
    "formation": "3 sentences exactly.\nSentence 1: What this formation is designed to do — attacking intent or defensive structure, in one clause.\nSentence 2: Its biggest strength in specific tactical terms.\nSentence 3: The specific situation or opponent type that exposes its weakness.\nName real teams or managers who use or used it.",
    # Legacy fallbacks
    "tagline": "Write one sentence in italic editorial style that captures the essence of this match. Maximum 20 words. No statistics, no predictions. Pure narrative stakes. Make it sound like a newspaper subheading.",
    "prematch": "Write a pre-match narrative in under 80 words. What makes this match matter. The key storylines. The tension. No win predictions. No percentages. Make the reader feel why this game is worth watching.",
    "tactics": "In under 70 words, explain what each team is trying to do and where the key tactical battle will be fought. Be specific to the formations and players provided. No outcome predictions."
}

# Lineup generation instruction (returns JSON array only)
ENDPOINT_INSTRUCTIONS["lineup_gen"] = (
    "Generate a realistic starting XI for {teamName} in a {formation} formation for a 2026 World Cup match. "
    "Use real player names from their current squad. Return ONLY a JSON array of 11 objects with fields: "
    "number(int), name(string), position(string — use GK/CB/LB/RB/CDM/CM/CAM/RAM/LAM/RW/LW/ST), isKey(boolean). "
    "No other text, no markdown, just the JSON array."
)

GRANITE_CACHE = {}
REAL_CALLS_COUNT = 0

MAX_TOKENS_MAP = {
    "match_preview": 350,
    "explain": 150,
    "whatif": 150,
    "postmatch": 200,
    "match_chat": 80,
    "academy": 110,
    "formation": 90,
    "tagline": 40,
    "prematch": 105,
    "tactics": 95,
    "lineup_gen": 200
}

def safe_parse_preview(raw_response: str):
    text = raw_response.strip()
    if text.startswith("```"):
        parts = text.split("```")
        if len(parts) > 1:
            text = parts[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()
    start = text.find("{")
    end = text.rfind("}") + 1
    if start == -1 or end == 0:
        return None
    try:
        return json.loads(text[start:end])
    except json.JSONDecodeError:
        return None

async def generate_granite_text(user_message: str, endpoint_type: str, cache_id: str = None) -> str:
    print(f"[GRANITE] Prompt preview: {user_message[:200]}...")
    # DEV_MODE check
    if os.getenv("DEV_MODE", "false").lower() == "true":
        if endpoint_type == "match_preview":
            dev_json = {
                "tagline": "A wounded giant against a side playing for their first ever knockout stage.",
                "story": "France arrive as heavy favourites but with a defensive record that has leaked goals in every group stage match. Iraq, against all odds, need only a draw to advance. Mbappé has been quiet — this is the match where either he announces himself or France face an embarrassing exit. The Parc des Princes would be rocking; tonight it is a neutral venue with 60,000 Iraqi supporters who have travelled for this moment.",
                "tactics_home": "France will sit in a mid-block and trust Mbappé's pace to punish Iraq on the break — the 4-3-3 gives Griezmann licence to drop between the lines and find him in space. Their vulnerability is set pieces: they have conceded three from corners in this tournament already.",
                "tactics_away": "Iraq will defend deep in a 5-4-1 and try to frustrate France into mistakes. Their danger comes from wide — Ameen and Karrar have pace to exploit the space Theo Hernandez leaves when he pushes forward.",
                "buildup": "This stadium has hosted three World Cup matches so far and the pitch is holding up well despite the heat. France have won their last four meetings with Iraq; Iraq's last competitive win over a European side was against Denmark in 2018.",
                "key_battle": "Mbappé vs Iraq's right-back Rebin — if Rebin can stay disciplined and avoid a yellow card, Iraq have a chance.",
                "key_battles": [
                  { "homePlayer": "Sadio Mané", "awayPlayer": "Ali Adnan", 
                    "homeInitials": "SM", "awayInitials": "AA",
                    "insight": "Mané's direct running will test Adnan's defensive positioning all evening." },
                  { "homePlayer": "Idrissa Gueye", "awayPlayer": "Amjed Kalaf",
                    "homeInitials": "IG", "awayInitials": "AK", 
                    "insight": "Gueye's pressing intensity against Kalaf will determine who controls the midfield tempo." },
                  { "homePlayer": "Ismaïla Sarr", "awayPlayer": "Ali Faez",
                    "homeInitials": "IS", "awayInitials": "AF",
                    "insight": "Sarr's pace in behind will be Senegal's most dangerous weapon against a high defensive line." }
                ]
            }
            return json.dumps(dev_json)
        if endpoint_type == "explain":
            return "Salcedo went in with both feet and no intention of playing the ball — the kind of challenge that leaves the referee no choice. Law 12 is clear on this: excessive force means immediate dismissal, no warning. Mexico now defend a level score with ten men for the final 23 minutes. The space Salcedo was covering on the right side will be the area USA target for the rest of the match."
        if endpoint_type == "whatif":
            return "Without the red card, Mexico keep their defensive shape and the extra man in midfield cuts off Pulisic's runs from deep. USA lose their numerical advantage and can no longer commit men forward freely. Mexico's counter threat becomes genuine — De Paul and Lozano both available to break quickly. The match most likely stays level past 80 minutes rather than opening up the way it did."
        if endpoint_type == "postmatch":
            return "Weah's 89th minute header settled it. The defining moment was Salcedo's 67th minute red card, which forced Mexico into a low block and completely shifted the momentum. Pulisic was the standout performer, providing the assist and consistently exploiting the extra space on the left flank. The USA advance to the quarter-finals, while Mexico face a painful early exit."
        if endpoint_type == "match_chat":
            return "Mexico are level but struggling — Lozano's counter at 38' was their only real chance. USA have controlled possession since the penalty equaliser."
        if endpoint_type == "academy":
            return "A player is offside if any part of their body they can score with is closer to the goal line than both the ball and the second-last defender when the ball is played to them. It only matters at the moment the ball is played — not where you run to afterwards. Messi's 2015 Champions League semi-final goal against Bayern was originally flagged offside before VAR showed his shoulder was level. The rule doesn't apply if you receive the ball directly from a goal kick, corner, or throw-in."
        if endpoint_type == "formation":
            return "The 4-3-3 is designed to stretch the opposition defense with wide attackers while maintaining central control through a three-man midfield. Its biggest strength is the natural passing triangles it creates across the entire pitch. It becomes vulnerable to counter-attacks in wide areas when the full-backs push too high. Jurgen Klopp's Liverpool are the modern standard-bearers for this system."
        
        # Fallbacks for legacy/lineup
        if endpoint_type == "prematch":
            return "France arrive as heavy favourites but with a defensive record that has leaked goals in every group stage match. Iraq, against all odds, need only a draw to advance."
        if endpoint_type == "tagline":
            return "A wounded giant against a side playing for their first ever knockout stage."
        if endpoint_type == "lineup_gen":
            dev_lineup = [
                {"number": 1, "name": "GK Placeholder", "position": "GK", "isKey": False},
                {"number": 2, "name": "CB1 Placeholder", "position": "CB", "isKey": False},
                {"number": 3, "name": "CB2 Placeholder", "position": "CB", "isKey": False},
                {"number": 4, "name": "LB Placeholder", "position": "LB", "isKey": False},
                {"number": 5, "name": "CM1 Placeholder", "position": "CM", "isKey": False},
                {"number": 6, "name": "CM2 Placeholder", "position": "CM", "isKey": False},
                {"number": 7, "name": "CM3 Placeholder", "position": "CM", "isKey": False},
                {"number": 8, "name": "RW Placeholder", "position": "RW", "isKey": False},
                {"number": 9, "name": "ST Placeholder", "position": "ST", "isKey": False},
                {"number": 10, "name": "LW Placeholder", "position": "LW", "isKey": False},
                {"number": 11, "name": "Sub Placeholder", "position": "CAM", "isKey": False}
            ]
            return json.dumps(dev_lineup)
            
        return f"[DEV MODE] Realistic fallback for {endpoint_type}."

    # Cache check
    hash_input = f"{endpoint_type}|{cache_id}" if cache_id else f"{endpoint_type}|{user_message}"
    cache_key = hashlib.md5(hash_input.encode()).hexdigest()
    if cache_key in GRANITE_CACHE:
        return GRANITE_CACHE[cache_key]

    WATSONX_API_KEY = os.getenv("WATSONX_API_KEY")
    WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
    WATSONX_URL = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
    
    token = await get_iam_token(WATSONX_API_KEY)
    
    url = f"{WATSONX_URL}/ml/v1/text/chat?version=2023-05-29"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    instruction = ENDPOINT_INSTRUCTIONS.get(endpoint_type, "")
    system_prompt = f"{SYSTEM_PROMPT}\n\n{instruction}" if instruction else SYSTEM_PROMPT

    max_tokens = MAX_TOKENS_MAP.get(endpoint_type, 200)

    payload = {
        "model_id": "ibm/granite-4-h-small",
        "messages": [
            { "role": "system", "content": system_prompt },
            { "role": "user", "content": user_message }
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7,
        "project_id": WATSONX_PROJECT_ID
    }

    async with httpx.AsyncClient() as client:
        try:
            global REAL_CALLS_COUNT
            REAL_CALLS_COUNT += 1
            
            response = await client.post(url, headers=headers, json=payload, timeout=15.0)
            response.raise_for_status()
            data = response.json()
            result = data["choices"][0]["message"]["content"].strip()
            
            usage = data.get("usage", {})
            input_tokens = usage.get("prompt_tokens", len(user_message) // 4)
            output_tokens = usage.get("completion_tokens", len(result) // 4)
            total_tokens = usage.get("total_tokens", input_tokens + output_tokens)
            print(f"[GRANITE] {endpoint_type} — {input_tokens} in / {output_tokens} out / {total_tokens} total this session")
            
            GRANITE_CACHE[cache_key] = result
            return result
        except Exception as e:
            return f"IBM Granite Simulation: Failed to generate response. (Error: {str(e)})"

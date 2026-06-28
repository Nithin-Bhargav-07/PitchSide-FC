import json
import os

RULES_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "ifab_rules.json")

# Load rules into memory on startup
with open(RULES_FILE, "r") as f:
    IFAB_RULES = json.load(f)

def get_rule_for_event(event_type: str) -> str:
    """
    Returns the relevant law text for a given event type based on the RAG mapping rules.
    """
    event_type = event_type.upper()
    if event_type in ["RED_CARD", "YELLOW_CARD", "PENALTY"]:
        return IFAB_RULES.get("12", "")
    elif event_type == "VAR":
        return IFAB_RULES.get("12", "") + "\n\nVAR Protocol: The VAR may assist the referee only in the event of a 'clear and obvious error' or 'serious missed incident' in relation to: goal/no goal, penalty/no penalty, direct red card, or mistaken identity."
    elif event_type == "OFFSIDE":
        return IFAB_RULES.get("11", "")
    elif event_type == "SUBSTITUTION":
        return IFAB_RULES.get("3", "")
    elif event_type == "GOALKEEPER":
        return IFAB_RULES.get("1", "")
    
    return "No specific rule available for this event."

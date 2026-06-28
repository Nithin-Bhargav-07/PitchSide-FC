from fastapi import APIRouter
from services.rag_service import get_rule_for_event

router = APIRouter(prefix="/ifab", tags=["IFAB Laws"])

@router.get("/rule/{event_type}")
def get_rule(event_type: str):
    rule = get_rule_for_event(event_type)
    return {"event_type": event_type, "rule_text": rule}

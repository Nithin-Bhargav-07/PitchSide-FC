from fastapi import APIRouter
from services.football_service import get_matches_by_date, get_match_lineups, get_live_match, get_standings, get_match_details, get_match_stats, get_match_playerstats

router = APIRouter(tags=["Matches"])

@router.get("/matches")
async def list_matches(date: str):
    return await get_matches_by_date(date)

@router.get("/matches/{id}/lineup")
async def match_lineup(id: str):
    return await get_match_lineups(id)

@router.get("/matches/{id}/live")
async def match_live(id: str):
    return await get_live_match(id)

@router.get("/standings")
async def competition_standings(competition: str):
    return await get_standings(competition)

@router.get("/matches/{id}/details")
async def match_details(id: str):
    return await get_match_details(id)

@router.get("/matches/{id}/stats")
async def match_stats(id: str):
    return await get_match_stats(id)

@router.get("/matches/{id}/playerstats")
async def match_playerstats(id: str):
    return await get_match_playerstats(id)

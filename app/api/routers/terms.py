"""Term extraction over a chapter's canonical record."""

from typing import Any

from core.loader import load_records
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(tags=["terms"])


class ExtractRequest(BaseModel):
    chapter_id: str = Field(..., min_length=1, description="Knowledge node id")


def _score_term(raw: str) -> int:
    """Basic scoring: length and domain keywords bump relevance."""
    weight = 1
    candidates = ("rcp", "pcr", "desa", "abcde", "triaje")
    lowered = raw.lower()
    if any(marker in lowered for marker in candidates):
        weight += 2
    if len(raw) >= 12:
        weight += 1
    return weight


@router.post("/terms/extract")
def extract_terms(payload: ExtractRequest) -> dict[str, Any]:
    """Given a chapter_id, return scored terms from its tags and text."""
    records = load_records()
    record = next((r for r in records if r.get("id") == payload.chapter_id), None)
    if record is None:
        raise HTTPException(status_code=404, detail="chapter_id not found")

    raw_terms: set[str] = set()
    tags = record.get("tags") or []
    if isinstance(tags, list):
        raw_terms.update(str(t) for t in tags)

    text = str(record.get("text") or "")
    for line in text.splitlines():
        line = line.strip()
        if line.lower().startswith("tags:") or line.lower().startswith("block:"):
            continue
        for token in line.replace(",", " ").split():
            token = token.strip()
            if len(token) >= 3:
                raw_terms.add(token)

    scored = sorted(
        ({"term": term, "score": _score_term(term)} for term in raw_terms),
        key=lambda item: item["score"],
        reverse=True,
    )

    return {"chapter_id": payload.chapter_id, "total": len(scored), "terms": scored}

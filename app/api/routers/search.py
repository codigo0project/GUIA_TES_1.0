"""Full-text search over knowledge/index.jsonl with optional filters."""

from typing import Any

from core.loader import load_records
from fastapi import APIRouter, Query

router = APIRouter(tags=["search"])


def _matches(record: dict[str, Any], term: str) -> bool:
    haystack = " ".join(
        str(record.get(key) or "")
        for key in ("title", "summary", "text")
    ).lower()
    return term in haystack


@router.get("/search")
def search(
    q: str = Query("", min_length=0, max_length=200),
    filters_type: str | None = Query(None, alias="filters[type]"),
    filters_block: str | None = Query(None, alias="filters[block]"),
) -> dict[str, Any]:
    """Search canonical knowledge. Returns an envelope with results/total/query."""
    term = q.strip().lower()
    limit = 25

    results: list[dict[str, Any]] = []
    total = 0
    for record in load_records():
        if filters_type and record.get("type") != filters_type:
            continue
        if filters_block and record.get("block") != filters_block:
            continue
        if term and not _matches(record, term):
            continue
        total += 1
        if len(results) < limit:
            results.append(
                {
                    "id": record.get("id"),
                    "type": record.get("type"),
                    "title": record.get("title"),
                    "summary": record.get("summary"),
                    "block": record.get("block"),
                }
            )

    return {
        "query": q,
        "total": total,
        "results": results,
        "filters": {"type": filters_type, "block": filters_block},
    }

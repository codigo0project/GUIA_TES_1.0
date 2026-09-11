"""Read-only graph over knowledge/index.jsonl."""

from typing import Any

from core.loader import load_records
from fastapi import APIRouter

router = APIRouter(tags=["graph"])

RELATION_TYPES = ("related", "prerequisite", "see-also", "applies-to")


def build_graph() -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Return nodes and edges derived from canonical knowledge records."""
    nodes: list[dict[str, Any]] = []
    edges: list[dict[str, Any]] = []
    seen_edges: set[tuple[str, str, str]] = set()

    for record in load_records():
        nodes.append(
            {
                "id": record.get("id"),
                "type": record.get("type"),
                "title": record.get("title"),
                "block": record.get("block"),
            }
        )
        relations = record.get("relations") or []
        if isinstance(relations, list):
            for relation in relations:
                if not isinstance(relation, dict):
                    continue
                target = relation.get("to")
                rel_type = relation.get("type") or "related"
                if not isinstance(target, str) or not target:
                    continue
                key = (str(record.get("id")), target, rel_type)
                if key in seen_edges:
                    continue
                seen_edges.add(key)
                edges.append(
                    {
                        "id": f"{record.get('id')}--{target}",
                        "source": record.get("id"),
                        "target": target,
                        "type": rel_type if rel_type in RELATION_TYPES else "related",
                    }
                )

    return nodes, edges


@router.get("/graph")
def graph() -> dict[str, list[dict[str, Any]]]:
    """Return the knowledge graph nodes and edges (read-only)."""
    nodes, edges = build_graph()
    return {"nodes": nodes, "edges": edges, "total_nodes": len(nodes)}

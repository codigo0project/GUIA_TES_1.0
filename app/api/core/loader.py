"""Read-only loader over canonical knowledge/index.jsonl, merged with manual/ chapters."""

import hashlib
import json
import logging
import re
from pathlib import Path
from typing import Any

from core.config import settings

logger = logging.getLogger(__name__)

_MANUAL_ROOT = settings.knowledge_index.parent.parent / "manual"


def _is_chapter_manual_file(path: Path) -> bool:
    name = path.name
    if not re.match(r"^\d{2}\.\d{2} - ", name):
        return False
    skip_patterns = (
        "ESTADO_BLOQUE_",
        "estado_bloque_",
        "Plantilla",
        "Template",
        "README",
        "CHANGELOG",
    )
    if any(pattern in name for pattern in skip_patterns):
        return False
    if path.suffix.lower() != ".md":
        return False
    return True


def _load_frontmatter(text: str) -> dict[str, str]:
    match = re.match(r"^---\n(.*?)\n---\n?", text, re.S)
    if not match:
        return {}
    out: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        out[key.strip()] = value.strip().strip('"')
    return out


def _extract_sections(text: str) -> list[str]:
    return re.findall(r"^## \d+\.\s*(.+)", text, re.M)


def _extract_links(text: str) -> list[str]:
    return re.findall(r"\[\[([^\]]+)\]\]", text)


def _extract_summary(text: str) -> str:
    after = re.split(r"^---\n.*?\n---\n?", text, flags=re.S)
    if len(after) < 2:
        return ""
    body = after[1].strip()
    lines = body.splitlines()
    buffer: list[str] = []
    for line in lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith(">"):
            buffer.append(stripped.lstrip("> ").strip())
            continue
        break
    cleaned = [part for part in buffer if not re.match(r"^\[![\w-]+\]", part)]
    joined = " ".join(cleaned).strip()
    if len(joined) >= 40:
        return joined
    return ""


def _content_hash(text: str) -> str:
    stable = "\n".join(text.splitlines())
    return hashlib.sha256(stable.encode("utf-8")).hexdigest()


def _block_dir_for(manual_path: Path) -> str:
    rel = manual_path.relative_to(_MANUAL_ROOT)
    block = rel.parts[0]
    return re.sub(r"^\d+\s*-\s*", "", block).strip().lower().replace(" ", "-")


def _chapter_node_from_manual(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    meta = _load_frontmatter(text)
    base = path.stem
    chapter_match = re.match(r"^(\d+\.\d+(?:\.\d+)?)\s*-\s*(.+)$", base)
    chapter_code = chapter_match.group(1) if chapter_match else base
    chapter_slug = re.sub(r"[^\w\s-]", "", base, flags=re.UNICODE)
    chapter_slug = re.sub(r"\s+", "-", chapter_slug).strip("-").lower()
    chapter_id = f"{chapter_code}-{chapter_slug}"
    summary = meta.get("objetivo", "") or _extract_summary(text)
    body = re.split(r"^---\n.*?\n---\n?", text, flags=re.S)
    content = body[1].strip() if len(body) > 1 else ""
    return {
        "id": chapter_id,
        "type": "chapter",
        "version": "2026.08.01",
        "status": "published",
        "language": "es-ES",
        "title": meta.get("capitulo", base),
        "summary": summary,
        "tags": [t.strip() for t in re.findall(r"'([^']+)'", meta.get("tags", "[]")) if t.strip()],
        "block": path.parent.name,
        "duration_min": int(meta.get("duracion", "15").split()[0]) if meta.get("duracion") else 15,
        "priority": meta.get("prioridad", "Alta"),
        "sources": {
            "manual": str(path.relative_to(_MANUAL_ROOT.parent)),
            "pdf": None,
            "src_id": None,
            "evidence_hash": _content_hash(text),
        },
        "created_at": "2026-08-09T00:00:00+00:00",
        "updated_at": "2026-08-09T00:00:00+00:00",
        "reviewed_by": None,
        "relations": [
            {"to": re.sub(r"[^\w\s-]", "", l).strip().lower().replace(" ", "-"), "type": "related"}
            for l in _extract_links(text)
            if " - " in l and l != base
        ],
        "nodes": [],
        "sections": _extract_sections(text),
        "links": _extract_links(text),
        "content": content,
    }


def _load_manual_records() -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    if not _MANUAL_ROOT.exists():
        return records
    for path in sorted(_MANUAL_ROOT.rglob("*")):
        if not path.is_file():
            continue
        if not _is_chapter_manual_file(path):
            continue
        try:
            records.append(_chapter_node_from_manual(path))
        except Exception:
            logger.exception("failed to load manual chapter %s", path)
    return records


def load_records(path: Path | None = None, limit: int | None = None) -> list[dict[str, Any]]:
    """Load JSONL records merged with manual/ chapter files."""
    source = path or settings.knowledge_index
    records: list[dict[str, Any]] = []
    by_id: dict[str, dict[str, Any]] = {}

    with source.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            record = json.loads(line)
            by_id[record.get("id")] = record
            records.append(record)
            if limit is not None and len(records) >= limit:
                break

    manual_records = _load_manual_records()
    for manual in manual_records:
        mid = manual.get("id")
        if not mid:
            continue
        existing = by_id.get(mid)
        if existing is None:
            records.append(manual)
            by_id[mid] = manual
            continue
        merged = dict(existing)
        for key, value in manual.items():
            if key in {"id", "sources"}:
                continue
            if (merged.get(key) is None or merged.get(key) == "") and value:
                merged[key] = value
        if not (((merged.get("sources") or {}).get("manual")) if isinstance(merged.get("sources"), dict) else None):
            merged["sources"] = dict(((merged.get("sources") or {}) if isinstance(merged.get("sources"), dict) else {}))
            merged["sources"]["manual"] = (((manual.get("sources") or {}).get("manual")) if isinstance(manual.get("sources"), dict) else None)
        records = [merged if item.get("id") == mid else item for item in records]
        by_id[mid] = merged

    logger.info("loaded %s knowledge records from %s plus manual merge", len(records), source)
    return records

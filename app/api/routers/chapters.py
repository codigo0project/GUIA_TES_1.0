"""Read-only chapter (knowledge node) endpoints."""

import os
from typing import Any

from fastapi import APIRouter, HTTPException

from core.loader import load_records
from core.config import settings

router = APIRouter(tags=["chapters"])


@router.get("/chapters")
def list_chapters() -> dict[str, Any]:
    """List knowledge node ids and titles grouped by block (read-only)."""
    records = load_records()
    chapters = [
        {
            "id": record.get("id"),
            "type": record.get("type"),
            "title": record.get("title"),
            "block": record.get("block"),
        }
        for record in records
    ]
    return {"total": len(chapters), "chapters": chapters}


@router.get("/chapters/{chapter_id}")
def get_chapter(chapter_id: str) -> dict[str, Any]:
    """Return the full canonical record for a knowledge node by id."""
    record = next(
        (r for r in load_records() if r.get("id") == chapter_id),
        None,
    )
    if record is None:
        raise HTTPException(status_code=404, detail="chapter_id not found")
    
    # Si el registro tiene una fuente manual, leer el contenido markdown
    sources = record.get("sources", {})
    manual_path = sources.get("manual")
    if manual_path and isinstance(manual_path, str):
        try:
            # Importar settings localmente para evitar dependencias circulares
            from core.config import settings
            # Construir la ruta completa al archivo manual usando la ruta conocida del índice
            # manual_path ya es relativo a la raíz del proyecto (ej: "manual/02 - Soporte Vital/02.01 - Reconocimiento PCR.md")
            manual_file_path = settings.knowledge_index.parent.parent / manual_path
            with open(manual_file_path, 'r', encoding='utf-8') as f:
                record["content"] = f.read()
        except Exception as e:
            # Si hay cualquier error, registrarlo pero continuar
            record["content"] = f"Error loading content: {str(e)}"
    else:
        record["content"] = ""
    
    return record

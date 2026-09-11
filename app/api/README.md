# API Backend — Guía TES

## Estado actual
- `app/api/` está preparado para el backend FastAPI.
- Aún no hay scaffold activo; se mantiene como estructura reservada.

## Stack previsto
- FastAPI con endpoints:
  - `GET /health` — health check
  - `GET /search` — búsqueda híbrida BM25 + embeddings
  - `GET /graph` — grafo de conocimiento desde `knowledge/index.jsonl`
  - `POST /terms/extract` — extracción de términos por capítulo

## Principios
1. No modificar `manual/` ni `knowledge/` desde el backend.
2. Leer desde `knowledge/` y `manual/` como fuentes de solo lectura.
3. Mantener `app/api/` como capa de API, no como origen de verdad.

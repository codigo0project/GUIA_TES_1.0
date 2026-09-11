# Guía TES 2.0

Plataforma de consulta y aprendizaje para **Técnicos en Emergencias Sanitarias (TES)**.
Combina contenido editorial (Markdown), índice estructurado (JSONL), API FastAPI y frontend Next.js.

## Visión

Convertir el conocimiento clínico del TES en una herramienta práctica y accesible desde cualquier dispositivo:
**CONSULTAR → APRENDER → EVALUAR → ACTUAR → APOYARSE (IA)**

## Arquitectura

```
manual/ (MD + frontmatter, fuente de verdad)
    │
    ├─ sync_to_kb.py ──► knowledge/blocks/ (JSON por capítulo)
    │
    └─ build_kb_index.py ──► knowledge/index.jsonl (índice canónico)
            │
            ▼
    app/api/core/loader.py (combina index.jsonl + manual/ en runtime)
            │
    FastAPI (5 routers)
    ├─ GET /v1/chapters
    ├─ GET /v1/chapters/{id}
    ├─ GET /v1/search
    ├─ GET /v1/graph
    └─ GET /v1/terms
            │
            ▼
    app/web (Next.js 15)
    ├─ page.tsx (chapter default: 02.02-rcp-adulto)
    ├─ chapters/[id]/page.tsx
    └─ search/page.tsx
```

## Servicios (docker-compose)

| Servicio | Puerto | Descripción |
|---|---|---|
| `api` | 8000 | FastAPI + MongoDB + Ollama |
| `web` | 3000 | Next.js frontend |
| `search` | 3001 | Búsqueda semántica |
| `mongo` | 27017 | MongoDB |
| `ollama` | 11434 | Modelos de IA locales |

## Comandos rápidos

```bash
# Desarrollo
npm run dev          # frontend (app/web)
npm run api          # API (app/api)
npm run search       # búsqueda (app/search)

# Pipeline de contenido
python scripts/pipeline/ingestion/sync_to_kb.py              # manual/ → knowledge/blocks/
python scripts/pipeline/validation/build_kb_index.py          # knowledge/blocks/ → knowledge/index.jsonl
python scripts/pipeline/validation/validate_index.py          # validar index.jsonl
python scripts/pipeline/validation/quality_gate.py            # validación de calidad

# Construir
npm run build          # todos los workspaces
docker-compose up -d   # entorno completo
```

## Estructura de directorios

| Directorio | Propósito |
|---|---|
| `manual/` | Contenido editorial (MD + frontmatter). **Fuente de verdad.** |
| `knowledge/blocks/` | JSON por capítulo (generado por `sync_to_kb.py`) |
| `knowledge/index.jsonl` | Índice canónico (generado por `build_kb_index.py`) |
| `knowledge/mapping/` | Trazabilidad entre capítulos y fuentes |
| `knowledge/media/` | Catálogos de medios (145 `_catalog.json`) |
| `app/api/` | FastAPI (`core/loader.py`, `routers/`, `tests/`) |
| `app/web/` | Next.js 15 (`app/`, `lib/`, `styles/`) |
| `app/search/` | Búsqueda semántica |
| `base_datos/` | Datos de referencia (normativa, referencias, conceptos) |
| `galeria/` | Media manifest (164 entradas, todas `pending`) |
| `docs/` | Documentación del proyecto |

## Estado de los bloques

| Bloque | Capítulos | Estado |
|---|---|---|
| 01 - Fundamentos | 10 | Publicado |
| 02 - Soporte Vital | 13 | Publicado |
| 03 - Material | 7 | Publicado |
| 04 - Farmacología | 11 | Publicado |
| 05 - Médicas | 39 | Publicado |
| 06 - Trauma | 32 | Publicado |
| 07 - Pediatría | 30 | Publicado |
| 08 - Obstetricia | 6 | Publicado |
| 09 - Ambientales | 7 | Publicado |
| 10 - Toxicología | 7 | Publicado |
| 11 - IMV | 8 | Publicado |
| 12 - Psiquiatría | 5 | Publicado |
| 13 - Operativa | 17 | Publicado |
| 14 - Conducción Prioritaria | 4 | Publicado |
| 15 - Protocolos Transtelefónicos | 4 | Publicado |
| 16 - Transversales | 12 | Publicado |
| 17 - Gestión del Dolor | 10 | Por desarrollar |
| 18 - Telemedicina | 4 | Por desarrollar |
| 19 - Salud Pública | 4 | Por desarrollar |
| 20 - Emergencias por Contexto | 5 | Por desarrollar |
| 21 - Profesional y Organización | 5 | Por desarrollar |
| 22 - Transversales Avanzados | 4 | Por desarrollar |
| 23 - Protocolos Transtelefónicos | 4 | Por desarrollar |

## Pipeline de medios (pendiente)

- 140 capítulos con media planificado en `galeria/media_manifest.jsonl`
- 145 `_catalog.json` en `knowledge/media/`, 135 son placeholders vacíos
- 0 archivos de medio reales generados
- 7 con `download_url` (descarga directa pendiente)
- 145 con `ia_prompt` (generación por IA pendiente)

Ver diagnóstico completo: `docs/DIAGNOSTICO_MEDIOS.md`  
Ver especificación por capítulo: `docs/ESPECIFICACION_MEDIOS.md`  
Ver sistema replicable: `docs/SISTEMA.md`

## Documentación

- `docs/SISTEMA.md` — Sistema replicable (arquitectura, pipeline, comandos)
- `docs/DIAGNOSTICO_MEDIOS.md` — Diagnóstico de medios faltantes
- `docs/ESPECIFICACION_MEDIOS.md` — Especificación de medios por capítulo
- `docs/PIPELINE_REAL.md` — Pipeline real de contenido
- `ARBOL_ESTRUCTURA_COMPLETA.md` — Árbol de directorios completo

# Base de datos vectorial - TES

## Scripts
- `scripts/generate_embeddings.py` — genera el índice vectorial desde `base_datos/`
- `scripts/search_vectorial.py` — busca por similitud semántica en el índice

## Uso
```bash
python scripts/generate_embeddings.py
python scripts/search_vectorial.py "competencias del TES en teleemergencias" --top 5
```

## Estado
- Modelo por defecto: `nomic-embed-text`
- Modelo alternativo: `mxbai-embed-large`
- Índice: `base_datos/embeddings/index.jsonl`

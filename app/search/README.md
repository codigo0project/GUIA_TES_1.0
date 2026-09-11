# Search Frontend — Guía TES

## Estado actual
- `app/search/` está preparado para la interfaz de búsqueda.
- Aún no hay scaffold activo; se mantiene como estructura reservada.

## Stack previsto
- Componentes Next.js 15 + shadcn/ui v3
- Command palette (`Cmd+K`)
- Resultados con snippets, breadcrumbs y badges de tipo de nodo

## Principios
1. Consumir endpoints de `app/api/` sin tocar `knowledge/` directamente.
2. Mantener `manual/` como fuente de edición humana.
3. La búsqueda es una capa de presentación sobre `knowledge/index.jsonl`.

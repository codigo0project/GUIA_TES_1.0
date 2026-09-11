# Web Frontend — Guía TES

## Estado actual
- `app/web/` está preparado para el frontend Next.js.
- Aún no hay scaffold activo; se mantiene como estructura reservada.

## Stack previsto
- Next.js 15 App Router
- shadcn/ui v3 (Base UI)
- MDX 3 + Contentlayer
- Dark mode por defecto con CSS variables
- Layout: header 56px, sidebar 280px colapsable

## Principios
1. Consumir `manual/` y `knowledge/` como fuentes de contenido.
2. No modificar `manual/` para adaptarlo a la web.
3. Mantener el flujo híbrido: `manual/` editable, web como capa de presentación.

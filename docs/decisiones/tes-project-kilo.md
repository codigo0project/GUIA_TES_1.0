# Decisión: tes-project-kilo

**Fecha:** 2026-09-11
**Estado:** EXPERIMENTAL / ABANDONADO (como vía de producción activa)

## Contexto

`tes-project-kilo` (carpeta `guia_tes/tes_proyect/`) fue un prototipo de pipeline alternativo de contenido:
- Flujo YAML → Zod → JSON (vs el flujo actual `manual/` MD → `sync_to_kb.py` → `knowledge/blocks/`)
- Solo tiene **1 capítulo de ejemplo** (`02.02-rcp-adulto`) en YAML
- Tiene sus propios scripts de build/validate (`build.ts`, `validate.ts`) y schemas (`blocks.ts`)
- Es un workspace en `package.json`

## Diagnóstico (FASE 0.2)

El pipeline real de producción es:
```
manual/ (MD + frontmatter) → sync_to_kb.py → knowledge/blocks/ → build_kb_index.py → knowledge/index.jsonl → FastAPI loader → Next.js frontend
```

`tes-project-kilo` **no** es parte de este flujo. Su `build.ts` genera `app/public/data/` pero el frontend no consume de ahí (consume de FastAPI). Es un experimento paralelo sin adoptar.

## Decisión

**ABANDONADO como vía de producción.**

- No se consume en el flujo real de la aplicación.
- Solo tiene 1 capítulo de ejemplo (no es escalable).
- El pipeline actual (`manual/ → knowledge/blocks/`) es funcional y completo.

## Acciones

1. ✅ Documentado en `docs/decisiones/tes-project-kilo.md` (este archivo)
2. ✅ Eliminado de `package.json` workspaces (2026-09-11)
3. ✅ Añadido a `guia_tes/.gitignore` como `tes-project-kilo/` (2026-09-11)
4. ⏳ Mover contenido real a `guia_tes/_archive/tes-project-kilo-experimental/` si se desea preservar localmente
5. ⏳ Si se decide eliminar por completo, hacer `rm -rf guia_tes/tes_proyect/` (después de confirmar que no se necesita)

## Notas

- El pipeline YAML→Zod→JSON de `tes-project-kilo` podría ser una vía futura si se retoma, pero actualmente no hay plan para hacerlo.
- Si en el futuro se quiere unificar el pipeline de contenido, este prototipo contiene ideas útiles (especialmente `knowledge/schema/blocks.ts`).
- El directorio `guia_tes/_archive/tes-project-kilo-experimental/` existe pero está vacío; se puede usar para mover el contenido si se desea preservar.
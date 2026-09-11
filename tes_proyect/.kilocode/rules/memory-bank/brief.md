# Brief — Estado actual y tareas activas

## Sprint actual

**Goal:** Migrar el bloque piloto `02-soporte-vital/02.02-rcp-adulto` al nuevo formato estructurado y renderizarlo en la app.

## Tareas activas

### Knowledge Architect
- [ ] Definir schema Zod para tipos: chapter, procedure, drug, scale
- [ ] Migrar capítulo 02.02-rcp-adulto a YAML estructurado
- [ ] Crear fichas asociadas: drug-adrenalina, scale-glasgow
- [ ] Definir relaciones con capítulos vecinos

### Pipeline Engineer
- [ ] Implementar validate.ts (validación Zod + IDs únicos + relaciones)
- [ ] Implementar build.ts (YAML → JSON + assets)
- [ ] Integrar en package.json root como scripts npm

### Frontend Dev
- [ ] Crear componentes de bloques: EscalaColor, TablaComparativa, PasosNumerados
- [ ] Crear página de capítulo `[slug].astro`
- [ ] Implementar navegación por bloques
- [ ] Integrar Pagefind para búsqueda local

## Bloque siguiente en cola

`05-medicas/05.01-angina-iam-codigo-infarto` (más complejo, incluye protocolo, ECG, fármacos)

## Bloqueos actuales

Ninguno. Esperando definición de schema para empezar migración.

## Métricas objetivo

- Pipeline completo < 10 segundos para 144 capítulos
- Bundle de página < 100 KB de JS (Astro islas)
- Lighthouse score > 90 en móvil

# Context — TES Knowledge + App

## Propósito del proyecto

Manual clínico-operativo para Técnicos en Emergencias Sanitarias (TES) en España.
Cobertura completa del currículo oficial: 16 bloques, ~144 capítulos.

## Stack tecnológico

| Capa | Tecnología | Decisión |
|------|-----------|----------|
| Fuente de conocimiento | YAML estructurado + Zod | Datos limpios, validables, RAG-friendly |
| Pipeline | TypeScript + Node.js | Transforma YAML → JSON para app |
| Web | Astro + React (islas) | 0 JS por defecto, hidratación selectiva |
| Estilos | Tailwind CSS | Consistente, mantenible |
| Búsqueda | Pagefind (local) | Sin backend, funciona offline |
| RAG (futuro) | Qdrant + Rust (Axum) | Vectores para asistente IA |

## Decisiones arquitectónicas clave

### ¿Por qué YAML y no MDX?
MDX es código ejecutable (JSX). Un LLM generando contenido puede romper el build con JSX mal formado. YAML estructurado con schema rígido es imposible de romper visualmente: si falla la validación, no se mergea.

### ¿Por qué Astro y no Next.js?
El 90% del contenido es estático (texto, tablas, imágenes). Astro envía 0 JS por defecto. Next.js hidrata toda la página. Astro es más rápido para contenido mayormente de lectura.

### ¿Por qué no CMS headless (Sanity, Strapi)?
Overhead de infraestructura para un proyecto personal/paralelo. YAML en Git es más simple, versionable, y no requiere hosting. Se puede migrar a CMS más adelante si escala.

### ¿Por qué separar knowledge/ y app/?
Para que el contenido médico sobreviva a cambios de stack tecnológico. Si mañana cambiamos de Astro a SvelteKit, o de web a app móvil, knowledge/ no se toca.

### ¿Por qué Rust solo en backend de RAG?
La UI no necesita rendimiento bruto de Rust; necesita ecosistema de componentes. Rust sí tiene sentido en el backend de búsqueda vectorial (Qdrant ya está en Rust, Axum es nativo).

## Estructura de bloques (tipos de contenido)

Ver `knowledge/schema/blocks.ts` para la definición formal.
Tipos: chapter, procedure, protocol, drug, scale, case, reference, concept, media.

## Currículo TES (resumen)

| Bloque | Contenido |
|--------|-----------|
| 01 | Fundamentos: rol, competencias, seguridad, legislación |
| 02 | Soporte vital: RCP adulto/pediátrico, DEA, SVB |
| 03 | Trauma: hemorragias, fracturas, TCE, quemaduras |
| 04 | Médicas: IAM, ACV, crisis asmática, diabetes |
| 05 | Obstétrico/pediátrico: parto, reanimación neonatal |
| ... | ... |
| 16 | Transversales: ética, comunicación, gestión del estrés |

Fuente normativa: RD 1397/2007, RD 287/2023, Orden ESD/3391/2008.

## Convenciones de nomenclatura

- IDs: `{bloque}.{capitulo}.{slug}` → `02.02.rcp-adulto`
- Slugs: kebab-case, sin espacios, sin tildes
- Carpetas: `NN-bloque/NN.DD-slug/`
- Fechas: `YYYY.MM.DD` para versiones, ISO 8601 para `reviewed_at`

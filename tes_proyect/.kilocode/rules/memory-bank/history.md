# History — Decisiones arquitectónicas pasadas

## 2026-08-07 — Separación en 3 capas

**Decisión:** Dividir el proyecto en `.agents/` (instrucciones), `knowledge/` (datos), `app/` (código).
**Contexto:** El manual original estaba en Markdown suelto con Obsidian. No había taxonomía formal ni separación datos/código.
**Alternativas consideradas:**
- Monolito acoplado (CMS dentro de la app): descartado por falta de portabilidad
- Knowledge First puro (diseñar schema perfecto antes de tocar código): descartado por riesgo de parálisis por análisis
**Elegido:** Híbrido progresivo. Schema mínimo viable ahora, evoluciona con el proyecto.

## 2026-08-07 — Elección de Astro sobre Next.js

**Decisión:** Usar Astro como framework principal.
**Contexto:** El contenido es 90% estático. Next.js hidrata toda la página innecesariamente.
**Alternativas consideradas:**
- Next.js: descartado por overhead de JS
- SvelteKit: descartado por ecosistema de componentes médicos menos maduro
- SolidStart: descartado por comunidad pequeña
**Elegido:** Astro con React como islas sueltas para componentes interactivos.

## 2026-08-07 — YAML estructurado sobre MDX

**Decisión:** Usar YAML con schema Zod en vez de MDX libre.
**Contexto:** El contenido se genera en gran parte con LLM. MDX es código ejecutable; un LLM puede generar JSX roto.
**Alternativas consideradas:**
- MDX: descartado por riesgo de código roto y dificultad para RAG
- CMS headless (Sanity): descartado por overhead de infraestructura
- JSON puro: descartado por peor DX de escritura para humanos
**Elegido:** YAML para escritura humana/LLM, validado con Zod, transformado a JSON para consumo.

## 2026-08-07 — Kilo Code como entorno de agentes

**Decisión:** Usar Kilo Code (VS Code extension) en vez de prompts copiados en ChatGPT/Claude web.
**Contexto:** Kilo tiene Memory Bank, Skills on-demand, modelos por modo, y contexto persistente.
**Alternativas consideradas:**
- ChatGPT/Claude web: descartado por falta de memoria entre sesiones
- Cursor: viable, pero Kilo tiene mejor soporte para múltiples modelos y auto-approve granular
**Elegido:** Kilo Code con 3 custom agents: Knowledge Architect, Frontend Dev, Pipeline Engineer.

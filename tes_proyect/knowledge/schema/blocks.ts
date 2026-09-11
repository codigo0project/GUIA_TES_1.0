import { z } from "zod";

// ============================================================
// TES Knowledge Schema — Contrato A
// Este archivo define la forma exacta de todo contenido médico.
// Cualquier cambio aquí DEBE sincronizarse con:
//   app/src/lib/knowledge.ts (Contrato B)
// ============================================================

// ── Enums semánticos ─────────────────────────────────────────

export const StatusEnum = z.enum(["draft", "review", "published", "deprecated"]);
export const DifficultyEnum = z.enum(["basico", "intermedio", "avanzado"]);
export const RelationTypeEnum = z.enum(["prerequisite", "related", "see_also", "supersedes"]);
export const SeveridadEnum = z.enum(["critica", "alta", "media", "baja", "minima"]);
export const TipoContenidoEnum = z.enum([
  "chapter",
  "procedure",
  "protocol",
  "drug",
  "scale",
  "case",
  "reference",
  "concept",
]);

// ── Bloques de contenido (discriminated union) ───────────────

export const TextoBlockSchema = z.object({
  type: z.literal("texto"),
  content: z.string().min(1, "El contenido no puede estar vacío"),
});

export const EscalaColorBlockSchema = z.object({
  type: z.literal("escala-color"),
  titulo: z.string(),
  niveles: z.array(
    z.object({
      id: z.string(),
      severidad: SeveridadEnum,
      tiempo_max_min: z.number().nullable(),
      ejemplos: z.array(z.string()),
    })
  ).min(1, "La escala debe tener al menos un nivel"),
});

export const TablaComparativaBlockSchema = z.object({
  type: z.literal("tabla-comparativa"),
  titulo: z.string(),
  columnas: z.array(z.string()).min(2, "Mínimo 2 columnas"),
  filas: z.array(
    z.object({
      etiqueta: z.string(),
      valores: z.array(z.string()),
      highlight: SeveridadEnum.optional(),
    })
  ),
});

export const PasosNumeradosBlockSchema = z.object({
  type: z.literal("pasos-numerados"),
  titulo: z.string(),
  pasos: z.array(
    z.object({
      orden: z.number().int().positive(),
      accion: z.string().min(1),
      verificacion: z.string().optional(),
      errores_criticos: z.array(z.string()).optional(),
    })
  ).min(1),
});

export const FichaFarmacoBlockSchema = z.object({
  type: z.literal("ficha-farmaco"),
  farmaco_id: z.string(),
});

export const CasoClinicoBlockSchema = z.object({
  type: z.literal("caso-clinico"),
  caso_id: z.string(),
});

export const ChecklistBlockSchema = z.object({
  type: z.literal("checklist"),
  items: z.array(z.string()).min(1),
});

export const AlgoritmoBlockSchema = z.object({
  type: z.literal("algoritmo"),
  titulo: z.string(),
  pasos: z.array(
    z.object({
      orden: z.number().int().positive(),
      accion: z.string().min(1),
      decision: z.string().optional(),
      siguiente: z.string().optional(),
    })
  ).min(1),
});

export const BlockSchema = z.discriminatedUnion("type", [
  TextoBlockSchema,
  EscalaColorBlockSchema,
  TablaComparativaBlockSchema,
  PasosNumeradosBlockSchema,
  AlgoritmoBlockSchema,
  FichaFarmacoBlockSchema,
  CasoClinicoBlockSchema,
  ChecklistBlockSchema,
]);

// ── Frontmatter común (todos los tipos) ──────────────────────

export const FrontmatterSchema = z.object({
  id: z.string().regex(/^[0-9]{2}\.[0-9]{2}\.[a-z0-9-]+$/, "ID debe tener formato NN.NN.slug"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug debe ser kebab-case sin espacios"),
  type: TipoContenidoEnum,
  title: z.string().min(1),
  bloque: z.string(),
  capitulo: z.string().regex(/^[0-9]{2}\.[0-9]{2}$/, "Capítulo debe ser NN.NN"),
  status: StatusEnum,
  version: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/, "Versión debe ser YYYY.MM.DD"),
  reviewed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha debe ser ISO 8601"),
  authors: z.array(z.string()).min(1),
  order: z.number().int().positive(),
  duration_min: z.number().int().positive(),
  difficulty: DifficultyEnum,
  prerequisites: z.array(z.string()),
  learning_objectives: z.array(z.string()).min(1),
  tags: z.array(z.string()),
  relations: z.array(
    z.object({
      to: z.string(),
      type: RelationTypeEnum,
    })
  ),
  imagen_portada: z.string().optional(),
  fuentes: z.array(z.string()).min(1),
});

// ── Schemas específicos por tipo ─────────────────────────────

export const ChapterSchema = FrontmatterSchema.extend({
  type: z.literal("chapter"),
  blocks: z.array(BlockSchema).min(1, "Un capítulo debe tener al menos un bloque"),
});

export const ProcedureSchema = FrontmatterSchema.extend({
  type: z.literal("procedure"),
  objetivo: z.string(),
  indicaciones: z.array(z.string()),
  contraindicaciones: z.array(z.string()),
  materiales: z.array(z.string()),
  pasos: z.array(
    z.object({
      orden: z.number().int().positive(),
      accion: z.string(),
      verificacion: z.string().optional(),
      errores_criticos: z.array(z.string()).optional(),
    })
  ),
  complicaciones: z.array(z.string()).optional(),
});

export const DrugSchema = FrontmatterSchema.extend({
  type: z.literal("drug"),
  nombre_comercial: z.array(z.string()).optional(),
  presentacion: z.string(),
  dosis_adulto: z.string(),
  dosis_pediatrica: z.string().optional(),
  via_administracion: z.array(z.enum(["IV", "IO", "IM", "SC", "oral", "inhalada", "rectal", "topica"])),
  indicaciones: z.array(z.string()),
  contraindicaciones: z.array(z.string()),
  efectos_adversos: z.array(z.string()),
  precauciones: z.array(z.string()).optional(),
  antidoto: z.string().optional(),
  interacciones: z.array(z.string()).optional(),
});

export const ScaleSchema = FrontmatterSchema.extend({
  type: z.literal("scale"),
  proposito: z.string(),
  aplicacion: z.string(),
  puntuacion: z.array(
    z.object({
      criterio: z.string(),
      opciones: z.array(
        z.object({
          valor: z.union([z.string(), z.number()]),
          descripcion: z.string(),
        })
      ),
    })
  ),
  interpretacion: z.array(
    z.object({
      rango: z.string(),
      significado: z.string(),
      severidad: SeveridadEnum.optional(),
    })
  ),
  errores_comunes: z.array(z.string()).optional(),
});

export const CaseSchema = FrontmatterSchema.extend({
  type: z.literal("case"),
  escenario: z.string(),
  datos_paciente: z.object({
    edad: z.string(),
    sexo: z.enum(["M", "F"]),
    motivo_consulta: z.string(),
    antecedentes: z.array(z.string()).optional(),
  }),
  signos_vitales: z.record(z.string()).optional(),
  preguntas: z.array(
    z.object({
      id: z.string(),
      pregunta: z.string(),
      opciones: z.array(z.string()),
      respuesta_correcta: z.string(),
      explicacion: z.string(),
    })
  ),
  solucion_comentada: z.string(),
});

export const ReferenceSchema = FrontmatterSchema.extend({
  type: z.literal("reference"),
  tipo: z.enum(["legal", "bibliografica", "protocolo"]),
  numero: z.string().optional(),
  titulo_completo: z.string(),
  fecha_publicacion: z.string(),
  fecha_vigencia: z.string().optional(),
  enlace: z.string().url().optional(),
  extracto_relevante: z.string().optional(),
});

export const ConceptSchema = FrontmatterSchema.extend({
  type: z.literal("concept"),
  definicion: z.string(),
  sinonimos: z.array(z.string()).optional(),
  relacionados: z.array(z.string()).optional(),
});

// ── Union de todos los tipos de contenido ────────────────────

export const ContentSchema = z.discriminatedUnion("type", [
  ChapterSchema,
  ProcedureSchema,
  DrugSchema,
  ScaleSchema,
  CaseSchema,
  ReferenceSchema,
  ConceptSchema,
]);

// ── Catálogo de media ─────────────────────────────────────────

export const MediaCatalogSchema = z.record(
  z.object({
    chapter: z.string(),
    description: z.string(),
    license: z.enum(["original", "cc-by", "cc-by-sa", "public-domain", "unknown"]),
    width: z.number().int().optional(),
    height: z.number().int().optional(),
  })
);

// ── Tipos TypeScript exportados ─────────────────────────────

export type Status = z.infer<typeof StatusEnum>;
export type Difficulty = z.infer<typeof DifficultyEnum>;
export type RelationType = z.infer<typeof RelationTypeEnum>;
export type Severidad = z.infer<typeof SeveridadEnum>;
export type TipoContenido = z.infer<typeof TipoContenidoEnum>;
export type Block = z.infer<typeof BlockSchema>;
export type AlgoritmoBlock = z.infer<typeof AlgoritmoBlockSchema>;
export type Frontmatter = z.infer<typeof FrontmatterSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
export type Procedure = z.infer<typeof ProcedureSchema>;
export type Drug = z.infer<typeof DrugSchema>;
export type Scale = z.infer<typeof ScaleSchema>;
export type Case = z.infer<typeof CaseSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type Concept = z.infer<typeof ConceptSchema>;
export type Content = z.infer<typeof ContentSchema>;
export type MediaCatalog = z.infer<typeof MediaCatalogSchema>;

// ============================================================
// TES App Knowledge Interface — Contrato B
// Este archivo DEBE espejar knowledge/schema/blocks.ts (Contrato A)
// Cualquier cambio en el schema del lado de knowledge debe reflejarse aquí.
// ============================================================

export type Status = "draft" | "review" | "published" | "deprecated";
export type Difficulty = "basico" | "intermedio" | "avanzado";
export type RelationType = "prerequisite" | "related" | "see_also" | "supersedes";
export type Severidad = "critica" | "alta" | "media" | "baja" | "minima";
export type TipoContenido =
  | "chapter"
  | "procedure"
  | "protocol"
  | "drug"
  | "scale"
  | "case"
  | "reference"
  | "concept";

// ── Bloques ──────────────────────────────────────────────────

export interface TextoBlock {
  type: "texto";
  content: string;
}

export interface EscalaColorBlock {
  type: "escala-color";
  titulo: string;
  niveles: {
    id: string;
    severidad: Severidad;
    tiempo_max_min: number | null;
    ejemplos: string[];
  }[];
}

export interface TablaComparativaBlock {
  type: "tabla-comparativa";
  titulo: string;
  columnas: string[];
  filas: {
    etiqueta: string;
    valores: string[];
    highlight?: Severidad;
  }[];
}

export interface PasosNumeradosBlock {
  type: "pasos-numerados";
  titulo: string;
  pasos: {
    orden: number;
    accion: string;
    verificacion?: string;
    errores_criticos?: string[];
  }[];
}

export interface FichaFarmacoBlock {
  type: "ficha-farmaco";
  farmaco_id: string;
}

export interface CasoClinicoBlock {
  type: "caso-clinico";
  caso_id: string;
}

export interface ChecklistBlock {
  type: "checklist";
  items: string[];
}

export type Block =
  | TextoBlock
  | EscalaColorBlock
  | TablaComparativaBlock
  | PasosNumeradosBlock
  | FichaFarmacoBlock
  | CasoClinicoBlock
  | ChecklistBlock;

// ── Frontmatter ──────────────────────────────────────────────

export interface Relation {
  to: string;
  type: RelationType;
}

export interface Frontmatter {
  id: string;
  slug: string;
  type: TipoContenido;
  title: string;
  bloque: string;
  capitulo: string;
  status: Status;
  version: string;
  reviewed_at: string;
  authors: string[];
  order: number;
  duration_min: number;
  difficulty: Difficulty;
  prerequisites: string[];
  learning_objectives: string[];
  tags: string[];
  relations: Relation[];
  imagen_portada?: string;
  fuentes: string[];
}

// ── Tipos de contenido específicos ───────────────────────────

export interface Chapter extends Frontmatter {
  type: "chapter";
  blocks: Block[];
}

export interface Procedure extends Frontmatter {
  type: "procedure";
  objetivo: string;
  indicaciones: string[];
  contraindicaciones: string[];
  materiales: string[];
  pasos: {
    orden: number;
    accion: string;
    verificacion?: string;
    errores_criticos?: string[];
  }[];
  complicaciones?: string[];
}

export interface Drug extends Frontmatter {
  type: "drug";
  nombre_comercial?: string[];
  presentacion: string;
  dosis_adulto: string;
  dosis_pediatrica?: string;
  via_administracion: ("IV" | "IO" | "IM" | "SC" | "oral" | "inhalada" | "rectal" | "topica")[];
  indicaciones: string[];
  contraindicaciones: string[];
  efectos_adversos: string[];
  precauciones?: string[];
  antidoto?: string;
  interacciones?: string[];
}

export interface Scale extends Frontmatter {
  type: "scale";
  proposito: string;
  aplicacion: string;
  puntuacion: {
    criterio: string;
    opciones: {
      valor: string | number;
      descripcion: string;
    }[];
  }[];
  interpretacion: {
    rango: string;
    significado: string;
    severidad?: Severidad;
  }[];
  errores_comunes?: string[];
}

export interface Case extends Frontmatter {
  type: "case";
  escenario: string;
  datos_paciente: {
    edad: string;
    sexo: "M" | "F";
    motivo_consulta: string;
    antecedentes?: string[];
  };
  signos_vitales?: Record<string, string>;
  preguntas: {
    id: string;
    pregunta: string;
    opciones: string[];
    respuesta_correcta: string;
    explicacion: string;
  }[];
  solucion_comentada: string;
}

export interface Reference extends Frontmatter {
  type: "reference";
  tipo: "legal" | "bibliografica" | "protocolo";
  numero?: string;
  titulo_completo: string;
  fecha_publicacion: string;
  fecha_vigencia?: string;
  enlace?: string;
  extracto_relevante?: string;
}

export interface Concept extends Frontmatter {
  type: "concept";
  definicion: string;
  sinonimos?: string[];
  relacionados?: string[];
}

export type Content = Chapter | Procedure | Drug | Scale | Case | Reference | Concept;

// ── Índice global ────────────────────────────────────────────

export interface ChapterIndex {
  id: string;
  slug: string;
  title: string;
  bloque: string;
  capitulo: string;
  status: Status;
  difficulty: Difficulty;
  tags: string[];
  url_path: string;
}

export interface GlobalIndex {
  generated_at: string;
  total_chapters: number;
  chapters: ChapterIndex[];
}

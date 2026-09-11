export interface ChapterRelation {
  to: string;
  type: string;
}

export interface ChapterRecord {
  id: string;
  type: string;
  title: string;
  summary?: string;
  block?: string | null;
  status?: string;
  language?: string;
  tags?: string[];
  relations?: ChapterRelation[];
  source?: string | null;
  sources?: Record<string, unknown>;
  sections?: string[];
  links?: string[];
  nodes?: unknown[];
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Fetch a single knowledge node by id (read-only, always fresh). */
export async function getChapter(id: string): Promise<ChapterRecord> {
  const response = await fetch(
    `${API_BASE}/v1/chapters/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError(404, `Capítulo no encontrado: ${id}`);
    }
    throw new ApiError(
      response.status,
      `HTTP ${response.status} desde ${API_BASE}`,
    );
  }
  return (await response.json()) as ChapterRecord;
}

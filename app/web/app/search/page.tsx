"use client";

import { useEffect, useRef, useState } from "react";

import CommandPalette from "../../../search/components/CommandPalette";
import SearchResults, {
  type SearchResultItem,
} from "../../../search/components/SearchResults";
import Breadcrumb from "../../components/ui/breadcrumb";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const DEBOUNCE_MS = 300;

interface ApiRecord {
  id: string;
  type: string;
  title: string;
  summary?: string;
  block?: string | null;
}

function mapRecord(record: ApiRecord): SearchResultItem {
  return {
    id: record.id,
    title: record.title,
    type: record.type,
    block: record.block ?? null,
    breadcrumb: [record.block, record.id].filter(Boolean).map(String),
    highlight: record.summary || record.title,
    score: 3,
  };
}

interface SearchPageState {
  items: readonly SearchResultItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

async function searchTerm(term: string, signal: AbortSignal, onResult: (result: SearchPageState) => void) {
  onResult((previous) => ({ ...previous, loading: true, error: null }));
  try {
    const response = await fetch(
      `${API_BASE}/v1/search?q=${encodeURIComponent(term)}`,
      { signal },
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data: { total: number; results?: ApiRecord[] } = await response.json();
    onResult({
      items: (data.results ?? []).map(mapRecord),
      total: data.total ?? 0,
      loading: false,
      error: null,
    });
  } catch (error) {
    if (signal.aborted) {
      return;
    }
    onResult({
      items: [],
      total: 0,
      loading: false,
      error: error instanceof Error ? error.message : "Error de red",
    });
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<SearchPageState>({
    items: [],
    total: 0,
    loading: false,
    error: null,
  });
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const term = query.trim();
    controllerRef.current?.abort();

    if (term.length === 0) {
      setState({ items: [], total: 0, loading: false, error: null });
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const timer = setTimeout(() => {
      void searchTerm(term, controller.signal, setState);
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const retry = () => {
    const term = query.trim();
    controllerRef.current?.abort();
    if (term.length === 0) {
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    void searchTerm(term, controller.signal, setState);
  };

  return (
    <div className="search-page">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Búsqueda" }]} />
      <div className="search-page__head">
        <h1>Búsqueda</h1>
        <p>
          Escribe para buscar en la Guía TES o pulsa{" "}
          <kbd>Cmd</kbd>+<kbd>K</kbd> para abrir la paleta de comandos.
        </p>
      </div>

      <input
        className="search-page__input"
        autoFocus
        placeholder="Buscar en la Guía TES…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {state.loading ? (
        <p className="search-page__total">Buscando…</p>
      ) : query.trim().length > 0 ? (
        <p className="search-page__total">{state.total} resultado(s)</p>
      ) : null}

      {state.error ? (
        <div className="sr-empty">
          <p>
            No se pudo conectar con el servicio de búsqueda. Reintentá para
            continuar.
          </p>
          <button
            type="button"
            className="ui-btn ui-btn--primary"
            onClick={retry}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <SearchResults results={state.items} query={query} />
      )}

      <CommandPalette items={state.items} />
    </div>
  );
}

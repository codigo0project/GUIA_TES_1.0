"use client";

import { useEffect, useMemo, useState } from "react";

import SearchResults, { type SearchResultItem } from "./SearchResults";

export interface CommandPaletteProps {
  items?: readonly SearchResultItem[];
}

const DEFAULT_ITEMS: readonly SearchResultItem[] = [
  {
    id: "02.02-rcp-adulto",
    title: "02.02 — RCP Adulto",
    type: "chapter",
    block: "02 - Soporte Vital",
    breadcrumb: ["Bloque 02 - Soporte Vital", "02.02 - RCP Adulto"],
    highlight: "Secuencia de compresiones torácicas, ventilaciones y DESA.",
    score: 4.5,
  },
  {
    id: "02.04-desa",
    title: "02.04 — DESA",
    type: "chapter",
    block: "02 - Soporte Vital",
    breadcrumb: ["Bloque 02 - Soporte Vital", "02.04 - DESA"],
    highlight: "Uso del desfibrilador externo semiautomático.",
    score: 3.8,
  },
  {
    id: "02.02-algoritmo-erc",
    title: "Algoritmo ERC 2025",
    type: "algorithm",
    block: "02 - Soporte Vital",
    breadcrumb: ["Bloque 02 - Soporte Vital", "Algoritmos"],
    highlight: "Flujo estructurado desde reconocimiento de PCR.",
    score: 3.1,
  },
];

function filterItems(
  items: readonly SearchResultItem[],
  query: string,
): SearchResultItem[] {
  const term = query.trim().toLowerCase();
  if (term.length === 0) {
    return items.slice(0, 8);
  }
  return items.filter((item) =>
    [item.title, item.highlight, item.breadcrumb.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(term),
  );
}

/** Groups filtered results by node type to render sectioned output. */
function groupByType(results: readonly SearchResultItem[]): Map<string, SearchResultItem[]> {
  const groups = new Map<string, SearchResultItem[]>();
  for (const item of results) {
    const list = groups.get(item.type) ?? [];
    list.push(item);
    groups.set(item.type, list);
  }
  return groups;
}

/**
 * Command palette triggered with Cmd+K / Ctrl+K. Supports input filtering and
 * renders sectioned results via SearchResults.
 */
export default function CommandPalette({ items = DEFAULT_ITEMS }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => filterItems(items, query), [items, query]);
  const sections = useMemo(() => groupByType(filtered), [filtered]);

  if (!open) {
    return null;
  }

  return (
    <div className="cp-overlay" onClick={() => setOpen(false)}>
      <div
        className="cp-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          className="cp-input"
          autoFocus
          placeholder="Buscar en la Guía TES…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="cp-body">
          {sections.size === 0 ? (
            <p className="cp-empty">Sin coincidencias.</p>
          ) : (
            Array.from(sections.entries()).map(([type, results]) => (
              <section key={type} className="cp-section">
                <h5 className="cp-section__title">{type}</h5>
                <SearchResults results={results} query={query} />
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

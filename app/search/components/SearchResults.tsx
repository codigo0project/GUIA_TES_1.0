import type { ReactNode } from "react";

export interface SearchResultItem {
  id: string;
  title: string;
  type: string;
  block?: string | null;
  breadcrumb: string[];
  highlight: string;
  score: number;
}

export interface SearchResultsProps {
  results: readonly SearchResultItem[];
  query: string;
}

/** Wraps the first match of `query` inside `text` in a <mark>. */
export function highlightText(text: string, query: string): ReactNode {
  const clean = query.trim();
  if (clean.length === 0) {
    return text;
  }
  const index = text.toLowerCase().indexOf(clean.toLowerCase());
  if (index === -1) {
    return text;
  }
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + clean.length)}</mark>
      {text.slice(index + clean.length)}
    </>
  );
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (results.length === 0) {
    return <p className="sr-empty">Sin resultados para «{query}».</p>;
  }

  return (
    <ul className="sr-list">
      {results.map((item) => (
        <li key={item.id} className="sr-item">
          <div className="sr-item__head">
            <h4 className="sr-item__title">{highlightText(item.title, query)}</h4>
            <span className="sr-badge sr-badge--score">
              {item.score.toFixed(1)}
            </span>
          </div>
          <p className="sr-item__crumb">{item.breadcrumb.join(" / ")}</p>
          <p className="sr-item__highlight">
            {highlightText(item.highlight, query)}
          </p>
          <div className="sr-item__badges">
            <span className="sr-badge sr-badge--type">{item.type}</span>
            {item.block ? <span className="sr-badge">{item.block}</span> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

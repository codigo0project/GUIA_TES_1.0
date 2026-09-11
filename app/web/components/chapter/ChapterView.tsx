import type { ChapterRecord } from "../../lib/api";
import Badge from "../ui/badge";
import Breadcrumb from "../ui/breadcrumb";
import { marked } from "marked";

export interface ChapterViewProps {
  chapter: ChapterRecord;
}

// Función para convertir enlaces tipo wikilink [[texto|destino]] o [[destino]]
// en enlaces estándar de markdown [texto](/ruta) que marked pueda procesar
function processWikiLinks(markdown: string): string {
  // Patrón para capturar [[texto|destino]] o [[destino]]
  // Grupo 1: texto opcional (antes del |)
  // Grupo 2: destino (obligatorio)
  const wikiLinkPattern = /\[\[([^|\]]+)?\|?([^\]]+)\]\]/g;
  
  return markdown.replace(wikiLinkPattern, (match, p1, p2) => {
    // Si no hay texto antes del |, usar el destino como texto
    const linkText = p1 ? p1.trim() : p2.trim();
    const linkTarget = p2.trim();
    
    // Convertir el destino a una ruta de capítulo
    // Asumimos que el destino es algo como "02.02 - RCP Adulto" 
    // y necesitamos convertirlo a un ID como "02.02-algoritmo-erc"
    // Para ahora, vamos a hacer una conversión simple: 
    // reemplazar espacios por guiones, quitar puntos especiales, etc.
    // En una implementación real, haríamos un lookup en un mapa de título→ID
    
    // Conversión básica para prototipo:
    let path = linkTarget
      .toLowerCase()
      .replace(/[^\w\s\-\.]/g, '')      // quitar caracteres no alfanuméricos, espacios, guiones o puntos
      .replace(/\s+/g, '-')          // reemplazar espacios por guiones
      .replace(/^-+|-+$/g, '');      // quitar guiones al inicio y final
    
    // Asegurarnos de que no esté vacío
    if (!path || path === '-') {
      path = 'unknown';
    }
    
    // Devolver un enlace de markdown estándar
    return `[${linkText}]/chapters/${path}`;
  });
}

function MarkdownContent({ value }: { value: string }) {
  if (!value) return null;
  
  // Procesar enlaces tipo wikilink antes de pasar a marked
  const processedMarkdown = processWikiLinks(value);
  
  // Usar marked para convertir markdown a HTML
  const html = marked(processedMarkdown);
  
  // Devolver el HTML como elemento React usando dangerouslySetInnerHTML
  // NOTA: En una app de producción, deberíamos sanitizar este HTML
  // Pero para ahora, asumimos que el contenido es confiable (viene de nuestros propios archivos manual/)
  return <div 
    className="chapter__markdown" 
    dangerouslySetInnerHTML={{ __html: html }} 
  />;
}

export default function ChapterView({ chapter }: ChapterViewProps) {
  const body = chapter.summary ? [chapter.summary] : [];
  const sections = chapter.sections ?? [];
  const links = chapter.links ?? [];

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    ...(chapter.block ? [{ label: chapter.block }] : []),
    { label: chapter.title },
  ];

  return (
    <div className="chapter">
      <Breadcrumb items={breadcrumbItems} />
      <div className="chapter__head">
        <div className="chapter__badges">
          {chapter.block ? <Badge tone="accent">{chapter.block}</Badge> : null}
          <Badge>{chapter.type}</Badge>
          {chapter.status ? (
            <Badge tone="success">{chapter.status}</Badge>
          ) : null}
        </div>
        <h1 className="chapter__title">{chapter.title}</h1>
        {sections.length > 0 ? (
          <p className="chapter__summary">
            {sections.length} sección(es): {sections.join(" · ")}
          </p>
        ) : null}
        <p className="chapter__meta">
          ID: <code>{chapter.id}</code>
          {chapter.language ? ` · Idioma: ${chapter.language}` : ""}
        </p>
      </div>

      <article className="chapter__body">
        {body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        {chapter.content ? <MarkdownContent value={chapter.content} /> : null}
        {sections.length === 0 && body.length === 0 ? (
          <p>No hay contenido disponible para este capítulo.</p>
        ) : null}
      </article>

      {links.length > 0 ? (
        <nav className="chapter__links" aria-label="Contenido relacionado">
          <h2 className="chapter__links-title">Contenido relacionado</h2>
          <ul className="chapter__links-list">
            {links.map((item) => (
              <li key={item} className="chapter__link-item">
                {item}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {chapter.tags && chapter.tags.length > 0 ? (
        <footer className="chapter__tags">
          <h2 className="chapter__tags-title">Etiquetas</h2>
          <div className="chapter__tags-list">
            {chapter.tags.map((tag) => (
              <span key={tag} className="chapter__tag">
                {tag}
              </span>
            ))}
          </div>
        </footer>
      ) : null}
    </div>
  );
}
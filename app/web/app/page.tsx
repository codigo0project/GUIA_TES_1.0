import { getChapter } from "../lib/api";
import ChapterView from "../components/chapter/ChapterView";
import Breadcrumb from "../components/ui/breadcrumb";

export const dynamic = "force-dynamic";

const DEFAULT_CHAPTER_ID = "02.02-rcp-adulto";

export default async function HomePage() {
  let chapter;
  let loadError = false;
  try {
    chapter = await getChapter(DEFAULT_CHAPTER_ID);
  } catch {
    chapter = null;
    loadError = true;
  }

  if (!chapter) {
    return (
      <div className="chapter">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }]} />
        <h1 className="chapter__title">Guía TES</h1>
        <p className="chapter__summary">
          {loadError
            ? "No se pudo cargar el capítulo de ejemplo. La guía necesita conexión con el servicio de contenidos."
            : "No hay contenido disponible en este momento."}
        </p>
        {loadError ? (
          <div className="chapter__actions">
            <form action="/" method="GET">
              <button type="submit" className="ui-btn ui-btn--primary">
                Reintentar
              </button>
            </form>
            <a className="ui-btn ui-btn--ghost" href="/chapters">
              Ver capítulos
            </a>
          </div>
        ) : null}
      </div>
    );
  }

  return <ChapterView chapter={chapter} />;
}

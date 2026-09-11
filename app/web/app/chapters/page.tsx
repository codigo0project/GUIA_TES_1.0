import Link from "next/link";
import { getChapter } from "../../lib/api";
import Breadcrumb from "../../components/ui/breadcrumb";

export const dynamic = "force-dynamic";

export default async function ChaptersPage() {
  const ids = [
    "02.02-rcp-adulto",
    "02.04-desa",
    "02.05-via-aerea-basica",
    "04.04-adrenalina",
    "05.01-angina-iam",
    "06.02-shock-hemorragico",
  ];

  const chapters = await Promise.all(
    ids.map(async (id) => {
      try {
        return await getChapter(id);
      } catch {
        return { id, title: id, type: "unknown", block: null } as const;
      }
    }),
  );

  return (
    <div className="chapter">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Capítulos" }]} />
      <h1 className="chapter__title">Capítulos</h1>
      <p className="chapter__summary">
        Exploración rápida del contenido disponible en la Guía TES.
      </p>
      <div className="chapter-grid">
        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/chapters/${encodeURIComponent(chapter.id)}`}
            className="ui-card chapter-card"
          >
            <div className="chapter-card__head">
              <span className="ui-badge">{chapter.type}</span>
              {chapter.block ? (
                <span className="ui-badge ui-badge--accent">{chapter.block}</span>
              ) : null}
            </div>
            <h2 className="chapter-card__title">{chapter.title}</h2>
            <span className="ui-btn ui-btn--ghost chapter-card__cta">
              Abrir capítulo
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

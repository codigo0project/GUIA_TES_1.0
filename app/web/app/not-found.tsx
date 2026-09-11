import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="chapter">
      <h1 className="chapter__title">Capítulo no encontrado</h1>
      <p className="chapter__summary">
        El capítulo solicitado no existe o no está disponible en este momento.
      </p>
      <div className="chapter__actions">
        <Link className="ui-btn ui-btn--primary" href="/">
          Volver al inicio
        </Link>
        <Link className="ui-btn ui-btn--ghost" href="/chapters">
          Ver capítulos
        </Link>
        <Link className="ui-btn ui-btn--ghost" href="/search">
          Buscar
        </Link>
      </div>
    </div>
  );
}

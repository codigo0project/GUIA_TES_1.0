"use client";

import Header from "../components/layout/Header";
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Header title="No encontrado" />
        <main className="app-content">
          <div className="chapter">
            <h1 className="chapter__title">Página no encontrada</h1>
            <p className="chapter__summary">
              La ruta solicitada no existe dentro de Guía TES.
            </p>
            <div className="chapter__actions">
              <Link className="ui-btn ui-btn--primary" href="/">
                Ir al inicio
              </Link>
              <Link className="ui-btn ui-btn--ghost" href="/chapters">
                Ver capítulos
              </Link>
              <Link className="ui-btn ui-btn--ghost" href="/search">
                Buscar
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { cssVars } from "../styles/tokens";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Guía TES",
  description: "Manual del Técnico en Emergencias Sanitarias",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Apply design tokens to :root from tokens.ts */}
        <style>{cssVars()}</style>
      </head>
      <body>
        <div className="app-shell">
          <Header />
          <div className="app-body">
            <Sidebar />
            <main className="app-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

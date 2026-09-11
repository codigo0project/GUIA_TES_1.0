import type { CSSProperties } from "react";

export interface HeaderProps {
  /** Page-level title rendered in the header bar. */
  title?: string;
}

const headerStyle: CSSProperties = {
  position: "sticky",
  top: 0,
  height: "var(--header-height)",
  background: "var(--background)",
  borderBottom: "1px solid var(--border)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 20px",
  zIndex: 30,
};

/**
 * Sticky header fixed at 56px with the dark background token.
 */
export default function Header({ title = "Guía TES" }: HeaderProps) {
  return (
    <header className="site-header" style={headerStyle}>
      <span className="site-header__title">{title}</span>
      <span className="site-header__subtitle">
        Manual del Técnico en Emergencias Sanitarias
      </span>
    </header>
  );
}

"use client";

import { useState } from "react";

export interface SidebarItem {
  label: string;
  slug: string;
  icon?: string;
}

export interface SidebarProps {
  items?: readonly SidebarItem[];
  activeSlug?: string;
}

const DEFAULT_ITEMS: readonly SidebarItem[] = [
  { label: "Introducción", slug: "01-introduccion", icon: "•" },
  { label: "Soporte Vital", slug: "02-soporte-vital", icon: "•" },
  { label: "Soporte Psicológico", slug: "03-soporte-psicologico", icon: "•" },
  { label: "Procedimientos", slug: "04-procedimientos", icon: "•" },
  { label: "Anatomía y Fisiología", slug: "05-anatomia-fisiologia", icon: "•" },
];

/**
 * Sticky sidebar that collapses from 280px to 64px and reveals its labels
 * again on hover.
 */
export default function Sidebar({
  items = DEFAULT_ITEMS,
  activeSlug,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      aria-label="Navegación del manual"
    >
      <div className="sidebar__head">
        <span className="sidebar__head-title">Bloques</span>
        <button
          type="button"
          className="sidebar__toggle"
          aria-label={collapsed ? "Expandir navegación" : "Colapsar navegación"}
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="sidebar__nav">
        {items.map((item) => (
          <div
            key={item.slug}
            className={`sidebar__item ${
              activeSlug === item.slug ? "sidebar__item--active" : ""
            }`}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar__item-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="sidebar__item-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

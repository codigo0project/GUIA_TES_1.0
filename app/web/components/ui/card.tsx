import type { ReactNode } from "react";

export interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Surface container using the `--surface` token and shared radius.
 */
export default function Card({ title, children, className }: CardProps) {
  return (
    <section className={`ui-card ${className ?? ""}`.trim()}>
      {title ? <h3 className="ui-card__title">{title}</h3> : null}
      {children}
    </section>
  );
}

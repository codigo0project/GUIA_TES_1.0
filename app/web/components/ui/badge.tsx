export type BadgeTone = "default" | "accent" | "success";

export interface BadgeProps {
  children: string;
  tone?: BadgeTone;
}

/**
 * Small pill label used for node types, blocks and status hints.
 */
export default function Badge({ children, tone = "default" }: BadgeProps) {
  const className =
    tone === "accent"
      ? "ui-badge ui-badge--accent"
      : tone === "success"
        ? "ui-badge ui-badge--success"
        : "ui-badge";

  return <span className={className}>{children}</span>;
}

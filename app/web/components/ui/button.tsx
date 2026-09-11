import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: "default" | "primary" | "ghost";
  children: ReactNode;
}

/**
 * Basic button component using the design tokens.
 */
export default function Button({
  variant = "default",
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    "ui-btn",
    variant === "primary" && "ui-btn--primary",
    variant === "ghost" && "ui-btn--ghost",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export interface SheetSideProps {
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange?.(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={() => onOpenChange?.(false)}
      />
      {children}
    </div>
  );
}

export function SheetSide({
  side = "right",
  children,
  className,
}: SheetSideProps) {
  const baseClasses = "fixed z-50 bg-popover text-popover-foreground shadow-lg animate-in duration-200";
  const sideClasses: Record<string, string> = {
    right:
      "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l slide-in-from-right",
    left:
      "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r slide-in-from-left",
    top: "inset-x-0 top-0 border-b slide-in-from-top",
    bottom: "inset-x-0 bottom-0 border-t slide-in-from-bottom",
  };

  return (
    <div
      className={cn(
        baseClasses,
        sideClasses[side],
        className
      )}
    >
      {children}
    </div>
  );
}

export function SheetClose({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-4 border-b", className)}
      {...props}
    />
  );
}

export function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-4 border-t mt-auto",
        className
      )}
      {...props}
    />
  );
}

export const SheetTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);

export const SheetDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-muted-foreground mt-1", className)}
    {...props}
  />
);
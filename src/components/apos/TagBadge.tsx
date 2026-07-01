import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function TagBadge({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function AccentTag({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm bg-accent/10 px-1.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function GoldTag({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm bg-gold/10 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-gold",
        className,
      )}
    >
      {children}
    </span>
  );
}

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number | string;
  hint?: string;
  className?: string;
  variant?: "default" | "highlight";
}

export function MetricCard({ label, value, hint, className, variant = "default" }: Props) {
  const isNumber = typeof value === "number" && Number.isFinite(value);
  const [display, setDisplay] = useState<number>(isNumber ? 0 : 0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isNumber) return;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            const target = value as number;
            const start = performance.now();
            const dur = 900;
            const step = (t: number) => {
              const p = Math.min(1, (t - start) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(Math.round(target * eased));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.3 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [value, isNumber]);

  return (
    <div
      ref={ref}
      className={cn(
        "card-surface card-lift p-5 md:p-6 flex flex-col gap-2",
        variant === "highlight" && "border-accent/40 bg-accent/[0.03]",
        className,
      )}
    >
      <span className="eyebrow">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="display-title text-4xl md:text-5xl text-primary tabular-nums">
          {isNumber ? display : value}
        </span>
        {hint && <span className="text-xs text-muted-foreground mono">{hint}</span>}
      </div>
    </div>
  );
}

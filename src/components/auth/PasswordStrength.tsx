import { Check, X } from "lucide-react";
import { passwordChecks } from "@/lib/auth/schemas";

interface Props {
  value: string;
}

const items = [
  { key: "length" as const, label: "12+ caracteres" },
  { key: "lower" as const, label: "Letra minúscula" },
  { key: "upper" as const, label: "Letra maiúscula" },
  { key: "number" as const, label: "Número" },
  { key: "symbol" as const, label: "Símbolo" },
];

export function PasswordStrength({ value }: Props) {
  const checks = passwordChecks(value);
  const score = Object.values(checks).filter(Boolean).length;
  const pct = (score / items.length) * 100;
  const color =
    score <= 2 ? "bg-destructive" : score <= 3 ? "bg-yellow-500" : score <= 4 ? "bg-primary/70" : "bg-primary";

  return (
    <div className="space-y-2">
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
        {items.map((it) => {
          const ok = checks[it.key];
          return (
            <li
              key={it.key}
              className={`inline-flex items-center gap-1.5 ${ok ? "text-primary" : "text-muted-foreground"}`}
            >
              {ok ? <Check size={12} /> : <X size={12} />}
              {it.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

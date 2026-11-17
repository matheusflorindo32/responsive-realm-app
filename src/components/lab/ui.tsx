/**
 * Peças de interface compartilhadas pelos experimentos do laboratório.
 * Mantêm os experimentos visualmente consistentes e curtos de escrever.
 */
import type { ReactNode } from "react";

export const pct = (v: number, d = 0) => `${(v * 100).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d })}%`;
export const num = (v: number, d = 2) => v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

const ring = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export const btn = `inline-flex items-center justify-center gap-2 rounded-[8px] border border-border bg-white px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50 ${ring}`;
export const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-[8px] border border-primary bg-primary px-3 py-2 text-[13px] font-semibold text-white transition-[filter] hover:brightness-110 disabled:opacity-50 ${ring}`;

export const eyebrow = "mono text-[11px] font-medium uppercase tracking-[0.22em] text-primary";

export function Panel({ title, id, children, live = false }: { title: string; id: string; children: ReactNode; live?: boolean }) {
  return (
    <section aria-labelledby={id} aria-live={live ? "polite" : undefined} className="rounded-[12px] border border-border bg-white p-5">
      <h2 id={id} className={eyebrow}>
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function Range({
  label,
  display,
  hint,
  ...input
}: { label: string; display: string; hint?: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const { onChange, ...rest } = input;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3 text-[13px] font-semibold text-foreground">
        {label} <span className="mono tabular-nums text-primary">{display}</span>
      </span>
      <input type="range" {...rest} onChange={(e) => onChange(+e.target.value)} className="mt-2 w-full accent-[hsl(221,83%,53%)]" />
      {hint && <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  columns,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  columns?: number;
}) {
  return (
    <fieldset>
      <legend className="text-[13px] font-semibold text-foreground">{label}</legend>
      <div className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))` }} role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={value === o.id}
            onClick={() => onChange(o.id)}
            className={`rounded-[8px] border px-2 py-2 text-[13px] font-medium transition-colors ${ring} ${
              value === o.id ? "border-primary bg-primary text-white" : "border-border bg-white text-foreground hover:border-primary/40"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border-t border-border pt-3">
      <dt className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</dd>
      {hint && <dd className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">{hint}</dd>}
    </div>
  );
}

/** Selo padrão: deixa claro, dentro do próprio gráfico, que os dados são simulados. */
export function SimBadge({ children = "Dados simulados" }: { children?: ReactNode }) {
  return (
    <p className="inline-block rounded-[6px] border border-[hsl(38,70%,45%)]/40 bg-[hsl(38,90%,96%)] px-2.5 py-1 mono text-[10px] uppercase tracking-[0.18em] text-[hsl(32,80%,30%)]">
      {children}
    </p>
  );
}

export type LabRef = { cite: string; href: string; why: string };

/** Bloco final de todo experimento: explicação, limites e referências. */
export function Notes({ explain, limits, refs }: { explain: { t: string; body: ReactNode }[]; limits: ReactNode[]; refs: LabRef[] }) {
  return (
    <div className="space-y-12">
      <section aria-label="Explicação" className="rounded-[12px] bg-[hsl(222_47%_7%)] px-6 py-10 text-slate-100 sm:px-10 lg:py-14">
        <h2 className="mono text-[11px] font-medium uppercase tracking-[0.22em] text-[hsl(199,89%,62%)]">O que você está vendo</h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          {explain.map((e) => (
            <div key={e.t}>
              <h3 className="text-lg font-semibold">{e.t}</h3>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300">{e.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Limites" className="grid gap-8 lg:grid-cols-12">
        <h2 className="text-2xl font-semibold leading-tight text-foreground lg:col-span-4">Limites desta demonstração</h2>
        <ul className="space-y-4 text-sm leading-relaxed text-muted-foreground lg:col-span-8">
          {limits.map((l, i) => (
            <li key={i} className={`border-l-2 pl-4 ${i === 0 ? "border-[hsl(38,65%,48%)]" : "border-border"}`}>
              {l}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Referências">
        <h2 className={eyebrow}>Referências</h2>
        <ol className="mt-4 space-y-4">
          {refs.map((r) => (
            <li key={r.href} className="border-t border-border pt-4 text-sm leading-relaxed">
              <p className="text-foreground">{r.cite}</p>
              <p className="mt-1 text-muted-foreground">{r.why}</p>
              <a href={r.href} target="_blank" rel="noreferrer" className={`mt-1 inline-block break-all text-primary underline-offset-4 hover:underline ${ring}`}>
                {r.href}
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/** Fórmula em destaque dentro do bloco escuro de explicação. */
export function Formula({ children, label }: { children: ReactNode; label: string }) {
  return (
    <p aria-label={label} className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 text-center font-mono text-[14px] text-slate-100">
      {children}
    </p>
  );
}

export const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-foreground">{children}</strong>;

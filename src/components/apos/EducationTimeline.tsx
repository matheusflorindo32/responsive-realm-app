import { motion } from "framer-motion";
import type { Education } from "@/data/types";
import { TagBadge, AccentTag } from "./TagBadge";

export function EducationTimeline({ items }: { items: Education[] }) {
  const sorted = [...items].sort((a, b) => (b.startYear || 0) - (a.startYear || 0));
  return (
    <ol className="relative border-l border-border/70 pl-8 space-y-7">
      {sorted.map((e, i) => (
        <motion.li
          key={e.id}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.3) }}
          className="relative"
        >
          <span className="absolute -left-[35px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background" />
          <div className="flex flex-wrap items-baseline gap-3 mb-1">
            <span className="mono text-xs text-accent">
              {e.startYear}{e.endYear && e.endYear !== e.startYear ? `—${e.endYear}` : ""}
            </span>
            <AccentTag>{e.level}</AccentTag>
            {e.status === "Em andamento" && <span className="text-[10.5px] font-medium uppercase tracking-wider text-gold">Em andamento</span>}
          </div>
          <h3 className="display-title text-lg text-primary">{e.course}</h3>
          {e.institution && <p className="text-[13.5px] text-foreground/80">{e.institution}</p>}
          {e.titleThesis && (
            <p className="mt-1 text-[13px] text-muted-foreground italic">"{e.titleThesis}"</p>
          )}
          {e.advisor && (
            <p className="mt-1 text-[12px] text-muted-foreground">Orientador(a): {e.advisor}</p>
          )}
          {e.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {e.tags.map((t) => (
                <TagBadge key={t}>{t}</TagBadge>
              ))}
            </div>
          )}
        </motion.li>
      ))}
    </ol>
  );
}

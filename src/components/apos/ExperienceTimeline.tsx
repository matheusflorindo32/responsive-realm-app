import { motion } from "framer-motion";
import type { Experience } from "@/data/types";
import { TagBadge, AccentTag } from "./TagBadge";

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative border-l border-border/70 pl-8 space-y-8">
      {items.map((e, i) => (
        <motion.li
          key={e.id}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
          className="relative"
        >
          <span className="absolute -left-[35px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-background" />
          <div className="flex flex-wrap items-baseline gap-3 mb-1">
            <span className="mono text-xs text-accent">
              {e.startDate}{e.current ? " · presente" : e.endDate ? ` — ${e.endDate}` : ""}
            </span>
            {e.current && <AccentTag>Atual</AccentTag>}
          </div>
          <h3 className="display-title text-lg md:text-xl text-primary">{e.role}</h3>
          <p className="text-[14px] font-medium text-foreground">{e.institution}</p>
          {e.department && (
            <p className="text-[13px] text-muted-foreground italic">{e.department}</p>
          )}
          {e.description && (
            <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed max-w-2xl">
              {e.description}
            </p>
          )}
          {e.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
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

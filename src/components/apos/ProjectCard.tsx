import { ExternalLink, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Project } from "@/data/types";
import { TagBadge, AccentTag, GoldTag } from "./TagBadge";
import { cn } from "@/lib/utils";

const statusColor = (s?: string) => {
  const t = (s || "").toLowerCase();
  if (t.includes("ativo")) return "bg-accent/10 text-accent";
  if (t.includes("desenvolvimento")) return "bg-secondary/10 text-secondary";
  if (t.includes("revisão")) return "bg-gold/10 text-gold";
  return "bg-muted text-muted-foreground";
};

export function ProjectCard({ project: p, index = 0 }: { project: Project; index?: number }) {
  const Inner = (
    <div className="card-surface card-lift p-6 md:p-7 h-full flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {p.type && <AccentTag>{p.type}</AccentTag>}
          {p.featured && <GoldTag>Destaque</GoldTag>}
        </div>
        {p.url && (
          <span className="text-muted-foreground group-hover:text-accent transition-colors">
            <ArrowUpRight size={18} />
          </span>
        )}
      </div>
      <div>
        <h3 className="display-title text-xl md:text-[22px] text-primary leading-snug">{p.project}</h3>
        {p.status && (
          <span
            className={cn(
              "mt-2 inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.08em]",
              statusColor(p.status),
            )}
          >
            {p.status}
          </span>
        )}
      </div>
      {p.description && (
        <p className="text-[14px] text-muted-foreground leading-relaxed">{p.description}</p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
        {p.tags.slice(0, 5).map((t) => (
          <TagBadge key={t}>{t}</TagBadge>
        ))}
        {p.startYear && (
          <span className="ml-auto mono text-[11px] text-muted-foreground">{p.startYear}</span>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="group h-full"
    >
      {p.url ? (
        <a href={p.url} target="_blank" rel="noopener noreferrer" className="block h-full">
          {Inner}
        </a>
      ) : (
        Inner
      )}
    </motion.div>
  );
}

import { Award, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { Certification } from "@/data/types";
import { TagBadge, GoldTag } from "./TagBadge";

export function CertificationCard({ cert: c, index = 0 }: { cert: Certification; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.25) }}
      className="card-surface card-lift p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="h-9 w-9 grid place-items-center rounded-md bg-gold/10 text-gold">
          <Award size={18} />
        </div>
        {c.featured && <GoldTag>Destaque</GoldTag>}
      </div>
      <div>
        <h3 className="display-title text-[17px] text-primary leading-snug">{c.certification}</h3>
        {c.institution && (
          <p className="mt-1 text-[13px] text-muted-foreground">{c.institution}</p>
        )}
      </div>
      <div className="flex items-center gap-3 text-[11.5px] mono text-muted-foreground pt-2 border-t border-border/60">
        {c.year && <span>{c.year}</span>}
        {c.hours && (
          <span className="inline-flex items-center gap-1"><Clock size={11} /> {c.hours}h</span>
        )}
        {c.category && <TagBadge className="ml-auto">{c.category}</TagBadge>}
      </div>
    </motion.div>
  );
}

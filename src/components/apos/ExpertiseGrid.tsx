import { motion } from "framer-motion";
import type { Skill } from "@/data/types";
import { AccentTag } from "./TagBadge";
import { Beaker, Brain, Code2, Shield, HeartPulse, Database, Dumbbell, Activity, GraduationCap } from "lucide-react";

const iconFor = (cat?: string) => {
  const t = (cat || "").toLowerCase();
  if (t.includes("tecnologia") || t.includes("ia")) return Brain;
  if (t.includes("dados")) return Database;
  if (t.includes("desenvolvimento")) return Code2;
  if (t.includes("operacional")) return Shield;
  if (t.includes("saúde") || t.includes("aph")) return HeartPulse;
  if (t.includes("treinamento") || t.includes("performance")) return Activity;
  if (t.includes("educação")) return GraduationCap;
  if (t.includes("fisiologia")) return Beaker;
  return Dumbbell;
};

export function ExpertiseGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((s, i) => {
        const Icon = iconFor(s.category);
        return (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
            className="card-surface card-lift p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 grid place-items-center rounded-md bg-accent/10 text-accent">
                <Icon size={18} />
              </div>
              {s.level && (
                <span className="text-[10.5px] mono uppercase tracking-wider text-muted-foreground">
                  {s.level}
                </span>
              )}
            </div>
            <h3 className="display-title text-[17px] text-primary leading-snug">{s.skill}</h3>
            {s.category && <AccentTag className="w-fit">{s.category}</AccentTag>}
            {s.evidence && (
              <p className="text-[12.5px] text-muted-foreground leading-relaxed">{s.evidence}</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, Building2, ExternalLink } from "lucide-react";
import type { Course } from "@/data/types";
import { groupCoursesByCompetency, type GroupedCompetency } from "@/data/course-taxonomy";

interface Props {
  courses: Course[];
  search?: string;
}

export function CompetencyAccordion({ courses, search = "" }: Props) {
  const groups = useMemo(() => groupCoursesByCompetency(courses), [courses]);
  const filtered = useMemo<GroupedCompetency[]>(() => {
    if (!search.trim()) return groups;
    const s = search.trim().toLowerCase();
    return groups
      .map((g) => ({
        competency: g.competency,
        courses: g.courses.filter((c) =>
          [c.course, c.institution, c.yearPeriod].some((f) => (f ?? "").toLowerCase().includes(s))
        ),
      }))
      .filter((g) => g.courses.length > 0);
  }, [groups, search]);

  const [open, setOpen] = useState<Set<string>>(() => new Set([groups[0]?.competency.id].filter(Boolean) as string[]));
  const isOpen = (id: string) => !!search.trim() || open.has(id);

  const toggle = (id: string) => {
    if (search.trim()) return;
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (filtered.length === 0) {
    return (
      <div className="card-surface text-center text-muted-foreground py-14">
        Nenhum curso encontrado com este termo.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {filtered.map(({ competency, courses }) => {
        const Icon = competency.icon;
        const opened = isOpen(competency.id);
        return (
          <motion.section
            key={competency.id}
            layout
            className="card-surface overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(competency.id)}
              aria-expanded={opened}
              className="w-full flex items-center gap-4 px-5 py-4 md:px-6 md:py-5 text-left hover:bg-muted/40 transition-colors"
            >
              <div className="h-11 w-11 shrink-0 grid place-items-center rounded-md bg-primary/[0.04] text-primary border border-border/60">
                <Icon size={19} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="display-title text-[17px] md:text-[18px] text-primary leading-tight">
                    {competency.label}
                  </h3>
                  <span className="mono text-[11px] text-gold">
                    ({courses.length})
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] text-muted-foreground leading-snug line-clamp-1">
                  {competency.description}
                </p>
              </div>
              <motion.div
                animate={{ rotate: opened ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="text-muted-foreground shrink-0"
              >
                <ChevronDown size={18} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {opened && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-border/60"
                >
                  <ul className="divide-y divide-border/50">
                    {courses.map((c) => (
                      <li
                        key={c.id}
                        className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_180px_100px_80px] gap-x-4 gap-y-1 px-5 md:px-6 py-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="text-[13.5px] text-primary leading-snug break-words">
                            {cleanTitle(c.course)}
                          </div>
                          <div className="md:hidden mt-1 flex flex-wrap items-center gap-2 text-[11.5px] mono text-muted-foreground">
                            {c.institution && (
                              <span className="inline-flex items-center gap-1 min-w-0 truncate">
                                <Building2 size={10} /> {cleanText(c.institution)}
                              </span>
                            )}
                            {c.yearPeriod && <span>· {c.yearPeriod}</span>}
                            {c.hours && (
                              <span className="inline-flex items-center gap-1">
                                · <Clock size={10} /> {c.hours}h
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="hidden md:flex items-center text-[12px] text-muted-foreground min-w-0">
                          <span className="inline-flex items-center gap-1 truncate">
                            <Building2 size={11} className="shrink-0" />
                            <span className="truncate">{cleanText(c.institution) || "—"}</span>
                          </span>
                        </div>
                        <div className="hidden md:flex items-center mono text-[11.5px] text-muted-foreground">
                          {c.yearPeriod || "—"}
                        </div>
                        <div className="flex items-center justify-end md:justify-start mono text-[11.5px] text-muted-foreground">
                          {c.hours ? (
                            <span className="inline-flex items-center gap-1">
                              <Clock size={11} /> {c.hours}h
                            </span>
                          ) : (
                            c.certificateUrl ? (
                              <a
                                href={c.certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline inline-flex items-center gap-1"
                              >
                                ver <ExternalLink size={10} />
                              </a>
                            ) : "—"
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        );
      })}
    </div>
  );
}

// Higienização dos títulos vindos do Lattes (OCR quebrado: "GENERA TIVE", "Formação de S oldados").
// Estratégia: normaliza espaços, extrai "(Carga horária: Xh)" para tag, e junta letras isoladas
// quando um espaço solitário separa fragmentos de uma mesma palavra.
function cleanTitle(s: string): string {
  if (!s) return s;
  let out = s
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\(Carga hor[aá]ria:\s*[^)]+\)/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  // Junta letra isolada seguida de continuação: "S oldados" → "Soldados", "GENERA TIVE" → "GENERATIVE".
  out = out.replace(/([A-Za-zÀ-ÿ]{2,})\s([A-Za-zÀ-ÿ]{1,4})(?=\s|$|[.,;:])/g, (m, a, b) => {
    const stop = /^(de|da|do|das|dos|em|no|na|os|as|um|uma|para|com|por|sem|the|and|of|to|in|on|at|for|al|ao|aos|à|às|se|te|me|nos|vos|ou|ao|ao)$/i;
    if (stop.test(a) || stop.test(b)) return m;
    return a + b;
  });
  return out.replace(/\s{2,}/g, " ").trim();
}
function cleanText(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/\s{2,}/g, " ").replace(/\s,/g, ",").trim();
}

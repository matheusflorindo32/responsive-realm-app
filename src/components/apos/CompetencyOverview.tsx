import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, GraduationCap, BookOpen, Award, Building2, Clock, ExternalLink } from "lucide-react";
import type { Course, Education, Certification } from "@/data/types";
import { classifyCourse, COMPETENCIES, type CompetencyId } from "@/data/course-taxonomy";

interface Props {
  education: Education[];
  courses: Course[];
  certifications: Certification[];
  search?: string;
}

interface Bucket {
  education: Education[];
  courses: Course[];
  certifications: Certification[];
}

function normalize(s: string) {
  return (s || "").toLowerCase();
}

export function CompetencyOverview({ education, courses, certifications, search = "" }: Props) {
  const s = search.trim().toLowerCase();

  const buckets = useMemo(() => {
    const map = new Map<CompetencyId, Bucket>();
    const ensure = (id: CompetencyId) => {
      if (!map.has(id)) map.set(id, { education: [], courses: [], certifications: [] });
      return map.get(id)!;
    };
    for (const e of education) {
      const id = classifyCourse({ course: `${e.level} ${e.course}`, institution: e.institution, tags: e.tags, category: undefined });
      ensure(id).education.push(e);
    }
    for (const c of courses) {
      ensure(classifyCourse(c)).courses.push(c);
    }
    for (const c of certifications) {
      const id = classifyCourse({ course: c.certification, institution: c.institution, tags: c.tags, category: c.category });
      ensure(id).certifications.push(c);
    }
    return map;
  }, [education, courses, certifications]);

  const filtered = useMemo(() => {
    return COMPETENCIES
      .map((comp) => {
        const b = buckets.get(comp.id);
        if (!b) return null;
        const match = (hay: string) => !s || normalize(hay).includes(s);
        const edu = b.education.filter((e) => match(`${e.course} ${e.institution} ${e.level}`));
        const crs = b.courses.filter((c) => match(`${c.course} ${c.institution} ${c.yearPeriod ?? ""}`));
        const cer = b.certifications.filter((c) => match(`${c.certification} ${c.institution ?? ""} ${c.category ?? ""}`));
        const total = edu.length + crs.length + cer.length;
        if (total === 0) return null;
        return { competency: comp, edu, crs, cer, total };
      })
      .filter(Boolean) as Array<{ competency: (typeof COMPETENCIES)[number]; edu: Education[]; crs: Course[]; cer: Certification[]; total: number }>;
  }, [buckets, s]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => b.total - a.total), [filtered]);

  const [open, setOpen] = useState<Set<string>>(() => new Set(sorted[0] ? [sorted[0].competency.id] : []));
  const isOpen = (id: string) => !!s || open.has(id);
  const toggle = (id: string) => {
    if (s) return;
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (sorted.length === 0) {
    return (
      <div className="card-surface text-center text-muted-foreground py-14">
        Nenhum item encontrado com este termo.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {sorted.map(({ competency, edu, crs, cer, total }) => {
        const Icon = competency.icon;
        const opened = isOpen(competency.id);
        return (
          <motion.section key={competency.id} layout className="card-surface overflow-hidden">
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
                  <span className="mono text-[11px] text-gold">({total})</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11.5px] mono text-muted-foreground">
                  {edu.length > 0 && (
                    <span className="inline-flex items-center gap-1"><GraduationCap size={11} /> {edu.length} formação{edu.length > 1 ? "ões" : ""}</span>
                  )}
                  {crs.length > 0 && (
                    <span className="inline-flex items-center gap-1"><BookOpen size={11} /> {crs.length} curso{crs.length > 1 ? "s" : ""}</span>
                  )}
                  {cer.length > 0 && (
                    <span className="inline-flex items-center gap-1"><Award size={11} /> {cer.length} certificaç{cer.length > 1 ? "ões" : "ão"}</span>
                  )}
                </div>
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
                  <div className="p-5 md:p-6 space-y-6">
                    {edu.length > 0 && (
                      <Group icon={<GraduationCap size={13} />} label="Formação acadêmica" count={edu.length}>
                        <ul className="divide-y divide-border/50">
                          {edu.map((e) => (
                            <li key={e.id} className="py-3 grid grid-cols-[70px_1fr] gap-3">
                              <div className="mono text-[11.5px] text-accent pt-0.5">
                                {e.startYear}{e.endYear && e.endYear !== e.startYear ? `–${e.endYear}` : ""}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] uppercase tracking-wider text-gold mb-0.5">{e.level}</div>
                                <div className="text-[13.5px] text-primary leading-snug">{e.course}</div>
                                {e.institution && (
                                  <div className="mt-0.5 text-[12px] text-muted-foreground truncate">{e.institution}</div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </Group>
                    )}

                    {crs.length > 0 && (
                      <Group icon={<BookOpen size={13} />} label="Cursos & capacitações" count={crs.length}>
                        <ul className="divide-y divide-border/50">
                          {crs.map((c) => (
                            <li key={c.id} className="py-2.5 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_180px_90px_70px] gap-x-3 gap-y-0.5">
                              <div className="text-[13px] text-primary leading-snug break-words">{cleanTitle(c.course)}</div>
                              <div className="hidden md:flex items-center text-[12px] text-muted-foreground min-w-0 truncate">
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
                                  <span className="inline-flex items-center gap-1"><Clock size={11} /> {c.hours}h</span>
                                ) : c.certificateUrl ? (
                                  <a href={c.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline inline-flex items-center gap-1">
                                    ver <ExternalLink size={10} />
                                  </a>
                                ) : "—"}
                              </div>
                              <div className="md:hidden col-span-2 text-[11.5px] mono text-muted-foreground">
                                {cleanText(c.institution)}{c.yearPeriod ? ` · ${c.yearPeriod}` : ""}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </Group>
                    )}

                    {cer.length > 0 && (
                      <Group icon={<Award size={13} />} label="Certificações" count={cer.length}>
                        <ul className="divide-y divide-border/50">
                          {cer.map((c) => (
                            <li key={c.id} className="py-3 grid grid-cols-[1fr_auto] gap-3">
                              <div className="min-w-0">
                                <div className="text-[13.5px] text-primary leading-snug">{c.certification}</div>
                                {c.institution && (
                                  <div className="mt-0.5 text-[12px] text-muted-foreground">{c.institution}</div>
                                )}
                              </div>
                              <div className="text-right mono text-[11.5px] text-muted-foreground">
                                {c.year && <div>{c.year}</div>}
                                {c.hours && <div className="inline-flex items-center gap-1"><Clock size={11} /> {c.hours}h</div>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </Group>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        );
      })}
    </div>
  );
}

function Group({ icon, label, count, children }: { icon: React.ReactNode; label: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <header className="flex items-center gap-2 mb-2 pb-1.5 border-b border-border/50">
        <span className="text-gold">{icon}</span>
        <h4 className="text-[11px] uppercase tracking-[0.14em] text-primary font-medium">{label}</h4>
        <span className="mono text-[11px] text-muted-foreground">({count})</span>
      </header>
      {children}
    </section>
  );
}

function cleanTitle(s: string): string {
  if (!s) return s;
  let out = s
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\(Carga hor[aá]ria:\s*[^)]+\)/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  out = out.replace(/([A-Za-zÀ-ÿ]{2,})\s([A-Za-zÀ-ÿ]{1,4})(?=\s|$|[.,;:])/g, (m, a, b) => {
    const stop = /^(de|da|do|das|dos|em|no|na|os|as|um|uma|para|com|por|sem|the|and|of|to|in|on|at|for|al|ao|aos|à|às|se|te|me|nos|vos|ou)$/i;
    if (stop.test(a) || stop.test(b)) return m;
    return a + b;
  });
  return out.replace(/\s{2,}/g, " ").trim();
}
function cleanText(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/\s{2,}/g, " ").replace(/\s,/g, ",").trim();
}

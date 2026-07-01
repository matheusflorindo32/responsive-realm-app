import { useMemo, useState } from "react";
import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { FilterBar } from "@/components/apos/FilterBar";
import { EducationTimeline } from "@/components/apos/EducationTimeline";
import { CertificationCard } from "@/components/apos/CertificationCard";
import { TagBadge, AccentTag, GoldTag } from "@/components/apos/TagBadge";
import { getEducation, getCourses, getCertifications } from "@/data/adapters/localMockAdapter";
import { Clock, Building2 } from "lucide-react";

const PAGE = 20;

export default function Education() {
  const education = useMemo(() => getEducation(), []);
  const courses = useMemo(() => getCourses(), []);
  const certifications = useMemo(() => getCertifications(), []);

  const [tab, setTab] = useState<"formacao" | "cursos" | "certificacoes">("formacao");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [visible, setVisible] = useState(PAGE);

  const categories = Array.from(new Set(courses.map((c) => c.category).filter(Boolean))) as string[];

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => (category ? c.category === category : true))
      .filter((c) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
          c.course.toLowerCase().includes(s) ||
          (c.institution || "").toLowerCase().includes(s) ||
          (c.yearPeriod || "").toLowerCase().includes(s)
        );
      });
  }, [courses, category, search]);

  return (
    <>
      <SEOHead
        title="Formação — Matheus Florindo"
        description="Formação acadêmica, especializações, cursos complementares e certificações operacionais e técnicas."
        path="/formacao"
      />
      <section className="container-wide pt-14 pb-10">
        <SectionHeader
          eyebrow="Currículo acadêmico"
          title={<>Formação, cursos & certificações</>}
          description="Trajetória documentada em três camadas: formação institucional, capacitação complementar e certificações de destaque."
        />
      </section>

      <section className="container-wide pb-6">
        <div className="flex gap-1 border-b border-border/70">
          {([
            ["formacao", `Formação acadêmica (${education.length})`],
            ["cursos", `Cursos & capacitações (${courses.length})`],
            ["certificacoes", `Certificações destaque (${certifications.length})`],
          ] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => { setTab(t); setVisible(PAGE); }}
              className={
                "px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition-colors " +
                (tab === t ? "text-primary border-gold" : "text-muted-foreground border-transparent hover:text-foreground")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="container-wide pb-24">
        {tab === "formacao" && (
          <div className="mt-8 max-w-3xl">
            <EducationTimeline items={education} />
          </div>
        )}

        {tab === "cursos" && (
          <div className="mt-8 space-y-6">
            <FilterBar
              search={search}
              onSearch={(v) => { setSearch(v); setVisible(PAGE); }}
              filters={[{
                label: "Categoria",
                value: category,
                onChange: (v) => { setCategory(v); setVisible(PAGE); },
                options: categories.map((c) => ({ value: c, label: c })),
              }]}
              totalCount={courses.length}
              filteredCount={filteredCourses.length}
              onReset={() => { setSearch(""); setCategory(""); }}
            />

            <div className="card-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 border-b border-border/70">
                  <tr>
                    <th className="text-left px-4 py-3 eyebrow font-medium">Curso</th>
                    <th className="text-left px-4 py-3 eyebrow font-medium w-[220px] hidden md:table-cell">Instituição</th>
                    <th className="text-left px-4 py-3 eyebrow font-medium w-[110px] hidden sm:table-cell">Período</th>
                    <th className="text-left px-4 py-3 eyebrow font-medium w-[80px]">Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.slice(0, visible).map((c) => (
                    <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-[13.5px] text-primary leading-snug">{c.course}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          {c.category && <TagBadge>{c.category}</TagBadge>}
                          {c.reviewStatus && (
                            <span className="text-[10px] mono text-gold uppercase tracking-wider">
                              · {c.reviewStatus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12.5px] text-muted-foreground hidden md:table-cell">
                        <span className="inline-flex items-center gap-1"><Building2 size={11} /> {c.institution || "—"}</span>
                      </td>
                      <td className="px-4 py-3 mono text-xs text-muted-foreground hidden sm:table-cell">
                        {c.yearPeriod || "—"}
                      </td>
                      <td className="px-4 py-3 mono text-xs text-muted-foreground">
                        {c.hours ? (
                          <span className="inline-flex items-center gap-1"><Clock size={11} /> {c.hours}h</span>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCourses.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  Nenhum curso encontrado com estes filtros.
                </div>
              )}
            </div>

            {visible < filteredCourses.length && (
              <div className="text-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE)}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-primary hover:border-accent hover:text-accent"
                >
                  Carregar mais ({filteredCourses.length - visible} restantes)
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "certificacoes" && (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((c, i) => (
              <CertificationCard key={c.id} cert={c} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

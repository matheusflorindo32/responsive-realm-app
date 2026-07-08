import { useMemo, useState } from "react";
import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { EducationTimeline } from "@/components/apos/EducationTimeline";
import { CertificationCard } from "@/components/apos/CertificationCard";
import { CompetencyAccordion } from "@/components/apos/CompetencyAccordion";
import { getEducation, getCourses, getCertifications } from "@/data/adapters/localMockAdapter";
import { Search, X } from "lucide-react";

export default function Education() {
  const education = useMemo(() => getEducation(), []);
  const courses = useMemo(() => getCourses(), []);
  const certifications = useMemo(() => getCertifications(), []);

  const [tab, setTab] = useState<"formacao" | "cursos" | "certificacoes">("formacao");
  const [search, setSearch] = useState("");

  return (
    <>
      <SEOHead
        title="Formação — Matheus Florindo"
        description="Formação acadêmica, cursos por área de competência e certificações de destaque. Trajetória em segurança pública, ciência, tecnologia e performance humana."
        path="/matheus/formacao"
      />
      <section className="container-wide pt-14 pb-10">
        <SectionHeader
          eyebrow="Currículo acadêmico"
          title={<>Formação, capacitações & certificações</>}
          description="Trajetória documentada em três camadas: formação institucional, capacitações organizadas por competência e certificações de destaque."
        />
      </section>

      <section className="container-wide pb-6">
        <div className="flex gap-1 border-b border-border/70 overflow-x-auto">
          {([
            ["formacao", `Formação acadêmica`, education.length],
            ["cursos", `Cursos & capacitações`, courses.length],
            ["certificacoes", `Certificações destaque`, certifications.length],
          ] as const).map(([t, label, n]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap " +
                (tab === t
                  ? "text-primary border-gold"
                  : "text-muted-foreground border-transparent hover:text-foreground")
              }
            >
              {label} <span className="mono text-[11px] text-muted-foreground">({n})</span>
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
            <div className="flex items-center gap-3 flex-wrap">
              <label className="relative flex-1 min-w-[220px] max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por curso, instituição ou período…"
                  className="w-full rounded-md border border-border/70 bg-background pl-9 pr-9 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-accent"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Limpar busca"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
              <div className="text-[11.5px] mono text-muted-foreground">
                {courses.length} cursos · organizados por competência
              </div>
            </div>

            <CompetencyAccordion courses={courses} search={search} />
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

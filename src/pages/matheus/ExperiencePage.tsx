import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { ExperienceTimeline } from "@/components/apos/ExperienceTimeline";
import { InstitutionalCard } from "@/components/apos/InstitutionalCard";
import { getExperiences } from "@/data/adapters/localMockAdapter";

export default function ExperiencePage() {
  const experiences = getExperiences();
  const current = experiences.filter((e) => e.current);
  return (
    <>
      <SEOHead
        title="Experiência — Matheus Florindo"
        description="Trajetória profissional entre PMES, UFES/CEFD, IFES, pesquisa científica e atuação em tecnologia."
        path="/matheus/experiencia"
      />
      <section className="container-wide pt-14 pb-10">
        <SectionHeader
          eyebrow="Trajetória profissional"
          title="Experiência institucional"
          description="Segurança pública, pesquisa científica e atuação educacional em uma linha do tempo consolidada."
        />
      </section>

      <section className="container-wide pb-24 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
        <div className="max-w-3xl">
          <ExperienceTimeline items={experiences} />
        </div>

        <aside className="lg:sticky lg:top-24 space-y-4">
          <InstitutionalCard
            role="Vínculo atual"
            group="Grupo de Fisiologia Translacional"
            university="Universidade Federal do Espírito Santo — UFES"
            center="Centro de Educação Física e Desportos — CEFD"
          />
          <div className="card-surface p-5 space-y-3">
            <div className="eyebrow">Em atividade</div>
            <ul className="space-y-3">
              {current.map((e) => (
                <li key={e.id} className="pb-3 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="text-[13px] font-semibold text-primary leading-snug">{e.role}</div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">{e.institution}</div>
                  {e.startDate && (
                    <div className="mono text-[10.5px] text-muted-foreground mt-1">
                      desde {e.startDate}
                    </div>
                  )}
                </li>
              ))}
              {current.length === 0 && (
                <li className="text-[12px] text-muted-foreground">Nenhuma atividade em curso.</li>
              )}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}

import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { ExperienceTimeline } from "@/components/apos/ExperienceTimeline";
import { getExperiences } from "@/data/adapters/localMockAdapter";

export default function ExperiencePage() {
  const experiences = getExperiences();
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
      <section className="container-wide pb-24 max-w-3xl">
        <ExperienceTimeline items={experiences} />
      </section>
    </>
  );
}

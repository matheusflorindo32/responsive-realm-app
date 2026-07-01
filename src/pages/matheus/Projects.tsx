import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { ProjectCard } from "@/components/apos/ProjectCard";
import { getProjects } from "@/data/adapters/localMockAdapter";

export default function Projects() {
  const projects = getProjects();
  return (
    <>
      <SEOHead
        title="Projetos — Matheus Florindo"
        description="Iniciativas, produtos e produções técnico-científicas: Tropa Científica, Núcleo Tático, CONACIPS, guias operacionais e projetos web."
        path="/matheus/projetos"
      />
      <section className="container-wide pt-14 pb-10">
        <SectionHeader
          eyebrow="Portfólio de iniciativas"
          title={<>Projetos <em>&amp;</em> produtos</>}
          description="Da marca de divulgação científica à edtech operacional. Produtos e produções em execução, revisão ou ativos."
        />
      </section>
      <section className="container-wide pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}

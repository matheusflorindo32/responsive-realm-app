import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { ExpertiseGrid } from "@/components/apos/ExpertiseGrid";
import { AcademicLinks } from "@/components/apos/AcademicLinks";
import { getBio, getProfile, getSkills, getLinks } from "@/data/adapters/localMockAdapter";

export default function About() {
  const bio = getBio();
  const profile = getProfile();
  const skills = getSkills();
  const links = getLinks();
  return (
    <>
      <SEOHead
        title="Sobre — Matheus Florindo"
        description="Pesquisador, policial militar e desenvolvedor. Atuação interdisciplinar em ciência, segurança pública, saúde operacional, IA e performance humana."
        path="/sobre"
      />
      <section className="container-wide pt-14 pb-10">
        <SectionHeader
          eyebrow="Sobre"
          title={<>Ciência aplicada, campo e código</>}
          description="Uma trajetória construída na interseção entre segurança pública, pesquisa científica, tecnologia e performance humana."
        />
      </section>

      <section className="container-wide pb-16 grid lg:grid-cols-[1.4fr_1fr] gap-12">
        <div className="space-y-6 text-[15.5px] text-foreground/85 leading-relaxed">
          <p>{bio.bioPtShort}</p>
          <p>
            A atuação profissional integra <strong>segurança pública</strong> (PMES desde 2013),{" "}
            <strong>pesquisa científica</strong> no Grupo de Fisiologia Translacional do CEFD/UFES,
            e <strong>desenvolvimento tecnológico</strong> — com projetos como Tropa Científica,
            Núcleo Tático e o congresso CONACIPS.
          </p>
          <p>
            A abordagem é interdisciplinar por convicção: produção científica revisada por pares em
            saúde ocupacional de agentes de segurança, publicações em anais, guias técnicos em APH
            tático (TCCC/TECC) e desenvolvimento de produtos digitais aplicados à educação, gestão
            operacional e performance humana.
          </p>
          <p className="italic text-muted-foreground border-l-2 border-gold pl-4">
            {bio.positioning}
          </p>
        </div>

        <aside className="card-surface p-6 md:p-7 h-fit space-y-5">
          <div>
            <div className="eyebrow mb-1">Nome de citação</div>
            <div className="mono text-[13px] text-primary">
              {profile.citationNames.split(";")[0]}
            </div>
          </div>
          {[
            { l: "Afiliação principal", v: profile.affiliationMain },
            { l: "Grupo de pesquisa", v: profile.researchGroup },
            { l: "ORCID", v: profile.orcid },
            { l: "Lattes", v: `lattes.cnpq.br/${profile.lattesId}` },
            { l: "Localização", v: profile.cityState },
          ].map((r) => (
            <div key={r.l} className="pb-4 border-b border-border/60 last:border-0 last:pb-0">
              <div className="eyebrow mb-1">{r.l}</div>
              <div className="text-[13px] text-foreground break-all">{r.v}</div>
            </div>
          ))}
        </aside>
      </section>

      <section className="container-wide py-14 border-t border-border/70">
        <SectionHeader eyebrow="Áreas de atuação" title="Competências consolidadas" />
        <div className="mt-8">
          <ExpertiseGrid skills={skills} />
        </div>
      </section>

      <section className="container-wide py-14 border-t border-border/70">
        <SectionHeader eyebrow="Presença digital" title="Onde encontrar" />
        <div className="mt-8">
          <AcademicLinks links={links} />
        </div>
      </section>
    </>
  );
}

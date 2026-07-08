import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { ExpertiseGrid } from "@/components/apos/ExpertiseGrid";
import { AcademicLinks } from "@/components/apos/AcademicLinks";
import { InstitutionalCard } from "@/components/apos/InstitutionalCard";
import { Button } from "@/components/ui/button";
import {
  getBio, getProfile, getSkills, getLinks,
  getExperiences, getEducation, getProjects, getCertifications, getPublications, getCourses,
} from "@/data/adapters/localMockAdapter";

export default function About() {
  const bio = getBio();
  const profile = getProfile();
  const skills = getSkills();
  const links = getLinks();
  const experiences = getExperiences().slice(0, 4);
  const education = getEducation();
  const projects = getProjects().filter((p) => p.featured).slice(0, 3);
  const certifications = getCertifications().slice(0, 4);
  const publications = getPublications().filter((p) => p.featured).slice(0, 3);
  const coursesCount = getCourses().length;

  return (
    <>
      <SEOHead
        title="Sobre — Matheus Florindo"
        description="Pesquisador do CEFD/UFES, policial militar da PMES e desenvolvedor. Atuação interdisciplinar em ciência, segurança pública, saúde operacional, IA e performance humana."
        path="/matheus/sobre"
      />

      {/* 1 · QUEM SOU */}
      <section className="container-wide pt-14 pb-10">
        <SectionHeader
          eyebrow="Sobre"
          title={<>Ciência aplicada, campo e código</>}
          description="Trajetória construída na interseção entre segurança pública, pesquisa científica, tecnologia e performance humana."
        />
      </section>

      <section className="container-wide pb-16 grid lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
        <div className="space-y-5 text-[15px] text-foreground/85 leading-relaxed">
          <p>{bio.bioPtShort}</p>
          <p>
            Atuação profissional em três frentes convergentes:{" "}
            <strong>segurança pública</strong> na PMES desde 2013,{" "}
            <strong>pesquisa científica</strong> no Grupo de Fisiologia Translacional
            do CEFD/UFES, e <strong>desenvolvimento tecnológico</strong> — com projetos
            como Tropa Científica, Núcleo Tático e o congresso CONACIPS.
          </p>
        </div>

        <div className="space-y-4">
          <InstitutionalCard
            role="Membro Pesquisador"
            group="Grupo de Fisiologia Translacional"
            university="Universidade Federal do Espírito Santo — UFES"
            center="Centro de Educação Física e Desportos — CEFD"
          />
          <div className="card-surface p-5 space-y-3 text-[12.5px]">
            <div>
              <div className="eyebrow mb-1">Nome de citação</div>
              <div className="mono text-primary break-all">{profile.citationNames.split(";")[0]}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/60">
              <div>
                <div className="eyebrow mb-1">ORCID</div>
                <div className="mono text-foreground break-all">{profile.orcid}</div>
              </div>
              <div>
                <div className="eyebrow mb-1">Lattes</div>
                <div className="mono text-foreground break-all">{profile.lattesId}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · MISSÃO */}
      <section className="border-t border-border/70 bg-muted/30">
        <div className="container-wide py-16">
          <SectionHeader eyebrow="Missão" title="O que orienta o trabalho" />
          <blockquote className="mt-8 max-w-3xl font-serif text-[22px] md:text-[26px] leading-snug text-primary border-l-2 border-gold pl-6">
            <span className="text-gold">"</span>
            {bio.positioning}
            <span className="text-gold">"</span>
          </blockquote>
        </div>
      </section>

      {/* 3 · ÁREAS DE ATUAÇÃO */}
      <section className="container-wide py-16 border-t border-border/70">
        <SectionHeader
          eyebrow="Áreas de atuação"
          title="Competências consolidadas"
          description="Frentes complementares que se sustentam por evidência científica e experiência operacional."
        />
        <div className="mt-8">
          <ExpertiseGrid skills={skills} />
        </div>
      </section>

      {/* 4 · EXPERIÊNCIA */}
      <SummaryBlock
        eyebrow="Experiência profissional"
        title="Onde atuo"
        to="/matheus/experiencia"
        cta="Ver experiência completa"
      >
        <ul className="grid md:grid-cols-2 gap-3">
          {experiences.map((e) => (
            <li key={e.id} className="card-surface p-4">
              <div className="text-[13.5px] font-semibold text-primary">{e.role}</div>
              <div className="text-[12.5px] text-muted-foreground mt-0.5">{e.institution}</div>
              <div className="mono text-[11px] text-muted-foreground mt-2">
                {e.startDate}{e.endDate ? ` — ${e.endDate}` : e.current ? " — atual" : ""}
              </div>
            </li>
          ))}
        </ul>
      </SummaryBlock>

      {/* 5 · FORMAÇÃO */}
      <SummaryBlock
        eyebrow="Formação acadêmica"
        title="Base institucional"
        to="/matheus/formacao"
        cta={`Ver formação, ${coursesCount} cursos e certificações`}
        muted
      >
        <ul className="grid md:grid-cols-2 gap-3">
          {education.slice(0, 4).map((e) => (
            <li key={e.id} className="card-surface p-4">
              <div className="text-[13.5px] font-semibold text-primary line-clamp-2">{e.course}</div>
              <div className="text-[12.5px] text-muted-foreground mt-0.5 line-clamp-1">{e.institution}</div>
              <div className="mono text-[11px] text-muted-foreground mt-2">
                {e.startYear}{e.endYear ? ` — ${e.endYear}` : ""}
              </div>
            </li>
          ))}
        </ul>
      </SummaryBlock>

      {/* 6 · PESQUISA */}
      <section className="container-wide py-16 border-t border-border/70">
        <SectionHeader eyebrow="Pesquisa científica" title="Grupo de Fisiologia Translacional" />
        <div className="mt-6 max-w-3xl text-[15px] text-muted-foreground leading-relaxed space-y-4">
          <p>
            Pesquisador vinculado ao <strong className="text-foreground">Grupo de Fisiologia Translacional</strong> do
            CEFD/UFES, com produção em saúde ocupacional de agentes de segurança pública, fisiologia
            do exercício aplicada a populações operacionais e APH tático (TCCC/TECC).
          </p>
        </div>
        <div className="mt-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/matheus/publicacoes">Ver publicações <ArrowRight size={14} /></Link>
          </Button>
        </div>
      </section>

      {/* 7 · PROJETOS */}
      <SummaryBlock
        eyebrow="Projetos em destaque"
        title="Iniciativas ativas"
        to="/matheus/projetos"
        cta="Ver todos os projetos"
        muted
      >
        <ul className="grid md:grid-cols-3 gap-3">
          {projects.map((p) => (
            <li key={p.id} className="card-surface p-4">
              <div className="text-[13.5px] font-semibold text-primary">{p.project}</div>
              {p.description && (
                <div className="text-[12.5px] text-muted-foreground mt-1 line-clamp-2">{p.description}</div>
              )}
              {p.type && (
                <div className="mono text-[10.5px] text-gold uppercase tracking-wider mt-2">{p.type}</div>
              )}
            </li>
          ))}
        </ul>
      </SummaryBlock>

      {/* 8 · CERTIFICAÇÕES */}
      <SummaryBlock
        eyebrow="Certificações destaque"
        title="Credenciais operacionais e técnicas"
        to="/matheus/formacao"
        cta="Ver todas as certificações"
      >
        <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {certifications.map((c) => (
            <li key={c.id} className="card-surface p-4">
              <div className="text-[13px] font-semibold text-primary line-clamp-3">{c.certification}</div>
              {c.institution && (
                <div className="text-[11.5px] text-muted-foreground mt-1 line-clamp-1">{c.institution}</div>
              )}
              {c.year && <div className="mono text-[10.5px] text-muted-foreground mt-2">{c.year}</div>}
            </li>
          ))}
        </ul>
      </SummaryBlock>

      {/* 9 · PRODUÇÃO CIENTÍFICA */}
      <SummaryBlock
        eyebrow="Produção científica"
        title="Publicações em destaque"
        to="/matheus/publicacoes"
        cta="Ver todas as publicações"
        muted
      >
        <ul className="grid md:grid-cols-3 gap-3">
          {publications.map((p) => (
            <li key={p.id} className="card-surface p-4">
              <div className="text-[13px] font-semibold text-primary leading-snug line-clamp-4">{p.title}</div>
              {p.journalEvent && (
                <div className="text-[11.5px] text-muted-foreground italic mt-2 line-clamp-1">{p.journalEvent}</div>
              )}
              <div className="mono text-[10.5px] text-muted-foreground mt-2">{p.year}</div>
            </li>
          ))}
        </ul>
      </SummaryBlock>

      {/* 10 · CONTATO */}
      <section className="border-t border-border/70 bg-primary text-primary-foreground">
        <div className="container-wide py-16 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <div className="eyebrow text-primary-foreground/60 mb-3">Contato</div>
            <h2 className="display-title text-3xl md:text-4xl">Vamos conversar sobre <em className="text-gold not-italic">ciência aplicada</em>?</h2>
            <p className="mt-4 text-primary-foreground/70 max-w-xl">
              Pesquisa, colaborações acadêmicas, parcerias em segurança pública, saúde
              operacional, IA e desenvolvimento tecnológico.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Button asChild size="lg" variant="gold">
              <Link to="/matheus/contato">Entrar em contato <ArrowRight size={16} /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="container-wide py-16 border-t border-border/70">
        <SectionHeader eyebrow="Presença digital" title="Onde encontrar" />
        <div className="mt-8">
          <AcademicLinks links={links} />
        </div>
      </section>
    </>
  );
}

function SummaryBlock({
  eyebrow, title, to, cta, children, muted = false,
}: {
  eyebrow: string; title: string; to: string; cta: string;
  children: React.ReactNode; muted?: boolean;
}) {
  return (
    <section className={"border-t border-border/70 " + (muted ? "bg-muted/30" : "")}>
      <div className="container-wide py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <SectionHeader eyebrow={eyebrow} title={title} />
          <Button asChild variant="outline" size="sm">
            <Link to={to}>{cta} <ArrowRight size={14} /></Link>
          </Button>
        </div>
        {children}
      </div>
    </section>
  );
}

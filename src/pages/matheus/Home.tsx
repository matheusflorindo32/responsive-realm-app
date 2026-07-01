import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, BookMarked, Award, FolderGit2, ArrowUpRight } from "lucide-react";
import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { MetricCard } from "@/components/apos/MetricCard";
import { PublicationCard } from "@/components/apos/PublicationCard";
import { ProjectCard } from "@/components/apos/ProjectCard";
import { AcademicLinks } from "@/components/apos/AcademicLinks";
import { ExpertiseGrid } from "@/components/apos/ExpertiseGrid";
import { Button } from "@/components/ui/button";
import {
  getProfile, getBio, getDashboard, getPublications, getProjects,
  getSkills, getLinks,
} from "@/data/adapters/localMockAdapter";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";
import { CLIENT_CONFIG } from "@/config/client";
import { TagBadge } from "@/components/apos/TagBadge";

export default function Home() {
  const profile = getProfile();
  const bio = getBio();
  const dashboard = getDashboard().filter((d) => typeof d.value === "number");
  const publications = getPublications().filter((p) => p.featured).slice(0, 3);
  const projects = getProjects().filter((p) => p.featured);
  const skills = getSkills().filter((s) => s.featured);
  const links = getLinks().filter((l) => l.featured);
  const badges = ["UFES · CEFD", "PMES", "ORCID", "Lattes", "IFES"];

  return (
    <>
      <SEOHead
        title={`${CLIENT_CONFIG.name} — Pesquisador, Policial Militar e Desenvolvedor`}
        description={`Site institucional de ${CLIENT_CONFIG.name}: publicações científicas, formação, projetos e atuação interdisciplinar em ciência, segurança pública, tecnologia e performance humana.`}
        path="/"
        jsonLd={[personJsonLd(profile, links), websiteJsonLd()]}
      />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="paper-bg absolute inset-0 opacity-70 pointer-events-none" />
        <div className="container-wide relative pt-20 md:pt-28 pb-20 md:pb-28">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-14 items-start">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="eyebrow flex items-center gap-2 mb-6"
              >
                <span className="h-px w-8 bg-gold" />
                Academic Personal Operating System · v2
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="display-title text-[42px] sm:text-[56px] lg:text-[68px] text-primary max-w-3xl"
              >
                Matheus <em>Florindo</em>
                <br />
                de Deus
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-6 text-lg text-foreground/85 max-w-2xl leading-relaxed"
              >
                {bio.headlinePt}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-[15px] text-muted-foreground max-w-2xl leading-relaxed"
              >
                Pesquisador no <strong className="text-foreground">CEFD/UFES</strong>, integrante do{" "}
                <strong className="text-foreground">Grupo de Fisiologia Translacional</strong>. Policial militar da PMES
                e desenvolvedor — integrando ciência, segurança pública, IA e performance humana.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button asChild size="lg" variant="default">
                  <Link to="/matheus/publicacoes">
                    Ver publicações <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="institutional">
                  <Link to="/matheus/formacao">Ver currículo</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/matheus/projetos">Projetos</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link to="/matheus/contato">Contato</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-10 flex flex-wrap gap-2"
              >
                {badges.map((b) => (
                  <TagBadge key={b} className="text-[10.5px]">
                    {b}
                  </TagBadge>
                ))}
              </motion.div>
            </div>

            {/* Right — institutional card */}
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-24"
            >
              <div className="card-surface p-6 md:p-7 space-y-6">
                <div>
                  <div className="eyebrow mb-2">Identidade acadêmica</div>
                  <div className="mono text-[13px] text-primary break-all">
                    {profile.citationNames.split(";")[0]}
                  </div>
                </div>
                <div className="space-y-3 text-[13px]">
                  {[
                    { l: "Afiliação", v: profile.affiliationMain },
                    { l: "Grupo de pesquisa", v: profile.researchGroup },
                    { l: "Localização", v: profile.cityState },
                  ].map((r) => (
                    <div key={r.l} className="flex flex-col gap-0.5 pb-3 border-b border-border/60 last:border-0 last:pb-0">
                      <span className="eyebrow">{r.l}</span>
                      <span className="text-foreground">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 grid grid-cols-2 gap-2">
                  {links.slice(0, 4).map((l) => (
                    <a
                      key={l.id}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-md border border-border/70 px-3 py-2 hover:border-accent/60 hover:bg-accent/[0.03] transition-colors"
                    >
                      <span className="text-[12px] font-semibold text-primary">{l.platform}</span>
                      <ArrowUpRight size={13} className="text-muted-foreground group-hover:text-accent" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="border-y border-border/70 bg-muted/30">
        <div className="container-wide py-14">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <SectionHeader eyebrow="Dashboard executivo" title="Autoridade em números" />
            <span className="mono text-[11px] text-muted-foreground">
              Atualizado dinamicamente pela base APOS
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {dashboard.map((d) => (
              <MetricCard key={d.label} label={d.label} value={d.value} />
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="container-wide py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <SectionHeader
            eyebrow="Sobre"
            title={<>Ciência, campo e código<br /> em um só currículo.</>}
          />
          <div className="space-y-5 text-[15px] text-muted-foreground leading-relaxed">
            <p>{bio.bioPtShort}</p>
            <p className="italic text-foreground/80 border-l-2 border-gold pl-4">
              {bio.positioning}
            </p>
            <Link to="/matheus/sobre" className="inline-flex items-center gap-2 text-accent hover:underline text-sm font-medium">
              Ver biografia completa <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="border-t border-border/70">
        <div className="container-wide py-20">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <SectionHeader
              eyebrow="Áreas de atuação"
              title="Um portfólio interdisciplinar"
              description="Competências consolidadas entre pesquisa científica, saúde operacional, tecnologia e formação."
            />
          </div>
          <ExpertiseGrid skills={skills} />
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section className="border-t border-border/70 bg-muted/30">
        <div className="container-wide py-20">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <SectionHeader
              eyebrow="Publicações em destaque"
              title="Produção científica"
              description="Artigos indexados em periódicos revisados por pares."
            />
            <Button asChild variant="outline" size="sm">
              <Link to="/matheus/publicacoes">
                Ver todas <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {publications.map((p, i) => (
              <PublicationCard key={p.id} publication={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="border-t border-border/70">
        <div className="container-wide py-20">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <SectionHeader
              eyebrow="Projetos em destaque"
              title="Iniciativas ativas"
              description="Produtos, plataformas educacionais e produções técnico-científicas."
            />
            <Button asChild variant="outline" size="sm">
              <Link to="/matheus/projetos">
                Ver todos <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 6).map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FORMAÇÃO RESUMIDA */}
      <section className="border-t border-border/70 bg-muted/30">
        <div className="container-wide py-20">
          <SectionHeader eyebrow="Formação resumida" title="Trajetória acadêmica e operacional" />
          <div className="mt-10 grid md:grid-cols-4 gap-4">
            {[
              { icon: GraduationCap, label: "Formações acadêmicas", value: 10, to: "/matheus/formacao" },
              { icon: BookMarked, label: "Cursos importados", value: 53, to: "/matheus/formacao" },
              { icon: Award, label: "Certificações destaque", value: 4, to: "/matheus/formacao" },
              { icon: FolderGit2, label: "Projetos públicos", value: 5, to: "/matheus/projetos" },
            ].map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className="card-surface card-lift p-5 flex flex-col gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 grid place-items-center rounded-md bg-primary/[0.04] text-primary">
                    <c.icon size={18} />
                  </div>
                  <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <div className="display-title text-3xl text-primary">{c.value}</div>
                  <div className="text-[12.5px] text-muted-foreground mt-1">{c.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LINKS */}
      <section className="border-t border-border/70">
        <div className="container-wide py-20">
          <SectionHeader
            eyebrow="Presença digital"
            title="Links acadêmicos e profissionais"
            description="Perfis oficiais, projetos e plataformas onde a produção está indexada."
          />
          <div className="mt-8">
            <AcademicLinks links={getLinks()} />
          </div>
        </div>
      </section>

      {/* CTA CONTATO */}
      <section className="border-t border-border/70 bg-primary text-primary-foreground">
        <div className="container-wide py-20 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <div className="eyebrow text-primary-foreground/60 mb-3">Contato institucional</div>
            <h2 className="display-title text-3xl md:text-4xl">
              Vamos conversar sobre <em className="text-gold not-italic">ciência aplicada</em>?
            </h2>
            <p className="mt-4 text-primary-foreground/70 max-w-xl">
              Pesquisa, colaborações acadêmicas, parcerias em segurança pública, saúde
              operacional, IA e desenvolvimento tecnológico.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Button asChild size="lg" variant="gold">
              <Link to="/matheus/contato">
                Entrar em contato <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

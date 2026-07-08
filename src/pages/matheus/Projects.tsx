import { useMemo, useState } from "react";
import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { ProjectCard } from "@/components/apos/ProjectCard";
import { getProjects } from "@/data/adapters/localMockAdapter";
import { Search, X } from "lucide-react";

export default function Projects() {
  const projects = useMemo(() => getProjects(), []);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const types = useMemo(
    () => Array.from(new Set(projects.map((p) => p.type).filter(Boolean))) as string[],
    [projects]
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (type && p.type !== type) return false;
      if (!s) return true;
      return [p.project, p.description, p.type].some((f) => (f ?? "").toLowerCase().includes(s));
    });
  }, [projects, search, type]);

  const featured = filtered.filter((p) => p.featured);
  const others = filtered.filter((p) => !p.featured);

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

      <section className="container-wide pb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="relative flex-1 min-w-[220px] max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar projeto…"
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
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-md border border-border/70 bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
          >
            <option value="">Todos os tipos</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="text-[11.5px] mono text-muted-foreground ml-auto">
            {filtered.length} de {projects.length}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container-wide pb-8">
          <div className="mt-8 mb-5 flex items-center gap-3">
            <span className="eyebrow">Destaques</span>
            <span className="h-px flex-1 bg-border/70" />
            <span className="mono text-[11px] text-gold">{featured.length}</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="container-wide pb-24">
          <div className="mt-8 mb-5 flex items-center gap-3">
            <span className="eyebrow">Outros projetos</span>
            <span className="h-px flex-1 bg-border/70" />
            <span className="mono text-[11px] text-muted-foreground">{others.length}</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {others.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <section className="container-wide pb-24">
          <div className="card-surface text-center text-muted-foreground py-16">
            Nenhum projeto encontrado com estes filtros.
          </div>
        </section>
      )}
    </>
  );
}

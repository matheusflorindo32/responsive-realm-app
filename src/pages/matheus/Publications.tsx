import { useMemo, useState } from "react";
import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { FilterBar } from "@/components/apos/FilterBar";
import { PublicationCard } from "@/components/apos/PublicationCard";
import { ProceedingCard } from "@/components/apos/ProceedingCard";
import { getPublications, getProceedings } from "@/data/adapters/localMockAdapter";
import { scholarlyArticleJsonLd } from "@/lib/seo";

export default function Publications() {
  const publications = useMemo(() => getPublications(), []);
  const proceedings = useMemo(() => getProceedings(), []);

  const [tab, setTab] = useState<"artigos" | "anais">("artigos");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [journal, setJournal] = useState("");

  const filteredPubs = useMemo(() => {
    return publications
      .filter((p) => (year ? String(p.year) === year : true))
      .filter((p) => (journal ? p.journalEvent === journal : true))
      .filter((p) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(s) ||
          p.authors.toLowerCase().includes(s) ||
          p.journalEvent.toLowerCase().includes(s) ||
          (p.doi || "").toLowerCase().includes(s)
        );
      })
      .sort((a, b) => (b.year || 0) - (a.year || 0) || Number(b.featured) - Number(a.featured));
  }, [publications, year, journal, search]);

  const filteredProc = useMemo(() => {
    return proceedings
      .filter((p) => (year ? String(p.year) === year : true))
      .filter((p) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return p.title.toLowerCase().includes(s) || p.authors.toLowerCase().includes(s);
      })
      .sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [proceedings, year, search]);

  const years = Array.from(new Set(publications.concat(proceedings as any).map((p: any) => p.year).filter(Boolean)))
    .sort((a: any, b: any) => b - a);
  const journals = Array.from(new Set(publications.map((p) => p.journalEvent))).sort();

  return (
    <>
      <SEOHead
        title="Publicações — Matheus Florindo"
        description="Artigos científicos indexados e resumos publicados em anais. Filtros por ano, periódico e citações em ABNT/Vancouver."
        path="/matheus/publicacoes"
        jsonLd={publications.map((p) => scholarlyArticleJsonLd(p))}
      />
      <section className="container-wide pt-14 pb-10">
        <SectionHeader
          eyebrow="Produção científica"
          title={<>Publicações & Anais</>}
          description="Artigos revisados por pares, resumos em anais e produção técnica. Cada registro traz citação copiável em ABNT e Vancouver."
        />
      </section>

      <section className="container-wide pb-6">
        <div className="flex gap-1 border-b border-border/70 mb-6">
          {(["artigos", "anais"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition-colors " +
                (tab === t
                  ? "text-primary border-gold"
                  : "text-muted-foreground border-transparent hover:text-foreground")
              }
            >
              {t === "artigos" ? `Artigos (${publications.length})` : `Anais (${proceedings.length})`}
            </button>
          ))}
        </div>

        <FilterBar
          search={search}
          onSearch={setSearch}
          filters={[
            {
              label: "Ano",
              value: year,
              onChange: setYear,
              options: years.map((y: any) => ({ value: String(y), label: String(y) })),
            },
            ...(tab === "artigos"
              ? [{
                  label: "Periódico",
                  value: journal,
                  onChange: setJournal,
                  options: journals.map((j) => ({ value: j, label: j })),
                }]
              : []),
          ]}
          totalCount={tab === "artigos" ? publications.length : proceedings.length}
          filteredCount={tab === "artigos" ? filteredPubs.length : filteredProc.length}
          onReset={() => {
            setSearch("");
            setYear("");
            setJournal("");
          }}
        />
      </section>

      <section className="container-wide pb-24">
        {tab === "artigos" ? (
          <div className="grid md:grid-cols-2 gap-5">
            {filteredPubs.map((p, i) => (
              <PublicationCard key={p.id} publication={p} index={i} />
            ))}
            {filteredPubs.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-16">
                Nenhum artigo encontrado com estes filtros.
              </p>
            )}
          </div>
        ) : (
          <>
            <aside className="card-surface mb-6 p-5 md:p-6 border-l-2 border-gold/70">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="eyebrow text-gold mb-1.5">Plataforma oficial</div>
                  <h3 className="display-title text-lg text-primary leading-snug">
                    Anais hospedados no site oficial do CONACIPS 2025
                  </h3>
                  <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                    Concebi e desenvolvi a plataforma completa do congresso — inscrições, programação, submissão de resumos e publicação dos anais digitais.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                  <a
                    href="https://www.conacips2025.com/proceedings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-gold/60 bg-gold/10 px-3 py-1.5 text-[12px] font-medium mono text-gold hover:bg-gold/20 transition-colors"
                  >
                    Ver anais oficiais →
                  </a>
                  <a
                    href="/matheus/projetos#conacips"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-3 py-1.5 text-[12px] font-medium mono text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    Sobre o projeto →
                  </a>
                </div>
              </div>
            </aside>
            <div className="grid md:grid-cols-2 gap-5">
              {filteredProc.map((p, i) => (
                <ProceedingCard key={p.id} proceeding={p} index={i} />
              ))}
              {filteredProc.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-16">
                  Nenhum resumo encontrado com estes filtros.
                </p>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}

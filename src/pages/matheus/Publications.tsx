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
        )}
      </section>
    </>
  );
}

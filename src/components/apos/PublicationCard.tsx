import { useState } from "react";
import { Copy, Check, ExternalLink, FileText } from "lucide-react";
import { motion } from "framer-motion";
import type { Publication } from "@/data/types";
import {
  generateABNTCitation,
  generateVancouverCitation,
  generateShortCitation,
} from "@/lib/citations";
import { copyToClipboard, formatDoi, getDoiUrl } from "@/lib/utils";
import { TagBadge, AccentTag, GoldTag } from "./TagBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  publication: Publication;
  index?: number;
  compact?: boolean;
}

export function PublicationCard({ publication: p, index = 0, compact }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const doCopy = async (kind: "abnt" | "vancouver" | "short") => {
    const text =
      kind === "abnt"
        ? generateABNTCitation(p)
        : kind === "vancouver"
          ? generateVancouverCitation(p)
          : generateShortCitation(p);
    await copyToClipboard(text);
    setCopied(kind);
    toast.success("Citação copiada", { description: `${kind.toUpperCase()} — pronto para colar.` });
    setTimeout(() => setCopied(null), 1600);
  };

  const doi = formatDoi(p.doi);
  const doiUrl = getDoiUrl(p.doi);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className={cn("card-surface card-lift p-6 md:p-7 flex flex-col gap-4")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <AccentTag>{p.type}</AccentTag>
          {p.year && <TagBadge>{p.year}</TagBadge>}
          {p.featured && <GoldTag>Destaque</GoldTag>}
          {p.status && p.status !== "Publicado" && <TagBadge>{p.status}</TagBadge>}
        </div>
        <span className="mono text-[10px] text-muted-foreground/60">{p.id}</span>
      </div>

      <h3 className={cn("display-title text-primary leading-snug", compact ? "text-lg" : "text-xl md:text-[22px]")}>
        {p.title}
      </h3>

      <p className="text-[13px] text-muted-foreground leading-relaxed">{p.authors}</p>

      <div className="text-[13px] text-foreground/80">
        <span className="italic">{p.journalEvent}</span>
        {p.volume && <>, v. {p.volume}</>}
        {p.issue && <>, n. {p.issue}</>}
        {(p.pageStart || p.pageEnd) && (
          <>
            , p. {p.pageStart}
            {p.pageEnd && p.pageEnd !== p.pageStart ? `-${p.pageEnd}` : ""}
          </>
        )}
        {p.year && <>, {p.year}</>}.
      </div>

      {(doi || p.indexing) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] mono text-muted-foreground pt-2 border-t border-border/60">
          {doi && (
            <span>
              DOI:{" "}
              <a
                href={doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {doi}
              </a>
            </span>
          )}
          {p.indexing && <span className="truncate">Indexação: {p.indexing}</span>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {p.officialUrl && (
          <a
            href={p.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:text-accent"
          >
            <ExternalLink size={13} /> Ver publicação
          </a>
        )}
        {p.pdfUrl && (
          <a
            href={p.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:text-accent"
          >
            <FileText size={13} /> PDF
          </a>
        )}
        <div className="ml-auto flex items-center gap-1">
          {(["abnt", "vancouver", "short"] as const).map((k) => (
            <button
              key={k}
              onClick={() => doCopy(k)}
              className={cn(
                "inline-flex items-center gap-1 rounded-md border border-border/70 px-2 py-1 text-[10.5px] font-medium uppercase tracking-wider mono transition-colors",
                copied === k
                  ? "border-accent text-accent bg-accent/5"
                  : "text-muted-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              {copied === k ? <Check size={11} /> : <Copy size={11} />}
              {k}
            </button>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

import { useState } from "react";
import { Copy, Check, FileText, ExternalLink, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Proceeding } from "@/data/types";
import { generateProceedingsCitation } from "@/lib/citations";
import { copyToClipboard, cn } from "@/lib/utils";
import { TagBadge, AccentTag } from "./TagBadge";
import { toast } from "sonner";

const CONACIPS_URL = "https://www.conacips2025.com";
const CONACIPS_PROCEEDINGS_URL = "https://www.conacips2025.com/proceedings";

export function ProceedingCard({ proceeding: p, index = 0 }: { proceeding: Proceeding; index?: number }) {
  const [copied, setCopied] = useState(false);
  const doCopy = async () => {
    await copyToClipboard(generateProceedingsCitation(p));
    setCopied(true);
    toast.success("Citação ABNT (anais) copiada");
    setTimeout(() => setCopied(false), 1600);
  };
  const isConacips = /conacips/i.test(p.event || "") || /conacips/i.test((p.tags || []).join(" "));
  const officialLink = p.link || (isConacips ? CONACIPS_PROCEEDINGS_URL : undefined);
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="card-surface card-lift p-6 flex flex-col gap-3"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <AccentTag>Resumo em anais</AccentTag>
        {p.year && <TagBadge>{p.year}</TagBadge>}
        {p.city && <TagBadge>{p.city}</TagBadge>}
      </div>
      <h3 className="display-title text-lg text-primary leading-snug">{p.title}</h3>
      <p className="text-[13px] text-muted-foreground leading-relaxed">{p.authors}</p>
      <p className="text-[12.5px] text-foreground/80">
        <span className="italic">{p.event}</span>
        {p.publisher && <>. {p.publisher}</>}
        {(p.pageStart || p.pageEnd) && <>, p. {p.pageStart}{p.pageEnd ? `-${p.pageEnd}` : ""}</>}
        .
      </p>
      {p.issnIsbn && (
        <div className="text-[11px] mono text-muted-foreground">{p.issnIsbn}</div>
      )}
      {isConacips && (
        <a
          href={CONACIPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 self-start rounded-sm border border-gold/40 bg-gold/5 px-2 py-1 text-[10.5px] font-medium uppercase tracking-[0.08em] mono text-gold hover:bg-gold/10 transition-colors"
          title="Plataforma oficial do CONACIPS 2025 — concebida e desenvolvida por Matheus Florindo"
        >
          <Code2 size={11} /> Plataforma desenvolvida por Matheus
        </a>
      )}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {officialLink && (
          <a
            href={officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:text-accent"
          >
            <ExternalLink size={13} /> Ver nos anais oficiais
          </a>
        )}
        {p.pdf && (
          <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <FileText size={13} /> {p.pdf}
          </span>
        )}
        <button
          onClick={doCopy}
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-md border border-border/70 px-2 py-1 text-[10.5px] font-medium uppercase tracking-wider mono transition-colors",
            copied ? "border-accent text-accent bg-accent/5" : "text-muted-foreground hover:border-primary/40 hover:text-primary",
        <button
          onClick={doCopy}
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-md border border-border/70 px-2 py-1 text-[10.5px] font-medium uppercase tracking-wider mono transition-colors",
            copied ? "border-accent text-accent bg-accent/5" : "text-muted-foreground hover:border-primary/40 hover:text-primary",
          )}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />} Citar
        </button>
      </div>
    </motion.article>
  );
}

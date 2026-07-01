import type { Publication, Proceeding } from "@/data/types";
import { formatDoi } from "./utils";

function upper(s?: string) {
  return (s || "").toUpperCase();
}
function joinPages(a?: string, b?: string) {
  if (!a && !b) return "";
  if (a && b && a !== b) return `p. ${a}-${b}`;
  return `p. ${a ?? b}`;
}

/** ABNT (NBR 6023) — artigo em periódico */
export function generateABNTCitation(pub: Publication): string {
  const parts: string[] = [];
  parts.push(upper(pub.authors));
  parts.push(`${pub.title}.`);
  const journal = `<em>${pub.journalEvent}</em>`;
  const vol = pub.volume ? `, v. ${pub.volume}` : "";
  const iss = pub.issue ? `, n. ${pub.issue}` : "";
  const pg = pub.pageStart || pub.pageEnd ? `, ${joinPages(pub.pageStart, pub.pageEnd)}` : "";
  const yr = pub.year ? `, ${pub.year}` : "";
  parts.push(`${journal}${vol}${iss}${pg}${yr}.`);
  const doi = formatDoi(pub.doi);
  if (doi) parts.push(`DOI: ${doi}.`);
  return parts.filter(Boolean).join(" ").replace(/<\/?em>/g, "");
}

/** Vancouver simplificado */
export function generateVancouverCitation(pub: Publication): string {
  const authors = (pub.authors || "").split(";").map((a) => a.trim()).filter(Boolean).join(", ");
  const vol = pub.volume ? `;${pub.volume}` : "";
  const iss = pub.issue ? `(${pub.issue})` : "";
  const pg = pub.pageStart ? `:${pub.pageStart}${pub.pageEnd ? "-" + pub.pageEnd : ""}` : "";
  const doi = formatDoi(pub.doi);
  return `${authors}. ${pub.title}. ${pub.journalEvent}. ${pub.year ?? ""}${vol}${iss}${pg}.${doi ? ` doi:${doi}` : ""}`.trim();
}

/** Citação simplificada — para copiar/compartilhar */
export function generateShortCitation(pub: Publication): string {
  return `${pub.authors} (${pub.year ?? "s.d."}). ${pub.title}. ${pub.journalEvent}.`;
}

/** Anais de eventos (ABNT) */
export function generateProceedingsCitation(p: Proceeding): string {
  const authors = upper(p.authors);
  const event = (p.event || "").toUpperCase();
  const yr = p.year ? `, ${p.year}` : "";
  const city = p.city ? `, ${p.city}` : "";
  const proc = p.proceedingsTitle ? `${p.proceedingsTitle} [...]` : "Anais [...]";
  const publisherLoc = [p.city, p.publisher].filter(Boolean).join(": ");
  const pg = joinPages(p.pageStart, p.pageEnd);
  return `${authors}. ${p.title}. In: ${event}${yr}${city}. ${proc}. ${publisherLoc}, ${p.year ?? ""}. ${pg}.`.trim();
}

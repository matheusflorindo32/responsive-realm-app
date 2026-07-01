import type { Profile, LinkItem, Publication } from "@/data/types";
import { CLIENT_CONFIG } from "@/config/client";

export function personJsonLd(profile: Profile, links: LinkItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    alternateName: profile.citationNames,
    jobTitle: profile.primaryRole,
    affiliation: profile.affiliationMain
      ? { "@type": "Organization", name: profile.affiliationMain }
      : undefined,
    url: `https://${CLIENT_CONFIG.domain}`,
    sameAs: links.filter((l) => l.visibility === "public").map((l) => l.url),
    knowsAbout: [
      "Ciência policial",
      "Fisiologia translacional",
      "APH Tático",
      "TECC",
      "Inteligência artificial",
      "Ciência de dados",
      "Performance humana",
      "Desenvolvimento web",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: CLIENT_CONFIG.name,
    url: `https://${CLIENT_CONFIG.domain}`,
  };
}

export function scholarlyArticleJsonLd(pub: Publication) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: pub.title,
    author: (pub.authors || "").split(";").map((a) => ({ "@type": "Person", name: a.trim() })),
    datePublished: pub.year ? String(pub.year) : undefined,
    isPartOf: { "@type": "Periodical", name: pub.journalEvent },
    identifier: pub.doi ? `doi:${pub.doi}` : undefined,
    url: pub.officialUrl,
  };
}

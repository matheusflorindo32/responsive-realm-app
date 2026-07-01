/**
 * localMockAdapter — lê a base APOS diretamente do JSON local (extraído do XLSX).
 * Ao conectar MCP/Google Sheets, criar googleSheetsAdapter.ts com a mesma interface.
 */
import raw from "@/data/apos-master.json";
import type {
  Profile, Bio, DashboardMetric, Publication, Proceeding, Education,
  Course, Certification, Experience, Project, Skill, LinkItem, Visibility,
} from "@/data/types";
import { normalizeBoolean, normalizeTags, toStr, firstNumber } from "@/lib/utils";
import { SHOW_PRIVATE_DATA } from "@/config/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const R = raw as any;

const vis = (v: unknown): Visibility => {
  const s = String(v || "public").toLowerCase();
  return (["public", "private", "hidden"].includes(s) ? s : "public") as Visibility;
};

const publicFilter = <T extends { visibility: Visibility }>(items: T[]) =>
  items.filter((i) => (SHOW_PRIVATE_DATA ? true : i.visibility === "public"));

// --- Mappers ---
export function getProfile(): Profile {
  const p = R["01_Profile"];
  return {
    personId: p.person_id,
    fullName: p.full_name,
    citationNames: p.citation_names,
    orcid: p.orcid,
    lattesId: p.lattes_id,
    primaryRole: p.primary_role,
    affiliationMain: p.affiliation_main,
    researchGroup: p.research_group,
    cityState: p.city_state,
    site: p.site,
    github: p.github,
    linkedin: p.linkedin || "https://www.linkedin.com/in/matheus-florindo-de-deus-b953b017a/",
    emailPublic: p.email_public,
  };
}

export function getBio(): Bio {
  const b = R["02_Bio"];
  return {
    bioPtShort: b.bio_pt_short,
    bioEnShort: b.bio_en_short,
    headlinePt: b.headline_pt,
    headlineEn: b.headline_en,
    positioning: b.positioning,
  };
}

export function getDashboard(): DashboardMetric[] {
  return R["03_Dashboard"].map((d: any) => ({
    label: d.label, value: d.value, source: d.source,
  }));
}

export function getPublications(): Publication[] {
  return publicFilter(R["04_Publicacoes"].map((r: any): Publication => ({
    id: r.id,
    type: r.type,
    title: r.title,
    authors: r.authors,
    journalEvent: r.journal_event,
    issnIsbn: toStr(r.issn_isbn),
    doi: toStr(r.doi),
    year: firstNumber(r.year),
    volume: toStr(r.volume),
    issue: toStr(r.issue),
    pageStart: toStr(r.page_start),
    pageEnd: toStr(r.page_end),
    language: toStr(r.language),
    publisher: toStr(r.publisher),
    officialUrl: toStr(r.official_url),
    pdfUrl: toStr(r.pdf_url),
    indexing: toStr(r.indexing),
    qualis: toStr(r.qualis),
    quartile: toStr(r.quartile),
    citescore: toStr(r.citescore),
    impactFactor: toStr(r.impact_factor),
    citationCount: firstNumber(r.citation_count),
    status: toStr(r.status),
    visibility: vis(r.visibility),
    featured: normalizeBoolean(r.featured),
    tags: normalizeTags(r.tags),
    sourceNotes: toStr(r.source_notes),
  })));
}

export function getProceedings(): Proceeding[] {
  return publicFilter(R["05_Anais_CONACIPS"].map((r: any): Proceeding => ({
    id: r.id,
    type: r.type,
    title: r.title,
    authors: r.authors,
    event: r.event,
    proceedingsTitle: toStr(r.proceedings_title),
    issnIsbn: toStr(r.issn_isbn),
    year: firstNumber(r.year),
    city: toStr(r.city),
    country: toStr(r.country),
    publisher: toStr(r.publisher),
    pageStart: toStr(r.page_start),
    pageEnd: toStr(r.page_end),
    language: toStr(r.language),
    link: toStr(r.link),
    pdf: toStr(r.pdf),
    status: toStr(r.status),
    visibility: vis(r.visibility),
    featured: normalizeBoolean(r.featured),
    tags: normalizeTags(r.tags),
    sourceNotes: toStr(r.source_notes),
  })));
}

export function getEducation(): Education[] {
  return publicFilter(R["06_Formacao"].map((r: any): Education => ({
    id: r.id,
    level: r.level,
    course: r.course,
    institution: toStr(r.institution),
    startYear: firstNumber(r.start_year),
    endYear: firstNumber(r.end_year),
    status: toStr(r.status),
    titleThesis: toStr(r.title_thesis),
    advisor: toStr(r.advisor),
    hours: firstNumber(r.hours),
    city: toStr(r.city),
    country: toStr(r.country),
    visibility: vis(r.visibility),
    featured: normalizeBoolean(r.featured),
    tags: normalizeTags(r.tags),
    source: toStr(r.source),
  })));
}

export function getCourses(): Course[] {
  return publicFilter(R["07_Cursos"].map((r: any): Course => ({
    id: r.id,
    category: toStr(r.category),
    course: r.course,
    institution: toStr(r.institution),
    yearPeriod: toStr(r.year_period),
    hours: firstNumber(r.hours),
    area: toStr(r.area),
    level: toStr(r.level),
    status: toStr(r.status),
    certificateUrl: toStr(r.certificate_url),
    visibility: vis(r.visibility),
    featured: normalizeBoolean(r.featured),
    tags: normalizeTags(r.tags),
    reviewStatus: toStr(r.review_status),
  })));
}

export function getCertifications(): Certification[] {
  return publicFilter(R["08_Certificacoes"].map((r: any): Certification => ({
    id: r.id,
    certification: r.certification,
    institution: toStr(r.institution),
    year: firstNumber(r.year),
    hours: firstNumber(r.hours),
    credentialId: toStr(r.credential_id),
    credentialUrl: toStr(r.credential_url),
    category: toStr(r.category),
    status: toStr(r.status),
    visibility: vis(r.visibility),
    featured: normalizeBoolean(r.featured),
    tags: normalizeTags(r.tags),
    notes: toStr(r.notes),
  })));
}

export function getExperiences(): Experience[] {
  return publicFilter(R["09_Experiencia"].map((r: any): Experience => ({
    id: r.id,
    institution: r.institution,
    department: toStr(r.department),
    role: r.role,
    startDate: toStr(r.start_date),
    endDate: toStr(r.end_date),
    current: normalizeBoolean(r.current),
    description: toStr(r.description),
    city: toStr(r.city),
    country: toStr(r.country),
    visibility: vis(r.visibility),
    featured: normalizeBoolean(r.featured),
    tags: normalizeTags(r.tags),
    source: toStr(r.source),
  })));
}

export function getProjects(): Project[] {
  return publicFilter(R["10_Projetos"].map((r: any): Project => ({
    id: r.id,
    project: r.project,
    type: toStr(r.type),
    description: toStr(r.description),
    status: toStr(r.status),
    startYear: firstNumber(r.start_year),
    endYear: firstNumber(r.end_year),
    url: toStr(r.url),
    repository: toStr(r.repository),
    visibility: vis(r.visibility),
    featured: normalizeBoolean(r.featured),
    tags: normalizeTags(r.tags),
    relatedPublications: toStr(r.related_publications),
    seoSlug: toStr(r.seo_slug),
    notes: toStr(r.notes),
  })));
}

export function getSkills(): Skill[] {
  return publicFilter(R["11_Skills"].map((r: any): Skill => ({
    id: r.id,
    skill: r.skill,
    category: toStr(r.category),
    level: toStr(r.level),
    evidence: toStr(r.evidence),
    visibility: vis(r.visibility),
    featured: normalizeBoolean(r.featured),
    tags: normalizeTags(r.tags),
  })));
}

export function getLinks(): LinkItem[] {
  return publicFilter(R["13_Links"].map((r: any): LinkItem => ({
    id: r.id,
    platform: r.platform,
    url: r.url,
    category: toStr(r.category),
    visibility: vis(r.visibility),
    featured: normalizeBoolean(r.featured),
    notes: toStr(r.notes),
  })));
}

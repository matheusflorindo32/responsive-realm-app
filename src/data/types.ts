export type Visibility = "public" | "private" | "hidden";

export interface Profile {
  personId: string;
  fullName: string;
  citationNames: string;
  orcid?: string;
  lattesId?: string;
  primaryRole: string;
  affiliationMain?: string;
  researchGroup?: string;
  cityState?: string;
  site?: string;
  github?: string;
  linkedin?: string;
  emailPublic?: string;
}

export interface Bio {
  bioPtShort: string;
  bioEnShort: string;
  headlinePt: string;
  headlineEn: string;
  positioning: string;
}

export interface DashboardMetric {
  label: string;
  value: number | string;
  source?: string;
}

export interface Publication {
  id: string;
  type: string;
  title: string;
  authors: string;
  journalEvent: string;
  issnIsbn?: string;
  doi?: string;
  year?: number;
  volume?: string;
  issue?: string;
  pageStart?: string;
  pageEnd?: string;
  language?: string;
  publisher?: string;
  officialUrl?: string;
  pdfUrl?: string;
  indexing?: string;
  qualis?: string;
  quartile?: string;
  citescore?: string;
  impactFactor?: string;
  citationCount?: number;
  status?: string;
  visibility: Visibility;
  featured: boolean;
  tags: string[];
  sourceNotes?: string;
}

export interface Proceeding {
  id: string;
  type: string;
  title: string;
  authors: string;
  event: string;
  proceedingsTitle?: string;
  issnIsbn?: string;
  year?: number;
  city?: string;
  country?: string;
  publisher?: string;
  pageStart?: string;
  pageEnd?: string;
  language?: string;
  link?: string;
  pdf?: string;
  status?: string;
  visibility: Visibility;
  featured: boolean;
  tags: string[];
  sourceNotes?: string;
}

export interface Education {
  id: string;
  level: string;
  course: string;
  institution?: string;
  startYear?: number;
  endYear?: number;
  status?: string;
  titleThesis?: string;
  advisor?: string;
  hours?: number;
  city?: string;
  country?: string;
  visibility: Visibility;
  featured: boolean;
  tags: string[];
  source?: string;
}

export interface Course {
  id: string;
  category?: string;
  course: string;
  institution?: string;
  yearPeriod?: string;
  hours?: number;
  area?: string;
  level?: string;
  status?: string;
  certificateUrl?: string;
  visibility: Visibility;
  featured: boolean;
  tags: string[];
  reviewStatus?: string;
}

export interface Certification {
  id: string;
  certification: string;
  institution?: string;
  year?: number;
  hours?: number;
  credentialId?: string;
  credentialUrl?: string;
  category?: string;
  status?: string;
  visibility: Visibility;
  featured: boolean;
  tags: string[];
  notes?: string;
}

export interface Experience {
  id: string;
  institution: string;
  department?: string;
  role: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  description?: string;
  city?: string;
  country?: string;
  visibility: Visibility;
  featured: boolean;
  tags: string[];
  source?: string;
}

export interface Project {
  id: string;
  project: string;
  type?: string;
  description?: string;
  status?: string;
  startYear?: number;
  endYear?: number;
  url?: string;
  repository?: string;
  visibility: Visibility;
  featured: boolean;
  tags: string[];
  relatedPublications?: string;
  seoSlug?: string;
  notes?: string;
}

export interface Skill {
  id: string;
  skill: string;
  category?: string;
  level?: string;
  evidence?: string;
  visibility: Visibility;
  featured: boolean;
  tags: string[];
}

export interface LinkItem {
  id: string;
  platform: string;
  url: string;
  category?: string;
  visibility: Visibility;
  featured: boolean;
  notes?: string;
}

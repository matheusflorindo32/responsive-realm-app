import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeBoolean(value: unknown): boolean {
  if (value === true) return true;
  if (value === false || value == null) return false;
  const s = String(value).trim().toUpperCase();
  return s === "TRUE" || s === "1" || s === "SIM" || s === "YES";
}

export function normalizeTags(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  return String(value)
    .split(/[;,]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function normalizeUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  const s = String(value).trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

export function formatPages(start?: string | number, end?: string | number): string {
  if (!start && !end) return "";
  if (start && end && String(start) !== String(end)) return `p. ${start}-${end}`;
  return `p. ${start ?? end}`;
}

export function formatDoi(doi?: string): string {
  if (!doi) return "";
  return String(doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim();
}

export function getDoiUrl(doi?: string): string | undefined {
  const clean = formatDoi(doi);
  return clean ? `https://doi.org/${clean}` : undefined;
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

export function firstNumber(...vals: unknown[]): number | undefined {
  for (const v of vals) {
    if (v == null || v === "") continue;
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

export function toStr(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s || undefined;
}

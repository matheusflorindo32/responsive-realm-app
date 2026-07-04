/**
 * Sanitize a `next` query param to a safe same-origin relative path.
 * Rejects protocol/host injection and only allows paths starting with "/"
 * (and not "//" which is protocol-relative).
 */
export function sanitizeNext(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    if (!decoded.startsWith("/")) return null;
    if (decoded.startsWith("//")) return null;
    if (decoded.includes("://")) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function destinationForRole(role: "admin" | "user" | null, next?: string | null) {
  const safe = sanitizeNext(next);
  if (safe) return safe;
  if (role === "admin") return "/admin";
  return "/app";
}

const NEXT_KEY = "tropa:auth-next";

export function stashNext(next: string | null) {
  if (next) sessionStorage.setItem(NEXT_KEY, next);
  else sessionStorage.removeItem(NEXT_KEY);
}
export function popNext(): string | null {
  const v = sessionStorage.getItem(NEXT_KEY);
  sessionStorage.removeItem(NEXT_KEY);
  return v;
}

import { toast } from "sonner";

const MESSAGES: Record<string, string> = {
  "23505": "Este registro já existe.",
  "23503": "Registro relacionado não encontrado.",
  "42501": "Sem permissão para esta operação.",
  "PGRST301": "Sessão expirada. Faça login novamente.",
};

type ErrorDetails = { code?: string; message?: string; error?: { code?: string; message?: string } };

function asErrorDetails(err: unknown): ErrorDetails {
  return err !== null && typeof err === "object" ? (err as ErrorDetails) : {};
}

export function handleSupabaseError(err: unknown, fallback = "Ocorreu um erro. Tente novamente."): string {
  const details = asErrorDetails(err);
  const code = details.code ?? details.error?.code;
  const msg = details.message ?? details.error?.message ?? "";
  if (code && MESSAGES[code]) return MESSAGES[code];
  if (msg.includes("Sem matrícula")) return "Você não tem matrícula ativa neste curso.";
  if (msg.includes("row-level security")) return "Sem permissão para esta ação.";
  if (msg.includes("JWT")) return "Sessão expirada. Faça login novamente.";
  return msg || fallback;
}

export function toastError(err: unknown, fallback?: string) {
  toast.error(handleSupabaseError(err, fallback));
}

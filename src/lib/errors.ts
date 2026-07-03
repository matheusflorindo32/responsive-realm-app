import { toast } from "sonner";

const MESSAGES: Record<string, string> = {
  "23505": "Este registro já existe.",
  "23503": "Registro relacionado não encontrado.",
  "42501": "Sem permissão para esta operação.",
  "PGRST301": "Sessão expirada. Faça login novamente.",
};

export function handleSupabaseError(err: any, fallback = "Ocorreu um erro. Tente novamente."): string {
  const code = err?.code ?? err?.error?.code;
  const msg = err?.message ?? err?.error?.message ?? "";
  if (code && MESSAGES[code]) return MESSAGES[code];
  if (msg.includes("Sem matrícula")) return "Você não tem matrícula ativa neste curso.";
  if (msg.includes("row-level security")) return "Sem permissão para esta ação.";
  if (msg.includes("JWT")) return "Sessão expirada. Faça login novamente.";
  return msg || fallback;
}

export function toastError(err: any, fallback?: string) {
  toast.error(handleSupabaseError(err, fallback));
}

import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "verify_certificate",
  title: "Validar certificado",
  description:
    "Valida um certificado da Tropa Científica pelo código público e retorna aluno, curso, carga horária e situação.",
  inputSchema: {
    certificate_code: z.string().trim().min(3).describe("Código impresso no certificado."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ certificate_code }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("public_certificates")
      .select("certificate_code, student_name, course_title, trail_name, issuer, hours, issued_at, status, revoked_at")
      .eq("certificate_code", certificate_code)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) {
      return { content: [{ type: "text", text: `Nenhum certificado encontrado para o código ${certificate_code}.` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { certificate: data },
    };
  },
});

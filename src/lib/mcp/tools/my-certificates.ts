import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_certificates",
  title: "Meus certificados",
  description:
    "Lista os certificados emitidos para o usuário autenticado, com código de validação, curso, carga horária e situação.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("certificates")
      .select("certificate_code, course_title, trail_name, student_name, hours, issuer, status, issued_at, pdf_url")
      .eq("user_id", ctx.getUserId())
      .order("issued_at", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { certificates: data ?? [] },
    };
  },
});

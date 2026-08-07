import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_courses",
  title: "Listar cursos",
  description:
    "Lista os cursos publicados da Tropa Científica, com trilha, nível, duração e se são gratuitos. Aceita busca por texto.",
  inputSchema: {
    search: z.string().trim().nullable().describe("Texto opcional para filtrar por título."),
    limit: z.number().int().nullable().describe("Máximo de cursos retornados (padrão 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("courses")
      .select("id, slug, title, summary, level, duration_min, is_free, status, trail_id, instructor_name")
      .eq("status", "published")
      .order("order_index", { ascending: true })
      .limit(Math.min(Math.max(limit ?? 25, 1), 100));
    if (search) query = query.ilike("title", `%${search}%`);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { courses: data ?? [] },
    };
  },
});

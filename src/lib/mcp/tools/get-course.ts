import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_course",
  title: "Detalhar curso",
  description:
    "Retorna um curso publicado pelo slug, com módulos e aulas (título, tipo, duração e se é prévia gratuita).",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Slug do curso, ex.: 'metodologia-cientifica'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data: course, error } = await supabase
      .from("courses")
      .select(
        "id, slug, title, summary, description, level, duration_min, is_free, status, requirements, target_audience, learning_objectives, instructor_name",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!course) return { content: [{ type: "text", text: `Curso não encontrado: ${slug}` }], isError: true };

    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .select("id, title, description, order_index, lessons(id, slug, title, content_type, duration_sec, order_index, is_preview)")
      .eq("course_id", course.id)
      .order("order_index", { ascending: true });
    if (modulesError) return { content: [{ type: "text", text: modulesError.message }], isError: true };

    const payload = { course, modules: modules ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});

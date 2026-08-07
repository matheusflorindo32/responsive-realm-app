import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_progress",
  title: "Meu progresso",
  description:
    "Lista as matrículas do usuário autenticado e o progresso em cada curso (percentual e aulas concluídas).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();

    const [enrollments, progress] = await Promise.all([
      supabase
        .from("enrollments")
        .select("id, scope, course_id, trail_id, status, access_type, granted_at, expires_at")
        .eq("user_id", userId),
      supabase
        .from("course_progress")
        .select("course_id, pct_complete, lessons_completed, lessons_total, completed_at, updated_at")
        .eq("user_id", userId),
    ]);

    const failure = enrollments.error ?? progress.error;
    if (failure) return { content: [{ type: "text", text: failure.message }], isError: true };

    const payload = { enrollments: enrollments.data ?? [], progress: progress.data ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});

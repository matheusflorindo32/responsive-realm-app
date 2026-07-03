import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function CursoPlayer() {
  const { slug } = useParams<{ slug: string }>();
  const qc = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  const course = useQuery({
    queryKey: ["player-course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, trails(name), modules(*, lessons(*))")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const myProgress = useQuery({
    queryKey: ["my-lesson-progress", course.data?.id],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase.from("lesson_progress").select("*").eq("user_id", u.user.id);
      return data ?? [];
    },
    enabled: !!course.data?.id,
  });

  const mark = useMutation({
    mutationFn: async ({ lessonId, status }: { lessonId: string; status: "in_progress" | "completed" }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Não autenticado");
      const { error } = await supabase
        .from("lesson_progress")
        .upsert({
          user_id: u.user.id,
          lesson_id: lessonId,
          status,
          progress_pct: status === "completed" ? 100 : 50,
          completed_at: status === "completed" ? new Date().toISOString() : null,
        }, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-lesson-progress"] });
      toast.success("Progresso salvo");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const modules = (course.data?.modules ?? []).sort((a: any, b: any) => a.order_index - b.order_index);
  const allLessons = modules.flatMap((m: any) => (m.lessons ?? []).sort((a: any, b: any) => a.order_index - b.order_index));
  const completedIds = new Set(myProgress.data?.filter((p: any) => p.status === "completed").map((p: any) => p.lesson_id));
  const pct = allLessons.length ? Math.round((completedIds.size / allLessons.length) * 100) : 0;

  useEffect(() => {
    if (!selectedLesson && allLessons.length) setSelectedLesson(allLessons[0]);
  }, [allLessons, selectedLesson]);

  if (course.isLoading) return <p>Carregando…</p>;
  if (!course.data) return <p>Curso não encontrado.</p>;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/app" className="text-xs text-muted-foreground hover:text-foreground">← Voltar</Link>
        <div className="text-xs text-muted-foreground uppercase mt-1">{course.data.trails?.name}</div>
        <h1 className="text-3xl font-bold">{course.data.title}</h1>
        <div className="mt-3 max-w-md">
          <div className="flex justify-between text-xs mb-1"><span>{completedIds.size} de {allLessons.length} aulas</span><span>{pct}%</span></div>
          <Progress value={pct} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {selectedLesson ? (
            <Card>
              <CardHeader><CardTitle>{selectedLesson.title}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {selectedLesson.content_type === "video" && selectedLesson.video_url && (
                  <div className="aspect-video">
                    <iframe
                      src={toEmbed(selectedLesson.video_url)}
                      className="w-full h-full rounded-md border border-border"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {selectedLesson.content_type === "text" && selectedLesson.content_md && (
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap">{selectedLesson.content_md}</div>
                )}
                {!selectedLesson.video_url && !selectedLesson.content_md && (
                  <p className="text-muted-foreground text-sm">Conteúdo indisponível ou você não tem acesso.</p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => mark.mutate({ lessonId: selectedLesson.id, status: "completed" })}
                    disabled={completedIds.has(selectedLesson.id)}
                  >
                    {completedIds.has(selectedLesson.id) ? "Concluída ✓" : "Marcar como concluída"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-muted-foreground">Selecione uma aula.</p>
          )}
        </div>

        <aside className="space-y-4">
          {modules.map((m: any) => (
            <Card key={m.id}>
              <CardHeader className="py-3"><CardTitle className="text-sm">{m.title}</CardTitle></CardHeader>
              <CardContent className="py-0 pb-3">
                <ul className="space-y-1">
                  {(m.lessons ?? []).sort((a: any, b: any) => a.order_index - b.order_index).map((l: any) => (
                    <li key={l.id}>
                      <button
                        onClick={() => setSelectedLesson(l)}
                        className={`w-full text-left text-sm px-2 py-1.5 rounded hover:bg-accent flex items-center justify-between ${selectedLesson?.id === l.id ? "bg-accent" : ""}`}
                      >
                        <span className="truncate">{l.title}</span>
                        {completedIds.has(l.id) && <span className="text-primary text-xs">✓</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </aside>
      </div>
    </div>
  );
}

function toEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video${u.pathname}`;
    return url;
  } catch { return url; }
}

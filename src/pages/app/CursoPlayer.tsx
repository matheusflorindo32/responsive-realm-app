import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, ArrowRight, CheckCircle2, Menu } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { LessonSidebar } from "@/components/player/LessonSidebar";
import { LessonTabs } from "@/components/player/LessonTabs";
import { LessonLocked } from "@/components/player/LessonLocked";
import { PlayerSkeleton } from "@/components/skeletons";
import { toastError } from "@/lib/errors";
import { toast } from "sonner";

export default function CursoPlayer() {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const course = useQuery({
    queryKey: ["player-course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, trails(id,name), modules(*, lessons(*))")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const enrollment = useQuery({
    queryKey: ["player-enrollment", course.data?.id],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user || !course.data) return null;
      const { data } = await supabase
        .from("enrollments").select("*")
        .eq("user_id", u.user.id)
        .eq("status", "active")
        .or(`course_id.eq.${course.data.id},trail_id.eq.${course.data.trail_id ?? "00000000-0000-0000-0000-000000000000"}`)
        .maybeSingle();
      return data;
    },
    enabled: !!course.data?.id,
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
          user_id: u.user.id, lesson_id: lessonId, status,
          progress_pct: status === "completed" ? 100 : 50,
          completed_at: status === "completed" ? new Date().toISOString() : null,
        }, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-lesson-progress"] });
      qc.invalidateQueries({ queryKey: ["my-progress"] });
      toast.success("Progresso salvo");
    },
    onError: toastError,
  });

  const modules = useMemo(
    () => (course.data?.modules ?? [])
      .map((m: any) => ({ ...m, lessons: (m.lessons ?? []).sort((a: any, b: any) => a.order_index - b.order_index) }))
      .sort((a: any, b: any) => a.order_index - b.order_index),
    [course.data]
  );
  const allLessons = useMemo(() => modules.flatMap((m: any) => m.lessons), [modules]);
  const completedIds = useMemo(
    () => new Set(myProgress.data?.filter((p: any) => p.status === "completed").map((p: any) => p.lesson_id)),
    [myProgress.data]
  );
  const pct = allLessons.length ? Math.round((completedIds.size / allLessons.length) * 100) : 0;

  useEffect(() => {
    if (!selectedId && allLessons.length) setSelectedId(allLessons[0].id);
  }, [allLessons, selectedId]);

  const selected = allLessons.find((l: any) => l.id === selectedId);
  const currentIdx = allLessons.findIndex((l: any) => l.id === selectedId);
  const next = allLessons[currentIdx + 1];
  const hasAccess = !!enrollment.data && (!enrollment.data.expires_at || new Date(enrollment.data.expires_at) > new Date());
  const canWatch = hasAccess || selected?.is_preview;
  const done = selected ? completedIds.has(selected.id) : false;

  if (course.isLoading) return <PlayerSkeleton />;
  if (!course.data) return <div className="text-center py-16 text-muted-foreground">Curso não encontrado.</div>;

  const sidebar = (
    <LessonSidebar
      modules={modules}
      selectedId={selectedId ?? undefined}
      completedIds={completedIds}
      onSelect={(l) => { setSelectedId(l.id); setSheetOpen(false); }}
      hasAccess={hasAccess}
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link to="/app" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" />Voltar
          </Link>
          {course.data.trails?.name && (
            <div className="text-[10px] uppercase tracking-[0.15em] text-primary/70 mt-2">{course.data.trails.name}</div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mt-1">{course.data.title}</h1>
          <div className="mt-3 max-w-md">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{completedIds.size} de {allLessons.length} aulas</span>
              <span className="tabular-nums font-medium">{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden shrink-0"><Menu className="w-4 h-4" />Aulas</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm overflow-auto">{sidebar}</SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6 min-w-0">
          {selected ? (
            canWatch ? (
              <>
                {selected.content_type === "video" || selected.video_url ? (
                  <VideoPlayer url={selected.video_url} title={selected.title} />
                ) : null}

                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{selected.title}</h2>
                </div>

                <LessonTabs lesson={selected} courseInstructor={course.data.instructor_name} />

                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border/40">
                  <Button
                    onClick={() => mark.mutate({ lessonId: selected.id, status: "completed" })}
                    disabled={done || mark.isPending}
                    className="gap-2"
                    variant={done ? "outline" : "default"}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {done ? "Concluída" : "Marcar como concluída"}
                  </Button>
                  {next && (
                    <Button variant="ghost" onClick={() => setSelectedId(next.id)} className="gap-2 ml-auto">
                      Próxima: {next.title.slice(0, 30)}{next.title.length > 30 ? "…" : ""}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <LessonLocked />
            )
          ) : (
            <p className="text-muted-foreground">Selecione uma aula.</p>
          )}
        </div>

        <aside className="hidden lg:block">{sidebar}</aside>
      </div>
    </div>
  );
}

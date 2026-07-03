import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, CheckCircle2, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/app/CourseCard";
import { TrailCard } from "@/components/app/TrailCard";
import { ContinueWatching } from "@/components/app/ContinueWatching";
import { CertificateHighlight } from "@/components/app/CertificateHighlight";
import { DashboardStats } from "@/components/app/DashboardStats";
import { DashboardSkeleton } from "@/components/skeletons";

export default function Dashboard() {
  const me = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      const { data: p } = await supabase.from("profiles").select("display_name").eq("user_id", data.user.id).maybeSingle();
      return { user: data.user, name: p?.display_name ?? data.user.email?.split("@")[0] ?? "Aluno" };
    },
  });

  const enrollments = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses(id,slug,title,summary,cover_url,trail_id,trails(name)), trails(id,slug,name,description)")
        .eq("status", "active");
      if (error) throw error;
      return data ?? [];
    },
  });

  const progress = useQuery({
    queryKey: ["my-progress"],
    queryFn: async () => (await supabase.from("course_progress").select("*")).data ?? [],
  });

  const certs = useQuery({
    queryKey: ["my-certs-dash"],
    queryFn: async () => (await supabase.from("certificates").select("certificate_code,course_title,issued_at").order("issued_at",{ascending:false}).limit(6)).data ?? [],
  });

  const lessonProgress = useQuery({
    queryKey: ["my-recent-lessons"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("lesson_progress")
        .select("*, lessons(id,title,module_id,modules(course_id,courses(id,slug,title,trails(name))))")
        .eq("user_id", u.user.id)
        .eq("status", "in_progress")
        .order("updated_at", { ascending: false })
        .limit(1);
      return data ?? [];
    },
  });

  const pctOf = (courseId: string) => progress.data?.find((p: any) => p.course_id === courseId)?.pct_complete ?? 0;

  const courseEnrolls = enrollments.data?.filter((e: any) => e.courses) ?? [];
  const trailEnrolls = enrollments.data?.filter((e: any) => e.trails && !e.courses) ?? [];
  const totalLessonsCompleted = progress.data?.reduce((a: number, p: any) => a + (p.lessons_completed ?? 0), 0) ?? 0;
  const totalCerts = certs.data?.length ?? 0;
  const totalHours = Math.round(((courseEnrolls.length * 60) + totalLessonsCompleted * 15) / 60);

  const continueItem = lessonProgress.data?.[0] as any;

  if (enrollments.isLoading || me.isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Olá,</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{me.data?.name}</h1>
          <p className="text-muted-foreground mt-1">Sua jornada de aprendizado, tudo em um lugar.</p>
        </div>
        <DashboardStats stats={[
          { icon: BookOpen, label: "Cursos ativos", value: courseEnrolls.length },
          { icon: CheckCircle2, label: "Aulas concluídas", value: totalLessonsCompleted, accent: "bg-emerald-500/40" },
          { icon: Award, label: "Certificados", value: totalCerts, accent: "bg-amber-500/40" },
          { icon: Clock, label: "Horas estudadas", value: `${totalHours}h`, accent: "bg-indigo-500/40" },
        ]} />
      </motion.header>

      {/* Continue watching */}
      {continueItem?.lessons?.modules?.courses && (
        <ContinueWatching
          courseTitle={continueItem.lessons.modules.courses.title}
          courseSlug={continueItem.lessons.modules.courses.slug}
          lessonTitle={continueItem.lessons.title}
          pct={pctOf(continueItem.lessons.modules.courses.id)}
          trailName={continueItem.lessons.modules.courses.trails?.name}
        />
      )}

      {/* Empty state */}
      {enrollments.data?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">Você ainda não tem acesso liberado.</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Fale com o administrador para receber acesso a cursos ou trilhas.</p>
        </div>
      )}

      {/* Cursos */}
      {courseEnrolls.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Meus cursos</h2>
            <span className="text-xs text-muted-foreground">{courseEnrolls.length} {courseEnrolls.length === 1 ? "curso" : "cursos"}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseEnrolls.map((e: any) => (
              <CourseCard
                key={e.id}
                slug={e.courses.slug}
                title={e.courses.title}
                trailName={e.courses.trails?.name}
                summary={e.courses.summary}
                coverUrl={e.courses.cover_url}
                pct={pctOf(e.courses.id)}
                expiresAt={e.expires_at}
                status={e.status}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trilhas */}
      {trailEnrolls.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Minhas trilhas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trailEnrolls.map((e: any) => (
              <TrailCard key={e.id} name={e.trails.name} description={e.trails.description} expiresAt={e.expires_at} status={e.status} />
            ))}
          </div>
        </section>
      )}

      {/* Certificados */}
      {certs.data && certs.data.length > 0 && (
        <CertificateHighlight certs={certs.data as any} />
      )}
    </div>
  );
}

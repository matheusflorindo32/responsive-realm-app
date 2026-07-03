import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const enrollments = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses(id,slug,title,summary,cover_url,trail_id,trails(name)), trails(id,slug,name,description)")
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
  });

  const progress = useQuery({
    queryKey: ["my-progress"],
    queryFn: async () => {
      const { data } = await supabase.from("course_progress").select("*");
      return data ?? [];
    },
  });

  const pctOf = (courseId: string) => progress.data?.find((p) => p.course_id === courseId)?.pct_complete ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meus cursos</h1>
        <p className="text-muted-foreground">Cursos e trilhas liberados para você.</p>
      </div>

      {enrollments.data?.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          Você ainda não tem acesso liberado. Fale com o administrador para receber acesso.
        </CardContent></Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrollments.data?.map((e: any) => {
          const c = e.courses;
          const t = e.trails;
          if (c) {
            return (
              <Link key={e.id} to={`/app/curso/${c.slug}`}>
                <Card className="hover:border-primary/50 transition-colors h-full">
                  <CardHeader>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{c.trails?.name}</div>
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{c.summary}</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1"><span>Progresso</span><span>{pctOf(c.id)}%</span></div>
                      <Progress value={pctOf(c.id)} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          }
          return (
            <Card key={e.id} className="h-full border-primary/30">
              <CardHeader>
                <div className="text-xs text-primary uppercase tracking-wide">Trilha completa</div>
                <CardTitle className="text-lg">{t?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{t?.description}</p>
                <p className="text-xs text-muted-foreground mt-4">Acesso a todos os cursos desta trilha.</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

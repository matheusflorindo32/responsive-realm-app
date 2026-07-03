import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function EnsinoHub() {
  const stats = useQuery({
    queryKey: ["ensino-stats"],
    queryFn: async () => {
      const [t, c, e, p] = await Promise.all([
        supabase.from("trails").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      return { trilhas: t.count ?? 0, cursos: c.count ?? 0, matriculasAtivas: e.count ?? 0, alunos: p.count ?? 0 };
    },
  });

  const cards = [
    { to: "/admin/ensino/trilhas", label: "Trilhas / Nichos", value: stats.data?.trilhas, hint: "Robótica, Biomédica, Drones…" },
    { to: "/admin/ensino/cursos", label: "Cursos", value: stats.data?.cursos, hint: "Cursos individuais por trilha" },
    { to: "/admin/ensino/matriculas", label: "Matrículas ativas", value: stats.data?.matriculasAtivas, hint: "Liberar acesso manual" },
    { to: "#", label: "Alunos cadastrados", value: stats.data?.alunos, hint: "Perfis criados" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ensino</h1>
        <p className="text-muted-foreground">Trilhas, cursos, aulas e liberação de acesso.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="hover:border-primary/50 transition-colors h-full">
              <CardHeader>
                <CardTitle className="text-base font-medium text-muted-foreground">{c.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{c.value ?? "–"}</div>
                <div className="text-xs text-muted-foreground mt-2">{c.hint}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

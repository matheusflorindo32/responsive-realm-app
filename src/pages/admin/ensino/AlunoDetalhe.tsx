import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Award } from "lucide-react";

export default function AlunoDetalhe() {
  const { userId } = useParams<{ userId: string }>();

  const profile = useQuery({
    queryKey: ["admin-profile", userId],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("user_id", userId!).maybeSingle()).data,
  });

  const enrolls = useQuery({
    queryKey: ["admin-enrolls", userId],
    queryFn: async () => (await supabase.from("enrollments").select("*, courses(id,title), trails(name)").eq("user_id", userId!).order("granted_at", { ascending: false })).data ?? [],
  });

  const progress = useQuery({
    queryKey: ["admin-progress", userId],
    queryFn: async () => (await supabase.from("course_progress").select("*, courses(title)").eq("user_id", userId!)).data ?? [],
  });

  const certs = useQuery({
    queryKey: ["admin-certs", userId],
    queryFn: async () => (await supabase.from("certificates").select("*").eq("user_id", userId!).order("issued_at", { ascending: false })).data ?? [],
  });

  const audit = useQuery({
    queryKey: ["admin-audit-user", userId],
    queryFn: async () => (await supabase.from("admin_audit_log").select("*").eq("target_user_id", userId!).order("created_at", { ascending: false }).limit(50)).data ?? [],
  });

  return (
    <div className="space-y-6">
      <Link to="/admin/ensino/matriculas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{profile.data?.display_name ?? "Aluno"}</h1>
        <p className="text-xs font-mono text-muted-foreground">{userId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Matrículas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {enrolls.data?.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                <div>
                  <div className="text-sm">{e.courses?.title ?? e.trails?.name}</div>
                  <div className="text-xs text-muted-foreground">{e.access_type} · {e.expires_at ? `expira ${new Date(e.expires_at).toLocaleDateString()}` : "vitalício"}</div>
                </div>
                <Badge variant={e.status === "active" ? "default" : "secondary"}>{e.status}</Badge>
              </div>
            ))}
            {enrolls.data?.length === 0 && <p className="text-sm text-muted-foreground">Sem matrículas.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Progresso por curso</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {progress.data?.map((p: any) => (
              <div key={p.course_id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{p.courses?.title ?? p.course_id.slice(0,8)}</span>
                  <span className="tabular-nums text-muted-foreground">{p.lessons_completed}/{p.lessons_total} · {p.pct_complete}%</span>
                </div>
                <Progress value={p.pct_complete} className="h-1.5" />
              </div>
            ))}
            {progress.data?.length === 0 && <p className="text-sm text-muted-foreground">Sem progresso registrado.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Certificados</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {certs.data?.map((c: any) => (
              <a key={c.id} href={`/certificado/${c.certificate_code}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0 hover:bg-muted/30 -mx-2 px-2 rounded">
                <Award className="w-4 h-4 text-amber-400" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{c.course_title ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{new Date(c.issued_at).toLocaleDateString()} · #{c.certificate_code}</div>
                </div>
                <Badge variant={c.status === "valid" ? "default" : "destructive"}>{c.status}</Badge>
              </a>
            ))}
            {certs.data?.length === 0 && <p className="text-sm text-muted-foreground">Nenhum certificado.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Histórico de auditoria</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-auto">
            {audit.data?.map((l: any) => (
              <div key={l.id} className="text-xs py-1.5 border-b border-border/40 last:border-0">
                <div className="flex justify-between gap-2">
                  <Badge variant="outline" className="text-[10px]">{l.action}</Badge>
                  <span className="text-muted-foreground">{new Date(l.created_at).toLocaleString("pt-BR")}</span>
                </div>
              </div>
            ))}
            {audit.data?.length === 0 && <p className="text-sm text-muted-foreground">Sem ações registradas.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

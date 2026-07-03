import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Matriculas() {
  const qc = useQueryClient();
  const [scope, setScope] = useState<"course" | "trail">("course");
  const [targetId, setTargetId] = useState("");
  const [profileId, setProfileId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterScope, setFilterScope] = useState("all");

  const trails = useQuery({
    queryKey: ["trails-select-m"],
    queryFn: async () => (await supabase.from("trails").select("id,name").order("name")).data ?? [],
  });
  const courses = useQuery({
    queryKey: ["courses-select-m"],
    queryFn: async () => (await supabase.from("courses").select("id,title").order("title")).data ?? [],
  });
  const profiles = useQuery({
    queryKey: ["profiles-select-m"],
    queryFn: async () => (await supabase.from("profiles").select("user_id,display_name").order("display_name")).data ?? [],
  });

  const enrollments = useQuery({
    queryKey: ["enrollments-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses(title), trails(name)")
        .order("granted_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const grant = useMutation({
    mutationFn: async () => {
      if (!profileId || !targetId) throw new Error("Selecione aluno e destino");
      const payload: any = {
        user_id: profileId,
        scope,
        course_id: scope === "course" ? targetId : null,
        trail_id: scope === "trail" ? targetId : null,
        access_type: "manual",
        status: "active",
        source: "admin:manual",
        expires_at: expiresAt || null,
      };
      const { data: u } = await supabase.auth.getUser();
      if (u.user) payload.granted_by = u.user.id;
      const { error } = await supabase.from("enrollments").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollments-admin"] });
      toast.success("Acesso liberado");
      setTargetId(""); setProfileId(""); setExpiresAt("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("enrollments").update({ status: "revoked" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enrollments-admin"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Matrículas</h1>
        <p className="text-muted-foreground text-sm">Liberação manual de acesso a cursos ou trilhas.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Liberar acesso manual</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); grant.mutate(); }} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div className="space-y-1.5">
              <Label>Aluno</Label>
              <Select value={profileId} onValueChange={setProfileId}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {profiles.data?.map((p) => <SelectItem key={p.user_id} value={p.user_id}>{p.display_name ?? p.user_id.slice(0, 8)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={scope} onValueChange={(v) => { setScope(v as any); setTargetId(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">Curso</SelectItem>
                  <SelectItem value="trail">Trilha inteira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{scope === "course" ? "Curso" : "Trilha"}</Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {scope === "course"
                    ? courses.data?.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)
                    : trails.data?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Expira em (opcional)</Label>
              <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>
            <Button type="submit" disabled={grant.isPending}>Liberar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="ID do aluno" value={filterUser} onChange={(e) => setFilterUser(e.target.value)} />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {["active","pending","expired","revoked","refunded"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {["manual","purchase","gift","trial","scholarship"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterScope} onValueChange={setFilterScope}>
            <SelectTrigger><SelectValue placeholder="Escopo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Curso e trilha</SelectItem>
              <SelectItem value="course">Só cursos</SelectItem>
              <SelectItem value="trail">Só trilhas</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Tipo acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expira</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e: any) => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-xs">
                  <a href={`/admin/ensino/alunos/${e.user_id}`} className="hover:underline">{e.user_id.slice(0, 8)}</a>
                </TableCell>
                <TableCell>{e.courses?.title ?? e.trails?.name ?? "?"}</TableCell>
                <TableCell><Badge variant="outline">{e.access_type}</Badge></TableCell>
                <TableCell><Badge variant={e.status === "active" ? "default" : "secondary"}>{e.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.expires_at ? new Date(e.expires_at).toLocaleDateString() : "vitalício"}</TableCell>
                <TableCell className="text-right">
                  {e.status === "active" && (
                    <Button size="sm" variant="ghost" onClick={() => revoke.mutate(e.id)}>Revogar</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhuma matrícula com esses filtros.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

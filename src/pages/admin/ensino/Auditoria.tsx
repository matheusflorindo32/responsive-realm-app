import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const actionColor = (a: string) => {
  if (a.includes("deleted") || a.includes("revoked")) return "destructive";
  if (a.includes("created") || a.includes("granted")) return "default";
  if (a.includes("expiration")) return "secondary";
  return "outline";
};

export default function Auditoria() {
  const [q, setQ] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");

  const logs = useQuery({
    queryKey: ["audit-logs", entityFilter],
    queryFn: async () => {
      let query = supabase.from("admin_audit_log").select("*").order("created_at", { ascending: false }).limit(300);
      if (entityFilter !== "all") query = query.eq("entity_type", entityFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = (logs.data ?? []).filter((l: any) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (l.action?.toLowerCase().includes(s) ?? false) ||
           (JSON.stringify(l.metadata ?? {}).toLowerCase().includes(s));
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Auditoria administrativa</h1>
        <p className="text-muted-foreground text-sm">Todas as ações registradas automaticamente pelo banco.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="Buscar por ação ou conteúdo..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as entidades</SelectItem>
              <SelectItem value="enrollments">Matrículas</SelectItem>
              <SelectItem value="courses">Cursos</SelectItem>
              <SelectItem value="trails">Trilhas</SelectItem>
              <SelectItem value="lessons">Aulas</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Últimas ações ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Ator</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l: any) => (
                <TableRow key={l.id}>
                  <TableCell className="text-xs whitespace-nowrap">{new Date(l.created_at).toLocaleString("pt-BR")}</TableCell>
                  <TableCell><Badge variant={actionColor(l.action) as any}>{l.action}</Badge></TableCell>
                  <TableCell className="text-xs">{l.entity_type}</TableCell>
                  <TableCell className="text-xs font-mono truncate max-w-[100px]">{l.actor_id?.slice(0, 8) ?? "—"}</TableCell>
                  <TableCell>
                    <Sheet>
                      <SheetTrigger asChild><Button variant="ghost" size="sm">Ver</Button></SheetTrigger>
                      <SheetContent className="w-full sm:max-w-lg overflow-auto">
                        <SheetHeader><SheetTitle>{l.action}</SheetTitle></SheetHeader>
                        <div className="mt-4 space-y-2 text-sm">
                          <div><strong>Entidade:</strong> {l.entity_type} <code className="text-xs">{l.entity_id}</code></div>
                          {l.target_user_id && <div><strong>Aluno alvo:</strong> <code className="text-xs">{l.target_user_id}</code></div>}
                          <div><strong>Ator:</strong> <code className="text-xs">{l.actor_id}</code></div>
                          <div><strong>Data:</strong> {new Date(l.created_at).toLocaleString("pt-BR")}</div>
                          <div>
                            <strong>Metadata:</strong>
                            <pre className="mt-2 p-3 rounded-md bg-muted text-xs overflow-auto max-h-96">{JSON.stringify(l.metadata, null, 2)}</pre>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma ação registrada.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

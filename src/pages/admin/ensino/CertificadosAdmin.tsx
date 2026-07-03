import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { toastError } from "@/lib/errors";
import { Award, ExternalLink } from "lucide-react";

export default function CertificadosAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reason, setReason] = useState("");
  const [target, setTarget] = useState<any>(null);

  const list = useQuery({
    queryKey: ["admin-certs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certificates").select("*, profiles!inner(display_name)").order("issued_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const revoke = useMutation({
    mutationFn: async () => {
      if (!target) return;
      const { error } = await supabase.from("certificates").update({
        status: "revoked", revoked_at: new Date().toISOString(), revoked_reason: reason || "Revogado pelo administrador",
      }).eq("id", target.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-certs"] }); toast.success("Certificado revogado"); setTarget(null); setReason(""); },
    onError: (e) => toastError(e),
  });

  const filtered = (list.data ?? []).filter((c: any) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (c.student_name ?? "").toLowerCase().includes(s) ||
             (c.course_title ?? "").toLowerCase().includes(s) ||
             c.certificate_code.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Certificados emitidos</h1>
        <p className="text-muted-foreground text-sm">{list.data?.length ?? 0} certificado(s) no total.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="Buscar por aluno, curso ou código…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="valid">Válidos</SelectItem>
              <SelectItem value="revoked">Revogados</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Emitido</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell>{c.student_name ?? c.profiles?.display_name ?? "—"}</TableCell>
                <TableCell className="text-sm">{c.course_title ?? "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(c.issued_at).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="font-mono text-xs">{c.certificate_code}</TableCell>
                <TableCell><Badge variant={c.status === "valid" ? "default" : "destructive"}>{c.status}</Badge></TableCell>
                <TableCell className="text-right space-x-1">
                  <Button asChild size="sm" variant="ghost">
                    <a href={`/certificado/${c.certificate_code}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                  {c.status === "valid" && (
                    <Button size="sm" variant="ghost" onClick={() => setTarget(c)}>Revogar</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                <Award className="w-8 h-8 mx-auto mb-2 opacity-40" />Nenhum certificado.
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Revogar certificado</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <p>Certificado <code className="font-mono text-xs">{target?.certificate_code}</code> de <strong>{target?.student_name}</strong>.</p>
            <Textarea placeholder="Motivo da revogação (opcional)" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => revoke.mutate()} disabled={revoke.isPending}>Revogar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

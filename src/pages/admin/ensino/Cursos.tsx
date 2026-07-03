import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Course = {
  id: string;
  trail_id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  level: string | null;
  duration_min: number | null;
  status: "draft" | "published" | "archived";
  order_index: number;
  price_cents: number;
  is_free: boolean;
};

const empty: Partial<Course> = { status: "draft", is_free: false, price_cents: 0, order_index: 0 };

export default function Cursos() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Course>>(empty);

  const trails = useQuery({
    queryKey: ["trails-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trails").select("id,name").order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const list = useQuery({
    queryKey: ["courses-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*, trails(name)").order("order_index");
      if (error) throw error;
      return data as (Course & { trails: { name: string } })[];
    },
  });

  const save = useMutation({
    mutationFn: async (c: Partial<Course>) => {
      const payload = { ...c, price_cents: Number(c.price_cents) || 0, order_index: Number(c.order_index) || 0, duration_min: c.duration_min ? Number(c.duration_min) : null };
      if (c.id) {
        const { error } = await supabase.from("courses").update(payload).eq("id", c.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses-admin"] });
      setOpen(false);
      setForm(empty);
      toast.success("Curso salvo");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses-admin"] });
      toast.success("Curso excluído");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cursos</h1>
          <p className="text-muted-foreground text-sm">Cursos individuais dentro de cada trilha.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm(empty); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setForm(empty)}>Novo curso</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{form.id ? "Editar curso" : "Novo curso"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Trilha</Label>
                  <Select value={form.trail_id} onValueChange={(v) => setForm({ ...form, trail_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {trails.data?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input required value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Título</Label>
                <Input required value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Resumo</Label>
                <Input value={form.summary ?? ""} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Descrição</Label>
                <Textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Nível</Label>
                  <Input value={form.level ?? ""} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Iniciante" />
                </div>
                <div className="space-y-1.5">
                  <Label>Duração (min)</Label>
                  <Input type="number" value={form.duration_min ?? ""} onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Ordem</Label>
                  <Input type="number" value={form.order_index ?? 0} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Course["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label className="cursor-pointer">Gratuito</Label>
                  <Switch checked={!!form.is_free} onCheckedChange={(v) => setForm({ ...form, is_free: v })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Preço (centavos)</Label>
                  <Input type="number" disabled={!!form.is_free} value={form.price_cents ?? 0} onChange={(e) => setForm({ ...form, price_cents: Number(e.target.value) })} />
                </div>
              </div>
              <Button type="submit" disabled={save.isPending} className="w-full">
                {save.isPending ? "Salvando…" : "Salvar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Trilha</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="text-muted-foreground">{c.trails?.name}</TableCell>
                <TableCell><Badge variant={c.status === "published" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
                <TableCell>{c.is_free ? "Grátis" : `R$ ${(c.price_cents / 100).toFixed(2)}`}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="ghost" asChild><Link to={`/admin/ensino/cursos/${c.id}`}>Aulas</Link></Button>
                  <Button size="sm" variant="ghost" onClick={() => { setForm(c); setOpen(true); }}>Editar</Button>
                  <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Excluir "${c.title}"?`)) del.mutate(c.id); }}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
            {list.data?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum curso ainda. Crie uma trilha primeiro.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

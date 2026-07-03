import { useState } from "react";
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

type Trail = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string | null;
  status: "draft" | "published" | "archived";
  order_index: number;
  price_cents: number;
  is_free: boolean;
};

const empty: Partial<Trail> = { status: "draft", is_free: true, price_cents: 0, order_index: 0 };

export default function Trilhas() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Trail>>(empty);

  const list = useQuery({
    queryKey: ["trails-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trails").select("*").order("order_index");
      if (error) throw error;
      return data as Trail[];
    },
  });

  const save = useMutation({
    mutationFn: async (t: Partial<Trail>) => {
      const payload = { ...t, price_cents: Number(t.price_cents) || 0, order_index: Number(t.order_index) || 0 };
      if (t.id) {
        const { error } = await supabase.from("trails").update(payload).eq("id", t.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("trails").insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trails-admin"] });
      setOpen(false);
      setForm(empty);
      toast.success("Trilha salva");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trails").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trails-admin"] });
      toast.success("Trilha excluída");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trilhas / Nichos</h1>
          <p className="text-muted-foreground text-sm">Robótica, Biomédica, Drones, IA, Segurança Pública, APH…</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm(empty); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setForm(empty)}>Nova trilha</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{form.id ? "Editar trilha" : "Nova trilha"}</DialogTitle></DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); save.mutate(form); }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Nome</Label>
                  <Input required value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input required value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Descrição</Label>
                <Textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Trail["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Cor (hex)</Label>
                  <Input value={form.color ?? ""} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="#00e5ff" />
                </div>
                <div className="space-y-1.5">
                  <Label>Ordem</Label>
                  <Input type="number" value={form.order_index ?? 0} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 items-end">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label className="cursor-pointer">Gratuita</Label>
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
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{t.slug}</TableCell>
                <TableCell><Badge variant={t.status === "published" ? "default" : "secondary"}>{t.status}</Badge></TableCell>
                <TableCell>{t.is_free ? "Grátis" : `R$ ${(t.price_cents / 100).toFixed(2)}`}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => { setForm(t); setOpen(true); }}>Editar</Button>
                  <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Excluir "${t.name}"?`)) del.mutate(t.id); }}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
            {list.data?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma trilha ainda.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

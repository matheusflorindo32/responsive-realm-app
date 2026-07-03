import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function CursoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const course = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
  });

  const modules = useQuery({
    queryKey: ["modules", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("course_id", id!)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const addModule = useMutation({
    mutationFn: async (title: string) => {
      const orderIndex = (modules.data?.length ?? 0);
      const { error } = await supabase.from("modules").insert({ course_id: id!, title, order_index: orderIndex });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules", id] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const delModule = useMutation({
    mutationFn: async (mid: string) => {
      const { error } = await supabase.from("modules").delete().eq("id", mid);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules", id] }),
  });

  const [newModuleTitle, setNewModuleTitle] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/admin/ensino/cursos" className="text-xs text-muted-foreground hover:text-foreground">← Voltar</Link>
          <h1 className="text-2xl font-bold mt-1">{course.data?.title ?? "…"}</h1>
          <p className="text-muted-foreground text-sm">Módulos e aulas do curso</p>
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (newModuleTitle.trim()) { addModule.mutate(newModuleTitle.trim()); setNewModuleTitle(""); } }}
        className="flex gap-2"
      >
        <Input placeholder="Título do novo módulo" value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} />
        <Button type="submit">Adicionar módulo</Button>
      </form>

      <div className="space-y-4">
        {modules.data?.map((m: any) => (
          <Card key={m.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{m.title}</CardTitle>
              <div className="flex gap-2">
                <LessonDialog moduleId={m.id} orderIndex={m.lessons?.length ?? 0} onSaved={() => qc.invalidateQueries({ queryKey: ["modules", id] })} />
                <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Excluir módulo "${m.title}"?`)) delModule.mutate(m.id); }}>Excluir</Button>
              </div>
            </CardHeader>
            <CardContent>
              {m.lessons?.length ? (
                <ul className="divide-y divide-border">
                  {m.lessons.sort((a: any, b: any) => a.order_index - b.order_index).map((l: any) => (
                    <li key={l.id} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-mono">{l.order_index + 1}</span>
                        <span>{l.title}</span>
                        {l.is_preview && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Amostra</span>}
                      </div>
                      <Button
                        size="sm" variant="ghost"
                        onClick={async () => {
                          if (!confirm(`Excluir aula "${l.title}"?`)) return;
                          await supabase.from("lessons").delete().eq("id", l.id);
                          qc.invalidateQueries({ queryKey: ["modules", id] });
                        }}
                      >Excluir</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma aula ainda.</p>
              )}
            </CardContent>
          </Card>
        ))}
        {modules.data?.length === 0 && <p className="text-muted-foreground text-sm">Nenhum módulo. Crie o primeiro acima.</p>}
      </div>
    </div>
  );
}

function LessonDialog({ moduleId, orderIndex, onSaved }: { moduleId: string; orderIndex: number; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ content_type: "video", is_preview: false });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = (form.slug || form.title || "aula").toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const { error } = await supabase.from("lessons").insert({
      module_id: moduleId,
      title: form.title,
      slug,
      content_type: form.content_type,
      video_url: form.video_url || null,
      content_md: form.content_md || null,
      duration_sec: form.duration_sec ? Number(form.duration_sec) : null,
      is_preview: !!form.is_preview,
      order_index: orderIndex,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Aula adicionada");
    setForm({ content_type: "video", is_preview: false });
    setOpen(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm">+ Aula</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nova aula</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input required value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={form.content_type} onValueChange={(v) => setForm({ ...form, content_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="file">Arquivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Duração (seg)</Label>
              <Input type="number" value={form.duration_sec ?? ""} onChange={(e) => setForm({ ...form, duration_sec: e.target.value })} />
            </div>
          </div>
          {form.content_type === "video" && (
            <div className="space-y-1.5">
              <Label>URL do vídeo (YouTube, Vimeo, etc)</Label>
              <Input value={form.video_url ?? ""} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
            </div>
          )}
          {form.content_type === "text" && (
            <div className="space-y-1.5">
              <Label>Conteúdo (Markdown)</Label>
              <Textarea rows={5} value={form.content_md ?? ""} onChange={(e) => setForm({ ...form, content_md: e.target.value })} />
            </div>
          )}
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label>Aula grátis de amostra</Label>
            <Switch checked={!!form.is_preview} onCheckedChange={(v) => setForm({ ...form, is_preview: v })} />
          </div>
          <Button type="submit" className="w-full">Adicionar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

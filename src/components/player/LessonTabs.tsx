import { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, Clock, User } from "lucide-react";

interface Props {
  lesson: any;
  courseInstructor?: string;
}

export function LessonTabs({ lesson, courseInstructor }: Props) {
  const [notes, setNotes] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const timer = useRef<any>();

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("lesson_notes").select("content,updated_at").eq("user_id", u.user.id).eq("lesson_id", lesson.id).maybeSingle();
      setNotes(data?.content ?? "");
      setSavedAt(data?.updated_at ?? null);
    })();
  }, [lesson.id]);

  const onChange = (v: string) => {
    setNotes(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      await supabase.from("lesson_notes").upsert({ user_id: u.user.id, lesson_id: lesson.id, content: v, updated_at: new Date().toISOString() }, { onConflict: "user_id,lesson_id" });
      setSavedAt(new Date().toISOString());
    }, 800);
  };

  const attachments = Array.isArray(lesson.attachments) ? lesson.attachments : [];

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="about">Sobre</TabsTrigger>
        <TabsTrigger value="materials">Materiais {attachments.length > 0 && <span className="ml-1 text-[10px] tabular-nums">({attachments.length})</span>}</TabsTrigger>
        <TabsTrigger value="notes">Anotações</TabsTrigger>
      </TabsList>

      <TabsContent value="about" className="mt-4 space-y-4">
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {lesson.duration_sec > 0 && (
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{Math.round(lesson.duration_sec/60)} min</span>
          )}
          {courseInstructor && (
            <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{courseInstructor}</span>
          )}
        </div>
        {lesson.content_md ? (
          <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">{lesson.content_md}</div>
        ) : (
          <p className="text-sm text-muted-foreground">Sem descrição adicional para esta aula.</p>
        )}
      </TabsContent>

      <TabsContent value="materials" className="mt-4">
        {attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum material complementar disponível.</p>
        ) : (
          <ul className="space-y-2">
            {attachments.map((a: any, i: number) => (
              <li key={i}>
                <a href={a.url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 rounded-lg border border-border/60 p-3 hover:border-primary/40 hover:bg-muted/30 transition-colors">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <span className="flex-1 text-sm truncate">{a.label ?? a.url}</span>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="notes" className="mt-4 space-y-2">
        <Textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Suas anotações privadas sobre esta aula…"
          rows={8}
          className="resize-y"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Visíveis apenas para você. Salva automaticamente.</span>
          {savedAt && <span>Salvo em {new Date(savedAt).toLocaleTimeString("pt-BR")}</span>}
        </div>
      </TabsContent>
    </Tabs>
  );
}

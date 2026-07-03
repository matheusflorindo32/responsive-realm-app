import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Copy, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Certificados() {
  const list = useQuery({
    queryKey: ["my-certs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certificates").select("*").order("issued_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/certificado/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Link de validação copiado");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certificados</h1>
        <p className="text-muted-foreground">Emitidos automaticamente ao concluir 100% de um curso. Cada certificado tem uma página pública de validação.</p>
      </div>

      {list.data?.length === 0 && (
        <Card><CardContent className="py-16 text-center text-muted-foreground">
          <Award className="w-10 h-10 mx-auto mb-3 opacity-40" />
          Nenhum certificado ainda. Complete um curso para receber o primeiro.
        </CardContent></Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.data?.map((c: any) => (
          <Card key={c.id} className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-card to-card">
            <CardHeader className="flex-row items-start gap-3 space-y-0">
              <div className="w-11 h-11 rounded-lg bg-amber-500/20 grid place-items-center shrink-0">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg leading-tight">{c.course_title ?? "Certificado"}</CardTitle>
                <div className="text-xs text-muted-foreground mt-1">Emitido em {new Date(c.issued_at).toLocaleDateString("pt-BR")}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-xs">
                {c.hours != null && (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />{c.hours}h de carga horária
                  </span>
                )}
                <span className="font-mono text-muted-foreground truncate">#{c.certificate_code}</span>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <a href={`/certificado/${c.certificate_code}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Página pública
                  </a>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => copyLink(c.certificate_code)}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

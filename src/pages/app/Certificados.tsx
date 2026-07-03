import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Certificados() {
  const list = useQuery({
    queryKey: ["my-certs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certificates").select("*, courses(title), trails(name)").order("issued_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certificados</h1>
        <p className="text-muted-foreground">Emitidos automaticamente ao concluir 100% de um curso.</p>
      </div>
      {list.data?.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          Nenhum certificado ainda. Complete um curso para receber o primeiro.
        </CardContent></Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.data?.map((c: any) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-lg">{c.courses?.title ?? c.trails?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Emitido em {new Date(c.issued_at).toLocaleDateString()}</div>
              <div className="text-xs font-mono mt-2 bg-muted px-2 py-1 rounded inline-block">Código: {c.certificate_code}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

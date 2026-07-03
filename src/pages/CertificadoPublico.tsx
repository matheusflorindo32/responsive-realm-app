import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import { Award, CheckCircle2, XCircle, Calendar, Clock, Hash } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

export default function CertificadoPublico() {
  const { code } = useParams<{ code: string }>();
  const url = typeof window !== "undefined" ? `${window.location.origin}/certificado/${code}` : "";

  const cert = useQuery({
    queryKey: ["verify-cert", code],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("verify_certificate", { _code: code! });
      if (error) throw error;
      return (data as any)?.[0] ?? null;
    },
  });

  if (cert.isLoading) {
    return <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">Verificando…</div>;
  }

  if (!cert.data) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground p-6">
        <div className="max-w-md text-center space-y-4">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Certificado não encontrado</h1>
          <p className="text-muted-foreground">O código <code className="font-mono text-sm">{code}</code> não corresponde a nenhum certificado emitido.</p>
        </div>
      </div>
    );
  }

  const c = cert.data as any;
  const valid = c.status === "valid";

  return (
    <>
      <Helmet>
        <title>{`Certificado — ${c.student_name} · ${c.course_title}`}</title>
        <meta name="description" content={`Certificado emitido para ${c.student_name} no curso ${c.course_title}. Código de validação ${c.certificate_code}.`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {valid ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-destructive" />}
              {valid ? "Certificado válido" : "Certificado revogado"}
            </div>
          </div>

          {/* Diploma */}
          <div className="relative rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-card via-card to-amber-500/[0.03] p-10 md:p-16 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative grid md:grid-cols-[1fr_auto] gap-10 items-start">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 grid place-items-center">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-amber-400/80">Tropa Científica</div>
                    <div className="text-xs text-muted-foreground">Certificado de conclusão</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Certificamos que</p>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{c.student_name}</h1>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">concluiu com êxito o curso</p>
                  <h2 className="text-xl md:text-2xl font-semibold text-primary">{c.course_title}</h2>
                </div>

                <div className="flex flex-wrap gap-6 pt-4 text-sm">
                  {c.hours != null && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span><strong className="tabular-nums">{c.hours}h</strong> de carga horária</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Emitido em <strong>{new Date(c.issued_at).toLocaleDateString("pt-BR")}</strong></span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Hash className="w-3 h-3" />
                  {c.certificate_code}
                </div>
              </div>

              <div className="shrink-0 space-y-3 text-center">
                <div className="bg-white p-3 rounded-lg inline-block">
                  <QRCodeSVG value={url} size={140} level="M" />
                </div>
                <p className="text-[10px] text-muted-foreground max-w-[140px]">Escaneie para validar</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={() => window.print()}>Imprimir / Salvar PDF</Button>
            <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(url); }}>Copiar link</Button>
          </div>

          <p className="text-center text-xs text-muted-foreground max-w-lg mx-auto">
            Validação oficial. Este documento foi verificado no banco de dados da Tropa Científica em {new Date().toLocaleString("pt-BR")}.
          </p>
        </div>
      </div>
    </>
  );
}

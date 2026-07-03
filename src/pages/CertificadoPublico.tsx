import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import { Award, CheckCircle2, XCircle, Calendar, Clock, Hash, Route as RouteIcon, AlertTriangle, ShieldAlert, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export default function CertificadoPublico() {
  const { code } = useParams<{ code: string }>();
  const url = typeof window !== "undefined" ? `${window.location.origin}/certificado/${code}` : "";

  const codeFormatValid = !!code && /^[A-Za-z0-9-]{6,64}$/.test(code);

  const cert = useQuery({
    queryKey: ["verify-cert", code],
    enabled: codeFormatValid,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("verify_certificate", { _code: code! });
      if (error) throw error;
      return (data as any)?.[0] ?? null;
    },
  });

  const ErrorLayout = ({
    icon: Icon,
    iconClass,
    title,
    description,
    hint,
    metaTitle,
  }: {
    icon: LucideIcon;
    iconClass: string;
    title: string;
    description: ReactNode;
    hint?: ReactNode;
    metaTitle: string;
  }) => (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={typeof description === "string" ? description : title} />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 grid place-items-center px-4 py-12">
        <div className="max-w-lg w-full text-center space-y-6" role="alert" aria-live="polite">
          <div className={`w-20 h-20 mx-auto rounded-full grid place-items-center border ${iconClass}`}>
            <Icon className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <ShieldAlert className="w-3.5 h-3.5" />
              Validação de certificado
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
            <div className="text-muted-foreground text-sm leading-relaxed">{description}</div>
          </div>
          {hint && (
            <div className="rounded-lg border border-border/60 bg-card/50 p-4 text-left text-sm text-muted-foreground">
              {hint}
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>Voltar</Button>
            <Button size="sm" onClick={() => (window.location.href = "/")}>Ir para o início</Button>
          </div>
          <p className="text-xs text-muted-foreground/70">
            Verificado em {new Date().toLocaleString("pt-BR")}
          </p>
        </div>
      </div>
    </>
  );

  if (!codeFormatValid) {
    return (
      <ErrorLayout
        icon={AlertTriangle}
        iconClass="border-amber-500/40 bg-amber-500/10 text-amber-400"
        metaTitle="Código de certificado inválido — Tropa Científica"
        title="Código com formato inválido"
        description={
          <>
            O código informado{" "}
            {code ? (
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded break-all">{code}</code>
            ) : (
              "está ausente"
            )}{" "}
            não segue o padrão esperado.
          </>
        }
        hint={<>Códigos válidos contêm apenas letras, números e hífens (6 a 64 caracteres). Verifique se copiou o código completo, sem espaços ou caracteres extras.</>}
      />
    );
  }

  if (cert.isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">
        <div className="flex items-center gap-3 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Verificando certificado…
        </div>
      </div>
    );
  }

  if (cert.isError) {
    return (
      <ErrorLayout
        icon={XCircle}
        iconClass="border-destructive/40 bg-destructive/10 text-destructive"
        metaTitle="Erro na validação — Tropa Científica"
        title="Não foi possível validar agora"
        description="Ocorreu um erro ao consultar o certificado. Verifique sua conexão e tente novamente em instantes."
        hint={<>Se o problema persistir, entre em contato com o suporte informando o código.</>}
      />
    );
  }

  if (!cert.data) {
    return (
      <ErrorLayout
        icon={XCircle}
        iconClass="border-destructive/40 bg-destructive/10 text-destructive"
        metaTitle="Certificado não encontrado — Tropa Científica"
        title="Certificado não encontrado"
        description={
          <>
            O código{" "}
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded break-all">{code}</code>{" "}
            não corresponde a nenhum certificado emitido pela Tropa Científica.
          </>
        }
        hint={<>Confirme com quem enviou o certificado se o código está correto. Certificados também podem ter sido cancelados antes da emissão oficial.</>}
      />
    );
  }

  const c = cert.data as any;
  const valid = c.status === "valid";
  const issuer = c.issuer || "Tropa Científica";

  return (
    <>
      <Helmet>
        <title>{`Certificado — ${c.student_name} · ${c.course_title}${valid ? "" : " (REVOGADO)"}`}</title>
        <meta
          name="description"
          content={`Certificado emitido para ${c.student_name} no curso ${c.course_title}. Código ${c.certificate_code}.${valid ? "" : " — REVOGADO"}`}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2" role="status" aria-live="polite">
            <div
              className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] ${
                valid ? "text-muted-foreground" : "text-destructive"
              }`}
            >
              {valid ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4" />}
              {valid ? "Certificado válido" : "Certificado revogado"}
            </div>
          </div>

          {!valid && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong className="block">Este certificado foi revogado</strong>
                {c.revoked_at && (
                  <span className="text-destructive/80">
                    Revogado em {new Date(c.revoked_at).toLocaleString("pt-BR")}. Não deve ser aceito como comprovante de conclusão.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Diploma */}
          <div
            className={`relative rounded-2xl border-2 ${
              valid ? "border-amber-500/40" : "border-destructive/60"
            } bg-gradient-to-br from-card via-card to-amber-500/[0.03] p-10 md:p-16 shadow-2xl overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {!valid && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden"
              >
                <div className="rotate-[-18deg] border-4 border-destructive/70 text-destructive/80 text-6xl md:text-8xl font-black tracking-[0.3em] px-8 py-3 opacity-40 select-none">
                  REVOGADO
                </div>
              </div>
            )}

            <div className="relative grid md:grid-cols-[1fr_auto] gap-10 items-start">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 grid place-items-center">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-amber-400/80">{issuer}</div>
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
                  {c.trail_name && (
                    <p className="pt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <RouteIcon className="w-4 h-4" />
                      Trilha: <strong className="text-foreground font-medium">{c.trail_name}</strong>
                    </p>
                  )}
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
            Validação oficial. Este documento foi verificado no banco de dados da {issuer} em {new Date().toLocaleString("pt-BR")}.
          </p>
        </div>
      </div>
    </>
  );
}

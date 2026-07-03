import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import { Award, CheckCircle2, XCircle, Calendar, Clock, Hash, Route as RouteIcon, AlertTriangle, ShieldAlert, Loader2, ArrowLeft, Home, Copy, LifeBuoy } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const DEMO_CERT = {
  certificate_code: "TROPA-DEMO-2026",
  student_name: "Matheus Florindo de Deus",
  course_title: "Formação Premium Elite em Ciência, Tecnologia e Operações",
  trail_name: "Tropa Científica — Inteligência Aplicada à Segurança Pública",
  issuer: "Tropa Científica",
  hours: 40,
  issued_at: "2026-07-03T12:00:00-03:00",
  status: "valid" as const,
  revoked_at: null as string | null,
};

export default function CertificadoPublico() {
  const { code } = useParams<{ code: string }>();
  const isDemo = !!code && code.toLowerCase() === "demo";
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/certificado/${isDemo ? "demo" : code}`
      : "";

  const codeFormatValid = !!code && /^[A-Za-z0-9-]{6,64}$/.test(code);

  const cert = useQuery({
    queryKey: ["verify-cert", code],
    enabled: !isDemo && codeFormatValid,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("verify_certificate", { _code: code! });
      if (error) throw error;
      return (data as any)?.[0] ?? null;
    },
  });

  const ErrorLayout = ({
    icon: Icon,
    accent,
    statusCode,
    statusLabel,
    eyebrow,
    title,
    description,
    hint,
    diagnostics,
    metaTitle,
  }: {
    icon: LucideIcon;
    accent: "amber" | "destructive";
    statusCode: string;
    statusLabel: string;
    eyebrow: string;
    title: string;
    description: ReactNode;
    hint?: ReactNode;
    diagnostics: { label: string; value: ReactNode }[];
    metaTitle: string;
  }) => {
    const accentText = accent === "amber" ? "text-amber-400" : "text-destructive";
    const accentBorder = accent === "amber" ? "border-amber-500/30" : "border-destructive/40";
    const accentGlow =
      accent === "amber"
        ? "from-amber-500/20 via-amber-500/5 to-transparent"
        : "from-destructive/25 via-destructive/5 to-transparent";
    const descText = typeof description === "string" ? description : title;

    return (
      <>
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={descText} />
          <meta name="robots" content="noindex" />
        </Helmet>

        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
          {/* Grid + radial glow backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--foreground) / 0.08) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.08) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
            }}
          />
          <div
            aria-hidden
            className={`absolute -top-40 left-1/2 -translate-x-1/2 h-[560px] w-[900px] rounded-full blur-3xl bg-gradient-radial ${accentGlow}`}
            style={{ background: `radial-gradient(closest-side, var(--tw-gradient-stops))` }}
          />
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Header bar */}
          <header className="relative z-10 mx-auto max-w-6xl px-6 pt-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${accent === "amber" ? "bg-amber-400" : "bg-destructive"} animate-pulse`} />
              Tropa Científica · Validação
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground hidden sm:block">
              /certificado
            </div>
          </header>

          <main className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-20 items-start" role="alert" aria-live="polite">
              {/* Left: editorial */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className={`relative h-14 w-14 rounded-2xl border ${accentBorder} bg-card/40 backdrop-blur grid place-items-center`}>
                    <Icon className={`w-6 h-6 ${accentText}`} />
                    <div className={`absolute inset-0 rounded-2xl blur-xl opacity-40 ${accent === "amber" ? "bg-amber-500/30" : "bg-destructive/30"}`} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={`${accentText} font-semibold`}>{statusCode}</span>
                      <span className="h-3 w-px bg-border" />
                      <span className="text-muted-foreground uppercase tracking-wider">{statusLabel}</span>
                    </div>
                  </div>
                </div>

                <h1 className="font-serif text-[2.5rem] leading-[1.05] md:text-6xl md:leading-[1.02] tracking-tight text-balance">
                  {title}
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  {description}
                </p>

                {hint && (
                  <div className={`relative rounded-xl border ${accentBorder} bg-card/40 backdrop-blur px-5 py-4 text-sm text-muted-foreground/90 max-w-xl`}>
                    <div className={`absolute -left-px top-4 bottom-4 w-[2px] ${accent === "amber" ? "bg-amber-400" : "bg-destructive"} rounded-full`} />
                    <div className="pl-2 flex gap-3">
                      <LifeBuoy className={`w-4 h-4 shrink-0 mt-0.5 ${accentText}`} />
                      <div>{hint}</div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button size="lg" onClick={() => (window.location.href = "/")} className="group gap-2">
                    <Home className="w-4 h-4" />
                    Ir para o início
                    <span className="ml-1 opacity-40 group-hover:opacity-100 transition-opacity">→</span>
                  </Button>
                  <Button size="lg" variant="ghost" onClick={() => window.history.back()} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </Button>
                  {code && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(code);
                        toast.success("Código copiado");
                      }}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar código
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Right: diagnostic card */}
              <motion.aside
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                  {/* corner ticks */}
                  <span className="absolute top-2 left-2 h-2 w-2 border-t border-l border-foreground/30" aria-hidden />
                  <span className="absolute top-2 right-2 h-2 w-2 border-t border-r border-foreground/30" aria-hidden />
                  <span className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-foreground/30" aria-hidden />
                  <span className="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-foreground/30" aria-hidden />

                  <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/20">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Diagnóstico
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${accentText}`}>
                      {statusCode}
                    </span>
                  </div>

                  <dl className="divide-y divide-border/60">
                    {diagnostics.map((row) => (
                      <div key={row.label} className="grid grid-cols-[110px_1fr] gap-4 px-5 py-3.5 items-start">
                        <dt className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground pt-0.5">
                          {row.label}
                        </dt>
                        <dd className="text-sm font-mono text-foreground/90 break-all">{row.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="px-5 py-3 border-t border-border/60 bg-muted/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                    <span>Assinado · Tropa Científica</span>
                    <span className="tabular-nums">
                      {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </motion.aside>
            </div>
          </main>

          <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-8 pt-4 text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground/70 flex flex-wrap items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Tropa Científica</span>
            <span>Verificado em {new Date().toLocaleString("pt-BR")}</span>
          </footer>
        </div>
      </>
    );
  };

  const codeChip = (
    <code className="inline-block font-mono text-xs px-2 py-1 rounded-md border border-border/60 bg-muted/40 break-all">
      {code || "—"}
    </code>
  );

  if (!isDemo && !codeFormatValid) {
    return (
      <ErrorLayout
        icon={AlertTriangle}
        accent="amber"
        statusCode="400"
        statusLabel="Formato inválido"
        eyebrow="Erro de validação"
        metaTitle="Código de certificado inválido — Tropa Científica"
        title="Esse código não parece um certificado."
        description={
          <>
            O identificador informado não segue o padrão emitido pela Tropa Científica.
            Verifique o link antes de tentar novamente.
          </>
        }
        hint={
          <>
            Códigos válidos usam <strong className="text-foreground">letras, números e hífens</strong>,
            com 6 a 64 caracteres. Um espaço ou caractere extra basta para invalidar.
          </>
        }
        diagnostics={[
          { label: "Código", value: codeChip },
          { label: "Esperado", value: "^[A-Za-z0-9-]{6,64}$" },
          { label: "Origem", value: "Link direto" },
          { label: "Status", value: <span className="text-amber-400">MALFORMED</span> },
        ]}
      />
    );
  }

  if (cert.isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">
        <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-[0.24em]">
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
        accent="destructive"
        statusCode="503"
        statusLabel="Serviço indisponível"
        eyebrow="Falha temporária"
        metaTitle="Erro na validação — Tropa Científica"
        title="Não conseguimos validar agora."
        description="A consulta ao registro oficial falhou. Verifique sua conexão e tente novamente em instantes."
        hint={<>Se o problema persistir, entre em contato com o suporte informando o código abaixo.</>}
        diagnostics={[
          { label: "Código", value: codeChip },
          { label: "Serviço", value: "verify_certificate" },
          { label: "Retentativa", value: "Automática em segundos" },
          { label: "Status", value: <span className="text-destructive">UPSTREAM_ERROR</span> },
        ]}
      />
    );
  }

  if (!isDemo && !cert.data) {
    return (
      <ErrorLayout
        icon={XCircle}
        accent="destructive"
        statusCode="404"
        statusLabel="Não encontrado"
        eyebrow="Registro inexistente"
        metaTitle="Certificado não encontrado — Tropa Científica"
        title="Nenhum certificado com esse código."
        description={
          <>
            Este identificador não corresponde a nenhum certificado emitido pela Tropa Científica.
            Ele pode estar incorreto ou nunca ter sido oficializado.
          </>
        }
        hint={
          <>
            Confirme com quem enviou o certificado se o código está correto.
            Emissões canceladas antes da oficialização também não aparecem aqui.
          </>
        }
        diagnostics={[
          { label: "Código", value: codeChip },
          { label: "Registro", value: "Não localizado" },
          { label: "Emissor", value: "Tropa Científica" },
          { label: "Status", value: <span className="text-destructive">NOT_FOUND</span> },
        ]}
      />
    );
  }


  const c = isDemo ? DEMO_CERT : (cert.data as any);
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
                isDemo ? "text-primary" : valid ? "text-muted-foreground" : "text-destructive"
              }`}
            >
              {isDemo ? (
                <Award className="w-4 h-4 text-primary" />
              ) : valid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {isDemo
                ? "Certificado demonstrativo — modelo público"
                : valid
                ? "Certificado válido"
                : "Certificado revogado"}
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

            {isDemo && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden"
              >
                <div className="rotate-[-14deg] border-2 border-primary/40 text-primary/30 text-5xl md:text-7xl font-black tracking-[0.35em] px-8 py-3 select-none">
                  MODELO
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

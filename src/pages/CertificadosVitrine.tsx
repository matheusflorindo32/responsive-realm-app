import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ArrowRight,
  Calendar,
  Clock,
  Hash,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Loader2,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PublicCert = {
  certificate_code: string;
  student_name: string | null;
  course_title: string | null;
  trail_name: string | null;
  issuer: string | null;
  hours: number | null;
  issued_at: string;
};

const DEMO: PublicCert = {
  certificate_code: "TROPA-DEMO-2026",
  student_name: "Matheus Florindo de Deus",
  course_title: "Formação Premium Elite em Ciência, Tecnologia e Operações",
  trail_name: "Tropa Científica — Inteligência Aplicada à Segurança Pública",
  issuer: "Tropa Científica",
  hours: 40,
  issued_at: "2026-07-03T12:00:00-03:00",
};

function certUrl(code: string, isDemo = false) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/certificado/${isDemo ? "demo" : code}`;
}

function CertCard({
  cert,
  isDemo = false,
  featured = false,
}: {
  cert: PublicCert;
  isDemo?: boolean;
  featured?: boolean;
}) {
  const href = isDemo ? "/certificado/demo" : `/certificado/${cert.certificate_code}`;
  const qrValue = certUrl(cert.certificate_code, isDemo);
  const issuer = cert.issuer || "Tropa Científica";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl border ${
        featured ? "border-amber-500/40" : "border-border/60"
      } bg-card/60 backdrop-blur-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow`}
    >
      {/* corner ticks */}
      <span className="absolute top-2 left-2 h-2 w-2 border-t border-l border-foreground/30" aria-hidden />
      <span className="absolute top-2 right-2 h-2 w-2 border-t border-r border-foreground/30" aria-hidden />
      <span className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-foreground/30" aria-hidden />
      <span className="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-foreground/30" aria-hidden />

      {featured && (
        <div
          aria-hidden
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl bg-amber-500/20"
        />
      )}

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/20">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
          {isDemo ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Demonstrativo
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Válido
            </>
          )}
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          {issuer}
        </span>
      </div>

      {/* Body */}
      <div className="relative grid grid-cols-[1fr_auto] gap-5 p-5">
        <div className="min-w-0 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Certificamos que
          </p>
          <h3 className="font-serif text-xl md:text-2xl leading-tight tracking-tight text-balance">
            {cert.student_name || "—"}
          </h3>
          <p className="text-sm text-primary font-medium line-clamp-2">
            {cert.course_title || "—"}
          </p>
          {cert.trail_name && (
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground line-clamp-2">
              <RouteIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{cert.trail_name}</span>
            </p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-xs text-muted-foreground">
            {cert.hours != null && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <strong className="tabular-nums text-foreground">{cert.hours}h</strong>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(cert.issued_at).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1 font-mono text-[11px] text-muted-foreground">
            <Hash className="w-3 h-3" />
            <span className="break-all">{cert.certificate_code}</span>
          </div>
        </div>

        {/* QR */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG value={qrValue} size={96} level="M" />
          </div>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground text-center max-w-[96px] leading-tight">
            Escaneie
          </span>
        </div>
      </div>

      {/* Footer action */}
      <div className="relative px-5 pb-5 pt-1">
        <Button asChild size="sm" variant={featured ? "default" : "outline"} className="w-full gap-2 group/btn">
          <Link to={href} aria-label={`Ver status do certificado ${cert.certificate_code}`}>
            Ver status
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}

type SearchState =
  | { kind: "idle" }
  | { kind: "loading"; code: string }
  | { kind: "invalid"; code: string }
  | { kind: "not_found"; code: string }
  | { kind: "error"; code: string }
  | { kind: "found"; code: string; cert: any };

export default function CertificadosVitrine() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState<SearchState>({ kind: "idle" });

  const q = useQuery({
    queryKey: ["public-certificates"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_public_certificates", { _limit: 12 });
      if (error) throw error;
      return (data as PublicCert[]) ?? [];
    },
  });

  const reais = (q.data ?? []).filter((c) => c.certificate_code !== "TROPA-DEMO-2026");

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    const raw = query.trim();
    if (!raw) return;
    if (raw.toLowerCase() === "demo") {
      navigate("/certificado/demo");
      return;
    }
    if (!/^[A-Za-z0-9-]{6,64}$/.test(raw)) {
      setSearch({ kind: "invalid", code: raw });
      return;
    }
    setSearch({ kind: "loading", code: raw });
    const { data, error } = await supabase.rpc("verify_certificate", { _code: raw });
    if (error) {
      setSearch({ kind: "error", code: raw });
      return;
    }
    const cert = (data as any)?.[0] ?? null;
    if (!cert) {
      setSearch({ kind: "not_found", code: raw });
      return;
    }
    setSearch({ kind: "found", code: raw, cert });
  }


  return (
    <>
      <Helmet>
        <title>Vitrine de certificados — Tropa Científica</title>
        <meta
          name="description"
          content="Vitrine pública dos certificados emitidos pela Tropa Científica. Escaneie o QR ou clique para validar o status de cada certificado."
        />
      </Helmet>

      <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
        {/* Backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--foreground) / 0.08) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at 50% 20%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 20%, black 30%, transparent 75%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[560px] w-[900px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--primary) / 0.22), transparent 70%)",
          }}
        />

        <header className="relative z-10 mx-auto max-w-6xl px-6 pt-10 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Tropa Científica · Vitrine
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground hidden sm:block">
            /certificados
          </span>
        </header>

        <main className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-2xl border border-primary/30 bg-card/40 backdrop-blur grid place-items-center">
                <Award className="w-5 h-5 text-primary" />
                <div className="absolute inset-0 rounded-2xl blur-xl opacity-40 bg-primary/30" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                Vitrine pública
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl leading-[1.02] tracking-tight text-balance">
              Certificados emitidos pela Tropa Científica.
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Escaneie o QR Code ou clique em "Ver status" para validar cada certificado no
              registro oficial. Todos os cartões abaixo apontam para a página pública de
              validação, com status em tempo real.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="gap-2">
                <Link to="/certificado/demo">
                  <Sparkles className="w-4 h-4" />
                  Ver certificado demonstrativo
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/">
                  Voltar ao início
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Busca por código */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 md:p-6 shadow-lg"
            aria-labelledby="busca-cert-title"
          >
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h2
                id="busca-cert-title"
                className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground"
              >
                Validar por código
              </h2>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="cert-code" className="sr-only">
                Código do certificado
              </label>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="cert-code"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Digite o código (ex.: TROPA-ELITE-2026)"
                  className="pl-9 h-11 font-mono text-sm tracking-wider"
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="busca-cert-hint"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="gap-2 sm:min-w-[140px]"
                disabled={search.kind === "loading"}
              >
                {search.kind === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Validar
              </Button>
            </form>

            <p id="busca-cert-hint" className="mt-2.5 text-xs text-muted-foreground">
              Letras, números e hífens · 6 a 64 caracteres. Digite <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-muted/40 border border-border/60">demo</code> para ver o modelo público.
            </p>

            {/* Resultado inline */}
            <AnimatePresence mode="wait">
              {search.kind !== "idle" && (
                <motion.div
                  key={search.kind + search.code}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-5"
                  role="status"
                  aria-live="polite"
                >
                  {search.kind === "loading" && (
                    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verificando <span className="font-mono">{search.code}</span>…
                    </div>
                  )}

                  {search.kind === "invalid" && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/[0.06] px-4 py-3 text-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">Formato inválido</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          <span className="font-mono break-all">{search.code}</span> não segue o padrão de códigos da Tropa Científica.
                        </p>
                      </div>
                    </div>
                  )}

                  {search.kind === "not_found" && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/[0.06] px-4 py-3 text-sm">
                      <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">Certificado não encontrado</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          Nenhum registro para <span className="font-mono break-all">{search.code}</span>. Confirme o código com quem enviou.
                        </p>
                      </div>
                    </div>
                  )}

                  {search.kind === "error" && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/[0.06] px-4 py-3 text-sm">
                      <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">Falha ao validar</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          O serviço de validação não respondeu. Tente novamente em instantes.
                        </p>
                      </div>
                    </div>
                  )}

                  {search.kind === "found" && (() => {
                    const c = search.cert;
                    const valid = c.status === "valid";
                    return (
                      <div
                        className={`rounded-xl border ${
                          valid ? "border-emerald-500/40 bg-emerald-500/[0.05]" : "border-destructive/50 bg-destructive/[0.06]"
                        } px-4 py-4`}
                      >
                        <div className="flex items-start gap-3">
                          {valid ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <p className={`text-[10px] font-mono uppercase tracking-[0.24em] ${valid ? "text-emerald-400" : "text-destructive"}`}>
                                {valid ? "Certificado válido" : "Certificado revogado"}
                              </p>
                              <span className="font-mono text-[11px] text-muted-foreground break-all">
                                {c.certificate_code}
                              </span>
                            </div>
                            <p className="font-serif text-xl leading-tight">
                              {c.student_name}
                            </p>
                            <p className="text-sm text-primary">{c.course_title}</p>
                            {c.trail_name && (
                              <p className="text-xs text-muted-foreground">Trilha: {c.trail_name}</p>
                            )}
                            <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground">
                              {c.hours != null && (
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  <strong className="tabular-nums text-foreground">{c.hours}h</strong>
                                </span>
                              )}
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(c.issued_at).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <div className="pt-2">
                              <Button asChild size="sm" variant={valid ? "default" : "outline"} className="gap-2">
                                <Link to={`/certificado/${c.certificate_code}`}>
                                  Abrir página oficial
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>



          {/* Demo em destaque */}
          <section className="mt-16 space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
                Modelo demonstrativo
              </h2>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <CertCard cert={DEMO} isDemo featured />
              <div className="rounded-2xl border border-dashed border-border/60 p-6 flex flex-col justify-center text-sm text-muted-foreground bg-muted/10">
                <p className="font-serif text-2xl text-foreground leading-tight mb-3">
                  Como funciona a validação
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">01.</span>
                    Cada certificado emitido recebe um <strong className="text-foreground">código único</strong>.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">02.</span>
                    O QR Code aponta para <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-muted/40 border border-border/60">/certificado/&lt;código&gt;</code>.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">03.</span>
                    A página consulta o registro oficial e mostra <strong className="text-foreground">válido</strong> ou <strong className="text-destructive">revogado</strong>.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Certificados válidos recentes */}
          <section className="mt-16 space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
                Certificados válidos recentes
              </h2>
              <div className="flex-1 h-px bg-border/60" />
              {reais.length > 0 && (
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                  {reais.length.toString().padStart(2, "0")} publicados
                </span>
              )}
            </div>

            {q.isLoading ? (
              <div className="grid place-items-center py-16 text-muted-foreground">
                <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-[0.24em]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Carregando registros…
                </div>
              </div>
            ) : reais.length === 0 ? (
              <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-10 text-center space-y-3">
                <Award className="w-8 h-8 text-muted-foreground/60 mx-auto" />
                <p className="font-serif text-2xl leading-tight">
                  Nenhum certificado publicado ainda.
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Assim que os primeiros alunos concluírem suas formações, os certificados
                  aparecerão aqui — sempre com QR Code e link de validação.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reais.map((c) => (
                  <CertCard key={c.certificate_code} cert={c} />
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-4 text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground/70 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Tropa Científica</span>
          <span>Vitrine pública · atualizada em tempo real</span>
        </footer>
      </div>
    </>
  );
}

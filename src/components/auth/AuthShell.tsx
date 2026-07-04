import { Link } from "react-router-dom";
import { ShieldCheck, Award, Lock, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";
import iconUrl from "@/assets/tropa-icon.png";

interface Props {
  title: string;
  subtitle?: string;
  pageTitle: string;
  metaDescription?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, pageTitle, metaDescription, children, footer }: Props) {
  return (
    <div className="theme-auth min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
      </Helmet>

      <div className="relative min-h-screen grid lg:grid-cols-[1.05fr_1fr]">
        {/* Left brand panel */}
        <aside className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden">
          <div className="absolute inset-0 auth-grid-bg pointer-events-none" aria-hidden />
          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary/10 ring-1 ring-primary/30">
                <img src={iconUrl} alt="" className="h-8 w-8 object-contain" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="brand text-[13px] font-bold text-foreground">TROPA CIENTÍFICA</span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-mono">
                  Ciência · IA · Inovação
                </span>
              </div>
            </Link>
          </div>

          <div className="relative max-w-lg space-y-6">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-primary font-mono">
              <Sparkles size={14} /> Acesso institucional
            </span>
            <h1 className="text-4xl xl:text-5xl font-semibold leading-[1.05] text-foreground">
              Acesso seguro à sua jornada{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                científica
              </span>
              .
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Ambiente autenticado com criptografia de ponta, verificação de senhas
              comprometidas e proteção multi-fator para operações críticas.
            </p>
          </div>

          <div className="relative flex flex-wrap gap-2">
            <span className="trust-badge inline-flex items-center gap-2"><ShieldCheck size={12} /> Ambiente seguro</span>
            <span className="trust-badge inline-flex items-center gap-2"><Award size={12} /> Certificados digitais</span>
            <span className="trust-badge inline-flex items-center gap-2"><Lock size={12} /> Acesso protegido</span>
          </div>
        </aside>

        {/* Right form panel */}
        <main className="relative flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 auth-grid-bg lg:hidden pointer-events-none" aria-hidden />
          <div className="relative w-full max-w-[420px]">
            {/* mobile compact brand */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary/10 ring-1 ring-primary/30">
                  <img src={iconUrl} alt="" className="h-6 w-6 object-contain" />
                </span>
                <span className="brand text-[12px] font-bold">TROPA CIENTÍFICA</span>
              </Link>
            </div>

            <div className="auth-card p-8 sm:p-10 animate-fade-up">
              <header className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
                {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
              </header>
              {children}
            </div>

            {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}

            <p className="mt-8 text-center text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
              Tropa Científica · Tecnologia aplicada à educação
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

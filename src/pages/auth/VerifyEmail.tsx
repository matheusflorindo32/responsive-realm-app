import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Loader2, MailCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const nav = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Load current user; if already confirmed, bounce to /app
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!data.user) {
        nav("/login", { replace: true });
        return;
      }
      if (data.user.email_confirmed_at) {
        nav("/app", { replace: true });
        return;
      }
      setEmail(data.user.email ?? null);
      setChecking(false);
    })();

    // Auto-detect confirmation via auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user?.email_confirmed_at) {
        nav("/app", { replace: true });
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [nav]);

  // Cooldown tick
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const recheck = async () => {
    setChecking(true);
    const { data, error } = await supabase.auth.refreshSession();
    setChecking(false);
    if (error) {
      toast.error("Não foi possível verificar. Tente novamente.");
      return;
    }
    if (data.user?.email_confirmed_at) {
      nav("/app", { replace: true });
    } else {
      toast.message("Ainda não confirmamos seu email.", {
        description: "Confira sua caixa de entrada e clique no link.",
      });
    }
  };

  const resend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin + "/auth/callback" },
    });
    setResending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Novo link enviado para o seu email.");
    setCooldown(60);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    nav("/login", { replace: true });
  };

  return (
    <AuthShell
      pageTitle="Confirme seu email · Tropa Científica"
      metaDescription="Confirme seu email para acessar a plataforma Tropa Científica."
      title="Confirme seu email"
      subtitle={
        email
          ? `Enviamos um link de confirmação para ${email}.`
          : "Enviamos um link de confirmação para o seu email."
      }
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-md border border-border bg-muted/20 p-4">
          <MailCheck className="text-primary shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-muted-foreground">
            Para proteger sua conta, precisamos verificar seu email antes de liberar o acesso à
            plataforma. Abra o link recebido para ativar sua conta.
          </p>
        </div>

        <Button onClick={recheck} disabled={checking} className="w-full auth-btn-primary h-11">
          {checking ? <Loader2 className="animate-spin" size={18} /> : (
            <span className="inline-flex items-center gap-2"><RefreshCw size={16} /> Já confirmei — verificar</span>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={resend}
          disabled={resending || cooldown > 0 || !email}
          className="w-full h-11 bg-transparent border-border hover:bg-muted/40 text-foreground"
        >
          {resending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : cooldown > 0 ? (
            `Reenviar em ${cooldown}s`
          ) : (
            "Reenviar link de confirmação"
          )}
        </Button>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <button onClick={signOut} className="hover:text-foreground underline underline-offset-4">
            Sair e usar outro email
          </button>
          <Link to="/" className="hover:text-foreground underline underline-offset-4">
            Voltar ao site
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

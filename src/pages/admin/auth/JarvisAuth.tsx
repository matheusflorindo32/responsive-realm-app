import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isJarvisSupabaseConfigured, jarvisSupabase } from "@/integrations/supabase/jarvis-client";

declare global { interface Window { turnstile?: { render: (container: HTMLElement, options: Record<string, unknown>) => string; remove: (widgetId?: string) => void; }; } }
const turnstileSiteKey = import.meta.env.VITE_JARVIS_TURNSTILE_SITE_KEY?.trim();

export default function JarvisAuth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const handleCaptchaError = useCallback(() => setError("A verificação de segurança não carregou. Atualize a página e tente novamente."), []);

  useEffect(() => {
    if (!jarvisSupabase) return;
    jarvisSupabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.email_confirmed_at) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!jarvisSupabase) return;
    if (turnstileSiteKey && !captchaToken) {
      setError("Conclua a verificação de segurança antes de continuar.");
      return;
    }
    if (password.length < 12) {
      setError("Use uma senha com pelo menos 12 caracteres.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await jarvisSupabase.auth.signUp({
          email: email.trim(), password,
          options: { data: { full_name: fullName.trim() }, emailRedirectTo: window.location.origin + "/admin/auth", captchaToken: captchaToken ?? undefined },
        });
        if (signUpError) throw signUpError;
        if (data.session) navigate("/admin/access-pending", { replace: true });
        else { setMessage("Conta criada. Confirme o e-mail e volte para entrar. A liberação administrativa será feita depois da confirmação."); setMode("login"); }
        return;
      }
      const { data, error: signInError } = await jarvisSupabase.auth.signInWithPassword({ email: email.trim(), password, options: { captchaToken: captchaToken ?? undefined } });
      if (signInError) throw signInError;
      if (!data.user.email_confirmed_at) { setMessage("Confirme o endereço de e-mail antes de acessar o Command Center."); return; }
      navigate(params.get("next") || "/admin", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível concluir a autenticação.");
      setCaptchaToken(null);
    } finally { setLoading(false); }
  };

  if (!isJarvisSupabaseConfigured) return <AuthShell pageTitle="Configurar JARVIS" title="Conexão do JARVIS pendente" subtitle="O Command Center está preparado, mas as variáveis públicas do novo Supabase ainda não foram configuradas no ambiente."><div className="space-y-3 text-sm text-muted-foreground"><p>Configure <code>VITE_JARVIS_SUPABASE_URL</code> e <code>VITE_JARVIS_SUPABASE_PUBLISHABLE_KEY</code> no provedor de deploy.</p><p>Nunca use uma chave <code>service_role</code> no navegador.</p></div></AuthShell>;

  return <AuthShell pageTitle="Acesso JARVIS" title={mode === "login" ? "Entrar no Command Center" : "Criar acesso JARVIS"} subtitle="Autenticação independente do ambiente de ensino do Lovable." footer={<button type="button" className="text-primary hover:underline" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setMessage(null); setCaptchaToken(null); }}>{mode === "login" ? "Criar a primeira conta" : "Já tenho uma conta"}</button>}>
    <form onSubmit={submit} className="space-y-4" noValidate>
      {mode === "signup" && <div className="space-y-1.5"><Label htmlFor="jarvis-name">Nome</Label><Input id="jarvis-name" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required /></div>}
      <div className="space-y-1.5"><Label htmlFor="jarvis-email">E-mail</Label><Input id="jarvis-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
      <div className="space-y-1.5"><Label htmlFor="jarvis-password">Senha</Label><div className="relative"><Input id="jarvis-password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} className="pr-10" required /><button type="button" className="absolute inset-y-0 right-2 grid place-items-center text-muted-foreground" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>{mode === "signup" && <p className="text-xs text-muted-foreground">Mínimo de 12 caracteres.</p>}</div>
      {turnstileSiteKey && <TurnstileChallenge siteKey={turnstileSiteKey} onToken={setCaptchaToken} onError={handleCaptchaError} />}
      {error && <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
      {message && <div role="status" className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm">{message}</div>}
      <Button type="submit" disabled={loading || Boolean(turnstileSiteKey && !captchaToken)} className="h-11 w-full">{loading ? <Loader2 className="animate-spin" size={18} /> : mode === "login" ? "Entrar" : "Criar conta"}</Button>
      <p className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground"><ShieldCheck size={12} className="text-primary" />Acesso administrativo exigirá TOTP e sessão AAL2</p>
    </form>
  </AuthShell>;
}

function TurnstileChallenge({ siteKey, onToken, onError }: { siteKey: string; onToken: (token: string | null) => void; onError: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  useEffect(() => {
    let attempts = 0;
    const render = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return Boolean(window.turnstile);
      widgetIdRef.current = window.turnstile.render(containerRef.current, { sitekey: siteKey, theme: "light", size: "flexible", callback: (token: string) => onToken(token), "expired-callback": () => onToken(null), "error-callback": () => { onToken(null); onError(); } });
      return true;
    };
    if (render()) return () => { if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current); };
    const interval = window.setInterval(() => { attempts += 1; if (render() || attempts >= 20) { window.clearInterval(interval); if (attempts >= 20 && !window.turnstile) onError(); } }, 250);
    return () => { window.clearInterval(interval); if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current); };
  }, [onError, onToken, siteKey]);
  return <div className="rounded-lg border border-border/70 bg-muted/30 p-2"><div ref={containerRef} aria-label="Verificação anti-bot" /></div>;
}
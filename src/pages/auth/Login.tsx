import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/auth/schemas";
import { destinationForRole, sanitizeNext, stashNext } from "@/lib/auth/redirects";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const RL_KEY = "tropa:auth-rl";
const MAX_TRIES = 5;
const WINDOW_MS = 5 * 60 * 1000;

function checkRateLimit(email: string): { ok: boolean; wait: number } {
  try {
    const raw = localStorage.getItem(RL_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    const now = Date.now();
    const arr = (map[email] || []).filter((t) => now - t < WINDOW_MS);
    if (arr.length >= MAX_TRIES) {
      const wait = Math.ceil((WINDOW_MS - (now - arr[0])) / 1000);
      return { ok: false, wait };
    }
    return { ok: true, wait: 0 };
  } catch {
    return { ok: true, wait: 0 };
  }
}
function bumpRateLimit(email: string) {
  try {
    const raw = localStorage.getItem(RL_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    const now = Date.now();
    const arr = (map[email] || []).filter((t) => now - t < WINDOW_MS);
    arr.push(now);
    map[email] = arr;
    localStorage.setItem(RL_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export default function Login() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = sanitizeNext(params.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"email" | "password" | "form", string>>>({});

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      if (!data.session.user.email_confirmed_at) {
        nav("/verify-email", { replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      const role: "admin" | "user" = roles?.some((r) => r.role === "admin") ? "admin" : "user";
      nav(destinationForRole(role, next), { replace: true });
    });
  }, [nav, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors({ email: fe.email?.[0], password: fe.password?.[0] });
      return;
    }
    const rl = checkRateLimit(email);
    if (!rl.ok) {
      setErrors({ form: `Muitas tentativas. Aguarde ${rl.wait}s.` });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        bumpRateLimit(email);
        setErrors({ form: "Email ou senha incorretos." });
        return;
      }
      if (!data.user?.email_confirmed_at) {
        nav("/verify-email", { replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user!.id);
      const role: "admin" | "user" = roles?.some((r) => r.role === "admin") ? "admin" : "user";

      if (role === "admin") {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        const factors = await supabase.auth.mfa.listFactors();
        const totp = factors.data?.totp?.find((f) => f.status === "verified");
        if (!totp) {
          nav("/mfa/setup?next=" + encodeURIComponent(next || "/admin"), { replace: true });
          return;
        }
        if (aal?.currentLevel !== "aal2") {
          nav("/mfa/verify?next=" + encodeURIComponent(next || "/admin"), { replace: true });
          return;
        }
      }
      nav(destinationForRole(role, next), { replace: true });
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setGoogleLoading(true);
    stashNext(next);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth/callback",
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      nav("/auth/callback", { replace: true });
    } catch (err) {
      toast.error((err as Error).message);
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      pageTitle="Entrar · Tropa Científica"
      metaDescription="Acesso seguro à plataforma Tropa Científica."
      title="Entrar na plataforma"
      subtitle="Acesse cursos, trilhas e certificados."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link to={`/cadastro${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-primary hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Esqueci minha senha
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pr-10"
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute inset-y-0 right-2 grid place-items-center text-muted-foreground hover:text-foreground"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              tabIndex={-1}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        {errors.form && (
          <div
            role="alert"
            className="text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-md px-3 py-2"
          >
            {errors.form}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full auth-btn-primary h-11">
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Entrar"}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ou</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 bg-transparent border-border hover:bg-muted/40 text-foreground"
          onClick={google}
          disabled={googleLoading || loading}
        >
          {googleLoading ? <Loader2 className="animate-spin" size={18} /> : "Continuar com Google"}
        </Button>

        <p className="pt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck size={12} className="text-primary" /> Conexão criptografada · Verificação HIBP ativa
        </p>
      </form>
    </AuthShell>
  );
}

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signupSchema } from "@/lib/auth/schemas";
import { sanitizeNext, stashNext } from "@/lib/auth/redirects";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Cadastro() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = sanitizeNext(params.get("next"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "password" | "form", string>>>({});
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = signupSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors({ name: fe.name?.[0], email: fe.email?.[0], password: fe.password?.[0] });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) {
      setErrors({ form: error.message });
      return;
    }
    setSent(true);
  };

  const google = async () => {
    stashNext(next);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth/callback",
    });
    if (result.error) toast.error(result.error.message);
  };

  if (sent) {
    return (
      <AuthShell
        pageTitle="Verifique seu email · Tropa Científica"
        title="Conta criada!"
        subtitle="Enviamos um link de confirmação para o seu email."
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Verifique sua caixa de entrada (e spam) para ativar a conta. Após a confirmação, você poderá entrar normalmente.
          </p>
          <Button asChild className="w-full auth-btn-primary h-11">
            <Link to="/login">Ir para o login</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      pageTitle="Criar conta · Tropa Científica"
      title="Criar sua conta"
      subtitle="Junte-se à Tropa Científica em segundos."
      footer={
        <>
          Já tem conta?{" "}
          <Link to={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-primary hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="auth-input" autoComplete="name" required />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" autoComplete="email" required />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pr-10"
              autoComplete="new-password"
              required
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
          <PasswordStrength value={password} />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        {errors.form && (
          <div role="alert" className="text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-md px-3 py-2">
            {errors.form}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full auth-btn-primary h-11">
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Criar conta"}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ou</span>
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full h-11 bg-transparent border-border hover:bg-muted/40 text-foreground" onClick={google}>
          Continuar com Google
        </Button>

        <p className="text-[11px] text-muted-foreground text-center pt-1">
          Ao criar sua conta você concorda com os termos de uso e política de privacidade.
        </p>
      </form>
    </AuthShell>
  );
}

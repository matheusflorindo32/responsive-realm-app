import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { resetSchema } from "@/lib/auth/schemas";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"password" | "confirm" | "form", string>>>({});

  useEffect(() => {
    // Recovery session is created via the hash on landing.
    // Ensure we have a session; otherwise the link is invalid/expired.
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) setInvalid(true);
      setReady(true);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = resetSchema.safeParse({ password, confirm });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors({ password: fe.password?.[0], confirm: fe.confirm?.[0] });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setErrors({ form: error.message });
      return;
    }
    setDone(true);
    toast.success("Senha redefinida com sucesso");
    setTimeout(() => nav("/login", { replace: true }), 1600);
  };

  return (
    <AuthShell
      pageTitle="Redefinir senha · Tropa Científica"
      title={done ? "Senha atualizada" : "Definir nova senha"}
      subtitle={done ? "Redirecionando para o login…" : "Escolha uma senha forte para sua conta."}
      footer={<Link to="/login" className="text-primary hover:underline">Voltar ao login</Link>}
    >
      {!ready ? (
        <div className="grid place-items-center py-6"><Loader2 className="animate-spin text-primary" /></div>
      ) : invalid ? (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="text-destructive">Link inválido ou expirado.</p>
          <p>Solicite um novo link de recuperação.</p>
          <Button asChild className="w-full auth-btn-primary h-11 mt-2">
            <Link to="/forgot-password">Enviar novo link</Link>
          </Button>
        </div>
      ) : done ? (
        <div className="flex items-center gap-2 text-primary"><CheckCircle2 size={18} /> Tudo pronto.</div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="password">Nova senha</Label>
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
                tabIndex={-1}
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrength value={password} />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmar senha</Label>
            <Input
              id="confirm"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="auth-input"
              autoComplete="new-password"
              required
            />
            {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
          </div>
          {errors.form && (
            <div role="alert" className="text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-md px-3 py-2">
              {errors.form}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full auth-btn-primary h-11">
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Redefinir senha"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}

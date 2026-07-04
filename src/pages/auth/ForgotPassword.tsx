import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { emailSchema } from "@/lib/auth/schemas";
import { Loader2, MailCheck } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError("Email inválido");
      return;
    }
    setLoading(true);
    // Always report success to avoid leaking account existence
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthShell
        pageTitle="Link enviado · Tropa Científica"
        title="Verifique seu email"
        subtitle="Se existir uma conta com este endereço, enviaremos um link para redefinir sua senha."
      >
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-2 text-primary">
            <MailCheck size={18} /> Solicitação processada
          </div>
          <p className="text-muted-foreground">
            O link expira em 60 minutos. Se não receber, verifique o spam ou tente novamente.
          </p>
          <Button asChild className="w-full auth-btn-primary h-11">
            <Link to="/login">Voltar ao login</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      pageTitle="Recuperar senha · Tropa Científica"
      title="Esqueci minha senha"
      subtitle="Informe seu email para receber um link seguro de redefinição."
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Voltar ao login
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            autoComplete="email"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full auth-btn-primary h-11">
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Enviar link de recuperação"}
        </Button>
      </form>
    </AuthShell>
  );
}

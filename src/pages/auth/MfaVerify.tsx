import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { sanitizeNext } from "@/lib/auth/redirects";

export default function MfaVerify() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = sanitizeNext(params.get("next")) || "/admin";
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        nav("/login?next=" + encodeURIComponent(next), { replace: true });
        return;
      }
      const list = await supabase.auth.mfa.listFactors();
      const verified = list.data?.totp?.find((f) => f.status === "verified");
      if (!verified) {
        nav("/mfa/setup?next=" + encodeURIComponent(next), { replace: true });
        return;
      }
      setFactorId(verified.id);
    })();
  }, [nav, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;
    setLoading(true);
    setError(null);
    const ch = await supabase.auth.mfa.challenge({ factorId });
    if (ch.error) {
      setError(ch.error.message);
      setLoading(false);
      return;
    }
    const v = await supabase.auth.mfa.verify({
      factorId,
      challengeId: ch.data.id,
      code: code.trim(),
    });
    setLoading(false);
    if (v.error) {
      setError("Código inválido.");
      return;
    }
    nav(next, { replace: true });
  };

  return (
    <AuthShell
      pageTitle="Verificação MFA · Tropa Científica"
      title="Confirmar acesso"
      subtitle="Informe o código de 6 dígitos do seu app autenticador."
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="code">Código MFA</Label>
          <Input
            id="code"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="auth-input text-center tracking-[0.4em] text-lg font-mono"
            required
          />
        </div>
        {error && (
          <div role="alert" className="text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <Button type="submit" disabled={loading || code.length !== 6} className="w-full auth-btn-primary h-11">
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Verificar"}
        </Button>
        <p className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck size={12} className="text-primary" /> Acesso administrativo protegido por MFA
        </p>
      </form>
    </AuthShell>
  );
}

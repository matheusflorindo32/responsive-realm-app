import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jarvisSupabase } from "@/integrations/supabase/jarvis-client";

export default function JarvisMfaVerify() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/admin";
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!jarvisSupabase) return navigate("/admin/auth", { replace: true });
      const factors = await jarvisSupabase.auth.mfa.listFactors();
      const verified = factors.data?.totp?.find((factor) => factor.status === "verified");
      if (!verified) return navigate(`/admin/mfa/setup?next=${encodeURIComponent(next)}`, { replace: true });
      setFactorId(verified.id);
    })();
  }, [navigate, next]);

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!jarvisSupabase || !factorId) return;
    setLoading(true); setError(null);
    const challenge = await jarvisSupabase.auth.mfa.challenge({ factorId });
    if (challenge.error) { setError(challenge.error.message); setLoading(false); return; }
    const result = await jarvisSupabase.auth.mfa.verify({ factorId, challengeId: challenge.data.id, code });
    setLoading(false);
    if (result.error) return setError("Código inválido.");
    navigate(next, { replace: true });
  };

  return <AuthShell pageTitle="Verificar MFA · JARVIS" title="Confirmar acesso" subtitle="Informe o código do aplicativo autenticador."><form onSubmit={verify} className="space-y-4"><div className="space-y-1.5"><Label htmlFor="jarvis-verify-code">Código MFA</Label><Input id="jarvis-verify-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoFocus value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="text-center font-mono text-lg tracking-[0.35em]" required /></div>{error && <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}<Button type="submit" disabled={loading || code.length !== 6} className="w-full">{loading ? <Loader2 className="animate-spin" size={18} /> : "Verificar"}</Button><p className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground"><ShieldCheck size={12} className="text-primary" />Sessão administrativa AAL2</p></form></AuthShell>;
}

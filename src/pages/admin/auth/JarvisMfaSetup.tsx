import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jarvisSupabase } from "@/integrations/supabase/jarvis-client";

export default function JarvisMfaSetup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/admin";
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!jarvisSupabase) return navigate("/admin/auth", { replace: true });
      const { data } = await jarvisSupabase.auth.getSession();
      if (!data.session) return navigate(`/admin/auth?next=${encodeURIComponent(next)}`, { replace: true });
      const factors = await jarvisSupabase.auth.mfa.listFactors();
      for (const factor of factors.data?.totp?.filter((item) => item.status !== "verified") ?? []) await jarvisSupabase.auth.mfa.unenroll({ factorId: factor.id });
      const enrolled = await jarvisSupabase.auth.mfa.enroll({ factorType: "totp", friendlyName: `JARVIS Admin ${Date.now()}` });
      if (enrolled.error) setError(enrolled.error.message);
      else { setFactorId(enrolled.data.id); setQr(enrolled.data.totp.qr_code); setSecret(enrolled.data.totp.secret); }
      setLoading(false);
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
    if (result.error) return setError("Código inválido. Tente novamente.");
    navigate(next, { replace: true });
  };

  return (
    <AuthShell pageTitle="Configurar MFA · JARVIS" title="Proteger o Command Center" subtitle="Escaneie o QR code e confirme o código do aplicativo autenticador.">
      {loading && !qr ? <div className="grid place-items-center py-8"><Loader2 className="animate-spin text-primary" /></div> : <div className="space-y-5">
        {qr && <div className="flex justify-center rounded-xl bg-white p-4"><img src={qr} alt="QR code para configurar MFA" className="h-44 w-44" /></div>}
        {secret && <div className="text-center"><p className="text-xs text-muted-foreground">Chave manual</p><code className="mt-1 block break-all text-xs">{secret}</code></div>}
        <form onSubmit={verify} className="space-y-3"><Label htmlFor="jarvis-mfa-code">Código de 6 dígitos</Label><Input id="jarvis-mfa-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="text-center font-mono text-lg tracking-[0.35em]" required />{error && <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}<Button type="submit" disabled={loading || code.length !== 6} className="w-full">{loading ? <Loader2 className="animate-spin" size={18} /> : "Ativar MFA"}</Button></form>
        <p className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground"><ShieldCheck size={12} className="text-primary" />Guarde a chave em um gerenciador seguro</p>
      </div>}
    </AuthShell>
  );
}

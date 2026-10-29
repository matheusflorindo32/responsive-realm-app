import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { sanitizeNext } from "@/lib/auth/redirects";
import { toast } from "sonner";
import { needsExistingMfa, pendingTotpFactors } from "@/lib/auth/mfa-setup";

export default function MfaSetup() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = sanitizeNext(params.get("next")) || "/admin";
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [existingMfa, setExistingMfa] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user.user) {
        nav("/login?next=" + encodeURIComponent(next), { replace: true });
        return;
      }
      const list = await supabase.auth.mfa.listFactors();
      if (list.error) throw list.error;
      const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError) throw assuranceError;
      const factors = list.data?.all ?? [];
      if (needsExistingMfa(factors, assurance?.currentLevel ?? null)) {
        setExistingMfa(true);
        return;
      }
      const unverified = pendingTotpFactors(factors);
      for (const f of unverified) {
        const removed = await supabase.auth.mfa.unenroll({ factorId: f.id });
        if (removed.error) throw removed.error;
      }
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Tropa Admin " + Date.now(),
      });
      if (error) {
        setError(error.message);
      } else if (data) {
        setFactorId(data.id);
        setQr(data.totp.qr_code);
        setSecret(data.totp.secret);
      }
      } catch {
        setError("Não foi possível configurar o autenticador. Tente novamente mais tarde.");
      } finally {
        setEnrolling(false);
      }
    })();
  }, [nav, next]);

  const verify = async (e: React.FormEvent) => {
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
      setError("Código inválido. Tente novamente.");
      return;
    }
    toast.success("MFA ativado com sucesso");
    nav(next, { replace: true });
  };

  return (
    <AuthShell
      pageTitle="Configurar MFA · Tropa Científica"
      title="Ativar autenticação em dois fatores"
      subtitle="Requisito de segurança para acesso administrativo."
    >
      {enrolling ? (
        <div className="grid place-items-center py-8"><Loader2 className="animate-spin text-primary" /></div>
      ) : existingMfa ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Sua conta já tem um autenticador cadastrado. Por segurança, confirme o código atual antes de cadastrar outro.</p>
          <Button className="w-full auth-btn-primary" onClick={() => nav("/mfa/verify?next=" + encodeURIComponent("/mfa/setup?next=" + encodeURIComponent(next)))}>
            <ShieldCheck size={18} /> Confirmar autenticador atual
          </Button>
          <p className="text-sm text-muted-foreground">Perdeu o acesso ao autenticador? É necessário recuperar o acesso com verificação de identidade; entrar pelo Google não remove essa proteção.</p>
        </div>
      ) : (
        <div className="space-y-5">
          <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
            <li>Abra um app autenticador (Google Authenticator, 1Password, Authy).</li>
            <li>Escaneie o QR code abaixo ou insira a chave manualmente.</li>
            <li>Informe o código de 6 dígitos gerado pelo app.</li>
          </ol>

          {qr && (
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-background">
              <img src={qr} alt="QR Code MFA" className="h-40 w-40" />
            </div>
          )}
          {secret && (
            <div className="text-center">
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Chave manual</p>
              <code className="text-xs font-mono break-all text-foreground/90">{secret}</code>
            </div>
          )}

          <form onSubmit={verify} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="code">Código do app</Label>
              <Input
                id="code"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                autoComplete="one-time-code"
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
            <Button type="submit" disabled={loading || !factorId || code.length !== 6} className="w-full auth-btn-primary h-11">
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Ativar MFA"}
            </Button>
          </form>
          <p className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck size={12} className="text-primary" /> Guarde a chave manual em local seguro.
          </p>
        </div>
      )}
    </AuthShell>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Parâmetro authorization_id ausente.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: detailsError } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) {
        setError(detailsError.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error: decisionError } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (decisionError) {
      setBusy(false);
      setError(decisionError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("O servidor de autorização não retornou um redirecionamento.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "o aplicativo";

  return (
    <AuthShell
      pageTitle="Autorizar acesso · Tropa Científica"
      metaDescription="Autorize um aplicativo externo a acessar sua conta na Tropa Científica."
      title="Autorizar acesso"
      subtitle="Conexão segura com aplicativos de IA e integrações."
    >
      {error ? (
        <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Não foi possível carregar esta autorização: {error}
        </div>
      ) : !details ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="animate-spin" size={16} /> Carregando solicitação…
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-sm">
              <span className="font-semibold text-foreground">{clientName}</span> quer acessar sua conta da Tropa
              Científica e agir como você.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              <li>• Consultar cursos, módulos e aulas disponíveis para você</li>
              <li>• Ler seu progresso e seus certificados</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Button className="flex-1 auth-btn-primary h-11" disabled={busy} onClick={() => decide(true)}>
              {busy ? <Loader2 className="animate-spin" size={18} /> : "Autorizar"}
            </Button>
            <Button variant="outline" className="flex-1 h-11" disabled={busy} onClick={() => decide(false)}>
              Recusar
            </Button>
          </div>
          <p className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck size={12} className="text-primary" /> Você pode revogar esse acesso a qualquer momento
          </p>
        </div>
      )}
    </AuthShell>
  );
}

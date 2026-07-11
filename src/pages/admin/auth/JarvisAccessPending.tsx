import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock3, LogOut, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { jarvisSupabase } from "@/integrations/supabase/jarvis-client";

export default function JarvisAccessPending() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => { jarvisSupabase?.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null)); }, []);

  const signOut = async () => {
    await jarvisSupabase?.auth.signOut();
    navigate("/admin/auth", { replace: true });
  };

  return (
    <AuthShell pageTitle="Acesso pendente · JARVIS" title="Conta criada com segurança" subtitle="A conta existe, mas ainda não recebeu o papel administrativo.">
      <div className="space-y-5 text-sm">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950"><p className="flex items-center gap-2 font-medium"><Clock3 className="h-4 w-4" />Aguardando promoção manual</p><p className="mt-2 text-amber-950/80">{email ? `Conta: ${email}. ` : ""}Nenhum usuário se torna administrador automaticamente.</p></div>
        <p className="flex items-start gap-2 text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Depois da promoção, o sistema solicitará a configuração do autenticador TOTP antes de liberar o painel.</p>
        <Button variant="outline" className="w-full" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sair</Button>
      </div>
    </AuthShell>
  );
}

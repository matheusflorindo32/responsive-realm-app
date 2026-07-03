import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminAuth() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated AND has admin role
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      if (roles?.some((r) => r.role === "admin")) {
        nav("/admin/sync", { replace: true });
      }
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      nav("/admin/sync");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/admin",
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      nav("/admin/sync");
    } catch (err) {
      toast.error((err as Error).message);
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin · Acesso</title></Helmet>
      <main className="min-h-screen grid place-items-center px-4 bg-background">
        <div className="w-full max-w-sm space-y-5 t-card p-8">
          <div>
            <h1 className="text-2xl font-semibold">Acesso administrativo</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Apenas contas com papel <strong>admin</strong> podem entrar aqui.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={google}
            disabled={googleLoading || loading}
          >
            {googleLoading ? "Redirecionando…" : "Continuar com Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">ou email e senha</span>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw">Senha</Label>
              <Input id="pw" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading || googleLoading} className="w-full">
              {loading ? "..." : "Entrar"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            Não tem acesso? Solicite ao administrador do projeto.
          </p>
        </div>
      </main>
    </>
  );
}

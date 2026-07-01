import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminAuth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/admin/sync", { replace: true });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin/sync` },
        });
        if (error) throw error;
        toast.success("Conta criada. Você é o admin.");
        nav("/admin/sync");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav("/admin/sync");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Admin · Sincronização</title></Helmet>
      <main className="min-h-screen grid place-items-center px-4">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5 t-card p-8">
          <h1 className="text-2xl font-semibold">
            {mode === "signup" ? "Criar conta admin" : "Entrar"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Acesso ao painel de sincronização com Google Sheets.
          </p>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw">Senha</Label>
            <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "..." : mode === "signup" ? "Criar conta" : "Entrar"}
          </Button>
          <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="w-full text-xs text-muted-foreground hover:text-foreground">
            {mode === "signup" ? "Já tenho conta" : "Criar primeira conta admin"}
          </button>
        </form>
      </main>
    </>
  );
}

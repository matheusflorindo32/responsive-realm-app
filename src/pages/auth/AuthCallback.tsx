import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { destinationForRole, popNext } from "@/lib/auth/redirects";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;
    let decided = false;
    const waitForSession = async () => {
      // Poll up to ~6s for the session to be hydrated after OAuth redirect.
      for (let i = 0; i < 30; i++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) return data.session;
        await new Promise((r) => setTimeout(r, 200));
        if (cancelled) return null;
      }
      return null;
    };
    const decide = async () => {
      if (decided) return;
      decided = true;
      const session = await waitForSession();
      if (cancelled) return;
      if (!session) {
        nav("/login?erro=sessao", { replace: true });
        return;
      }
      const data = { session };
      if (!data.session.user.email_confirmed_at) {
        nav("/verify-email", { replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      const role: "admin" | "user" = roles?.some((r) => r.role === "admin") ? "admin" : "user";
      const next = popNext();

      if (role === "admin") {
        const factors = await supabase.auth.mfa.listFactors();
        const verified = factors.data?.totp?.find((f) => f.status === "verified");
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (!verified) {
          nav("/mfa/setup?next=" + encodeURIComponent(next || "/admin"), { replace: true });
          return;
        }
        if (aal?.currentLevel !== "aal2") {
          nav("/mfa/verify?next=" + encodeURIComponent(next || "/admin"), { replace: true });
          return;
        }
      }
      if (!cancelled) nav(destinationForRole(role, next), { replace: true });
    };
    void decide();
    return () => {
      cancelled = true;
    };
  }, [nav]);

  return (
    <div className="theme-auth min-h-screen grid place-items-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="animate-spin text-primary" size={28} />
        <p className="text-sm">Autenticando…</p>
      </div>
    </div>
  );
}

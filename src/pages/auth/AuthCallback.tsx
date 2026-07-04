import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { destinationForRole, popNext } from "@/lib/auth/redirects";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const decide = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        nav("/login", { replace: true });
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
    // Give supabase-js a tick to hydrate the session from URL hash
    const t = setTimeout(decide, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
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

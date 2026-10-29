import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isJarvisSupabaseConfigured, jarvisSupabase } from "@/integrations/supabase/jarvis-client";

export function useAdminGuard() {
  const nav = useNavigate();
  const loc = useLocation();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const useJarvis = isJarvisSupabaseConfigured && !!jarvisSupabase;
      // Fall back to the main Tropa Científica backend when JARVIS isn't configured.
      const client = (useJarvis ? jarvisSupabase! : supabase) as typeof supabase;
      const loginPath = useJarvis ? "/admin/auth" : "/login";
      const mfaBase = useJarvis ? "/admin/mfa" : "/mfa";
      const nextParam = encodeURIComponent(loc.pathname + loc.search);
      const { data, error: userError } = await client.auth.getUser();
      if (userError || !data.user) {
        nav(loginPath + "?next=" + nextParam, { replace: true });
        return;
      }
      if (!data.user.email_confirmed_at) {
        nav(useJarvis ? "/admin/auth?verify=1" : "/verify-email?next=" + nextParam, { replace: true });
        return;
      }
      const { data: roles, error: roleError } = await (client as any)
        .from(useJarvis ? "jarvis_user_roles" : "user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      const admin = !roleError && !!roles?.some((r: { role: string }) => r.role === "admin");
      if (!admin) {
        nav(useJarvis ? "/admin/access-pending" : "/app", { replace: true });
        return;
      }
      // MFA enforcement for admins
      const factors = await client.auth.mfa.listFactors();
      const verified = factors.data?.totp?.find((f) => f.status === "verified");
      const { data: aal } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
      if (!verified) {
        nav(mfaBase + "/setup?next=" + nextParam, { replace: true });
        return;
      }
      if (aal?.currentLevel !== "aal2") {
        nav(mfaBase + "/verify?next=" + nextParam, { replace: true });
        return;
      }
      setIsAdmin(true);
      setReady(true);
    })();
  }, [nav, loc.pathname, loc.search]);

  return { ready, isAdmin };
}

export function useAuthGuard() {
  const nav = useNavigate();
  const loc = useLocation();
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        nav("/login?next=" + encodeURIComponent(loc.pathname + loc.search), { replace: true });
        return;
      }
      if (!data.user.email_confirmed_at) {
        nav("/verify-email?next=" + encodeURIComponent(loc.pathname + loc.search), { replace: true });
        return;
      }
      setUserId(data.user.id);
      setReady(true);
    })();
  }, [nav, loc.pathname, loc.search]);

  return { ready, userId };
}

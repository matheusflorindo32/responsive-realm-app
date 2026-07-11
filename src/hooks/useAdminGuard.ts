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
      if (!isJarvisSupabaseConfigured || !jarvisSupabase) {
        nav("/admin/auth?configuration=missing", { replace: true });
        return;
      }
      const client = jarvisSupabase;
      const { data, error: userError } = await client.auth.getUser();
      if (userError) {
        nav("/admin/auth?session=invalid", { replace: true });
        return;
      }
      if (!data.user) {
        nav("/admin/auth?next=" + encodeURIComponent(loc.pathname + loc.search), { replace: true });
        return;
      }
      if (!data.user.email_confirmed_at) {
        nav("/admin/auth?verify=1", { replace: true });
        return;
      }
      const { data: roles, error: roleError } = await client
        .from("jarvis_user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      if (roleError) {
        nav("/admin/access-pending?reason=role-check", { replace: true });
        return;
      }
      const admin = !!roles?.some((r) => r.role === "admin");
      if (!admin) {
        nav("/admin/access-pending", { replace: true });
        return;
      }
      // MFA enforcement for admins
      const factors = await client.auth.mfa.listFactors();
      const verified = factors.data?.totp?.find((f) => f.status === "verified");
      const { data: aal } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
      const nextParam = encodeURIComponent(loc.pathname + loc.search);
      if (!verified) {
        nav("/admin/mfa/setup?next=" + nextParam, { replace: true });
        return;
      }
      if (aal?.currentLevel !== "aal2") {
        nav("/admin/mfa/verify?next=" + nextParam, { replace: true });
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

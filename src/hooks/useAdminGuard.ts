import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useAdminGuard() {
  const nav = useNavigate();
  const loc = useLocation();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      if (!admin) {
        nav("/app", { replace: true });
        return;
      }
      // MFA enforcement for admins
      const factors = await supabase.auth.mfa.listFactors();
      const verified = factors.data?.totp?.find((f) => f.status === "verified");
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const nextParam = encodeURIComponent(loc.pathname + loc.search);
      if (!verified) {
        nav("/mfa/setup?next=" + nextParam, { replace: true });
        return;
      }
      if (aal?.currentLevel !== "aal2") {
        nav("/mfa/verify?next=" + nextParam, { replace: true });
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

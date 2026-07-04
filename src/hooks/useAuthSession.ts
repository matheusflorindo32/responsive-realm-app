import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type AuthRole = "admin" | "user" | null;

export interface AuthSessionState {
  loading: boolean;
  session: Session | null;
  userId: string | null;
  email: string | null;
  role: AuthRole;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

/**
 * Reactive auth session. Subscribes to onAuthStateChange and resolves
 * the current user's role from public.user_roles.
 */
export function useAuthSession(): AuthSessionState {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AuthRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Register listener FIRST (synchronous callback)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
      if (!s) setRole(null);
      // defer role fetch to avoid deadlocks
      if (s?.user) {
        setTimeout(() => {
          void loadRole(s.user.id).then((r) => mounted && setRole(r));
        }, 0);
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        void loadRole(data.session.user.id).then((r) => {
          if (mounted) {
            setRole(r);
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    loading,
    session,
    userId: session?.user?.id ?? null,
    email: session?.user?.email ?? null,
    role,
    isAdmin: role === "admin",
    isAuthenticated: !!session,
  };
}

async function loadRole(userId: string): Promise<AuthRole> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (data?.some((r) => r.role === "admin")) return "admin";
  if (data && data.length > 0) return "user";
  return "user";
}

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_JARVIS_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_JARVIS_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isJarvisSupabaseConfigured = Boolean(url && publishableKey);

export const jarvisSupabase = isJarvisSupabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        storage: localStorage,
        storageKey: "jarvis-command-center-auth",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

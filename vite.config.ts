import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

// Public (non-secret) Lovable Cloud identifiers. Used only when the build
// environment has no .env (e.g. the publish build after .env was untracked),
// so the live site never ships without a backend URL.
const PUBLIC_BACKEND_FALLBACK = {
  VITE_SUPABASE_PROJECT_ID: "dptdoprxjusyeirmygbb",
  VITE_SUPABASE_URL: "https://dptdoprxjusyeirmygbb.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwdGRvcHJ4anVzeWVpcm15Z2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5Mjc5ODgsImV4cCI6MjA5ODUwMzk4OH0.o84F73LprbFbjX5IllTBUw35k7e1T_PW_Z_rkMBlaR0",
} as const;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env };
  const define: Record<string, string> = {};
  for (const [key, fallback] of Object.entries(PUBLIC_BACKEND_FALLBACK)) {
    const value = env[key]?.trim();
    if (!value) define[`import.meta.env.${key}`] = JSON.stringify(fallback);
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    define,
    plugins: [react(), mcpPlugin(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

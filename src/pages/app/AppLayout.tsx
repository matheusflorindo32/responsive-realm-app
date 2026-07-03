import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthGuard } from "@/hooks/useAdminGuard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function AppLayout() {
  const { ready } = useAuthGuard();
  const nav = useNavigate();
  if (!ready) return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-6">
            <span className="font-semibold">Minha área</span>
            <nav className="flex gap-4 text-sm">
              <NavLink to="/app" end className={({ isActive }) => (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>Meus cursos</NavLink>
              <NavLink to="/app/certificados" className={({ isActive }) => (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>Certificados</NavLink>
              <NavLink to="/app/perfil" className={({ isActive }) => (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>Perfil</NavLink>
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={async () => { await supabase.auth.signOut(); nav("/entrar"); }}>Sair</Button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8"><Outlet /></main>
    </div>
  );
}

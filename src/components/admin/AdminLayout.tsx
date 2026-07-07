import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Home } from "lucide-react";

const nav = [
  { to: "/admin/ensino", label: "Ensino", end: true },
  { to: "/admin/ensino/trilhas", label: "Trilhas" },
  { to: "/admin/ensino/cursos", label: "Cursos" },
  { to: "/admin/ensino/matriculas", label: "Matrículas" },
  { to: "/admin/ensino/certificados", label: "Certificados" },
  { to: "/admin/ensino/auditoria", label: "Auditoria" },
  { to: "/admin/sync", label: "Sync" },
];

export default function AdminLayout() {
  const { ready } = useAdminGuard();
  const navigate = useNavigate();
  const location = useLocation();
  const isHub = location.pathname === "/admin/ensino" || location.pathname === "/admin";
  if (!ready) return <div className="min-h-screen grid place-items-center text-muted-foreground">Verificando…</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              disabled={isHub}
              aria-label="Voltar"
              title="Voltar"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/ensino")}
              aria-label="Hub do admin"
              title="Hub do admin"
            >
              <Home className="h-4 w-4" />
            </Button>
            <span className="font-semibold tracking-tight hidden sm:inline">Admin · Tropa Científica</span>
            <nav className="flex gap-4 text-sm ml-4 overflow-x-auto">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `hover:text-foreground transition-colors whitespace-nowrap ${isActive ? "text-foreground" : "text-muted-foreground"}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
          >
            Sair
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

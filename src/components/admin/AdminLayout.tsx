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
  if (!ready) return <div className="min-h-screen grid place-items-center text-muted-foreground">Verificando…</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-6">
            <span className="font-semibold tracking-tight">Admin · Tropa Científica</span>
            <nav className="flex gap-4 text-sm">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `hover:text-foreground transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`
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

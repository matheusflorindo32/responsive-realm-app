import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  DatabaseZap,
  FileSearch,
  FolderKanban,
  GraduationCap,
  Home,
  Inbox,
  LogOut,
  Megaphone,
  Menu,
  MonitorCog,
  PlayCircle,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { jarvisSupabase } from "@/integrations/supabase/jarvis-client";

type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "Comando",
    items: [
      { to: "/admin/hoje", label: "Hoje", icon: Home, end: true },
      { to: "/admin/iniciar", label: "Iniciar", icon: PlayCircle },
      { to: "/admin/inbox", label: "Caixa de entrada", icon: Inbox },
      { to: "/admin/agenda", label: "Agenda", icon: CalendarDays },
    ],
  },
  {
    label: "Operação",
    items: [
      { to: "/admin/projetos", label: "Projetos", icon: FolderKanban },
      { to: "/admin/relacionamentos", label: "Clientes & alunos", icon: Users },
      { to: "/admin/ensino", label: "Produtos & cursos", icon: GraduationCap },
    ],
  },
  {
    label: "Conhecimento",
    items: [
      { to: "/admin/conteudo", label: "Conteúdo", icon: Megaphone },
      { to: "/admin/pesquisa", label: "Pesquisa", icon: FileSearch },
      { to: "/admin/vault", label: "Vault JARVIS", icon: BookOpen },
    ],
  },
  {
    label: "Tecnologia",
    items: [
      { to: "/admin/agentes", label: "Agentes", icon: Bot },
      { to: "/admin/skills", label: "Skills", icon: BookOpen },
      { to: "/admin/sistemas", label: "Sites & sistemas", icon: MonitorCog },
      { to: "/admin/sync", label: "Integrações & sync", icon: DatabaseZap },
    ],
  },
  {
    label: "Gestão",
    items: [
      { to: "/admin/metricas", label: "Métricas", icon: BarChart3 },
      { to: "/admin/riscos", label: "Riscos & auditoria", icon: ShieldAlert },
      { to: "/admin/ensino/auditoria", label: "Auditoria de ensino", icon: BookOpen },
    ],
  },
];

function Navigation() {
  return (
    <nav className="space-y-5" aria-label="Navegação administrativa">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{group.label}</p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { ready } = useAdminGuard();
  const navigate = useNavigate();
  const location = useLocation();
  const currentItem = navGroups.flatMap((group) => group.items).find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = Boolean(target?.closest("input, textarea, [contenteditable='true']"));
      if (!isTyping && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        navigate("/admin/iniciar");
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [navigate]);

  if (!ready) {
    return <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">Verificando acesso seguro…</div>;
  }

  const signOut = async () => {
    await jarvisSupabase?.auth.signOut();
    navigate("/admin/auth");
  };

  return (
    <div className="theme-tropa min-h-screen bg-background text-foreground lg:flex">
      <a href="#conteudo-principal" className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4">Pular para o conteúdo</a>
      <aside className="hidden h-screen w-72 shrink-0 border-r border-border/70 bg-card/85 p-5 backdrop-blur lg:sticky lg:top-0 lg:flex lg:flex-col">
        <button type="button" onClick={() => navigate("/admin/hoje")} className="mb-7 flex items-center gap-3 rounded-xl text-left">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><DatabaseZap className="h-5 w-5" /></div>
          <div>
            <p className="font-semibold tracking-tight">JARVIS OS</p>
            <p className="text-xs text-muted-foreground">Command Center</p>
          </div>
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1"><Navigation /></div>
        <div className="mt-5 border-t border-border/70 pt-4">
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/")}><Home className="mr-3 h-4 w-4" />Site público</Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={signOut}><LogOut className="mr-3 h-4 w-4" />Sair</Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir navegação"><Menu className="h-4 w-4" /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] overflow-y-auto">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><DatabaseZap className="h-4 w-4" /></div>
                    <div><p className="font-semibold">JARVIS OS</p><p className="text-xs text-muted-foreground">Command Center</p></div>
                  </div>
                  <Navigation />
                </SheetContent>
              </Sheet>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{currentItem?.label ?? "Admin"}</p>
                <p className="hidden text-xs text-muted-foreground sm:block">Tropa Científica · ambiente privado</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => navigate("/admin/iniciar")}><PlayCircle className="mr-2 h-4 w-4" /><span className="hidden sm:inline">Iniciar</span></Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}><Home className="mr-2 h-4 w-4" /><span className="hidden sm:inline">Site</span></Button>
              <Button variant="outline" size="sm" onClick={signOut}><LogOut className="mr-2 h-4 w-4" /><span className="hidden sm:inline">Sair</span></Button>
            </div>
          </div>
        </header>

        <main id="conteudo-principal" tabIndex={-1} className="mx-auto w-full max-w-[1600px] px-4 py-6 outline-none md:px-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

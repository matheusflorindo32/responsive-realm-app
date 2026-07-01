import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CLIENT_CONFIG } from "@/config/client";
import { Menu, X, ArrowLeft } from "lucide-react";

const nav = [
  { to: "/matheus", label: "Início" },
  { to: "/matheus/sobre", label: "Sobre" },
  { to: "/matheus/publicacoes", label: "Publicações" },
  { to: "/matheus/formacao", label: "Formação" },
  { to: "/matheus/projetos", label: "Projetos" },
  { to: "/matheus/experiencia", label: "Experiência" },
  { to: "/matheus/contato", label: "Contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/70" : "bg-background/0",
      )}
    >
      <div className="container-wide flex items-center justify-between h-16">
        <Link to="/matheus" className="flex items-center gap-2.5 group">
          <span className="grid place-items-center h-8 w-8 rounded-sm bg-primary text-primary-foreground font-display font-semibold text-sm">
            MF
          </span>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-primary tracking-tight">
              {CLIENT_CONFIG.shortName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mono">
              APOS · v2
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/matheus"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-[13px] font-medium rounded-md transition-colors relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {n.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-3 right-3 h-px bg-gold" />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <Link
            to="/"
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <ArrowLeft size={12} />
            Tropa Científica
          </Link>
        </nav>

        <button
          className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-border hover:bg-muted"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/70 bg-background">
          <div className="container-wide py-3 flex flex-col">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-2 py-2.5 text-sm rounded-md",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

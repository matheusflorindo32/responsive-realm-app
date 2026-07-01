import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowUpRight, Atom } from "lucide-react";

const nav = [
  { to: "/", label: "Início" },
  { to: "/conteudos", label: "Conteúdos" },
  { to: "/projetos-tropa", label: "Projetos" },
  { to: "/sobre-a-tropa", label: "Manifesto" },
];

export function TropaNavbar() {
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
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-primary/20"
          : "bg-transparent",
      )}
    >
      <div className="container-wide flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="grid place-items-center h-9 w-9 rounded-md neon-border bg-background/50">
            <Atom size={18} className="text-primary" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold tracking-[0.2em] uppercase text-foreground neon-text">
              Tropa Científica
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-primary/80 mono">
              Ciência · IA · Segurança Pública
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.15em] rounded-md transition-colors",
                  isActive
                    ? "text-primary neon-text"
                    : "text-muted-foreground hover:text-primary",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
          <Link
            to="/matheus"
            className="ml-3 inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.15em] rounded-md neon-border text-primary hover:bg-primary/10 transition-colors"
          >
            Sobre o fundador
            <ArrowUpRight size={14} />
          </Link>
        </nav>

        <button
          className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-primary/30 text-primary"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-primary/20 bg-background/95 backdrop-blur-md">
          <div className="container-wide py-3 flex flex-col">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-2 py-2.5 text-sm uppercase tracking-[0.15em] rounded-md",
                    isActive ? "text-primary font-bold" : "text-muted-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to="/matheus"
              onClick={() => setOpen(false)}
              className="mt-2 px-2 py-2.5 text-sm uppercase tracking-[0.15em] text-primary font-semibold"
            >
              Sobre o fundador →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

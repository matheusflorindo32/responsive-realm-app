import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowUpRight, LogIn, LayoutDashboard, ShieldCheck } from "lucide-react";
import iconUrl from "@/assets/tropa-icon.png";
import { useAuthSession } from "@/hooks/useAuthSession";


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
          ? "bg-white/80 backdrop-blur-xl border-b border-border/70"
          : "bg-transparent",
      )}
    >
      <div className="container-wide flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="relative grid place-items-center h-10 w-10 rounded-xl bg-white shadow-[0_4px_16px_-4px_hsl(221_83%_53%_/_0.3)] ring-1 ring-border overflow-hidden">
            <img src={iconUrl} alt="" className="h-8 w-8 object-contain" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="brand text-[13px] font-bold text-foreground">
              TROPA CIENTÍFICA
            </span>
            <span className="text-[9.5px] uppercase tracking-[0.28em] text-muted-foreground mono">
              Ciência · IA · Inovação
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
                  "px-3.5 py-2 text-[13px] font-medium rounded-md transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
          <Link
            to="/matheus"
            className="ml-3 inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded-md border border-border text-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            Sobre o fundador
            <ArrowUpRight size={14} />
          </Link>
        </nav>

        <button
          className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-border text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-white/95 backdrop-blur-xl">
          <div className="container-wide py-3 flex flex-col">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-2 py-3 text-sm rounded-md",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to="/matheus"
              onClick={() => setOpen(false)}
              className="mt-2 px-2 py-3 text-sm text-primary font-semibold"
            >
              Sobre o fundador →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

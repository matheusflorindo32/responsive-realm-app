import { Link } from "react-router-dom";
import { Youtube, Instagram, Linkedin, Github, Mail, ArrowUpRight } from "lucide-react";
import iconUrl from "@/assets/tropa-icon.png";

const socials = [
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Github, label: "GitHub", href: "https://github.com" },
];

export function TropaFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-white/60 backdrop-blur-sm">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center h-10 w-10 rounded-xl bg-white ring-1 ring-border overflow-hidden">
              <img src={iconUrl} alt="Tropa Científica" className="h-8 w-8 object-contain" />
            </span>
            <span className="brand text-[15px] font-bold text-foreground">TROPA CIENTÍFICA</span>
          </div>
          <p className="mt-5 text-sm text-muted-foreground max-w-md leading-relaxed">
            Divulgação científica com foco em Inteligência Artificial, ciência de dados,
            segurança pública e educação digital — do laboratório ao mundo real.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] mono uppercase tracking-[0.22em] text-muted-foreground mb-4">
            Navegar
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-primary">Início</Link></li>
            <li><Link to="/sobre-a-tropa" className="hover:text-primary">Manifesto</Link></li>
            <li><Link to="/conteudos" className="hover:text-primary">Conteúdos</Link></li>
            <li><Link to="/projetos-tropa" className="hover:text-primary">Projetos</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] mono uppercase tracking-[0.22em] text-muted-foreground mb-4">
            Institucional
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/matheus" className="hover:text-primary inline-flex items-center gap-1">
                Fundador <ArrowUpRight size={12} />
              </Link>
            </li>
            <li><Link to="/matheus/publicacoes" className="hover:text-primary">Publicações</Link></li>
            <li><Link to="/matheus/projetos" className="hover:text-primary">Portfólio</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[11px] mono uppercase tracking-[0.22em] text-muted-foreground mb-4">
            Contato
          </h4>
          <a
            href="mailto:contato@tropacientifica.com"
            className="inline-flex items-center gap-2 text-sm hover:text-primary"
          >
            <Mail size={14} /> contato@tropacientifica.com
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Parcerias, palestras e projetos educativos.
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-wide py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Tropa Científica. Todos os direitos reservados.</span>
          <span className="mono">Ciência · IA · Inovação</span>
        </div>
      </div>
    </footer>
  );
}

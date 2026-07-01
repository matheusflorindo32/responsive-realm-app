import { Link } from "react-router-dom";
import { CLIENT_CONFIG } from "@/config/client";
import { getLinks, getProfile } from "@/data/adapters/localMockAdapter";

export function Footer() {
  const profile = getProfile();
  const links = getLinks();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/70 mt-24">
      <div className="container-wide py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="grid place-items-center h-8 w-8 rounded-sm bg-primary text-primary-foreground font-display font-semibold text-sm">
              MF
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-primary">{CLIENT_CONFIG.name}</div>
              <div className="eyebrow">APOS · Academic Personal OS</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            {profile.primaryRole}. {profile.affiliationMain}.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-3">Navegação</div>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-muted-foreground hover:text-primary" to="/sobre">Sobre</Link></li>
            <li><Link className="text-muted-foreground hover:text-primary" to="/publicacoes">Publicações</Link></li>
            <li><Link className="text-muted-foreground hover:text-primary" to="/formacao">Formação</Link></li>
            <li><Link className="text-muted-foreground hover:text-primary" to="/projetos">Projetos</Link></li>
            <li><Link className="text-muted-foreground hover:text-primary" to="/experiencia">Experiência</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-3">Presença</div>
          <ul className="space-y-2 text-sm">
            {links.filter((l) => l.featured).slice(0, 6).map((l) => (
              <li key={l.id}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent"
                >
                  {l.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-3">Contato</div>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-muted-foreground hover:text-primary" to="/contato">Formulário</Link></li>
            <li className="mono text-xs text-muted-foreground">{CLIENT_CONFIG.publicEmail}</li>
            <li className="text-xs text-muted-foreground">{profile.cityState}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container-wide py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {year} {CLIENT_CONFIG.name}. Todos os direitos reservados.
          </p>
          <p className="text-[11px] mono text-muted-foreground/70">
            APOS v2 · dados via Google Sheets/MCP
          </p>
        </div>
      </div>
    </footer>
  );
}

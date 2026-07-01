import { Link } from "react-router-dom";
import { Atom, Github, Linkedin, Youtube } from "lucide-react";

export function TropaFooter() {
  return (
    <footer className="border-t border-primary/20 mt-24">
      <div className="container-wide py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center h-8 w-8 rounded-md neon-border">
              <Atom size={16} className="text-primary" />
            </span>
            <span className="text-sm font-bold tracking-[0.2em] uppercase neon-text">
              Tropa Científica
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Divulgação científica com foco em Inteligência Artificial, tecnologia e
            segurança pública. Um projeto de Matheus Florindo de Deus.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="https://www.linkedin.com/in/matheus-florindo-de-deus-b953b017a/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github size={18} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-[11px] mono uppercase tracking-[0.2em] text-primary mb-3">Projeto</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/conteudos" className="text-muted-foreground hover:text-primary">Conteúdos</Link></li>
            <li><Link to="/projetos-tropa" className="text-muted-foreground hover:text-primary">Projetos</Link></li>
            <li><Link to="/sobre-a-tropa" className="text-muted-foreground hover:text-primary">Manifesto</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] mono uppercase tracking-[0.2em] text-primary mb-3">Institucional</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/matheus" className="text-muted-foreground hover:text-primary">Sobre o fundador</Link></li>
            <li><Link to="/matheus/publicacoes" className="text-muted-foreground hover:text-primary">Publicações acadêmicas</Link></li>
            <li><Link to="/matheus/contato" className="text-muted-foreground hover:text-primary">Contato</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary/10">
        <div className="container-wide py-4 text-[11px] mono uppercase tracking-[0.2em] text-muted-foreground flex flex-wrap gap-2 justify-between">
          <span>© {new Date().getFullYear()} Tropa Científica</span>
          <span>Feito com ciência, código e café</span>
        </div>
      </div>
    </footer>
  );
}

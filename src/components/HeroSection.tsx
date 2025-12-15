import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  const handleScrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden circuit-pattern"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15)_0%,transparent_70%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Logo Animation */}
        <div className="mb-8 animate-fade-in">
          <img
            src={logo}
            alt="Tropa Científica"
            className="w-32 h-32 md:w-40 md:h-40 mx-auto animate-float drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
          />
        </div>

        {/* Main Heading */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
          <span className="text-foreground">TROPA</span>{" "}
          <span className="text-primary neon-text">CIENTÍFICA</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Portfólio de Projetos em Tecnologia e Ciência
        </p>
        
        <p className="font-body text-base text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Desenvolvedor apaixonado por inovação, combinando programação e pesquisa científica
          para criar soluções que fazem a diferença.
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:contato@tropacientifica.com"
            className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Button
            variant="hero"
            size="lg"
            onClick={() => handleScrollToSection("#projetos")}
          >
            Ver Projetos
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleScrollToSection("#contato")}
          >
            Entre em Contato
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => handleScrollToSection("#sobre")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary animate-bounce cursor-pointer"
        aria-label="Scroll para baixo"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default HeroSection;

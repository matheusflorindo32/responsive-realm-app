import { ChevronDown, Calendar, MapPin } from "lucide-react";
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
            alt="TechNexus Hackathon"
            className="w-32 h-32 md:w-40 md:h-40 mx-auto animate-float drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
          />
        </div>

        {/* Main Heading */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
          <span className="text-foreground">TECH</span>
          <span className="text-primary neon-text">NEXUS</span>
          <br />
          <span className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground">
            HACKATHON 2025
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          O maior evento de inovação e tecnologia do Brasil. 48 horas para criar,
          inovar e transformar ideias em realidade.
        </p>

        {/* Event Info */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-body">15-17 de Março, 2025</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-body">Centro de Convenções, São Paulo</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <Button
            variant="hero"
            size="lg"
            onClick={() => handleScrollToSection("#inscricao")}
          >
            Inscreva-se Agora
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleScrollToSection("#sobre")}
          >
            Saiba Mais
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

import { Zap, Users, Trophy, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "48 Horas",
    description: "De programação intensiva, networking e aprendizado colaborativo.",
  },
  {
    icon: Users,
    title: "+500 Participantes",
    description: "Desenvolvedores, designers e empreendedores de todo o país.",
  },
  {
    icon: Trophy,
    title: "R$ 50.000",
    description: "Em prêmios para as melhores soluções inovadoras.",
  },
  {
    icon: Lightbulb,
    title: "Mentoria",
    description: "Acesso a mentores de empresas líderes do mercado tech.",
  },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 md:py-32 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-primary neon-text">SOBRE</span>{" "}
            <span className="text-foreground">O EVENTO</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            O TechNexus Hackathon é onde mentes brilhantes se conectam para
            resolver desafios reais usando tecnologia de ponta.
          </p>
        </div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-bold text-foreground">
              Por que participar?
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              O TechNexus é mais do que um hackathon — é uma experiência
              imersiva de inovação. Durante 48 horas, você terá a oportunidade
              de trabalhar com pessoas talentosas, aprender com mentores
              experientes e transformar suas ideias em protótipos funcionais.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              Seja você um desenvolvedor experiente ou alguém que está começando
              na área de tecnologia, o TechNexus oferece um ambiente
              colaborativo onde todos podem contribuir e aprender.
            </p>
          </div>

          {/* Decorative element */}
          <div className="relative">
            <div className="glass-card rounded-2xl p-8 neon-border">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <span className="font-display text-4xl font-bold text-primary">
                    5ª
                  </span>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Edição
                  </p>
                </div>
                <div className="text-center p-4">
                  <span className="font-display text-4xl font-bold text-primary">
                    +100
                  </span>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Projetos
                  </p>
                </div>
                <div className="text-center p-4">
                  <span className="font-display text-4xl font-bold text-primary">
                    24
                  </span>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Mentores
                  </p>
                </div>
                <div className="text-center p-4">
                  <span className="font-display text-4xl font-bold text-primary">
                    15
                  </span>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Patrocinadores
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-xl p-6 text-center group hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-display text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="font-body text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

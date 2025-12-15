import { Code, FlaskConical, Brain, Rocket } from "lucide-react";

const skills = [
  {
    icon: Code,
    title: "Desenvolvimento Web",
    description: "React, TypeScript, Node.js, e outras tecnologias modernas.",
  },
  {
    icon: FlaskConical,
    title: "Pesquisa Científica",
    description: "Metodologia científica, análise de dados e publicações.",
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Python, TensorFlow, análise preditiva e IA aplicada.",
  },
  {
    icon: Rocket,
    title: "Inovação",
    description: "Transformando ideias em soluções tecnológicas reais.",
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
            <span className="text-foreground">MIM</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Conheça um pouco mais sobre minha trajetória e habilidades.
          </p>
        </div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-bold text-foreground">
              Quem sou eu?
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              Sou um desenvolvedor e pesquisador apaixonado por tecnologia e ciência.
              Minha jornada começou com curiosidade sobre como as coisas funcionam,
              e evoluiu para uma carreira dedicada a criar soluções inovadoras.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              Acredito que a combinação de conhecimento técnico em programação com
              metodologia científica rigorosa é a chave para desenvolver projetos
              que realmente fazem a diferença na vida das pessoas.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              A Tropa Científica representa minha filosofia: trabalhar em equipe,
              pensar de forma científica e executar com excelência técnica.
            </p>
          </div>

          {/* Stats */}
          <div className="relative">
            <div className="glass-card rounded-2xl p-8 neon-border">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <span className="font-display text-4xl font-bold text-primary">
                    10+
                  </span>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Projetos
                  </p>
                </div>
                <div className="text-center p-4">
                  <span className="font-display text-4xl font-bold text-primary">
                    3+
                  </span>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Anos de Experiência
                  </p>
                </div>
                <div className="text-center p-4">
                  <span className="font-display text-4xl font-bold text-primary">
                    5+
                  </span>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Tecnologias
                  </p>
                </div>
                <div className="text-center p-4">
                  <span className="font-display text-4xl font-bold text-primary">
                    2+
                  </span>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Publicações
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.title}
              className="glass-card rounded-xl p-6 text-center group hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <skill.icon className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-display text-lg font-bold text-foreground mb-2">
                {skill.title}
              </h4>
              <p className="font-body text-sm text-muted-foreground">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

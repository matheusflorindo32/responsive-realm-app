import { GraduationCap, Briefcase } from "lucide-react";

const experiences = [
  {
    type: "work",
    title: "Desenvolvedor Full Stack",
    organization: "Empresa de Tecnologia",
    period: "2023 - Presente",
    description: "Desenvolvimento de aplicações web utilizando React, Node.js e bancos de dados relacionais. Participação em projetos de inovação e mentoria de novos desenvolvedores.",
  },
  {
    type: "education",
    title: "Análise e Desenvolvimento de Sistemas",
    organization: "Instituto Federal do Espírito Santo (IFES)",
    period: "Em andamento",
    description: "Formação tecnológica em desenvolvimento de software, algoritmos, estruturas de dados e engenharia de software.",
  },
  {
    type: "work",
    title: "Estagiário de Pesquisa",
    organization: "Laboratório de Inovação",
    period: "2022 - 2023",
    description: "Desenvolvimento de modelos de machine learning para análise de dados biomédicos. Publicação de artigos em conferências nacionais.",
  },
  {
    type: "education",
    title: "Curso de Machine Learning",
    organization: "Plataforma Online",
    period: "2022",
    description: "Especialização em técnicas de aprendizado de máquina, deep learning e processamento de linguagem natural.",
  },
];

const ExperienceSection = () => {
  return (
    <section id="experiencia" className="py-20 md:py-32 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-primary neon-text">EXPERIÊNCIA</span>{" "}
            <span className="text-foreground">& FORMAÇÃO</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Minha trajetória profissional e acadêmica.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                  {exp.type === "work" ? (
                    <Briefcase className="w-6 h-6 text-primary" />
                  ) : (
                    <GraduationCap className="w-6 h-6 text-primary" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 glass-card rounded-xl p-6 ml-6 md:ml-0 ${
                    index % 2 === 0 ? "md:mr-[calc(50%+2rem)]" : "md:ml-[calc(50%+2rem)]"
                  }`}
                >
                  <span className="inline-block px-3 py-1 text-xs font-body font-medium bg-primary/20 text-primary rounded-full mb-3">
                    {exp.period}
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">
                    {exp.title}
                  </h3>
                  <p className="font-body text-sm text-primary mb-3">
                    {exp.organization}
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;

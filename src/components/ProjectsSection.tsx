import { useState } from "react";
import { ExternalLink, Github, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "Sistema de Análise de Dados",
    category: "Ciência de Dados",
    description: "Plataforma para análise e visualização de dados científicos com dashboards interativos.",
    fullDescription: "Este projeto foi desenvolvido para facilitar a análise de grandes volumes de dados científicos. Inclui funcionalidades como importação de datasets, processamento estatístico, geração de gráficos interativos e exportação de relatórios. Utilizei Python para o backend com Flask, e React para o frontend.",
    technologies: ["Python", "React", "D3.js", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: 2,
    title: "App de Gestão de Experimentos",
    category: "Desenvolvimento Web",
    description: "Aplicação web para gerenciamento de experimentos de laboratório e acompanhamento de resultados.",
    fullDescription: "Uma solução completa para laboratórios de pesquisa. Permite cadastrar experimentos, registrar observações, anexar arquivos, e gerar relatórios automáticos. O sistema também possui alertas para prazos e lembretes de tarefas pendentes.",
    technologies: ["TypeScript", "Node.js", "MongoDB", "Tailwind CSS"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: 3,
    title: "Modelo de Predição Climática",
    category: "Machine Learning",
    description: "Modelo de machine learning para previsão de padrões climáticos regionais.",
    fullDescription: "Projeto de pesquisa aplicada utilizando técnicas de machine learning para prever padrões climáticos. O modelo foi treinado com dados históricos de estações meteorológicas e apresenta uma acurácia de 87% nas previsões de curto prazo.",
    technologies: ["Python", "TensorFlow", "Pandas", "Scikit-learn"],
    github: "https://github.com",
  },
  {
    id: 4,
    title: "Plataforma de Ensino Online",
    category: "Desenvolvimento Web",
    description: "Sistema completo de e-learning com videoaulas, quizzes e certificados.",
    fullDescription: "Plataforma educacional desenvolvida para democratizar o acesso ao conhecimento científico. Inclui sistema de autenticação, player de vídeo personalizado, sistema de gamificação com badges, e geração automática de certificados PDF.",
    technologies: ["React", "Firebase", "Stripe", "Node.js"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: 5,
    title: "API de Processamento de Imagens",
    category: "Backend",
    description: "API RESTful para processamento e análise de imagens científicas.",
    fullDescription: "Uma API robusta para processamento de imagens de microscopia e outras fontes científicas. Implementa algoritmos de detecção de bordas, segmentação, contagem de células e classificação de padrões usando deep learning.",
    technologies: ["Python", "FastAPI", "OpenCV", "Docker"],
    github: "https://github.com",
  },
  {
    id: 6,
    title: "Dashboard de Métricas",
    category: "Data Visualization",
    description: "Dashboard interativo para visualização de métricas de desempenho em tempo real.",
    fullDescription: "Sistema de monitoramento em tempo real com gráficos animados, alertas configuráveis e exportação de dados. Desenvolvido para acompanhar KPIs de projetos de pesquisa e desenvolvimento.",
    technologies: ["React", "Recharts", "WebSocket", "Express"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
];

const ProjectsSection = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="projetos" className="py-20 md:py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">MEUS</span>{" "}
            <span className="text-primary neon-text">PROJETOS</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Uma seleção dos principais projetos que desenvolvi, combinando tecnologia e ciência.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Category Badge */}
              <div className="p-6 pb-0">
                <span className="inline-block px-3 py-1 text-xs font-body font-medium bg-primary/20 text-primary rounded-full">
                  {project.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {project.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>

                {/* Expanded Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedId === project.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="font-body text-sm text-muted-foreground mb-4 pt-2 border-t border-border">
                    {project.fullDescription}
                  </p>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-body bg-muted text-muted-foreground rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Ver no GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="Ver demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(project.id)}
                    className="text-primary hover:text-primary"
                  >
                    {expandedId === project.id ? (
                      <>
                        Ver menos <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Ver mais <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
